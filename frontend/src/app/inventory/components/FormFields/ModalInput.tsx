import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

interface ModelInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function ModelInput({ value, onChange }: ModelInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="model" className="text-sm font-medium dark:text-gray-300">
        Model
      </Label>
      <Input
        id="model"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="p-1 w-full bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
      />
    </div>

  );
}