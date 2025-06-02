// ./frontend/src/app/dashboard/StatCard.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card"; // Assuming this path is correct for your Shadcn Card
import { Computer as ComputerIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  loading?: boolean;
  icon?: React.ReactNode;
}

// StatCard component itself remains unchanged
export function StatCard({
  title,
  value,
  description,
  loading = false,
  icon,
}: StatCardProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Card>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium">{title}</h3>
          {icon && (
            <div className="text-gray-400 dark:text-gray-500">{icon}</div>
          )}
        </CardHeader>
        <CardContent>
          <div className="card-content">
            {loading ? (
              <>
                {/* Loading skeleton */}
                <span className="block h-7 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-1" />
                <span className="block h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">{value}</div>
                <span className="text-xs text-muted-foreground">
                  {description}
                </span>
              </>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

// Component to demonstrate StatCard usage, now with mocked data
export function DashboardStats() {
  const [totalDevices, setTotalDevices] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      // Simulate network delay for demo purposes
      await new Promise(resolve => setTimeout(resolve, 300));

      try {
        // --- Mocked Data ---
        const mockTotalDevices = 258; // Set your desired mock value
        setTotalDevices(mockTotalDevices);
        // --- End Mocked Data ---
      } catch (error) {
        // This catch block is less critical now but can be kept for robustness
        console.error("Error setting mock total devices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <StatCard
      title="Total Devices"
      value={totalDevices}
      description="Total devices in inventory (mock data)" // Updated description
      loading={loading}
      icon={<ComputerIcon className="h-4 w-4" />}
    />
  );
}