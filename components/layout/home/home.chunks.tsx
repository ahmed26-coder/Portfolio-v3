import { Dot, MapPin, Bookmark, ArrowRight, Github } from "lucide-react";
import { Code, Rocket, Paintbrush } from "lucide-react";
import Motion from "@/lib/motion.hand";
import Link from "next/link";
import ProjectsList from "./home.client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export default function Home() {

  return (
    <>
      <div className="container mx-auto mt-[28%] sm:mt-[15%] lg:mt-[7%] w-full xl:max-w-[1800px]">
        <p className=" px-5 rounded-full flex items-center w-fit gap-1 bg-[#09E37D]/16 text-[#088046] dark:text-[#12C971]">
          <Dot size={40} />
          Available For Work
        </p>

        <h1 className="text-4xl gap-3 font-bold dark:text-white flex flex-col sm:flex-row text-[#111111] mt-7 sm:mt-10">
          Hello! I&#39;m <span className=" -mt-2"> Ahmad Adham <Motion /></span>
        </h1>
        <h1 className="text-4xl font-bold dark:text-[#FFFFFF]/60 text-[#666666] mt-3">
          Front-end Developer | React & Next.js Expert
        </h1>

        <p className="flex items-center gap-1 text-[#A15830] dark:text-[#FABC9B] font-bold text-lg my-10">
          <MapPin />
          Egypt Cairo
        </p>

        <p className="text-[#666666] text-xl dark:text-[#FFFFFF]/60">
          As a passionate Front-end Developer, I am eager to create visually
          captivating and user-friendly designs.
          <br />
          I may be at the beginning of my journey, but I am dedicated to
          learning, growing, and building amazing experiences.
          <br />
          Let&#39;s collaborate and make something great together!
        </p>

        <div className="flex flex-col sm:flex-row sm:justify-start gap-5 mt-10 w-full">
          <Link href="/About" className="w-full sm:w-auto">
            <button aria-label="About me page" className="w-full cursor-pointer text-black dark:text-white bg-[#AEB1B7]/32 py-2 px-6 rounded-md text-lg">
              About Me
            </button>
          </Link>
          <a className="w-full sm:w-auto justify-center cursor-pointer flex items-center gap-2 border-2 py-1 px-6 text-lg border-[#AEB1B7] rounded-md" href="/ATS_Friendly_Technical_Resume__2_ (9).pdf" download><Bookmark className="text-[#AEB1B7] font-bold text-lg" />Download Cv</a>
        </div>
      </div>
    </>
  );
}


export function Services() {
  return (
    <section className="container mx-auto pt-10 w-full xl:max-w-[1800px]">
      <div className="text-center mb-12">
        <h5 className="text-muted-foreground text-sm uppercase tracking-widest">What I Offer</h5>
        <h2 className="text-3xl md:text-4xl font-bold text-primary font-play">Services</h2>
      </div>

      <div className="container mx-auto flex flex-wrap justify-between gap-6 px-4">
        {/* Web Design */}
        <article className="w-full dark:bg-zinc-900 sm:w-[48%] lg:w-[31%] p-6 rounded-2xl bg-muted transition-all border border-transparent hover:bg-transparent hover:border-primary hover:scale-[1.05]">
          <Paintbrush className="text-primary mb-4 w-12 h-12" />
          <h3 className="text-xl font-semibold mb-2">UI/UX Design</h3>
          <p className="text-sm text-muted-foreground">
            I design responsive and modern user interfaces that provide a smooth user experience across all devices.
          </p>
        </article>

        {/* Fast Performance */}
        <article className="w-full dark:bg-zinc-900 sm:w-[48%] lg:w-[31%] p-6 rounded-2xl bg-muted transition-all border border-transparent hover:bg-transparent hover:border-primary hover:scale-[1.05]">
          <Rocket className="text-primary mb-4 w-12 h-12" />
          <h3 className="text-xl font-semibold mb-2">Performance Optimization</h3>
          <p className="text-sm text-muted-foreground">
            I build fast and optimized websites using best practices like lazy loading, caching, and image optimization.
          </p>
        </article>

        {/* Clean Code */}
        <article className="w-full dark:bg-zinc-900 sm:w-[48%] lg:w-[31%] p-6 rounded-2xl bg-muted transition-all border border-transparent hover:bg-transparent hover:border-primary hover:scale-[1.05]">
          <Code className="text-primary mb-4 w-12 h-12" />
          <h3 className="text-xl font-semibold mb-2">Clean & Reusable Code</h3>
          <p className="text-sm text-muted-foreground">
            I write clean, reusable, and well-structured code using React, Tailwind CSS, and modern development tools.
          </p>
        </article>
      </div>
    </section>
  );
}

export function Project() {
  return (
    <section className="container mx-auto py-10 w-full xl:max-w-[1800px]">
      <div className=" mx-auto items-center text-center mt-10">
        <p className=" text-[#666666]">My Recent Work</p>
        <h2 className="text-5xl font-bold font-play">Projects</h2>
      </div>
      <ProjectsList limit={3} />
      <Link href="/portfolio">
        <button aria-label="all project page" className="border flex justify-center mx-auto cursor-pointer border-[#999999] py-1.5 font-medium px-5 rounded-lg items-center gap-2 hover:bg-[#9999]/20">
          All Projects <ArrowRight className="text-[#999999]" />
        </button>
      </Link>
    </section>
  )
}


export function FAQs() {
  return (
    <section id="faqs" className="pb-10 px-8 pt-5">
      <div className="container max-w-3xl mx-auto text-center">
        <p className="text-[#666666] mb-2">Answers to common questions about my skills and work</p>
        <h2 className="text-3xl font-bold mb-8 font-play">Frequently Asked Questions (FAQs)</h2>
        <Accordion type="single" collapsible defaultValue="q2" className="w-full text-start">
          <AccordionItem value="q1">
            <AccordionTrigger>What core skills do I have?</AccordionTrigger>
            <AccordionContent>
              I&#39;m skilled in HTML, CSS, JavaScript, React, Next.js, Tailwind CSS, and I understand the basics of TypeScript.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q2">
            <AccordionTrigger>Can I build a professional website from scratch?</AccordionTrigger>
            <AccordionContent>
              Yes, I can build responsive and modern designs using Front-End technologies, focusing on performance and user experience.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q3">
            <AccordionTrigger>Am I able to work with APIs?</AccordionTrigger>
            <AccordionContent>
              Yes, I have experience fetching data from APIs and integrating it into websites using React and Next.js.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q4">
            <AccordionTrigger>Can I edit or improve an existing website?</AccordionTrigger>
            <AccordionContent>
              Absolutely! I can analyze the existing codebase and enhance it or add new features.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section className="my-16">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Let&#39;s Connect & Create Together</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          I&#39;m always looking for opportunities to collaborate, learn, and create. Whether you have a project in mind
          or just want to connect, I&#39;d love to hear from you!
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/contact"><Button className="bg-white text-emerald-600 hover:bg-emerald-50">Get in Touch</Button></Link>
          <Link href="https://github.com/ahmed26-coder" target="_black"><Button variant="outline" className="border-white text-black hover:bg-emerald-50 dark:text-white dark:hover:bg-emerald-600">
            <Github className="mr-2 h-4 w-4" /> View My GitHub
          </Button></Link>
        </div>
      </div>
    </section>
  )
}
