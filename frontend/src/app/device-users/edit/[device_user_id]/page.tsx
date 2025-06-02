"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { deviceUserSchema, DeviceUserSchema } from "../../types";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
// Import mock functions
import { getMockDeviceUserById, updateMockDeviceUser } from "../../mockDeviceUsers";

export default function EditDeviceUserPage() {
  const router = useRouter();
  const params = useParams(); // Get params object
  const device_user_id_param = params?.device_user_id; // Access device_user_id from params

  const [formError, setFormError] = useState("");
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DeviceUserSchema>({
    resolver: zodResolver(deviceUserSchema),
  });

  useEffect(() => {
    async function fetchUser() {
      setIsLoadingUser(true);
      setFormError("");
      if (!device_user_id_param || typeof device_user_id_param !== 'string') {
        setFormError("Invalid user ID.");
        setIsLoadingUser(false);
        return;
      }
      
      const userId = parseInt(device_user_id_param, 10);
      if (isNaN(userId)) {
        setFormError("Invalid user ID format.");
        setIsLoadingUser(false);
        return;
      }

      try {
          // Using mock function
        const data = await getMockDeviceUserById(userId);

        if (data) {
          setValue("first_name", data.first_name);
          setValue("last_name", data.last_name);
          setValue("email", data.email);
        } else {
          setFormError(`Mock user with ID ${userId} not found.`);
        }
      } catch (err) {
        console.error("Error fetching mock user:", err);
        setFormError("Failed to load mock user data.");
      } finally {
        setIsLoadingUser(false);
      }
    }
    fetchUser();
  }, [device_user_id_param, setValue]);

  const onSubmit = async (data: DeviceUserSchema) => {
    setFormError("");
    setIsSubmitting(true);

    if (!device_user_id_param || typeof device_user_id_param !== 'string') {
        setFormError("Invalid user ID for update.");
        setIsSubmitting(false);
        return;
    }
    const userId = parseInt(device_user_id_param, 10);
     if (isNaN(userId)) {
        setFormError("Invalid user ID format for update.");
        setIsSubmitting(false);
        return;
      }

    try {

      // Use mock function
      await updateMockDeviceUser(userId, data);
      console.log("Mock device user updated:", userId, data);

      router.push("/device-users");
    } catch (err: unknown) {
      console.error("Error during mock user update:", err);
      setFormError(err instanceof Error ? err.message : "An unexpected error occurred while updating the user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingUser) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500 dark:text-gray-400" />
        <p className="ml-2 text-gray-500 dark:text-gray-400">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Device User (Mock)</h1>

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
            className="border border-black dark:border-white dark:bg-blue-600 dark:hover:bg-blue-700">
            <Save className="w-5 h-5 mr-2" /> {isSubmitting ? "Saving..." : "Save"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/device-users")}
            className="border border-black dark:border-white dark:bg-gray-600 dark:hover:bg-gray-500"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </Button>
        </div>
      </form>
    </div>
  );
}