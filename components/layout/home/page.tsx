import React from 'react'
import Home, { Contact, FAQs, Project, Services } from './home.chunks'
import { Skills } from './home.client'
import DecorativeSeparator from '@/lib/decorative-separator'
import { TestimonialsCarousel } from '@/lib/testimonials'

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
