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
import { useRef, useState } from 'react'
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
  const [uploadProgress, setUploadProgress] = useState(0)
  const [videoId, setVideoId] = useState<string | null>(null)
  const uploadIdRef = useRef<string | null | undefined>(null)

  const { mutateAsync: initializeUpload } =
    api.video.initializeMultipartUpload.useMutation()
  const { mutateAsync: getChunkUploadUrl } =
    api.video.getChunkUploadUrl.useMutation()
  const { mutateAsync: finalizeUpload } =
    api.video.finalizeUploadAndStream.useMutation()

  const { mutateAsync: createVideo } = api.video.createVideo.useMutation()
  const { mutateAsync: uploadVideo } = api.video.uploadVideo.useMutation()
  // const { mutateAs ync: getUploadUrl } = api.video.getTusUploadUrl.useMutation();
  const { data: videoStatus } = api.video.getVideoStatus.useQuery(
    { videoId: videoId! },
    { enabled: !!videoId, refetchInterval: 5000 },
  )

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files?.[0]) {
      setVideoFile(event.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!videoFile) return

    try {
      // 1. Create video in Bunny.net
      const { videoId: newVideoId } = await createVideo({
        title: videoFile.name,
      })
      setVideoId(newVideoId)

      // 2. Upload using FormData
      const formData = new FormData()
      formData.append('file', videoFile)

      // Create the upload URL
      const uploadUrl = `/api/upload-video/${newVideoId}`

      await axios.post(uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total ?? 1),
          )
          setUploadProgress(percentCompleted)
        },
      })

      setUploadProgress(100)
    } catch (error) {
      console.error('Upload failed:', error)
      setUploadProgress(0)
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
          {uploadProgress > 0 && (
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 text-center">
                {uploadProgress}% uploaded
              </p>
            </div>
          )}
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
