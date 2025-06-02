// EditProductModal.tsx
import React, { useState, useEffect } from "react";
import { BaseModal } from "./components/Modals/BaseModal";
import { AssetTagInput } from "./components/FormFields/AssetTagInput";
import { SerialNumberInput } from "./components/FormFields/SerialNumberInput";
import { DeviceTypeSelect } from "./components/FormFields/DeviceTypeSelect";
import { StatusSelect } from "./components/FormFields/StatusSelect";
import { LocationSelect } from "./components/FormFields/LocationSelect";
import { UserSelect } from "./components/FormFields/UserSelect";
import { NotesTextarea } from "./components/FormFields/NotesTextarea";
import { UsageTypeSelect } from "./components/FormFields/UsageTypeSelect";
import RamInput from "./components/FormFields/RamInput";
import StorageCapacityInput from "./components/FormFields/StorageCapacityInput";
import { AcquisitionDateInput } from "./components/FormFields/AcquisitionDateInput";
import VerificationCheck from "@/app/inventory/components/FormFields/VerificationCheck";
import { ManufacturerInput } from "./components/FormFields/ManufacturerInput";
import { ModelInput } from "./components/FormFields/ModalInput";
import { useReferenceData } from "./hooks/useReferenceData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import type { EditEquipmentAssignment } from "./types";
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

interface EditProductModalProps {
  equipment: EditEquipmentAssignment;
  onClose: () => void;
  onUpdate: (data: EditEquipmentAssignment) => Promise<void>;
}

