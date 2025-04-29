"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { GameSchedule } from "@/types/game"
import { format as formatDate } from "date-fns"
import { Calendar, Clock, Plus } from "lucide-react"

interface GameScheduleManagerProps {
  onScheduleUpdate: (schedule: GameSchedule[]) => void
  schedules: GameSchedule[]
}

export function GameScheduleManager({ onScheduleUpdate, schedules }: GameScheduleManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newGame, setNewGame] = useState<Partial<GameSchedule>>({})

  const handleAddGame = (e: React.FormEvent) => {
    e.preventDefault()
    if (newGame.date && newGame.time) {
      const game: GameSchedule = {
        id: crypto.randomUUID(),
        date: newGame.date,
        time: newGame.time,
        opponent: newGame.opponent,
        venue: newGame.venue,
        notes: newGame.notes
      }
      onScheduleUpdate([...schedules, game])
      setNewGame({})
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Game Schedule</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add Game
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Game</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddGame} className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="date"
                    required
                    className="pl-8 w-full rounded-md border border-input bg-background px-3 py-2"
                    value={newGame.date || ''}
                    onChange={(e) => setNewGame({ ...newGame, date: e.target.value })}
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
                    value={newGame.time || ''}
                    onChange={(e) => setNewGame({ ...newGame, time: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Opponent (Optional)</label>
                <input
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={newGame.opponent || ''}
                  onChange={(e) => setNewGame({ ...newGame, opponent: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Venue (Optional)</label>
                <input
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={newGame.venue || ''}
                  onChange={(e) => setNewGame({ ...newGame, venue: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Notes (Optional)</label>
                <textarea
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  rows={3}
                  value={newGame.notes || ''}
                  onChange={(e) => setNewGame({ ...newGame, notes: e.target.value })}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Add Game</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-2">
        {schedules.length === 0 ? (
          <p className="text-sm text-muted-foreground">No games scheduled. Add your upcoming games to enable automatic session tracking.</p>
        ) : (
          schedules.map((game) => (
            <div
              key={game.id}
              className="p-4 rounded-lg border bg-card"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    {formatDate(new Date(`${game.date}T${game.time}`), "PPp")}
                  </p>
                  {game.opponent && (
                    <p className="text-sm text-muted-foreground">vs {game.opponent}</p>
                  )}
                  {game.venue && (
                    <p className="text-sm text-muted-foreground">{game.venue}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    onScheduleUpdate(schedules.filter(s => s.id !== game.id))
                  }}
                >
                  <span className="sr-only">Remove game</span>
                  ×
                </Button>
              </div>
              {game.notes && (
                <p className="mt-2 text-sm text-muted-foreground">{game.notes}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}