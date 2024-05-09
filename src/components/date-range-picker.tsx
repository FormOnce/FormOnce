'use client'

import { CalendarIcon } from '@radix-ui/react-icons'
import { addSeconds, format } from 'date-fns'
import * as React from 'react'
import type { DateRange } from 'react-day-picker'

import {
  Button,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@components/ui'
import { cn } from '~/utils/cn'

type TCalendarDateRangePickerProps = {
  className?: string
  validRange?: DateRange
  onChange: (date: DateRange | undefined) => void
}

export function CalendarDateRangePicker({
  className,
  validRange,
  onChange,
}: TCalendarDateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(validRange)

  const onSelectRange = (date: DateRange | undefined) => {
    const adjustedDate = {
      from: date?.from,
      to: date?.to ? addSeconds(date.to, 86399) : undefined,
    }
    setDate(adjustedDate)
    onChange(adjustedDate)
  }

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[260px] justify-start text-left font-normal',
              !date && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onSelectRange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