// This component is a modal for editing equipment details.
// It includes various input fields for the user to update the equipment information.
export default function EditProductModal({
  equipment,
  onClose,
  onUpdate,
}: EditProductModalProps) {
  const [formData, setFormData] = useState<EditEquipmentAssignment>(equipment);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDisposeConfirm, setShowDisposeConfirm] = useState(false);

  // Get reference data via hook
  const { buildings, users, deviceTypes, statuses, usageTypes, disposalReasons } = useReferenceData();

  // Fetch detailed equipment data when the modal mounts (or when assignment_id changes)
  useEffect(() => {
    async function fetchDetailedData() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        const res = await fetch(`${backendUrl}/api/inventory/${equipment.assignment_id}`, {
          credentials: "include",
        });
        if (res.ok) {
          const detailedData = await res.json();
          setFormData(detailedData);
        } else {
          const errorData = await res.json();
          setError(errorData.detail || "Failed to fetch detailed equipment information");
        }
      } catch (err) {
        setError(`Failed to fetch detailed equipment information: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
    fetchDetailedData();
  }, [equipment.assignment_id]);
  // Sync formData with equipment prop in case it changes externally
  useEffect(() => {
    setFormData(equipment);
  }, [equipment]);

  // Handle status change and trigger disposal confirmation if needed
  const handleStatusChange = (statusId: number) => {
    const statusObj = statuses.find(s => s.status_id === statusId);
    const isDisposed = statusObj?.status_name === "Disposed";

    setFormData(prev => ({
      ...prev,
      equipment: {
        ...prev.equipment,
        status: {
          status_id: statusId,
          status_name: statusObj?.status_name || ""
        }
      },
      disposal_reason: isDisposed ? prev.disposal_reason : undefined
    }));

    if (isDisposed) setShowDisposeConfirm(true);
  };

  // Handle form submit with PUT update call
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

      // Build the update payload (only editable fields)
      const updateData = {
        serial_number: formData.equipment.serial_number,
        ram: formData.equipment.ram,
        storage_capacity: formData.equipment.storage_capacity,
        acquisition_date: formData.equipment.acquisition_date || null,
        manufacturer: formData.equipment.manufacturer,
        model: formData.equipment.model || "", 
        device_types: { 
            type_id: formData.equipment.device_types.type_id,
            type_name:
                deviceTypes.find((t) => t.type_id === formData.equipment.device_types.type_id)
                    ?.type_name || "",
        },
        locations: {
          building_id: formData.equipment.locations.buildings?.building_id || 0,
          floor_number: typeof formData.equipment.locations.floor_number === "string" 
            ? parseInt(formData.equipment.locations.floor_number) || null 
            : formData.equipment.locations.floor_number,
          room_number: formData.equipment.locations.room_number
        },
        status: {
          status_id: formData.equipment.status.status_id,
          status_name: formData.equipment.status.status_name
        },
        disposal_reason_id: formData.disposal_reason ? formData.disposal_reason.reason_id : undefined,
        notes: formData.notes,
        verified: formData.verified ?? false,
        verified_at: formData.verified_at ?? null,
        equipment_usage_types: {
          usage_type_id: formData.equipment_usage_types.usage_type_id
        },
        device_users: formData.device_users
          ? { device_user_id: formData.device_users.device_user_id }
          : null
      };
      if (formData.notes && formData.notes.trim() !== "") {
        updateData.notes = formData.notes;
      }
      const response = await fetch(
        `${backendUrl}/api/inventory/${equipment.assignment_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update equipment");
      }

      await onUpdate(formData);
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update equipment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <BaseModal
        title="Edit Equipment"
        isLoading={isLoading}
        error={error}
        onClose={onClose}
        onSubmit={handleSubmit}
        submitText="Update Equipment"
        loadingText="Updating..."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            <AssetTagInput
              value={formData.equipment.asset_tag}
              onChange={(value) =>
                setFormData(prev => ({
                  ...prev,
                  equipment: { ...prev.equipment, asset_tag: value }
                }))
              }
              disabled
            />
            <SerialNumberInput
              value={formData.equipment.serial_number || ""}
              onChange={(value) =>
                setFormData(prev => ({
                  ...prev,
                  equipment: { ...prev.equipment, serial_number: value }
                }))
              }
            />
            <DeviceTypeSelect
              value={formData.equipment.device_types.type_id.toString()}
              deviceTypes={deviceTypes}
              onChange={(value) =>
                setFormData(prev => ({
                  ...prev,
                  equipment: {
                    ...prev.equipment,
                    device_types: {
                      type_id: parseInt(value),
                      type_name: deviceTypes.find(t => t.type_id === parseInt(value))?.type_name || ""
                    }
                  }
                }))
              }
            />
            <ManufacturerInput
              value={formData.equipment.manufacturer || ""}
              onChange={(value) =>
                setFormData(prev => ({
                  ...prev,
                  equipment: { ...prev.equipment, manufacturer: value }
                }))
              }
            />
            <ModelInput
              value={formData.equipment.model || ""}
              onChange={(value) =>
                setFormData(prev => ({
                  ...prev,
                  equipment: { ...prev.equipment, model: value }
                }))
              }
            />

            <RamInput
              value={formData.equipment.ram || ""}
              onChange={(value) =>
                setFormData(prev => ({
                  ...prev,
                  equipment: { ...prev.equipment, ram: value }
                }))
              }
            />
            <StorageCapacityInput
              value={formData.equipment.storage_capacity || ""}
              onChange={(value) =>
                setFormData(prev => ({
                  ...prev,
                  equipment: { ...prev.equipment, storage_capacity: value }
                }))
              }
            />
          </div>
          {/* Right Column */}
          <div className="space-y-4">
            <StatusSelect
              value={formData.equipment.status.status_id}
              statuses={statuses}
              onChange={handleStatusChange}
            />
            <LocationSelect
              value={{
                location_id: formData.equipment.locations.location_id || 0,
                buildings: {
                  building_id: formData.equipment.locations.buildings?.building_id || 0,
                  building_name: formData.equipment.locations.buildings?.building_name || "",
                },
                floor_number: typeof formData.equipment.locations.floor_number === "string" 
                  ? parseInt(formData.equipment.locations.floor_number) || null 
                  : formData.equipment.locations.floor_number,
                room_number: formData.equipment.locations.room_number
              }}
              buildings={buildings}
              onChange={(location) =>
                setFormData((prev) => ({
                  ...prev,
                  equipment: {
                    ...prev.equipment,
                    locations: {
                      ...prev.equipment.locations,
                      floor_number: location.floor_number,
                      room_number: location.room_number || "", 
                      buildings: {
                        building_id: location.buildings?.building_id || 0,
                        building_name: location.buildings?.building_name || "",
                      },
                    },
                  },
                }))
              }
            />

            <UsageTypeSelect
              value={formData.equipment_usage_types.usage_type_id}
              usageTypes={usageTypes}
              onChange={(usageTypeId) =>
                setFormData(prev => ({
                  ...prev,
                  equipment_usage_types: {
                    usage_type_id: usageTypeId,
                    usage_name: usageTypes.find(u => u.usage_type_id === usageTypeId)?.usage_name || ""
                  }
                }))
              }
            />
            <UserSelect
              value={formData.device_users}
              users={users}
              onChange={(user) =>
                setFormData(prev => ({
                  ...prev,
                  device_users: user
                }))
              }
            />
              <AcquisitionDateInput 
                  value={formData.equipment.acquisition_date} 
                  onChange={(dateString) =>
                      setFormData((prev) => ({
                          ...prev,
                          equipment: { 
                              ...prev.equipment,
                              acquisition_date: dateString, 
                          },
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
        <NotesTextarea
          value={formData.notes || ""}
          onChange={(value) =>
            setFormData(prev => ({ ...prev, notes: value }))
          }
        />
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
                  <SelectTrigger className="w-full bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600">
                <SelectValue placeholder="Select disposal reason" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-700">
                    {disposalReasons?.map(reason => (
                      <SelectItem key={reason.reason_id} value={reason.reason_id.toString()} className="dark:text-white dark:focus:bg-gray-600 dark:hover:bg-gray-600">
                        {reason.reason_name} 
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600" onClick={() => {
                setShowDisposeConfirm(false);
                // Reset status if user cancels
                setFormData(prev => ({
                  ...prev,
                  equipment: {
                    ...prev.equipment,
                    status: equipment.equipment.status
                  }
                }));
              }}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction  className="dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700" onClick={() => setShowDisposeConfirm(false)}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </BaseModal>
    </>
  );
}
