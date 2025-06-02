// ./frontend/src/app/device-users/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { DeviceUser } from "./types";
// Import mock functions
import { getMockDeviceUsers } from "./mockDeviceUsers";


export default function DeviceUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deviceUsers, setDeviceUsers] = useState<DeviceUser[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  const PAGE_SIZE = 20; // Define page size

  const fetchDeviceUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Use mock function
      const result = await getMockDeviceUsers(currentPage, PAGE_SIZE, debouncedQuery);
      
      setDeviceUsers(result.data);
      setTotalPages(Math.ceil(result.total / PAGE_SIZE));
      
    } catch (err) {
      console.error("Error fetching mock device users:", err);
      setError("Failed to load mock device users.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedQuery]);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    fetchDeviceUsers();
  }, [fetchDeviceUsers]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8"> 
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Device Users (Mock Data)
            </h1>
            <Link href="/device-users/add">
              <Button
                  variant="default"
                  className="flex items-center gap-2 border-black dark:border-white w-full sm:w-auto"
              >
                <Plus className="w-5 h-5" />
                Add New
              </Button>
            </Link>
          </div>

          <div className="mb-6">
            <Input
                type="text"
                placeholder="Search by first name, last name, or email"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page on new search
                }}
                className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 text-sm sm:text-base"
            />
          </div>

          {error && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <span>{error}</span>
                <Button
                    variant="ghost"
                    onClick={fetchDeviceUsers} // Retry will re-fetch mock data
                    className="text-red-800 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800/50"
                >
                  Retry
                </Button>
              </div>
          )}

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-2 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">
                  Name
                </th>
                <th className="px-2 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">
                  Email
                </th>
                <th className="px-2 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">
                  Created At
                </th>
                <th className="px-2 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">
                  Last Updated
                </th>
                <th className="px-2 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">
                  Actions
                </th>
              </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      Loading mock users...
                    </td>
                  </tr>
              ) : deviceUsers.length > 0 ? (
                  deviceUsers.map((user) => (
                      <tr
                          key={user.device_user_id} // Use device_user_id as key since it will be unique in mock data
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {user.first_name} {user.last_name}
                          </div>
                        </td>
                        <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                          {user.email}
                        </td>
                        <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                          {user.created_at ? format(new Date(user.created_at), "MMM d, yyyy") : "-"}
                        </td>
                        <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                          {user.updated_at ? format(new Date(user.updated_at), "MMM d, yyyy") : "-"}
                        </td>
                        <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                              href={`/device-users/edit/${user.device_user_id}`}
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                  ))
              ) : (
                  <tr>
                    <td
                        colSpan={5}
                        className="px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-300"
                    >
                      No device users found matching your criteria.
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && !loading && ( // Hide pagination while loading
              <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="space-x-3">
                  <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2"
                  >
                    Previous
                  </Button>
                  <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2"
                  >
                    Next
                  </Button>
                </div>
              </div>
          )}
        </div>
      </div>
  );
}