"use client"

import type * as React from "react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, useNavigation } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function CustomCaption(props: {
  displayMonth: Date
  onChange?: (date: Date) => void
}) {
  const { displayMonth, onChange } = props
  const { goToMonth, nextMonth, previousMonth } = useNavigation()

  const handleCalendarChange = (newMonth: number) => {
    const newDate = new Date(displayMonth)
    newDate.setMonth(newMonth)
    if (onChange) {
      onChange(newDate)
    } else if (goToMonth) {
      goToMonth(newDate)
    }
  }

  const handleYearChange = (newYear: string) => {
    const newDate = new Date(displayMonth)
    newDate.setFullYear(Number.parseInt(newYear))
    if (onChange) {
      onChange(newDate)
    } else if (goToMonth) {
      goToMonth(newDate)
    }
  }

  const currentYear = displayMonth.getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i)

  const months = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ]

  return (
    <div className="flex items-center justify-between px-2 py-1">
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          className="h-7 w-7 p-0"
          onClick={() => previousMonth && goToMonth(previousMonth)}
          disabled={!previousMonth}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Tháng trước</span>
        </Button>

        <Select
          value={displayMonth.getMonth().toString()}
          onValueChange={(value) => handleCalendarChange(Number.parseInt(value))}
        >
          <SelectTrigger className="h-7 w-[110px] text-xs font-normal">
            <SelectValue>{months[displayMonth.getMonth()]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {months.map((month, index) => (
              <SelectItem key={index} value={index.toString()} className="text-xs">
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={displayMonth.getFullYear().toString()} onValueChange={handleYearChange}>
          <SelectTrigger className="h-7 w-[70px] text-xs font-normal">
            <SelectValue>{displayMonth.getFullYear()}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()} className="text-xs">
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        className="h-7 w-7 p-0"
        onClick={() => nextMonth && goToMonth(nextMonth)}
        disabled={!nextMonth}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Tháng sau</span>
      </Button>
    </div>
  )
}

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "hidden", // Hide default caption label
        nav: "space-x-1 flex items-center",
        nav_button: cn("h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md",
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Caption: CustomCaption,
      }}
      locale={vi}
      {...props}
    />
  )
}

interface EnhancedDatePickerProps {
  date?: Date
  setDate?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function EnhancedDatePicker({
  date,
  setDate,
  placeholder = "Chọn ngày",
  className,
  disabled = false,
}: EnhancedDatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground", className)}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "dd/MM/yyyy") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
      </PopoverContent>
    </Popover>
  )
}
