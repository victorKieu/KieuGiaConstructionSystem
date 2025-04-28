import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ProjectFinancialsProps {
  projectId: string
}

export default function ProjectFinancials({ projectId }: ProjectFinancialsProps) {
  // Trong thực tế, dữ liệu này sẽ được lấy từ API dựa trên projectId
  const financialData = {
    budget: 50000000000,
    spent: 22500000000,
    remaining: 27500000000,
    transactions: [
      { id: 1, date: "2023-01-20", description: "Thanh toán đợt 1", amount: 15000000000, type: "Chi" },
      { id: 2, date: "2023-02-15", description: "Thanh toán đợt 2", amount: 7500000000, type: "Chi" },
      { id: 3, date: "2023-03-01", description: "Nhận thanh toán từ khách hàng", amount: 25000000000, type: "Thu" },
    ],
  }

  // Format số tiền VND
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tổng ngân sách</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialData.budget)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Đã chi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{formatCurrency(financialData.spent)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Còn lại</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{formatCurrency(financialData.remaining)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lịch sử giao dịch</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ngày</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead className="text-right">Số tiền</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {financialData.transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    <span className={transaction.type === "Thu" ? "text-green-500" : "text-red-500"}>
                      {transaction.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={transaction.type === "Thu" ? "text-green-500" : "text-red-500"}>
                      {formatCurrency(transaction.amount)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
