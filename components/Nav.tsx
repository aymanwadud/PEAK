"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { BarChart, PanelLeftOpen, PanelLeftClose, PlusCircle, GamepadIcon } from "lucide-react";
import { Settings } from "./Settings";

interface NavProps {
  toggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  onNewChat?: () => void;
}

export const Nav = ({ toggleSidebar, isSidebarOpen, onNewChat }: NavProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleAnalyticsClick = () => {
    if (pathname === '/analytics') {
      router.push('/');
    } else {
      router.push('/analytics');
    }
  };

  const handleSessionsClick = () => {
    if (pathname === '/sessions') {
      router.push('/');
    } else {
      router.push('/sessions');
    }
  };

  return (
    <div className="px-4 py-2 flex items-center h-14 z-50 bg-card border-b border-border flex-shrink-0">
      {/* Left section with fixed width */}
      <div className="w-[100px] flex items-center gap-2">
        {toggleSidebar && isSidebarOpen !== undefined && (
          <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="icon"
            className="mr-1"
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="h-5 w-5" />
            ) : (
              <PanelLeftOpen className="h-5 w-5" />
            )}
          </Button>
        )}
        {onNewChat && (
          <Button onClick={onNewChat} variant="ghost" size="icon">
            <PlusCircle className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Center section */}
      <div className="flex-1 flex items-center justify-center gap-2 px-4">
        <div className="flex items-center gap-2">
          <Button
            onClick={handleAnalyticsClick}
            variant={pathname === '/analytics' ? 'default' : 'ghost'}
            className="flex items-center gap-2 min-w-[180px] justify-center"
            size="sm"
          >
            <BarChart className="h-4 w-4" />
            <span>Performance Analytics</span>
          </Button>
          <Button
            onClick={handleSessionsClick}
            variant={pathname === '/sessions' ? 'default' : 'ghost'}
            className="flex items-center gap-2 min-w-[180px] justify-center"
            size="sm"
          >
            <GamepadIcon className="h-4 w-4" />
            <span>Game Sessions</span>
          </Button>
        </div>
      </div>

      {/* Right section with fixed width */}
      <div className="w-[100px] flex items-center justify-end">
        <Settings />
      </div>
    </div>
  );
};
