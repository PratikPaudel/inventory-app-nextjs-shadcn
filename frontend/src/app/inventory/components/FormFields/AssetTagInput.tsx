import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";


interface AssetTagInputProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
}

export function AssetTagInput({ value, onChange, required = false, disabled = false }: AssetTagInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="asset_tag" className="text-sm font-medium dark:text-gray-300">
        Asset Tag {required && '*'}
      </Label>
      <Input
        id="asset_tag"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 p-1"
        required={required}
        disabled={disabled}
      />
    </div>
  );
}