import { AIService, ScoringRequest, ScoringResponse, AIError, AIProvider } from './types'

type LocalAIResponse = {
  response?: string
  choices?: Array<{ message?: { content?: string } }>
  content?: string
}

export class LocalAIService implements AIService {
  async scoreComprehension(request: ScoringRequest): Promise<ScoringResponse> {
    const { passage, summary, provider } = request

    if (!provider.endpoint) {
      throw new AIError('Endpoint URL is required for local AI service', 'local')
    }

    const prompt = this.createScoringPrompt(passage, summary)

    try {
      // Handle different local AI endpoints (Ollama, LM Studio, etc.)
      const payload = this.createPayload(provider, prompt)
      
      const response = await fetch(provider.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new AIError(
          `Local AI service error: ${response.status} ${response.statusText}`,
          'local',
          response.status
        )
      }

      const data = await response.json()
      const content = this.extractContent(data)

      if (!content) {
        throw new AIError('No response content from local AI service', 'local')
      }

      return this.parseResponse(content)
    } catch (error) {
      if (error instanceof AIError) {
        throw error
      }
      throw new AIError(
        `Failed to connect to local AI service: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'local'
      )
    }
  }

  private createScoringPrompt(passage: string, summary: string): string {
    return `You are an expert reading comprehension evaluator. Please evaluate this summary on a scale of 0-100.

ORIGINAL PASSAGE:
${passage}

STUDENT SUMMARY:
${summary}

Please provide your evaluation in JSON format:
{
  "score": [number between 0-100],
  "feedback": "[detailed feedback]",
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"]
}

Evaluation criteria:
- Accuracy: Does the summary capture the main ideas correctly?
- Completeness: Are all important points included?
- Clarity: Is the summary well-written and easy to understand?
- Conciseness: Is the summary appropriately concise?`
  }

  private createPayload(provider: AIProvider, prompt: string): Record<string, unknown> {
    // Handle different local AI service formats
    if (provider.endpoint?.includes('ollama')) {
      return {
        model: provider.model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.3,
          top_p: 0.9,
        }
      }
    }
    
    // Default format (works with many local services)
    return {
      model: provider.model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    }
  }

  private extractContent(data: unknown): string {
    if (typeof data === 'string') {
      return data
    }

    if (!data || typeof data !== 'object') {
      return ''
    }

    const response = data as LocalAIResponse

    // Handle different response formats
    if (response.response) {
      return response.response // Ollama format
    }
    
    if (response.choices?.[0]?.message?.content) {
      return response.choices[0].message.content // OpenAI-compatible format
    }
    
    if (response.content) {
      return response.content
    }
    
    return JSON.stringify(response)
  }

  private parseResponse(content: string): ScoringResponse {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }

      const parsed = JSON.parse(jsonMatch[0])
      
      return {
        score: Math.max(0, Math.min(100, parsed.score || 0)),
        feedback: parsed.feedback || 'No feedback provided',
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
      }
    } catch {
      // Fallback: try to extract score and feedback manually
      const scoreMatch = content.match(/score[:\s]*(\d+)/i)
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 50

      return {
        score: Math.max(0, Math.min(100, score)),
        feedback: content.length > 500 ? content.substring(0, 500) + '...' : content,
        strengths: [],
        improvements: [],
      }
    }
  }
}
