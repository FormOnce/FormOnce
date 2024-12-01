import { useEffect, useRef } from 'react'

interface VideoPlayerProps {
  videoId: string
  poster?: string
}

// Define the Player.js types
declare global {
  interface Window {
    // biome-ignore lint/suspicious/noExplicitAny: external library without types
    playerjs: any
  }
}

interface VideoPlayerProps {
  videoId: string
  poster?: string
  onReady?: () => void
  onPlay?: () => void
  onPause?: () => void
}

export const VideoPlayer = ({
  videoId,
  poster,
  onReady,
  onPlay,
  onPause,
}: VideoPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  // biome-ignore lint/suspicious/noExplicitAny: external library without types
  const playerRef = useRef<any>(null)

  useEffect(() => {
    // Load the Player.js script
    const script = document.createElement('script')
    script.src = '//assets.mediadelivery.net/playerjs/player-0.1.0.min.js'
    script.async = true

    script.onload = () => {
      if (!iframeRef.current) return

      const player = new window.playerjs.Player(iframeRef.current)
      playerRef.current = player

      player.on('ready', () => {
        console.log('Player ready')
        onReady?.()
      })

      player.on('play', () => {
        console.log('Video playing')
        onPlay?.()
      })

      player.on('pause', () => {
        console.log('Video paused')
        onPause?.()
      })
    }

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [onReady, onPlay, onPause])

  return (
    <iframe
      ref={iframeRef}
      src={`https://iframe.mediadelivery.net/embed/${process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID}/${videoId}`}
      className="w-full rounded-lg aspect-video"
      frameBorder="0"
      allow="autoplay"
      title="Video player"
    />
  )
}
