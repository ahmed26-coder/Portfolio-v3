import { Github, Linkedin, Mail } from "lucide-react";
import ContactSection from "./contact.client";

function Contact() {
  return (
    <section className=" relative min-h-screen pt-[25%] sm:pt-[13%] lg:pt-[5%] pb-[10%] sm:pb-0 sm:py-[5%] w-full ">
      <div className="xl:max-w-[1800px] mx-auto ">
        <div className="text-center mb-5 sm:mb-3 lg:mb-10">
          <h5 className="text-gray-500 text-lg">Get In Touch</h5>
          <h2 className="text-3xl md:text-4xl font-bold font-play ">Contact Me</h2>
        </div>
        <ContactSection />
      </div>
    </section>
  );
}

export default Contact;


export function Contactleft() {
  return (
    <div className="space-y-5 sm:space-y-8">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
        Let&#39;s Connect
      </h1>
      <p className="text-xl font-medium">
        I&#39;m always thrilled to dive into exciting new projects,
        explore bold and creative ideas, and seize incredible
        opportunities to collaborate and bring your unique visions to
        life in the most impactful way possible.
      </p>

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Mail className="w-6 h-6 text-blue-500" />
          <a
            href="mailto:ahmedadhem330@gmail.com"
            target="_blank"
            className="hover:text-blue-500 text-lg font-medium transition-colors"
          >
            ahmedadhem330@gmail.com
          </a>
        </div>
        <div className="flex items-center space-x-4">
          <Github className="w-6 h-6 text-blue-500" />
          <a
            href="https://github.com/ahmed26-coder"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 text-lg font-medium transition-colors"
          >
            github.com
          </a>
        </div>
        <div className="flex items-center space-x-4">
          <Linkedin className="w-6 h-6 text-blue-500" />
          <a
            href="https://www.linkedin.com/in/ahmed-adham-479334331"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 text-lg font-medium transition-colors"
          >
            linkedin.com
          </a>
        </div>
      </div>
    </div>
  )
}
