"use client"; // Make this a Client Component

import { useState, useEffect, useCallback } from 'react';
import dynamic from "next/dynamic";
import ChatHistorySidebar from '@/components/ChatHistorySidebar'; // Import the sidebar
import { Loader2 } from 'lucide-react'; // For loading indicator
// Import base type and specific message types if available, or use base type and check properties
// Removed AgentMessage as it's not directly exported; will rely on type/role checks
import { ReturnChatEvent, EmotionScores, UserMessage, ReturnChatEventRole } from "hume/api/resources/empathicVoice";

// Add type definitions at the top with other types
type EmotionScore = {
  name: string;
  score: number;
};

type ProcessedHistory = {
  transcript: string;
  topEmotions: EmotionScore[];
  emotionsPerMessage: Array<{
    role: ReturnChatEventRole;  // Update to use the correct type
    text: string;
    emotions: EmotionScore[] | null;
    timestamp: number;  // Change to number since that's what we get from the API
  }>;
};

// Dynamically import Chat component for client-side rendering
const Chat = dynamic(() => import("@/components/Chat"), {
  ssr: false,
  loading: () => <div className="flex justify-center items-center grow"><Loader2 className="h-8 w-8 animate-spin" /></div>, // Add a loading state for Chat
});

// Update HistoricalEvent to include snake_case properties
type HistoricalEvent = ReturnChatEvent & {
  message_text?: string;
  emotion_features?: string;
};

// Function to get top N emotions from a single emotionFeatures string
// Update getTopEmotionsForMessage to return EmotionScore[]
function getTopEmotionsForMessage(emotionFeatures: string, topN: number = 3): EmotionScore[] {
    if (!emotionFeatures) {
        return [];
    }
    try {
        const emotions = JSON.parse(emotionFeatures) as EmotionScores;
        return Object.entries(emotions)
            .map(([name, score]) => ({ name, score }))
            .sort((a, b) => b.score - a.score)
            .slice(0, topN);
    } catch (error) {
        console.error("Error parsing single message emotionFeatures:", emotionFeatures, error);
        return [];
    }
}

