import { AIService, ScoringRequest, ScoringResponse, AIError } from './types'
import { OpenAIService } from './openai-service'
import { LocalAIService } from './local-service'

export class AIRouter {
  private services: Map<string, AIService> = new Map()

  constructor() {
    this.services.set('openai', new OpenAIService())
    this.services.set('local', new LocalAIService())
    // Add more services as needed
    this.services.set('anthropic', new OpenAIService()) // Can use same service with different endpoint
  }

  async scoreComprehension(request: ScoringRequest): Promise<ScoringResponse> {
    const { provider } = request
    
    const service = this.services.get(provider.provider.toLowerCase())
    if (!service) {
      throw new AIError(`Unsupported AI provider: ${provider.provider}`, provider.provider)
    }

    try {
      return await service.scoreComprehension(request)
    } catch (error) {
      if (error instanceof AIError) {
        throw error
      }
      throw new AIError(
        `AI service error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        provider.provider
      )
    }
  }

  getSupportedProviders(): string[] {
    return Array.from(this.services.keys())
  }

  isProviderSupported(provider: string): boolean {
    return this.services.has(provider.toLowerCase())
  }
}

// Singleton instance
export const aiRouter = new AIRouter()
