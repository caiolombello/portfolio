"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onRangeChange: (startDate: Date, endDate: Date) => void;
  className?: string;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onRangeChange,
  className,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange>({
    from: startDate,
    to: endDate,
  });

  const handleSelect = (range: DateRange | undefined) => {
    if (!range) return;
    setSelectedRange(range);
    if (range.from && range.to) {
      onRangeChange(range.from, range.to);
      setIsOpen(false);
    }
  };

  // Predefined ranges
  const handlePredefinedRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    onRangeChange(start, end);
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePredefinedRange(7)}
        >
          7 dias
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePredefinedRange(30)}
        >
          30 dias
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePredefinedRange(90)}
        >
          90 dias
        </Button>
      </div>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="ml-auto">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedRange.from ? (
              selectedRange.to ? (
                <>
                  {format(selectedRange.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                  {format(selectedRange.to, "dd/MM/yyyy", { locale: ptBR })}
                </>
              ) : (
                format(selectedRange.from, "dd/MM/yyyy", { locale: ptBR })
              )
            ) : (
              "Selecionar período"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="range"
            defaultMonth={selectedRange.from}
            selected={selectedRange}
            onSelect={handleSelect}
            numberOfMonths={2}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
