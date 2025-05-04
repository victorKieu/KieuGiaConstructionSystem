import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { id } = params
        const { userId, role } = await request.json()

        // Kiểm tra quyền truy cập (ví dụ: chỉ admin hoặc chủ dự án mới có thể thêm thành viên)
        // Thêm logic kiểm tra quyền ở đây

        // Thêm thành viên vào dự án
        const member = await db.projectMember.create({
            data: {
                userId,
                projectId: id,
                role
            }
        })

        return NextResponse.json(member)
    } catch (error) {
        console.error("[MEMBER_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { id } = params

        // Lấy danh sách thành viên của dự án
        const members = await db.projectMember.findMany({
            where: {
                projectId: id
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }
                }
            }
        })

        return NextResponse.json(members)
    } catch (error) {
        console.error("[MEMBERS_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}