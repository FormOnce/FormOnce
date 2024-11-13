'use client'

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  Input,
  Label,
} from '@components/ui'
import axios from 'axios'
import { useState } from 'react'
import { api } from '~/utils/api'

const CHUNK_SIZE = 5 * 1024 * 1024 // 5 MB per chunk

export const VideoUploadDialog = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}) => {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const { mutateAsync: getChunkUploadUrl } =
    api.video.getChunkUploadUrl.useMutation()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files?.[0]) {
      setVideoFile(event.target.files[0])
    }
  }

  const uploadChunk = async (
    chunk: Blob,
    chunkNumber: number,
    filename: string,
    fileType: string,
  ) => {
    try {
      const { uploadUrl } = await getChunkUploadUrl({
        filename,
        chunkNumber,
        fileType,
      })

      const response = await axios.put(uploadUrl, chunk, {
        headers: {
          'Content-Type': fileType,
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total ?? 1),
          )
          console.log(`Upload Progress: ${percentCompleted}%`)
        },
      })

      if (response.status !== 200) {
        throw new Error(`Upload failed with status: ${response.status}`)
      }

      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data)
        throw new Error(`Upload failed: ${error.message}`)
      }
      throw error
    }
  }

  const handleUpload = async () => {
    if (!videoFile) return alert('Please select a video file first')

    const { name, type, size } = videoFile
    const chunkCount = Math.ceil(size / CHUNK_SIZE)

    try {
      const uploadPromises = []
      for (let i = 0; i < chunkCount; i++) {
        const start = i * CHUNK_SIZE
        const end = Math.min(start + CHUNK_SIZE, size)
        const chunk = videoFile.slice(start, end)

        console.log(`Starting upload for chunk ${i + 1} of ${chunkCount}`)
        uploadPromises.push(uploadChunk(chunk, i, name, type))
      }

      await Promise.all(uploadPromises)
      console.log('All chunks uploaded successfully')
      alert('Video uploaded successfully!')
    } catch (error) {
      console.error('Error uploading video:', error)
      alert(
        `Failed to upload video: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <div className="border-2 border-dashed border-gray-200 rounded-lg flex flex-col gap-1 p-6 m-4 items-center">
          <FileIcon className="w-12 h-12" />
          <span className="text-sm font-medium text-gray-500">
            Drag and drop a file or click to browse
          </span>
          <span className="text-xs text-gray-500">video</span>
        </div>
        <div className="cursor-pointer space-y-2 text-sm">
          <Label htmlFor="file" className="text-sm font-medium">
            File
          </Label>
          <Input
            id="file"
            type="file"
            placeholder="File"
            accept="video/mp4,video/x-m4v,video/*"
            onChange={handleFileChange}
          />
        </div>
        <DialogFooter>
          <Button size="lg" onClick={handleUpload} disabled={!videoFile}>
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function FileIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  )
}
