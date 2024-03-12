import type { Metadata } from "next";

import { MainNav, UserNav, TeamSwitcher, Sidebar } from "~/components/ui";
import RootLayout, { type RootLayoutProps } from "@layouts/rootLayout";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "App Dashboard",
};

export type dashboardLayoutProps = RootLayoutProps;

export default function DashboardLayout({
  title,
  children,
}: dashboardLayoutProps) {
  return (
    <RootLayout title={title}>
      <>
        {/* <nav className="flex items-center px-4 py-2"> */}
        {/* <MainNav className="mx-6" /> */}
        {/* </nav> */}
        <div className="flex h-[100vh] w-full">
          <Sidebar className="w-72" />
          <div className="flex w-full flex-col">
            <div className="ml-auto mr-4 mt-2 flex items-center">
              <UserNav />
            </div>
            <div className="w-full p-8">{children}</div>
          </div>
        </div>
      </>
    </RootLayout>
  );
}
