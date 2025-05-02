
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

interface ExpirationDatePickerProps {
  value?: Date;
  onChange: (date?: Date) => void;
}

export function ExpirationDatePicker({ value, onChange }: ExpirationDatePickerProps) {
  return (
    <FormItem className="flex flex-col">
      <FormLabel>Date d'expiration</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              className={cn(
                "pl-3 text-left font-normal",
                !value && "text-muted-foreground"
              )}
            >
              {value ? (
                format(value, "PPP", { locale: fr })
              ) : (
                <span>Sélectionner une date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            disabled={(date) =>
              date < new Date() || date > new Date("2100-01-01")
            }
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <FormDescription>
        Facultative - pour recevoir des notifications avant expiration
      </FormDescription>
      <FormMessage />
    </FormItem>
  );
}
