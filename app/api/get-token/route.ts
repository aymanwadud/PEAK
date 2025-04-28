// File: app/api/get-token/route.ts
import { NextResponse } from 'next/server';
import { getHumeAccessToken } from '@/utils/getHumeAccessToken'; // This import is safe here (server-side)

export async function GET() {
  try {
    const token = await getHumeAccessToken();
    if (!token) {
      return NextResponse.json({ error: 'Failed to retrieve Hume access token' }, { status: 500 });
    }
    return NextResponse.json({ accessToken: token });
  } catch (error) {
    console.error('Error in /api/get-token:', error);
    return NextResponse.json({ error: 'Internal server error getting token' }, { status: 500 });
  }
}

// Optional: Add configuration if needed, e.g., for edge runtime if compatible
// export const runtime = 'edge';