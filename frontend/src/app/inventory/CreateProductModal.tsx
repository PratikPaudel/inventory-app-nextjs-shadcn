import React, { useState, useEffect } from "react";
import { BaseModal } from "./components/Modals/BaseModal";
import { AssetTagInput } from "./components/FormFields/AssetTagInput";
import { SerialNumberInput } from "./components/FormFields/SerialNumberInput";
import { DeviceTypeSelect } from "./components/FormFields/DeviceTypeSelect";
import { StatusSelect } from "./components/FormFields/StatusSelect";
import { LocationSelect } from "./components/FormFields/LocationSelect";
import { UserSelect } from "./components/FormFields/UserSelect";
import { UsageTypeSelect } from "./components/FormFields/UsageTypeSelect";
import { NotesTextarea } from "./components/FormFields/NotesTextarea";
import { useReferenceData } from "./hooks/useReferenceData";
import RamInput from "./components/FormFields/RamInput";
import StorageCapacityInput from "./components/FormFields/StorageCapacityInput";
import { ManufacturerInput } from "./components/FormFields/ManufacturerInput";
import { ModelInput } from "./components/FormFields/ModalInput";
import { AcquisitionDateInput } from "./components/FormFields/AcquisitionDateInput";
import VerificationCheck from "./components/FormFields/VerificationCheck";
import { CreateEquipmentData, equipmentSchema, CreateProductModalProps } from "./types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { DialogContent } from "@/app/components/ui/dialog";
import { Loader2 } from "lucide-react";

// Import mock function
import { createMockEquipment } from "./mockInventoryManagement";

// This function is used to get the initial form data for the CreateProductModal.
// It initializes the form fields with default values.
const getInitialFormData = (initialAssetTag?: string | null): CreateEquipmentData => ({
  asset_tag: initialAssetTag || "",
  serial_number: "",
  manufacturer: "",
  model: "",
  ram: "",
  storage_capacity: "",
  status: {
    status_id: 1,
    status_name: "In Use",
  },
  acquisition_date: null,
  locations: {
    location_id: null,
    floor_number: null,
    room_number: "",
    buildings: {
      building_id: 0, 
      building_name: "",
    },
  },
  device_types: {
    type_id: 0,
    type_name: "",
  },
  device_users: null,
  equipment_usage_types: {
    usage_type_id: 0,
    usage_name: "",
  },
  notes: "", 
  verified: false, 
  verified_at: null
});

