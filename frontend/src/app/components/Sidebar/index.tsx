"use client";
import {
  Archive,
  Clipboard,
  Layout,
  LucideIcon,
  Menu,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
  onNavigate?: () => void;
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  isCollapsed, 
  onNavigate,
}: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");
  
  const handleClick = () => {
    if (window.innerWidth < 768 && onNavigate) {
      onNavigate();
    }
  }

  return (
    <Link href={href} onClick={handleClick}>
      <div
        className={`cursor-pointer flex items-center ${
          isCollapsed ? "justify-center py-4" : "justify-start px-8 py-4"
        }
        hover:bg-blue-100 dark:hover:bg-blue-900/50 gap-3 transition-colors ${
          isActive
            ? "bg-blue-200 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
            : "text-gray-700 dark:text-gray-300"
        }`}
      >
        <Icon
          className={`w-6 h-6 ${
            isActive
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-700 dark:text-gray-400"
          }`}
        />
        <span className={`${isCollapsed ? "hidden" : "block"} font-medium`}>
          {label}
        </span>
      </div>
    </Link>
  );
};

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const sidebarClassNames = `fixed flex flex-col ${
    isCollapsed ? "w-0 md:w-16" : "w-72 md:w-64"
  } bg-white dark:bg-gray-800 transition-all duration-300 overflow-hidden h-full shadow-md z-40 border-r border-gray-200 dark:border-gray-700`;

  return (
    <div className={sidebarClassNames}>
      {/* TOP LOGO */}
      <div
        className={`flex gap-3 justify-between md:justify-normal items-center pt-8 ${
          isCollapsed ? "px-5" : "px-8"
        }`}
      >
        <div className="w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded"></div>
        <h1
          className={`${
            isCollapsed ? "hidden" : "block"
          } font-extrabold text-2xl text-gray-900 dark:text-gray-100`}
        >
          APP
        </h1>

        <button
          className="md:hidden px-3 py-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50"
          onClick={onToggle}
        >
          <Menu className="w-4 h-4 text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {/* LINKS */}
      <div className="flex-grow mt-8">
        <SidebarLink
          href="/dashboard"
          icon={Layout}
          label="Dashboard"
          isCollapsed={isCollapsed}
          onNavigate={onToggle}
        />
        <SidebarLink
          href="/inventory"
          icon={Archive}
          label="Inventory"
          isCollapsed={isCollapsed}
          onNavigate={onToggle}
        />
        <SidebarLink
          href="/reports"
          icon={Clipboard}
          label="Reports"
          isCollapsed={isCollapsed}
          onNavigate={onToggle}
        />
        <SidebarLink 
        href="/device-users" 
        icon={User} 
        label={"Users"} 
        isCollapsed={isCollapsed}
        onNavigate={onToggle}
        />
      </div>

      {/* FOOTER */}
      <div className={`${isCollapsed ? "hidden" : "block"} mb-10`}>
        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          &copy; 2024 APP
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
