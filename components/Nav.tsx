"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { BarChart, PanelLeftOpen, PanelLeftClose, PlusCircle } from "lucide-react";
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

  const handleHomeClick = () => {
    router.push('/');
  };

  return (
    <div className="px-4 py-2 flex items-center h-14 z-50 bg-card border-b border-border flex-shrink-0">
      {toggleSidebar && isSidebarOpen !== undefined && (
        <>
          <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="icon"
            className="mr-1"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="size-5" />
            ) : (
              <PanelLeftOpen className="size-5" />
            )}
          </Button>
          <Button
            onClick={onNewChat}
            variant="ghost"
            size="icon"
            className="mr-2"
            aria-label="New Chat / Live View"
          >
            <PlusCircle className="size-5" />
          </Button>
        </>
      )}
      <div>
        <Button
          variant="link"
          className="font-semibold text-lg p-0 h-auto"
          onClick={handleHomeClick}
        >
          PeakForm
        </Button>
      </div>
      <div className="ml-auto flex items-center gap-1">
        <Button
          onClick={handleAnalyticsClick}
          variant={pathname === '/analytics' ? "secondary" : "ghost"}
          className="flex items-center gap-1.5"
        >
          <BarChart className="size-4" />
          <span>{pathname === '/analytics' ? 'Sports Psychologist' : 'Performance Analytics'}</span>
        </Button>
        <Settings />
      </div>
    </div>
  );
};
