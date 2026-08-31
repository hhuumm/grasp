import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { aiRouter } from '@/lib/ai/ai-router'
import { AIError } from '@/lib/ai/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { passageText, summaryText, apiKey, passageId, aiConnectionId } = body

    // Check if this is a demo request (has apiKey) or authenticated request
    const isDemoMode = !!apiKey

    if (!isDemoMode) {
      // Authenticated mode - require user
      const user = await currentUser()
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      if (!passageId || !passageText || !summaryText || !aiConnectionId) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        )
      }
    } else {
      // Demo mode - just need passage and summary
      if (!passageText || !summaryText) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        )
      }
    }

    // Determine which API key to use
    const effectiveApiKey = isDemoMode ? apiKey : process.env.OPENAI_API_KEY

    if (!effectiveApiKey) {
      return NextResponse.json(
        { error: 'No API key available' },
        { status: 400 }
      )
    }

    // AI connection configuration
    const aiConnection = {
      id: aiConnectionId || 'demo',
      provider: 'openai' as const,
      model: 'gpt-4',
      apiKey: effectiveApiKey,
      endpoint: undefined,
    }

    const scoringRequest = {
      passage: passageText,
      summary: summaryText,
      provider: aiConnection,
    }

    const result = await aiRouter.scoreComprehension(scoringRequest)

    // Return the result
    return NextResponse.json({
      success: true,
      score: result.score,
      feedback: result.feedback,
      strengths: result.strengths,
      improvements: result.improvements,
    })
  } catch (error) {
    console.error('Score summary error:', error)

    if (error instanceof AIError) {
      return NextResponse.json(
        { 
          error: 'AI service error',
          message: error.message,
          provider: error.provider,
        },
        { status: error.statusCode || 500 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
