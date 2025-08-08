"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Plus, Edit, Trash2, ExternalLink, Github, X, ImagePlus } from "lucide-react"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

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
  github?: string
  techniques: string[]
  featured?: boolean
}

interface ProjectGalleryProps {
  images: ProjectImage[]
  title: string
}

const ProjectGallery = ({ images, title }: ProjectGalleryProps) => {
  if (!images || images.length === 0) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-4">
      {images.map((image, index) => (
        <div key={index} className="relative">
          <Image
            src={image.src}
            alt={image.alt || `Image ${index + 1} for ${title}`}
            width={150}
            height={100}
            priority
            className="object-cover rounded border w-full h-auto"
            onError={() => {
              console.warn(`Failed to load gallery image ${index + 1}: ${image.src}`)
              toast.error(`Failed to load image ${index + 1} for ${title}. Using placeholder.`)
            }}
          />
        </div>
      ))}
    </div>
  )
}

export default function ProjectsPages() {
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<ProjectDetail | null>(null)
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null)
  const [additionalImagesPreviews, setAdditionalImagesPreviews] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [projects, setProjects] = useState<ProjectDetail[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [additionalIsUploading, setAdditionalIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [additionalUploadProgress, setAdditionalUploadProgress] = useState(0)
  const [newProject, setNewProject] = useState({
    title: "",
    disc: { en: "", ar: "" },
    solution: { en: "", ar: "" },
    challenge: { en: "", ar: "" },
    image: null as File | null,
    additionalImages: [] as File[],
    demo: "",
    github: "",
    techniques: "",
    featured: false
  })

  const FALLBACK_IMAGE = "/placeholder-image.jpg"

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    setLoading(true)
    const toastId = toast.loading("Loading Projects")

    try {
      const { data, error } = await supabase
        .from("Portfolio")
        .select("*")
        .order('created_at', { ascending: false })

      if (error) {
        toast.error(`Failed to fetch projects: ${error.message}`)
        return
      }

      const processedProjects = (data || []).map(project => {
        let images: ProjectImage[] = []
        let techniques: string[] = []

        // Parse images
        try {
          if (typeof project.images === "string" && project.images) {
            const parsedImages = JSON.parse(project.images)
            if (Array.isArray(parsedImages)) {
              if (parsedImages.every(item => typeof item === "string")) {
                images = parsedImages.map((url: string, index: number) => ({
                  src: isValidUrl(url) ? url : FALLBACK_IMAGE,
                  alt: `Image ${index + 1} for ${project.title}`
                }))
              } else if (parsedImages.every((item: unknown) => item && typeof item === "object" && ("src" in item || "url" in item))) {
                images = parsedImages.map((img: { id?: string; url?: string; src?: string; alt?: string }, index: number) => ({
                  src: img.src || img.url || FALLBACK_IMAGE,
                  alt: img.alt || `Image ${index + 1} for ${project.title}`
                }))
              }
            }
          } else if (Array.isArray(project.images)) {
            if (project.images.every((item: unknown) => typeof item === "string")) {
              images = project.images.map((url: string, index: number) => ({
                src: isValidUrl(url) ? url : FALLBACK_IMAGE,
                alt: `Image ${index + 1} for ${project.title}`
              }))
            } else {
              images = project.images.map((img: { id?: string; url?: string; src?: string; alt?: string }, index: number) => ({
                src: img.src || img.url || FALLBACK_IMAGE,
                alt: img.alt || `Image ${index + 1} for ${project.title}`
              }))
            }
          }
        } catch (e) {
          console.error(`Failed to parse images for project ${project.id}:`, e)
          images = []
        }

        // Parse techniques
        try {
          if (typeof project.techniques === "string" && project.techniques) {
            techniques = JSON.parse(project.techniques)
          } else if (Array.isArray(project.techniques)) {
            techniques = project.techniques
          }
        } catch (e) {
          console.error(`Failed to parse techniques for project ${project.id}:`, e)
          techniques = []
        }

        return {
          ...project,
          images,
          techniques,
          disc: project.disc || { en: '', ar: '' },
          solution: project.solution || { en: '', ar: '' },
          challenge: project.challenge || { en: '', ar: '' },
          image: project.image && isValidUrl(project.image) ? project.image : FALLBACK_IMAGE,
          featured: project.featured || false
        }
      })

      setProjects(processedProjects)
    } catch (error) {
      const errorMessage = typeof error === "object" && error !== null && "message" in error
        ? (error as { message?: string }).message
        : "Unknown error"
      toast.error(`Unexpected error occurred: ${errorMessage}`)
    } finally {
      setLoading(false)
      toast.dismiss(toastId)
    }
  }

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:image/')
    } catch {
      return false
    }
  }

  const checkImageExists = async (url: string): Promise<boolean> => {
    if (url === FALLBACK_IMAGE) return true
    try {
      const response = await fetch(url, { method: 'HEAD' })
      return response.ok
    } catch {
      return false
    }
  }

  const validateInputs = () => {
    if (!newProject.title.trim()) {
      toast.error("Project title is required")
      return false
    }
    if (!newProject.disc.en.trim() || !newProject.disc.ar.trim()) {
      toast.error("Both English and Arabic descriptions are required")
      return false
    }
    if (!newProject.solution.en.trim() || !newProject.solution.ar.trim()) {
      toast.error("Both English and Arabic solutions are required")
      return false
    }
    if (!newProject.challenge.en.trim() || !newProject.challenge.ar.trim()) {
      toast.error("Both English03:39 PM 8/5/2025 English and Arabic challenges are required")
      return false
    }
    if (!editingProject && !newProject.image) {
      toast.error("Main project image is required for new projects")
      return false
    }
    return true
  }

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const fileExt = file.name.split('.').pop()?.toLowerCase()
      if (!fileExt || !['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExt)) {
        toast.error("Only JPG, PNG, GIF, or WebP files are accepted")
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB")
        return
      }

      setNewProject({ ...newProject, image: file })
      setMainImagePreview(URL.createObjectURL(file))
    }
  }

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      const invalidFiles = files.filter(file => {
        const fileExt = file.name.split('.').pop()?.toLowerCase()
        return !fileExt || !['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExt) || file.size > 5 * 1024 * 1024
      })
      if (invalidFiles.length > 0) {
        toast.error("Some images are invalid. Only JPG, PNG, GIF, or WebP files under 5MB are accepted.")
        return
      }

      setNewProject({ ...newProject, additionalImages: [...newProject.additionalImages, ...files] })
      const newPreviews = files.map(file => URL.createObjectURL(file))
      setAdditionalImagesPreviews(prev => [...prev, ...newPreviews])
    }
  }

  const removeAdditionalImage = (index: number) => {
    const newImages = [...newProject.additionalImages]
    newImages.splice(index, 1)
    setNewProject({ ...newProject, additionalImages: newImages })

    const newPreviews = [...additionalImagesPreviews]
    newPreviews.splice(index, 1)
    setAdditionalImagesPreviews(newPreviews)
  }

  const uploadImage = async (file: File, folder: string = '') => {
    try {
      if (!file || file.size === 0) {
        throw new Error("Invalid file")
      }

      const fileExt = file.name.split('.').pop()?.toLowerCase()
      if (!fileExt || !['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExt)) {
        throw new Error("Invalid file type. Please use JPG, PNG, GIF, or WebP images.")
      }

      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const fullPath = folder ? `${folder}/${fileName}` : fileName

      setIsUploading(true)
      setUploadProgress(0)
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i)
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      const { error } = await supabase.storage
        .from('project')
        .upload(fullPath, file, {
          cacheControl: '3600',
          upsert: false
        })

      setIsUploading(false)
      setUploadProgress(0)

      if (error) {
        throw new Error(`Upload failed: ${error.message}`)
      }

      const { data: publicUrlData } = supabase.storage
        .from('project')
        .getPublicUrl(fullPath)

      if (!publicUrlData.publicUrl) {
        throw new Error("Failed to generate public URL")
      }

      if (!(await checkImageExists(publicUrlData.publicUrl))) {
        throw new Error(`Uploaded image is not accessible: ${publicUrlData.publicUrl}`)
      }

      return publicUrlData.publicUrl
    } catch (error) {
      setIsUploading(false)
      setUploadProgress(0)
      console.error("Image upload error:", error)
      throw error
    }
  }

  const deleteImage = async (imageUrl: string) => {
    try {
      if (!imageUrl || imageUrl === FALLBACK_IMAGE) {
        return
      }
      const url = new URL(imageUrl)
      const pathParts = url.pathname.split('/').filter(part => part)
      const bucketIndex = pathParts.findIndex(part => part === 'project')

      if (bucketIndex === -1 || bucketIndex >= pathParts.length - 1) {
        throw new Error("Invalid image URL format")
      }

      const fullPath = pathParts.slice(bucketIndex + 1).join('/')
      const { error } = await supabase.storage
        .from('project')
        .remove([fullPath])

      if (error) {
        throw new Error(`Failed to delete image: ${error.message}`)
      }
      console.log(`Deleted image: ${imageUrl}`)
    } catch (error) {
      console.error("Error deleting image:", error)
    }
  }

  const handleAddProject = async () => {
    if (!validateInputs() || isSubmitting) return

    setIsSubmitting(true)
    const toastId = toast.loading(editingProject ? "Updating Project" : "Adding Project")

    try {
      let imageUrl = editingProject?.image || ""
      let additionalImagesUrls: string[] = editingProject?.images ? editingProject.images.map(img => img.src) : []

      if (editingProject && newProject.image && imageUrl && imageUrl !== FALLBACK_IMAGE) {
        await deleteImage(imageUrl)
        imageUrl = ""
      }

      if (editingProject && newProject.additionalImages.length > 0 && additionalImagesUrls.length > 0) {
        for (const img of additionalImagesUrls) {
          if (img !== FALLBACK_IMAGE) {
            await deleteImage(img)
          }
        }
        additionalImagesUrls = []
      }

      if (newProject.image) {
        imageUrl = await uploadImage(newProject.image, 'main')
      }

      if (newProject.additionalImages && newProject.additionalImages.length > 0) {
        setAdditionalIsUploading(true)
        setAdditionalUploadProgress(0)
        const uploadPromises = newProject.additionalImages.map(async (file, index) => {
          setAdditionalUploadProgress(Math.round((index / newProject.additionalImages.length) * 100))
          return await uploadImage(file, 'gallery')
        })

        const newAdditionalImages = await Promise.all(uploadPromises)
        additionalImagesUrls = [...additionalImagesUrls, ...newAdditionalImages]
        setAdditionalIsUploading(false)
        setAdditionalUploadProgress(0)
      }

      const techniques = newProject.techniques
        ? newProject.techniques.split(',').map(tech => tech.trim()).filter(tech => tech.length > 0)
        : []

      const projectData = {
        title: newProject.title.trim(),
        disc: {
          en: newProject.disc.en.trim(),
          ar: newProject.disc.ar.trim()
        },
        solution: {
          en: newProject.solution.en.trim(),
          ar: newProject.solution.ar.trim()
        },
        challenge: {
          en: newProject.challenge.en.trim(),
          ar: newProject.challenge.ar.trim()
        },
        image: imageUrl || FALLBACK_IMAGE,
        images: JSON.stringify(additionalImagesUrls),
        demo: newProject.demo?.trim() || null,
        github: newProject.github?.trim() || null,
        techniques: JSON.stringify(techniques),
        featured: newProject.featured
      }

      let result
      if (editingProject) {
        result = await supabase
          .from("Portfolio")
          .update(projectData)
          .eq('id', editingProject.id)
          .select()
      } else {
        result = await supabase
          .from("Portfolio")
          .insert([projectData])
          .select()
      }

      if (result.error) {
        toast.error(`Failed to ${editingProject ? 'update' : 'add'} project: ${result.error.message}`)
        return
      }

      toast.success(`${editingProject ? 'Updated' : 'Added'} project successfully!`)
      setIsAddDialogOpen(false)
      resetForm()
      await fetchProjects()
    } catch (error) {
      const errorMessage = typeof error === "object" && error !== null && "message" in error
        ? (error as { message?: string }).message
        : "Unknown error"
      toast.error(`Unexpected error occurred: ${errorMessage}`)
      console.error("Add/Update error:", error)
    } finally {
      setIsSubmitting(false)
      toast.dismiss(toastId)
    }
  }

  const resetForm = () => {
    setIsAddDialogOpen(false)
    setEditingProject(null)
    setMainImagePreview(null)
    setAdditionalImagesPreviews([])
    setIsUploading(false)
    setAdditionalIsUploading(false)
    setUploadProgress(0)
    setAdditionalUploadProgress(0)
    setNewProject({
      title: "",
      disc: { en: "", ar: "" },
      solution: { en: "", ar: "" },
      challenge: { en: "", ar: "" },
      image: null,
      additionalImages: [],
      demo: "",
      github: "",
      techniques: "",
      featured: false
    })
  }

  const handleEditProject = (project: ProjectDetail) => {
    setEditingProject(project)
    setNewProject({
      title: project.title,
      disc: project.disc,
      solution: project.solution,
      challenge: project.challenge,
      image: null,
      additionalImages: [],
      demo: project.demo || "",
      github: project.github || "",
      techniques: project.techniques.join(", "),
      featured: project.featured || false
    })
    setMainImagePreview(project.image && isValidUrl(project.image) ? project.image : FALLBACK_IMAGE)
    setAdditionalImagesPreviews(project.images?.map(img => img.src && isValidUrl(img.src) ? img.src : FALLBACK_IMAGE) || [])
    setIsAddDialogOpen(true)
  }

  const handleDeleteProject = async (id: string) => {
    setProjectToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!projectToDelete) return

    const toastId = toast.loading("Deleting Project...")

    try {
      const project = projects.find(p => p.id === projectToDelete)
      if (!project) {
        toast.error("Project not found")
        return
      }

      const { error } = await supabase
        .from("Portfolio")
        .delete()
        .eq('id', projectToDelete)

      if (error) {
        toast.error(`Failed to delete project: ${error.message}`)
        return
      }

      if (project.image && project.image !== FALLBACK_IMAGE) {
        await deleteImage(project.image)
      }

      if (project.images && Array.isArray(project.images) && project.images.length > 0) {
        for (const img of project.images) {
          if (img.src && img.src !== FALLBACK_IMAGE) {
            await deleteImage(img.src)
          }
        }
      }

      toast.success("Project deleted successfully!")
      setIsDeleteDialogOpen(false)
      setProjectToDelete(null)
      await fetchProjects()
    } catch (error) {
      const errorMessage = typeof error === "object" && error !== null && "message" in error
        ? (error as { message?: string }).message
        : "Unknown error"
      toast.error(`Unexpected error occurred while deleting: ${errorMessage}`)
      console.error("Delete error:", error)
    } finally {
      toast.dismiss(toastId)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen mx-auto h-[70vh] px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground text-sm sm:text-base">Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Manage your portfolio projects and showcase your work</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          if (!open) resetForm()
          setIsAddDialogOpen(open)
        }}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-[85vw] sm:max-w-4xl md:max-w-5xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
              <DialogDescription className="text-sm sm:text-base">
                {editingProject ? "Update your project details" : "Add a new project to your portfolio"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title" className="text-sm sm:text-base">Project Title</Label>
                <Input
                  id="title"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  placeholder="e.g., E-commerce Platform"
                  className="text-sm sm:text-base"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="disc_en" className="text-sm sm:text-base">Description (English)</Label>
                <Textarea
                  id="disc_en"
                  value={newProject.disc.en}
                  onChange={(e) => setNewProject({ ...newProject, disc: { ...newProject.disc, en: e.target.value } })}
                  placeholder="Describe your project in English..."
                  rows={3}
                  className="text-sm sm:text-base"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="disc_ar" className="text-sm sm:text-base">Description (Arabic)</Label>
                <Textarea
                  id="disc_ar"
                  value={newProject.disc.ar}
                  onChange={(e) => setNewProject({ ...newProject, disc: { ...newProject.disc, ar: e.target.value } })}
                  placeholder="وصف المشروع بالعربية..."
                  rows={3}
                  dir="rtl"
                  className="text-sm sm:text-base"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="solution_en" className="text-sm sm:text-base">Solution (English)</Label>
                <Textarea
                  id="solution_en"
                  value={newProject.solution.en}
                  onChange={(e) => setNewProject({ ...newProject, solution: { ...newProject.solution, en: e.target.value } })}
                  placeholder="Describe the solution in English..."
                  rows={3}
                  className="text-sm sm:text-base"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="solution_ar" className="text-sm sm:text-base">Solution (Arabic)</Label>
                <Textarea
                  id="solution_ar"
                  value={newProject.solution.ar}
                  onChange={(e) => setNewProject({ ...newProject, solution: { ...newProject.solution, ar: e.target.value } })}
                  placeholder="وصف الحل بالعربية..."
                  rows={3}
                  dir="rtl"
                  className="text-sm sm:text-base"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="challenge_en" className="text-sm sm:text-base">Challenge (English)</Label>
                <Textarea
                  id="challenge_en"
                  value={newProject.challenge.en}
                  onChange={(e) => setNewProject({ ...newProject, challenge: { ...newProject.challenge, en: e.target.value } })}
                  placeholder="Describe the challenge in English..."
                  rows={3}
                  className="text-sm sm:text-base"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="challenge_ar" className="text-sm sm:text-base">Challenge (Arabic)</Label>
                <Textarea
                  id="challenge_ar"
                  value={newProject.challenge.ar}
                  onChange={(e) => setNewProject({ ...newProject, challenge: { ...newProject.challenge, ar: e.target.value } })}
                  placeholder="وصف التحدي بالعربية..."
                  rows={3}
                  dir="rtl"
                  className="text-sm sm:text-base"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="techniques" className="text-sm sm:text-base">Technologies (comma-separated)</Label>
                <Input
                  id="techniques"
                  value={newProject.techniques}
                  onChange={(e) => setNewProject({ ...newProject, techniques: e.target.value })}
                  placeholder="e.g., React, Node.js, PostgreSQL"
                  className="text-sm sm:text-base"
                />
              </div>

              <div className="flex gap-2 items-center">
                <Label htmlFor="featured" className="text-sm sm:text-base">Featured Project</Label>
                <input
                  type="checkbox"
                  id="featured"
                  checked={newProject.featured || false}
                  onChange={(e) => setNewProject({ ...newProject, featured: e.target.checked })}
                  className="h-4 w-4 mt-1"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="demo" className="text-sm sm:text-base">Live URL (optional)</Label>
                  <Input
                    id="demo"
                    value={newProject.demo}
                    onChange={(e) => setNewProject({ ...newProject, demo: e.target.value })}
                    placeholder="https://example.com"
                    className="text-sm sm:text-base"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="github" className="text-sm sm:text-base">GitHub URL (optional)</Label>
                  <Input
                    id="github"
                    value={newProject.github}
                    onChange={(e) => setNewProject({ ...newProject, github: e.target.value })}
                    placeholder="https://github.com/username/repo"
                    className="text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Upload Main Project Image</CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      Upload the main project image in JPG, PNG, or WebP format (max 5MB)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div
                      className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
                      onClick={() => document.getElementById("image-upload")?.click()}
                    >
                      {newProject.image ? (
                        <Image
                          src={mainImagePreview || FALLBACK_IMAGE}
                          alt="Main image preview"
                          width={200}
                          height={120}
                          className="mx-auto rounded-md w-full h-auto"
                        />
                      ) : editingProject && mainImagePreview ? (
                        <Image
                          src={mainImagePreview}
                          alt="Current main image"
                          width={200}
                          height={120}
                          className="mx-auto rounded-md w-full h-auto"
                        />
                      ) : (
                        <div className="flex flex-col items-center text-gray-500">
                          <ImagePlus className="h-8 w-8 sm:h-10 sm:w-10" />
                          <p className="text-sm sm:text-base">Click to upload image</p>
                        </div>
                      )}
                    </div>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageChange}
                      className="hidden"
                    />

                    {isUploading && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} className="w-full" />
                      </div>
                    )}

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-sm sm:text-base">
                        Only JPG, PNG, or WebP files are accepted. Maximum file size is 5MB.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Upload Additional Images (Gallery)</CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      Upload additional project images in JPG, PNG, or WebP format (max 5MB each)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div
                      className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
                      onClick={() => document.getElementById("additional-images-upload")?.click()}
                    >
                      {additionalImagesPreviews.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {additionalImagesPreviews.map((preview, index) => (
                            <div key={index} className="relative">
                              <Image
                                src={preview && isValidUrl(preview) ? preview : FALLBACK_IMAGE}
                                alt={`Additional image ${index + 1}`}
                                width={150}
                                height={100}
                                className="mx-auto rounded-md w-full h-auto"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-1 right-1 h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeAdditionalImage(index)
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-gray-500">
                          <ImagePlus className="h-8 w-8 sm:h-10 sm:w-10" />
                          <p className="text-sm sm:text-base">Click to upload images</p>
                        </div>
                      )}
                    </div>
                    <Input
                      id="additional-images-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleAdditionalImagesChange}
                      className="hidden"
                    />

                    {additionalIsUploading && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Uploading...</span>
                          <span>{additionalUploadProgress}%</span>
                        </div>
                        <Progress value={additionalUploadProgress} className="w-full" />
                      </div>
                    )}

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-sm sm:text-base">
                        Only JPG, PNG, or WebP files are accepted. Maximum file size is 5MB each.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={resetForm} disabled={isSubmitting} className="w-full sm:w-auto">Cancel</Button>
              <Button onClick={handleAddProject} disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? "Processing..." : editingProject ? "Update Project" : "Add Project"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden pt-0">
            {project.image && (
              <div className="aspect-video relative">
                <Image
                  src={project.image && isValidUrl(project.image) ? project.image : FALLBACK_IMAGE}
                  alt={project.title}
                  fill
                  className="object-cover w-auto h-auto "
                  onError={() => {
                    console.error(`Failed to load image for project ${project.title}: ${project.image}`)
                    toast.error(`Failed to load image for ${project.title}. Using placeholder.`)
                  }}
                />
              </div>
            )}
            <CardHeader className="pb-0 mb-0">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base sm:text-lg">{project.title}</CardTitle>
                  {project.featured && (
                    <Badge variant="default" className="text-xs">Featured</Badge>
                  )}
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEditProject(project)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteProject(project.id)}>
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-0 mt-0">
              <CardDescription className="text-sm sm:text-base line-clamp-5 ">{project.disc.en}</CardDescription>
              <div className="flex flex-wrap gap-1">
                {project.techniques?.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
              {project.images && Array.isArray(project.images) && project.images.length > 0 && (
                <ProjectGallery images={project.images} title={project.title} />
              )}
              <div className="flex space-x-2">
                {project.demo && (
                  <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                    <a href={project.demo} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-1 h-3 w-3" />
                      Live
                    </a>
                  </Button>
                )}
                {project.github && (
                  <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-1 h-3 w-3" />
                      GitHub
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="w-full max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Confirm Delete</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Are you sure you want to delete this project? This action cannot be undone and will also delete all associated images.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} className="w-full sm:w-auto">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}