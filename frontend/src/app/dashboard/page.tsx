// ./frontend/src/app/dashboard/page.tsx
"use client";
import { DashboardStats } from "./StatCard";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import FlipJokeCard from "./JokeCard";

// Import the mock data
import {
  mockDevicesByStatus,
  mockDevicesByType,
  mockDevicesByBuilding,
  mockDevicesByManufacturer,
  ChartData // Assuming ChartData is exported from mockDashboardData or defined here
} from './mockDashboardData';

const COLORS = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // yellow
  "#ef4444", // red
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#14b8a6", // teal
  "#f97316", // orange
];

type MetricType =
  | "devices-by-status"
  | "devices-by-type"
  | "devices-by-building"
  | "devices-by-manufacturer";

export default function Dashboard() {
  const [metricsData, setMetricsData] = useState<
    Record<MetricType, ChartData[]>
  >({
    "devices-by-status": [],
    "devices-by-type": [],
    "devices-by-building": [],
    "devices-by-manufacturer": [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewportWidth, setViewportWidth] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setViewportWidth(window.innerWidth);
      const handleResize = () => setViewportWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    const fetchAllMetrics = async () => {
      setLoading(true);
      setError(null);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 700));

      try {
        // --- Use Mock Data ---
        const newMetricsData: Record<MetricType, ChartData[]> = {
          "devices-by-status": mockDevicesByStatus,
          "devices-by-type": mockDevicesByType,
          "devices-by-building": mockDevicesByBuilding,
          "devices-by-manufacturer": mockDevicesByManufacturer,
        };
        setMetricsData(newMetricsData);
        // --- End Mock Data ---
      } catch (err) {
        // This error is less likely with static mock data but good for safety
        console.error("Error setting mock metrics data:", err);
        setError("Failed to load mock dashboard data. Please check the console.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllMetrics();
  }, []); // Empty dependency array to run once on mount

  const chartHeight = viewportWidth < 768 ? 200 : 300;

  const renderChart = (metric: MetricType) => {
    const data = metricsData[metric];

    if (loading) {
      return (
        <div className="flex justify-center items-center h-[300px]">
          <div className="text-gray-500">Loading chart data...</div>
        </div>
      );
    }

    if (error && (!data || data.length === 0)) { // Show error if data is also empty
        return (
          <div className="flex justify-center items-center h-[300px]">
            <div className="text-red-500">Error loading chart data.</div>
          </div>
        );
    }
    
    if (!data || data.length === 0) {
      return (
        <div className="flex justify-center items-center h-[300px]">
          <div className="text-gray-500">No data available for this chart.</div>
        </div>
      );
    }

    // Rest of the renderChart logic remains the same
    return metric === "devices-by-building" ? (
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          barSize={20}
        >
          <XAxis
            dataKey="name"
            interval={0}
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={60}
            className="hide-on-mobile"
          />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          />
          <Bar dataKey="value" name="Number of Devices" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    ) : (
      <ResponsiveContainer width="100%" height={chartHeight}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={viewportWidth < 768 ? 80 : 100}
            label={({ name, percent }) =>
              `${name} (${(percent * 100).toFixed(0)}%)`
            }
            labelLine={false}
            className="hide-on-mobile"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <DashboardStats />
        <FlipJokeCard />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {error && !loading ? ( // Show general error if not loading and error is present
          <div className="col-span-full text-red-500 text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-md">
            {error}
          </div>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-4">Devices by Status</h2>
              {renderChart("devices-by-status")}
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-4">Devices by Type</h2>
              {renderChart("devices-by-type")}
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-4">
                Devices by Building
              </h2>
              {renderChart("devices-by-building")}
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-4">
                Devices by Manufacturer
              </h2>
              {renderChart("devices-by-manufacturer")}
            </div>
          </>
        )}
      </div>
    </div>
  );
}