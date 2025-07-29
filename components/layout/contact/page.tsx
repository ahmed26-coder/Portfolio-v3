import React from 'react'
import Contact from './contact.chunks'
import { FAQs } from '../home/home.chunks'
import DecorativeSeparator from '@/lib/decorative-separator'

export default function page() {
  return (
    <div>
      <Contact />
      <DecorativeSeparator />
      <FAQs />
    </div>
  )
}
