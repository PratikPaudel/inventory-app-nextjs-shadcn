"use client";

import React from "react";
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import { usePathname } from "next/navigation";

// This component is the main layout for the dashboard.
// It includes a sidebar and a navbar, and handles the state of the sidebar (collapsed or expanded).
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const pathname = usePathname();

  // Don't show layout on login page
  if (pathname === "/login") {
    return <>{children}</>;
  }

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="flex h-full">
        <aside
          className={`${
            isSidebarCollapsed ? "w-0 md:w-20" : "w-0 md:w-64"
          } bg-white dark:bg-gray-800 min-h-screen transition-all duration-300 border-r border-gray-200 dark:border-gray-700`}
        >
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            onToggle={handleToggleSidebar}
          />
        </aside>

        <main className="flex-1 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <div className="p-8">
            <Navbar onToggleSidebar={handleToggleSidebar} />
            <div className="mt-4">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;