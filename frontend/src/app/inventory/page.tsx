"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/app/components/ui/table";
import { Button } from "@/app/components/ui/button";
import { Dialog, DialogContent } from "@/app/components/ui/dialog";
import { Search, PlusCircle, Pencil, QrCode, Loader2 } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import CreateProductModal from "./CreateProductModal";
import EditProductModal from "./EditProductModal";
import { useRouter } from "next/navigation";
import FilterControls from "./components/FilterControls";
import { FilterOptions, ActiveFilters, EquipmentListing, EditEquipmentAssignment } from "./types";

import { useReferenceData } from "./hooks/useReferenceData";
import { 
  getMockInventoryList, 
  getMockEquipmentDetails,
  // createMockEquipment & updateMockEquipment are used inside modals
} from "./mockInventoryManagement";


export default function InventoryPage() {
  const [inventoryData, setInventoryData] = useState<EquipmentListing[]>([]);
  const [displayedData, setDisplayedData] = useState<EquipmentListing[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const [editingEquipment, setEditingEquipment] = useState<EditEquipmentAssignment | null>(null); // Store full EditEquipmentAssignment
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { buildings, deviceTypes, isLoading: isLoadingRef, error: refError } = useReferenceData();
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    locations: [], equipmentTypes: [], isLoading: true, error: null,
  });

   useEffect(() => {
    setFilterOptions({
        locations: buildings,
        equipmentTypes: deviceTypes,
        isLoading: isLoadingRef,
        error: refError
    });
  }, [buildings, deviceTypes, isLoadingRef, refError]);

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
  const router = useRouter();

  const fetchFullInventoryList = useCallback(async (showLoading = true) => {
    if(showLoading) setIsLoadingList(true);
    setError(null);
    try {
      const result = await getMockInventoryList(); // Fetch all for initial client-side filtering
      setInventoryData(result);
      // Apply current filters and search query to the newly fetched full list
      applyFiltersAndSearch(result, activeFilters, debouncedSearchQuery);
    } catch (err) {
      console.error("Error fetching mock inventory:", err);
      setError("Failed to load mock inventory data.");
      setInventoryData([]);
      setDisplayedData([]);
    } finally {
      if(showLoading) setIsLoadingList(false);
    }
  }, [activeFilters, debouncedSearchQuery]); // Added dependencies

  // Helper to apply filters and search to a given list
  const applyFiltersAndSearch = (
    list: EquipmentListing[],
    filters: ActiveFilters,
    textQuery: string
  ) => {
    let filtered = [...list];
    if (filters.locationId) {
      filtered = filtered.filter(item => item.equipment.locations.buildings?.building_id === parseInt(filters.locationId!, 10));
    }
    if (filters.equipmentTypeId) {
      filtered = filtered.filter(item => item.equipment.device_types.type_id === filters.equipmentTypeId);
    }
    if (filters.manufacturer) {
      filtered = filtered.filter(item => item.equipment.manufacturer?.toLowerCase().includes(filters.manufacturer!.toLowerCase()));
    }
    if (filters.model) {
      filtered = filtered.filter(item => item.equipment.model?.toLowerCase().includes(filters.model!.toLowerCase()));
    }

    if (textQuery.trim()) {
      const sqLower = textQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.equipment.asset_tag.toLowerCase().includes(sqLower) ||
        (item.equipment.serial_number && item.equipment.serial_number.toLowerCase().includes(sqLower)) ||
        (item.device_users && `${item.device_users.first_name} ${item.device_users.last_name}`.toLowerCase().includes(sqLower)) ||
        (item.equipment.manufacturer && item.equipment.manufacturer.toLowerCase().includes(sqLower)) ||
        (item.equipment.model && item.equipment.model.toLowerCase().includes(sqLower))
      );
    }
    setDisplayedData(filtered);
  };


  useEffect(() => {
    fetchFullInventoryList();
  }, [fetchFullInventoryList]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Re-apply filters/search when inventoryData, activeFilters, or debouncedSearchQuery changes
  useEffect(() => {
    applyFiltersAndSearch(inventoryData, activeFilters, debouncedSearchQuery);
  }, [inventoryData, activeFilters, debouncedSearchQuery]);


  const handleFilterChange = (filterType: keyof ActiveFilters, value: string | number | undefined) => {
    setActiveFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const handleClearFilters = async () => {
    setActiveFilters({});
    // Text search query is cleared by applyFiltersAndSearch if debouncedSearchQuery is empty
    // If you want to clear searchQuery input too:
    setSearchQuery(""); 
  };
  
  const handleEditClick = async (item: EquipmentListing) => {
    setIsLoadingDetails(true);
    setIsEditModalOpen(true); // Open modal immediately to show loading state
    setError(null);
    try {
      const data = await getMockEquipmentDetails(item.assignment_id);
      if (data) {
        setEditingEquipment(data);
      } else {
        setError(`Mock equipment with ID ${item.assignment_id} not found for editing.`);
        setIsEditModalOpen(false); // Close modal if not found
      }
    } catch (err) {
      console.error("Error fetching mock equipment details for edit:", err);
      setError("Failed to fetch mock equipment details for editing.");
      setIsEditModalOpen(false);
    } finally {
      setIsLoadingDetails(false);
    }
  };
  
  const handleCreateSuccess = async () => {
    setIsCreateModalOpen(false);
    await fetchFullInventoryList(false); // Re-fetch without full page loading spinner
  };

  const handleUpdateSuccess = async () => {
    setIsEditModalOpen(false);
    setEditingEquipment(null);
    await fetchFullInventoryList(false); 
  };

  // Main page loading state
  if (isLoadingList && inventoryData.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 dark:text-blue-400" />
        <p className="ml-3 text-gray-600 dark:text-gray-300">Loading Inventory...</p>
      </div>
    );
  }

return (
  <div className="container mx-auto px-2 sm:px-4 py-8">
    <div className="mb-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Inventory Management (Mock Data)
      </h1>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-500" />
          <Input
            placeholder="Search asset, serial, user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 sm:pl-10 pr-4 py-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm sm:text-base"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button 
            onClick={() => router.push('/scan')} 
            variant="outline"
            className="flex items-center justify-center gap-2 w-full sm:w-auto dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 hover:dark:bg-gray-600 text-sm"
          >
            <QrCode className="h-4 w-4" />
            Scan
          </Button>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 w-full sm:w-auto dark:bg-blue-600 hover:dark:bg-blue-700 text-sm"
          >
            <PlusCircle className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Create New</span>
             <span className="sm:hidden">New Asset</span>
          </Button>
        </div>
      </div>
      
      <FilterControls
        filterOptions={filterOptions}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onSearchResults={(results) => {
            // FilterControls now directly provides filtered data based on its own search.
            // We might want to reconcile this with the main inventoryData or have FilterControls
            // operate on a copy of inventoryData passed to it.
            // For simplicity now, let FilterControls manage its search results.
            setDisplayedData(results);
        }}
      />
    </div>

      {error && ( // Display general errors prominently
        <div className="my-4 p-3 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-md text-sm">
          Error: {error}
           <Button onClick={() => fetchFullInventoryList(true)} size="sm" variant="ghost" className="ml-2 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800/50">Retry</Button>
        </div>
      )}

      {isLoadingList && displayedData.length === 0 && !error ? ( // Loading state for active filtering/searching
        <div className="text-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 dark:text-blue-400 mx-auto" />
          <p className="mt-3 text-gray-500 dark:text-gray-400">Loading inventory items...</p>
        </div>
      ) : displayedData.length > 0 ? (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <TableHead className="dark:text-gray-300 px-3 py-2 sm:px-4">Asset ID</TableHead>
                <TableHead className="dark:text-gray-300 px-3 py-2 sm:px-4">Location / User</TableHead>
                <TableHead className="dark:text-gray-300 px-3 py-2 sm:px-4">Type / Manufacturer</TableHead>
                <TableHead className="dark:text-gray-300 px-3 py-2 sm:px-4">Status</TableHead>
                <TableHead className="text-right dark:text-gray-300 px-3 py-2 sm:px-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedData.map((item) => (
                <TableRow key={item.assignment_id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <TableCell className="dark:text-gray-200 px-3 py-2 sm:px-4 text-xs sm:text-sm">{item.equipment.asset_tag}</TableCell>
                  <TableCell className="dark:text-gray-200 px-3 py-2 sm:px-4 text-xs sm:text-sm">
                    <div>
                      {item.equipment.locations?.buildings?.building_name || "N/A"}
                      {item.equipment.locations?.floor_number !== null ? ` - F${item.equipment.locations.floor_number}` : ""}
                      {item.equipment.locations?.room_number ? `, R: ${item.equipment.locations.room_number}` : ""}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {item.device_users
                        ? `${item.device_users.first_name} ${item.device_users.last_name}`
                        : "Unassigned"}
                    </div>
                  </TableCell>
                  <TableCell className="dark:text-gray-200 px-3 py-2 sm:px-4 text-xs sm:text-sm">
                    <div>{item.equipment.device_types.type_name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {item.equipment.manufacturer} ({item.equipment.model || "N/A"})
                    </div>
                  </TableCell>
                   <TableCell className="dark:text-gray-200 px-3 py-2 sm:px-4 text-xs sm:text-sm">
                     <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full whitespace-nowrap
                        ${item.equipment.status.status_name.includes('In use') ? 'bg-green-100 text-green-800 dark:bg-green-700/50 dark:text-green-300' :
                          item.equipment.status.status_name.includes('Spare') ? 'bg-blue-100 text-blue-800 dark:bg-blue-700/50 dark:text-blue-300' :
                          item.equipment.status.status_name.includes('Repair') ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700/50 dark:text-yellow-300' :
                          item.equipment.status.status_name.includes('Disposed') ? 'bg-red-100 text-red-800 dark:bg-red-700/50 dark:text-red-300' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'}`}>
                       {item.equipment.status.status_name}
                     </span>
                   </TableCell>
                  <TableCell className="text-right px-3 py-2 sm:px-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClick(item)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 hover:dark:text-blue-300"
                      title={`Edit ${item.equipment.asset_tag}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          No equipment found matching your current filters or search query.
        </div>
      )}

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <CreateProductModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateSuccess}
        />
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={(open) => {
          if (!open) {
              setEditingEquipment(null); // Clear data when modal is closed
              setIsEditModalOpen(false);
          }
      }}>
        {isLoadingDetails && isEditModalOpen && (
             <DialogContent className="flex justify-center items-center min-h-[200px] dark:bg-gray-800">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500 dark:text-blue-400"/> 
                <p className="ml-3 dark:text-gray-300">Loading details...</p>
            </DialogContent>
        )}
        {!isLoadingDetails && editingEquipment && isEditModalOpen && (
          <EditProductModal
            equipment={editingEquipment}
            onClose={() => {
                setIsEditModalOpen(false);
                setEditingEquipment(null);
            }}
            onUpdate={handleUpdateSuccess}
          />
        )}
      </Dialog>
    </div>
  );
}