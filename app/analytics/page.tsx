"use client";

import { useEffect, useState } from "react";
import EmotionRadarChart from "@/components/charts/EmotionRadarChart";
import EmotionPerformanceChart from "@/components/charts/EmotionPerformanceChart";
import EmotionRecoveryChart from "@/components/charts/EmotionRecoveryChart";
import { SPORT_CONFIGS } from "@/components/SportSelector";
import TimeFilter, { TimePeriod } from "@/components/TimeFilter";
import { Button } from "@/components/ui/button";
import { SessionEmotionData } from "@/types/emotions";
import { Loader2 } from "lucide-react";
import { Nav } from "@/components/Nav";
import { useRouter } from "next/navigation";
import ChatHistorySidebar from "@/components/ChatHistorySidebar";
import { useSport } from "@/context/ActivityContext";

export default function AnalyticsPage() {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('month');
  const [isLoading, setIsLoading] = useState(true);
  const [sessionData, setSessionData] = useState<SessionEmotionData[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const { selectedSport } = useSport();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNewChat = () => {
    router.push('/');
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/session-emotions');
      const data = await response.json();
      setSessionData(data);
    } catch (error) {
      console.error('Failed to fetch session data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedSport, selectedPeriod]);

  const sportConfig = SPORT_CONFIGS[selectedSport];

  const renderAnalytics = () => {
    let selectedSessionData: SessionEmotionData | undefined = undefined;
    if (!isLoading && sessionData.length > 0) {
      selectedSessionData = sessionData.find(s => s.id === selectedSession) || sessionData[0];
    }

    return (
      <div className="flex flex-col h-full overflow-y-auto">
        <div className="sticky top-0 z-10 bg-background p-6 pb-4 border-b">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Analytics</h1>
              <TimeFilter 
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
              />
            </div>
            
            {sessionData.length > 0 && (
              <div className="flex items-center justify-end">
                <div className="flex items-center gap-2">
                  {sessionData.map((session) => (
                    <Button
                      key={session.id}
                      variant={selectedSession === session.id ? "secondary" : "ghost"}
                      onClick={() => setSelectedSession(session.id)}
                      className="text-sm"
                    >
                      {new Date(session.date).toLocaleDateString()}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 p-6 space-y-6 min-h-0 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center flex-1">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : !sessionData.length ? (
            <div className="flex flex-col items-center justify-center flex-1">
              <p className="text-lg text-muted-foreground mb-4">No data available yet.</p>
              <p className="text-sm text-muted-foreground">Complete your first session analysis to see insights here.</p>
            </div>
          ) : selectedSessionData ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card border rounded-lg p-4">
                  <EmotionRadarChart
                    preSessionEmotions={selectedSessionData.preSession}
                    postSessionEmotions={selectedSessionData.postSession}
                    title={new Date(selectedSessionData.date).toLocaleDateString()}
                  />
                </div>

                <div className="bg-card border rounded-lg p-4">
                  <EmotionPerformanceChart
                    data={sessionData.map(session => ({
                      date: session.date,
                      performanceMetric: session.performanceMetrics?.[0]?.metric ?? 0,
                      mainEmotion: session.preSession?.[0]?.score ?? 0,
                      outcome: session.outcome
                    }))}
                    metricName={sportConfig.metrics[0]}
                    emotionName={sportConfig.keyEmotions[0]}
                    sport={selectedSport}
                  />
                </div>

                <div className="bg-card border rounded-lg p-4 lg:col-span-2">
                  <EmotionRecoveryChart
                    data={selectedSessionData.recoveryData}
                    emotionName={sportConfig.keyEmotions[0]}
                    result={selectedSessionData.outcome}
                    date={new Date(selectedSessionData.date).toLocaleDateString()}
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
                        {selectedSessionData.performanceMetrics?.[index]?.metric?.toFixed(1) || 'N/A'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center flex-1">
              <p className="text-lg text-muted-foreground">Could not display selected session.</p>
            </div>
          )}
        </div>
      </div>
    );
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