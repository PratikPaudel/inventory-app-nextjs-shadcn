import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/app/lib/utils";
import React from "react";
import type { DeviceUser } from "../../types";


interface UserSelectProps {
  value: DeviceUser | null; 
  users: DeviceUser[];   
  onChange: (user: DeviceUser | null) => void;
  required?: boolean;
}


export function UserSelect({ value, users, onChange, required = false }: UserSelectProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor="user" className="text-sm font-medium dark:text-gray-300">
        Assigned User {required && '*'}
      </Label>
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
            {value ? `${value.first_name} ${value.last_name}` : "Select user..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search users..." />
            <CommandList>
              <CommandEmpty>No user found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  value=""
                  onSelect={() => {
                    onChange(null);
                    setOpen(false);
                  }}
                >
                  None
                  <Check
                    className={cn(
                      "ml-auto",
                      !value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
                {users.map((user) => (
                  <CommandItem
                    key={user.device_user_id}
                    value={`${user.first_name} ${user.last_name} ${user.email}`}
                    onSelect={() => {
                      onChange(user);
                      setOpen(false);
                    }}
                  >
                    {`${user.first_name} ${user.last_name} (${user.email})`}
                    <Check
                      className={cn(
                        "ml-auto",


                        value?.device_user_id === user.device_user_id
                          ? "opacity-100"
                          : "opacity-0"
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
  );
}