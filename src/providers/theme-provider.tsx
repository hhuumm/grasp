'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { ColorPalette, colorPalettes, defaultPalette, applyColorPalette, getStoredPalette } from '@/lib/theme'

interface ThemeContextType {
  currentPalette: ColorPalette
  availablePalettes: ColorPalette[]
  changePalette: (palette: ColorPalette) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentPalette, setCurrentPalette] = useState<ColorPalette>(defaultPalette)

  useEffect(() => {
    // Initialize theme on mount
    const storedPalette = getStoredPalette()
    if (storedPalette) {
      setCurrentPalette(storedPalette)
      applyColorPalette(storedPalette)
    } else {
      applyColorPalette(defaultPalette)
    }
  }, [])

  const changePalette = (palette: ColorPalette) => {
    setCurrentPalette(palette)
    applyColorPalette(palette)
  }

  return (
    <ThemeContext.Provider
      value={{
        currentPalette,
        availablePalettes: colorPalettes,
        changePalette,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
