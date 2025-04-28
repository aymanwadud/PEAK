"use client";

import { useLayoutEffect, useState } from "react";
import { Button } from "./ui/button";
import { Moon, Sun, PanelLeftOpen, PanelLeftClose, PlusCircle } from "lucide-react"; // Import PlusCircle icon
import pkg from "@/package.json";

// Define props for Nav component
interface NavProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  onNewChat: () => void; // Add prop for new chat handler
}

export const Nav = ({ toggleSidebar, isSidebarOpen, onNewChat }: NavProps) => { // Destructure props
  const [isDarkMode, setIsDarkMode] = useState(false);

  useLayoutEffect(() => {
    const el = document.documentElement;

    if (el.classList.contains("dark")) {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }
  }, []);

  const toggleDark = () => {
    const el = document.documentElement;
    el.classList.toggle("dark");
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div
      className={
        "px-4 py-2 flex items-center h-14 z-50 bg-card border-b border-border flex-shrink-0"
      }
    >
      {/* Sidebar Toggle Button */}
      <Button
        onClick={toggleSidebar}
        variant={"ghost"}
        size={"icon"}
        className={"mr-1"} // Adjust margin
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isSidebarOpen ? (
          <PanelLeftClose className={"size-5"} />
        ) : (
          <PanelLeftOpen className={"size-5"} />
        )}
      </Button>
      {/* New Chat Button */}
      <Button
        onClick={onNewChat}
        variant={"ghost"}
        size={"icon"}
        className={"mr-2"}
        aria-label={"New Chat / Live View"}
      >
        <PlusCircle className={"size-5"} />
      </Button>
      <div>
        <span className="font-semibold text-lg">MindFlow</span>
      </div>
      <div className={"ml-auto flex items-center gap-1"}>
        <Button
          variant={"ghost"}
          className={"ml-auto flex items-center gap-1.5"}
        >
          <span>Emotion Analytics</span>
        </Button>
        <Button
          onClick={toggleDark}
          variant={"ghost"}
          className={"ml-auto flex items-center gap-1.5"}
        >
          <span>
            {isDarkMode ? (
              <Sun className={"size-4"} />
            ) : (
              <Moon className={"size-4"} />
            )}
          </span>
          <span>{isDarkMode ? "Light" : "Dark"} Mode</span>
        </Button>
      </div>
    </div>
  );
};
