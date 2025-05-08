"use client"

import { createContext, useContext, useState, ReactNode } from 'react'
import { Sport } from '@/components/SportSelector'

interface ActivityContextType {
  selectedSport: Sport
  setSelectedSport: (sport: Sport) => void
  goals: {
    [key: string]: string | number
  }
  setGoals: (goals: { [key: string]: string | number }) => void
  metrics: {
    [key: string]: number
  }
  setMetrics: (metrics: { [key: string]: number }) => void
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined)

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [selectedSport, setSelectedSport] = useState<Sport>('tennis')
  const [goals, setGoals] = useState<{ [key: string]: string | number }>({})
  const [metrics, setMetrics] = useState<{ [key: string]: number }>({})

  return (
    <ActivityContext.Provider value={{
      selectedSport,
      setSelectedSport,
      goals,
      setGoals,
      metrics,
      setMetrics
    }}>
      {children}
    </ActivityContext.Provider>
  )
}

export function useSport() {
  const context = useContext(ActivityContext)
  if (context === undefined) {
    throw new Error('useSport must be used within an ActivityProvider')
  }
  return context
}