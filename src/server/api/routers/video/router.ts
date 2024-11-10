import {
  CompleteMultipartUploadCommand,
  ListPartsCommand,
  PutBucketCorsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'

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
})
