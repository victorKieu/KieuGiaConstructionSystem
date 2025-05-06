import type React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface ResponsiveTableProps {
  headers: string[]
  data: Record<string, React.ReactNode>[]
  keyField: string
  className?: string
}

export function ResponsiveTable({ headers, data, keyField, className }: ResponsiveTableProps) {
  return (
    <div className={cn("w-full overflow-auto", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={String(row[keyField])}>
              {headers.map((header) => (
                <TableCell key={`${String(row[keyField])}-${header}`}>{row[header]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
