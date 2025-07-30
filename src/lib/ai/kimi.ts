import { 
  Message, 
  ChatCompletionRequest, 
  ChatCompletionResponse, 
  LessonPlanSuggestion 
} from '@/lib/types/kimi'

const KIMI_API_URL = 'https://api.kimi.com/v1/chat/completions'

/**
 * Generate a lesson plan using Kimi K2 API
 */
export async function generateLessonPlan(params: {
  topic: string
  grade: string
  subject: string
  learningStyle?: string
  duration?: number
}): Promise<LessonPlanSuggestion> {
  const { topic, grade, subject, learningStyle = 'mixed', duration = 45 } = params

  const systemPrompt = `You are an expert educational content creator. Generate a detailed lesson plan for a ${grade} ${subject} class about "${topic}".
  
  The lesson plan should include:
  1. A clear, engaging title
  2. 3-5 specific learning objectives
  3. 4-6 engaging activities with time allocations
  4. 3-5 relevant resources
  
  Format the response as a JSON object with these exact keys: {"title": string, "objectives": string[], "activities": string[], "resources": string[]}`

  const messages: Message[] = [
    { role: 'system', content: systemPrompt },
    {
      role: 'user',
      content: `Create a ${duration}-minute lesson plan about ${topic} for ${grade} ${subject} class.`,
    },
  ]

  const response = await fetch(KIMI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.KIMI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'k2',
      messages,
      temperature: 0.7,
      max_tokens: 2000,
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    console.error('Kimi API error:', error)
    throw new Error(
      `Kimi API request failed with status ${response.status}: ${JSON.stringify(
        error
      )}`
    )
  }

  const data: ChatCompletionResponse = await response.json()
  const content = data.choices[0]?.message?.content

  if (!content) {
    throw new Error('No content returned from Kimi API')
  }

  try {
    // Try to parse the JSON response
    return JSON.parse(content) as LessonPlanSuggestion
  } catch (e) {
    console.error('Failed to parse Kimi API response:', content)
    throw new Error('Invalid response format from Kimi API')
  }
}
