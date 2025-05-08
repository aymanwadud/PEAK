"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Schedule } from "@/types/game"
import { format as formatDate } from "date-fns"
import { Calendar, Clock, Plus } from "lucide-react"

interface ScheduleManagerProps {
  onScheduleUpdate: (schedule: Schedule[]) => void
  schedules: Schedule[]
}

export function ScheduleManager({ onScheduleUpdate, schedules }: ScheduleManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newSession, setNewSession] = useState<Partial<Schedule>>({})

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (newSession.date && newSession.time) {
      const session: Schedule = {
        id: crypto.randomUUID(),
        date: newSession.date,
        time: newSession.time,
        opponent: newSession.opponent,
        venue: newSession.venue,
        notes: newSession.notes
      }
      onScheduleUpdate([...schedules, session])
      setNewSession({})
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Schedule</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add Session
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Session</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="date"
                    required
                    className="pl-8 w-full rounded-md border border-input bg-background px-3 py-2"
                    value={newSession.date || ''}
                    onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Time</label>
                <div className="relative">
                  <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="time"
                    required
                    className="pl-8 w-full rounded-md border border-input bg-background px-3 py-2"
                    value={newSession.time || ''}
                    onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Opponent (Optional)</label>
                <input
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={newSession.opponent || ''}
                  onChange={(e) => setNewSession({ ...newSession, opponent: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Venue (Optional)</label>
                <input
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={newSession.venue || ''}
                  onChange={(e) => setNewSession({ ...newSession, venue: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Notes (Optional)</label>
                <textarea
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  rows={3}
                  value={newSession.notes || ''}
                  onChange={(e) => setNewSession({ ...newSession, notes: e.target.value })}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Add Session</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-2">
        {schedules.length === 0 ? (
          <p className="text-sm text-muted-foreground">No sessions scheduled. Add your upcoming sessions to enable automatic tracking.</p>
        ) : (
          schedules.map((session) => (
            <div
              key={session.id}
              className="p-4 rounded-lg border bg-card"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    {formatDate(new Date(`${session.date}T${session.time}`), "PPp")}
                  </p>
                  {session.opponent && (
                    <p className="text-sm text-muted-foreground">vs {session.opponent}</p>
                  )}
                  {session.venue && (
                    <p className="text-sm text-muted-foreground">{session.venue}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    onScheduleUpdate(schedules.filter(s => s.id !== session.id))
                  }}
                >
                  <span className="sr-only">Remove session</span>
                  ×
                </Button>
              </div>
              {session.notes && (
                <p className="mt-2 text-sm text-muted-foreground">{session.notes}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}