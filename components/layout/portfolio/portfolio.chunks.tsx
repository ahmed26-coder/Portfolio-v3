import React from 'react'
import { Code, Lightbulb, Zap } from 'lucide-react'
import { Badge } from "@/components/ui/badge"


export default function Topportfolio() {
  return (
    <div className=" mx-auto items-center text-center mt-10">
      <p className=" text-[#666666]">My Recent Work</p>
      <h2 className="text-5xl font-bold font-play">Projects</h2>
    </div>
  )
}


export function Focus() {
  return (
    <section className="my-16 mx-10">
      <div className=" mx-auto items-center text-center mt-10">
        <p className="text-[#666666]">What I’m currently improving</p>
        <h2 className="text-2xl font-bold mb-8 font-play">My Development Focus</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-600 dark:hover:border-emerald-200 rounded-lg p-6 hover:border-emerald-200 transition-colors">
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
            <Code className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Frontend Development</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Building responsive, accessible, and visually appealing user interfaces using modern web technologies.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200">React</Badge>
            <Badge className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200">Next.js</Badge>
            <Badge className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200">
              Tailwind CSS
            </Badge>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border dark:border-gray-600 border-gray-200 rounded-lg p-6 dark:hover:border-emerald-200 hover:border-emerald-200 transition-colors">
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
            <Zap className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">UI/UX Principles</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Learning to create intuitive user experiences with thoughtful design patterns and accessibility in mind.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200">
              Responsive Design
            </Badge>
            <Badge className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200">
              Accessibility
            </Badge>
            <Badge className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200">
              User-Centered Design
            </Badge>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border dark:border-gray-600 border-gray-200 rounded-lg p-6 dark:hover:border-emerald-200 hover:border-emerald-200 transition-colors">
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
            <Lightbulb className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Problem Solving</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Developing my analytical thinking and debugging skills to tackle complex coding challenges effectively.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200">
              Algorithms
            </Badge>
            <Badge className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200">
              Data Structures
            </Badge>
            <Badge className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200">
              Debugging
            </Badge>
          </div>
        </div>
      </div>
    </section>
  )
}
