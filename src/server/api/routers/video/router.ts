import {
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  ListPartsCommand,
  PutBucketCorsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'

import { createHash } from 'crypto'
import { z } from 'zod'

const s3Client = new S3Client({
  endpoint: process.env.BACKBLAZE_ENDPOINT!,
  region: 'us-east-005',
  credentials: {
    accessKeyId: process.env.BACKBLAZE_KEY_ID!,
    secretAccessKey: process.env.BACKBLAZE_APPLICATION_KEY!,
  },
})

export const videoRouter = createTRPCRouter({
  getChunkUploadUrl: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
        chunkNumber: z.number(),
        fileType: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { filename, chunkNumber, fileType } = input

      // Create a unique key for each chunk
      const chunkKey = `uploads/${filename}.part${chunkNumber}`
      console.log('chunkKey', chunkKey)

      const command = new PutObjectCommand({
        Bucket: process.env.BACKBLAZE_BUCKET_NAME!,
        Key: chunkKey,
        ContentType: fileType,
        ACL: 'private',
      })

      // Generate the signed URL for chunk upload
      try {
        const uploadUrl = await getSignedUrl(s3Client, command, {
          expiresIn: 300,
          signableHeaders: new Set(['host', 'content-type']),
        })
        return {
          uploadUrl,
          chunkKey,
          bucket: process.env.B2_BUCKET_NAME,
          region: 'us-east-005',
        }
      } catch (error) {
        console.error('Error generating signed URL for chunk:', error)
        throw new Error('Failed to generate upload URL for chunk')
      }
    }),

  initializeMultipartUpload: protectedProcedure
    .input(z.object({ filename: z.string(), fileType: z.string() }))
    .mutation(async ({ input }) => {
      const { filename, fileType } = input

      try {
        const command = new CreateMultipartUploadCommand({
          Bucket: process.env.BACKBLAZE_BUCKET_NAME!,
          Key: `uploads/${filename}`,
          ContentType: fileType,
        })

        const { UploadId } = await s3Client.send(command)
        return { uploadId: UploadId }
      } catch (error) {
        console.error('Error initializing multipart upload:', error)
        throw new Error('Failed to initialize upload')
      }
    }),

  finalizeUploadAndStream: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
        uploadId: z.string(),
        title: z.string(),
        parts: z.array(
          z.object({
            ETag: z.string(),
            PartNumber: z.number(),
          }),
        ),
      }),
    )
    .mutation(async ({ input }) => {
      const { filename, uploadId, title, parts } = input

      try {
        console.log('Finalizing upload with parts:', parts) // Debug log

        // Validate parts array
        if (!parts.length) {
          throw new Error('No parts provided for multipart upload completion')
        }

        // Sort parts by part number
        const sortedParts = parts.sort((a, b) => a.PartNumber - b.PartNumber)

        const completeCommand = new CompleteMultipartUploadCommand({
          Bucket: process.env.BACKBLAZE_BUCKET_NAME!,
          Key: `uploads/${filename}`,
          UploadId: uploadId,
          MultipartUpload: {
            Parts: sortedParts,
          },
        })

        console.log(
          'Complete command:',
          JSON.stringify(completeCommand, null, 2),
        ) // Debug log

        const completeResponse = await s3Client.send(completeCommand)
        console.log('Complete response:', completeResponse) // Debug log

        // Create video in Bunny.net Stream
        const bunnyResponse = await fetch(
          `https://video.bunnycdn.com/library/${process.env.BUNNY_LIBRARY_ID}/videos`,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              AccessKey: process.env.BUNNY_API_KEY!,
            },
            body: JSON.stringify({
              title,
              url: `${process.env.BACKBLAZE_PUBLIC_URL}/uploads/${filename}`,
            }),
          },
        )

        const bunnyData = await bunnyResponse.json()
        return {
          videoId: bunnyData.guid,
          playbackUrl: `${process.env.BUNNY_STREAM_URL}/${bunnyData.guid}/play.m3u8`,
          thumbnailUrl: `${process.env.BUNNY_STREAM_URL}/${bunnyData.guid}/thumbnail.jpg`,
        }
      } catch (error) {
        console.error('Error finalizing upload:', error)
        if (error instanceof Error) {
          throw new Error(`Failed to finalize upload: ${error.message}`)
        }
        throw new Error('Failed to finalize upload')
      }
    }),

  createVideo: protectedProcedure
    .input(
      z.object({
        title: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const response = await fetch(
          `https://video.bunnycdn.com/library/${process.env.BUNNY_LIBRARY_ID}/videos`,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              AccessKey: process.env.BUNNY_API_KEY!,
            },
            body: JSON.stringify({
              title: input.title,
            }),
          },
        )

        if (!response.ok) {
          throw new Error(`Failed to create video: ${response.statusText}`)
        }

        const data = await response.json()
        return {
          videoId: data.guid,
        }
      } catch (error) {
        console.error('Error in createVideo:', error)
        throw new Error(
          error instanceof Error ? error.message : 'Failed to create video',
        )
      }
    }),

  getVideoStatus: protectedProcedure
    .input(
      z.object({
        videoId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const response = await fetch(
        `https://video.bunnycdn.com/library/${process.env.BUNNY_LIBRARY_ID}/videos/${input.videoId}`,
        {
          headers: {
            Accept: 'application/json',
            AccessKey: process.env.BUNNY_API_KEY!,
          },
        },
      )

      if (!response.ok) {
        throw new Error('Failed to get video status')
      }

      return response.json()
    }),

  uploadVideo: protectedProcedure
    .input(
      z.object({
        videoId: z.string(),
        fileName: z.string(),
        fileData: z.string(), // base64 encoded file
      }),
    )
    .mutation(async ({ input }) => {
      try {
        // Convert base64 to Buffer
        const fileBuffer = Buffer.from(input.fileData, 'base64')

        // Upload to Bunny.net
        const response = await fetch(
          `https://video.bunnycdn.com/library/${process.env.BUNNY_LIBRARY_ID}/videos/${input.videoId}`,
          {
            method: 'PUT',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/octet-stream',
              AccessKey: process.env.BUNNY_API_KEY!,
            },
            body: fileBuffer,
          },
        )

        if (!response.ok) {
          const errorText = await response.text()
          console.error('Bunny.net API error:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
          })
          throw new Error(`Failed to upload video: ${response.statusText}`)
        }

        return await response.json()
      } catch (error) {
        console.error('Error in uploadVideo:', error)
        throw new Error(
          error instanceof Error ? error.message : 'Failed to upload video',
        )
      }
    }),

  getTusUploadUrl: protectedProcedure
    .input(
      z.object({
        videoId: z.string(),
        filename: z.string(),
        fileType: z.string(),
      }),
    )
    .mutation(({ input }) => {
      const expirationTime = Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
      const signature = createHash('sha256')
        .update(
          process.env.BUNNY_LIBRARY_ID! +
            process.env.BUNNY_API_KEY! +
            expirationTime +
            input.videoId,
        )
        .digest('hex')

      return {
        uploadUrl: 'https://video.bunnycdn.com/tusupload',
        headers: {
          AuthorizationSignature: signature,
          AuthorizationExpire: expirationTime.toString(),
          VideoId: input.videoId,
          LibraryId: process.env.BUNNY_LIBRARY_ID!,
        },
        metadata: {
          filetype: input.fileType,
          title: input.filename,
        },
      }
    }),
})
