"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { Camera, File, Trash, Upload, X } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface MediaUploaderProps {
  logId: number
  onUploadComplete: () => void
}

type FileWithPreview = {
  file: File
  preview: string
  progress: number
  uploading: boolean
  error: boolean
}

export function MediaUploader({ logId, onUploadComplete }: MediaUploaderProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files))
    }
  }

  const addFiles = (selectedFiles: File[]) => {
    const newFiles = selectedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      uploading: false,
      error: false,
    }))

    setFiles((prev) => [...prev, ...newFiles])
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files))
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev]
      URL.revokeObjectURL(newFiles[index].preview)
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const uploadFile = async (index: number) => {
    const fileToUpload = files[index]

    if (fileToUpload.uploading) return

    setFiles((prev) => {
      const newFiles = [...prev]
      newFiles[index].uploading = true
      newFiles[index].error = false
      return newFiles
    })

    try {
      // Mô phỏng tiến trình upload
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200))

        setFiles((prev) => {
          const newFiles = [...prev]
          newFiles[index].progress = progress
          return newFiles
        })
      }

      // Mô phỏng hoàn thành upload
      setFiles((prev) => {
        const newFiles = [...prev]
        newFiles[index].uploading = false
        newFiles[index].progress = 100
        return newFiles
      })

      toast({
        title: "Tải lên thành công",
        description: `Đã tải lên ${fileToUpload.file.name}`,
      })

      onUploadComplete()
    } catch (error) {
      handleUploadError(index, fileToUpload)
    }
  }

  const handleUploadError = (index: number, fileToUpload: FileWithPreview) => {
    setFiles((prev) => {
      const newFiles = [...prev]
      newFiles[index].uploading = false
      newFiles[index].error = true
      return newFiles
    })

    toast({
      title: "Lỗi tải lên",
      description: `Không thể tải lên ${fileToUpload.file.name}`,
      variant: "destructive",
    })
  }

  const uploadAllFiles = () => {
    files.forEach((file, index) => {
      if (!file.uploading && !file.progress) {
        uploadFile(index)
      }
    })
  }

  const isImage = (file: File) => file.type.startsWith("image/")
  const isVideo = (file: File) => file.type.startsWith("video/")

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary hover:bg-primary/5",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept="image/*,video/*"
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-10 w-10 text-gray-400" />
          <p className="text-sm font-medium">Kéo thả hoặc nhấp để tải lên hình ảnh/video</p>
          <p className="text-xs text-gray-500">Hỗ trợ: JPG, PNG, GIF, MP4, MOV (Tối đa 20MB)</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file, index) => (
              <Card key={index} className={cn("relative overflow-hidden", file.error && "border-red-500")}>
                <CardContent className="p-2">
                  <div className="aspect-video relative rounded-md overflow-hidden bg-gray-100">
                    {isImage(file.file) ? (
                      <Image
                        src={file.preview || "/placeholder.svg"}
                        alt={file.file.name}
                        fill
                        className="object-cover"
                      />
                    ) : isVideo(file.file) ? (
                      <div className="h-full w-full flex items-center justify-center">
                        <video src={file.preview} className="max-h-full max-w-full" controls={false} />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Camera className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <File className="h-8 w-8 text-gray-400" />
                      </div>
                    )}

                    <button
                      className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(index)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-2 text-xs truncate" title={file.file.name}>
                    {file.file.name}
                  </div>

                  {file.uploading && <Progress value={file.progress} className="h-1 mt-1" />}

                  {!file.uploading && file.progress === 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 h-7 text-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        uploadFile(index)
                      }}
                    >
                      <Upload className="h-3 w-3 mr-1" />
                      Tải lên
                    </Button>
                  )}

                  {file.error && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full mt-2 h-7 text-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        uploadFile(index)
                      }}
                    >
                      Thử lại
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setFiles([])} disabled={files.some((f) => f.uploading)}>
              <Trash className="h-4 w-4 mr-2" />
              Xóa tất cả
            </Button>
            <Button
              onClick={uploadAllFiles}
              disabled={files.length === 0 || files.every((f) => f.uploading || f.progress > 0)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Tải lên tất cả
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
