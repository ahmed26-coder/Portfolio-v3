"use client"

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
    disc: string
    challenge: string
    solution: string
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
    const [allProjects, setAllProjects] = useState<ProjectDetail[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                setError(null)

                // Debug: طباعة الـ ID للتأكد من وجوده
                console.log("Project ID from props:", projectId)

                if (!projectId) {
                    setError("No project ID provided")
                    setLoading(false)
                    return
                }

                // جلب المشروع المحدد
                const { data: projectData, error: projectError } = await supabase
                    .from("Portfolio")
                    .select("*")
                    .eq("id", projectId)
                    .single()

                console.log("Project data:", projectData)
                console.log("Project error:", projectError)

                // جلب كل المشاريع للنافيجيشن
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

                // معالجة البيانات
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
                    <p className="text-muted-foreground">Loading project...</p>
                </div>
            </div>
        )
    }

    if (error || !project) {
        return (
            <div className="flex h-[70vh] items-center text-center justify-center min-h-screen mx-auto">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Project not found</h2>
                    <p className="mb-6 text-zinc-600 dark:text-zinc-400">
                        {error || "The project you're looking for doesn't exist or has been removed."}
                    </p>
                    <Button asChild>
                        <Link href="/projects">Back to Projects</Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 md:pt-16 -mb-20">
            {/* Back button */}
            <div className="mb-8">
                <Button variant="ghost" asChild className="group">
                    <Link href="/projects" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Back to Projects
                    </Link>
                </Button>
            </div>

            {/* Project header */}
            <div className="mb-12">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                    <div>
                        <div className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 mb-3">
                            Frontend Developer
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight mb-2">{project.title}</h1>
                        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl">{project.disc}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {project.demo && (
                            <Button asChild>
                                <Link href={project.demo} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4" />
                                    Live Demo
                                </Link>
                            </Button>
                        )}
                        {project.githup && (
                            <Button variant="outline" asChild>
                                <Link href={project.githup} target="_blank" rel="noopener noreferrer">
                                    <Github className="h-4 w-4" />
                                    Source Code
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
                    <h2 className="text-xl font-bold mb-4">Technologies Used</h2>
                    <div className="flex flex-wrap gap-2">
                        {project.techniques.map((tech, index) => (
                            <Badge key={`${tech}-${index}`}>{tech}</Badge>
                        ))}
                    </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="overview" className="mb-16 ">
                    <TabsList className="mb-6 dark:bg-zinc-900">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="challenge">Challenge</TabsTrigger>
                        <TabsTrigger value="solution">Solution</TabsTrigger>
                        <TabsTrigger value="outcome">Outcome</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview">
                        <p className="mb-4">{project.disc}</p>
                    </TabsContent>
                    <TabsContent value="challenge">
                        <p className="mb-4">{project.challenge}</p>
                    </TabsContent>
                    <TabsContent value="solution">
                        <p className="mb-4">{project.solution}</p>
                    </TabsContent>
                    <TabsContent value="outcome">
                        <p className="mb-4">
                            After building and deploying the project, I noticed a significant improvement in my development speed and problem-solving abilities. The application became a practical proof of concept that helped me validate core concepts such as state management, performance optimization, and user experience.
                        </p>
                    </TabsContent>
                </Tabs>

                <ProjectGallery images={project.images} title={project.title} />
                <DecorativeSeparator />

                {/* Related Projects */}
                <div className=" mt-8">
                    <h2 className="text-2xl font-bold ">Related Projects</h2>
                    <ProjectsList showFeatured={false} limit={3} />
                </div>
            </div>
        </div>
    )
}