import type { Metadata } from 'next'

import RootLayout, { type RootLayoutProps } from '@layouts/rootLayout'
import { Sidebar } from '~/components/ui'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'App Dashboard',
}

export type dashboardLayoutProps = RootLayoutProps

export default function DashboardLayout({
  title,
  children,
}: dashboardLayoutProps) {
  return (
    <RootLayout title={title}>
      <div className="flex h-[100vh] w-full">
        <Sidebar className="w-72" />
        <div className="flex h-full w-full flex-col">
          {/* <nav className="flex h-16 items-center px-4 py-2">
            <MainNav className="mx-6" />
            <div className="ml-auto mr-4 flex items-center">
              <UserNav />
            </div>
          </nav> */}
          <div className="h-[calc(100vh)] w-full p-8">{children}</div>
        </div>
      </div>
    </RootLayout>
  )
}