// Function to calculate top 3 emotions
// Update getTopEmotions to return EmotionScore[]
function getTopEmotions(chatEvents: HistoricalEvent[]): EmotionScore[] {
    const userMessagesWithEmotions = chatEvents.filter(
        (event): event is HistoricalEvent & { type: 'USER_MESSAGE'; emotion_features: string } =>
            event.type === "USER_MESSAGE" &&
            typeof event.emotion_features === 'string' &&
            event.emotion_features.length > 0
    );

    if (userMessagesWithEmotions.length === 0) {
        return [];
    }

    const emotionSums: Record<string, number> = {};
    let totalMessages = 0;

    for (const event of userMessagesWithEmotions) {
        try {
            const emotions = JSON.parse(event.emotion_features) as EmotionScores;
            totalMessages++;
            Object.entries(emotions).forEach(([name, score]) => {
                emotionSums[name] = (emotionSums[name] || 0) + score;
            });
        } catch (error) {
            console.error("Error parsing emotion_features:", event.emotion_features, error);
            continue;
        }
    }

    return Object.entries(emotionSums)
        .map(([name, totalScore]) => ({
            name,
            score: totalScore / totalMessages
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
}

export default function Page() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoadingToken, setIsLoadingToken] = useState(true);
  const [selectedChatGroupId, setSelectedChatGroupId] = useState<string | null>(null);
  const [historicalEvents, setHistoricalEvents] = useState<HistoricalEvent[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [errorHistory, setErrorHistory] = useState<string | null>(null);
  const [processedHistory, setProcessedHistory] = useState<ProcessedHistory | null>(null);

  // Function to fetch and process chat history
  const fetchChatHistory = useCallback(async (groupId: string) => {
    if (!groupId) return;
    setIsLoadingHistory(true);
    setErrorHistory(null);
    setProcessedHistory(null); // Clear previous history

    try {
      const response = await fetch(`/api/chat-groups/${groupId}/events`);
      if (!response.ok) {
        throw new Error(`Failed to fetch history: ${response.statusText}`);
      }
      const events: HistoricalEvent[] = await response.json();

      console.log("Fetched events:", events);

      const messageEvents = events.filter(
        (event) => event.type === 'USER_MESSAGE' || event.type === 'AGENT_MESSAGE'
      );

      console.log("Filtered message events:", messageEvents);

      const transcript = messageEvents
        .map((event) => {
          const role = event.role === 'USER' ? 'User' : 'Assistant';
          const text = event.message_text || '(No text content)';
          if (!event.message_text) {
             console.warn("Event missing message_text:", event);
          }
          return `${role}: ${text}`;
        })
        .join('\n');

      const topEmotions = getTopEmotions(events);
      
      const emotionsPerMessage = messageEvents.map((event) => ({
        role: event.role,
        text: event.message_text || '(No text content)',
        emotions: event.role === 'USER' && event.emotion_features
          ? getTopEmotionsForMessage(event.emotion_features)
          : null,
        timestamp: event.timestamp, // Use number directly without converting to string
      }));

      setProcessedHistory({ transcript, topEmotions, emotionsPerMessage });

    } catch (err) {
      console.error("Error fetching or processing history:", err);
      setErrorHistory(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoadingHistory(false);
    }
  }, []); // Dependencies for useCallback

  // Fetch Hume Access Token via API route
  useEffect(() => {
    const fetchTokenFromApi = async () => {
      setIsLoadingToken(true);
      try {
        const response = await fetch('/api/get-token'); // Fetch from the new API route
        if (!response.ok) {
          throw new Error(`Failed to fetch token: ${response.statusText}`);
        }
        const data = await response.json();
        if (!data.accessToken) {
            throw new Error("Access token not found in API response.");
        }
        setAccessToken(data.accessToken);
      } catch (error) {
        console.error("Error fetching Hume access token via API:", error);
        setAccessToken(null); // Ensure token is null on error
      } finally {
        setIsLoadingToken(false);
      }
    };
    fetchTokenFromApi();
  }, []);

  // Fetch historical chat events when selectedChatGroupId changes
  useEffect(() => {
    if (selectedChatGroupId) {
      fetchChatHistory(selectedChatGroupId);
    } else {
      setHistoricalEvents([]);
      setErrorHistory(null);
    }
  }, [selectedChatGroupId, fetchChatHistory]);

  const handleSelectChatGroup = (groupId: string | null) => { // Renamed handler
    setSelectedChatGroupId(groupId); // Update state with groupId
  };

  // Decide what content to show - MUST be defined before use in return()
  const renderContent = () => {
    if (isLoadingToken) {
      return <div className="flex justify-center items-center grow"><Loader2 className="h-8 w-8 animate-spin" /><span>&nbsp;Loading Access Token...</span></div>;
    }

    if (!accessToken && !selectedChatGroupId) {
       return <div className="flex justify-center items-center grow text-red-500">Failed to load access token. Cannot start live chat.</div>;
    }

    if (selectedChatGroupId) {
      if (isLoadingHistory) {
        return <div className="flex justify-center items-center grow"><Loader2 className="h-8 w-8 animate-spin" /><span>&nbsp;Loading History...</span></div>;
      }
      if (errorHistory) {
        return <div className="flex justify-center items-center grow text-red-500">{errorHistory}</div>;
      }
      
      // Display processed history if available
      if (processedHistory) {
        return (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Header section - sticky */}
            <div className="flex-none px-4 py-2 bg-background">
              <h2 className="text-xl font-semibold mb-2">Chat History</h2>
              <div className="mb-4">
                <h4 className="font-medium mb-1">Overall Top 3 User Emotions:</h4>
                {processedHistory.topEmotions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {processedHistory.topEmotions.map((emo, index) => (
                      <span key={index} className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm">
                        {emo.name}: {emo.score.toFixed(3)}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No user emotion data found.</p>
                )}
              </div>
            </div>

            {/* Messages container - scrollable */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="space-y-6 p-4">
                {processedHistory.emotionsPerMessage.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === 'USER' ? 'justify-end' : 'justify-start'} relative`}>
                    <div 
                      className={`
                        max-w-[80%] 
                        ${msg.role === 'USER' 
                          ? 'bg-blue-100 dark:bg-blue-900 ml-4' 
                          : 'bg-gray-100 dark:bg-gray-800 mr-4'
                        } 
                        rounded-2xl p-4
                        relative
                        ${msg.role === 'USER' 
                          ? 'rounded-br-sm' 
                          : 'rounded-bl-sm'
                        }
                      `}
                    >
                      {/* Time */}
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-1">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                      
                      {/* Message Text */}
                      <div className="text-sm break-words">{msg.text}</div>

                      {/* Emotion Scores for User Messages */}
                      {msg.emotions && msg.role === 'USER' && (
                        <div className="mt-2 pt-2 border-t border-black dark:border-white">
                          <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-1">
                            Top Emotions:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {msg.emotions.map((emo, emoIndex) => (
                              <span 
                                key={emoIndex} 
                                className="
                                  bg-white/50 dark:bg-black/20 
                                  px-2 py-0.5 rounded-full
                                  text-[11px] text-gray-700 dark:text-gray-300
                                "
                              >
                                {emo.name}: {emo.score.toFixed(3)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Chat Bubble Triangle */}
                      <div 
                        className={`
                          absolute bottom-[15px]
                          ${msg.role === 'USER' 
                            ? 'right-[-8px] border-l-[8px] border-l-blue-100 dark:border-l-blue-900' 
                            : 'left-[-8px] border-r-[8px] border-r-gray-100 dark:border-r-gray-800'
                          }
                          border-y-[6px] border-y-transparent
                          w-0 h-0
                        `}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }
    }

    // Show live chat if no history is selected
    return accessToken ? <Chat accessToken={accessToken} /> : 
      <div className="flex justify-center items-center grow">Select a chat from the history or start a new one.</div>;
  };

  return (
    // Update the outer container to be full height and handle overflow properly
    <div className="flex flex-row h-[calc(100vh-4rem)] overflow-hidden"> 
      {/* Sidebar with fixed width */}
      <ChatHistorySidebar 
        onSelectChatGroup={handleSelectChatGroup} 
        currentChatGroupId={selectedChatGroupId} 
        isOpen={true}
      />
      {/* Main content area - make it full height and handle overflow */}
      <div className="grow flex flex-col h-full overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
}
