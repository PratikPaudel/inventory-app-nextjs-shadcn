export interface EquipmentData {
  assignment_id: number;
  assignment_start_date: string;
  notes: string;
  disposal_reason_id?: number;
  equipment: {
    asset_tag: string;
    serial_number: string;
    manufacturer: string;
    ram?: string;
    storage_capacity?: string;
    status: {
      status_id: number;
      status_name: string;
    };
    locations: {
      location_id: number;
      floor_number: number | null;
      room_number: string;
      buildings: {
      building_id: number;
      building_name: string;
      };
    };
    device_types: {
      type_id: number;
      type_name: string;
    };
  };
  device_users: {
    device_user_id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  equipment_usage_types: {
    usage_type_id: number;
    usage_name: string;
  };
}

export interface BarcodeScannerProps {
  onScan: (result: string) => void;
  onError?: (error: Error) => void;
  width?: number | string;
  height?: number | string;
  disabled?: boolean;
}

export interface ScannerControlsProps {
  isScanning: boolean;
  disabled: boolean;
  onStop: () => void;
  onStart: () => void;
}

export interface ScannerVideoProps {
  videoRef: React.RefObject<HTMLDivElement | null>;
  style?: React.CSSProperties;
}