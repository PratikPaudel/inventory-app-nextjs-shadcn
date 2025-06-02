"use client";

import { Menu, LogOut } from "lucide-react";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "src/components/ui/dropdown-menu";
import { ThemeToggle } from "@/app/components/theme-toggle";

interface NavbarProps {
  onToggleSidebar: () => void;
}

const UserAvatar = () => (
  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white">
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
        fill="currentColor"
      />
      <path
        d="M12 12C8.13401 12 5 15.134 5 19V21H19V19C19 15.134 15.866 12 12 12Z"
        fill="currentColor"
      />
    </svg>
  </div>
);

const Navbar = ({ onToggleSidebar }: NavbarProps) => {

  const handleLogout = () => {
    console.log("Logout action triggered.");
    alert("Simulated Logout. In a real app, you'd be redirected to login.");
  };

  return (
    <div className="flex justify-between items-center w-full mb-7">
      {/* LEFT SIDE */}
      <div className="flex justify-between items-center gap-5">
        <button
          className="px-3 py-3 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900"
          onClick={onToggleSidebar}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex justify-between items-center gap-5">
        <div className="hidden md:flex justify-between items-center gap-5">
          <ThemeToggle />
          <hr className="w-0 h-7 border border-solid border-l border-gray-300 dark:border-gray-700 mx-3" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 cursor-pointer">
                <UserAvatar />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                {/* Placeholder user info */}
                <p className="text-sm font-medium">Demo User</p>
                <p className="text-sm text-gray-500">demo@example.com</p>
              </div>
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Logout (Simulated)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;