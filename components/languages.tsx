"use client"

import { useState, useRef, useEffect } from "react"
import { Check, Globe, ChevronDown } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useLocale } from "next-intl"

type Language = {
  code: string
  name: string
  nativeName: string
  direction: "ltr" | "rtl"
}

const languages: Language[] = [
  { code: "ar", name: "Arabic", nativeName: "العربية", direction: "rtl" },
  { code: "en", name: "English", nativeName: "English", direction: "ltr" },
]

type Props = {
  isSidebarExpanded?: boolean
}

export default function LanguageSwitcher({ isSidebarExpanded = true }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const currentLanguage =
    languages.find((lang) => lang.code === locale) || languages[0]

  const handleLanguageChange = (language: Language) => {
    document.documentElement.lang = language.code
    document.documentElement.dir = language.direction

    const segments = pathname.split("/")
    segments[1] = language.code
    router.replace(segments.join("/"))
    setOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative inline-block mx-auto mt-4" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 h-8 text-sm border rounded-md bg-transparent transition
          ${isSidebarExpanded ? "px-2 hover:bg-gray-100 dark:hover:bg-gray-800" : " px-1 w-full justify-center"}`}
      >
        <Globe className="h-4 w-4 text-[#17ddb9]" />
        {isSidebarExpanded ? (
          <>
            <span className="mx-1">{currentLanguage.nativeName}</span>
            <ChevronDown className="h-3 w-3 opacity-50 " />
          </>
        ) : (
          <ChevronDown className="h-3 w-3 opacity-50 " />
        )}
      </button>

      {open && (
        <div className="absolute z-10 mt-1 w-40 rounded-md shadow-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language)}
              className="w-full text-left px-3 py-2 text-sm flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <span>{language.nativeName}</span>
              {currentLanguage.code === language.code && (
                <Check className="h-4 w-4 text-[#17ddb9]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
