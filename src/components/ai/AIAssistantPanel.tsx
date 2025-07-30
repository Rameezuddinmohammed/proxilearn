import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';

type AISuggestion = {
  title: string;
  objectives: string[];
  activities: string[];
  resources: string[];
  isLoading: boolean;
  error?: string | null;
};

type Subject = {
  id: string;
  name: string;
};

type Class = {
  id: string;
  name: string;
};

type AIAssistantPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  onApply: (suggestion: Omit<AISuggestion, 'isLoading' | 'error'>) => void;
  subjects: Subject[];
  classes: Class[];
};

export function AIAssistantPanel({
  isOpen,
  onClose,
  onApply,
  subjects,
  classes,
}: AIAssistantPanelProps) {
  const [aiPrompt, setAiPrompt] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAIContent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!aiPrompt || !selectedGrade || !selectedSubject) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiPrompt,
          grade: selectedGrade,
          subject: selectedSubject,
          learningStyle: 'mixed',
          duration: 45,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate content');

      const data = await response.json();
      onApply({
        title: data.title,
        objectives: data.objectives || [],
        activities: data.activities || [],
        resources: data.resources || [],
      });
    } catch (err) {
      console.error('Error generating content:', err);
      setError('Failed to generate content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            AI Lesson Plan Assistant
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={generateAIContent} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              What topic would you like to teach?
            </label>
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="E.g., Introduction to Photosynthesis"
              required
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade/Class
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
                disabled={isLoading}
              >
                <option value="">Select Grade</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.name}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
                disabled={isLoading}
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.name}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
