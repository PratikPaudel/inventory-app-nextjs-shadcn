// ./frontend/src/app/device-users/mockDeviceUsers.ts
import { DeviceUser } from "./types";

// In-memory store for demo purposes. This will reset on page refresh.
const mockUsers: DeviceUser[] = [
  {
    device_user_id: 1,
    first_name: "Alice",
    last_name: "Smith",
    email: "alice.smith@example.com",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
  },
  {
    device_user_id: 2,
    first_name: "Bob",
    last_name: "Johnson",
    email: "bob.johnson@example.net",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
  {
    device_user_id: 3,
    first_name: "Carol",
    last_name: "Williams",
    email: "carol.w@example.org",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    device_user_id: 4,
    first_name: "David",
    last_name: "Brown",
    email: "d.brown@example.com",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
];

let nextId = 5; // To simulate auto-incrementing IDs for new users

export const getMockDeviceUsers = (page: number, pageSize: number, query: string): Promise<{ data: DeviceUser[]; total: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => { // Simulate network delay
      let filteredUsers = mockUsers;
      if (query) {
        const lowerQuery = query.toLowerCase();
        filteredUsers = mockUsers.filter(
          (user) =>
            user.first_name.toLowerCase().includes(lowerQuery) ||
            user.last_name.toLowerCase().includes(lowerQuery) ||
            user.email.toLowerCase().includes(lowerQuery)
        );
      }

      const total = filteredUsers.length;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedData = filteredUsers.slice(start, end);
      resolve({ data: paginatedData, total });
    }, 300);
  });
};

export const getMockDeviceUserById = (id: number): Promise<DeviceUser | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = mockUsers.find((u) => u.device_user_id === id);
      resolve(user);
    }, 200);
  });
};

export const addMockDeviceUser = (userData: Omit<DeviceUser, "device_user_id" | "created_at" | "updated_at">): Promise<DeviceUser> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUser: DeviceUser = {
        ...userData,
        device_user_id: nextId++,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockUsers.unshift(newUser); // Add to the beginning for visibility
      resolve(newUser);
    }, 300);
  });
};

export const updateMockDeviceUser = (id: number, userData: Partial<Omit<DeviceUser, "device_user_id" | "created_at" | "updated_at">>): Promise<DeviceUser | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userIndex = mockUsers.findIndex((u) => u.device_user_id === id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = {
          ...mockUsers[userIndex],
          ...userData,
          updated_at: new Date().toISOString(),
        };
        resolve(mockUsers[userIndex]);
      } else {
        resolve(undefined);
      }
    }, 300);
  });
};