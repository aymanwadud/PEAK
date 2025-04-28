// File: components/ChatHistorySidebar.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { History, Loader2 } from 'lucide-react'; // Removed PanelLeftOpen, PanelLeftClose
import { cn } from '@/utils';

// Define the structure of a chat summary item
interface ChatGroupSummary { // Renamed from ChatSummary
  id: string; // Assuming this is the chat_group_id
  start_timestamp: string; // Assuming the API returns this field
}

// Define the props for the component
interface ChatHistorySidebarProps {
  isOpen: boolean; // Added prop to control visibility from parent
  onSelectChatGroup: (groupId: string | null) => void; // Renamed prop, expects groupId
  currentChatGroupId: string | null; // Renamed prop
}

export default function ChatHistorySidebar({ isOpen, onSelectChatGroup, currentChatGroupId }: ChatHistorySidebarProps) { // Updated props
  // Removed internal isOpen state, now controlled by parent
  const [chatGroups, setChatGroups] = useState<ChatGroupSummary[]>([]); // Renamed state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch chat history only when the component is told it's open and data isn't loaded
  useEffect(() => {
    if (isOpen && chatGroups.length === 0 && !isLoading) { // Check isLoading to prevent multiple fetches
      setIsLoading(true);
      setError(null);
      fetch('/api/chat-groups') // Updated API endpoint
        .then(res => {
          if (!res.ok) {
            // Attempt to read error message from response body
            return res.text().then(text => {
              throw new Error(`Failed to fetch history: ${res.statusText} - ${text}`);
            });
          }
          return res.json();
        })
        .then((data: ChatGroupSummary[]) => { // Expecting ChatGroupSummary array
          setChatGroups(data); // Update state
        })
        .catch(err => {
          console.error("Error fetching chat group history:", err);
          setError(err.message || 'Could not load chat history.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, chatGroups.length, isLoading]); // Add dependencies

  const handleSelectChatGroup = (groupId: string) => { // Renamed handler
    onSelectChatGroup(groupId); // Call prop with groupId
  };

  return (
    // Sidebar Panel - Removed fixed positioning and translate-x
    // Uses isOpen prop to control width and visibility
    <div
      className={cn(
        "h-full z-30 transition-all duration-300 ease-in-out", // Keep transition
        "bg-card border-r border-border shadow-lg flex-shrink-0", // Basic styling and prevent shrinking
        isOpen ? "w-64 p-4" : "w-0 p-0 overflow-hidden" // Control width and padding based on isOpen
      )}
      // Add aria-hidden for accessibility when closed
      aria-hidden={!isOpen}
    >
      {/* Content only renders if open to avoid layout shifts when hidden */}
      {isOpen && (
        <div className="h-full flex flex-col"> {/* REMOVED pt-12 */}
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <History className="mr-2 h-5 w-5" /> Chat History
          </h2>

          <div className="flex-grow overflow-y-auto">
            {isLoading && (
              <div className="flex justify-center items-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
            {error && <p className="text-red-500 text-sm px-2">{error}</p>}
            {!isLoading && !error && chatGroups.length === 0 && ( // Check chatGroups length
              <p className="text-muted-foreground text-sm px-2">No chat history found.</p>
            )}
            {!isLoading && !error && chatGroups.length > 0 && ( // Check chatGroups length
              <ul>
                {chatGroups.map((group) => ( // Iterate over chatGroups
                  <li key={group.id} className="mb-1">
                    <Button
                      variant={currentChatGroupId === group.id ? "secondary" : "ghost"} // Compare with currentChatGroupId
                      className="w-full justify-start text-left h-auto py-2"
                      onClick={() => handleSelectChatGroup(group.id)} // Use handleSelectChatGroup
                    >
                      <span className="truncate">
                        Chat Group from {new Date(group.start_timestamp).toLocaleString()} {/* Display group info */}
                      </span>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
    // Removed the toggle button from here, it's now in page.tsx
  );
}