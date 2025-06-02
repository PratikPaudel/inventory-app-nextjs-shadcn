// ./frontend/src/app/inventory/hooks/mockReferenceData.ts
import { DeviceUser, DeviceType, UsageType, Status, DisposalReason, Building } from '../types'; // Adjusted import for Building

export const mockBuildings: Building[] = [ // Use Building type from types.ts
  { building_id: 1, building_name: "Admin Hall (Mock)" },
  { building_id: 2, building_name: "Science Wing (Mock)" },
  { building_id: 3, building_name: "Library Hub (Mock)" },
  { building_id: 17, building_name: "Ramaker (Mock)" },
  { building_id: 23, building_name: "Van Puersem Hall (Mock)" },
];

export const mockUsers: DeviceUser[] = [ // Assuming DeviceUser from types.ts matches
  { device_user_id: 1, first_name: "Alice", last_name: "Smith", email: "alice@example.com" },
  { device_user_id: 2, first_name: "Bob", last_name: "Johnson", email: "bob@example.com" },
  { device_user_id: 4, first_name: "Gerald", last_name: "Bouma", email: "gerald.b@example.com" },
  { device_user_id: 258, first_name: "John", last_name: "Vonder Bruegge", email: "john.vb@example.com" },
  { device_user_id: 302, first_name: "Benjamin", last_name: "Miller", email: "ben.m@example.com" },
  { device_user_id: 308, first_name: "Peter", last_name: "Hilla", email: "peter.h@example.com" },
];

export const mockDeviceTypes: DeviceType[] = [
  { type_id: 1, type_name: "CPU (Mock)" },
  { type_id: 2, type_name: "Laptop (Mock)" },
  { type_id: 3, type_name: "Monitor (Mock)" },
  { type_id: 4, type_name: "Printer (Mock)" },
  { type_id: 5, type_name: "Tablet (Mock)" },
];

export const mockUsageTypes: UsageType[] = [
  { usage_type_id: 1, usage_name: "Primary Workstation (Mock)" },
  { usage_type_id: 2, usage_name: "Classroom (Mock)" },
  { usage_type_id: 6, usage_name: "Public Access (Mock)" },
  { usage_type_id: 8, usage_name: "Event/Conference (Mock)" },
  { usage_type_id: 9, usage_name: "Other (Mock)" },
];

export const mockStatuses: Status[] = [
  { status_id: 1, status_name: "In use (Mock)" },
  { status_id: 2, status_name: "Spare (Mock)" },
  { status_id: 3, status_name: "In Repair (Mock)" },
  { status_id: 4, status_name: "Disposed (Mock)" },
];

export const mockDisposalReasons: DisposalReason[] = [
  { reason_id: 1, reason_name: "Damaged Beyond Repair (Mock)" },
  { reason_id: 2, reason_name: "Obsolete (Mock)" },
  { reason_id: 3, reason_name: "Sold (Mock)" },
  { reason_id: 4, reason_name: "Donated (Mock)" },
];