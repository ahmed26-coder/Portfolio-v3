"use client"
import { useLocale, useTranslations } from 'next-intl';
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ExternalLink, Github, ArrowRight } from "lucide-react"

interface ProjectCardProps {
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

export default function ProjectCard({
  title,
  disc,
  id,
  image,
  demo,
  githup,
  techniques = [],
}: ProjectCardProps) {
  const t = useTranslations('HomePage');
  const [isHovered, setIsHovered] = useState(false)
  const locale = useLocale() as 'en' | 'ar';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="h-full"
    >
      <div className="flex flex-col h-full overflow-hidden rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 transition-all duration-300 hover:shadow-lg dark:hover:shadow-blue-500 dark:hover:border-blue-500">
        <div className="relative overflow-hidden">
          <div className="aspect-video p-2 w-full overflow-hidden">
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              width={600}
              height={340}
              priority
              className={`h-full w-full rounded-md object-cover transition-all duration-500 ${isHovered ? "scale-110" : "scale-100"}`}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100 flex items-end p-4">
            <div className="flex gap-3">
              {demo && (
                <Link href={demo} target="_blank" rel="noopener noreferrer">
                  <div className="flex bg-white py-0.5 px-2 rounded-full text-black items-center gap-1">
                    <ExternalLink className="h-4 w-4" />
                    {t('live')}
                  </div>
                </Link>
              )}
              {githup && (
                <Link href={githup} target="_blank" rel="noopener noreferrer">
                  <div className="flex bg-white py-0.5 px-2 rounded-full text-black items-center gap-1">
                    <Github className="h-4 w-4" />
                    {t('source')}
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 px-4 pt-4 pb-4">
          <div>
            <h3 className="text-xl font-bold tracking-tight">{title}</h3>
            <p className="line-clamp-3 text-zinc-600 dark:text-zinc-300 mt-1">{disc[locale]}</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {techniques.map((tech) => (
              <span
                key={tech}
                className="bg-zinc-100 text-zinc-800 py-0.5 px-3 rounded-full text-sm hover:bg-blue-500 hover:text-white dark:bg-zinc-800 dark:text-zinc-200"
              >
                {tech}
              </span>
            ))}
          </div>
          <div className="mt-auto pt-4 flex justify-end">
            <Link
              href={`/portfolio/${id}`}
              className="flex items-center group text-base font-medium hover:underline"
            >
              {t('View')}
              <ArrowRight className="ms-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
