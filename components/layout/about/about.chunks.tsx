import React from "react"
import { Lightbulb, Brain, Users, Smartphone, Bookmark } from "lucide-react"
import { Rocket, BookOpen, Code, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Motions from "@/lib/motion.image"
import Motion from "@/lib/motion.hand";
import { getTranslations } from 'next-intl/server';

export default async function About() {
  const t = await getTranslations('AboutPage');
  return (
    <div>
      <div className="flex flex-col lg:flex-row items-center gap-10">
        <div className="">
          <h1 className=" text-3xl sm:text-4xl md:items-center gap-3 font-bold dark:text-white flex flex-col sm:flex-row sm:flex-wrap text-[#111111] mt-7 sm:mt-10">
            {t("hi")}<span>{t("title")}<span className=" -mt-2"><Motion /></span></span>
          </h1>
          <h1 className="text-3xl sm:text-4xl font-bold dark:text-[#FFFFFF]/60 text-[#666666] mt-3">
            {t('type')}
          </h1>
          <p className="text-[#666666] text-xl lg:text-center dark:text-[#FFFFFF]/60 mt-5">
            {t('about')}
          </p>
        </div>
        <Motions />
      </div>

      <div className="flex justify-center sm:justify-start mt-10">
        <a
          className="w-full sm:w-auto justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-900 flex items-center gap-2 border-2 py-1 px-6 text-lg border-[#AEB1B7] rounded-md"
          href="/ATS_Friendly_Technical_Resume__2_ (9).pdf"
          download
        >
          <Bookmark className="text-[#AEB1B7] font-bold text-lg" />
          {t('button1')}
        </a>
      </div>
    </div>
  )
}

// تعريف الأنواع للأيقونات
type IconName = 'Lightbulb' | 'Brain' | 'Users' | 'Smartphone';

export async function Approach() {
  const t = await getTranslations("AboutPage");
  const approachItems = [0, 1, 2, 3].map((i) => ({
    icon: t(`approachItems.${i}.icon`) as IconName,
    color: t(`approachItems.${i}.color`),
    text: t(`approachItems.${i}.text`),
  }));

  const iconsMaps: Record<IconName, React.ReactElement> = {
    Lightbulb: <Lightbulb />,
    Brain: <Brain />,
    Users: <Users />,
    Smartphone: <Smartphone />,
  };

  return (
    <section className="p-8">
      <div className="container max-w-5xl mx-auto text-center">
        <p className="text-[#666666] mb-2">{t('just')}</p>
        <h2 className="text-3xl font-bold mb-8 font-play">{t('Approach')}</h2>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {approachItems.map((item, index) => (
            <Card
              key={index}
              className={`flex items-start p-4 space-x-4 text-left dark:bg-zinc-900 transition-all duration-300 hover:shadow-lg hover:scale-[1.03] hover:border-primary`}
            >
              <div className={item.color}>{iconsMaps[item.icon]}</div>
              <CardContent className="p-0">{item.text}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// تعريف الأنواع لأيقونات التعلم
type LearningIconName = 'BookOpen' | 'Code' | 'Rocket' | 'TrendingUp';

export async function Learning() {
  const t = await getTranslations('AboutPage');
  const learningSteps = [0, 1, 2, 3].map((i) => ({
    icon: t(`learningSteps.${i}.icon`) as LearningIconName,
    color: t(`learningSteps.${i}.color`),
    title: t(`learningSteps.${i}.title`),
    description: t(`learningSteps.${i}.description`)
  }));

  const iconsMap: Record<LearningIconName, React.ReactElement> = {
    BookOpen: <BookOpen className=" w-9 h-9" />,
    Code: <Code className=" w-9 h-9" />,
    Rocket: <Rocket className=" w-9 h-9" />,
    TrendingUp: <TrendingUp className=" w-9 h-9" />,
  };

  return (
    <section className="py-12 px-8">
      <div className="container max-w-4xl mx-auto text-center">
        <p className="text-[#666666] mb-2">{t('Learning')}</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-8 font-play ">{t('how')}</h2>

        <div className="grid gap-6 sm:grid-cols-2 text-start md:grid-cols-2">
          {learningSteps.map((step, index) => (
            <div
              key={index}
              className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-md space-y-1.5 items-start transition-all duration-300 hover:shadow-lg hover:scale-[1.03] hover:border-primary"
            >
              <div className={step.color}>
                {iconsMap[step.icon]}
              </div>

              <div>
                <h3 className="text-lg font-semibold  mb-1">{step.title}</h3>
                <p className="text-muted-foreground  dark:text-gray-300">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export async function Journey() {
  const t = await getTranslations('AboutPage');

  const steps = [0, 1, 2, 3].map((i) => ({
    date: t(`steps.${i}.date`),
    title: t(`steps.${i}.title`),
    desc: t(`steps.${i}.desc`),
    badges: t.raw(`steps.${i}.badges`) as string[] // تأكيد النوع
  }));

  return (
    <section className="my-16 max-w-6xl mx-auto px-4">
      <div className="text-center mb-12">
        <p className="text-[#666666] mb-2 ">{t('path')}</p>
        <h2 className="text-3xl md:text-4xl font-bold font-play">{t('journey')}</h2>
      </div>

      <div className="relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-emerald-200" />

        <div className="space-y-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"}`}
            >
              <div className="absolute left-1/2 transform rounded-full -translate-x-1/2 bg-white dark:bg-zinc-900 z-10">
                <div className="w-6 h-6 rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                </div>
              </div>

              <div
                className={`md:w-[46%] w-full bg-white dark:bg-zinc-900 border border-gray-200 rounded-lg p-4 shadow-md
                ${index % 2 === 0 ? "md:px-12 md:mx-5" : "md:px-12 md:mx-5"}`}
              >
                <div className="text-sm text-emerald-600 font-medium mb-2">{step.date}</div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{step.desc}</p>

                <div className="flex flex-wrap gap-2">
                  {step.badges.map((badge: string, i: number) => (
                    <span key={i} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
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