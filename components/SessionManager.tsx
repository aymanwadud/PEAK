"use client"

import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { Schedule, SessionType, Metrics } from "@/types/game"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { format, isWithinInterval, subHours as subtractHours, addHours } from "date-fns"
import { Trophy, Timer } from "lucide-react"
import { Sport, SPORT_CONFIGS } from "./SportSelector"
import { useSport } from "@/context/ActivityContext"
import { useSession } from "@/context/SessionContext"

interface SessionManagerProps {
  schedules: Schedule[]
  onSessionStart: (sessionId: string | null, type: SessionType) => void
  onComplete: (metrics: Metrics) => void
}

export function SessionManager({ 
  schedules, 
  onSessionStart,
  onComplete 
}: SessionManagerProps) {
  const [activeSession, setActiveSession] = useState<Schedule | null>(null)
  const [showMetricsDialog, setShowMetricsDialog] = useState(false)
  const [metrics, setMetrics] = useState<Record<string, number>>({})
  const [outcome, setOutcome] = useState<'win' | 'loss' | null>(null)
  const { selectedSport } = useSport()
  const { sessionId, sessionType, setSession } = useSession()
  const sportConfig = SPORT_CONFIGS[selectedSport]

  useEffect(() => {
    // Find current session based on schedule
    const now = new Date()
    const currentSession = schedules.find(session => {
      const sessionTime = new Date(`${session.date}T${session.time}`)
      return isWithinInterval(now, {
        start: subtractHours(sessionTime, 2), // 2 hours before
        end: addHours(sessionTime, 4) // 4 hours after
      })
    })

    if (currentSession) {
      setActiveSession(currentSession)
      const sessionTime = new Date(`${currentSession.date}T${currentSession.time}`)
      // Determine session type based on time
      if (now < sessionTime) {
        setSession(currentSession.id, 'pre-session')
      } else {
        setSession(currentSession.id, 'post-session')
      }
    } else {
      setActiveSession(null)
      if (!sessionId) {
        setSession(null, null)
      }
    }
  }, [schedules, setSession, sessionId])

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault()
    if (activeSession && outcome) {
      const sessionMetrics: Metrics = {
        id: crypto.randomUUID(),
        sessionId: activeSession.id,
        metrics: Object.entries(metrics).map(([name, value]) => ({
          name,
          value
        })),
        outcome
      }
      onComplete(sessionMetrics)
      setShowMetricsDialog(false)
      // Start post-session automatically
      setSession(activeSession.id, 'post-session')
    }
  }

  if (!activeSession) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Session</h2>
        <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-card space-y-4">
          <p className="text-center text-muted-foreground">
            No active sessions found. Add a session to your schedule or start a manual session.
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setSession(null, 'pre-session')}
            >
              Start Pre-Session
            </Button>
            <Button
              variant="outline"
              onClick={() => setSession(null, 'post-session')}
            >
              Start Post-Session
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const sessionTime = new Date(`${activeSession.date}T${activeSession.time}`)
  const isPreSession = sessionType === 'pre-session'
  const isPostSession = sessionType === 'post-session'

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Active Session</h2>
      <div className="p-4 border rounded-lg bg-card space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium">{format(sessionTime, "PPp")}</p>
            {activeSession.opponent && (
              <p className="text-sm text-muted-foreground">vs {activeSession.opponent}</p>
            )}
          </div>
          <div className="space-x-2">
            {!isPreSession && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSession(activeSession.id, 'pre-session')}
              >
                <Timer className="w-4 h-4 mr-1" />
                Pre-Session
              </Button>
            )}
            {!isPostSession && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMetricsDialog(true)}
              >
                <Trophy className="w-4 h-4 mr-1" />
                Complete
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {isPreSession ? (
            <>
              <Button 
                onClick={() => setSession(activeSession.id, 'pre-session')}
                className="w-full"
              >
                Start Pre-Session
              </Button>
              <Dialog open={showMetricsDialog} onOpenChange={setShowMetricsDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Trophy className="w-4 h-4 mr-2" />
                    Enter Results
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Session Results</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleComplete} className="space-y-4">
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
                      <Button type="submit">Save & Start Post-Session</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <Button 
              onClick={() => setSession(activeSession.id, 'post-session')}
              className="w-full"
            >
              Start Post-Session
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}