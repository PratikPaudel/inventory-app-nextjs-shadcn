// ./frontend/src/app/reports/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/app/components/ui/button";
import { format } from "date-fns";
import { Loader2 } from "lucide-react"; // For loading indicator

// Import mock function and types
import { getMockAuditLogs, ApiAuditLog } from "./mockAuditLogData"; // Assuming ApiAuditLog is also exported from mock

// Extend the API model to add a diff summary.
interface DisplayAuditLog extends ApiAuditLog {
  diffDetails: string;
}

// PaginatedResponse interface can be simplified or removed as mock function handles response structure
// interface PaginatedResponse {
//   data: ApiAuditLog[];
//   total: number;
//   page: number;
//   page_size: number;
// }

// flattenObject, calculateDiffDetails, and DiffView components remain the same.
// They are well-written for their purpose.

/**
 * Recursively flattens a nested object into a single-level object
 * with dot-separated keys.
 */
const flattenObject = (
  obj: Record<string, unknown>,
  prefix = ""
): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        value !== null
      ) {
        Object.assign(result, flattenObject(value as Record<string, unknown>, newKey));
      } else {
        result[newKey] = value;
      }
    }
  }
  return result;
};

/**
 * Computes a diff summary between old and new values.
 * It first flattens the nested objects and then compares each key.
 */
const calculateDiffDetails = (
  oldValues: Record<string, unknown> | null,
  newValues: Record<string, unknown> | null
): string => {
  const isEmptyObject = (obj: Record<string, unknown> | null): boolean => {
    return !obj || Object.keys(obj).length === 0;
  };

  if (isEmptyObject(oldValues) && newValues && !isEmptyObject(newValues)) {
    return "Record created"; // Generic term
  }

  if (oldValues && !isEmptyObject(oldValues) && isEmptyObject(newValues)) {
    return "Record deleted"; // Generic term
  }

  if (oldValues && newValues) {
    const flatOld = flattenObject(oldValues);
    const flatNew = flattenObject(newValues);
    const allKeys = Array.from(
      new Set([...Object.keys(flatOld), ...Object.keys(flatNew)])
    );
    const differences: string[] = [];

    allKeys.forEach((key) => {
      const oldVal = flatOld[key];
      const newVal = flatNew[key];
      // More robust comparison for different types, especially null/undefined
      const oldJson = JSON.stringify(oldVal === undefined ? null : oldVal);
      const newJson = JSON.stringify(newVal === undefined ? null : newVal);

      if (oldJson !== newJson) {
        differences.push(`${key}: "${oldVal === undefined ? 'N/A' : oldVal}" → "${newVal === undefined ? 'N/A' : newVal}"`);
      }
    });

    return differences.length > 0 ? differences.join(" | ") : "No functional changes detected.";
  }

  return "No data comparison available.";
};

/**
 * DiffView shows a side-by-side comparison of the flattened JSON values.
 */
