import { Label } from "@/app/components/ui/label";

interface NotesTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}


export function NotesTextarea({ 
  value, 
  onChange, 
  placeholder = "Add any additional notes here..." 
}: NotesTextareaProps) {
  return (
    <div className="col-span-full space-y-2">
      <Label htmlFor="notes" className="text-sm font-medium dark:text-gray-300">
        Notes
      </Label>
      <textarea
        id="notes"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 px-3 py-2 rounded-md border border-gray-300 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder={placeholder}
      />
    </div>
  );
}