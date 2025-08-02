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
        {children}
    </html>
  );
}
