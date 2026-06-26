import type { Metadata, Viewport } from "next"
import "./globals.css"

const ICONS = "/assets/generated/icons"
const SOCIAL = "/assets/generated/social"
const DESCRIPTION =
  "asset-canon is a set of AI image-generation skills for your coding agent — " +
  "describe what you need and it writes production-ready image files to your repo. " +
  "Play the tiny GBA-style quest, or skip it and read the page."

// metadataBase makes the relative OG/Twitter image paths resolve to absolute URLs
// in production. Override via NEXT_PUBLIC_SITE_URL at build time for the real host.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://asset-canon.dev"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "CANON QUEST — asset-canon",
  description: DESCRIPTION,
  icons: {
    icon: [
      { url: `${ICONS}/favicon-16x16.png`, sizes: "16x16", type: "image/png" },
      { url: `${ICONS}/favicon-32x32.png`, sizes: "32x32", type: "image/png" },
      { url: `${ICONS}/favicon-48x48.png`, sizes: "48x48", type: "image/png" },
      { url: `${ICONS}/favicon-192x192.png`, sizes: "192x192", type: "image/png" },
      { url: `${ICONS}/favicon-512x512.png`, sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: `${ICONS}/favicon-180x180.png`, sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    title: "CANON QUEST — asset-canon",
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "asset-canon",
    images: [
      {
        url: `${SOCIAL}/og-card-1200x630.png`,
        width: 1200,
        height: 630,
        alt: "asset-canon — turn a brief into shippable art.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CANON QUEST — asset-canon",
    description: DESCRIPTION,
    images: [`${SOCIAL}/twitter-card-1200x600.png`],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Extend under the notch; the stage container pads to the safe area itself.
  viewportFit: "cover",
  themeColor: "#000000",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
