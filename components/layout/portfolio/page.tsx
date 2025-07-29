import React from 'react'
import Portfolio from './portfolio.client'
import Topportfolio, { Focus } from './portfolio.chunks'

export default function page() {
  return (
      <div className="max-w-6xl mt-25 lg:mt-0 w-full">
        <Focus />
        <Topportfolio />
        <Portfolio />
      </div>
  )
}
