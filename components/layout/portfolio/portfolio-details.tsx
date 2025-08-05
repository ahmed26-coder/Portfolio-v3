"use client"

import {useTranslations} from 'next-intl';
import { useLocale } from 'next-intl';
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
    ArrowLeft,
    ExternalLink,
    Github,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProjectsList from "../home/home.client"
import { supabase } from "@/lib/supabase"
import ProjectGallery from "@/lib/projectgallery"
import DecorativeSeparator from "@/lib/decorative-separator"

interface ProjectImage {
    src: string
    alt: string
}

interface ProjectDetail {
    id: string
    title: string
    disc: {
        en: string
        ar: string
    }
    solution: {
        en: string
        ar: string
    }
    challenge: {
        en: string
        ar: string
    }

    image: string
    images: ProjectImage[]
    demo?: string
    githup?: string
    techniques: string[]
}

interface ProjectDetailPageProps {
    projectId: string
}

export default function ProjectDetailPage({ projectId }: ProjectDetailPageProps) {
    const [project, setProject] = useState<ProjectDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [, setAllProjects] = useState<ProjectDetail[]>([])
    const locale = useLocale() as 'en' | 'ar';
    const t = useTranslations('PortfolioPageid');
    const dir = locale === 'ar' ? 'rtl' : 'ltr';
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                setError(null)
                console.log("Project ID from props:", projectId)

                if (!projectId) {
                    setError("No project ID provided")
                    setLoading(false)
                    return
                }
                const { data: projectData, error: projectError } = await supabase
                    .from("Portfolio")
                    .select("*")
                    .eq("id", projectId)
                    .single()

                console.log("Project data:", projectData)
                console.log("Project error:", projectError)
                const { data: allProjectsData, error: allProjectsError } = await supabase
                    .from("projects")
                    .select("*")
                    .order("id")

                if (projectError) {
                    console.error("Error fetching project:", projectError)
                    setError("Project not found or database error")
                    setLoading(false)
                    return
                }

                if (!projectData) {
                    setError("Project not found")
                    setLoading(false)
                    return
                }
                const images = typeof projectData.images === "string"
                    ? JSON.parse(projectData.images)
                    : (projectData.images || [])

                const techniques = typeof projectData.techniques === "string"
                    ? JSON.parse(projectData.techniques)
                    : (projectData.techniques || [])

                setProject({
                    ...projectData,
                    images: Array.isArray(images) ? images : [],
                    techniques: Array.isArray(techniques) ? techniques : []
                })

                if (allProjectsData && !allProjectsError) {
                    setAllProjects(allProjectsData)
                }

            } catch (err) {
                console.error("Unexpected error:", err)
                setError("An unexpected error occurred")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [projectId])


    if (loading) {
        return (
            <div className="flex items-center text-center justify-center min-h-screen mx-auto h-[70vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-muted-foreground">{t('Loading')}</p>
                </div>
            </div>
        )
    }

    if (error || !project) {
        return (
            <div className="flex h-[70vh] items-center text-center justify-center min-h-screen mx-auto">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">{t('not')}</h2>
                    <p className="mb-6 text-zinc-600 dark:text-zinc-400">
                        {error || "The project you're looking for doesn't exist or has been removed."}
                    </p>
                    <Button asChild>
                        <Link href="/portfolio">{t('back')}</Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-7xl text-start px-4 py-12 md:pt-16 -mb-20">
            <div className="mb-8">
                <Button variant="ghost" asChild className="group">
                    <Link href="/portfolio" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        {t('back')}
                    </Link>
                </Button>
            </div>

            {/* Project header */}
            <div className="mb-12">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                    <div>
                        <div className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 mb-3">
                            {t('type')}
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight mb-2">{project.title}</h1>
                        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl">{project.disc[locale]}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {project.demo && (
                            <Button asChild>
                                <Link href={project.demo} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4" />
                                    {t('live')}
                                </Link>
                            </Button>
                        )}
                        {project.githup && (
                            <Button variant="outline" asChild>
                                <Link href={project.githup} target="_blank" rel="noopener noreferrer">
                                    <Github className="h-4 w-4" />
                                    {t('source')}
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Main Image */}
                <div className="relative aspect-video w-full overflow-hidden rounded-xl mb-12">
                    <Image
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        width={1200}
                        height={800}
                        priority
                        className="h-full w-full object-cover"
                    />
                </div>

                {/* Techniques */}
                <div className="mb-12">
                    <h2 className="text-xl font-bold mb-4">{t('Technologies')}</h2>
                    <div className="flex flex-wrap gap-2">
                        {project.techniques.map((tech, index) => (
                            <Badge key={`${tech}-${index}`}>{tech}</Badge>
                        ))}
                    </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="overview" className="mb-16" dir={dir}>
                    <TabsList className="mb-6 dark:bg-zinc-900">
                        <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
                        <TabsTrigger value="challenge">{t('challenge')}</TabsTrigger>
                        <TabsTrigger value="solution">{t('solution')}</TabsTrigger>
                        <TabsTrigger value="outcome">{t('outcome')}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview">
                        <p className="mb-4">{project.disc[locale]}</p>
                    </TabsContent>
                    <TabsContent value="challenge">
                        <p className="mb-4">{project.challenge[locale]}</p>
                    </TabsContent>
                    <TabsContent value="solution">
                        <p className="mb-4">{project.solution[locale]}</p>
                    </TabsContent>
                    <TabsContent value="outcome">
                        <p className="mb-4">
                            {t('outtype')}
                        </p>
                    </TabsContent>
                </Tabs>

                <ProjectGallery images={project.images} title={project.title} />
                <DecorativeSeparator />

                <div className=" mt-8">
                    <h2 className="text-2xl font-bold ">{t('related')}</h2>
                    <ProjectsList showFeatured={false} limit={3} />
                </div>
            </div>
        </div>
    )
}