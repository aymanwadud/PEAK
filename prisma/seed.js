const { PrismaClient, EmotionScoreType } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create a tennis session with combined emotion scores and metrics
  await prisma.session.create({
    data: {
      date: new Date("2025-04-28T16:00:00.000Z"),
      sport: "tennis",
      outcome: "win",
      // Use the single emotionScores relation
      emotionScores: {
        create: [
          // Pre-session emotions with type PRE
          { name: "Confidence", score: 0.75, type: EmotionScoreType.PRE },
          { name: "Focus", score: 0.82, type: EmotionScoreType.PRE },
          { name: "Anxiety", score: 0.45, type: EmotionScoreType.PRE },
          // Post-session emotions with type POST
          { name: "Confidence", score: 0.85, type: EmotionScoreType.POST },
          { name: "Focus", score: 0.88, type: EmotionScoreType.POST },
          { name: "Anxiety", score: 0.32, type: EmotionScoreType.POST },
        ]
      },
      performanceMetrics: {
        create: [
          { name: "First Serve %", value: 65 },
          { name: "Winners", value: 28 },
          { name: "Unforced Errors", value: 18 }
        ]
      },
      recoveryData: {
        create: [
          { timeAfterSession: 0, emotionScore: 0.85, baseline: 0.7 },
          { timeAfterSession: 2, emotionScore: 0.82, baseline: 0.7 },
          { timeAfterSession: 4, emotionScore: 0.78, baseline: 0.7 },
          { timeAfterSession: 8, emotionScore: 0.72, baseline: 0.7 },
          { timeAfterSession: 24, emotionScore: 0.7, baseline: 0.7 }
        ]
      },
    }
  });

  // Create a baseball pitcher session
  await prisma.session.create({
    data: {
      date: new Date('2025-04-29T16:00:00Z'),
      sport: 'baseball-pitcher',
      outcome: 'loss',
      emotionScores: {
        create: [
          // Pre-session emotions with type PRE
          { name: 'Confidence', score: 0.72, type: EmotionScoreType.PRE },
          { name: 'Focus', score: 0.68, type: EmotionScoreType.PRE },
          { name: 'Composure', score: 0.65, type: EmotionScoreType.PRE },
          // Post-session emotions with type POST
          { name: 'Confidence', score: 0.62, type: EmotionScoreType.POST },
          { name: 'Focus', score: 0.71, type: EmotionScoreType.POST },
          { name: 'Composure', score: 0.58, type: EmotionScoreType.POST },
        ]
      },
      performanceMetrics: {
        create: [
          { name: 'Strike %', value: 58 },
          { name: 'Velocity', value: 92 },
          { name: 'ERA', value: 4.5 }
        ]
      },
      recoveryData: {
        create: [
          { timeAfterSession: 0, emotionScore: 0.65, baseline: 0.7 },
          { timeAfterSession: 2, emotionScore: 0.68, baseline: 0.7 },
          { timeAfterSession: 4, emotionScore: 0.72, baseline: 0.7 },
          { timeAfterSession: 8, emotionScore: 0.71, baseline: 0.7 },
          { timeAfterSession: 24, emotionScore: 0.7, baseline: 0.7 }
        ]
      }
    }
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });