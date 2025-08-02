'use client'

import Image from 'next/image'
import { useState, useRef, useEffect, useMemo, memo } from 'react'
import { Check, ChevronDown, ArrowRightLeft, Sparkles } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'

type Language = {
  code: 'ar' | 'en'
  name: string
  nativeName: string
  direction: 'ltr' | 'rtl'
  symbol: string
  flag: string
  sample: string
}

const languages: Language[] = [
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl', symbol: 'ع', flag: '/egypt.svg', sample: 'مرحبا بالعالم' },
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr', symbol: 'E', flag: '/us.svg', sample: 'Hello World' },
]

type Props = {
  isSidebarExpanded?: boolean
}

const LanguageOption = memo(function LanguageOption({
  language,
  currentLanguage,
  onClick
}: {
  language: Language
  currentLanguage: Language
  onClick: (lang: Language) => void
}) {
  return (
    <button
      onClick={() => onClick(language)}
      className="w-full text-left px-3 py-2 text-sm flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 transition"
    >
      <Image src={language.flag} alt={language.code} width={20} height={20} loading="lazy" />
      <span>{language.nativeName}</span>
      {currentLanguage.code === language.code && (
        <Check className="h-4 w-4 text-[#17ddb9]" />
      )}
    </button>
  )
})

export default function LanguageSwitcher({ isSidebarExpanded = true }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations('button')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fromLang, setFromLang] = useState<Language | null>(null)
  const [toLang, setToLang] = useState<Language | null>(null)
  const [progress, setProgress] = useState(0)
  const [currentPhase, setCurrentPhase] = useState(0)
  const menuRef = useRef<HTMLDivElement>(null)
  const phases = t.raw('phases') as string[]

  const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0]

  const particles = useMemo(
    () =>
      Array.from({ length: 40 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: 3 + Math.random() * 2,
        delay: Math.random() * 3
      })),
    []
  )

  const handleLanguageChange = (language: Language) => {
    if (language.code === locale) return setOpen(false)

    setOpen(false)
    setFromLang(currentLanguage)
    setToLang(language)
    setLoading(true)

    let start: number | null = null
    const duration = 1000

    const animate = (timestamp: number) => {
      if (!start) start = timestamp
      const elapsed = timestamp - start
      const current = Math.min((elapsed / duration) * 100, 100)
      setProgress(current)
      const index = Math.floor((current / 100) * phases.length)
      setCurrentPhase(Math.min(index, phases.length - 1))

      if (current < 100) {
        requestAnimationFrame(animate)
      } else {
        setTimeout(() => {
          const segments = pathname.split('/')
          segments[1] = language.code
          router.replace(segments.join('/'))
        }, 200)
      }
    }

    requestAnimationFrame(animate)
  }

  useEffect(() => {
    if (toLang) {
      document.documentElement.lang = toLang.code
      document.documentElement.dir = toLang.direction
    }
  }, [toLang])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <>
      <div className="relative inline-block mx-auto mt-4" ref={menuRef}>
        <button
          onClick={() => setOpen(!open)}
          className={`flex items-center gap-1 h-8 text-sm border rounded-md bg-transparent transition
            ${isSidebarExpanded ? 'px-2 hover:bg-gray-100 dark:hover:bg-gray-800' : 'px-2 w-full justify-center'}`}
        >
          <Image src={currentLanguage.flag} alt={currentLanguage.code} width={20} height={20} priority />
          {isSidebarExpanded && (
            <>
              <span className="mx-1">{currentLanguage.nativeName}</span>
              <ChevronDown className="h-3 w-3 opacity-50 " />
            </>
          )}
        </button>

        {open && (
          <div className="absolute z-10 mt-1 w-40 rounded-md shadow-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            {languages.map((language) => (
              <LanguageOption
                key={language.code}
                language={language}
                currentLanguage={currentLanguage}
                onClick={handleLanguageChange}
              />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {loading && fromLang && toLang && (
          <motion.div
            className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 z-50 flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0">
              {particles.map((p, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/20 rounded-full"
                  style={{ left: p.left, top: p.top }}
                  animate={{ y: [0, -100, 0], opacity: [0, 1, 0], scale: [0, 1, 0] }}
                  transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
                />
              ))}
            </div>

            <div className="relative z-10 text-center px-4 max-w-lg">
              <div className="flex items-center justify-center gap-10 mb-10">
                <motion.div
                  className="flex flex-col items-center"
                  animate={{ opacity: progress > 50 ? 0.3 : 1, scale: progress > 50 ? 0.8 : 1 }}
                >
                  <Image src={fromLang.flag} alt={fromLang.code} width={100} height={100} priority />
                  <div className="text-white text-xl">{fromLang.nativeName}</div>
                  <div className="text-white/70">{fromLang.sample}</div>
                </motion.div>

                <motion.div
                  animate={{ rotate: [0, 180, 360], scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full relative"
                >
                  <ArrowRightLeft className="text-white w-8 h-8" />
                  <Sparkles className="absolute -top-2 -right-2 text-yellow-400 w-5 h-5 animate-ping" />
                </motion.div>

                <motion.div
                  className="flex flex-col items-center"
                  animate={{ opacity: progress > 50 ? 1 : 0.3, scale: progress > 50 ? 1 : 0.8 }}
                >
                  <Image src={toLang.flag} alt={toLang.code} width={100} height={100} priority />
                  <div className="text-white text-xl">{toLang.nativeName}</div>
                  <div className="text-white/70">{toLang.sample}</div>
                </motion.div>
              </div>

              <motion.div className="w-full bg-white/20 rounded-full h-3 mb-4 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>

              <div className="text-sm text-white/60">{phases[currentPhase]}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
