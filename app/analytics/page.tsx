"use client";

import { useEffect, useState } from "react";
import EmotionRadarChart from "@/components/charts/EmotionRadarChart";
import EmotionPerformanceChart from "@/components/charts/EmotionPerformanceChart";
import EmotionRecoveryChart from "@/components/charts/EmotionRecoveryChart";
import { SPORT_CONFIGS } from "@/components/SportSelector";
import TimeFilter, { TimePeriod } from "@/components/TimeFilter";
import { Button } from "@/components/ui/button";
import { GameEmotionData } from "@/types/emotions";
import { Loader2 } from "lucide-react";
import { Nav } from "@/components/Nav";
import { useRouter } from "next/navigation";
import ChatHistorySidebar from "@/components/ChatHistorySidebar";
import { useSport } from "@/context/SportContext";

export default function AnalyticsPage() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('month');
  const [isLoading, setIsLoading] = useState(true);
  const [gameData, setGameData] = useState<GameEmotionData[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const { selectedSport } = useSport();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNewChat = () => {
    router.push('/');
  };

  const fetchGameData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/game-emotions');
      const data = await response.json();
      setGameData(data);
    } catch (error) {
      console.error('Failed to fetch game data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGameData();
  }, [selectedSport, selectedPeriod]);

  const selectedGameData = gameData.find(g => g.id === selectedGame) || gameData[0];
  const sportConfig = SPORT_CONFIGS[selectedSport];

  const renderAnalytics = () => (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="sticky top-0 z-10 bg-background p-6 pb-4 border-b">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Performance Analytics</h1>
            <TimeFilter 
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
            />
          </div>
          
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-2">
              {gameData.map((game) => (
                <Button
                  key={game.id}
                  variant={selectedGame === game.id ? "secondary" : "ghost"}
                  onClick={() => setSelectedGame(game.id)}
                  className="text-sm"
                >
                  {new Date(game.date).toLocaleDateString()}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6 min-h-0 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center flex-1">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : !gameData.length ? (
          <div className="flex flex-col items-center justify-center flex-1">
            <p className="text-lg text-muted-foreground mb-4">No game data available yet.</p>
            <p className="text-sm text-muted-foreground">Complete your first game analysis to see insights here.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border rounded-lg p-4">
                <EmotionRadarChart
                  preGameEmotions={selectedGameData.preGame}
                  postGameEmotions={selectedGameData.postGame}
                  gameTitle={new Date(selectedGameData.date).toLocaleDateString()}
                />
              </div>

              <div className="bg-card border rounded-lg p-4">
                <EmotionPerformanceChart
                  data={gameData.map(game => ({
                    date: game.date,
                    performanceMetric: game.performanceMetrics[0].metric,
                    mainEmotion: game.preGame[0].score,
                    outcome: game.outcome
                  }))}
                  metricName={sportConfig.metrics[0]}
                  emotionName={sportConfig.keyEmotions[0]}
                  sport={selectedSport}
                />
              </div>

              <div className="bg-card border rounded-lg p-4 lg:col-span-2">
                <EmotionRecoveryChart
                  data={selectedGameData.recoveryData}
                  emotionName={sportConfig.keyEmotions[0]}
                  gameResult={selectedGameData.outcome}
                  gameDate={new Date(selectedGameData.date).toLocaleDateString()}
                />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Key Performance Indicators</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sportConfig.metrics.map((metric, index) => (
                  <div key={metric} className="p-4 bg-card border rounded-lg">
                    <p className="text-sm text-muted-foreground">{metric}</p>
                    <p className="text-2xl font-bold">
                      {selectedGameData.performanceMetrics[index]?.metric.toFixed(1) || 'N/A'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen">
      <Nav 
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        onNewChat={handleNewChat}
      />
      <div className="flex flex-row flex-grow overflow-hidden">
        <ChatHistorySidebar 
          onSelectChatGroup={(groupId) => router.push('/?chatId=' + groupId)}
          currentChatGroupId={null}
          isOpen={isSidebarOpen}
        />
        <div className="grow flex flex-col h-full overflow-hidden">
          {renderAnalytics()}
        </div>
      </div>
    </div>
  );
}