"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Upload, FileText, Download, Trash2, AlertCircle, Eye } from "lucide-react"
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

export default function Cvoverview() {
  const [cvFiles, setCvFiles] = useState<CVFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [, setCvDownloadUrl] = useState("/ATS_Friendly_Technical_Resume__2_ (9).pdf")

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

  // تحميل آخر CV مرفوع عند فتح الصفحة
  useEffect(() => {
    const fetchCVFiles = async () => {
      const { data, error } = await supabase
        .storage
        .from("cv-files")
        .list("", { limit: 1, sortBy: { column: "created_at", order: "desc" } })
      if (error) {
        toast.error(`Error fetching CV files: ${error.message}`)
        return
      }

      if (data.length > 0) {
        const latestFile = data[0]
        const { data: publicUrlData } = supabase
          .storage
          .from("cv-files")
          .getPublicUrl(latestFile.name)

        setCvFiles([
          {
            id: latestFile.id || latestFile.name,
            name: latestFile.name,
            size: latestFile.metadata?.size || 0,
            uploadDate: latestFile.created_at || new Date().toISOString(),
            url: publicUrlData.publicUrl,
            path: latestFile.name
          }
        ])
        setCvDownloadUrl(publicUrlData.publicUrl)
      } else {
        setCvFiles([])
        setCvDownloadUrl("/ATS_Friendly_Technical_Resume__2_ (9).pdf")
      }
    }

    fetchCVFiles()
  }, [])

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    const file = files[0]

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file only.")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB.")
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

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)

    const filePath = `cv-${Date.now()}-${file.name}`

    const { error: uploadError } = await supabase.storage
      .from("cv-files")
      .upload(filePath, file, { cacheControl: "3600", upsert: true })

    if (uploadError) {
      alert("Upload failed: " + uploadError.message)
      setIsUploading(false)
      return
    }

    const { data: publicUrlData } = supabase.storage
      .from("cv-files")
      .getPublicUrl(filePath)

    const fileUrl = publicUrlData.publicUrl

    const newCV: CVFile = {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      uploadDate: new Date().toISOString().split("T")[0],
      url: fileUrl,
      path: filePath
    }

    setCvFiles([newCV])
    setCvDownloadUrl(fileUrl)
    setIsUploading(false)
    setUploadProgress(0)
    setPendingFile(null)
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDeleteCV = async (id: string) => {
    if (cvFiles.length === 0) return
    const filePath = cvFiles[0].path

    await supabase.storage.from("cv-files").remove([filePath])

    setCvFiles([])
    setCvDownloadUrl("/ATS_Friendly_Technical_Resume__2_ (9).pdf")
  }

  return (
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
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
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
                        <span>Uploaded {formatDate(cv.uploadDate)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={cv.url} download={cv.name}>
                        <Download className="mr-1 h-4 w-4" />
                        Download
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => window.open(cv.url, "_blank")}>
                      <Eye className="mr-1 h-4 w-4" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteCV(cv.id)}>
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
  )
}
