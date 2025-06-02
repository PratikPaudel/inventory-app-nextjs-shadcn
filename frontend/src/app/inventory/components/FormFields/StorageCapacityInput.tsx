import React from 'react';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';

interface StorageCapacityInputProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}


const StorageCapacityInput = ({ value, onChange }: StorageCapacityInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="storage_capacity" className="text-sm font-medium dark:text-gray-300">
        Storage Capacity
      </Label>
      <Input
        id="storage_capacity"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="p-1 w-full bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
      />
    </div>
  );
};


export default StorageCapacityInput;