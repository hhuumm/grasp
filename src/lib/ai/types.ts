export interface AIProvider {
  provider: string
  model: string
  apiKey?: string
  endpoint?: string
}

export interface ScoringRequest {
  passage: string
  summary: string
  provider: AIProvider
}

export interface ScoringResponse {
  score: number // 0-100
  feedback: string
  strengths?: string[]
  improvements?: string[]
}

export interface AIService {
  scoreComprehension(request: ScoringRequest): Promise<ScoringResponse>
}

export class AIError extends Error {
  constructor(
    message: string,
    public provider: string,
    public statusCode?: number
  ) {
    super(message)
    this.name = 'AIError'
  }
}
