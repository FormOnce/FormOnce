import type { Metadata } from "next";

import { MainNav, UserNav, TeamSwitcher, Sidebar } from "~/components/ui";
import RootLayout, { type RootLayoutProps } from "@layouts/rootLayout";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export type dashboardLayoutProps = RootLayoutProps;

export default function DashboardLayout({
  title,
  children,
}: dashboardLayoutProps) {
  return (
    <RootLayout title={title}>
      <>
        <nav className="flex h-16 items-center border-b px-4">
          <TeamSwitcher />
          <MainNav className="mx-6" />
          <div className="ml-auto mr-2 flex items-center">
            <UserNav />
          </div>
        </nav>
        <div className="flex h-[calc(100vh-4rem)] w-full ">
          <Sidebar className="w-60" />
          <div className="w-full p-8">{children}</div>
        </div>
      </>
    </RootLayout>
  );
}
