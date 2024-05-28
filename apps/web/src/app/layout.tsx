import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import NextTopLoader from "nextjs-toploader";

import { cn } from "@tanya.in/ui";
import { ThemeToggle } from "@tanya.in/ui/theme";
import { Toaster } from "@tanya.in/ui/toast";

import "@/styles/globals.css";

import { Providers } from "@/components/providers";
import { siteConfig } from "@/constant/config";
import { auth } from "@/server/auth";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `${siteConfig.title} - %s`,
  },
  description: siteConfig.description,
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `/site.webmanifest`,
  openGraph: {
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    images: [`${siteConfig.url}/images/og.jpg`],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [`${siteConfig.url}/images/og.jpg`],
    creator: "@th_clarence",
  },
  authors: [
    {
      name: "Mochamad Revanza Kurniawan",
      url: "https://rvnza.tech",
    },
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-content2 font-sans text-foreground antialiased dark:bg-background",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <NextTopLoader color="#FFBC05" showSpinner={false} />
        <Providers>
          <SessionProvider session={session}>
            {props.children}

            <div className="fixed bottom-4 right-4">
              <ThemeToggle />
            </div>

            <Toaster />
            <Analytics />
            <SpeedInsights />
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}
