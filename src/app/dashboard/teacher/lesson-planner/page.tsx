"use client"

import { useState, useEffect } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { format } from 'date-fns'
import { useToast } from '@/components/ui/use-toast'
import { AIAssistantPanel } from '@/components/ai/AIAssistantPanel'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar as CalendarIcon, Plus, Loader2 } from "lucide-react"
import { createLessonForm } from "@/lib/actions/lesson-actions"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {pending ? 'Creating...' : 'Create Lesson Plan'}
    </Button>
  )
}

type AISuggestion = {
  title: string
  objectives: string[]
  activities: string[]
  resources: string[]
}

export default function LessonPlannerPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [state, formAction] = useFormState(createLessonForm, { error: null })
  const [showAIPanel, setShowAIPanel] = useState(false)
  const { toast } = useToast()

  const applyAISuggestion = (suggestion: AISuggestion) => {
    const titleInput = document.getElementById('title') as HTMLInputElement
    const objectivesInput = document.getElementById('objectives') as HTMLTextAreaElement
    const activitiesInput = document.getElementById('activities') as HTMLTextAreaElement
    const resourcesInput = document.getElementById('resources') as HTMLTextAreaElement

    if (titleInput) titleInput.value = suggestion.title
    if (objectivesInput) objectivesInput.value = suggestion.objectives.join('\n')
    if (activitiesInput) activitiesInput.value = suggestion.activities.join('\n')
    if (resourcesInput) resourcesInput.value = suggestion.resources.join('\n')

    setShowAIPanel(false)
    toast({
      title: 'Success',
      description: 'AI suggestions applied to your lesson plan!',
    })
  }
  
  const subjects = [
    { id: 'math', name: 'Mathematics' },
    { id: 'science', name: 'Science' },
    { id: 'history', name: 'History' },
    { id: 'english', name: 'English' },
    { id: 'hindi', name: 'Hindi' },
    { id: 'telugu', name: 'Telugu' },
  ]
  
  const classes = [
    { id: '6a', name: 'Class 6A' },
    { id: '6b', name: 'Class 6B' },
    { id: '7a', name: 'Class 7A' },
    { id: '7b', name: 'Class 7B' },
    { id: '8a', name: 'Class 8A' },
    { id: '8b', name: 'Class 8B' },
    { id: '9a', name: 'Class 9A' },
    { id: '9b', name: 'Class 9B' },
    { id: '10a', name: 'Class 10A' },
    { id: '10b', name: 'Class 10B' },
  ]

  return (
    <div className="space-y-6 relative">
      <AIAssistantPanel
        isOpen={showAIPanel}
        onClose={() => setShowAIPanel(false)}
        onApply={applyAISuggestion}
        subjects={subjects}
        classes={classes}
      />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Lesson Planner</h2>
          <p className="text-muted-foreground">
            Create and manage your lesson plans
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setShowAIPanel(true)}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-600 hover:bg-blue-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v4" />
              <path d="m16.24 7.76 2.83-2.83" />
              <path d="M18 12h4" />
              <path d="m16.24 16.24 2.83 2.83" />
              <path d="M12 18v4" />
              <path d="m7.76 16.24-2.83 2.83" />
              <path d="M6 12H2" />
              <path d="m7.76 7.76-2.83-2.83" />
            </svg>
            AI Assistant
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Lesson Plan
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Create New Lesson Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  name="title"
                  placeholder="Enter lesson title" 
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject_id">Subject</Label>
                  <select 
                    id="subject_id"
                    name="subject_id"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Select subject</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class_id">Class</Label>
                  <select 
                    id="class_id"
                    name="class_id"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Select class</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <div className="relative">
                  <Input 
                  type="date" 
                  name="date"
                  className="pl-10" 
                  value={date ? format(date, 'yyyy-MM-dd') : ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    setDate(e.target.value ? new Date(e.target.value) : undefined)
                  }
                  required
                />
                  <CalendarIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="objectives">Learning Objectives</Label>
                <Textarea
                  id="objectives"
                  placeholder="Enter learning objectives (one per line)"
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="activities">Activities</Label>
                <Textarea
                  id="activities"
                  name="activities"
                  placeholder="Describe the activities for this lesson"
                  className="min-h-[100px]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resources">Resources</Label>
                <Textarea
                  id="resources"
                  name="resources"
                  placeholder="List any resources needed for this lesson"
                  className="min-h-[80px]"
                  required
                />
              </div>
              <div className="pt-4">
                <SubmitButton />
              </div>
            </form>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Lessons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="font-medium">Introduction to Algebra</div>
                  <div className="text-sm text-muted-foreground">
                    Class 9A - Mathematics
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Tomorrow, 9:00 AM - 10:00 AM
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="font-medium">The French Revolution</div>
                  <div className="text-sm text-muted-foreground">
                    Class 8B - History
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Friday, 11:00 AM - 12:00 PM
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>AI Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Need help creating a lesson plan? Let our AI assistant help you generate engaging content.
                </p>
                <Button variant="outline" className="w-full">
                  Generate with AI
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
