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
import { AlertCircle, Plus, Edit, Trash2, ExternalLink, Github, X, Upload } from "lucide-react"
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
  const [dragActive, setDragActive] = useState(false)
  const [additionalDragActive, setAdditionalDragActive] = useState(false)
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

  // Fallback image as a data URL (gray placeholder)
  const FALLBACK_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K"

  useEffect(() => {
    fetchProjects()
  }, [])

  // Improved URL validation function
  const isValidUrl = (url: string): boolean => {
    if (!url || typeof url !== 'string') return false
    
    try {
      const urlObj = new URL(url)
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:' || url.startsWith('data:image/')
    } catch {
      // Check if it's a relative path
      return url.startsWith('/') || url.startsWith('./') || url.startsWith('../')
    }
  }

  // Safe JSON parsing function
  const safeJsonParse = (jsonString: any, fallback: any = null) => {
    if (!jsonString) return fallback
    
    try {
      if (typeof jsonString === 'string') {
        return JSON.parse(jsonString)
      }
      if (typeof jsonString === 'object') {
        return jsonString
      }
      return fallback
    } catch (error) {
      console.warn('Failed to parse JSON:', error)
      return fallback
    }
  }

  // Process and validate project images
  const processProjectImages = (imagesData: any, projectTitle: string): ProjectImage[] => {
    if (!imagesData) return []
    
    const parsedImages = safeJsonParse(imagesData, [])
    if (!Array.isArray(parsedImages)) return []
    
    return parsedImages.map((img: any, index: number) => {
      const src = img?.src || img?.url || img
      if (typeof src === 'string' && isValidUrl(src)) {
        return {
          src,
          alt: img?.alt || `Gallery image ${index + 1} for ${projectTitle}`
        }
      }
      // Don't use fallback for invalid entries, just skip them
      return null
    }).filter(Boolean) as ProjectImage[] // Remove null entries
  }

  // Process and validate techniques
  const processProjectTechniques = (techniquesData: any): string[] => {
    if (!techniquesData) return []
    
    const parsedTechniques = safeJsonParse(techniquesData, [])
    if (Array.isArray(parsedTechniques)) {
      return parsedTechniques.filter(tech => typeof tech === 'string' && tech.trim())
    }
    
    // Handle comma-separated string
    if (typeof techniquesData === 'string') {
      return techniquesData.split(',').map(tech => tech.trim()).filter(tech => tech)
    }
    
    return []
  }

  const fetchProjects = async () => {
    setLoading(true)
    const toastId = toast.loading("Loading Projects")

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error("You must be logged in to view projects")
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("Portfolio")
        .select("*")
        .order('created_at', { ascending: false })

      if (error) {
        toast.error(`Failed to fetch projects: ${error.message}`)
        return
      }

      // Process projects with robust error handling
      const processedProjects = (data || []).map(project => {
        const images = processProjectImages(project.images, project.title || 'Untitled Project')
        const techniques = processProjectTechniques(project.techniques)
        
        return {
          ...project,
          images,
          techniques,
          disc: project.disc || { en: '', ar: '' },
          solution: project.solution || { en: '', ar: '' },
          challenge: project.challenge || { en: '', ar: '' },
          image: isValidUrl(project.image) ? project.image : null,
          featured: Boolean(project.featured)
        }
      })

      const shuffledProjects = shuffleArray(processedProjects)
      setProjects(shuffledProjects)
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast.error(`Unexpected error occurred: ${error?.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
      toast.dismiss(toastId)
    }
  }

  const shuffleArray = (array: ProjectDetail[]) => {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
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
      toast.error("Both English and Arabic challenges are required")
      return false
    }
    if (!editingProject && !newProject.image) {
      toast.error("Main project image is required for new projects")
      return false
    }
    return true
  }

  const handleDrag = (e: React.DragEvent<HTMLDivElement>, isMainImage: boolean) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      isMainImage ? setDragActive(true) : setAdditionalDragActive(true)
    } else if (e.type === "dragleave") {
      isMainImage ? setDragActive(false) : setAdditionalDragActive(false)
    }
  }

  const validateImageFile = (file: File): boolean => {
    const fileExt = file.name.split('.').pop()?.toLowerCase()
    if (!fileExt || !['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExt)) {
      toast.error("Only JPG, PNG, GIF, or WebP files are accepted")
      return false
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB")
      return false
    }
    return true
  }

  const createImagePreview = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (result && result.startsWith('data:image/')) {
          resolve(result)
        } else {
          reject(new Error('Invalid image data'))
        }
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }

  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!validateImageFile(file)) return

    try {
      setNewProject({ ...newProject, image: file })
      const preview = await createImagePreview(file)
      setMainImagePreview(preview)
    } catch (error) {
      console.error("Error creating image preview:", error)
      setMainImagePreview(FALLBACK_IMAGE)
      toast.error("Failed to preview image")
    }
  }

  const handleAdditionalImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const invalidFiles = files.filter(file => !validateImageFile(file))
    if (invalidFiles.length > 0) {
      toast.error("Some images are invalid. Only JPG, PNG, GIF, or WebP files under 5MB are accepted.")
      return
    }

    setNewProject({ ...newProject, additionalImages: [...newProject.additionalImages, ...files] })

    try {
      const newPreviews = await Promise.all(files.map(createImagePreview))
      setAdditionalImagesPreviews(prev => [...prev, ...newPreviews])
    } catch (error) {
      console.error("Error creating image previews:", error)
      const fallbackPreviews = files.map(() => FALLBACK_IMAGE)
      setAdditionalImagesPreviews(prev => [...prev, ...fallbackPreviews])
      toast.error("Some image previews failed to load")
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

  const uploadImage = async (file: File, folder: string = ''): Promise<string> => {
    try {
      if (!file || file.size === 0) {
        throw new Error("Invalid file")
      }

      if (!validateImageFile(file)) {
        throw new Error("Invalid file type or size")
      }

      const fileExt = file.name.split('.').pop()?.toLowerCase()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const fullPath = folder ? `${folder}/${fileName}` : fileName

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error("User must be authenticated to upload images")
      }

      const { error } = await supabase.storage
        .from('project')
        .upload(fullPath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        throw new Error(`Upload failed: ${error.message}`)
      }

      const { data: publicUrlData } = supabase.storage
        .from('project')
        .getPublicUrl(fullPath)

      if (!publicUrlData.publicUrl) {
        throw new Error("Failed to generate public URL")
      }

      return publicUrlData.publicUrl
    } catch (error) {
      console.error("Image upload error:", error)
      throw error
    }
  }

  const deleteImage = async (imageUrl: string) => {
    try {
      if (!imageUrl || imageUrl === FALLBACK_IMAGE || !isValidUrl(imageUrl)) {
        return
      }

      const url = new URL(imageUrl)
      const pathParts = url.pathname.split('/').filter(part => part)
      const bucketIndex = pathParts.findIndex(part => part === 'project')

      if (bucketIndex === -1 || bucketIndex >= pathParts.length - 1) {
        console.warn("Invalid image URL format for deletion:", imageUrl)
        return
      }

      const fullPath = pathParts.slice(bucketIndex + 1).join('/')
      const { error } = await supabase.storage
        .from('project')
        .remove([fullPath])

      if (error) {
        console.error(`Failed to delete image: ${error.message}`)
      }
    } catch (error) {
      console.error("Error deleting image:", error)
    }
  }

  const handleAddProject = async () => {
    if (!validateInputs() || isSubmitting) return

    setIsSubmitting(true)
    const toastId = toast.loading(editingProject ? "Updating Project" : "Adding Project")

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error("You must be logged in to add or update projects")
        return
      }

      let imageUrl = editingProject?.image || ""
      let additionalImagesUrls: ProjectImage[] = []

      // Handle main image upload
      if (newProject.image) {
        setIsUploading(true)
        setUploadProgress(0)
        
        // Simulate progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => Math.min(prev + 10, 90))
        }, 100)

        try {
          // Delete old main image if editing and new image provided
          if (editingProject && imageUrl && imageUrl !== FALLBACK_IMAGE) {
            await deleteImage(imageUrl)
          }
          
          imageUrl = await uploadImage(newProject.image, 'main')
          setUploadProgress(100)
        } finally {
          clearInterval(progressInterval)
          setIsUploading(false)
          setUploadProgress(0)
        }
      } else if (editingProject) {
        // Keep existing image if no new image provided
        imageUrl = editingProject.image
      }

      // Handle additional images upload
      if (newProject.additionalImages && newProject.additionalImages.length > 0) {
        setAdditionalIsUploading(true)
        setAdditionalUploadProgress(0)

        try {
          // Delete old additional images if editing and new images provided
          if (editingProject && editingProject.images && editingProject.images.length > 0) {
            await Promise.all(editingProject.images.map(img => deleteImage(img.src)))
          }

          const uploadPromises = newProject.additionalImages.map(async (file, index) => {
            setAdditionalUploadProgress(Math.round(((index + 1) / newProject.additionalImages.length) * 100))
            const url = await uploadImage(file, 'gallery')
            return {
              src: url,
              alt: `Gallery image ${index + 1} for ${newProject.title}`
            }
          })

          additionalImagesUrls = await Promise.all(uploadPromises)
        } finally {
          setAdditionalIsUploading(false)
          setAdditionalUploadProgress(0)
        }
      } else if (editingProject) {
        // Keep existing additional images if no new images provided
        additionalImagesUrls = editingProject.images || []
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
      resetForm()
      await fetchProjects()
    } catch (error) {
      console.error('Error saving project:', error)
      toast.error(`Unexpected error occurred: ${error?.message || 'Unknown error'}`)
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
    setDragActive(false)
    setAdditionalDragActive(false)
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
      image: null, // Don't set the file, just show preview
      additionalImages: [], // Don't set files, just show previews
      demo: project.demo || "",
      github: project.github || "",
      techniques: project.techniques.join(", "),
      featured: project.featured || false
    })
    
    // Set previews for existing images (only show valid images)
    setMainImagePreview(isValidUrl(project.image) ? project.image : null)
    setAdditionalImagesPreviews(
      project.images?.filter(img => isValidUrl(img.src)).map(img => img.src) || []
    )
    
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
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error("You must be logged in to delete projects")
        return
      }

      const project = projects.find(p => p.id === projectToDelete)

      const { error } = await supabase
        .from("Portfolio")
        .delete()
        .eq('id', projectToDelete)

      if (error) {
        toast.error("Failed to delete project. Please try again.")
        return
      }

      // Delete associated images
      if (project) {
        if (project.image && project.image !== FALLBACK_IMAGE) {
          await deleteImage(project.image)
        }

        if (project.images && Array.isArray(project.images) && project.images.length > 0) {
          await Promise.all(project.images.map(img => deleteImage(img.src)))
        }
      }

      toast.success("Project deleted successfully!")
      setIsDeleteDialogOpen(false)
      setProjectToDelete(null)
      await fetchProjects()
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error("Unexpected error occurred while deleting. Please try again.")
    } finally {
      toast.dismiss(toastId)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center text-center justify-center min-h-screen mx-auto h-[70vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage your portfolio projects and showcase your work</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          if (!open) resetForm()
          setIsAddDialogOpen(open)
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
              <DialogDescription>
                {editingProject ? "Update your project details" : "Add a new project to your portfolio"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  placeholder="e.g., E-commerce Platform"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="disc_en">Description (English)</Label>
                <Textarea
                  id="disc_en"
                  value={newProject.disc.en}
                  onChange={(e) => setNewProject({ ...newProject, disc: { ...newProject.disc, en: e.target.value } })}
                  placeholder="Describe your project in English..."
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="disc_ar">Description (Arabic)</Label>
                <Textarea
                  id="disc_ar"
                  value={newProject.disc.ar}
                  onChange={(e) => setNewProject({ ...newProject, disc: { ...newProject.disc, ar: e.target.value } })}
                  placeholder="وصف المشروع بالعربية..."
                  rows={3}
                  dir="rtl"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="solution_en">Solution (English)</Label>
                <Textarea
                  id="solution_en"
                  value={newProject.solution.en}
                  onChange={(e) => setNewProject({ ...newProject, solution: { ...newProject.solution, en: e.target.value } })}
                  placeholder="Describe the solution in English..."
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="solution_ar">Solution (Arabic)</Label>
                <Textarea
                  id="solution_ar"
                  value={newProject.solution.ar}
                  onChange={(e) => setNewProject({ ...newProject, solution: { ...newProject.solution, ar: e.target.value } })}
                  placeholder="وصف الحل بالعربية..."
                  rows={3}
                  dir="rtl"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="challenge_en">Challenge (English)</Label>
                <Textarea
                  id="challenge_en"
                  value={newProject.challenge.en}
                  onChange={(e) => setNewProject({ ...newProject, challenge: { ...newProject.challenge, en: e.target.value } })}
                  placeholder="Describe the challenge in English..."
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="challenge_ar">Challenge (Arabic)</Label>
                <Textarea
                  id="challenge_ar"
                  value={newProject.challenge.ar}
                  onChange={(e) => setNewProject({ ...newProject, challenge: { ...newProject.challenge, ar: e.target.value } })}
                  placeholder="وصف التحدي بالعربية..."
                  rows={3}
                  dir="rtl"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="techniques">Technologies (comma-separated)</Label>
                <Input
                  id="techniques"
                  value={newProject.techniques}
                  onChange={(e) => setNewProject({ ...newProject, techniques: e.target.value })}
                  placeholder="e.g., React, Node.js, PostgreSQL"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={newProject.featured || false}
                  onChange={(e) => setNewProject({ ...newProject, featured: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="featured">Featured Project</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="demo">Live URL (optional)</Label>
                  <Input
                    id="demo"
                    value={newProject.demo}
                    onChange={(e) => setNewProject({ ...newProject, demo: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="github">GitHub URL (optional)</Label>
                  <Input
                    id="github"
                    value={newProject.github}
                    onChange={(e) => setNewProject({ ...newProject, github: e.target.value })}
                    placeholder="https://github.com/username/repo"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Main Project Image</CardTitle>
                    <CardDescription>
                      Upload the main project image in JPG, PNG, or WebP format (max 5MB)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        dragActive
                          ? "border-primary bg-primary/5"
                          : "border-muted-foreground/25 hover:border-muted-foreground/50"
                      }`}
                      onDragEnter={(e) => handleDrag(e, true)}
                      onDragLeave={(e) => handleDrag(e, true)}
                      onDragOver={(e) => handleDrag(e, true)}
                    >
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <div className="space-y-2">
                        <p className="text-lg font-medium">
                          {dragActive ? "Drop your image here" : "Drag and drop your image here"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          or click to browse files
                        </p>
                      </div>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleMainImageChange}
                        className="hidden"
                      />
                      <Label htmlFor="image-upload" className="cursor-pointer">
                        <Button variant="outline" className="mt-4 bg-transparent" asChild>
                          <span>Choose File</span>
                        </Button>
                      </Label>
                    </div>

                    {isUploading && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} className="w-full" />
                      </div>
                    )}

                    {mainImagePreview && (
                      <div className="mt-4">
                        <Image
                          src={mainImagePreview}
                          alt="Main image preview"
                          width={200}
                          height={120}
                          className="object-cover rounded border"
                          onError={() => {
                            // Silently handle error by hiding the preview
                            setMainImagePreview(null)
                          }}
                        />
                      </div>
                    )}

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Only JPG, PNG, or WebP files are accepted. Maximum file size is 5MB.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Additional Images (Gallery)</CardTitle>
                    <CardDescription>
                      Upload additional project images in JPG, PNG, or WebP format (max 5MB each)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        additionalDragActive
                          ? "border-primary bg-primary/5"
                          : "border-muted-foreground/25 hover:border-muted-foreground/50"
                      }`}
                      onDragEnter={(e) => handleDrag(e, false)}
                      onDragLeave={(e) => handleDrag(e, false)}
                      onDragOver={(e) => handleDrag(e, false)}
                    >
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <div className="space-y-2">
                        <p className="text-lg font-medium">
                          {additionalDragActive ? "Drop your images here" : "Drag and drop your images here"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          or click to browse files
                        </p>
                      </div>
                      <Input
                        id="additional-images-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleAdditionalImagesChange}
                        className="hidden"
                      />
                      <Label htmlFor="additional-images-upload" className="cursor-pointer">
                        <Button variant="outline" className="mt-4 bg-transparent" asChild>
                          <span>Choose Files</span>
                        </Button>
                      </Label>
                    </div>

                    {additionalIsUploading && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Uploading...</span>
                          <span>{additionalUploadProgress}%</span>
                        </div>
                        <Progress value={additionalUploadProgress} className="w-full" />
                      </div>
                    )}

                    {additionalImagesPreviews.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        {additionalImagesPreviews.map((preview, index) => (
                          <div key={index} className="relative">
                            <Image
                              src={preview}
                              alt={`Additional image ${index + 1}`}
                              width={150}
                              height={100}
                              className="object-cover rounded border"
                              onError={() => {
                                // Remove the failed image from previews
                                setAdditionalImagesPreviews(prev => {
                                  const newPreviews = [...prev]
                                  newPreviews.splice(index, 1)
                                  return newPreviews
                                })
                              }}
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 h-6 w-6 p-0"
                              onClick={() => removeAdditionalImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Only JPG, PNG, or WebP files are accepted. Maximum file size is 5MB each.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetForm} disabled={isSubmitting}>Cancel</Button>
              <Button onClick={handleAddProject} disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : editingProject ? "Update Project" : "Add Project"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden pt-0">
            {project.image && isValidUrl(project.image) && (
              <div className="aspect-video relative">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  onError={() => {
                    // Silently handle error - could hide the image container or show fallback
                  }}
                />
              </div>
            )}
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  {project.featured && (
                    <Badge variant="default" className="text-xs">Featured</Badge>
                  )}
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEditProject(project)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteProject(project.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription>{project.disc?.en || 'No description available'}</CardDescription>
              <div className="flex flex-wrap gap-1">
                {project.techniques?.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
              {project.images && Array.isArray(project.images) && project.images.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  +{project.images.length} additional image{project.images.length > 1 ? 's' : ''}
                </div>
              )}
              <div className="flex space-x-2">
                {project.demo && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.demo} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-1 h-3 w-3" />
                      Live
                    </a>
                  </Button>
                )}
                {project.github && (
                  <Button variant="outline" size="sm" asChild>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action cannot be undone and will also delete all associated images.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}