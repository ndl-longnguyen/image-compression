import Script from "next/script"
import { SITE_URL, MAIN_SITE_URL } from "@/lib/config/site"
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Online Image Tools – Fast & Private In-Browser Image Processing',
    template: '%s | Online Image Tools',
  },
  description:
    'Compress, resize, crop, convert, rotate, and edit images directly in your browser. 100% private, zero uploads. Created by Nguyen Dai Long (NDL).',
  metadataBase: new URL(SITE_URL),
  authors: [{ name: 'Nguyen Dai Long (NDL)', url: MAIN_SITE_URL }],
  alternates: {
    canonical: SITE_URL,
  },
  creator: 'Nguyen Dai Long (NDL)',
  publisher: 'Online Image Tools',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    shortcut: '/favicon.ico',
    apple: [
      {
        url: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Online Image Tools',
    title: 'Online Image Tools – Fast & Private In-Browser Image Processing',
    description:
      'Compress, resize, crop, convert, rotate, and edit images directly in your browser. 100% private, zero uploads.',
    images: [
      {
        url: '/icon.png',
        width: 512,
        height: 512,
        alt: 'Online Image Tools by NDL',
      },
    ],
  },
  verification: {
    google: '2n_hKWDM5r9dlRixMDRAsSCW6hbadPKFb5ccKFfG3i0',
  },
  other: {
    'google-adsense-account': 'ca-pub-9166964727480227',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf9f8' },
    { media: '(prefers-color-scheme: dark)', color: '#171717' },
  ],
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: 'Online Image Tools',
  alternateName: [
    'Image Tools',
    'NDL Image Tools',
    'image.ndlong.site',
  ],
  description:
    'Compress, resize, crop, convert, rotate, and edit images directly in your browser. 100% private, zero uploads.',
  publisher: {
    '@type': 'Person',
    name: 'Nguyen Dai Long (NDL)',
    url: MAIN_SITE_URL,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`bg-background ${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9166964727480227"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased text-foreground bg-background">
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
