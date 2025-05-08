import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a tennis session with pre/post session emotions and metrics
  await prisma.session.create({
    data: {
      date: new Date('2025-04-28T16:00:00Z'),
      sport: 'tennis',
      outcome: 'win',
      preSessionEmotions: {
        create: [
          { name: 'Confidence', score: 0.75 },
          { name: 'Focus', score: 0.82 },
          { name: 'Anxiety', score: 0.45 }
        ]
      },
      postSessionEmotions: {
        create: [
          { name: 'Confidence', score: 0.85 },
          { name: 'Focus', score: 0.88 },
          { name: 'Anxiety', score: 0.32 }
        ]
      },
      performanceMetrics: {
        create: [
          { name: 'First Serve %', value: 65 },
          { name: 'Winners', value: 28 },
          { name: 'Unforced Errors', value: 18 }
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
      }
    }
  });

  // Create a baseball pitcher session
  await prisma.session.create({
    data: {
      date: new Date('2025-04-29T16:00:00Z'),
      sport: 'baseball-pitcher',
      outcome: 'loss',
      preSessionEmotions: {
        create: [
          { name: 'Confidence', score: 0.72 },
          { name: 'Focus', score: 0.68 },
          { name: 'Composure', score: 0.65 }
        ]
      },
      postSessionEmotions: {
        create: [
          { name: 'Confidence', score: 0.62 },
          { name: 'Focus', score: 0.71 },
          { name: 'Composure', score: 0.58 }
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });