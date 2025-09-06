import { ReactNode } from "react";
import "./globals.css";

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>
}) {
  const locale = (await params).locale;
  const validLocale = ['ar', 'en'].includes(locale) ? locale : 'en';
  const dir = validLocale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html
      lang={validLocale}
      dir={dir}
      className="dark"
      suppressHydrationWarning
    >
      <head>
        <script
          defer
          data-domain="portfolio-ahmad-developer.vercel.app/en"
          src="https://plausible.io/js/script.js"
        ></script>
      </head>
      {children}
    </html>
  );
}
