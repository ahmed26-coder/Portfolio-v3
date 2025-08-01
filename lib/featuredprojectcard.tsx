"use client"
import { useLocale, useTranslations } from 'next-intl';
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ExternalLink, Github, ArrowUpRight } from "lucide-react"

interface FeaturedProjectCardProps {
  title: string
  id: string
disc: {
  en: string
  ar: string
}
  image: string
  demo?: string
  githup?: string
  techniques: string[]
}

export default function FeaturedProjectCard({
  title,
  disc,
  id,
  image,
  demo,
  githup,
  techniques = [],
}: FeaturedProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const t = useTranslations('HomePage');
  const locale = useLocale() as 'en' | 'ar';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className=" w-full group dark:hover:shadow-blue-500 dark:hover:border-blue-500 relative grid gap-8 xl:grid-cols-2 overflow-hidden rounded-xl border border-zinc-200 bg-white p-1 shadow-sm transition-all duration-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
        <div className="relative overflow-hidden rounded-lg">
          <div className="aspect-video w-full overflow-hidden">
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              width={600}
              height={340}
              priority
              className={`h-full w-full object-cover transition-all duration-500 ${isHovered ? "scale-110" : "scale-100"}`}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        <div className="flex flex-col justify-between p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
              <p className="text-zinc-600 dark:text-zinc-300 line-clamp-3 md:line-clamp-none">{disc[locale]}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {techniques.map((tech) => (
                <article
                  key={tech}
                  className="bg-zinc-100 text-zinc-800 py-0.5 px-3 hover:bg-blue-500 hover:text-white rounded-full dark:bg-zinc-800 dark:text-zinc-200"
                >
                  {tech}
                </article>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-between gap-3">
            {demo && (
              <button>
                <Link href={demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                  <ExternalLink className="h-4 w-4" />
                  {t('View')}
                </Link>
              </button>
            )}
            {githup && (
              <button>
                <Link href={githup} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                  <Github className="h-4 w-4" />
                  {t('source')}
                </Link>
              </button>
            )}
            <button className="ms-auto group" >
              <Link
                href={`/portfolio/${id}`}
                className="flex items-center gap-1"
              >
                {t('View')}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
