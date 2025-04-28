"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Search, SlidersHorizontal, List, LayoutGrid } from "lucide-react"
import Link from "next/link"
import ProjectsList from "@/components/projects/projects-list"

export default function ProjectsPageClient() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Tìm kiếm
          </Button>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="normal">Bình thường</SelectItem>
              <SelectItem value="delayed">Chậm tiến độ</SelectItem>
              <SelectItem value="completed">Hoàn thành</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
          <div className="border rounded-md flex">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              className="h-9 w-9 rounded-none rounded-l-md"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              className="h-9 w-9 rounded-none rounded-r-md"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
          <Link href="/dashboard/projects/create">
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Tạo dự án
            </Button>
          </Link>
        </div>
      </div>

      <ProjectsList viewMode={viewMode} />
    </div>
  )
}