const DiffView: React.FC<{
  oldValues: Record<string, unknown> | null;
  newValues: Record<string, unknown> | null;
}> = ({ oldValues, newValues }) => {
  const renderValue = (value: unknown) => {
    if (value === null) return <em className="text-gray-400">null</em>;
    if (value === undefined) return <em className="text-gray-400">undefined</em>;
    if (typeof value === 'boolean') return value ? "true" : "false";
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  if (!oldValues && newValues) {
    return (
      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
        <h4 className="font-semibold text-green-700 dark:text-green-300">New Record Details</h4>
        <pre className="mt-2 text-xs">{JSON.stringify(newValues, null, 2)}</pre>
      </div>
    );
  }
  if (oldValues && !newValues) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-md">
        <h4 className="font-semibold text-red-700 dark:text-red-300">Deleted Record Details</h4>
        <pre className="mt-2 text-xs">{JSON.stringify(oldValues, null, 2)}</pre>
      </div>
    );
  }
  if (oldValues && newValues) {
    const flatOld = flattenObject(oldValues);
    const flatNew = flattenObject(newValues);
    const allKeys = Array.from(
      new Set([...Object.keys(flatOld), ...Object.keys(flatNew)])
    ).sort(); // Sort keys for consistent order

    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-800/30 rounded-md">
        <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Change Details</h4>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="px-2 py-1 border dark:border-gray-600 text-left font-medium">Field</th>
              <th className="px-2 py-1 border dark:border-gray-600 text-left font-medium">Old Value</th>
              <th className="px-2 py-1 border dark:border-gray-600 text-left font-medium">New Value</th>
            </tr>
          </thead>
          <tbody>
            {allKeys.map((key) => {
              const oldVal = flatOld[key];
              const newVal = flatNew[key];
              const oldJson = JSON.stringify(oldVal === undefined ? null : oldVal);
              const newJson = JSON.stringify(newVal === undefined ? null : newVal);
              const changed = oldJson !== newJson;
              
              return (
                <tr
                  key={key}
                  className={
                    changed ? "bg-yellow-50 dark:bg-yellow-900/20" : "dark:bg-gray-800/50"
                  }
                >
                  <td className="border dark:border-gray-600 px-2 py-1 font-mono">{key}</td>
                  <td className={`border dark:border-gray-600 px-2 py-1 font-mono ${changed ? 'text-red-600 dark:text-red-400' : ''}`}>
                    {renderValue(oldVal)}
                  </td>
                  <td className={`border dark:border-gray-600 px-2 py-1 font-mono ${changed ? 'text-green-600 dark:text-green-400' : ''}`}>
                    {renderValue(newVal)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
  return null;
};


export default function AuditLogPage() {
  const [auditLogs, setAuditLogs] = useState<DisplayAuditLog[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>(""); // User input for search
  const [debouncedSearch, setDebouncedSearch] = useState<string>(""); // Debounced search term

  const PAGE_SIZE = 10; // You can adjust this

  // Remove: const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // Reset to first page on new search
    }, 500); // 500ms delay
    return () => clearTimeout(handler);
  }, [search]);


  const fetchAuditLogs = useCallback(async () => { // Removed page parameter, uses currentPage state
    setIsLoading(true);
    setError(null);
    try {
      // Use mock function
      const result = await getMockAuditLogs(currentPage, PAGE_SIZE, debouncedSearch);
      
      if (Array.isArray(result.data)) {
        const transformedData: DisplayAuditLog[] = result.data.map((item) => ({
          ...item,
          diffDetails: calculateDiffDetails(item.old_values, item.new_values),
        }));
        setAuditLogs(transformedData);
        setTotalPages(Math.ceil(result.total / PAGE_SIZE));
      } else {
        // Should not happen with current mock structure but good for safety
        setAuditLogs([]);
        setTotalPages(1);
        setError("Received unexpected data format for mock audit logs.");
      }
    } catch (err) {
      console.error("Error fetching mock audit logs:", err);
      setError("Failed to load mock audit logs. Please try again.");
      setAuditLogs([]); // Clear logs on error
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearch]); // Removed backendUrl, search. Added debouncedSearch, currentPage

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]); // fetchAuditLogs will change when currentPage or debouncedSearch changes

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      // fetchAuditLogs will be called by the useEffect watching currentPage
    }
  };

  const toggleRow = (history_id: number) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(history_id)) {
        newSet.delete(history_id);
      } else {
        newSet.add(history_id);
      }
      return newSet;
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Audit Log (Mock Data)</h2>

      <div className="flex flex-col sm:flex-row items-end gap-4">
        <div className="flex-1">
          <label htmlFor="audit-search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search by Asset Tag or Serial Number
          </label>
          <input
            id="audit-search"
            type="text"
            placeholder="Enter asset tag or serial number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
  
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <Button
            variant="ghost"
            onClick={fetchAuditLogs}
            className="text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800/50"
          >
            Retry
          </Button>
        </div>
      )}

      {isLoading && (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400 flex items-center justify-center">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading audit logs...
        </div>
      )}

      {!isLoading && !error && (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Asset Tag / SN
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Operation
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Updated At
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Changes Summary
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {auditLogs.length === 0 && (
                    <tr>
                        <td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                            No audit logs found for your current search.
                        </td>
                    </tr>
                  )}
                  {auditLogs.map((log) => (
                    <React.Fragment key={log.history_id}>
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                        <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                          <div>{log.asset_tag || "N/A"}</div>
                          {log.serial_number && <div className="text-xs text-gray-500 dark:text-gray-400">{log.serial_number}</div>}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                           <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full
                              ${log.operation_type === 'INSERT' ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300' :
                                log.operation_type === 'UPDATE' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-300' :
                                log.operation_type === 'DELETE' ? 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'}`}>
                            {log.operation_type}
                          </span>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{log.table_name}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                          {format(new Date(log.updated_at), "MMM d, yyyy h:mm a")}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate" title={log.diffDetails}>
                          {log.diffDetails}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleRow(log.history_id)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            {expandedRows.has(log.history_id)
                              ? "Collapse"
                              : "Details"}
                          </Button>
                        </td>
                      </tr>
                      {expandedRows.has(log.history_id) && (
                        <tr className="bg-gray-50 dark:bg-gray-800/20">
                          <td colSpan={5} className="px-2 py-2 md:px-4 md:py-3 border-t border-gray-200 dark:border-gray-700">
                            <DiffView
                              oldValues={log.old_values}
                              newValues={log.new_values}
                            />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading}
                  className="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 hover:dark:bg-gray-600"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isLoading}
                  className="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 hover:dark:bg-gray-600"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}