import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { z } from "zod";


interface ManufacturerInputProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
}

export const manufacturerSchema = z.object({
  manufacturer: z.string().min(1, "Manufacturer name must be at least 1 character").optional()
});

export function ManufacturerInput({ value, onChange, required = false, disabled = false }: ManufacturerInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="manufacturer" className="text-sm font-medium dark:text-gray-300">
        Manufacturer {required && '*'}
      </Label>
      <Input
        id="manufacturer"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="p-1 w-full bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
        placeholder="Enter manufacturer name"
        required={required}
        disabled={disabled}
      />
    </div>

  );
}
