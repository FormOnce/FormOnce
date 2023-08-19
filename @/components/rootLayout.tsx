import { ThemeProvider } from "@/components/theme-provider";
import { useTheme } from "next-themes";
import Head from "next/head";
import { useEffect } from "react";

export type RootLayoutProps = {
  title: string;
  children: React.ReactNode;
};

export default function RootLayout({ title, children }: RootLayoutProps) {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme("dark");
  });

  return (
    <>
      <Head>{title}</Head>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </>
  );
}
