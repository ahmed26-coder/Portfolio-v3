// app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto_Slab } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import Footer from "@/components/footer";
import Nav from "@/components/nav";
import type { ReactNode } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  weight: ["300", "400"],
  subsets: ["latin"],
});


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Ahmed's Portfolio",
  description:
    "A portfolio website showcasing my skills, projects, and experience in front-end development.",
  keywords: [
    "Ahmed",
    "Portfolio",
    "ahmadadham",
    "Frontend Developer",
    "React",
    "Next.js",
    "JavaScript",
    "Tailwind CSS",
    "Web Developer"
  ],
  authors: [{ name: "Ahmed" }],
  creator: "Ahmed",
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    url: "https://portfolio-ahmad-developer.vercel.app/",
    siteName: "Ahmed's Portfolio",
    images: [
      {
        url: "/logome6-removebg-preview.webp",
        width: 1200,
        height: 630,
        alt: "Ahmed Portfolio Preview"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  icons: {
    icon: "/logome6-removebg-preview.webp"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={` relative bg-grid dark:.dark .bg-grid ${geistSans.variable} ${robotoSlab.variable} ${geistMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="lg:flex min-h-screen">
            <div className="lg:flex">
              <Nav />
              <main className="mb-20 px-3 sm:px-10 w-full">
                {children}
              </main>
              <Toaster richColors position="top-center" />
            </div>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
