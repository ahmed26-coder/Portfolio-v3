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

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Marketing Director",
    company: "TechCorp",
    content:
      "Working with this designer was an absolute pleasure. They delivered a stunning website that perfectly captured our brand identity. Their attention to detail and creativity exceeded our expectations.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Founder",
    company: "StartupX",
    content:
      "I hired this freelancer for our logo design and brand identity. The results were outstanding! They took the time to understand our vision and translated it into a perfect visual representation of our brand.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "E-commerce Manager",
    company: "Fashion Boutique",
    content:
      "Our online store needed a complete redesign, and this developer delivered beyond our expectations. The site is not only beautiful but also performs exceptionally well, leading to increased sales.",
    rating: 5,
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Creative Director",
    company: "Design Studio",
    content:
      "As a fellow designer, I have high standards. This freelancer met and exceeded them. Their technical skills combined with creative vision make them stand out in the industry.",
    rating: 5,
  },
]

export function TestimonialsCarousel() {
  return (
    <Carousel
      opts={{ align: "start" }}
      className="w-full max-w-6xl mx-auto"
    >
      <div className="text-center mb-12">
        <p className="text-[#666666] mb-2">What They Say</p>
        <h2 className="text-2xl font-bold font-play">Clients’ Testimonials</h2>
      </div>
      <CarouselContent>
        {testimonials.map((testimonial) => (
          <CarouselItem
            key={testimonial.id}
            className="md:basis-1/2 lg:basis-1/3"
          >
            <div className="p-4 pb-8">
              <Card className="h-full dark:bg-zinc-900">
                <CardContent className="p-6 py-2 flex flex-col justify-between h-full">
                  <p className="text-sm">
                    {testimonial.content}
                  </p>
                  <div className="flex items-center gap-1 text-yellow-500 text-base">
                    {Array.from({ length: testimonial.rating }, (_, i) => (
                      <span key={i}>★</span>
                    ))}
                    {Array.from({ length: 5 - testimonial.rating }, (_, i) => (
                      <span key={i} className="text-muted-foreground">★</span>
                    ))}
                  </div>
                  <div className=" my-3">
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
      <div className="flex justify-center mt-10 gap-3 items-center">
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </Carousel>
  )
}
