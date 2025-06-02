import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";


interface SerialNumberInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function SerialNumberInput({ value, onChange, disabled = false} : SerialNumberInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="serial_number" className="text-sm font-medium dark:text-gray-300">
        Serial Number
      </Label>
      <Input
        id="serial_number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="p-1 w-full bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
        disabled={disabled}
      />
    </div>
  );
}