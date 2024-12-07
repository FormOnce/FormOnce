import { useRouter } from 'next/router'
import { VideoPlayer } from '~/components/form-builder/flow-builder/VideoPlayer'
import { api } from '~/utils/api'

export default function VideoPage() {
  const router = useRouter()

  const { data: videoInfo } = api.video.getVideoStatus.useQuery(
    {
      videoId: router.query.videoId as string,
    },
    { enabled: !!router.query.videoId },
  )

  return (
    <div className="container mx-auto p-4">
      <VideoPlayer
        videoId={router.query.videoId as string}
        poster={`${process.env.NEXT_PUBLIC_BUNNY_STREAM_URL}/${router.query.videoId}/thumbnail.jpg`}
      />
    </div>
  )
}
