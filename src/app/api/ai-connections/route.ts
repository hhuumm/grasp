import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { encrypt } from '@/lib/encryption'

export async function GET() {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // In a real implementation, fetch from database
    const mockConnections = [
      {
        id: '1',
        userId: user.id,
        provider: 'openai',
        model: 'gpt-4',
        endpoint: null,
        createdAt: new Date('2024-01-10'),
      },
    ]

    return NextResponse.json({ connections: mockConnections })
  } catch (error) {
    console.error('Get AI connections error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { provider, model, apiKey, endpoint } = body

    if (!provider || !model) {
      return NextResponse.json(
        { error: 'Provider and model are required' },
        { status: 400 }
      )
    }

    // Encrypt API key if provided
    let encryptedApiKey = null
    if (apiKey) {
      try {
        encryptedApiKey = encrypt(apiKey)
      } catch {
        return NextResponse.json(
          { error: 'Failed to encrypt API key' },
          { status: 500 }
        )
      }
    }

    // In a real implementation, save to database
    const newConnection = {
      id: Date.now().toString(),
      userId: user.id,
      provider,
      model,
      apiKey: encryptedApiKey,
      endpoint,
      createdAt: new Date(),
    }

    return NextResponse.json({
      success: true,
      connection: {
        ...newConnection,
        apiKey: undefined, // Don't return the encrypted key
      },
    })
  } catch (error) {
    console.error('Create AI connection error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const connectionId = searchParams.get('id')

    if (!connectionId) {
      return NextResponse.json(
        { error: 'Connection ID is required' },
        { status: 400 }
      )
    }

    // In a real implementation, delete from database
    // Make sure to verify the connection belongs to the current user

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete AI connection error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
