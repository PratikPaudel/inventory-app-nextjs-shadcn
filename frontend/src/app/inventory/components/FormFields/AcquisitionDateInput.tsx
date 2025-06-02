// src/app/inventory/components/FormFields/AcquisitionDateInput.tsx
"use client";

import * as React from "react";
import { format, isValid, parseISO } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";

import { cn } from "@/app/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/app/components/ui/label";

interface AcquisitionDateInputProps {
    value: string | null | undefined; // Expect YYYY-MM-DD or null/undefined
    onChange: (value: string | null) => void; // Emit YYYY-MM-DD or null
    disabled?: boolean;
}

export function AcquisitionDateInput({ value, onChange, disabled = false }: AcquisitionDateInputProps) {
    const [open, setOpen] = React.useState(false);

    // Parse the string value into a Date object for the Calendar component
    // Add validation check for parseISO result
    let selectedDate: Date | undefined = undefined;
    let displayValue: string = "Pick a date";
    if (value) {
        try {
            const parsed = parseISO(value);
            if (isValid(parsed)) { // Check if the parsed date is valid
                selectedDate = parsed;
                displayValue = format(parsed, "PPP"); // e.g., "Dec 31st, 2023"
            } else {
                displayValue = "Invalid Date"; // Indicate bad input
            }
        } catch (error) {
            console.error(`[AcquisitionDateInput] Error parsing date value: ${value}`, error);
            displayValue = "Error Parsing Date";
        }
    }


    const handleSelect = (date: Date | undefined) => {
        if (date && isValid(date)) { // Ensure selected date is valid
            onChange(format(date, "yyyy-MM-dd")); // Format back to string
        } else {
            onChange(null); // Set to null if date is undefined or invalid
        }
        setOpen(false); // Close popover after selection
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent popover trigger from firing
        onChange(null);
        setOpen(false); // Also close popover on clear
    }

    return (
        <div className="space-y-2">
            <Label htmlFor="acquisition_date" className="text-sm font-medium dark:text-gray-300">
                Acquisition Date
            </Label>
            <Popover open={open} onOpenChange={setOpen} modal={true}> {/* Keep modal=true */}
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !value && "text-muted-foreground", // Style for placeholder
                            "bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        )}
                        disabled={disabled}
                        id="acquisition_date"
                        type="button" // Explicitly set type="button"
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {/* Display the formatted date or placeholder */}
                        {value && isValid(selectedDate) ? displayValue : <span>Pick a date</span>}

                        {/* Clear button inside the trigger */}
                        {value && isValid(selectedDate) && ( // Only show clear if there's a valid value
                            <X
                                className="ml-auto h-4 w-4 opacity-50 hover:opacity-100 cursor-pointer"
                                onClick={handleClear}
                            />
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto p-0 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-md"
                    align="start"
                    style={{ zIndex: 50 }} // Keep zIndex just in case
                >
                    {/* Render calendar only when open */}
                    {open && (
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleSelect}
                            initialFocus // Focus calendar when opened
                            disabled={disabled}
                            className="dark:bg-gray-800 dark:text-white" // Base dark mode styles
                            classNames={{
                                day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-blue-600 dark:text-white",
                                day_today: "bg-accent text-accent-foreground dark:bg-gray-600 dark:text-white",
                                day_outside: "text-muted-foreground opacity-50 dark:text-gray-500",
                                head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] dark:text-gray-400",
                                nav_button: cn(
                                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                                    "dark:text-white dark:hover:bg-gray-700"
                                ),
                            }}
                        />
                    )}
                </PopoverContent>
            </Popover>
        </div>
    );
}