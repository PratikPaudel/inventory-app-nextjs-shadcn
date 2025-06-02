// ./frontend/src/app/device-users/add/page.tsx
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { deviceUserSchema, DeviceUserSchema } from "../types";
import { useRouter } from "next/navigation";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
// Import mock function
import { addMockDeviceUser } from "../mockDeviceUsers";

export default function AddDeviceUserPage() {
  const router = useRouter();
  const [formError, setFormError] = useState(""); // Renamed from backendError for clarity
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeviceUserSchema>({
    resolver: zodResolver(deviceUserSchema),
  });

  const onSubmit = async (data: DeviceUserSchema) => {
    setFormError("");
    setIsSubmitting(true);
    try {
      // Remove fetch call:
      // const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/device-users`, { ... });
      // if (!res.ok) { ... }

      // Use mock function
      await addMockDeviceUser(data);
      console.log("Mock device user added:", data);
      // Simulate a short delay
      // await new Promise(resolve => setTimeout(resolve, 500));
      
      router.push("/device-users");
    } catch (err: unknown) {
      // This catch is for unexpected errors in the mock function or routing
      console.error("Error during mock user creation:", err);
      setFormError(err instanceof Error ? err.message : "An unexpected error occurred while adding the user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6 text-center">Add Device User (Mock)</h1>

      {formError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded border border-red-200 dark:border-red-700">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="first_name" className="block font-medium mb-2 dark:text-gray-200">First Name</label>
          <Input id="first_name" type="text" {...register("first_name")} className="w-full p-3 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          {errors.first_name && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.first_name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="last_name" className="block font-medium mb-2 dark:text-gray-200">Last Name</label>
          <Input id="last_name" type="text" {...register("last_name")} className="w-full p-3 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          {errors.last_name && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.last_name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block font-medium mb-2 dark:text-gray-200">Email</label>
          <Input id="email" type="email" {...register("email")} className="w-full p-3 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          {errors.email && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Button
            type="submit"
            variant="default"
            disabled={isSubmitting}
            className="flex items-center gap-2 border border-black dark:border-white dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" /> {isSubmitting ? "Creating..." : "Create"}
          </Button>
          <Button
            type="button" // Ensure it's not a submit button
            variant="secondary"
            onClick={() => router.push("/device-users")}
            className="flex items-center gap-2 border border-black dark:border-white dark:bg-gray-600 dark:hover:bg-gray-500"
          >
            <ArrowLeft className="w-5 h-5" /> Back
          </Button>
        </div>
      </form>
    </div>
  );
}