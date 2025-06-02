import React from 'react';
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,

} from "@/app/components/ui/select";
import { DeviceType } from '@/app/inventory/types';


interface DeviceTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  deviceTypes: DeviceType[];
  required?: boolean;
  disabled?: boolean;
}

export const DeviceTypeSelect: React.FC<DeviceTypeSelectProps> = ({
  value,
  onChange,
  deviceTypes,
  required = false,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="device_type" className="text-sm font-medium dark:text-gray-300">
        Device Type {required && '*'}
      </Label>
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger 
          className="w-full bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
          id="device_type"
        >
          <SelectValue placeholder="Select device type" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-700">
          {deviceTypes.map((type) => (
            <SelectItem
              key={type.type_id}
              value={type.type_id.toString()}
              className="hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white"
            >
              {type.type_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};