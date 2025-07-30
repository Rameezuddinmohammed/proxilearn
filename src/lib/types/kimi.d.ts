export interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatCompletionRequest {
  model: string
  messages: Message[]
  temperature?: number
  max_tokens?: number
}

export interface ChatCompletionResponse {
  id: string
  object: string
  created: number
  model: string
  choices: {
    index: number
    message: Message
    finish_reason: string
  }[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface LessonPlanSuggestion {
  title: string
  objectives: string[]
  activities: string[]
  resources: string[]
}
}
