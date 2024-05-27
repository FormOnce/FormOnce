import {
  GitHubLogoIcon,
  PinRightIcon,
  TwitterLogoIcon,
} from '@radix-ui/react-icons'
import { ChevronRight, CopyrightIcon } from 'lucide-react'
import type { GetServerSideProps } from 'next'
import { signOut } from 'next-auth/react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Icons, Input } from '~/components/ui'
import { Button } from '~/components/ui/button'
import { getServerAuthSession } from '~/server/auth'

import HeroImg from '../assets/hero.png'

export default function Home({ id }: { id: string }) {
  const router = useRouter()

  const [isSigningOut, setIsSigningOut] = useState(false)
  const handleSignout = () => {
    setIsSigningOut(true)
    void signOut({
      callbackUrl: '/auth/signin',
    }).then(() => {
      setIsSigningOut(false)
    })
  }

  const handleRedirectToDashboard = () => {
    void router.push('/dashboard/forms')
  }

  return (
    <>
      <Head>
        <title>FormOnce</title>
        <meta name="description" content="Not another form builder" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="dark min-h-screen bg-background">
        <nav className="sticky top-0 flex items-center justify-between border-b px-12 py-4 text-foreground z-50 backdrop-blur-md">
          <Link href="/">
            <span className="text-2xl font-extrabold text-[hsl(280,100%,70%)]">
              FormOnce
            </span>
          </Link>
          {/* {id ? (
            <div className="flex">
              <Button onClick={handleRedirectToDashboard} variant="ghost">
                Dashboard
              </Button>
              <Button onClick={handleSignout} variant="ghost">
                {isSigningOut && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Sign out
              </Button>
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className={cn(buttonVariants({ variant: 'ghost' }))}
            >
              <span className="text-foreground">Sign in</span>
            </Link>
          )} */}
          <Button variant={'link'}>
            <Link href="https://github.com/FormOnce/FormOnce">
              <GitHubLogoIcon width={'28'} height={'28'} />
            </Link>
          </Button>
        </nav>
        <div className="flex flex-col items-center justify-center bg-background">
          <div className="container flex flex-col items-center gap-16 px-4 py-16 max-w-5xl">
            <div className="flex flex-col items-center gap-6">
              <h1 className="text-center text-7xl font-extrabold leading-none tracking-tight text-foreground">
                {/* <span className="text-[hsl(280,100%,70%)]">FormOnce</span> */}
                Forms that Speak, Literally!
              </h1>
              <h2 className="text-center text-3xl font-base text-foreground max-w-2xl">
                <span className="text-[hsl(280,100%,70%)] font-extrabold">
                  FormOnce
                </span>{' '}
                is the #1 open-source platform for building voice & video
                enabled forms.
              </h2>
              <h2>
                <i className="text-xl font-base text-foreground max-w-2xl">
                  better than Typeform, Tallyforms, VideoAsk and everything
                  else.
                </i>
              </h2>
            </div>
            <div className="flex justify-center items-center flex-col gap-4">
              <div className="relative">
                <Input
                  placeholder="Enter your email"
                  className="w-[360px] py-1 px-3 text-primary text-sm h-12"
                />
                <Button className="absolute right-1.5 h-7 top-2.5">
                  Join waitlist
                </Button>
              </div>
              <Link href="https://github.com/FormOnce/FormOnce">
                <Button variant={'secondary'}>
                  🌟 Star FormOnce on{' '}
                  <GitHubLogoIcon className="ml-2" width={'20'} height={'20'} />{' '}
                  <ChevronRight className="ml-4" size={'12'} />
                </Button>
              </Link>
            </div>
            <div className="hidden md:flex justify-center border rounded-xl shadow-xl ring-1 ring-gray-900/10 overflow-hidden mb-12 ">
              <Image
                src={HeroImg}
                alt="FormOnce"
                width={1200}
                height={600}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </main>
      <footer className="flex items-center justify-center dark bg-background">
        <div className="flex gap-6 w-[80%] border border-b-0 p-12 rounded-tr-xl rounded-tl-xl md:justify-between">
          <div className="space-y-2">
            <div className="flex gap-1 items-end">
              <span className="text-[hsl(280,100%,70%)] font-extrabold text-3xl">
                FormOnce
              </span>
              <Link
                href="https://github.com/ksushant6566"
                className="flex items-center justify-center"
                target="_blank"
                rel="noopener noreferrer"
              ></Link>
            </div>
            <p className="flex gap-2 items-center text-muted-foreground text-sm max-w-md">
              <CopyrightIcon width={'14'} /> Formonce 2024 | Made with 💙
            </p>
          </div>
          <div className="flex flex-col justify-start space-y-2">
            <h2 className="text-muted-foreground">Get in touch with us</h2>
            <div className="flex gap-4 px-2">
              <Button
                variant={'link'}
                className="ring-1 rounded-full p-2.5 grayscale hover:grayscale-0"
              >
                <Link
                  href="https://github.com/FormOnce/FormOnce"
                  className="flex items-center"
                >
                  <GitHubLogoIcon width={'16'} height={'16'} />
                </Link>
              </Button>
              <Button
                variant={'link'}
                className="ring-1 rounded-full p-2.5 grayscale hover:grayscale-0"
              >
                <Link
                  href="https://x.com/form_once"
                  className="flex items-center"
                >
                  <TwitterLogoIcon width={'16'} height={'16'} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx)

  if (session?.user?.id) {
    return {
      props: {
        id: session.user.id,
        name: session.user.name,
      },
    }
  }

  return {
    props: {},
  }
}
