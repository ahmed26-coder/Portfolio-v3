import React from 'react'
import Portfolio from './portfolio.client'
import Topportfolio, { Focus } from './portfolio.chunks'

export default function page() {
  return (
      <div className="max-w-6xl mx-auto items-center mt-25 lg:mt-0 w-full container pt-10 xl:max-w-[1800px]">
        <Focus />
        <Topportfolio />
        <Portfolio />
      </div>
  )
}
