"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format, subDays } from "date-fns";
import type { DateRange } from "react-day-picker";

import { cn } from "~/utils/cn";
import {
  Button,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui";

type TCalendarDateRangePickerProps = {
  className?: string;
  validRange?: DateRange;
  onChange: (date: DateRange | undefined) => void;
};

export function CalendarDateRangePicker({
  className,
  validRange,
  onChange,
}: TCalendarDateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(
    validRange ?? {
      from: subDays(new Date(), 30),
      to: new Date(),
    }
  );

  const onSelectRange = (date: DateRange | undefined) => {
    setDate(date);
    onChange(date);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[260px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
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
  );
}
