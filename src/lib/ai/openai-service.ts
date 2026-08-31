import { AIService, ScoringRequest, ScoringResponse, AIError } from './types'

export class OpenAIService implements AIService {
  async scoreComprehension(request: ScoringRequest): Promise<ScoringResponse> {
    const { passage, summary, provider } = request

    if (!provider.apiKey) {
      throw new AIError('API key is required for OpenAI', 'openai')
    }

    const prompt = this.createScoringPrompt(passage, summary)

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${provider.apiKey}`,
        },
        body: JSON.stringify({
          model: provider.model || 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert reading comprehension evaluator. Provide detailed, constructive feedback on summaries.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 1000,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new AIError(
          errorData.error?.message || `OpenAI API error: ${response.status}`,
          'openai',
          response.status
        )
      }

      const data = await response.json()
      const content = data.choices?.[0]?.message?.content

      if (!content) {
        throw new AIError('No response content from OpenAI', 'openai')
      }

      return this.parseResponse(content)
    } catch (error) {
      if (error instanceof AIError) {
        throw error
      }
      throw new AIError(
        `Failed to connect to OpenAI: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'openai'
      )
    }
  }

  private createScoringPrompt(passage: string, summary: string): string {
    return `Please evaluate this reading comprehension summary on a scale of 0-100.

ORIGINAL PASSAGE:
${passage}

STUDENT SUMMARY:
${summary}

Please provide your evaluation in the following JSON format:
{
  "score": [number between 0-100],
  "feedback": "[detailed feedback explaining the score]",
  "strengths": ["strength1", "strength2", ...],
  "improvements": ["improvement1", "improvement2", ...]
}

Evaluation criteria:
- Accuracy: Does the summary capture the main ideas correctly?
- Completeness: Are all important points included?
- Clarity: Is the summary well-written and easy to understand?
- Conciseness: Is the summary appropriately concise without losing key information?

Provide constructive feedback that helps the student improve their comprehension skills.`
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
