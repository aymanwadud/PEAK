import { NextRequest, NextResponse } from 'next/server';
import { HumeClient } from 'hume';
import type { ReturnChatEvent } from "hume/api/resources/empathicVoice";

const HUME_API_KEY = process.env.HUME_API_KEY;

// Define the event structure based on actual API response
interface ChatEvent {
  id: string;
  chatId: string;
  timestamp: number;
  role: 'USER' | 'SYSTEM' | 'ASSISTANT' | 'AGENT';
  type: string;
  messageText: string | null;
  emotionFeatures: string | null;
  metadata: string | null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { groupId: string } }
) {
  const groupId = params.groupId;

  if (!HUME_API_KEY) {
    return NextResponse.json({ message: 'Hume API key is not configured.' }, { status: 500 });
  }

  if (!groupId) {
    return NextResponse.json({ message: 'Chat Group ID is missing.' }, { status: 400 });
  }

  try {
    console.log("Fetching events for chat group:", groupId);
    const client = new HumeClient({ apiKey: HUME_API_KEY });
    let currentPage = await client.empathicVoice.chatGroups.listChatGroupEvents(groupId, {
      pageSize: 100,
      pageNumber: 0,
      ascendingOrder: true
    });

    console.log("First page raw events:", JSON.stringify(currentPage.eventsPage, null, 2));

    const allEvents: ChatEvent[] = [];
    allEvents.push(...(currentPage.eventsPage as unknown as ChatEvent[]));

    while (currentPage.totalPages > currentPage.pageNumber + 1) {
      currentPage = await client.empathicVoice.chatGroups.listChatGroupEvents(groupId, {
        pageSize: 100,
        pageNumber: currentPage.pageNumber + 1,
        ascendingOrder: true
      });
      allEvents.push(...(currentPage.eventsPage as unknown as ChatEvent[]));
    }

    // Filter events to only include message events
    const messageEvents = allEvents.filter(event => 
      event.type === 'USER_MESSAGE' || event.type === 'AGENT_MESSAGE'
    );

    console.log("Filtered message events:", JSON.stringify(messageEvents, null, 2));

    return NextResponse.json(messageEvents);

  } catch (error) {
    console.error(`Error fetching events for chat group ${groupId}:`, error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: `Internal server error: ${message}` }, { status: 500 });
  }
}
