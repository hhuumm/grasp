'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Send, Clock } from 'lucide-react'
import Link from 'next/link'

// Mock data - will be replaced with real data from database
const mockPassages: Record<string, {
  id: string
  text: string
  source: string
  difficulty: string
  tags: string[]
  createdAt: Date
}> = {
  '1': {
    id: '1',
    text: `The rapid advancement of artificial intelligence has transformed various industries, from healthcare to finance, and continues to reshape how we work and live. Machine learning algorithms can now process vast amounts of data in seconds, identifying patterns that would take humans years to discover.

In healthcare, AI systems assist doctors in diagnosing diseases more accurately and quickly than ever before. These systems can analyze medical images, predict patient outcomes, and even suggest treatment plans. For instance, AI-powered diagnostic tools can detect early signs of cancer in medical scans with remarkable precision.

The financial sector has also embraced AI technology. Banks use machine learning to detect fraudulent transactions, assess credit risks, and provide personalized financial advice to customers. Algorithmic trading systems can execute thousands of transactions per second, responding to market changes faster than any human trader.

However, the rise of AI also brings challenges. Concerns about job displacement, privacy, and the ethical use of AI systems are growing. As AI becomes more sophisticated, society must address these issues to ensure that the benefits of artificial intelligence are shared equitably while minimizing potential risks.

The future of AI holds immense promise, but it requires careful consideration of its implications for humanity. As we continue to develop more advanced AI systems, we must balance innovation with responsibility, ensuring that artificial intelligence serves as a tool for human progress rather than a source of division or harm.`,
    source: 'Tech Weekly',
    difficulty: 'intermediate',
    tags: ['technology', 'AI', 'society'],
    createdAt: new Date('2024-01-15'),
  },
}

export default function PassagePage() {
  const params = useParams()
  const router = useRouter()
  const [summary, setSummary] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startTime] = useState(Date.now())
  
  const passage = mockPassages[params.id as string]
  
  if (!passage) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Passage not found</h1>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </Layout>
    )
  }

  const handleSubmit = async () => {
    if (!summary.trim()) return
    
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // In real implementation, this would call the AI scoring API
    console.log('Submitting summary:', summary)
    
    setIsSubmitting(false)
    router.push('/dashboard')
  }

  const readingTime = Math.floor((Date.now() - startTime) / 1000)

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            {Math.floor(readingTime / 60)}:{(readingTime % 60).toString().padStart(2, '0')}
          </div>
        </div>

        {/* Passage Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Reading Comprehension</CardTitle>
                <CardDescription>Source: {passage.source}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge color={passage.difficulty === 'beginner' ? 'success' : passage.difficulty === 'intermediate' ? 'warning' : 'error'}>
                  {passage.difficulty}
                </Badge>
                {passage.tags.map((tag) => (
                  <Badge key={tag} color="zinc">{tag}</Badge>
                ))}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Passage Text */}
        <Card>
          <CardHeader>
            <CardTitle>Passage</CardTitle>
            <CardDescription>Read the following text carefully and then write a summary below.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              {passage.text.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Summary Input */}
        <Card>
          <CardHeader>
            <CardTitle>Your Summary</CardTitle>
            <CardDescription>
              Write a comprehensive summary of the passage above. Include the main points and key details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Write your summary here..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="min-h-[200px]"
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {summary.length} characters
              </span>
              <Button 
                onClick={handleSubmit}
                disabled={!summary.trim() || isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Summary
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
