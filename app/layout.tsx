import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import './interface.css';
import './sections.css';
import { profile, contact } from '@/lib/data';

/*
 * Fonts are self-hosted variable woff2 (latin subset) — three files, ~110KB
 * total. Nothing is fetched from a third party at build time or at runtime,
 * so the site builds in any CI and leaks no visitor requests to Google.
 */

const display = localFont({
  src: './fonts/SpaceGrotesk.woff2',
  weight: '300 700',
  style: 'normal',
  variable: '--font-display',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});

const body = localFont({
  src: './fonts/Inter.woff2',
  weight: '100 900',
  style: 'normal',
  variable: '--font-body',
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
});

const mono = localFont({
  src: './fonts/JetBrainsMono.woff2',
  weight: '100 800',
  style: 'normal',
  variable: '--font-mono',
  display: 'swap',
  fallback: ['ui-monospace', 'SFMono-Regular', 'monospace'],
});

const description =
  'Software engineer building secure backend systems, multi-tenant authentication, and applied machine learning — retrieval-augmented generation, forecasting pipelines, and production APIs.';

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.role}`,
  description,
  authors: [{ name: profile.name, url: contact.github }],
  keywords: [
    'Akshay Merugu',
    'software engineer',
    'backend engineer',
    'authentication',
    'OAuth',
    'OIDC',
    'NestJS',
    'machine learning',
    'RAG',
    'Python',
    'portfolio',
  ],
  openGraph: {
    title: `${profile.name} — ${profile.role}`,
    description,
    type: 'profile',
    siteName: profile.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${profile.name} — ${profile.role}`,
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#050508',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <head>
        {/*
          Runs before first paint: if this browser session has already booted,
          mark the document so the boot overlay is never painted at all.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('nt.booted')==='1'){var d=document.documentElement;d.dataset.booted='true';d.dataset.bootskip='1'}}catch(e){}",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
