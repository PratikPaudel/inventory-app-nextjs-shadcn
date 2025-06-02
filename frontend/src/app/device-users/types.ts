import { z } from "zod";

// Device User Interface – represents data returned from the backend.
export interface DeviceUser {
  device_user_id: number | null;
  first_name: string;
  last_name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

// Interface used when creating a new device user.
export interface CreateDeviceUserData {
  first_name: string;
  last_name: string;
  email: string;
}

// Zod schema for validating device user data.
// - first_name and last_name must be nonempty strings (max 50 characters).
// - email is required and must be a valid email address.
export const deviceUserSchema = z.object({
  first_name: z
    .string({ required_error: "First name is required" })
    .min(1, "First name is required")
    .max(50, "First name cannot exceed 50 characters"),
  last_name: z
    .string({ required_error: "Last name is required" })
    .min(1, "Last name is required")
    .max(50, "Last name cannot exceed 50 characters"),
  email: z.string({ required_error: "Email is required" }).email("Invalid email address"),
});

// Infer a TypeScript type from the Zod schema.
export type DeviceUserSchema = z.infer<typeof deviceUserSchema>;
