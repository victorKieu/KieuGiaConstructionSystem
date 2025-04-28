"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PersonnelList } from "./personnel-list"
import { PersonnelDepartments } from "./personnel-departments"
import { PersonnelPositions } from "./personnel-positions"
import { PersonnelAssignments } from "./personnel-assignments"
import { PersonnelPerformance } from "./personnel-performance"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { PersonnelDialog } from "./personnel-dialog"
import { toast } from "@/components/ui/use-toast"

export function PersonnelManagement() {
  const [activeTab, setActiveTab] = useState("personnel")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [personnel, setPersonnel] = useState([])

  const fetchPersonnel = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/personnel")
      if (!response.ok) {
        throw new Error("Không thể tải dữ liệu nhân sự")
      }
      const data = await response.json()
      setPersonnel(data)
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu nhân sự:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu nhân sự. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPersonnel()
  }, [])

  const handleAddPersonnel = () => {
    setIsDialogOpen(true)
  }

  const handleDialogClose = (refresh = false) => {
    setIsDialogOpen(false)
    if (refresh) {
      fetchPersonnel()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Tabs defaultValue="personnel" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="personnel">Nhân viên</TabsTrigger>
            <TabsTrigger value="departments">Phòng ban</TabsTrigger>
            <TabsTrigger value="positions">Chức vụ</TabsTrigger>
            <TabsTrigger value="assignments">Phân công</TabsTrigger>
            <TabsTrigger value="performance">Hiệu suất</TabsTrigger>
          </TabsList>
          <div className="flex justify-end mt-4">
            {activeTab === "personnel" && (
              <Button onClick={handleAddPersonnel}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Thêm nhân viên
              </Button>
            )}
          </div>
          <TabsContent value="personnel" className="space-y-4">
            <PersonnelList personnel={personnel} isLoading={isLoading} onRefresh={fetchPersonnel} />
          </TabsContent>
          <TabsContent value="departments" className="space-y-4">
            <PersonnelDepartments />
          </TabsContent>
          <TabsContent value="positions" className="space-y-4">
            <PersonnelPositions />
          </TabsContent>
          <TabsContent value="assignments" className="space-y-4">
            <PersonnelAssignments personnel={personnel} />
          </TabsContent>
          <TabsContent value="performance" className="space-y-4">
            <PersonnelPerformance personnel={personnel} />
          </TabsContent>
        </Tabs>
      </div>

      <PersonnelDialog open={isDialogOpen} onOpenChange={handleDialogClose} />
    </div>
  )
}
