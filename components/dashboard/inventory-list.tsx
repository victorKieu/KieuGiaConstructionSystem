"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Material {
  id: string
  code: string
  name: string
  unit: string
  totalStock?: number
  minStock?: number
}

interface InventoryListProps {
  materials: Material[]
}

export function InventoryList({ materials }: InventoryListProps) {
  if (materials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="text-muted-foreground">Không có vật tư nào sắp hết hàng</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Mã vật tư</TableHead>
          <TableHead>Tên vật tư</TableHead>
          <TableHead>Tồn kho</TableHead>
          <TableHead>Trạng thái</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {materials.map((material) => (
          <TableRow key={material.id}>
            <TableCell className="font-medium">{material.code}</TableCell>
            <TableCell>{material.name}</TableCell>
            <TableCell>
              {material.totalStock} {material.unit}
            </TableCell>
            <TableCell>
              <Badge variant="destructive">Sắp hết hàng</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
