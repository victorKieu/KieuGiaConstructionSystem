import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// Dữ liệu mẫu cho bảng projects
const sampleProjects = [
  {
    code: "RS001",
    name: "Chung cư Sunshine City",
    description: "Dự án chung cư cao cấp tại quận 7",
    location: "Quận 7, TP.HCM",
    start_date: "2023-01-15",
    end_date: "2024-06-30",
    budget: 150000000000,
    status: "in_progress",
    progress: 35,
    project_type: "residential",
    construction_type: "residential",
    project_manager: "Nguyễn Văn A",
    complexity: "high",
    priority: "high",
    risk_level: "medium",
    customer_id: null, // Sẽ được cập nhật sau khi có customer
  },
  {
    code: "CM001",
    name: "Trung tâm thương mại Mega Mall",
    description: "Dự án trung tâm thương mại lớn nhất khu vực",
    location: "Quận 2, TP.HCM",
    start_date: "2023-03-10",
    end_date: "2025-01-15",
    budget: 300000000000,
    status: "planning",
    progress: 10,
    project_type: "commercial",
    construction_type: "commercial",
    project_manager: "Trần Thị B",
    complexity: "high",
    priority: "high",
    risk_level: "high",
    customer_id: null,
  },
  {
    code: "IN001",
    name: "Nhà máy sản xuất Tân Phú",
    description: "Dự án xây dựng nhà máy sản xuất",
    location: "KCN Tân Phú, Đồng Nai",
    start_date: "2023-02-20",
    end_date: "2023-12-25",
    budget: 80000000000,
    status: "in_progress",
    progress: 65,
    project_type: "industrial",
    construction_type: "industrial",
    project_manager: "Lê Văn C",
    complexity: "medium",
    priority: "normal",
    risk_level: "low",
    customer_id: null,
  },
  {
    code: "TH001",
    name: "Khu nhà phố Vạn Phúc",
    description: "Dự án xây dựng khu nhà phố cao cấp",
    location: "Thủ Đức, TP.HCM",
    start_date: "2023-04-05",
    end_date: "2024-04-05",
    budget: 120000000000,
    status: "planning",
    progress: 5,
    project_type: "residential",
    construction_type: "townhouse",
    project_manager: "Phạm Thị D",
    complexity: "medium",
    priority: "high",
    risk_level: "medium",
    customer_id: null,
  },
  {
    code: "IF001",
    name: "Cầu Thủ Thiêm 3",
    description: "Dự án xây dựng cầu kết nối quận 1 và quận 2",
    location: "TP.HCM",
    start_date: "2023-06-10",
    end_date: "2025-12-31",
    budget: 500000000000,
    status: "planning",
    progress: 2,
    project_type: "infrastructure",
    construction_type: "infrastructure",
    project_manager: "Hoàng Văn E",
    complexity: "very_high",
    priority: "very_high",
    risk_level: "high",
    customer_id: null,
  },
]

// Dữ liệu mẫu cho bảng customers
const sampleCustomers = [
  {
    code: "CUS001",
    name: "Công ty Cổ phần Đầu tư Sunshine",
    contact_name: "Nguyễn Văn Minh",
    email: "minh.nguyen@sunshine.com",
    phone: "0901234567",
    address: "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
    type: "corporate",
    status: "active",
  },
  {
    code: "CUS002",
    name: "Tập đoàn Vingroup",
    contact_name: "Trần Thị Hương",
    email: "huong.tran@vingroup.com",
    phone: "0912345678",
    address: "456 Lê Thánh Tôn, Quận 1, TP.HCM",
    type: "corporate",
    status: "active",
  },
  {
    code: "CUS003",
    name: "Công ty TNHH Sản xuất Tân Phú",
    contact_name: "Lê Văn Hùng",
    email: "hung.le@tanphu.com",
    phone: "0923456789",
    address: "789 Khu công nghiệp Tân Phú, Đồng Nai",
    type: "corporate",
    status: "active",
  },
  {
    code: "CUS004",
    name: "Công ty Cổ phần Bất động sản Vạn Phúc",
    contact_name: "Phạm Thị Mai",
    email: "mai.pham@vanphuc.com",
    phone: "0934567890",
    address: "101 Võ Văn Ngân, Thủ Đức, TP.HCM",
    type: "corporate",
    status: "active",
  },
  {
    code: "CUS005",
    name: "Sở Giao thông Vận tải TP.HCM",
    contact_name: "Hoàng Văn Nam",
    email: "nam.hoang@tphcm.gov.vn",
    phone: "0945678901",
    address: "63 Lý Tự Trọng, Quận 1, TP.HCM",
    type: "government",
    status: "active",
  },
]

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Kiểm tra xem đã có dữ liệu chưa
    const { count: projectCount, error: countError } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })

    if (countError) {
      return NextResponse.json(
        {
          success: false,
          error: countError.message,
        },
        { status: 500 },
      )
    }

    // Nếu đã có dữ liệu, không thêm nữa
    if (projectCount && projectCount > 0) {
      return NextResponse.json({
        success: true,
        message: `Đã có ${projectCount} dự án trong cơ sở dữ liệu. Không cần thêm dữ liệu mẫu.`,
      })
    }

    // Thêm customers trước
    const { data: customers, error: customerError } = await supabase.from("customers").insert(sampleCustomers).select()

    if (customerError) {
      return NextResponse.json(
        {
          success: false,
          error: `Lỗi khi thêm khách hàng: ${customerError.message}`,
        },
        { status: 500 },
      )
    }

    // Liên kết customers với projects
    const projectsWithCustomers = sampleProjects.map((project, index) => ({
      ...project,
      customer_id: customers[index % customers.length].id,
    }))

    // Thêm projects
    const { data: projects, error: projectError } = await supabase
      .from("projects")
      .insert(projectsWithCustomers)
      .select()

    if (projectError) {
      return NextResponse.json(
        {
          success: false,
          error: `Lỗi khi thêm dự án: ${projectError.message}`,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: `Đã thêm ${customers.length} khách hàng và ${projects.length} dự án mẫu.`,
      customers,
      projects,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
