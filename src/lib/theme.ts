export interface ColorPalette {
  name: string
  colors: {
    primary: string
    secondary: string
    background: string
    accent: string
    dark: string
  }
}

export const colorPalettes: ColorPalette[] = [
  {
    name: 'Earth Tones (Default)',
    colors: {
      primary: '#606C38',    // Olive dark
      secondary: '#283618',  // Forest dark
      background: '#FEFAE0', // Cream
      accent: '#A66326',     // Brown light
      dark: '#603916',       // Brown dark
    },
  },
  {
    name: 'Ocean Blue',
    colors: {
      primary: '#2563eb',
      secondary: '#1e40af',
      background: '#f0f9ff',
      accent: '#0ea5e9',
      dark: '#1e3a8a',
    },
  },
  {
    name: 'Forest Green',
    colors: {
      primary: '#16a34a',
      secondary: '#15803d',
      background: '#f0fdf4',
      accent: '#22c55e',
      dark: '#14532d',
    },
  },
  {
    name: 'Sunset Orange',
    colors: {
      primary: '#ea580c',
      secondary: '#c2410c',
      background: '#fff7ed',
      accent: '#fb923c',
      dark: '#9a3412',
    },
  },
  {
    name: 'Purple Haze',
    colors: {
      primary: '#7c3aed',
      secondary: '#6d28d9',
      background: '#faf5ff',
      accent: '#a855f7',
      dark: '#581c87',
    },
  },
  {
    name: 'Rose Gold',
    colors: {
      primary: '#e11d48',
      secondary: '#be123c',
      background: '#fff1f2',
      accent: '#f43f5e',
      dark: '#881337',
    },
  },
]

export const defaultPalette = colorPalettes[0]

export function applyColorPalette(palette: ColorPalette) {
  const root = document.documentElement
  
  // Apply the custom color variables
  root.style.setProperty('--olive-dark', palette.colors.primary)
  root.style.setProperty('--forest-dark', palette.colors.secondary)
  root.style.setProperty('--cream', palette.colors.background)
  root.style.setProperty('--brown-light', palette.colors.accent)
  root.style.setProperty('--brown-dark', palette.colors.dark)
  
  // Update theme variables that depend on the palette
  root.style.setProperty('--primary', palette.colors.primary)
  root.style.setProperty('--primary-foreground', palette.colors.background)
  root.style.setProperty('--background', palette.colors.background)
  root.style.setProperty('--foreground', palette.colors.secondary)
  root.style.setProperty('--accent', palette.colors.accent)
  root.style.setProperty('--accent-foreground', palette.colors.background)
  root.style.setProperty('--success', palette.colors.primary)
  root.style.setProperty('--success-foreground', palette.colors.background)
  root.style.setProperty('--warning', palette.colors.accent)
  root.style.setProperty('--warning-foreground', palette.colors.background)
  root.style.setProperty('--error', palette.colors.dark)
  root.style.setProperty('--error-foreground', palette.colors.background)
  
  // Update ring color for focus states
  root.style.setProperty('--ring', palette.colors.primary)
  
  // Store the selected palette in localStorage
  localStorage.setItem('selectedPalette', JSON.stringify(palette))
}

export function getStoredPalette(): ColorPalette | null {
  if (typeof window === 'undefined') return null
  
  try {
    const stored = localStorage.getItem('selectedPalette')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function initializeTheme() {
  if (typeof window === 'undefined') return
  
  const storedPalette = getStoredPalette()
  if (storedPalette) {
    applyColorPalette(storedPalette)
  }
}

// Utility function to get difficulty colors using the current palette
export function getDifficultyColor(difficulty: string): string {
  const root = getComputedStyle(document.documentElement)
  
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return root.getPropertyValue('--success').trim() || '#16a34a'
    case 'intermediate':
      return root.getPropertyValue('--warning').trim() || '#ea580c'
    case 'advanced':
      return root.getPropertyValue('--error').trim() || '#dc2626'
    default:
      return root.getPropertyValue('--primary').trim() || '#606C38'
  }
}

// Utility function to get score colors using the current palette
export function getScoreColor(score: number): string {
  const root = getComputedStyle(document.documentElement)
  
  if (score >= 80) {
    return root.getPropertyValue('--success').trim() || '#16a34a'
  } else if (score >= 60) {
    return root.getPropertyValue('--warning').trim() || '#ea580c'
  } else {
    return root.getPropertyValue('--error').trim() || '#dc2626'
  }
}
