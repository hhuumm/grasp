'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ThemeSelector, ThemeSelectorModal } from '@/components/theme-selector'
import type { OpenLibraryBook } from '@/lib/open-library'
import { BookOpen, TrendingUp, Clock, Target, ArrowRight, X, CheckCircle, AlertCircle, Key, Settings } from 'lucide-react'

// Mock data for demonstration
const mockPassages = [
  {
    id: '1',
    text: 'The rapid advancement of artificial intelligence has transformed various industries, from healthcare to finance. Machine learning algorithms can now diagnose diseases with remarkable accuracy, often matching or exceeding human experts. In the financial sector, AI systems analyze vast amounts of data to detect fraud and make investment decisions. However, these developments raise important questions about job displacement and the need for new skills in the workforce. As AI continues to evolve, society must balance technological progress with ethical considerations and ensure that the benefits are distributed equitably.',
    source: 'Tech Weekly',
    difficulty: 'intermediate',
    tags: ['technology', 'AI'],
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    text: 'Climate change continues to be one of the most pressing issues of our time, with global temperatures rising at an unprecedented rate. The effects are visible worldwide: melting ice caps, rising sea levels, and increasingly severe weather events. Scientists emphasize that immediate action is necessary to limit warming to 1.5 degrees Celsius above pre-industrial levels. This requires a coordinated global effort to reduce greenhouse gas emissions, transition to renewable energy sources, and implement sustainable practices across all sectors of the economy. Individual actions, while important, must be complemented by systemic changes in policy and industry practices.',
    source: 'Environmental Science Journal',
    difficulty: 'advanced',
    tags: ['environment', 'science'],
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    text: 'The ancient city of Pompeii offers a unique window into Roman life, frozen in time by the eruption of Mount Vesuvius in 79 AD. Archaeological excavations have revealed remarkably preserved buildings, artwork, and even the remains of residents caught in the disaster. These findings provide invaluable insights into daily life, social structures, and cultural practices of the Roman Empire. The site continues to yield new discoveries, with recent excavations uncovering previously unknown areas of the city. Pompeii serves as both a sobering reminder of nature\'s power and an extraordinary resource for understanding ancient civilizations.',
    source: 'History Today',
    difficulty: 'beginner',
    tags: ['history', 'archaeology'],
    createdAt: new Date('2024-01-12'),
  },
]

const initialMockResponses = [
  {
    id: '1',
    passageId: '1',
    summaryText: 'AI is changing industries rapidly, especially in healthcare and finance. While it brings benefits, there are concerns about job displacement.',
    aiScore: 85,
    aiFeedback: 'Good summary that captures the main points. You identified the key industries and mentioned the ethical concerns. To improve, consider adding more specific examples of AI applications.',
    strengths: ['Clear and concise', 'Identified main themes', 'Mentioned ethical concerns'],
    improvements: ['Add specific examples', 'Discuss the balance between progress and ethics'],
    timestamp: new Date('2024-01-16'),
  },
]

type DemoResult = (typeof initialMockResponses)[number] & {
  readingTime: number
  writingTime: number
  totalTime: number
  usedRealAI: boolean
}

type TutorialStep = 'settings' | 'api-key' | 'save' | null