// This function is the main component for creating a new product.
// It includes a form with various fields for the product details.
// The form is validated before submission, and an alert dialog is shown for disposal reasons.
// The component uses a modal for displaying the form, and handles loading and error states.
// It also uses a custom hook to fetch reference data for the form fields.
// The component accepts props for closing the modal and handling the creation of the product.
export default function CreateProductModal({
  onClose,
  onCreate,
  initialAssetTag,
}: CreateProductModalProps) {
  const [formData, setFormData] = useState<CreateEquipmentData>(
    getInitialFormData(initialAssetTag)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showDisposeConfirm, setShowDisposeConfirm] = useState(false);

  const { buildings, users, deviceTypes, statuses, usageTypes, disposalReasons, isLoading: isLoadingRefData } = useReferenceData();

  useEffect(() => {
    if (initialAssetTag) {
      setFormData((prev) => ({ ...prev, asset_tag: initialAssetTag }));
    }
  }, [initialAssetTag]);

  // Set default status if statuses are loaded
  useEffect(() => {
    if (statuses.length > 0 && formData.status.status_id === 0) {
      const defaultStatus = statuses.find(s => s.status_name.toLowerCase().includes("in use")) || statuses[0];
      if (defaultStatus) {
        setFormData(prev => ({
          ...prev, 
          status: defaultStatus
        }));
      }
    }
  }, [statuses, formData.status.status_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      // Ensure required fields are provided
      if (!formData.locations.buildings?.building_id || formData.locations.buildings.building_id === 0) {
        throw new Error("Building is required");
      }

      if (formData.device_types.type_id === 0) {
        throw new Error("Device Type is required");
      }

      if (formData.equipment_usage_types.usage_type_id === 0) {
        throw new Error("Usage Type is required");
      }

      if (formData.status.status_id === 0) {
        throw new Error("Status is required");
      }

      // Parse numeric fields and ensure valid values
      const apiData = {
        ...formData,
        locations: {
          location_id: null, // Let backend determine location_id
          floor_number:
            formData.locations.floor_number !== null && formData.locations.floor_number !== undefined
              ? Number(formData.locations.floor_number)
              : null,
          room_number: formData.locations.room_number || "",
          buildings: {
            building_id: formData.locations.buildings.building_id,
            building_name: buildings.find(b => b.building_id === formData.locations.buildings.building_id)?.building_name || ""
          }
        },
        device_types: {
          type_id: formData.device_types.type_id,
          type_name:
            deviceTypes.find((t) => t.type_id === formData.device_types.type_id)?.type_name || "",
        },
        equipment_usage_types: {
          usage_type_id: formData.equipment_usage_types.usage_type_id,
          usage_name:
            usageTypes.find((u) => u.usage_type_id === formData.equipment_usage_types.usage_type_id)
              ?.usage_name || "",
        },
        status: {
          status_id: formData.status.status_id,
          status_name: statuses.find(s => s.status_id === formData.status.status_id)?.status_name || ""
        }
      };

      // Validate form data
      const validationResult = equipmentSchema.safeParse(apiData);
      if (!validationResult.success) {
        const errors = validationResult.error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join("; ");
        throw new Error(`Validation failed: ${errors}`);
      }

      // Use mock creation function instead of real API call
      await createMockEquipment(validationResult.data as CreateEquipmentData);
      console.log("Mock equipment created:", validationResult.data);

      await onCreate(validationResult.data as CreateEquipmentData);
      setFormData(getInitialFormData());
      onClose();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Failed to create equipment");
      console.error("Mock creation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle status change and show confirmation dialog if status is "Disposed"
  const handleStatusChange = (statusId: number) => {
    const statusObj = statuses.find(s => s.status_id === statusId);
    const isDisposed = statusObj?.status_name.toLowerCase().includes("disposed");

    setFormData(prev => ({
      ...prev,
      status: statusObj || { status_id: statusId, status_name: "Unknown" },
      disposal_reason: isDisposed ? prev.disposal_reason : undefined
    }));

    if (isDisposed) setShowDisposeConfirm(true);
  };

  // Show loading spinner while reference data is loading
  if (isLoadingRefData) {
    return (
      <DialogContent className="w-[85%] sm:w-[95%] max-w-2xl mx-auto dark:bg-gray-800 overflow-y-auto max-h-[92vh] flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-3 dark:text-gray-300">Loading form data...</p>
      </DialogContent>
    );
  }

  return (
    <>
      <BaseModal
        title="Create New Equipment"
        isLoading={isSubmitting}
        error={formError}
        onClose={onClose}
        onSubmit={handleSubmit}
        submitText="Create Equipment"
        loadingText="Creating..."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            <AssetTagInput
              value={formData.asset_tag}
              onChange={(value) => setFormData({ ...formData, asset_tag: value })}
              required
            />
            <SerialNumberInput
              value={formData.serial_number || ""}
              onChange={(value) => setFormData({ ...formData, serial_number: value })}
            />
            <DeviceTypeSelect
              value={formData.device_types.type_id.toString()}
              deviceTypes={deviceTypes}
              onChange={(value) => {
                const selectedType = deviceTypes.find(t => t.type_id === parseInt(value));
                setFormData((prev) => ({
                  ...prev,
                  device_types: selectedType || { type_id: parseInt(value), type_name: "Unknown"},
                }));
              }}
              required
            />
            <StatusSelect
              value={formData.status.status_id}
              statuses={statuses}
              onChange={handleStatusChange}
            />
            <RamInput
              value={formData.ram || ""}
              onChange={(value) => setFormData({ ...formData, ram: value })}
            />
            <StorageCapacityInput
              value={formData.storage_capacity || ""}
              onChange={(value) => setFormData({ ...formData, storage_capacity: value })}
            />
            <UsageTypeSelect
              value={formData.equipment_usage_types.usage_type_id}
              usageTypes={usageTypes}
              onChange={(value) => {
                const selectedUsageType = usageTypes.find(u => u.usage_type_id === value);
                setFormData((prev) => ({
                  ...prev,
                  equipment_usage_types: selectedUsageType || {
                    usage_type_id: value,
                    usage_name: "Unknown"
                  },
                }));
              }}
              required
            />
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <ManufacturerInput
              value={formData.manufacturer || ""}
              onChange={(value) => setFormData({ ...formData, manufacturer: value })}
              required
            />
            <ModelInput
              value={formData.model || ""}
              onChange={(value) => setFormData({ ...formData, model: value })}
            />
            <LocationSelect
              value={{
                location_id: formData.locations.location_id || 0,
                buildings: {
                  building_id: formData.locations.buildings?.building_id || 0,
                  building_name: formData.locations.buildings?.building_name || "",
                },
                floor_number: formData.locations.floor_number ?? null,
                room_number: formData.locations.room_number || "",
              }}
              buildings={buildings}
              onChange={(location) =>
                setFormData((prev) => ({
                  ...prev,
                  locations: {
                    ...prev.locations,
                    floor_number: location.floor_number
                      ? parseInt(location.floor_number as unknown as string, 10)
                      : null,
                    room_number: location.room_number || "",
                    buildings: {
                      building_id: location.buildings?.building_id || 0,
                      building_name: location.buildings?.building_name || "",
                    },
                  },
                }))
              }
            />

            <UserSelect
              value={formData.device_users || null}
              users={users}
              onChange={(user) =>
                setFormData((prev) => ({
                  ...prev,
                  device_users: user,
                }))
              }
            />
            
            <AcquisitionDateInput
              value={formData.acquisition_date}
              onChange={(dateString) =>
                setFormData((prev) => ({
                  ...prev,
                  acquisition_date: dateString,
                }))
              }
            />
            <VerificationCheck
              isVerified={formData.verified ?? false}
              onChange={(verified: boolean) =>
                setFormData((prev) => ({
                  ...prev,
                  verified,
                  verified_at: verified ? new Date().toISOString() : null,
                }))
              }
            />
          </div>
        </div>

        {/* Notes Section */}
        <NotesTextarea
          value={formData.notes || ""}
          onChange={(value) => setFormData({ ...formData, notes: value })}
        />
      </BaseModal>

      <AlertDialog open={showDisposeConfirm} onOpenChange={setShowDisposeConfirm}>
        <AlertDialogContent className="bg-white dark:bg-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-white">Disposal Details Required</AlertDialogTitle>
            <AlertDialogDescription className="dark:text-gray-400">
              Please select a reason for disposing this equipment:
              <Select
                value={formData.disposal_reason?.reason_id.toString() || ""}
                onValueChange={(value) =>
                  setFormData(prev => ({
                    ...prev,
                    disposal_reason: disposalReasons.find(r => r.reason_id === parseInt(value))
                  }))
                }
              >
                <SelectTrigger className="w-full bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 mt-2">
                  <SelectValue placeholder="Select disposal reason" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-700">
                  {disposalReasons?.map(reason => (
                    <SelectItem 
                      key={reason.reason_id} 
                      value={reason.reason_id.toString()} 
                      className="dark:text-white dark:focus:bg-gray-600 dark:hover:bg-gray-600"
                    >
                      {reason.reason_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600" 
              onClick={() => {
                setShowDisposeConfirm(false);
                // Reset status if user cancels
                setFormData(prev => ({
                  ...prev,
                  status: {
                    status_id: 1,
                    status_name: "In Use"
                  }
                }));
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              className="dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700" 
              onClick={() => setShowDisposeConfirm(false)}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}