"use client"

import { createContext, useContext, useState, ReactNode } from 'react'
import { GameSession } from '@/types/game'

interface GameSessionContextType {
  gameId: string | null
  sessionType: GameSession | null
  setGameSession: (gameId: string | null, type: GameSession | null) => void
}

const GameSessionContext = createContext<GameSessionContextType | undefined>(undefined)

export function GameSessionProvider({ children }: { children: ReactNode }) {
  const [gameId, setGameId] = useState<string | null>(null)
  const [sessionType, setSessionType] = useState<GameSession | null>(null)

  const setGameSession = (newGameId: string | null, type: GameSession | null) => {
    setGameId(newGameId)
    setSessionType(type)
  }

  return (
    <GameSessionContext.Provider value={{ gameId, sessionType, setGameSession }}>
      {children}
    </GameSessionContext.Provider>
  )
}

export function useGameSession() {
  const context = useContext(GameSessionContext)
  if (context === undefined) {
    throw new Error('useGameSession must be used within a GameSessionProvider')
  }
  return context
}