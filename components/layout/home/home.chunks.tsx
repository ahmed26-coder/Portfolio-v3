import { Dot, MapPin, Bookmark, Github } from "lucide-react";
import { Code, Rocket, Paintbrush } from "lucide-react";
import Motion from "@/lib/motion.hand";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { getTranslations } from 'next-intl/server';
import { Link } from "@/i18n/navigation";
import { Buttom } from "./home.client";

export default async function Home() {
  const t = await getTranslations('HomePage');
  return (
    <>
      <div className="container mx-auto px-3 mt-[28%] sm:mt-[15%] lg:mt-[7%] w-full xl:max-w-[1800px]">
        <p className=" px-5 rounded-full flex items-center w-fit bg-[#09E37D]/16 text-[#088046] dark:text-[#12C971]">
          <Dot size={48} strokeWidth={3} className="flex-shrink-0 w-9 h-9" />
          {t("work")}
        </p>

        <h1 className=" text-3xl sm:text-4xl md:items-center gap-3 font-bold dark:text-white flex flex-col sm:flex-row sm:flex-wrap text-[#111111] mt-7 sm:mt-10">
          {t("hi")}<span>{t("title")}<span className=" -mt-2"><Motion /></span></span>
        </h1>
        <h1 className="text-3xl sm:text-4xl font-bold dark:text-[#FFFFFF]/60 text-[#666666] mt-3">
          {t("type")}
        </h1>

        <p className="flex items-center gap-1 text-[#A15830] dark:text-[#FABC9B] font-bold text-lg my-10">
          <MapPin />
          {t("location")}
        </p>

        <p className=" max-w-5xl text-[#666666] text-xl dark:text-[#FFFFFF]/60">
          {t("about")}
        </p>

        <div className="flex flex-col sm:flex-row sm:justify-start gap-5 mt-10 w-full">
          <Buttom />
          <a className="w-full sm:w-auto justify-center cursor-pointer flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-zinc-900 border-2 py-1 px-6 text-lg border-[#AEB1B7] rounded-md" href="/ATS_Friendly_Technical_Resume__2_ (9).pdf" download><span><Bookmark className="text-[#AEB1B7] font-bold text-lg" /></span>{t("button2")}</a>
        </div>
      </div>
    </>
  );
}


export async function Services() {
  const t = await getTranslations('HomePage');

  const services = [0, 1, 2].map((i) => ({
    icon: t(`service.${i}.icon`),
    color: t(`service.${i}.color`),
    title: t(`service.${i}.title`),
    description: t(`service.${i}.description`)
  }));

  const iconMap = {
    Paintbrush: Paintbrush,
    Rocket: Rocket,
    Code: Code,
  };
  return (
    <section className="container mx-auto pt-10 w-full xl:max-w-[1800px]">
      <div className="text-center mb-12">
        <h5 className="text-muted-foreground text-sm uppercase tracking-widest">{t("Offer")}</h5>
        <h2 className="text-3xl md:text-4xl font-bold text-primary font-play">{t("services")}</h2>
      </div>

      <div className="container mx-auto flex flex-wrap justify-between gap-6 px-4">
        {services.map((service, index) => {
          const IconComponent = iconMap[service.icon as keyof typeof iconMap];

          return (
            <article
              key={index}
              className="w-full dark:bg-zinc-900 sm:w-[48%] lg:w-[31%] p-6 rounded-2xl bg-muted transition-all border border-transparent hover:bg-transparent hover:border-primary hover:scale-[1.05]"
            >
              <IconComponent className={`w-9 h-9 ${service.color}`} />
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-sm text-muted-foreground dark:text-gray-300">
                {service.description}
              </p>
            </article>
          );
        })}

      </div>
    </section>
  );
}


interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export async function FAQs() {
  const t = await getTranslations('HomePage');

  const faqData = t.raw('faqs') as Record<string, FAQItem>;

  const faqs: FAQItem[] = Object.values(faqData);

  return (
    <section id="faqs" className="pb-10 px-8 pt-5">
      <div className="container max-w-3xl mx-auto text-center">
        <p className="text-[#666666] mb-2">
          {t("answers")}
        </p>
        <h2 className="text-3xl font-bold mb-8 font-play">
          {t("FAQs")}
        </h2>

        <Accordion
          type="single"
          collapsible
          defaultValue="q2"
          className="w-full text-start"
        >
          {faqs.map((faq: FAQItem) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}


export async function Contact() {
  const t = await getTranslations('HomePage');
  return (
    <section className="my-16 max-w-5xl mx-auto">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">{t("Together")}</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          {t("dish")}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/contact"><Button className="bg-white text-emerald-600 hover:bg-emerald-50"><span>{t("button5")}</span></Button></Link>
          <Link href="https://github.com/ahmed26-coder" target="_black"><Button variant="outline" className="border-white text-black hover:bg-emerald-50 dark:text-white dark:hover:bg-emerald-600">
            <Github className="mr-2 h-4 w-4" /> <span>{t("button6")}</span>
          </Button></Link>
        </div>
      </div>
    </section>
  )
}
