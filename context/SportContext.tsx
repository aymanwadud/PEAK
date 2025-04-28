"use client"

import { createContext, useContext, useState, ReactNode } from 'react'
import { Sport } from '@/components/SportSelector'

interface SportContextType {
  selectedSport: Sport
  setSelectedSport: (sport: Sport) => void
}

const SportContext = createContext<SportContextType | undefined>(undefined)

export function SportProvider({ children }: { children: ReactNode }) {
  const [selectedSport, setSelectedSport] = useState<Sport>('tennis')

  return (
    <SportContext.Provider value={{ selectedSport, setSelectedSport }}>
      {children}
    </SportContext.Provider>
  )
}

export function useSport() {
  const context = useContext(SportContext)
  if (context === undefined) {
    throw new Error('useSport must be used within a SportProvider')
  }
  return context
}