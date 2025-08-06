"use client"

import React, { createContext, useState, useEffect, useContext } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Upload, FileText, Download, Trash2, AlertCircle, Eye, Bookmark } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

interface CVFile {
  id: string
  name: string
  size: number
  uploadDate: string
  url: string
  path: string
}

// تحسين interface للـ Context
interface CVContextType {
  cvFile: CVFile | null
  isDownloading: boolean
  handleDownload: (filePath: string, fileName: string) => Promise<void>
  refreshCVFiles: () => Promise<void>
}

// إنشاء الـ Context مع default values محسنة
export const CVContext = createContext<CVContextType>({
  cvFile: null,
  isDownloading: false,
  handleDownload: async () => {},
  refreshCVFiles: async () => {}
})

// Hook للوصول للـ Context مع validation
export const useCVContext = (): CVContextType => {
  const context = useContext(CVContext)
  if (!context) {
    throw new Error('useCVContext must be used within CVContext.Provider')
  }
  return context
}

export default function Cvoverview() {
  const [cvFiles, setCvFiles] = useState<CVFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [cvDownloadUrl, setCvDownloadUrl] = useState("/ATS_Friendly_Technical_Resume__2_ (9).pdf")

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  // تحسين دالة التحميل مع error handling أفضل
  const handleDownload = async (filePath: string, fileName: string) => {
    if (!filePath || !fileName) {
      toast.error("Invalid file path or name")
      return
    }

    setIsDownloading(true)
    try {
      console.log("Starting download:", { filePath, fileName })
      
      const { data, error } = await supabase.storage
        .from("cv-files")
        .download(filePath)
      
      if (error) {
        console.error("Supabase download error:", error)
        throw new Error(`Download failed: ${error.message}`)
      }

      if (!data) {
        throw new Error("No file data received")
      }

      // إنشاء الـ download link
      const url = window.URL.createObjectURL(data)
      const link = document.createElement("a")
      link.href = url
      link.download = fileName
      link.style.display = "none"
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast.success(`${fileName} downloaded successfully!`)
    } catch (error) {
      console.error("Download error:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      toast.error(`Error downloading file: ${errorMessage}`)
    } finally {
      setIsDownloading(false)
    }
  }

  // دالة لإعادة تحميل الملفات
  const refreshCVFiles = async () => {
    await fetchCVFiles()
  }

  const fetchCVFiles = async () => {
    try {
      console.log("Fetching CV files from Supabase...")
      const { data, error } = await supabase
        .storage
        .from("cv-files")
        .list("", { limit: 1, sortBy: { column: "created_at", order: "desc" } })
      
      if (error) {
        console.error("Error fetching CV files:", error)
        toast.error(`Error fetching CV files: ${error.message}`)
        return
      }

      console.log("Fetched CV files:", data)
      if (data && data.length > 0) {
        const latestFile = data[0]
        const { data: publicUrlData } = supabase
          .storage
          .from("cv-files")
          .getPublicUrl(latestFile.name)

        const newCV: CVFile = {
          id: latestFile.id || latestFile.name,
          name: latestFile.name,
          size: latestFile.metadata?.size || 0,
          uploadDate: latestFile.created_at || new Date().toISOString(),
          url: publicUrlData.publicUrl,
          path: latestFile.name
        }
        setCvFiles([newCV])
        setCvDownloadUrl(publicUrlData.publicUrl)
      } else {
        setCvFiles([])
        setCvDownloadUrl("/ATS_Friendly_Technical_Resume__2_ (9).pdf")
      }
    } catch (error) {
      console.error("Unexpected error in fetchCVFiles:", error)
      toast.error("Unexpected error occurred while fetching files")
    }
  }

  useEffect(() => {
    fetchCVFiles()
  }, [])

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    const file = files[0]

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file only.")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB.")
      return
    }

    setPendingFile(file)
    setShowConfirm(true)
  }

  const confirmUpload = async () => {
    if (!pendingFile) return
    const file = pendingFile

    setShowConfirm(false)
    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Delete existing files in the bucket
      const { data: existingFiles, error: listError } = await supabase
        .storage
        .from("cv-files")
        .list("")
      
      if (listError) {
        throw new Error(`Error listing files: ${listError.message}`)
      }

      if (existingFiles && existingFiles.length > 0) {
        const filePaths = existingFiles.map((file) => file.name)
        const { error: deleteError } = await supabase
          .storage
          .from("cv-files")
          .remove(filePaths)
        if (deleteError) {
          throw new Error(`Error deleting existing files: ${deleteError.message}`)
        }
      }

      // تنظيف اسم الملف
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
      const filePath = `cv-${Date.now()}-${sanitizedFileName}`

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 10
        })
      }, 200)

      const { error: uploadError } = await supabase.storage
        .from("cv-files")
        .upload(filePath, file, { cacheControl: "3600", upsert: true })

      clearInterval(interval)

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      const { data: publicUrlData } = supabase.storage
        .from("cv-files")
        .getPublicUrl(filePath)

      const newCV: CVFile = {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        uploadDate: new Date().toISOString(),
        url: publicUrlData.publicUrl,
        path: filePath
      }

      setCvFiles([newCV])
      setCvDownloadUrl(publicUrlData.publicUrl)
      toast.success("CV uploaded successfully!")
    } catch (error) {
      console.error("Upload error:", error)
      const errorMessage = error instanceof Error ? error.message : "Upload failed"
      toast.error(errorMessage)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      setPendingFile(null)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files)
    }
  }

  const handleDeleteCV = async () => {
    if (cvFiles.length === 0) return
    const filePath = cvFiles[0].path

    try {
      const { error } = await supabase.storage.from("cv-files").remove([filePath])
      if (error) {
        throw new Error(`Error deleting file: ${error.message}`)
      }

      setCvFiles([])
      setCvDownloadUrl("/ATS_Friendly_Technical_Resume__2_ (9).pdf")
      toast.success("CV deleted successfully!")
    } catch (error) {
      console.error("Delete error:", error)
      const errorMessage = error instanceof Error ? error.message : "Delete failed"
      toast.error(errorMessage)
    }
  }

  // قيم الـ Context
  const contextValue: CVContextType = {
    cvFile: cvFiles[0] || null,
    isDownloading,
    handleDownload,
    refreshCVFiles
  }

  return (
    <CVContext.Provider value={contextValue}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CV Management</h1>
          <p className="text-muted-foreground">Upload and manage your CV/Resume files</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Upload New CV</CardTitle>
            <CardDescription>Upload your latest CV in PDF format (max 5MB)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium">{dragActive ? "Drop your CV here" : "Drag and drop your CV here"}</p>
                <p className="text-sm text-muted-foreground">or click to browse files</p>
              </div>
              <Input type="file" accept=".pdf" onChange={(e) => handleFileUpload(e.target.files)} className="hidden" id="cv-upload" />
              <Label htmlFor="cv-upload" className="cursor-pointer">
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

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Only PDF files are accepted. Maximum file size is 5MB.</AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your CV Files</CardTitle>
            <CardDescription>Manage your uploaded CV files</CardDescription>
          </CardHeader>
          <CardContent>
            {cvFiles.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No CV files uploaded</p>
                <p className="text-sm text-muted-foreground">Upload your first CV to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cvFiles.map((cv) => (
                  <div key={cv.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <FileText className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{cv.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{formatFileSize(cv.size)}</span>
                          <span>•</span>
                          <span>Uploaded {formatDate(cv.uploadDate)} at {formatTime(cv.uploadDate)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(cv.path, cv.name)}
                        disabled={isDownloading}
                      >
                        <Download className="mr-1 h-4 w-4" />
                        {isDownloading ? "Downloading..." : "Download"}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(cv.url, "_blank")}
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        View
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDeleteCV}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Upload</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to upload this file and replace the existing CV?</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancel</Button>
              <Button onClick={confirmUpload}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </CVContext.Provider>
  )
}


export function DownloadCVButton() {
  const { cvFile, handleDownload, isDownloading } = useCVContext()

  const handleClick = () => {
    if (cvFile) {
      handleDownload(cvFile.path, cvFile.name)
    }
  }

  return (
    <Button  onClick={handleClick} disabled={!cvFile || isDownloading}>
      <Download className="mr-2 h-4 w-4" />
      {isDownloading ? "Downloading..." : "Download CV"}
    </Button>
  )
}
