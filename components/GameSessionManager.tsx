"use client"

import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { GameSchedule, GameSession, GameMetrics } from "@/types/game"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { format, isWithinInterval, subHours as subtractHours, addHours } from "date-fns"
import { Trophy, Timer } from "lucide-react"
import { Sport, SPORT_CONFIGS } from "./SportSelector"
import { useSport } from "@/context/SportContext"
import { useGameSession } from "@/context/GameSessionContext"

interface GameSessionManagerProps {
  schedules: GameSchedule[]
  onSessionStart: (gameId: string | null, sessionType: GameSession) => void
  onGameComplete: (metrics: GameMetrics) => void
}

export function GameSessionManager({ 
  schedules, 
  onSessionStart,
  onGameComplete 
}: GameSessionManagerProps) {
  const [activeGame, setActiveGame] = useState<GameSchedule | null>(null)
  const [showMetricsDialog, setShowMetricsDialog] = useState(false)
  const [metrics, setMetrics] = useState<Record<string, number>>({})
  const [outcome, setOutcome] = useState<'win' | 'loss' | null>(null)
  const { selectedSport } = useSport()
  const { gameId, sessionType, setGameSession } = useGameSession()
  const sportConfig = SPORT_CONFIGS[selectedSport]

  useEffect(() => {
    // Find current game based on schedule
    const now = new Date()
    const currentGame = schedules.find(game => {
      const gameTime = new Date(`${game.date}T${game.time}`)
      return isWithinInterval(now, {
        start: subtractHours(gameTime, 2), // 2 hours before game
        end: addHours(gameTime, 4) // 4 hours after game
      })
    })

    if (currentGame) {
      setActiveGame(currentGame)
      const gameTime = new Date(`${currentGame.date}T${currentGame.time}`)
      // Determine session type based on game time
      if (now < gameTime) {
        setGameSession(currentGame.id, 'pre-game')
      } else {
        setGameSession(currentGame.id, 'post-game')
      }
    } else {
      setActiveGame(null)
      if (!gameId) {
        setGameSession(null, null)
      }
    }
  }, [schedules, setGameSession, gameId])

  const handleGameComplete = (e: React.FormEvent) => {
    e.preventDefault()
    if (activeGame && outcome) {
      const gameMetrics: GameMetrics = {
        id: crypto.randomUUID(),
        gameId: activeGame.id,
        metrics: Object.entries(metrics).map(([name, value]) => ({
          name,
          value
        })),
        outcome
      }
      onGameComplete(gameMetrics)
      setShowMetricsDialog(false)
      // Start post-game session automatically
      setGameSession(activeGame.id, 'post-game')
    }
  }

  if (!activeGame) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Game Session</h2>
        <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-card space-y-4">
          <p className="text-center text-muted-foreground">
            No active games found. Add a game to your schedule or start a manual session.
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setGameSession(null, 'pre-game')}
            >
              Start Pre-Game Session
            </Button>
            <Button
              variant="outline"
              onClick={() => setGameSession(null, 'post-game')}
            >
              Start Post-Game Session
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const gameTime = new Date(`${activeGame.date}T${activeGame.time}`)
  const isPreGame = sessionType === 'pre-game'
  const isPostGame = sessionType === 'post-game'

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Active Game Session</h2>
      <div className="p-4 border rounded-lg bg-card space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium">{format(gameTime, "PPp")}</p>
            {activeGame.opponent && (
              <p className="text-sm text-muted-foreground">vs {activeGame.opponent}</p>
            )}
          </div>
          <div className="space-x-2">
            {!isPreGame && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGameSession(activeGame.id, 'pre-game')}
              >
                <Timer className="w-4 h-4 mr-1" />
                Pre-Game
              </Button>
            )}
            {!isPostGame && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMetricsDialog(true)}
              >
                <Trophy className="w-4 h-4 mr-1" />
                Complete Game
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {isPreGame ? (
            <>
              <Button 
                onClick={() => setGameSession(activeGame.id, 'pre-game')}
                className="w-full"
              >
                Start Pre-Game Session
              </Button>
              <Dialog open={showMetricsDialog} onOpenChange={setShowMetricsDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Trophy className="w-4 h-4 mr-2" />
                    Enter Game Results
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Game Results</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleGameComplete} className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Outcome</label>
                        <div className="flex gap-2 mt-1.5">
                          <Button
                            type="button"
                            variant={outcome === 'win' ? 'default' : 'outline'}
                            onClick={() => setOutcome('win')}
                          >
                            Win
                          </Button>
                          <Button
                            type="button"
                            variant={outcome === 'loss' ? 'default' : 'outline'}
                            onClick={() => setOutcome('loss')}
                          >
                            Loss
                          </Button>
                        </div>
                      </div>
                      {sportConfig.metrics.map((metric) => (
                        <div key={metric} className="grid gap-2">
                          <label className="text-sm font-medium">{metric}</label>
                          <input
                            type="number"
                            step="0.1"
                            required
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                            value={metrics[metric] || ''}
                            onChange={(e) => setMetrics({
                              ...metrics,
                              [metric]: parseFloat(e.target.value)
                            })}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit">Save & Start Post-Game</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <Button 
              onClick={() => setGameSession(activeGame.id, 'post-game')}
              className="w-full"
            >
              Start Post-Game Session
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}