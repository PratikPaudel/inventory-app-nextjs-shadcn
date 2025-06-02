// ./frontend/src/app/inventory/components/FilterControls.tsx
import React, { useState, useEffect } from "react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/app/components/ui/select";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Loader2, RotateCcw } from "lucide-react";
import { FilterOptions, ActiveFilters, EquipmentListing } from "../types";
import { cn } from "@/app/lib/utils";
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";

import { searchMockInventory } from "../mockInventoryManagement"; // Corrected import

interface FilterControlsProps {
  filterOptions: FilterOptions;
  activeFilters: ActiveFilters;
  onFilterChange: (filterType: keyof ActiveFilters, value: string | number | undefined) => void;
  onClearFilters: () => void;
  onSearchResults: (data: EquipmentListing[]) => void; // Parent page will update its display
  className?: string;
}

export default function FilterControls({
  filterOptions,
  activeFilters,
  onFilterChange,
  onClearFilters,
  onSearchResults,
  className,
}: FilterControlsProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const PAGE_SIZE = 10; // Can be adjusted

  // Debounce the search execution
  useEffect(() => {
    const hasActiveFiltersApplied = Object.values(activeFilters).some(val => val !== undefined && String(val).trim() !== "");
    
    // If no filters are active, no need to call search.
    // Parent component (InventoryPage) should handle displaying the full list or its default state.
    if (!hasActiveFiltersApplied) {
        setTotalPages(0); // Reset pagination if no filters
        // onSearchResults([]); // Optionally clear results or let parent handle
        return;
    }

    const debounceTimer = setTimeout(() => {
      handleSearchExecution(1); // Search on page 1 when filters change
    }, 500); // 500ms debounce

    return () => clearTimeout(debounceTimer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilters]); // Trigger search when activeFilters change

  const handleSearchExecution = async (pageToSearch: number) => {
    setIsSearching(true);
    try {
      const result = await searchMockInventory(activeFilters, pageToSearch, PAGE_SIZE);
      onSearchResults(result.data);
      setTotalPages(Math.ceil(result.total / PAGE_SIZE));
      setCurrentPage(pageToSearch);
    } catch (error) {
      console.error("Error searching mock inventory via filters:", error);
      onSearchResults([]);
      setTotalPages(0);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage && !isSearching) {
      handleSearchExecution(newPage); // Fetch data for the new page
    }
  };

  const handleApplyFiltersClick = () => {
    setCurrentPage(1); // Reset to page 1
    handleSearchExecution(1);
  };

  const handleClearFiltersClick = () => {
    onClearFilters(); // This will clear activeFilters in parent, triggering useEffect
    setCurrentPage(1);
    setTotalPages(0);
    // The parent (InventoryPage) will reset its displayedData to the full list.
  };


  const hasActiveFiltersApplied = Object.values(activeFilters).some(val => val !== undefined && String(val).trim() !== "");

  return (
    <div className={cn("space-y-4 p-3 sm:p-4 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/30", className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Select
          value={activeFilters.locationId || ""}
          onValueChange={(value) => onFilterChange("locationId", value || undefined)}
          disabled={filterOptions.isLoading || isSearching}
        >
          <SelectTrigger className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600 text-xs sm:text-sm">
            <SelectValue placeholder="Filter by Building" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
            {filterOptions.locations.map((building) => (
              <SelectItem key={building.building_id} value={building.building_id.toString()} className="text-xs sm:text-sm">
                {building.building_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={activeFilters.equipmentTypeId?.toString() || ""}
          onValueChange={(value) => onFilterChange("equipmentTypeId", value ? parseInt(value) : undefined)}
          disabled={filterOptions.isLoading || isSearching}
        >
          <SelectTrigger className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600 text-xs sm:text-sm">
            <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
            {filterOptions.equipmentTypes.map((type) => (
              <SelectItem key={type.type_id} value={type.type_id.toString()} className="text-xs sm:text-sm">
                {type.type_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Manufacturer"
          value={activeFilters.manufacturer || ""}
          onChange={(e) => onFilterChange("manufacturer", e.target.value || undefined)}
          className="w-full text-xs sm:text-sm px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          disabled={filterOptions.isLoading || isSearching}
        />

        <Input
          placeholder="Model"
          value={activeFilters.model || ""}
          onChange={(e) => onFilterChange("model", e.target.value || undefined)}
          className="w-full text-xs sm:text-sm px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          disabled={filterOptions.isLoading || isSearching}
        />
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
        <Button
          onClick={handleApplyFiltersClick}
          disabled={!hasActiveFiltersApplied || isSearching || filterOptions.isLoading}
          className="dark:bg-blue-600 hover:dark:bg-blue-700 text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2"
          size="sm"
        >
          {isSearching ? (
            <Loader2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
          ) : null}
          Apply Filters
        </Button>

        {hasActiveFiltersApplied && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFiltersClick}
            disabled={isSearching || filterOptions.isLoading}
            className="dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 hover:dark:bg-gray-500 text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2"
          >
            <RotateCcw className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            Clear Filters
          </Button>
        )}
         {filterOptions.isLoading && <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-gray-400" />}
         {filterOptions.error && <p className="text-xs text-red-500 dark:text-red-400">{filterOptions.error}</p>}
      </div>

      {totalPages > 0 && hasActiveFiltersApplied && !isSearching && (
        <div className="flex justify-center mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                  className={cn((currentPage === 1) && "pointer-events-none opacity-50", "dark:text-gray-300 hover:dark:bg-gray-600")}
                  size="sm"
                />
              </PaginationItem>
              {/* Simplified pagination display for demo */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => { e.preventDefault(); handlePageChange(page); }}
                    isActive={page === currentPage}
                    size="sm"
                    className={cn("dark:text-gray-300 hover:dark:bg-gray-600", page === currentPage && "dark:bg-blue-600 dark:border-blue-700 dark:text-white")}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                  className={cn((currentPage === totalPages) && "pointer-events-none opacity-50", "dark:text-gray-300 hover:dark:bg-gray-600")}
                  size="sm"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}