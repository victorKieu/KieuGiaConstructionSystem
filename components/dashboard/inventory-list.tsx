import Link from "next/link"
import { Package } from "lucide-react"

interface InventoryListProps {
  materials: any[]
}

export function InventoryList({ materials }: InventoryListProps) {
  if (materials.length === 0) {
    return <p className="text-muted-foreground">Không có vật tư cần nhập thêm</p>
  }

  return (
    <div className="space-y-4">
      {materials.slice(0, 5).map((material) => (
        <div key={material.id} className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <Package className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1 space-y-1">
            <Link href={`/dashboard/inventory/materials/${material.id}`} className="font-medium hover:underline">
              {material.name}
            </Link>
            <div className="flex items-center text-sm text-muted-foreground">
              <span className="text-red-500 font-medium">
                Tồn kho: {material.totalStock || 0} {material.unit}
              </span>
              <span className="mx-2">•</span>
              <span>
                Tối thiểu: {material.minStock || 0} {material.unit}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
