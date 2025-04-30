import { NextRequest, NextResponse } from 'next/server';
import { HumeClient } from 'hume';

const HUME_API_KEY = process.env.HUME_API_KEY;

// Force dynamic rendering and prevent caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  if (!HUME_API_KEY) {
    console.error("API Route Error: Hume API key is not configured.");
    return NextResponse.json({ message: 'Hume API key is not configured.' }, { status: 500 });
  }

  try {
    const client = new HumeClient({ apiKey: HUME_API_KEY });
    
    // Get chat groups using pagination
    const response = await client.empathicVoice.chatGroups.listChatGroups({
      pageNumber: 0,
      pageSize: 50,
      ascendingOrder: false // Show newest first
    });

    // Extract chat groups from the response
    const chatGroups = (response.chatGroupsPage || []).map(group => ({
      id: group.id,
      start_timestamp: group.mostRecentStartTimestamp
    }));

    return NextResponse.json(chatGroups);

  } catch (error) {
    console.error('API Route Error: Error fetching chat groups:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: `Internal server error: ${message}` }, { status: 500 });
  }
}
