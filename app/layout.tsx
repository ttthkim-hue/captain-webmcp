import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: 'Captain — Human-Agent Operations',
  description:
    'A WebMCP control room where people and agents route work across an AI team without giving up human authority.',
  openGraph: {
    title: 'Captain — Human-Agent Operations',
    description:
      'A shared WebMCP control room for people and specialized AI workers.',
    type: 'website',
    images: [
      {
        url: '/og.png',
        width: 1731,
        height: 909,
        alt: 'Captain human and agent operations control room',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Captain — Human-Agent Operations',
    description:
      'A shared WebMCP control room for people and specialized AI workers.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
