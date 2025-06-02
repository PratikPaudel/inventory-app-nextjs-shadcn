// ./frontend/src/app/inventory/mockInventoryManagement.ts
import { EquipmentListing, CreateEquipmentData, EditEquipmentAssignment, ActiveFilters } from './types';
import { mockUsers, mockBuildings, mockDeviceTypes, mockStatuses, mockUsageTypes } from './hooks/mockReferenceData';

// Helper to get a random element from an array
// const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Initial mock inventory store based on your backend response structure
const mockInventoryStore: EquipmentListing[] = [
  {
    assignment_id: 4,
    assignment_start_date: "2025-04-13",
    notes: "RSC hall (Mock Item 1)",
    verified: false,
    verified_at: null,
    equipment_usage_types: mockUsageTypes.find(ut => ut.usage_type_id === 2) || mockUsageTypes[0],
    equipment: {
      asset_tag: "024758", ram: null, serial_number: "MXL9353TQK", storage_capacity: null, acquisition_date: null,
      status: mockStatuses.find(s => s.status_id === 1) || mockStatuses[0],
      device_types: mockDeviceTypes.find(dt => dt.type_id === 1) || mockDeviceTypes[0],
      manufacturer: "Hp", model: "EliteDesk 800 G4 SFF",
      locations: { location_id: 4, floor_number: 1, room_number: "", buildings: mockBuildings.find(b => b.building_id === 17) || mockBuildings[0] }
    },
    device_users: null
  },
  {
    assignment_id: 5,
    assignment_start_date: "2025-04-13",
    notes: "Conference 17 (Mock Item 2)",
    verified: true,
    verified_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    equipment_usage_types: mockUsageTypes.find(ut => ut.usage_type_id === 9) || mockUsageTypes[1],
    equipment: {
      asset_tag: "024749", ram: "16GB", serial_number: "MXL9122461", storage_capacity: "512GB SSD", acquisition_date: "2024-01-15",
      status: mockStatuses.find(s => s.status_id === 1) || mockStatuses[0],
      device_types: mockDeviceTypes.find(dt => dt.type_id === 1) || mockDeviceTypes[0],
      manufacturer: "Hp", model: "EliteDesk 800 G4 DM 35W",
      locations: { location_id: 5, floor_number: 1, room_number: "117", buildings: mockBuildings.find(b => b.building_id === 17) || mockBuildings[0] }
    },
    device_users: mockUsers.find(u => u.device_user_id === 1) || null // Alice Smith
  },
  {
    assignment_id: 10,
    assignment_start_date: "2025-04-13",
    notes: "Office Laptop (Mock Item 3)",
    verified: false,
    verified_at: null,
    equipment_usage_types: mockUsageTypes.find(ut => ut.usage_type_id === 1) || mockUsageTypes[0],
    equipment: {
      asset_tag: "LPT024531", ram: "8GB", serial_number: "MJ0H7PQ0", storage_capacity: "256GB SSD", acquisition_date: "2022-07-05",
      status: mockStatuses.find(s => s.status_id === 2) || mockStatuses[1], // Spare
      device_types: mockDeviceTypes.find(dt => dt.type_id === 2) || mockDeviceTypes[1], // Laptop
      manufacturer: "Lenovo", model: "ThinkBook 14",
      locations: { location_id: 10, floor_number: 1, room_number: "123", buildings: mockBuildings.find(b => b.building_id === 23) || mockBuildings[1] }
    },
    device_users: mockUsers.find(u => u.device_user_id === 2) || null // Bob Johnson
  },
  // Add more diverse items if needed
];
let nextInventoryId = Math.max(0, ...mockInventoryStore.map(item => item.assignment_id)) + 1;

// const PAGE_SIZE_INV = 50;

export const getMockInventoryList = (
//   page: number = 0,
//   pageSize: number = PAGE_SIZE_INV,
  searchQuery: string = ""
): Promise<EquipmentListing[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      let results = [...mockInventoryStore]; // Operate on a copy
      if (searchQuery) {
        const sqLower = searchQuery.toLowerCase();
        results = results.filter(item =>
          item.equipment.asset_tag.toLowerCase().includes(sqLower) ||
          (item.equipment.serial_number && item.equipment.serial_number.toLowerCase().includes(sqLower)) ||
          (item.device_users && `${item.device_users.first_name} ${item.device_users.last_name}`.toLowerCase().includes(sqLower)) ||
          (item.equipment.manufacturer && item.equipment.manufacturer.toLowerCase().includes(sqLower)) ||
          (item.equipment.model && item.equipment.model.toLowerCase().includes(sqLower))
        );
      }
      // Sort by assignment_id descending for now
      results.sort((a, b) => b.assignment_id - a.assignment_id);
      resolve(results);
    }, 300);
  });
};

