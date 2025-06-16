
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MessageSquare, Clock, CheckCircle, Save } from 'lucide-react';
import { format } from 'date-fns';

interface UserQuestion {
  id: string;
  question: string;
  answer: string | null;
  status: string;
  created_at: string;
  user_id: string;
}

export function AdminQuestions() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');

  const { data: questions, isLoading } = useQuery({
    queryKey: ['admin-questions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_questions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, answer }: { id: string; answer: string }) => {
      const { error } = await supabase
        .from('user_questions')
        .update({
          answer,
          status: 'answered',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-questions'] });
      toast.success('Answer saved successfully');
      setEditingId(null);
      setAnswerText('');
    },
    onError: (error) => {
      toast.error('Failed to save answer');
      console.error(error);
    },
  });

  const handleEdit = (question: UserQuestion) => {
    setEditingId(question.id);
    setAnswerText(question.answer || '');
  };

  const handleSave = () => {
    if (editingId && answerText.trim()) {
      updateMutation.mutate({ id: editingId, answer: answerText.trim() });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'answered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Questions</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
          <MessageSquare className="h-4 w-4" />
          <span>{questions?.length || 0} total questions</span>
        </div>
      </div>

      <div className="grid gap-4">
        {questions?.map((question) => (
          <Card key={question.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{question.question}</CardTitle>
                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{format(new Date(question.created_at), 'MMM d, yyyy')}</span>
                    </div>
                    <Badge className={getStatusColor(question.status)}>
                      {question.status}
                    </Badge>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(question)}
                  className="ml-4"
                >
                  {question.answer ? 'Edit Answer' : 'Add Answer'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {question.answer && (
                <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">
                    Current Answer:
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {question.answer}
                  </p>
                </div>
              )}

              {editingId === question.id && (
                <div className="space-y-3">
                  <Textarea
                    placeholder="Enter your answer..."
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleSave}
                      disabled={updateMutation.isPending || !answerText.trim()}
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Answer
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingId(null);
                        setAnswerText('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {questions?.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
            No questions yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            User questions will appear here when they start asking
          </p>
        </div>
      )}
    </div>
  );
}
