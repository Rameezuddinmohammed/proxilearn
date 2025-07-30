'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

type LessonPlanData = {
  title: string
  subject_id: string
  class_id: string
  date: string
  objectives: string[]
  activities: string
  resources: string
  teacher_id: string
}

type FormState = {
  error: string | null
}

export async function createLessonForm(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = createClient()
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: 'You must be logged in to create a lesson plan' } as FormState
  }

  // Extract form data
  const lessonData: Omit<LessonPlanData, 'teacher_id'> = {
    title: formData.get('title') as string,
    subject_id: formData.get('subject_id') as string,
    class_id: formData.get('class_id') as string,
    date: formData.get('date') as string,
    objectives: (formData.get('objectives') as string).split('\n').filter(Boolean),
    activities: formData.get('activities') as string,
    resources: formData.get('resources') as string,
  }

  // Validate required fields
  if (!lessonData.title || !lessonData.subject_id || !lessonData.class_id || !lessonData.date) {
    return { error: 'Please fill in all required fields' } as FormState
  }

  // Insert into database
  const { data, error } = await supabase
    .from('lesson_plans')
    .insert([
      {
        ...lessonData,
        teacher_id: user.id,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error('Error creating lesson plan:', error)
    return { error: 'An unexpected error occurred.' } as FormState
  }

  // Revalidate the lesson plans page
  revalidatePath('/dashboard/teacher/lesson-planner')
  
  // Redirect to the new lesson plan
  // The redirect will be handled by the form action
  return { error: null }
}

export async function getTeacherLessonPlans() {
  const supabase = createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    throw new Error('You must be logged in to view lesson plans')
  }

  const { data: lessonPlans, error } = await supabase
    .from('lesson_plans')
    .select(`
      *,
      subjects (name),
      classes (name, section)
    `)
    .eq('teacher_id', user.id)
    .order('date', { ascending: true })

  if (error) {
    console.error('Error fetching lesson plans:', error)
    throw new Error('Failed to fetch lesson plans')
  }

  return lessonPlans
}

export async function getUpcomingLessons(limit = 5) {
  const supabase = createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    throw new Error('You must be logged in to view upcoming lessons')
  }

  const { data: lessonPlans, error } = await supabase
    .from('lesson_plans')
    .select(`
      *,
      subjects (name),
      classes (name, section)
    `)
    .eq('teacher_id', user.id)
    .gte('date', new Date().toISOString())
    .order('date', { ascending: true })
    .limit(limit)

  if (error) {
    console.error('Error fetching upcoming lessons:', error)
    throw new Error('Failed to fetch upcoming lessons')
  }

  return lessonPlans
}
