import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function DELETE(
    request: Request,
    { params }: { params: { id: string; memberId: string } }
) {
    try {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { id, memberId } = params

        // Kiểm tra quyền truy cập (ví dụ: chỉ admin hoặc chủ dự án mới có thể xóa thành viên)
        // Thêm logic kiểm tra quyền ở đây

        // Xóa thành viên khỏi dự án
        await db.projectMember.delete({
            where: {
                id: memberId,
                projectId: id
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[MEMBER_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}