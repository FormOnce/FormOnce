import { ThemeProvider } from "@components/theme-provider";
import { useTheme } from "next-themes";
import Head from "next/head";
import { useEffect } from "react";

export type RootLayoutProps = {
  title: string;
  children: React.ReactNode;
  theme?: string;
};

export default function RootLayout({
  title,
  children,
  theme,
}: RootLayoutProps) {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme("dark");
  });

  return (
    <>
      <Head>{title}</Head>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={true}
        forcedTheme={theme}
      >
        {children}
      </ThemeProvider>
    </>
  );
}
