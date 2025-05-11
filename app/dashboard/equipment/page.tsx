export const dynamic = "force-dynamic"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Filter } from "lucide-react"

export default function EquipmentPage() {
    // Dữ liệu mẫu cho thiết bị
    const equipmentItems = [
        {
            id: 1,
            name: "Máy xúc Komatsu PC200",
            category: "Máy đào",
            status: "available",
            location: "Dự án Chung cư Kiều Gia",
            lastMaintenance: "2023-10-15",
            nextMaintenance: "2024-01-15",
            operator: "Nguyễn Văn A",
        },
        {
            id: 2,
            name: "Máy ủi Caterpillar D6",
            category: "Máy ủi",
            status: "in-use",
            location: "Dự án Biệt thự Vinhomes",
            lastMaintenance: "2023-09-20",
            nextMaintenance: "2023-12-20",
            operator: "Trần Văn B",
        },
        {
            id: 3,
            name: "Xe tải Hino 15 tấn",
            category: "Xe tải",
            status: "maintenance",
            location: "Xưởng sửa chữa",
            lastMaintenance: "2023-11-10",
            nextMaintenance: "2024-02-10",
            operator: "Lê Văn C",
        },
        {
            id: 4,
            name: "Máy trộn bê tông 350L",
            category: "Máy trộn",
            status: "available",
            location: "Kho thiết bị",
            lastMaintenance: "2023-10-05",
            nextMaintenance: "2024-01-05",
            operator: "Phạm Văn D",
        },
        {
            id: 5,
            name: "Cẩu tháp Potain MC85",
            category: "Cẩu",
            status: "in-use",
            location: "Dự án Nhà phố Thủ Đức",
            lastMaintenance: "2023-08-15",
            nextMaintenance: "2023-11-15",
            operator: "Hoàng Văn E",
        },
        {
            id: 6,
            name: "Máy phát điện 100KVA",
            category: "Máy phát điện",
            status: "available",
            location: "Kho thiết bị",
            lastMaintenance: "2023-09-10",
            nextMaintenance: "2023-12-10",
            operator: "Không có",
        },
    ]

    // Hàm hiển thị trạng thái thiết bị
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "available":
                return <Badge className="bg-green-500">Sẵn sàng</Badge>
            case "in-use":
                return <Badge className="bg-blue-500">Đang sử dụng</Badge>
            case "maintenance":
                return <Badge className="bg-amber-500">Bảo trì</Badge>
            case "repair":
                return <Badge className="bg-red-500">Sửa chữa</Badge>
            default:
                return <Badge className="bg-gray-500">Không xác định</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Thiết bị</h1>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm thiết bị
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input type="search" placeholder="Tìm kiếm thiết bị..." className="pl-8 bg-white" />
                </div>
                <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Lọc
                </Button>
            </div>

            <div className="bg-white rounded-md shadow">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tên thiết bị</TableHead>
                            <TableHead>Danh mục</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Vị trí</TableHead>
                            <TableHead>Bảo trì gần nhất</TableHead>
                            <TableHead>Bảo trì tiếp theo</TableHead>
                            <TableHead>Người vận hành</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {equipmentItems.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell>{getStatusBadge(item.status)}</TableCell>
                                <TableCell>{item.location}</TableCell>
                                <TableCell>{new Date(item.lastMaintenance).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(item.nextMaintenance).toLocaleDateString()}</TableCell>
                                <TableCell>{item.operator}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
