import React from 'react'
import Page from './about.client'
import { Approach, Journey, Learning } from './about.chunks'
import { TestimonialsCarousel } from '@/lib/testimonials'
import { Contact } from '../home/home.chunks'

export default function page() {
  return (
    <div>
      <Page />
      <Approach />
      <Learning />
      <Journey />
      <TestimonialsCarousel />
      <Contact />
    </div>
  )
}
