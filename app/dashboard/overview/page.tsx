import type { Metadata } from "next"
import OverviewPageClient from "./OverviewPageClient"

export const metadata: Metadata = {
  title: "Tổng quan | Kieu Gia Construction",
  description: "Tổng quan về hiệu suất hoạt động của công ty",
}

export default function OverviewPage() {
  return <OverviewPageClient />
}
