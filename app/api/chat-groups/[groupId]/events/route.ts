import { NextRequest, NextResponse } from 'next/server';

// Ensure you have your Hume API Key stored securely
const HUME_API_KEY = process.env.HUME_API_KEY;
const HUME_API_BASE_URL = 'https://api.hume.ai/v0/evi/chat_groups';

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
    // Construct the URL to fetch events for the specific chat group
    // You might want to add pagination parameters like ?page_size=1000 if needed
    const url = `${HUME_API_BASE_URL}/${groupId}/events`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Hume-Api-Key': HUME_API_KEY,
        'Content-Type': 'application/json',
      },
      cache: 'no-store' // Avoid caching historical events
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Hume API Error fetching events for group ${groupId}: ${response.status} ${response.statusText}`, errorBody);
      return NextResponse.json({ message: `Failed to fetch events from Hume API: ${response.statusText}` }, { status: response.status });
    }

    const data = await response.json();

    // Log the structure to confirm
    console.log(`Hume API Response for group ${groupId} events:`, JSON.stringify(data, null, 2));

    // Check if the data is an array directly, or nested (e.g., in a 'events_page' property)
    let eventsArray = [];
    if (Array.isArray(data)) {
      eventsArray = data;
    } else if (data && Array.isArray(data.events_page)) { // Adjust 'events_page' if needed based on logs
      eventsArray = data.events_page;
    } else {
      // Log an error if the structure is unexpected
      console.error(`Unexpected events response structure for group ${groupId}:`, data);
      return NextResponse.json({ message: 'Unexpected response format from Hume API for events.' }, { status: 500 });
    }

    return NextResponse.json(eventsArray);

  } catch (error) {
    console.error(`Error fetching events for chat group ${groupId}:`, error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: `Internal server error: ${message}` }, { status: 500 });
  }
}
