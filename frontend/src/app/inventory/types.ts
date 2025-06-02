// ./frontend/src/app/inventory/types.ts
import { z } from 'zod';

// Base interfaces for reference data
export interface DeviceUser {
  device_user_id: number; // Changed from number | null based on usage in UserSelect
  first_name: string;
  last_name: string;
  email: string;
}

export interface DeviceType {
  type_id: number;
  type_name: string;
}

export interface UsageType {
  usage_type_id: number;
  usage_name: string;
}

export interface Status {
  status_id: number;
  status_name: string;
}

export interface DisposalReason {
  reason_id: number;
  reason_name: string;
}

export interface Building {
  building_id: number;
  building_name: string;
}

// This was 'LocationDetails' in my previous suggestion, matching your original Location in types.ts
export interface Location {
  location_id: number | null; // Can be null for new locations before saving
  floor_number: number | null;
  room_number: string;
  buildings: Building; // Direct Building object
}

// Base Equipment structure matching your backend response's nested equipment
export interface BaseEquipment {
  asset_tag: string;
  serial_number?: string | null; // Allow null
  ram?: string | null;
  storage_capacity?: string | null;
  manufacturer?: string | null;
  model?: string | null;
  acquisition_date?: string | null;
  status: Status;
  locations: Location; // Using the defined Location interface
  device_types: DeviceType;
  // notes?: string; // Notes seems to be on the assignment level
  // verified?: boolean;
  // verified_at?: string | null;
}


// For creating new equipment assignment
export interface CreateEquipmentData { // This is what the form will build
  asset_tag: string;
  serial_number?: string | null;
  manufacturer?: string | null;
  model?: string | null;
  ram?: string | null;
  storage_capacity?: string | null;
  status: Status;
  acquisition_date?: string | null;
  locations: Location;
  device_types: DeviceType;
  device_users: DeviceUser | null;
  equipment_usage_types: UsageType;
  notes?: string | null;
  verified?: boolean;
  verified_at?: string | null;
  disposal_reason?: DisposalReason | null;
}

// For editing an existing equipment assignment
export interface EditEquipmentAssignment { // This is what EditModal receives and works with
  assignment_id: number;
  assignment_start_date: string;
  notes: string; // notes is at the top level of assignment
  verified?: boolean;
  verified_at?: string | null;
  equipment_usage_types: UsageType;
  equipment: BaseEquipment; // Contains all equipment-specific fields
  device_users: DeviceUser | null;
  disposal_reason?: DisposalReason | null;
}


// For listing inventory items
export interface EquipmentListing { // This is what the main page table displays
  assignment_id: number;
  assignment_start_date: string;
  notes: string | null;
  verified: boolean | null;
  verified_at: string | null;
  equipment_usage_types: UsageType;
  equipment: BaseEquipment;
  device_users: DeviceUser | null;
  // disposal_reason might not be directly in listing, but in details
}

// Modal Props
export interface CreateProductModalProps {
  onClose: () => void;
  onCreate: (data: CreateEquipmentData) => Promise<void>; // Expects CreateEquipmentData
  initialAssetTag?: string;
}

// FilterOptions Type
export interface FilterOptions {
  locations: Building[]; // Use Building type
  equipmentTypes: DeviceType[];
  isLoading: boolean;
  error: string | null;
}

export interface ActiveFilters {
  locationId?: string; // building_id as string
  equipmentTypeId?: number;
  manufacturer?: string;
  model?: string;
}

// Zod schema for validation (ensure it aligns with CreateEquipmentData)
export const equipmentSchema = z.object({
  asset_tag: z
    .string({ required_error: "Asset Tag is required" })
    .min(1, "Asset Tag is required")
    .regex(/^\d+$/, "Asset Tag must contain only numbers. If it has a leading 'r', remove it.").optional(), // Made optional as it might be auto-generated or not always present initially in UI
  serial_number: z.string().nullable().optional(),
  manufacturer: z.string().min(1, "Manufacturer is required").nullable().optional(),
  model: z.string().nullable().optional(),
  ram: z.string().nullable().optional(),
  storage_capacity: z.string().nullable().optional(),
  acquisition_date: z.string()
      .nullable()
      .optional()
      .refine(val => val === null || val === undefined || val === "" || /^\d{4}-\d{2}-\d{2}$/.test(val), {
        message: "Acquisition Date must be in YYYY-MM-DD format or empty",
      }),
  status: z.object({
    status_id: z.number().min(1, "Status is required"),
    status_name: z.string().min(1, "Status name is required"),
  }),
  locations: z.object({
    location_id: z.number().nullable().optional(), // Optional for new locations
    floor_number: z.number().nullable().optional(),
    room_number: z.string().nullable().optional(),
    buildings: z.object({ // Nested buildings object
      building_id: z.number().min(1, "Building selection is required"),
      building_name: z.string().min(1, "Building name is required"), // Name should come with ID
    }),
  }),
  device_types: z.object({
    type_id: z.number().min(1, "Device type is required"),
    type_name: z.string().min(1, "Device type name is required"),
  }),
  device_users: z.object({ // Ensure device_user_id is number here
    device_user_id: z.number(),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string().email(),
  }).nullable().optional(),
  equipment_usage_types: z.object({
    usage_type_id: z.number().min(1, "Usage type is required"),
    usage_name: z.string().min(1, "Usage type name is required"),
  }),
  notes: z.string().nullable().optional(),
  verified: z.boolean().optional().default(false),
  verified_at: z.string().nullable().optional(),
  disposal_reason: z.object({
    reason_id: z.number(),
    reason_name: z.string(),
  }).nullable().optional(),
});
