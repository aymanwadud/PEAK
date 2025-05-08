import { prisma } from '@/utils/db';
import { NextResponse } from 'next/server';
import type { SessionEmotionData } from '@/types/emotions';
// Import model types directly from @prisma/client
import type { Session, EmotionScore, PerformanceMetric, RecoveryPoint } from '@prisma/client';
// Import Prisma namespace for input types and the enum
import { Prisma, EmotionScoreType } from '@prisma/client';

// Update the type to reflect the new schema (single emotionScores relation)
// Note: We will reconstruct pre/post in the GET handler
type SessionWithRelations = Session & {
  emotionScores: EmotionScore[];
  performanceMetrics: PerformanceMetric[];
  recoveryData: RecoveryPoint[];
};

export async function GET() {
  try {
    const sessions = await prisma.session.findMany({
      include: {
        // Include the single emotionScores relation
        emotionScores: true,
        performanceMetrics: true,
        recoveryData: true,
      },
      orderBy: {
        date: 'desc'
      }
    });

    // Log the raw data fetched from DB
    console.log('API - Fetched sessions from DB:', sessions);

    // Adapt the mapping to filter emotionScores by type
    const formattedSessions: SessionEmotionData[] = sessions.map((session) => ({
      id: session.id,
      date: session.date.toISOString().split('T')[0],
      // Filter PRE type scores
      preSession: session.emotionScores
        .filter(e => e.type === EmotionScoreType.PRE)
        .map((e) => ({ name: e.name, score: e.score })),
      // Filter POST type scores
      postSession: session.emotionScores
        .filter(e => e.type === EmotionScoreType.POST)
        .map((e) => ({ name: e.name, score: e.score })),
      performanceMetrics: session.performanceMetrics.map((m) => ({
        name: m.name,
        metric: m.value
      })),
      outcome: session.outcome as 'win' | 'loss',
      recoveryData: session.recoveryData.map((r) => ({
        timeAfterSession: r.timeAfterSession,
        emotionScore: r.emotionScore,
        baseline: r.baseline
      }))
    }));

    // Log the formatted data being returned
    console.log('API - Returning formatted sessions:', formattedSessions);

    return NextResponse.json(formattedSessions);
  } catch (error) {
    console.error('API - Failed to fetch sessions:', error);
    return NextResponse.json([], { status: 500 });
  }
}

// Interface remains the same for the request body structure
interface CreateSessionInput {
  date: string;
  sport: string;
  outcome: 'win' | 'loss';
  preSession: Array<{ name: string; score: number; }>;
  postSession: Array<{ name: string; score: number; }>;
  performanceMetrics: Array<{ name: string; value: number; }>;
  recoveryData: Array<{
    timeAfterSession: number;
    emotionScore: number;
    baseline: number;
  }>;
}

export async function POST(req: Request) {
  try {
    const data = await req.json() as CreateSessionInput;
    
    // Update the create call for the new schema
    const session = await prisma.session.create({
      data: {
        date: new Date(data.date),
        sport: data.sport,
        outcome: data.outcome,
        // Combine pre and post session data into the single emotionScores relation
        emotionScores: {
          create: [
            // Map preSession data with type PRE
            ...data.preSession.map(e => ({
              name: e.name,
              score: e.score,
              type: EmotionScoreType.PRE
            })),
            // Map postSession data with type POST
            ...data.postSession.map(e => ({
              name: e.name,
              score: e.score,
              type: EmotionScoreType.POST
            }))
          ]
        },
        performanceMetrics: {
          create: data.performanceMetrics.map(m => ({
            name: m.name,
            value: m.value
          }))
        },
        recoveryData: {
          create: data.recoveryData.map(r => ({
            timeAfterSession: r.timeAfterSession,
            emotionScore: r.emotionScore,
            baseline: r.baseline
          }))
        }
      },
      include: {
        // Include the updated relations
        emotionScores: true,
        performanceMetrics: true,
        recoveryData: true
      }
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error('Failed to create session:', error);
    // Check if the error is a Prisma validation error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Provide more specific error message for validation errors
      return NextResponse.json({ error: `Failed to create session: ${error.message}` }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}