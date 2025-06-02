import React from 'react';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';

interface RamInputProps {
  value: string;
  onChange: (value: string) => void;
}

const RamInput = ({ value, onChange }: RamInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="ram" className="text-sm font-medium dark:text-gray-300">
        RAM
      </Label>
      <Input
        id="ram"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="p-1 w-full bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"

      />
    </div>
  );
};

export default RamInput;