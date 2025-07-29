import React from "react"
import { Lightbulb, Brain, Users, Smartphone, Bookmark } from "lucide-react"
import { Rocket, BookOpen, Code, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Motions from "@/lib/motion.image"
import Motion from "@/lib/motion.hand";

export default function About() {
  return (
    <div>
      <div className="flex flex-col lg:flex-row items-center gap-10">
        <div className="text-left">
          <h1 className="text-4xl gap-2 flex flex-col md:flex-row font-bold dark:text-white text-[#111111] mt-5 sm:mt-10">
            Hello! I&#39;m <span className="items-center md:-mt-2">Ahmad Adham <Motion /></span>
          </h1>
          <h1 className="text-3xl sm:text-4xl font-bold dark:text-[#FFFFFF]/60 text-[#666666] mt-3">
            Front-end Developer | React & Next.js Expert
          </h1>
          <p className="text-[#666666] text-xl lg:text-center dark:text-[#FFFFFF]/60 mt-5">
            As a passionate Front-end Developer, I am eager to create visually captivating and user-friendly designs. I may be at the beginning of my journey, but I am dedicated to learning, growing, and building amazing experiences. Let&#s collaborate and make something great together!
          </p>
        </div>
        <Motions />
      </div>

      <div className="flex justify-center sm:justify-start mt-10">
        <a
          className="w-full sm:w-auto justify-center cursor-pointer flex items-center gap-2 border-2 py-1 px-6 text-lg border-[#AEB1B7] rounded-md"
          href="/ATS_Friendly_Technical_Resume__2_ (9).pdf"
          download
        >
          <Bookmark className="text-[#AEB1B7] font-bold text-lg" />
          Download Cv
        </a>
      </div>
    </div>
  )
}


export function Approach() {
  const approachItems = [
    {
      icon: <Lightbulb className="w-6 h-6 text-yellow-500" />,
      text: "I focus on writing clean and maintainable code.",
    },
    {
      icon: <Brain className="w-6 h-6 text-purple-500" />,
      text: "I'm always learning and improving my skills.",
    },
    {
      icon: <Users className="w-6 h-6 text-blue-500" />,
      text: "I value communication and teamwork.",
    },
    {
      icon: <Smartphone className="w-6 h-6 text-green-500" />,
      text: "I care about responsiveness and performance.",
    },
  ]


  return (
    <section className="p-8">
      <div className="container max-w-5xl mx-auto text-center">
        <p className="text-[#666666] mb-2">More than just code</p>
        <h2 className="text-3xl font-bold mb-8 font-play">My Approach</h2>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {approachItems.map((item, index) => (
            <Card
              key={index}
              className="flex items-start p-4 space-x-4 text-left dark:bg-zinc-900 transition-all duration-300 hover:shadow-lg hover:scale-[1.03] hover:border-primary"
            >
              <div>{item.icon}</div>
              <CardContent className="p-0">{item.text}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}



const learningSteps = [
  {
    title: "First Steps",
    description: "Started learning the fundamentals with C++, OOP, and algorithms.",
    icon: <BookOpen className="text-purple-500 w-10 h-10" />,
  },
  {
    title: "My First Project",
    description: "Built my first complete project using only React.",
    icon: <Code className="text-blue-500 w-10 h-10" />,
  },
  {
    title: "Exploring the Web",
    description: "Learned HTML and CSS to structure and style websites.",
    icon: <Rocket className="text-yellow-500 w-10 h-10" />,
  },
  {
    title: "Moving Forward",
    description: "Now working with Next.js, Tailwind, Supabase and more.",
    icon: <TrendingUp className="text-green-500 w-10 h-10" />,
  },
];


export function Learning() {
  return (
    <section className="py-12 px-8">
      <div className="container max-w-4xl mx-auto text-center">
        <p className="text-[#666666] mb-2">My Learning Path</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-8 font-play ">How I Started</h2>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2">
          {learningSteps.map((step, index) => (
            <div
              key={index}
              className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-md text-left space-y-1.5 items-start"
            >
              {step.icon}
              <div>
                <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                <p className="text-muted-foreground dark:text-gray-300">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


export function Journey() {
  const steps = [
    {
      date: "August 2024",
      title: "Beginning My Coding Journey",
      desc: "Started learning HTML, CSS, and JavaScript fundamentals through online courses and tutorials. Built my first static websites and began to understand the basics of web development.",
      badges: ["HTML", "CSS", "JavaScript Basics"],
    },
    {
      date: "November 2024",
      title: "Diving into React",
      desc: "After building a foundation with vanilla JavaScript, I began learning React. Started with the core concepts like components, props, and state, then moved on to hooks and more advanced patterns.",
      badges: ["React", "Components", "Hooks"],
    },
    {
      date: "April 2025",
      title: "Exploring Next.js & Tailwind",
      desc: "Expanded my skills to include Next.js for its server-side rendering capabilities and Tailwind CSS for rapid UI development. Started building more complex projects with these technologies.",
      badges: ["Next.js", "Tailwind CSS", "Responsive Design"],
    },
    {
      date: "Present",
      title: "Continuous Learning & Building",
      desc: "Currently focused on deepening my understanding of React and Next.js while exploring TypeScript and state management solutions. Building projects to apply what I’ve learned and discover new challenges.",
      badges: ["TypeScript", "State Management", "Project Building"],
    },
  ];

  return (
<section className="my-16 max-w-6xl mx-auto px-4">
  <div className="text-center mb-12">
    <p className="text-[#666666] mb-2 ">My Learning Path</p>
    <h2 className="text-3xl md:text-4xl font-bold font-play">My Learning Journey</h2>
  </div>
  <div className="relative">
    <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-emerald-200" />

    <div className="space-y-16">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`relative flex flex-col md:flex-row items-center ${
            index % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"
          }`}
        >
          <div className="absolute left-1/2 transform rounded-full -translate-x-1/2 bg-white dark:bg-zinc-900 z-10">
            <div className="w-6 h-6 rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center">
              <div className="w-2 h-2 bg-emerald-600 rounded-full" />
            </div>
          </div>
          <div
            className={`md:w-[48%] w-full bg-white dark:bg-zinc-900 border border-gray-200 rounded-lg p-4 shadow-md
              ${
                index % 2 === 0
                  ? "md:pr-12 md:ml-5"
                  : "md:pl-12 md:mr-5"
              }`}
          >
            <div className="text-sm text-emerald-600 font-medium mb-2">{step.date}</div>
            <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{step.desc}</p>
            <div className="flex flex-wrap gap-2">
              {step.badges.map((badge, i) => (
                <span
                  key={i}
                  className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

  );
}

