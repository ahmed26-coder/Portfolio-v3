import React from 'react'
import { Code, Lightbulb, Zap } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import {getTranslations} from 'next-intl/server';

export default async function Topportfolio() {
  const t = await getTranslations('PortfolioPage');
  return (
    <div className=" mx-auto items-center text-center mt-10">
      <p className=" text-[#666666]">{t('workproject')}</p>
      <h2 className="text-5xl font-bold font-play">{t('project')}</h2>
    </div>
  )
}



export async function Focus() {
  const t = await getTranslations('PortfolioPage');

  const focusData = [0, 1, 2].map((i) => ({
    icon: t(`focusData.${i}.icon`),
    title: t(`focusData.${i}.title`),
    desc: t(`focusData.${i}.desc`),
    skills: t.raw(`focusData.${i}.skills`) as string[]
  }));

  const iconMap = {
    zap: Zap,
    lightbulb: Lightbulb,
    code: Code,
  };

  return (
    <section className="container mx-auto pt-10 w-full xl:max-w-[1800px]">
      <div className="text-center mb-12">
        <p className="text-muted-foreground text-sm uppercase tracking-widest">{t('improving')}</p>
        <h2 className="text-3xl md:text-4xl font-bold text-primary font-play">{t('development')}</h2>
      </div>

      <div className="container mx-auto flex flex-wrap justify-between gap-6 px-4">
        {focusData.map((item, index) => {
          const IconComponent = iconMap[item.icon as keyof typeof iconMap];

          return (
            <article
              key={index}
              className="w-full dark:bg-zinc-900 bg-white sm:w-[48%] lg:w-[31%] p-6 rounded-2xl transition-all border border-transparent hover:bg-transparent hover:border-primary hover:scale-[1.05]"
            >
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                {IconComponent ? (
                  <IconComponent className="w-6 h-6 text-emerald-600" />
                ) : (
                  <span className="text-emerald-600">{item.icon}</span>
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground dark:text-gray-300 mb-4">{item.desc}</p>

              <div className="flex flex-wrap gap-2">
                {item.skills?.map((skill, idx) => (
                  <Badge
                    key={idx}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}