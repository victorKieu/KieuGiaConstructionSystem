import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import InventoryOverview from "@/components/inventory/inventory-overview"
import InventoryItems from "@/components/inventory/inventory-items"
import InventoryTransactions from "@/components/inventory/inventory-transactions"
import InventorySuppliers from "@/components/inventory/inventory-suppliers"
import InventoryEquipment from "@/components/inventory/inventory-equipment"

export const metadata: Metadata = {
  title: "Quản lý kho | Kieu Gia Construction",
  description: "Quản lý kho vật tư và thiết bị",
}

export default function InventoryPage() {
  return (
    <div className="flex flex-col space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Quản lý kho</h1>
        <p className="text-gray-500">Quản lý kho vật tư và thiết bị xây dựng</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="items">Vật tư</TabsTrigger>
          <TabsTrigger value="transactions">Nhập/Xuất kho</TabsTrigger>
          <TabsTrigger value="suppliers">Nhà cung cấp</TabsTrigger>
          <TabsTrigger value="equipment">Thiết bị</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <InventoryOverview />
        </TabsContent>

        <TabsContent value="items" className="mt-6">
          <InventoryItems />
        </TabsContent>

        <TabsContent value="transactions" className="mt-6">
          <InventoryTransactions />
        </TabsContent>

        <TabsContent value="suppliers" className="mt-6">
          <InventorySuppliers />
        </TabsContent>

        <TabsContent value="equipment" className="mt-6">
          <InventoryEquipment />
        </TabsContent>
      </Tabs>
    </div>
  )
}
