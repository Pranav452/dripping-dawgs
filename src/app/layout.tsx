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
  title: "Dripping Dogs",
  description: "Clothing Brand",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${dancingScript.variable} antialiased`}>
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
        <Toaster />
      </body>
    </html>
  );
}
