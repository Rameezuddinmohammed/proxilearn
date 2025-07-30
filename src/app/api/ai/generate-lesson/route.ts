import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { generateLessonPlan } from '@/lib/ai/kimi';
import { createClient } from '@/lib/supabase/server';

export const maxDuration = 30; // Allow up to 30 seconds for the AI to respond

export async function POST(request: Request) {
  try {
    const { topic, grade, subject, learningStyle, duration } = await request.json();
    
    // Verify user is authenticated
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate required fields
    if (!topic || !grade || !subject) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate the lesson plan using Kimi K2 API
    const lessonPlan = await generateLessonPlan({
      topic,
      grade,
      subject,
      learningStyle,
      duration: duration || 45,
    });

    // Log the lesson plan generation in the database
    try {
      const supabase = createClient();
      await supabase.from('ai_usage_logs').insert([
        {
          user_id: userId,
          action: 'generate_lesson_plan',
          metadata: {
            topic,
            grade,
            subject,
            learning_style: learningStyle,
            duration: duration || 45,
          },
        },
      ]);
    } catch (dbError) {
      console.error('Error logging AI usage:', dbError);
      // Don't fail the request if logging fails
    }

    return NextResponse.json(lessonPlan);
  } catch (error) {
    console.error('Error generating lesson plan:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate lesson plan',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
