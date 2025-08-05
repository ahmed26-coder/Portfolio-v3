"use client"
import {useTranslations} from 'next-intl';
import { Bookmark } from "lucide-react"
import React from "react"

interface DownloadCVButtonProps {
  cvUrl?: string
}

export default function DownloadCVButton({ cvUrl }: DownloadCVButtonProps) {
    const t = useTranslations('HomePage');
  return (

    <a className="w-full sm:w-auto justify-center cursor-pointer flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-zinc-900 border-2 py-1 px-6 text-lg border-[#AEB1B7] rounded-md"       href={cvUrl}
      download>
        <span><Bookmark className="text-[#AEB1B7] font-bold text-lg" /></span>
        {t("button2")}
        </a>
  )
}
