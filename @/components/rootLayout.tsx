import { ThemeProvider } from "@/components/theme-provider";
import { useTheme } from "next-themes";
import Head from "next/head";
import { useEffect } from "react";

export default function RootLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme("dark");
  });

  return (
    <>
      <Head>{title}</Head>
      <div>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </div>
    </>
  );
}
