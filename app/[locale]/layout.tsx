import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto_Slab } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import Nav from "@/components/nav";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { getMessages } from "next-intl/server";
import notFound from "./not-found";
import { Footer } from "@/components/footer";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});
const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  weight: ["300", "400"],
  subsets: ["latin"]
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});
export async function generateMetadata({
  params
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
  const messages = await getMessages({ locale });
  const t = messages?.metadata as {
    title: string;
    description: string;
    keywords: string[];
  };
  return {
    title: t.title,
    description: t.description,
    keywords: t.keywords,
    alternates: {
      canonical: `https://portfolio-ahmad-developer.vercel.app/${locale}`,
      languages: {
        en: "https://portfolio-ahmad-developer.vercel.app/en",
        ar: "https://portfolio-ahmad-developer.vercel.app/ar"
      }
    },
    openGraph: {
      title: t.title,
      description: t.description,
      url: `https://portfolio-ahmad-developer.vercel.app/${locale}`,
      siteName: t.title,
      images: [
        {
          url: "/logome6-removebg-preview.webp",
          width: 1200,
          height: 630,
          alt: t.title
        },
        {
          url: "/logome6-removebg-preview.webp",
          width: 1200,
          height: 1200,
          alt: t.title
        },
        {
          url: "/logome6-removebg-preview.webp",
          width: 600,
          height: 315,
          alt: t.title
        }
      ],
      locale: locale === "ar" ? "ar_EG" : "en_US",
      type: "website"
    },
    icons: {
      icon: "/logome6-removebg-preview.webp"
    }
  };
}
export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  let messages;
  try {
    messages = await getMessages({ locale });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    notFound();
  }
  const dir = locale === "ar" ? "rtl" : "ltr";
  return (
    <body
      dir={dir}
      className={`relative bg-grid dark:bg-grid text-start ${geistSans.variable} ${robotoSlab.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <NextIntlClientProvider locale={locale} messages={messages}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="lg:flex flex-col min-h-screen">
            <div className="lg:flex">
              <Nav />
              <main className="px-3 sm:px-10 w-full">
                {children}
              </main>
              <Toaster richColors position="top-center" />
            </div>
            <Footer />
          </div>
        </ThemeProvider>
      </NextIntlClientProvider>
    </body>
  );
}
