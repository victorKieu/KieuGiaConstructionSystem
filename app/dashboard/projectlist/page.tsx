"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MainLayout } from "@/components/layout/main-layout"
import { ProjectList } from "@/components/dashboard/project-list"
import { supabase } from "@/lib/supabase/client"

export default function ProjectListPage() {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchProjects() {
            try {
                setLoading(true)
                const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

                if (error) {
                    throw error
                }

                setProjects(data || [])
            } catch (err) {
                console.error("Error fetching projects:", err)
                setError(err instanceof Error ? err.message : String(err))
            } finally {
                setLoading(false)
            }
        }

        fetchProjects()
    }, [])

    return (
        <MainLayout>
            <div className="flex flex-col gap-5 p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Danh sách dự án</h1>
                        <p className="text-muted-foreground">Quản lý thông tin dự án xây dựng</p>
                    </div>
                    <Button asChild>
                        <Link href="/dashboard/projects/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Thêm dự án mới
                        </Link>
                    </Button>
                </div>

                {loading ? (
                    <div className="flex justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                        <p className="font-bold">Lỗi</p>
                        <p>Không thể tải danh sách dự án. {error}</p>
                    </div>
                ) : (
                    <ProjectList projects={projects} />
                )}
            </div>
        </MainLayout>
    )
}
