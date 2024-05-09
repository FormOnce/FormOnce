import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { type AppType } from 'next/app'
import { api } from '~/utils/api'
import '~/styles/globals.css'
import { useEffect, useState } from 'react'

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [isHyderated, setIsHyderated] = useState(false)
  // Wait till Next.js rehydration completes
  useEffect(() => {
    setIsHyderated(true)
  }, [])

  return (
    <SessionProvider session={session}>
      {isHyderated && <Component {...pageProps} />}
    </SessionProvider>
  )
}

export default api.withTRPC(MyApp)
