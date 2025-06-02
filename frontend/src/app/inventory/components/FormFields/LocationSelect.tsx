import React, { useState } from 'react';
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/app/lib/utils";
import { useReferenceData } from "@/app/inventory/hooks/useReferenceData";

// Updated LocationData interface
interface LocationData {
  location_id: number;
  floor_number: number | null;
  room_number: string;
  buildings: {
    building_id: number; 
    building_name: string;
  };
}

interface LocationSelectProps {
  value: LocationData;
  onChange: (location: LocationData) => void;
  buildings: { building_id: number; building_name: string; }[];
  required?: boolean;
}

export const LocationSelect: React.FC<LocationSelectProps> = ({
  value,
  onChange,
  required = false,
}) => {
  const [open, setOpen] = useState(false);
  const { buildings: referenceBuildings } = useReferenceData(); 

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {/* Building Dropdown */}
        <div className="space-y-2">
          <Label htmlFor="building" className="text-sm font-medium dark:text-gray-300">
            Building {required && '*'}
          </Label>
          <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                {value.buildings?.building_name || "Select building..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search buildings..." />
                <CommandList>
                  <CommandEmpty>No building found.</CommandEmpty>
                  <CommandGroup>
                    {referenceBuildings.map((building) => (
                      <CommandItem
                        key={building.building_id}
                        value={building.building_name}
                        onSelect={() => {
                          onChange({
                            ...value,
                            buildings: {
                              building_id: building.building_id, 
                              building_name: building.building_name,
                            },
                          });
                          setOpen(false);
                        }}
                      >
                        {building.building_name}
                        <Check
                          className={cn(
                            "ml-auto",
                            value.buildings?.building_id === building.building_id ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Floor Number Input */}
        <div className="space-y-2">
          <Label htmlFor="floor_number" className="text-sm font-medium dark:text-gray-300">
            Floor Number
          </Label>
          <Input
            id="floor_number"
            value={value.floor_number ?? ""}
            onChange={(e) =>
              onChange({
                ...value,
                floor_number: e.target.value !== "" ? parseInt(e.target.value, 10) || null : null,
              })
            }
            className="p-1 w-full bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
            type="number"
            min={-2}
            max={10}
          />
        </div>  

        {/* Room Number Input */}
        <div className="space-y-2">
          <Label htmlFor="room_number" className="text-sm font-medium dark:text-gray-300">
            Room Number
          </Label>
          <Input
            id="room_number"
            value={value.room_number}
            onChange={(e) => onChange({ ...value, room_number: e.target.value || "" })}
            className="p-1 w-full bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>
      </div>
    </div>
  );
};
