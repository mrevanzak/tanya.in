import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import NextTopLoader from "nextjs-toploader";

import { cn } from "@tanya.in/ui";
import { Toaster } from "@tanya.in/ui/toast";

import "@/styles/globals.css";

import Script from "next/script";
import { Providers } from "@/components/providers";
import { siteConfig } from "@/constant/config";
import { auth } from "@/server/auth";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `${siteConfig.title} - %s`,
  },
  description: siteConfig.description,
  robots: { index: true, follow: true },
  icons: {
    icon: [
      {
        url: "/favicon/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicon/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    shortcut: "/favicon/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `/favicon/site.webmanifest`,
  openGraph: {
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    images: [`${siteConfig.url}/images/og.png`],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [`${siteConfig.url}/images/og.png`],
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

const BricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font",
  display: "swap",
});

export default async function RootLayout(props: { children: React.ReactNode }) {
  const session = await auth();

  const lang = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-content2 font-sans text-foreground antialiased dark:bg-background",
          BricolageGrotesque.variable,
        )}
      >
        <NextTopLoader color="#FFBC05" showSpinner={false} />
        <NextIntlClientProvider messages={messages} locale={lang}>
          <Providers user={session?.user}>
            {props.children}

            <Toaster />
            <Analytics />
            <SpeedInsights />
          </Providers>
        </NextIntlClientProvider>

        <Script
          id="maze"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function (m, a, z, e) {
var s, t;
try {
t = m.sessionStorage.getItem('maze-us');
} catch (err) {}

if (!t) {
t = new Date().getTime();
try {
m.sessionStorage.setItem('maze-us', t);
} catch (err) {}
}

s = a.createElement('script');
s.src = z + '?apiKey=' + e;
s.async = true;
a.getElementsByTagName('head')[0].appendChild(s);
m.mazeUniversalSnippetApiKey = e;
})(window, document, 'https://snippet.maze.co/maze-universal-loader.js', 'fa61352d-7ca2-4c5e-84f8-bb5a93043aba');`,
          }}
        />
      </body>
    </html>
  );
}
