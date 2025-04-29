"use client";

import { useState, useEffect } from "react";
import { GameScheduleManager } from "@/components/GameScheduleManager";
import { GameSessionManager } from "@/components/GameSessionManager";
import { GameSchedule, GameMetrics, GameSession } from "@/types/game";
import { useGameSession } from "@/context/GameSessionContext";
import { Nav } from "@/components/Nav";
import ChatHistorySidebar from "@/components/ChatHistorySidebar";
import { useRouter } from "next/navigation";

export default function GameSessionsPage() {
  const [schedules, setSchedules] = useState<GameSchedule[]>([]);
  const { setGameSession } = useGameSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedChatGroupId, setSelectedChatGroupId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Load saved schedules from localStorage
    const savedSchedules = localStorage.getItem('gameSchedules');
    if (savedSchedules) {
      setSchedules(JSON.parse(savedSchedules));
    }
  }, []);

  const handleScheduleUpdate = (newSchedules: GameSchedule[]) => {
    setSchedules(newSchedules);
    localStorage.setItem('gameSchedules', JSON.stringify(newSchedules));
  };

  const handleSessionStart = (gameId: string | null, sessionType: GameSession) => {
    setGameSession(gameId, sessionType);
  };

  const handleGameComplete = (metrics: GameMetrics) => {
    // Save game metrics to localStorage for now
    const savedMetrics = JSON.parse(localStorage.getItem('gameMetrics') || '[]');
    savedMetrics.push(metrics);
    localStorage.setItem('gameMetrics', JSON.stringify(savedMetrics));
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
                <h1 className="text-2xl font-bold">Game Sessions</h1>
              </div>
              <GameScheduleManager
                schedules={schedules}
                onScheduleUpdate={handleScheduleUpdate}
              />
              <GameSessionManager
                schedules={schedules}
                onSessionStart={handleSessionStart}
                onGameComplete={handleGameComplete}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}