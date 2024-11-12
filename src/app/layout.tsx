import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { AuthProvider } from '@/lib/auth'
import { AnnouncementBanner } from '@/components/AnnouncementBanner'
import { Toaster } from 'sonner'
import { PageWrapper } from '@/components/motion/PageWrapper'
import { Dancing_Script } from "next/font/google";
import { SmoothScroll } from '@/components/motion/SmoothScroll'
import { LoadingScreen } from '@/components/LoadingScreen'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const dancingScript = Dancing_Script({ 
  subsets: ['latin'],
  variable: '--font-dancing-script',
});

export const metadata: Metadata = {
  title: "DrippingDog",
  description: "Clothing Brand",
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      {
        url: '/favicons/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        url: '/favicons/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/favicons/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      }
    ],
    apple: [
      {
        url: '/favicons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      }
    ]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${dancingScript.variable} antialiased`}>
        <LoadingScreen />
        <SmoothScroll>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <AnnouncementBanner />
              <Header />
              <main className="flex-grow">
                <PageWrapper>
                  {children}
                </PageWrapper>
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </SmoothScroll>
        <Toaster />
      </body>
    </html>
  );
}
