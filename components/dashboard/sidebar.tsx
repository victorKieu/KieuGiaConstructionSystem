"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useSidebar } from "./sidebar-context"
import {
  Building2,
  ClipboardList,
  Home,
  LayoutDashboard,
  Package,
  Settings,
  Users,
  Warehouse,
  TrendingUp,
  ClipboardCheck,
  FileBarChart,
  ArrowDownToLine,
  ArrowUpFromLine,
  Clipboard,
  ClipboardSignature,
  ArrowRightLeft,
  CircleDot,
  Plus,
  ShoppingCart,
  Database,
  ChevronLeft,
} from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardSidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { isOpen, isHovering, toggle, setIsHovering } = useSidebar()

  // Xác định xem có hiển thị text hay không
  const showText = isOpen || isHovering

  return (
    <div
      className={cn(
        "relative h-screen border-r bg-white transition-all duration-300",
        isOpen ? "w-64" : "w-[70px] group",
        className,
      )}
      onMouseEnter={() => !isOpen && setIsHovering(true)}
      onMouseLeave={() => !isOpen && setIsHovering(false)}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        <div className={cn("flex items-center", !showText && "justify-center w-full")}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-800 text-white">KG</div>
          {showText && <span className="ml-2 font-semibold">Kiều Gia</span>}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className={cn("absolute -right-3 top-7 h-6 w-6 rounded-full border bg-white", !isOpen && "rotate-180")}
        >
          <ChevronLeft className="h-3 w-3" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>

      <div className="pb-12 overflow-y-auto h-[calc(100vh-64px)]">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="space-y-1">
              <Link href="/dashboard" passHref>
                <Button
                  variant={pathname === "/dashboard" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  size={showText ? "default" : "icon"}
                >
                  <LayoutDashboard className={cn("h-4 w-4", showText && "mr-2")} />
                  {showText && <span>Tổng quan</span>}
                </Button>
              </Link>
              <Link href="/" passHref>
                <Button
                  variant={pathname === "/" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  size={showText ? "default" : "icon"}
                >
                  <Home className={cn("h-4 w-4", showText && "mr-2")} />
                  {showText && <span>Trang chủ</span>}
                </Button>
              </Link>
            </div>
          </div>
          <div className="px-3 py-2">
            {showText && (
              <h2 className="mb-2 px-4 text-xs font-semibold text-muted-foreground tracking-tight">QUẢN LÝ DỰ ÁN</h2>
            )}
            <div className="space-y-1">
              <Link href="/dashboard/projects" passHref>
                <Button
                  variant={pathname?.includes("/dashboard/projects") ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  size={showText ? "default" : "icon"}
                >
                  <Building2 className={cn("h-4 w-4", showText && "mr-2")} />
                  {showText && <span>Dự án</span>}
                </Button>
              </Link>
              <Link href="/dashboard/estimation" passHref>
                <Button
                  variant={pathname?.includes("/dashboard/estimation") ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  size={showText ? "default" : "icon"}
                >
                  <TrendingUp className={cn("h-4 w-4", showText && "mr-2")} />
                  {showText && <span>Dự toán</span>}
                </Button>
              </Link>
              <Link href="/dashboard/customers" passHref>
                <Button
                  variant={pathname?.includes("/dashboard/customers") ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  size={showText ? "default" : "icon"}
                >
                  <Users className={cn("h-4 w-4", showText && "mr-2")} />
                  {showText && <span>Khách hàng</span>}
                </Button>
              </Link>
            </div>
          </div>
          <div className="px-3 py-2">
            {showText && (
              <h2 className="mb-2 px-4 text-xs font-semibold text-muted-foreground tracking-tight">QUẢN LÝ KHO</h2>
            )}
            <div className="space-y-1">
              <Link href="/dashboard/inventory" passHref>
                <Button
                  variant={pathname === "/dashboard/inventory" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  size={showText ? "default" : "icon"}
                >
                  <LayoutDashboard className={cn("h-4 w-4", showText && "mr-2")} />
                  {showText && <span>Tổng quan kho</span>}
                </Button>
              </Link>

              {showText && (
                <div className="px-3 py-1">
                  <h3 className="mb-1 px-4 text-xs font-medium text-muted-foreground">Danh mục</h3>
                </div>
              )}

              <Link href="/dashboard/inventory/materials" passHref>
                <Button
                  variant={pathname?.includes("/dashboard/inventory/materials") ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", showText && "pl-6")}
                  size={showText ? "default" : "icon"}
                >
                  <Database className={cn("h-4 w-4", showText && "mr-2")} />
                  {showText && <span>Vật tư</span>}
                </Button>
              </Link>
              <Link href="/dashboard/inventory/new" passHref>
                <Button
                  variant={pathname === "/dashboard/inventory/new" ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", showText && "pl-6")}
                  size={showText ? "default" : "icon"}
                >
                  <Plus className={cn("h-4 w-4", showText && "mr-2")} />
                  {showText && <span>Thêm vật tư mới</span>}
                </Button>
              </Link>

              {showText && (
                <div className="px-3 py-1">
                  <h3 className="mb-1 px-4 text-xs font-medium text-muted-foreground">Kho</h3>
                </div>
              )}

              <Link href="/dashboard/inventory/warehouses" passHref>
                <Button
                  variant={pathname === "/dashboard/inventory/warehouses" ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", showText && "pl-6")}
                  size={showText ? "default" : "icon"}
                >
                  <Warehouse className={cn("h-4 w-4", showText && "mr-2")} />
                  {showText && <span>Tất cả kho</span>}
                </Button>
              </Link>
              <Link href="/dashboard/inventory/warehouses/main" passHref>
                <Button
                  variant={pathname === "/dashboard/inventory/warehouses/main" ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", showText && "pl-10")}
                  size={showText ? "default" : "icon"}
                >
                  <CircleDot className={cn("h-3 w-3", showText && "mr-2")} />
                  {showText && <span>Kho chính</span>}
                </Button>
              </Link>
              <Link href="/dashboard/inventory/warehouses/project" passHref>
                <Button
                  variant={pathname === "/dashboard/inventory/warehouses/project" ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", showText && "pl-10")}
                  size={showText ? "default" : "icon"}
                >
                  <CircleDot className={cn("h-3 w-3", showText && "mr-2")} />
                  {showText && <span>Kho công trình</span>}
                </Button>
              </Link>

              {showText && (
                <div className="px-3 py-1">
                  <h3 className="mb-1 px-4 text-xs font-medium text-muted-foreground">Giao dịch</h3>
                </div>
              )}

              <Link href="/dashboard/inventory/inbound" passHref>
                <Button
                  variant={pathname === "/dashboard/inventory/inbound" ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", showText && "pl-6")}
                  size={showText ? "default" : "icon"}
                >
                  <ArrowDownToLine className={cn("h-4 w-4", showText && "mr-2")} />
                  {showText && <span>Nhập kho</span>}
                </Button>
              </Link>
              <Link href="/dashboard/inventory/outbound" passHref>
                <Button
                  variant={pathname === "/dashboard/inventory/outbound" ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", showText && "pl-6")}
                  size={showText ? "default" : "icon"}
                >
                  <ArrowUpFromLine className={cn("h-4 w-4", showText && "mr-2")} />
                  {showText && <span>Xuất kho</span>}
                </Button>
              </Link>
              <Link href="/dashboard/inventory/stocktake" passHref>
                <Button
                  variant={pathname === "/dashboard/inventory/stocktake" ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", showText && "pl-6")}
                  size={showText ? "default" : "icon"}
                >
                  <ClipboardCheck className={cn("h-4 w-4", showText && "mr-2")} />
                  {showText && <span>Kiểm kê & đóng kho</span>}
                </Button>
              </Link>

              {showText && (
                <div className="px-3 py-1">
                  <h3 className="mb-1 px-4 text-xs font-medium text-muted-foreground">Quản lý yêu cầu</h3>
                </div>
              )}

              <Link href="/dashboard/inventory/requests" passHref>
                <Button
                  variant={pathname === "/dashboard/inventory/requests" ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", showText && "pl-6")}
                  size={showText ? "default" : "icon"}
                >
                  <ClipboardSignature className={cn("h-4 w-4", showText && "mr-2")} />
                  {showText && <span>Đề xuất cấp/trả</span>}
                </Button>
              </Link>
              <Link href="/dashboard/inventory/orders" passHref>
                <Button
                  variant={pathname === "/dashboard/inventory/orders" ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", showText && "pl-6")}
                  size={showText ? "default" : "icon"}
                >
                  <Clipboard className={cn("h-4 w-4", showText && "mr-2")} />
                  {showText && <span>Lệnh cấp/điều chuyển</span>}
                </Button>
              </Link>

              {showText && (
                <div className="px-3 py-1">
                  <h3 className="mb-1 px-4 text-xs font-medium text-muted-foreground">Báo cáo</h3>
                </div>
              )}

              <Link href="/dashboard/inventory/reports/stock" passHref>
                <Button
                  variant={pathname === "/dashboard/inventory/reports/stock" ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", showText && "pl-6")}
                  size={showText ? "default" : "icon"}
                >
                  <FileBarChart className={cn("h-4 w-4", showText && "mr-2")} />
                  {showText && <span>Báo cáo tồn kho</span>}
                </Button>
              </Link>
              <Link href="/dashboard/inventory/reports/movement" passHref>
                <Button
                  variant={pathname === "/dashboard/inventory/reports/movement" ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", showText && "pl-6")}
                  size={showText ? "default" : "icon"}
                >
                  <ArrowRightLeft className={cn("h-4 w-4", showText && "mr-2")} />
                  {showText && <span>Báo cáo luân chuyển</span>}
                </Button>
              </Link>
            </div>
          </div>
          <div className="px-3 py-2">
            {showText && (
              <h2 className="mb-2 px-4 text-xs font-semibold text-muted-foreground tracking-tight">MUA HÀNG</h2>
            )}
            <div className="space-y-1">
              <Link href="/dashboard/procurement" passHref>
                <Button
                  variant={pathname === "/dashboard/procurement" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  size={showText ? "default" : "icon"}
                >
                  <ShoppingCart className={cn("h-4 w-4", showText && "mr-2")} />
                  {showText && <span>Tổng quan</span>}
                </Button>
              </Link>
              <Link href="/dashboard/procurement/suppliers" passHref>
                <Button
                  variant={pathname === "/dashboard/procurement/suppliers" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  size={showText ? "default" : "icon"}
                >
                  <Building2 className={cn("h-4 w-4", showText && "mr-2")} />
                  {showText && <span>Nhà cung cấp</span>}
                </Button>
              </Link>
              <Link href="/dashboard/procurement/purchase-requests" passHref>
                <Button
                  variant={pathname === "/dashboard/procurement/purchase-requests" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  size={showText ? "default" : "icon"}
                >
                  <ClipboardList className={cn("h-4 w-4", showText && "mr-2")} />
                  {showText && <span>Yêu cầu mua hàng</span>}
                </Button>
              </Link>
              <Link href="/dashboard/procurement/purchase-orders" passHref>
                <Button
                  variant={pathname === "/dashboard/procurement/purchase-orders" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  size={showText ? "default" : "icon"}
                >
                  <Package className={cn("h-4 w-4", showText && "mr-2")} />
                  {showText && <span>Đơn mua hàng</span>}
                </Button>
              </Link>
            </div>
          </div>
          <div className="px-3 py-2">
            {showText && (
              <h2 className="mb-2 px-4 text-xs font-semibold text-muted-foreground tracking-tight">QUẢN LÝ NHÂN SỰ</h2>
            )}
            <div className="space-y-1">
              <Link href="/dashboard/hrm" passHref>
                <Button
                  variant={pathname === "/dashboard/hrm" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  size={showText ? "default" : "icon"}
                >
                  <LayoutDashboard className={cn("h-4 w-4", showText && "mr-2")} />
                  {showText && <span>Tổng quan</span>}
                </Button>
              </Link>
              <Link href="/dashboard/hrm/employees" passHref>
                <Button
                  variant={pathname === "/dashboard/hrm/employees" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  size={showText ? "default" : "icon"}
                >
                  <Users className={cn("h-4 w-4", showText && "mr-2")} />
                  {showText && <span>Nhân viên</span>}
                </Button>
              </Link>
              <Link href="/dashboard/hrm/attendance" passHref>
                <Button
                  variant={pathname?.includes("/dashboard/hrm/attendance") ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  size={showText ? "default" : "icon"}
                >
                  <ClipboardList className={cn("h-4 w-4", showText && "mr-2")} />
                  {showText && <span>Chấm công</span>}
                </Button>
              </Link>
              <Link href="/dashboard/hrm/assets" passHref>
                <Button
                  variant={pathname?.includes("/dashboard/hrm/assets") ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  size={showText ? "default" : "icon"}
                >
                  <Package className={cn("h-4 w-4", showText && "mr-2")} />
                  {showText && <span>Tài sản</span>}
                </Button>
              </Link>
            </div>
          </div>
          <div className="px-3 py-2">
            <div className="space-y-1">
              <Link href="/dashboard/settings" passHref>
                <Button
                  variant={pathname?.includes("/dashboard/settings") ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  size={showText ? "default" : "icon"}
                >
                  <Settings className={cn("h-4 w-4", showText && "mr-2")} />
                  {showText && <span>Cài đặt</span>}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
