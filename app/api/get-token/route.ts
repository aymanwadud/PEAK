// File: app/api/get-token/route.ts
import { NextResponse } from 'next/server';
import { getHumeAccessToken } from '@/utils/getHumeAccessToken'; // This import is safe here (server-side)

export async function GET() {
  try {
    if (!process.env.HUME_API_KEY || !process.env.HUME_SECRET_KEY) {
      console.error('Missing required environment variables for Hume API');
      return NextResponse.json(
        { 
          error: 'Hume API configuration missing', 
          details: 'Required environment variables are not set'
        }, 
        { status: 500 }
      );
    }

    const token = await getHumeAccessToken();
    if (!token) {
      return NextResponse.json(
        { 
          error: 'Failed to retrieve Hume access token',
          details: 'Token fetch failed. Check server logs for more information.'
        }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({ accessToken: token });
  } catch (error) {
    console.error('Error in /api/get-token:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error getting token',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      }, 
      { status: 500 }
    );
  }
}

// Optional: Add configuration if needed, e.g., for edge runtime if compatible
// export const runtime = 'edge';