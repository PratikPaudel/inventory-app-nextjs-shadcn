// ./frontend/src/app/dashboard/mockDashboardData.ts

// If ChartData type is defined in page.tsx, you might need to export it from there
// or define it in a shared types file. For simplicity, let's assume it's accessible
// or you can define it here as well.
export type ChartData = {
    name: string;
    value: number;
  };
  
  export const mockDevicesByStatus: ChartData[] = [
    { name: "In Use", value: 150 },
    { name: "In Stock", value: 75 },
    { name: "Under Repair", value: 20 },
    { name: "Disposed", value: 13 },
  ];
  
  export const mockDevicesByType: ChartData[] = [
    { name: "Laptop", value: 120 },
    { name: "Desktop", value: 80 },
    { name: "Tablet", value: 35 },
    { name: "Monitor", value: 50 },
    { name: "Printer", value: 15 },
  ];
  
  export const mockDevicesByBuilding: ChartData[] = [
    { name: "Admin Hall", value: 60 },
    { name: "Science Wing", value: 90 },
    { name: "Library Hub", value: 45 },
    { name: "Arts Center", value: 30 },
    { name: "Dormitory Alpha", value: 75 },
    { name: "Dormitory Beta", value: 50 },
  ];
  
  export const mockDevicesByManufacturer: ChartData[] = [
    { name: "Dell", value: 100 },
    { name: "HP", value: 70 },
    { name: "Lenovo", value: 55 },
    { name: "Apple", value: 25 },
    { name: "Acer", value: 15 },
    { name: "Other", value: 10 },
  ];