export const getMockEquipmentDetails = (assignmentId: number): Promise<EditEquipmentAssignment | undefined> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const item = mockInventoryStore.find(inv => inv.assignment_id === assignmentId);
      if (item) {
        // Transform EquipmentListing to EditEquipmentAssignment
        // This structure assumes EditEquipmentAssignment matches EquipmentListing closely
        // but EditEquipmentAssignment might have more specific needs for the form.
        const detailedItem: EditEquipmentAssignment = {
          ...item,
          notes: item.notes ?? "", // Ensure notes is always a string
          verified: item.verified ?? false, // Ensure verified is boolean, not null
          // Ensure equipment and other nested objects are fully populated as EditEquipmentAssignment expects
        };
        resolve(detailedItem);
      } else {
        resolve(undefined);
      }
    }, 200);
  });
};

export const createMockEquipment = (data: CreateEquipmentData): Promise<EquipmentListing> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const newAssignmentId = nextInventoryId++;
      const newEntry: EquipmentListing = {
        assignment_id: newAssignmentId,
        assignment_start_date: new Date().toISOString().split('T')[0],
        notes: data.notes || "",
        verified: data.verified || false,
        verified_at: data.verified ? new Date().toISOString() : null,
        equipment_usage_types: data.equipment_usage_types,
        equipment: {
          asset_tag: data.asset_tag,
          serial_number: data.serial_number,
          ram: data.ram,
          storage_capacity: data.storage_capacity,
          acquisition_date: data.acquisition_date,
          status: data.status,
          device_types: data.device_types,
          manufacturer: data.manufacturer,
          model: data.model,
          locations: data.locations, // Ensure this is the full LocationType object
        },
        device_users: data.device_users || null,
        // disposal_reason: data.disposal_reason, // if applicable
      };
      mockInventoryStore.unshift(newEntry); // Add to the beginning
      console.log("Mock equipment created in store:", newEntry);
      resolve(newEntry);
    }, 400);
  });
};

export const updateMockEquipment = (assignmentId: number, data: EditEquipmentAssignment): Promise<EditEquipmentAssignment | undefined> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const index = mockInventoryStore.findIndex(item => item.assignment_id === assignmentId);
      if (index !== -1) {
        // Create the updated EquipmentListing from EditEquipmentAssignment
        const updatedListing: EquipmentListing = {
          assignment_id: assignmentId,
          assignment_start_date: data.assignment_start_date, // Usually not editable, comes from original
          notes: data.notes,
          verified: data.verified !== undefined ? data.verified : null,
          verified_at: data.verified_at ?? null,
          equipment_usage_types: data.equipment_usage_types,
          equipment: data.equipment, // This should be the BaseEquipment part
          device_users: data.device_users,
          // disposal_reason: data.disposal_reason, // if applicable
        };
        mockInventoryStore[index] = updatedListing;
        console.log("Mock equipment updated in store:", mockInventoryStore[index]);
        resolve(data); // Resolve with the EditEquipmentAssignment data that was passed in
      } else {
        resolve(undefined);
      }
    }, 400);
  });
};

export const searchMockInventory = (
  filters: ActiveFilters,
  page: number = 1,
  pageSize: number = 20
): Promise<{ data: EquipmentListing[], total: number }> => {
  return new Promise(resolve => {
    setTimeout(() => {
      let results = [...mockInventoryStore];

      if (filters.locationId) {
        results = results.filter(item => item.equipment.locations.buildings?.building_id === parseInt(filters.locationId!, 10));
      }
      if (filters.equipmentTypeId) {
        results = results.filter(item => item.equipment.device_types.type_id === filters.equipmentTypeId);
      }
      if (filters.manufacturer) {
        results = results.filter(item => item.equipment.manufacturer?.toLowerCase().includes(filters.manufacturer!.toLowerCase()));
      }
      if (filters.model) {
        results = results.filter(item => item.equipment.model?.toLowerCase().includes(filters.model!.toLowerCase()));
      }

      results.sort((a, b) => b.assignment_id - a.assignment_id);
      const total = results.length;
      const start = (page - 1) * pageSize;
      const paginatedResults = results.slice(start, start + pageSize);
      
      resolve({ data: paginatedResults, total });
    }, 500);
  });
};