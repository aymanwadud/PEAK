import { NextRequest, NextResponse } from 'next/server';

// Ensure you have your Hume API Key stored securely, e.g., in environment variables
const HUME_API_KEY = process.env.HUME_API_KEY;
const HUME_API_URL = 'https://api.hume.ai/v0/evi/chat_groups';

// Force dynamic rendering and prevent caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  if (!HUME_API_KEY) {
    console.error("API Route Error: Hume API key is not configured.");
    return NextResponse.json({ message: 'Hume API key is not configured.' }, { status: 500 });
  }

  try {
    const url = new URL(HUME_API_URL);
    url.searchParams.append('page_number', '0');
    url.searchParams.append('page_size', '50'); // Fetch more to show a decent list
    url.searchParams.append('ascending_order', 'false'); // Show newest first

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'X-Hume-Api-Key': HUME_API_KEY,
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`API Route Error: Hume API Error: ${response.status} ${response.statusText}`, errorBody);
      return NextResponse.json({ message: `Failed to fetch chat groups from Hume API: ${response.statusText}` }, { status: response.status });
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.chat_groups_page)) {
      console.error('API Route Error: Hume API response does not contain a chat_groups_page array as expected:', data);
      return NextResponse.json({ message: 'Unexpected response format from Hume API. Check server logs.' }, { status: 500 });
    }

    const formattedData = data.chat_groups_page.map((group: any) => ({
        id: group.id,
        start_timestamp: group.most_recent_start_timestamp
    }));

    return NextResponse.json(formattedData);

  } catch (error) {
    console.error('API Route Error: Error fetching chat groups:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: `Internal server error: ${message}` }, { status: 500 });
  }
}
