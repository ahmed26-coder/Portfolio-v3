import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import {getTranslations} from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations('notFound');
  return (
    <div className="w-full absolute min-h-screen text-center mx-auto flex items-center justify-center">
      <div className="text-center flex flex-col items-center">
        <AlertTriangle className="w-20 h-20 text-destructive mb-6" />
        <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
        <p className="text-muted-foreground mb-6">
          {t('description')}
        </p>
        <Button asChild>
          <Link href="/">{t('button')}</Link>
        </Button>
      </div>
    </div>
  );
}
