import RootLayout, { type RootLayoutProps } from '@layouts/rootLayout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Form',
  description: 'Form Page',
}

export type FormLayoutProps = RootLayoutProps

export const FormLayout = ({ children, ...props }: FormLayoutProps) => {
  return (
    <RootLayout theme="light" {...props}>
      <div className="flex h-[100vh] flex-col justify-between gap-4">
        <div className="flex h-[calc(100%-3rem)] items-center justify-center p-8 md:h-[calc(100%-6rem)]">
          {children}
        </div>
        {/* footer with powered by formOnce branding with a link to formOnce website 'https://formonce.in/' */}
        <div className="flex h-12 items-center justify-center p-8 text-sm text-gray-400 md:h-24">
          <a
            href="https://formonce.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1"
          >
            powered by{' '}
            <span className="text-2xl font-extrabold text-[hsl(280,100%,70%)]">
              FormOnce
            </span>
          </a>
        </div>
      </div>
    </RootLayout>
  )
}
