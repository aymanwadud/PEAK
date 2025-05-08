"use client"

import { createContext, useContext, useState, ReactNode } from 'react'
import { SessionType } from '@/types/game'

interface SessionContextType {
  sessionId: string | null
  sessionType: SessionType | null
  setSession: (sessionId: string | null, type: SessionType | null) => void
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [sessionType, setSessionType] = useState<SessionType | null>(null)

  const setSession = (newSessionId: string | null, type: SessionType | null) => {
    setSessionId(newSessionId)
    setSessionType(type)
  }

  return (
    <SessionContext.Provider value={{ sessionId, sessionType, setSession }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}