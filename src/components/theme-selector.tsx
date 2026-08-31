'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTheme } from '@/providers/theme-provider'
import { Palette, Check } from 'lucide-react'
import * as Headless from '@headlessui/react'
import clsx from 'clsx'

export function ThemeSelector() {
  const { currentPalette, availablePalettes, changePalette } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <Button
        plain
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Palette className="w-4 h-4" />
        <span className="hidden sm:inline">Theme</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 z-50">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              Choose Color Palette
            </h3>
            <div className="space-y-3">
              {availablePalettes.map((palette) => (
                <button
                  key={palette.name}
                  onClick={() => {
                    changePalette(palette)
                    setIsOpen(false)
                  }}
                  className={clsx(
                    'w-full p-3 rounded-lg border-2 transition-all text-left',
                    currentPalette.name === palette.name
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                      {palette.name}
                    </span>
                    {currentPalette.name === palette.name && (
                      <Check className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  
                  <div className="flex gap-1 mb-2">
                    {Object.entries(palette.colors).map(([key, color]) => (
                      <div
                        key={key}
                        className="w-6 h-6 rounded-full border border-zinc-300 dark:border-zinc-600"
                        style={{ backgroundColor: color }}
                        title={key}
                      />
                    ))}
                  </div>
                  
                  <div className="flex gap-1 flex-wrap">
                    <Badge color="primary" className="text-xs">Primary</Badge>
                    <Badge color="success" className="text-xs">Success</Badge>
                    <Badge color="warning" className="text-xs">Warning</Badge>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export function ThemeSelectorModal() {
  const { currentPalette, availablePalettes, changePalette } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        outline
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Palette className="w-4 h-4" />
        Customize Theme
      </Button>

      <Headless.Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/25" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <Headless.DialogPanel className="max-w-2xl w-full bg-white dark:bg-zinc-900 rounded-xl shadow-2xl">
            <div className="p-6">
              <Headless.DialogTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                Choose Your Color Palette
              </Headless.DialogTitle>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availablePalettes.map((palette) => (
                  <button
                    key={palette.name}
                    onClick={() => {
                      changePalette(palette)
                      setIsOpen(false)
                    }}
                    className={clsx(
                      'p-4 rounded-lg border-2 transition-all text-left',
                      currentPalette.name === palette.name
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                    )}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {palette.name}
                      </span>
                      {currentPalette.name === palette.name && (
                        <Check className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                    
                    <div className="flex gap-2 mb-3">
                      {Object.entries(palette.colors).map(([key, color]) => (
                        <div
                          key={key}
                          className="w-8 h-8 rounded-full border border-zinc-300 dark:border-zinc-600 flex-shrink-0"
                          style={{ backgroundColor: color }}
                          title={key}
                        />
                      ))}
                    </div>
                    
                    <div className="flex gap-2 flex-wrap">
                      <Badge color="primary" className="text-xs">Primary</Badge>
                      <Badge color="success" className="text-xs">Success</Badge>
                      <Badge color="warning" className="text-xs">Warning</Badge>
                      <Badge color="error" className="text-xs">Error</Badge>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="flex justify-end mt-6">
                <Button outline onClick={() => setIsOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          </Headless.DialogPanel>
        </div>
      </Headless.Dialog>
    </>
  )
}
