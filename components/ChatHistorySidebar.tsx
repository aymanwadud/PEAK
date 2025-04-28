// File: components/ChatHistorySidebar.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { History, Loader2, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/utils';

// Define the structure of a chat summary item
interface ChatGroupSummary {
  id: string;
  start_timestamp: string;
}

interface GroupedChats {
  today: ChatGroupSummary[];
  yesterday: ChatGroupSummary[];
  last7days: ChatGroupSummary[];
  last30days: ChatGroupSummary[];
  byMonth: Record<string, ChatGroupSummary[]>; // Key format: "YYYY-MM"
}

// Define the props for the component
interface ChatHistorySidebarProps {
  isOpen: boolean;
  onSelectChatGroup: (groupId: string | null) => void;
  currentChatGroupId: string | null;
}

export default function ChatHistorySidebar({ isOpen, onSelectChatGroup, currentChatGroupId }: ChatHistorySidebarProps) {
  const [chatGroups, setChatGroups] = useState<ChatGroupSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    today: true,
    yesterday: true,
    last7days: true,
    last30days: true
  });

  // Helper function to group chats by date periods
  const groupChatsByDate = (chats: ChatGroupSummary[]): GroupedChats => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const last7days = new Date(today);
    last7days.setDate(last7days.getDate() - 7);
    const last30days = new Date(today);
    last30days.setDate(last30days.getDate() - 30);

    return chats.reduce((acc: GroupedChats, chat) => {
      const chatDate = new Date(chat.start_timestamp);
      const chatDay = new Date(chatDate.getFullYear(), chatDate.getMonth(), chatDate.getDate());

      // Initialize byMonth if not exists
      if (!acc.byMonth) {
        acc.byMonth = {};
      }

      if (chatDay.getTime() === today.getTime()) {
        acc.today.push(chat);
      } else if (chatDay.getTime() === yesterday.getTime()) {
        acc.yesterday.push(chat);
      } else if (chatDay >= last7days && chatDay < yesterday) {
        acc.last7days.push(chat);
      } else if (chatDay >= last30days && chatDay < last7days) {
        acc.last30days.push(chat);
      } else {
        // Group by month for older chats
        const monthKey = `${chatDate.getFullYear()}-${String(chatDate.getMonth() + 1).padStart(2, '0')}`;
        if (!acc.byMonth[monthKey]) {
          acc.byMonth[monthKey] = [];
        }
        acc.byMonth[monthKey].push(chat);
      }

      return acc;
    }, { today: [], yesterday: [], last7days: [], last30days: [], byMonth: {} });
  };

  // Helper function to format the time
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  // Helper function to format the date
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  // Helper function to format the month section title
  const formatMonthTitle = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString(undefined, { 
      month: 'long', 
      year: 'numeric'
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    if (isOpen && chatGroups.length === 0 && !isLoading) {
      setIsLoading(true);
      setError(null);
      fetch('/api/chat-groups')
        .then(res => {
          if (!res.ok) {
            return res.text().then(text => {
              throw new Error(`Failed to fetch history: ${res.statusText} - ${text}`);
            });
          }
          return res.json();
        })
        .then((data: ChatGroupSummary[]) => {
          // Sort chats by timestamp in descending order (newest first)
          const sortedData = [...data].sort((a, b) => 
            new Date(b.start_timestamp).getTime() - new Date(a.start_timestamp).getTime()
          );
          setChatGroups(sortedData);
        })
        .catch(err => {
          console.error("Error fetching chat group history:", err);
          setError(err.message || 'Could not load chat history.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, chatGroups.length, isLoading]);

  const handleSelectChatGroup = (groupId: string) => {
    onSelectChatGroup(groupId);
  };

  // Group the chats by date
  const groupedChats = groupChatsByDate(chatGroups);

  const renderChats = (chats: ChatGroupSummary[], showDate: boolean = false) => {
    return (
      <ul className="mt-1 space-y-1">
        {chats.map((group) => (
          <li key={group.id}>
            <Button
              variant={currentChatGroupId === group.id ? "secondary" : "ghost"}
              className="w-full justify-start text-left h-auto py-2 pl-4"
              onClick={() => handleSelectChatGroup(group.id)}
            >
              <span className="truncate">
                {showDate 
                  ? `${formatDate(group.start_timestamp)} at ${formatTime(group.start_timestamp)}`
                  : formatTime(group.start_timestamp)
                }
              </span>
            </Button>
          </li>
        ))}
      </ul>
    );
  };

  const renderSection = (title: string, chats: ChatGroupSummary[], section: string, showDate: boolean = false) => {
    if (!chats?.length) return null;

    return (
      <div className="mb-4">
        <Button
          variant="ghost"
          className="w-full justify-between px-2 py-1 h-auto font-semibold text-sm"
          onClick={() => toggleSection(section)}
        >
          <span>{title}</span>
          {expandedSections[section] ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
        {expandedSections[section] && renderChats(chats, showDate)}
      </div>
    );
  };

  const renderMonthSections = () => {
    if (!groupedChats.byMonth) return null;

    return Object.entries(groupedChats.byMonth)
      .sort(([a], [b]) => b.localeCompare(a)) // Sort months in descending order
      .map(([monthKey, chats]) => {
        const sectionKey = `month-${monthKey}`;
        if (!expandedSections.hasOwnProperty(sectionKey)) {
          setExpandedSections(prev => ({ ...prev, [sectionKey]: true }));
        }
        return renderSection(formatMonthTitle(monthKey), chats, sectionKey, true);
      });
  };

  return (
    <div
      className={cn(
        "h-full z-30 transition-all duration-300 ease-in-out",
        "bg-card border-r border-border shadow-lg flex-shrink-0",
        isOpen ? "w-64 p-4" : "w-0 p-0 overflow-hidden"
      )}
      aria-hidden={!isOpen}
    >
      {isOpen && (
        <div className="h-full flex flex-col">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <History className="mr-2 h-5 w-5" /> Chat History
          </h2>

          <div className="flex-grow overflow-y-auto">
            {isLoading && (
              <div className="flex justify-center items-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
            {error && (
              <p className="text-red-500 text-sm px-2">{error}</p>
            )}
            {!isLoading && !error && chatGroups.length === 0 && (
              <p className="text-muted-foreground text-sm px-2">No chat history found.</p>
            )}
            {!isLoading && !error && chatGroups.length > 0 && (
              <div>
                {renderSection('Today', groupedChats.today, 'today')}
                {renderSection('Yesterday', groupedChats.yesterday, 'yesterday')}
                {renderSection('Previous 7 Days', groupedChats.last7days, 'last7days', true)}
                {renderSection('Previous 30 Days', groupedChats.last30days, 'last30days', true)}
                {renderMonthSections()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}