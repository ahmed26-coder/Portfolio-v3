import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="w-full relative min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="w-full max-w-lg mb-35">
        <video
          src="/Broken Bot With 404 Error.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto object-cover"
        />
      </div>
      <div className="absolute bottom-0 left-0 w-full flex flex-col items-center mb-25 px-4 text-black">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-center">{t("title")}</h1>
        <p className="mb-6 text-center">{t("description")}</p>
        <Button asChild>
          <Link href="/">{t("button")}</Link>
        </Button>
      </div>
    </div>
  );
}
