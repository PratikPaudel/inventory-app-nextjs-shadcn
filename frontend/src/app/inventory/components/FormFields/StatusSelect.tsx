import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/app/components/ui/select";
import { Label } from "@/app/components/ui/label";
import type { Status } from "../../types";


interface StatusSelectProps {
  value: number;
  statuses: Status[];
  onChange: (value: number) => void;
  onStatusChange?: (value: string) => void;
}

export function StatusSelect({ value, statuses, onChange, onStatusChange }: StatusSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="status" className="text-sm font-medium dark:text-gray-300">
        Status
      </Label>
      <Select
        value={value.toString()}
        onValueChange={(val) => {
          const numVal = parseInt(val);
          onChange(numVal);
          if (onStatusChange) {
            onStatusChange(val);
          }
        }}
      >
        <SelectTrigger className="w-full bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-700">
          {statuses.map((status) => (
            <SelectItem
              key={status.status_id}
              value={status.status_id.toString()}
              className="hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white"
            >
              {status.status_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}