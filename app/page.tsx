import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function Home() {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (session) {
        redirect("/dashboard")
    } else {
        redirect("/login")
    }

    // Phần code dưới đây không bao giờ được thực thi vì luôn redirect trước đó
    // Nên xóa hoặc chuyển sang trang login
}