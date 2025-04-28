"use client"

import { Moon, Settings as SettingsIcon, Sun } from "lucide-react"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { useState, useLayoutEffect } from "react"
import SportSelector from "./SportSelector"
import { useSport } from "@/context/SportContext"

export function Settings() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const { selectedSport, setSelectedSport } = useSport()

  useLayoutEffect(() => {
    const el = document.documentElement
    if (el.classList.contains("dark")) {
      setIsDarkMode(true)
    } else {
      setIsDarkMode(false)
    }
  }, [])

  const toggleDark = () => {
    const el = document.documentElement
    el.classList.toggle("dark")
    setIsDarkMode((prev) => !prev)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="ml-2">
          <SettingsIcon className="size-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-sm font-medium">Appearance</span>
            <Button
              onClick={toggleDark}
              variant="ghost"
              size="icon"
              className="ml-auto"
            >
              {isDarkMode ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
          <div className="space-y-2 px-1">
            <span className="text-sm font-medium">Sport</span>
            <SportSelector 
              selectedSport={selectedSport} 
              onSportChange={setSelectedSport}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}