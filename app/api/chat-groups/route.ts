import { NextRequest, NextResponse } from 'next/server';

// Ensure you have your Hume API Key stored securely, e.g., in environment variables
const HUME_API_KEY = process.env.HUME_API_KEY;
const HUME_API_URL = 'https://api.hume.ai/v0/evi/chat_groups';

export async function GET(req: NextRequest) {
  if (!HUME_API_KEY) {
    return NextResponse.json({ message: 'Hume API key is not configured.' }, { status: 500 });
  }

  try {
    // Extract pagination parameters from the request if needed, otherwise use defaults
    // Example: const { searchParams } = new URL(req.url);
    // const page_number = searchParams.get('page_number') || '0';
    // const page_size = searchParams.get('page_size') || '10';
    // const ascending_order = searchParams.get('ascending_order') || 'false';

    // Construct the URL with query parameters (using defaults for simplicity here)
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
      // Consider adding caching strategies if appropriate
      // cache: 'no-store' // or 'force-cache', 'revalidate', etc.
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Hume API Error: ${response.status} ${response.statusText}`, errorBody);
      // Return a more specific error based on Hume's response if possible
      return NextResponse.json({ message: `Failed to fetch chat groups from Hume API: ${response.statusText}` }, { status: response.status });
    }

    const data = await response.json();
    // console.log('Hume API Response Structure:', JSON.stringify(data, null, 2)); // Log the actual structure - can be removed now

    // Check if the response has the chat_groups_page array before mapping
    if (!data || !Array.isArray(data.chat_groups_page)) {
      // Log the unexpected structure and return an error
      console.error('Hume API response does not contain a chat_groups_page array as expected:', data);
      return NextResponse.json({ message: 'Unexpected response format from Hume API. Check server logs.' }, { status: 500 });
    }

    // Access the chat_groups_page array for mapping
    const formattedData = data.chat_groups_page.map((group: any) => ({
        id: group.id, // Use the group ID
        // Use most_recent_start_timestamp for display, as it reflects the latest activity
        start_timestamp: group.most_recent_start_timestamp
        // Add other relevant fields if needed by the frontend
    }));

    return NextResponse.json(formattedData);

  } catch (error) {
    console.error('Error fetching chat groups:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: `Internal server error: ${message}` }, { status: 500 });
  }
}
