"use client";

import { useState, useEffect } from "react";
import { ScheduleManager } from "@/components/ScheduleManager";
import { SessionManager } from "@/components/SessionManager";
import { Schedule, Metrics, SessionType } from "@/types/game";
import { useSession } from "@/context/SessionContext";
import { Nav } from "@/components/Nav";
import ChatHistorySidebar from "@/components/ChatHistorySidebar";
import { useRouter } from "next/navigation";

export default function SessionsPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const { setSession } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedChatGroupId, setSelectedChatGroupId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Load saved schedules from localStorage
    const savedSchedules = localStorage.getItem('schedules');
    if (savedSchedules) {
      setSchedules(JSON.parse(savedSchedules));
    }
  }, []);

  const handleScheduleUpdate = (newSchedules: Schedule[]) => {
    setSchedules(newSchedules);
    localStorage.setItem('schedules', JSON.stringify(newSchedules));
  };

  const handleSessionStart = (sessionId: string | null, sessionType: SessionType) => {
    setSession(sessionId, sessionType);
  };

  const handleComplete = (metrics: Metrics) => {
    // Save metrics to localStorage for now
    const savedMetrics = JSON.parse(localStorage.getItem('sessionMetrics') || '[]');
    savedMetrics.push(metrics);
    localStorage.setItem('sessionMetrics', JSON.stringify(savedMetrics));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNewChat = () => {
    router.push('/');
  };

  const handleSelectChatGroup = (groupId: string | null) => {
    setSelectedChatGroupId(groupId);
  };

  return (
    <div className="flex flex-col h-screen">
      <Nav 
        toggleSidebar={toggleSidebar} 
        isSidebarOpen={isSidebarOpen}
        onNewChat={handleNewChat}
      />
      <div className="flex flex-row flex-grow overflow-hidden">
        <ChatHistorySidebar
          onSelectChatGroup={handleSelectChatGroup}
          currentChatGroupId={selectedChatGroupId}
          isOpen={isSidebarOpen}
        />
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Sessions</h1>
              </div>
              <ScheduleManager
                schedules={schedules}
                onScheduleUpdate={handleScheduleUpdate}
              />
              <SessionManager
                schedules={schedules}
                onSessionStart={handleSessionStart}
                onComplete={handleComplete}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}