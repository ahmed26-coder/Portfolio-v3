import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import DecorativeSeparator from "./decorative-separator"
import { useLocale, useTranslations } from 'next-intl';

// تعريف نوع البيانات للشهادة
interface Testimonial {
  content: string;
  rating: number;
  name: string;
  role: string;
  company: string;
}

export function TestimonialsCarousel() {
  const t = useTranslations('HomePage');
  const locale = useLocale();

  const testimonialsData = t.raw('testimonials') as Testimonial[];

  return (
    <Carousel opts={{ align: "start" }} className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-[#666666] mb-2">{t('say')}</p>
        <h2 className="text-3xl md:text-4xl font-bold font-play">{t('clients')}</h2>
      </div>

      <CarouselContent>
        {testimonialsData.map((testimonial: Testimonial, index: number) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-4 pb-8">
              <Card className="h-full dark:bg-zinc-900">
                <CardContent className="p-6 py-1 flex flex-col justify-between h-full min-h-60">
                  <p className="text-base font-medium">{testimonial.content}</p>

                  <div className="flex items-center gap-1 text-yellow-500 text-base">
                    {Array.from({ length: testimonial.rating }, (_, i) => (
                      <span key={i}>★</span>
                    ))}
                    {Array.from({ length: 5 - testimonial.rating }, (_, i) => (
                      <span key={i} className="text-muted-foreground">★</span>
                    ))}
                  </div>

                  <div className="my-3">
                    <DecorativeSeparator />
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-muted-foreground dark:text-gray-300">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className="flex justify-center mt-5 gap-3 items-center">
        {locale === 'ar' ? (
          <>
            <CarouselNext />
            <CarouselPrevious />
          </>
        ) : (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </div>
    </Carousel>
  )
}