"use client"

import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import FeaturedProjectCard from "@/lib/featuredprojectcard"
import ProjectCard from "@/lib/projectcard"
import Image from "next/image";
import { ArrowRight } from "lucide-react"
import { Link } from '@/i18n/navigation';

type Skill = {
    id: number;
    title: string;
    img: string;
    description: string;
};

interface Project {
    id: string
    title: string
    disc: {
        en: string
        ar: string
    }
    image: string
    demo?: string
    githup?: string
    techniques: string[]
    featured: boolean
}

interface ProjectsListProps {
    limit?: number;
    showFeatured?: boolean;
}

export default function ProjectsList({
    limit,
    showFeatured = true
}: ProjectsListProps) {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const t = useTranslations('HomePage');
    useEffect(() => {
        const fetchProjects = async () => {
            const { data, error } = await supabase
                .from("Portfolio")
                .select("*")

            if (error) {
                console.error("Error fetching projects:", error)
                return
            }

            const shuffledProjects = shuffleArray(data || [])
            setProjects(shuffledProjects)
            setLoading(false)
        }

        fetchProjects()
    }, [])

    const shuffleArray = (array: Project[]) => {
        return array
            .map((value) => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-fit w-full py-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-muted-foreground">{t('Loading2')}</p>
                </div>
            </div>

        )
    }

    return (
        <div className="mx-auto max-w-7xl px-3 py-12 md:py-16 space-y-12">
            {showFeatured && (
                <>
                    {projects
                        .filter((project) => project.featured)
                        .map((project) => (
                            <FeaturedProjectCard key={project.id} {...project} />
                        ))}
                </>
            )}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projects
                    .filter((project) => !project.featured)
                    .slice(0, limit !== undefined ? limit : undefined)
                    .map((project) => (
                        <ProjectCard key={project.id} {...project} />
                    ))}
            </div>
        </div>
    );
}


export function Skills({ isBoxedLayout = false }: { isBoxedLayout?: boolean }) {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const locale = useLocale();
    const t = useTranslations('HomePage');
    useEffect(() => {
        const fetchSkills = async () => {
            const { data, error } = await supabase.from("Skills").select("*");
            if (error) {
                console.error("Error fetching skills:", error.message);
            } else if (data) {
                const shuffled = data.sort(() => Math.random() - 0.5);
                setSkills(shuffled);
            }
            setLoading(false);
        };

        fetchSkills();
    }, []);


    if (isBoxedLayout) {
        return (
            <>
                <div className="text-center my-12">
                    <h5 className="text-muted-foreground text-sm uppercase tracking-widest">{t('skills')}</h5>
                    <h2 className="text-3xl md:text-4xl font-bold text-primary font-play">{t('experience')}</h2>
                </div>
                <div className="border-2 border-gray-300 my-10 dark:border-[#FFFFFF]/6 rounded-lg p-5 sm:p-10">
                    <h2 className="text-3xl font-bold text-center sm:text-start">
                        {t('User')}
                    </h2>
                    <p className="text-[#999999] text-center sm:text-start">
                        {t('Programs')}
                    </p>

                    {loading ? (
                        <div className="max-h-[400px]">
                            <div className="flex items-center justify-center min-h-fit w-full py-20">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                                    <p className="text-muted-foreground">{t('Loading1')}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
                            {skills.map((item) => (
                                <article key={item.id} className="flex gap-4 items-center">
                                    {item.title === "Next.js" ? (
                                        <div className="bg-white rounded-full flex items-center justify-center">
                                            <Image width={50} height={50} src={item.img} alt={item.title} priority />
                                        </div>
                                    ) : (
                                        <Image width={50} height={50} src={item.img} alt={item.title} priority />
                                    )}
                                    <div>
                                        <h2 className="text-2xl font-bold">{item.title}</h2>
                                        <p className="text-[#999999] dark:text-[#FFFFFF]/40">{item.description}</p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </>
        );
    }
    return (
        <>
            <div className="text-center my-12">
                <h5 className="text-muted-foreground text-sm uppercase tracking-widest">{t('skills')}</h5>
                <h2 className="text-3xl md:text-4xl font-bold text-primary font-play">{t('experience')}</h2>
            </div>
            <div className="mt-5 max-w-5xl mx-auto">
                {loading ? (
                    <div className="flex items-center text-center justify-center min-h-screen mx-auto h-[70vh]">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                            <p className="text-muted-foreground">{t('Loading1')}</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 px-4 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                        {skills.slice(0, 8).map((item) => (
                            <article
                                key={item.id}
                                className="p-6 rounded-2xl items-center dark:bg-zinc-900 flex gap-3 bg-muted transition-all border border-transparent hover:bg-transparent hover:border-primary hover:scale-[1.05]"
                            >
                                {item.title === "Next.js" ? (
                                    <div className="bg-white rounded-full h-fit w-fit flex items-center justify-center">
                                        <Image width={50} height={50} src={item.img} alt={item.title} priority />
                                    </div>
                                ) : (
                                    <Image width={50} height={50} src={item.img} alt={item.title} priority />
                                )}
                                <div>
                                    <h3 className="text-xl font-semibold">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
                <Link locale={locale} href="/about">
                    <button
                        aria-label="all project page"
                        className="border flex justify-center mt-10 mx-auto cursor-pointer border-[#999999] py-1.5 font-medium px-5 rounded-lg items-center gap-2 hover:bg-[#9999]/20"
                    >
                        {t('button3')}
                        <ArrowRight
                            className={`text-[#999999] transform transition-transform duration-300 ${locale === 'ar' ? 'rotate-180' : ''
                                }`}
                        />
                    </button>
                </Link>
            </div>
        </>
    );
}


export function Project() {
    const locale = useLocale();
    const t = useTranslations('HomePage');
    return (
        <section className="container mx-auto py-10 w-full xl:max-w-[1800px]">
            <div className=" mx-auto items-center text-center mt-10">
                <p className=" text-[#666666]">{t("workproject")}</p>
                <h2 className="text-5xl font-bold font-play">{t("project")}</h2>
            </div>
            <ProjectsList limit={3} />
            <Link locale={locale} href="/portfolio">
                <button aria-label="all project page" className="border flex justify-center mx-auto cursor-pointer border-[#999999] py-1.5 font-medium px-5 rounded-lg items-center gap-2 hover:bg-[#9999]/20">
                    {t("button4")}
                    <ArrowRight
                        className={`text-[#999999] transform transition-transform duration-300 ${locale === 'ar' ? 'rotate-180' : ''
                            }`}
                    />
                </button>
            </Link>
        </section>
    )
}


export function Buttom() {
    const locale = useLocale();
    const t = useTranslations('HomePage');
    return (
        <div>
            <Link locale={locale} href="/About" className="w-full sm:w-auto">
                <button aria-label="About me page" className="w-full cursor-pointer text-black dark:text-white bg-[#AEB1B7]/32 py-2 px-6 rounded-md text-lg">
                    {t("button1")}
                </button>
            </Link>
        </div>
    )
}



