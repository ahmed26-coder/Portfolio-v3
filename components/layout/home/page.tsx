import React from 'react'
import Home, { Contact, FAQs, Project, Services } from './home.chunks'
import DecorativeSeparator from '@/lib/decorative-separator'
import { TestimonialsCarousel } from '@/lib/testimonials'
import { Skills } from './home.client'

export default function page() {
  return (
    <div>
      <Home />
      <Skills/>
      <Services />
      <Project />
      <TestimonialsCarousel />
      <DecorativeSeparator />
      <FAQs />
      <Contact />
    </div>
  )
}