export default function DemoPage() {
  const [selectedPassage, setSelectedPassage] = useState<typeof mockPassages[0] | null>(null)
  const [summary, setSummary] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [responses, setResponses] = useState(initialMockResponses)
  const [showResult, setShowResult] = useState(false)
  const [currentResult, setCurrentResult] = useState<DemoResult | null>(null)
  const [readingStartTime, setReadingStartTime] = useState<number>(0)
  const [writingStartTime, setWritingStartTime] = useState<number>(0)
  const [phase, setPhase] = useState<'reading' | 'writing'>('reading')
  const [readingTime, setReadingTime] = useState<number>(0)
  const [openaiApiKey, setOpenaiApiKey] = useState('')
  const [useRealAI, setUseRealAI] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedBook, setSelectedBook] = useState<OpenLibraryBook | null>(null)
  const [scoringError, setScoringError] = useState<string | null>(null)
  const [tutorialStep, setTutorialStep] = useState<TutorialStep>(null)

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key')
    if (savedKey) {
      setOpenaiApiKey(savedKey)
      setUseRealAI(true)
    } else if (!localStorage.getItem('grasp:ai-tutorial-complete')) {
      setTutorialStep('settings')
    }

    const savedBook = localStorage.getItem('grasp:selected-book')
    if (savedBook) {
      try {
        setSelectedBook(JSON.parse(savedBook) as OpenLibraryBook)
      } catch {
        localStorage.removeItem('grasp:selected-book')
      }
    }
  }, [])

  // Save API key to localStorage when it changes
  const handleSaveApiKey = () => {
    if (openaiApiKey.trim()) {
      localStorage.setItem('openai_api_key', openaiApiKey.trim())
      localStorage.setItem('grasp:ai-tutorial-complete', 'true')
      setUseRealAI(true)
      setTutorialStep(null)
      setShowSettings(false)
    }
  }

  const handleOpenSettings = () => {
    setShowSettings(true)
    if (tutorialStep === 'settings') setTutorialStep('api-key')
  }

  const handleCloseSettings = () => {
    setShowSettings(false)
    if (tutorialStep) setTutorialStep('settings')
  }

  const handleApiKeyChange = (value: string) => {
    setOpenaiApiKey(value)
    if (tutorialStep === 'api-key' && value.trim()) setTutorialStep('save')
    if (tutorialStep === 'save' && !value.trim()) setTutorialStep('api-key')
  }

  const handleSkipTutorial = () => {
    localStorage.setItem('grasp:ai-tutorial-complete', 'true')
    setTutorialStep(null)
  }

  const handleRemoveApiKey = () => {
    localStorage.removeItem('openai_api_key')
    setOpenaiApiKey('')
    setUseRealAI(false)
  }

  const handleReadPassage = (passage: typeof mockPassages[0]) => {
    setSelectedPassage(passage)
    setSummary('')
    setPhase('reading')
    setReadingStartTime(Date.now())
    setReadingTime(0)
    setScoringError(null)
  }

  const handleDoneReading = () => {
    const timeSpent = Math.floor((Date.now() - readingStartTime) / 1000)
    setReadingTime(timeSpent)
    setPhase('writing')
    setWritingStartTime(Date.now())
  }

  const handleCloseModal = () => {
    setSelectedPassage(null)
    setSummary('')
    setPhase('reading')
    setReadingTime(0)
  }

  const generateDemoFeedback = (passageText: string, summaryText: string) => {
    const stopWords = new Set([
      'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'have',
      'in', 'is', 'it', 'of', 'on', 'or', 'that', 'the', 'their', 'these', 'this',
      'to', 'was', 'were', 'will', 'with', 'you', 'your',
    ])
    const words = (text: string) => text
      .toLowerCase()
      .match(/[a-z0-9]+/g)
      ?.filter(word => word.length > 2 && !stopWords.has(word)) || []

    const passageWords = new Set(words(passageText))
    const summaryWords = [...new Set(words(summaryText))]
    const matchingWords = summaryWords.filter(word => passageWords.has(word))
    const relevance = summaryWords.length ? matchingWords.length / summaryWords.length : 0
    const score = Math.min(85, Math.round(relevance * 100))

    return {
      score,
      feedback: `Simulated demo score based only on keyword overlap (${matchingWords.length} of ${summaryWords.length} meaningful summary words matched). This is not an AI comprehension judgment.`,
      strengths: matchingWords.length
        ? [`Referenced passage terms: ${matchingWords.slice(0, 5).join(', ')}`]
        : [],
      improvements: ['Connect the summary directly to the passage’s main ideas.', 'Enable AI scoring for a genuine comprehension evaluation.'],
    }
  }

  const handleSubmitSummary = async () => {
    if (!summary.trim() || !selectedPassage) return

    setIsSubmitting(true)
    setScoringError(null)

    const writingTime = Math.floor((Date.now() - writingStartTime) / 1000)
    const totalTime = readingTime + writingTime

    if (!useRealAI || !openaiApiKey) {
      const result = generateDemoFeedback(selectedPassage.text, summary)
      const newResponse = {
        id: Date.now().toString(),
        passageId: selectedPassage.id,
        summaryText: summary,
        aiScore: result.score,
        aiFeedback: result.feedback,
        strengths: result.strengths,
        improvements: result.improvements,
        timestamp: new Date(),
        readingTime,
        writingTime,
        totalTime,
        usedRealAI: false,
      }

      setResponses([newResponse, ...responses])
      setCurrentResult(newResponse)
      setShowResult(true)
      setSelectedPassage(null)
      setSummary('')
      setPhase('reading')
      setReadingTime(0)
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/score-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passageText: selectedPassage.text,
          summaryText: summary,
          apiKey: openaiApiKey,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || data.error || 'AI scoring failed')
      }

      const newResponse = {
        id: Date.now().toString(),
        passageId: selectedPassage.id,
        summaryText: summary,
        aiScore: data.score,
        aiFeedback: data.feedback,
        strengths: data.strengths || [],
        improvements: data.improvements || [],
        timestamp: new Date(),
        readingTime,
        writingTime,
        totalTime,
        usedRealAI: true,
      }

      setResponses([newResponse, ...responses])
      setCurrentResult(newResponse)
      setShowResult(true)
      setSelectedPassage(null)
      setSummary('')
      setPhase('reading')
      setReadingTime(0)
    } catch (error) {
      setScoringError(error instanceof Error ? error.message : 'AI scoring failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseResult = () => {
    setShowResult(false)
    setCurrentResult(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Grasp</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge color="zinc">Demo Mode</Badge>
              {useRealAI && (
                <Badge color="success" className="flex items-center gap-1">
                  <Key className="w-3 h-3" />
                  AI Connected
                </Badge>
              )}
              <Button
                outline
                onClick={handleOpenSettings}
                className={`flex items-center gap-2 ${tutorialStep === 'settings' ? 'ring-4 ring-yellow-400 ring-offset-4 animate-pulse' : ''}`}
              >
                <Settings className="w-4 h-4" />
                Settings
              </Button>
              <ThemeSelector />
              <Link href="/">
                <Button outline>Back to Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {tutorialStep === 'settings' && !showSettings && (
        <div className="border-b-4 border-yellow-400 bg-yellow-50 px-4 py-5 shadow-md">
          <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-yellow-800">Step 1 of 3 · Enable real AI scoring</p>
              <p className="mt-1 text-lg font-bold text-gray-900">
                Click <span className="rounded bg-gray-900 px-2 py-1 text-white">Settings</span> at the top of the page.
              </p>
              <p className="mt-1 text-sm text-gray-700">Look for the flashing button with the gear icon. You can’t miss it.</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button color="primary" onClick={handleOpenSettings} className="animate-pulse">
                <Settings className="mr-2 h-4 w-4" /> Open Settings for me
              </Button>
              <Button outline onClick={handleSkipTutorial}>Skip</Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] rounded-3xl p-8 text-white shadow-xl">
              <h1 className="text-3xl font-bold mb-2">
                Welcome to Grasp Demo!
              </h1>
              <p className="text-white/90">
                This is a demonstration of the reading comprehension app interface
              </p>
            </div>

            {selectedBook && (
              <Card className="border-2 border-[var(--primary)]">
                <CardHeader>
                  <Badge color="success" className="w-fit">Book context</Badge>
                  <CardTitle>{selectedBook.title}</CardTitle>
                  <CardDescription>
                    {selectedBook.authors.join(', ') || 'Unknown author'} · selected from Open Library
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center justify-between gap-3">
                  <p className="max-w-2xl text-sm text-gray-600">
                    Use this title to guide your reading goals. Grasp does not import its text; the included passages below remain the practice material.
                  </p>
                  <Link href="/books"><Button outline>Choose another book</Button></Link>
                </CardContent>
              </Card>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="hover:scale-105 transition-transform duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Passages</CardTitle>
                  <div className="bg-[var(--primary)]/10 p-2 rounded-2xl">
                    <BookOpen className="h-4 w-4 text-[var(--primary)]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockPassages.length}</div>
                  <p className="text-xs text-muted-foreground">Available to read</p>
                </CardContent>
              </Card>

              <Card className="hover:scale-105 transition-transform duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <div className="bg-green-500/10 p-2 rounded-2xl">
                    <Target className="h-4 w-4 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{responses.length}</div>
                  <p className="text-xs text-muted-foreground">Passages completed</p>
                </CardContent>
              </Card>

              <Card className="hover:scale-105 transition-transform duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <div className="bg-[var(--accent)]/10 p-2 rounded-2xl">
                    <TrendingUp className="h-4 w-4 text-[var(--accent)]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">85%</div>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </CardContent>
              </Card>

              <Card className="hover:scale-105 transition-transform duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
                  <div className="bg-purple-500/10 p-2 rounded-2xl">
                    <Clock className="h-4 w-4 text-purple-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.5h</div>
                  <p className="text-xs text-muted-foreground">This week</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Available Passages</CardTitle>
                  <CardDescription>Start reading and practicing comprehension</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockPassages.map((passage) => (
                    <div key={passage.id} className="flex items-center justify-between p-5 border-2 rounded-3xl hover:shadow-lg transition-all duration-200 hover:scale-[1.02] bg-gradient-to-r from-white to-gray-50">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[var(--primary)] mb-2">{passage.source}</p>
                        <p className="text-sm line-clamp-2">{passage.text}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <Badge color={passage.difficulty === 'beginner' ? 'success' : passage.difficulty === 'intermediate' ? 'warning' : 'error'}>
                            {passage.difficulty}
                          </Badge>
                          {passage.tags.map((tag) => (
                            <Badge key={tag} color="zinc">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                      <Button
                        color="primary"
                        className="flex items-center gap-2 text-sm px-4 py-2 ml-4"
                        onClick={() => handleReadPassage(passage)}
                      >
                        Read <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Responses</CardTitle>
                  <CardDescription>Your latest comprehension attempts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {responses.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No responses yet. Start reading a passage to get started!</p>
                    </div>
                  ) : (
                    responses.map((response) => (
                      <div key={response.id} className="p-5 border-2 rounded-3xl hover:shadow-lg transition-all duration-200 hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-[var(--primary)]">Passage #{response.passageId}</span>
                          <Badge color={response.aiScore >= 80 ? 'success' : response.aiScore >= 60 ? 'warning' : 'error'}>
                            {response.aiScore}%
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-2 font-medium line-clamp-2">{response.summaryText}</p>
                        <p className="text-xs text-muted-foreground italic line-clamp-1">{response.aiFeedback}</p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Demo Notice */}
            <Card className="border-[var(--primary)]/20 bg-[var(--primary)]/5">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <BookOpen className="w-6 h-6 text-[var(--primary)] mt-1" />
                  <div>
                    <h3 className="font-semibold text-[var(--primary)] mb-2">Demo Mode Active</h3>
                    <p className="text-[var(--primary)]/80 mb-4">
                      This is a demonstration of the Grasp interface. To access full functionality:
                    </p>
                    <ul className="text-sm text-[var(--primary)]/70 space-y-1 mb-4">
                      <li>• Configure Clerk authentication for user management</li>
                      <li>• Set up PostgreSQL database for data persistence</li>
                      <li>• Add OpenAI API key for AI-powered feedback</li>
                      <li>• Deploy to production for full experience</li>
                    </ul>
                    <div className="flex gap-2">
                      <Link href="/">
                        <Button outline className="text-sm px-3 py-1.5">Back to Home</Button>
                      </Link>
                      <ThemeSelectorModal />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Reading/Writing Modal */}
      {selectedPassage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 rounded-t-3xl flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {phase === 'reading' ? '📖 Reading Phase' : '✍️ Writing Phase'}
                    </h2>
                    <p className="text-sm text-gray-600">{selectedPassage.source}</p>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full ml-4"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Phase Indicator */}
                <div className="mt-4 flex items-center gap-2">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${phase === 'reading' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-semibold">
                      {phase === 'reading' ? 'Read the passage carefully' : `Reading time: ${readingTime}s`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {!useRealAI && (
                <div role="alert" className="rounded-2xl border-4 border-red-600 bg-red-50 p-5 text-center shadow-sm">
                  <p className="text-xl font-black tracking-wide text-red-800">NO AI — SIMULATED DEMO SCORE</p>
                  <p className="mt-1 font-bold text-red-700">
                    Your result will use a basic keyword-overlap estimate, not an AI comprehension evaluation.
                  </p>
                </div>
              )}

              {phase === 'reading' ? (
                <>
                  {/* Reading Phase - Show Passage */}
                  <div className="bg-gradient-to-br from-[var(--primary)]/5 to-[var(--accent)]/5 rounded-2xl p-6 border-2 border-[var(--primary)]/20">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge color={selectedPassage.difficulty === 'beginner' ? 'success' : selectedPassage.difficulty === 'intermediate' ? 'warning' : 'error'}>
                        {selectedPassage.difficulty}
                      </Badge>
                      {selectedPassage.tags.map((tag) => (
                        <Badge key={tag} color="zinc">{tag}</Badge>
                      ))}
                    </div>
                    <p className="text-lg leading-relaxed text-gray-800">{selectedPassage.text}</p>
                  </div>

                  {/* Instructions */}
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5">
                    <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Instructions
                    </h3>
                    <ul className="text-blue-800 space-y-1 text-sm">
                      <li>• Read the passage carefully and understand the main ideas</li>
                      <li>• Take your time—there is no rush!</li>
                      <li>• When you are ready, click “I’m Done Reading” below</li>
                      <li>• You will then write a summary from memory</li>
                    </ul>
                  </div>

                  {scoringError && (
                    <div role="alert" className="rounded-2xl border-2 border-red-200 bg-red-50 p-4 text-sm text-red-800">
                      {scoringError}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 justify-end">
                    <Button outline onClick={handleCloseModal}>
                      Cancel
                    </Button>
                    <Button
                      color="primary"
                      onClick={handleDoneReading}
                      className="min-w-[180px]"
                    >
                      I’m Done Reading →
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* Writing Phase - Show Summary Input */}
                  <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5">
                    <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Write Your Summary
                    </h3>
                    <p className="text-amber-800 text-sm">
                      The passage is now hidden. Write a summary from memory, capturing the main ideas and key points.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Your summary:
                    </label>
                    <div className="relative">
                      <textarea
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder="Start typing your summary here..."
                        className="w-full min-h-[200px] text-base px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 placeholder:text-gray-400 resize-none"
                        autoFocus
                      />
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-gray-500">
                        {summary.split(' ').filter(w => w).length} words
                      </p>
                      <p className="text-xs text-gray-500">
                        Aim for 50-100 words
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 justify-end">
                    <Button outline onClick={handleCloseModal}>
                      Cancel
                    </Button>
                    <Button
                      color="primary"
                      onClick={handleSubmitSummary}
                      disabled={!summary.trim() || isSubmitting}
                      className="min-w-[140px]"
                    >
                      {isSubmitting ? 'Scoring...' : 'Submit Summary'}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Result Modal */}
      {showResult && currentResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white p-6 rounded-t-3xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Your Results</h2>
                  <p className="text-white/90">
                    {currentResult.usedRealAI ? 'AI Feedback on your summary' : 'Simulated demo feedback — no AI was used'}
                  </p>
                </div>
                <button
                  onClick={handleCloseResult}
                  className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Score */}
              <div className="text-center py-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2">
                <div className="text-6xl font-bold text-[var(--primary)] mb-2">
                  {currentResult.aiScore}%
                </div>
                <p className="text-gray-600 font-medium">Comprehension Score</p>
              </div>

              {/* Time Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-700">{currentResult.readingTime}s</div>
                  <p className="text-xs text-blue-600 mt-1">Reading Time</p>
                </div>
                <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-700">{currentResult.writingTime}s</div>
                  <p className="text-xs text-purple-600 mt-1">Writing Time</p>
                </div>
                <div className="bg-[var(--primary)]/10 border-2 border-[var(--primary)]/20 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-[var(--primary)]">{currentResult.totalTime}s</div>
                  <p className="text-xs text-[var(--primary)]/70 mt-1">Total Time</p>
                </div>
              </div>

              {/* Feedback */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {currentResult.usedRealAI ? 'AI Feedback' : 'Simulated Feedback — NO AI'}
                </h3>
                <p className="text-blue-800">{currentResult.aiFeedback}</p>
              </div>

              {/* Strengths */}
              {currentResult.strengths && currentResult.strengths.length > 0 && (
                <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-5">
                  <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Strengths
                  </h3>
                  <ul className="space-y-2">
                    {currentResult.strengths.map((strength: string, index: number) => (
                      <li key={index} className="text-green-800 flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improvements */}
              {currentResult.improvements && currentResult.improvements.length > 0 && (
                <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5">
                  <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Areas for Improvement
                  </h3>
                  <ul className="space-y-2">
                    {currentResult.improvements.map((improvement: string, index: number) => (
                      <li key={index} className="text-amber-800 flex items-start gap-2">
                        <span className="text-amber-500 mt-1">→</span>
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Your Summary */}
              <div className="border-2 rounded-2xl p-5">
                <h3 className="font-semibold text-gray-900 mb-3">Your Summary</h3>
                <p className="text-gray-700 leading-relaxed">{currentResult.summaryText}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button outline onClick={handleCloseResult} className="flex-1">
                  Close
                </Button>
                <Button
                  color="primary"
                  onClick={() => {
                    handleCloseResult()
                    // Could add logic to select next passage
                  }}
                  className="flex-1"
                >
                  Try Another Passage
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full">
            <div className="sticky top-0 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white p-6 rounded-t-3xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <Settings className="w-6 h-6" />
                    AI Settings
                  </h2>
                  <p className="text-white/90">Configure your OpenAI API connection</p>
                </div>
                <button
                  onClick={handleCloseSettings}
                  className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {tutorialStep && (
                <div className="rounded-2xl border-4 border-yellow-400 bg-yellow-50 p-5 shadow-md">
                  <p className="text-sm font-black uppercase tracking-widest text-yellow-800">
                    {tutorialStep === 'api-key' ? 'Step 2 of 3' : 'Step 3 of 3'}
                  </p>
                  <p className="mt-1 text-lg font-bold text-gray-900">
                    {tutorialStep === 'api-key'
                      ? 'Paste your OpenAI API key into the box labeled “OpenAI API Key” below.'
                      : 'Great—now click the flashing “Save & Connect” button.'}
                  </p>
                  <button onClick={handleSkipTutorial} className="mt-2 text-sm font-semibold text-yellow-900 underline">
                    Skip tutorial
                  </button>
                </div>
              )}

              {/* Current Status */}
              <div className={`rounded-2xl p-5 border-2 ${useRealAI ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-3 h-3 rounded-full ${useRealAI ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <h3 className={`font-semibold ${useRealAI ? 'text-green-900' : 'text-gray-700'}`}>
                    {useRealAI ? 'AI Connected' : 'NO AI — Simulated Scoring'}
                  </h3>
                </div>
                <p className={`text-sm ${useRealAI ? 'text-green-800' : 'text-gray-600'}`}>
                  {useRealAI
                    ? 'Your summaries will be strictly scored using OpenAI GPT-5 Mini, with a 350-token output cap per request.'
                    : 'The demo can continue with a clearly labeled keyword-overlap estimate. Connect your OpenAI API key for genuine comprehension scoring.'}
                </p>
              </div>

              {/* API Key Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  OpenAI API Key
                </label>
                <div className="flex gap-3">
                  <input
                    type="password"
                    value={openaiApiKey}
                    onChange={(e) => handleApiKeyChange(e.target.value)}
                    placeholder="sk-..."
                    className={`flex-1 px-4 py-3 rounded-2xl border-2 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 placeholder:text-gray-400 ${tutorialStep === 'api-key' ? 'border-yellow-500 ring-4 ring-yellow-200' : 'border-gray-300'}`}
                  />
                  {useRealAI && (
                    <Button
                      outline
                      onClick={handleRemoveApiKey}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Your key is stored locally in your browser and sent only through this app&apos;s scoring endpoint to OpenAI when you submit a summary.
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  How to get an API Key
                </h3>
                <ol className="text-blue-800 space-y-1 text-sm list-decimal list-inside">
                  <li>Go to <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline font-medium">platform.openai.com/api-keys</a></li>
                  <li>Sign in or create an OpenAI account</li>
                  <li>Click “Create new secret key”</li>
                  <li>Copy the key and paste it above</li>
                </ol>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <Button outline onClick={handleCloseSettings}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onClick={handleSaveApiKey}
                  disabled={!openaiApiKey.trim()}
                  className={`min-w-[120px] ${tutorialStep === 'save' ? 'ring-4 ring-yellow-400 ring-offset-4 animate-pulse' : ''}`}
                >
                  Save & Connect
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
