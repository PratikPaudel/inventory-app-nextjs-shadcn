// ./frontend/src/app/reports/mockAuditLogData.ts

// Re-using the ApiAuditLog interface from your page.tsx
// You might want to move these interfaces to a shared types file eventually
export interface ApiAuditLog {
    history_id: number;
    table_name: string;
    operation_type: "INSERT" | "UPDATE" | "DELETE"; // More specific types
    old_values: Record<string, unknown> | null;
    new_values: Record<string, unknown> | null;
    updated_at: string; // ISO string format
    asset_tag?: string | null;
    serial_number?: string | null;
  }
  
  const generateRandomDate = (daysAgoMax: number = 30): string => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * daysAgoMax));
    date.setHours(Math.floor(Math.random() * 24));
    date.setMinutes(Math.floor(Math.random() * 60));
    return date.toISOString();
  };
  
  const allMockLogs: ApiAuditLog[] = [
    {
      history_id: 101,
      table_name: "equipment_assignments",
      operation_type: "UPDATE",
      old_values: {
        notes: "Old note for server",
        verified: false,
        equipment: { status: { status_id: 1, status_name: "In use" }, asset_tag: "SVR001" },
      },
      new_values: {
        notes: "Server moved to rack 5, verified.",
        verified: true,
        equipment: { status: { status_id: 1, status_name: "In use" }, asset_tag: "SVR001" },
      },
      updated_at: generateRandomDate(2),
      asset_tag: "SVR001",
      serial_number: "SN_SVR001XYZ",
    },
    {
      history_id: 102,
      table_name: "equipment_assignments",
      operation_type: "INSERT",
      old_values: null,
      new_values: {
        notes: "New laptop for marketing intern.",
        verified: false,
        equipment: {
          ram: "16GB",
          model: "Latitude 5550",
          status: { status_id: 1, status_name: "In use" },
          asset_tag: "LAP007",
          locations: { buildings: { building_id: 3, building_name: "Marketing Dept" }, floor_number: 2 },
          device_types: { type_id: 2, type_name: "Laptop" },
          manufacturer: "Dell",
        },
        device_users: { first_name: "Intern", last_name: "User", device_user_id: 10 },
        equipment_usage_types: { usage_name: "Intern Use", usage_type_id: 5 },
      },
      updated_at: generateRandomDate(5),
      asset_tag: "LAP007",
      serial_number: "SN_LAP007ABC",
    },
    {
      history_id: 103,
      table_name: "device_users", // Example for a different table
      operation_type: "UPDATE",
      old_values: { email: "old.email@example.com", first_name: "Jane" },
      new_values: { email: "jane.doe.updated@example.com", first_name: "Jane" },
      updated_at: generateRandomDate(1),
      asset_tag: null, // No asset tag if it's a user update directly
      serial_number: null,
    },
    {
      history_id: 104,
      table_name: "equipment_assignments",
      operation_type: "DELETE",
      old_values: {
        notes: "Old desktop, being disposed.",
        verified: true,
        equipment: { status: { status_id: 5, status_name: "Disposed" }, asset_tag: "DESK002" },
      },
      new_values: null,
      updated_at: generateRandomDate(10),
      asset_tag: "DESK002",
      serial_number: "SN_DESK002PQR",
    },
    {
      history_id: 105,
      table_name: "equipment_assignments",
      operation_type: "UPDATE",
      old_values: { equipment: { asset_tag: "MON003", locations: { room_number: "A101" } } },
      new_values: { equipment: { asset_tag: "MON003", locations: { room_number: "B205" } } },
      updated_at: generateRandomDate(3),
      asset_tag: "MON003",
      serial_number: "SN_MON003LMN",
    },
    // Add more mock entries to test pagination and search
    {
      history_id: 106,
      table_name: "equipment_assignments",
      operation_type: "UPDATE",
      old_values: { equipment: { asset_tag: "SVR002", serial_number: "SN_SVR002_OLD" } },
      new_values: { equipment: { asset_tag: "SVR002", serial_number: "SN_SVR002_NEW" } },
      updated_at: generateRandomDate(1),
      asset_tag: "SVR002",
      serial_number: "SN_SVR002_NEW",
    }
  ];
  
  // Function to simulate fetching paginated and searched audit logs
  export const getMockAuditLogs = (
    page: number,
    pageSize: number,
    searchQuery: string
  ): Promise<{ data: ApiAuditLog[]; total: number }> => {
    return new Promise((resolve) => {
      setTimeout(() => { // Simulate network delay
        let filteredLogs = allMockLogs;
  
        if (searchQuery) {
          const lowerQuery = searchQuery.toLowerCase();
          filteredLogs = allMockLogs.filter(
            (log) =>
              (log.asset_tag && log.asset_tag.toLowerCase().includes(lowerQuery)) ||
              (log.serial_number && log.serial_number.toLowerCase().includes(lowerQuery))
          );
        }
  
        // Sort by updated_at descending (most recent first)
        filteredLogs.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  
        const total = filteredLogs.length;
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const paginatedData = filteredLogs.slice(start, end);
  
        resolve({ data: paginatedData, total });
      }, 500); // Simulate 0.5 second delay
    });
  };