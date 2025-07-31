import { ReactNode } from "react";

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const validLocale = locale === "ar" ? "ar" : "en";

  return (
    <html
      lang={validLocale}
      dir={validLocale === "ar" ? "rtl" : "ltr"}
      className="dark"
      suppressHydrationWarning
    >
        {children}
    </html>
  );
}