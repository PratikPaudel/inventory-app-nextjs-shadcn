// ./frontend/src/app/inventory/hooks/useReferenceData.ts
import { useState, useEffect } from 'react';
import { DeviceUser, DeviceType, UsageType, Status, DisposalReason, Building } from '../types'; // Added Building
// Import mock data from the correct path
import {
  mockBuildings,
  mockUsers,
  mockDeviceTypes,
  mockUsageTypes,
  mockStatuses,
  mockDisposalReasons
} from './mockReferenceData'; // Corrected path

interface ReferenceData {
  buildings: Building[]; // Use Building type
  users: DeviceUser[];
  deviceTypes: DeviceType[];
  usageTypes: UsageType[];
  statuses: Status[];
  disposalReasons: DisposalReason[];
  isLoading: boolean;
  error: string | null;
}

export const useReferenceData = (): ReferenceData => {
  const [data, setData] = useState<ReferenceData>({
    buildings: [],
    users: [],
    deviceTypes: [],
    usageTypes: [],
    statuses: [],
    disposalReasons: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchReferenceData = async () => {
      await new Promise(resolve => setTimeout(resolve, 200)); // Shorter delay for reference data
      
      try {
        setData({
          buildings: mockBuildings,
          users: mockUsers,
          deviceTypes: mockDeviceTypes,
          usageTypes: mockUsageTypes,
          statuses: mockStatuses,
          disposalReasons: mockDisposalReasons,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error setting mock reference data:", error);
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: "Failed to load mock reference data"
        }));
      }
    };

    fetchReferenceData();
  }, []);

  return data;
};