import React from 'react'
import { FAQs } from '../home/home.chunks'
import DecorativeSeparator from '@/lib/decorative-separator'
import { Contact } from './contact.chunks'

export default function page() {
  return (
    <div>
      <Contact />
      <DecorativeSeparator />
      <FAQs />
    </div>
  )
}
