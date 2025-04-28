"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, Plus, Trash, Upload } from "lucide-react"

interface ProjectDocumentsProps {
  projectId: string
}

export default function ProjectDocuments({ projectId }: ProjectDocumentsProps) {
  const [isAddingDocument, setIsAddingDocument] = useState(false)

  // Trong thực tế, dữ liệu này sẽ được lấy từ API dựa trên projectId
  const documents = [
    {
      id: 1,
      name: "Bản vẽ thiết kế kiến trúc",
      description: "Bản vẽ thiết kế kiến trúc tổng thể công trình",
      category: "Thiết kế",
      fileType: "PDF",
      fileSize: 15.2,
      uploadedBy: "Nguyễn Văn A",
      uploadedDate: "2023-01-10",
      version: "1.0",
    },
    {
      id: 2,
      name: "Bản vẽ thiết kế kết cấu",
      description: "Bản vẽ thiết kế kết cấu công trình",
      category: "Thiết kế",
      fileType: "PDF",
      fileSize: 22.5,
      uploadedBy: "Nguyễn Văn A",
      uploadedDate: "2023-01-12",
      version: "1.0",
    },
    {
      id: 3,
      name: "Bản vẽ thiết kế MEP",
      description: "Bản vẽ thiết kế hệ thống điện, nước, PCCC",
      category: "Thiết kế",
      fileType: "PDF",
      fileSize: 18.7,
      uploadedBy: "Trần Thị B",
      uploadedDate: "2023-01-15",
      version: "1.0",
    },
    {
      id: 4,
      name: "Hợp đồng thi công",
      description: "Hợp đồng thi công công trình",
      category: "Hợp đồng",
      fileType: "DOCX",
      fileSize: 3.5,
      uploadedBy: "Lê Văn C",
      uploadedDate: "2023-01-20",
      version: "1.0",
    },
  ]

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return <FileText className="h-6 w-6 text-red-500" />
      case "docx":
        return <FileText className="h-6 w-6 text-blue-500" />
      case "xlsx":
        return <FileText className="h-6 w-6 text-green-500" />
      default:
        return <FileText className="h-6 w-6 text-gray-500" />
    }
  }

  const handleAddDocument = () => {
    // Xử lý thêm tài liệu mới
    setIsAddingDocument(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Tài liệu dự án</CardTitle>
          <CardDescription>Quản lý các tài liệu của dự án</CardDescription>
        </div>
        <Dialog open={isAddingDocument} onOpenChange={setIsAddingDocument}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm tài liệu
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Thêm tài liệu mới</DialogTitle>
              <DialogDescription>Tải lên tài liệu mới cho dự án</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Tên tài liệu
                </Label>
                <Input id="name" placeholder="Nhập tên tài liệu" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Mô tả
                </Label>
                <Textarea id="description" placeholder="Nhập mô tả tài liệu" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Danh mục
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="design">Thiết kế</SelectItem>
                    <SelectItem value="contract">Hợp đồng</SelectItem>
                    <SelectItem value="report">Báo cáo</SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="version" className="text-right">
                  Phiên bản
                </Label>
                <Input id="version" placeholder="Nhập phiên bản" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="file" className="text-right">
                  Tệp tin
                </Label>
                <div className="col-span-3">
                  <div className="flex w-full items-center justify-center">
                    <label
                      htmlFor="dropzone-file"
                      className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center pb-6 pt-5">
                        <Upload className="mb-3 h-10 w-10 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Nhấp để tải lên</span> hoặc kéo thả tệp tin
                        </p>
                        <p className="text-xs text-gray-500">PDF, DOCX, XLSX (Tối đa 10MB)</p>
                      </div>
                      <input id="dropzone-file" type="file" className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingDocument(false)}>
                Hủy
              </Button>
              <Button onClick={handleAddDocument}>Lưu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên tài liệu</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Kích thước</TableHead>
              <TableHead>Người tải lên</TableHead>
              <TableHead>Ngày tải lên</TableHead>
              <TableHead>Phiên bản</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((document) => (
              <TableRow key={document.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    {getFileTypeIcon(document.fileType)}
                    <div className="ml-2">
                      <div>{document.name}</div>
                      <div className="text-xs text-gray-500">{document.description}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{document.category}</TableCell>
                <TableCell>{document.fileType}</TableCell>
                <TableCell>{document.fileSize} MB</TableCell>
                <TableCell>{document.uploadedBy}</TableCell>
                <TableCell>{new Date(document.uploadedDate).toLocaleDateString("vi-VN")}</TableCell>
                <TableCell>{document.version}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
