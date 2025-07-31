"use client"

import {useTranslations} from 'next-intl';
import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProjectImage {
  src: string
  alt: string
}

interface GalleryProps {
  images: (ProjectImage | string)[]
  title: string
}

export default function ProjectGallery({ images }: GalleryProps) {
  const formattedImages: ProjectImage[] = images
    .filter((img) => !!img)
    .map((img, i) =>
      typeof img === "string" ? { src: img, alt: `Image ${i + 1}` } : img
    )
const t = useTranslations('PortfolioPageid');
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? formattedImages.length - 1 : prev - 1
    )
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === formattedImages.length - 1 ? 0 : prev + 1
    )
  }

  if (formattedImages.length === 0) return null

  return (
    <div className="mb-16 max-w-4xl mx-auto">
      <h2 className="text-2xl text-center font-bold mb-6">{t('Gallery')}</h2>
      <div className="relative mb-6">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl">
          <Image
            src={formattedImages[currentImageIndex].src}
            alt={formattedImages[currentImageIndex].alt}
            width={600}
            height={600}
            priority
            className="h-full w-full object-cover"
          />
        </div>
        {formattedImages.length > 1 && (
          <>
            <Button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              size="icon"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2"
              size="icon"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {formattedImages.length}
            </div>
          </>
        )}
      </div>
      <div className="flex gap-4 overflow-x-auto">
        {formattedImages.map((img, index) => (
          <div
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`relative aspect-video h-24 min-w-[120px] rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
              index === currentImageIndex
                ? "ring-2 ring-green-500"
                : "opacity-60 hover:opacity-100"
            }`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              priority
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
