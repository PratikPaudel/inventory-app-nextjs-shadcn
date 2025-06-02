import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/app/components/ui/select";
import { Label } from "@/app/components/ui/label";
import { UsageType } from "@/app/inventory/types";

export function UsageTypeSelect({
  value,
  usageTypes,
  onChange,
  required
}: {
  value: number;
  usageTypes: UsageType[];
  onChange: (value: number) => void;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="usage_type" className="text-sm font-medium dark:text-gray-300">
        Usage Type {required && '*'}
      </Label>
      <Select
        value={value.toString()}
        onValueChange={(val) => onChange(Number(val))}
        required={required}
      >
        <SelectTrigger className="w-full bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600">
          <SelectValue placeholder="Select usage type" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-700">
          {usageTypes.map((type) => (
            <SelectItem
              key={type.usage_type_id}
              value={type.usage_type_id.toString()}
              className="hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white"
            >
              {type.usage_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}