
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Book, HelpCircle, Star, Users, MessageSquare, Sparkles, Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch recent teachings
  const { data: recentTeachings } = useQuery({
    queryKey: ['recent-teachings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teachings')
        .select('id, title, category, read_time')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch recent FAQs
  const { data: recentFaqs } = useQuery({
    queryKey: ['recent-faqs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('faqs')
        .select('id, subject, question')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });

  const handleQuestionSubmit = async () => {
    if (!question.trim()) {
      toast.error('Please enter a question');
      return;
    }

    if (!user) {
      toast.error('Please sign in to ask a question');
      navigate('/auth');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('user_questions')
        .insert({
          user_id: user.id,
          question: question.trim(),
          status: 'pending'
        });

      if (error) throw error;

      // Call edge function to get AI response
      const { data: aiResponse, error: aiError } = await supabase.functions.invoke('answer-question', {
        body: { question: question.trim() }
      });

      if (!aiError && aiResponse?.answer) {
        // Update the question with AI answer
        await supabase
          .from('user_questions')
          .update({ 
            answer: aiResponse.answer,
            status: 'answered'
          })
          .eq('user_id', user.id)
          .eq('question', question.trim());
      }

      toast.success('Question submitted successfully!');
      setQuestion('');
    } catch (error) {
      console.error('Error submitting question:', error);
      toast.error('Failed to submit question');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-8">
        <div className="w-20 h-20 mx-auto text-amber-600 dark:text-amber-400">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
            <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="1" fill="none"/>
          </svg>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-amber-800 dark:text-amber-100 mb-2">
            Welcome to EOTC Answers
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore the rich teachings and traditions of the Ethiopian Orthodox Tewahedo Church. 
            Find answers to your spiritual questions with our AI-powered assistant.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="text-center">
            <Book className="h-8 w-8 mx-auto mb-2 text-amber-600" />
            <p className="text-2xl font-bold text-amber-800 dark:text-amber-100">
              {recentTeachings?.length || 0}+
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Teachings</p>
          </div>
          <div className="text-center">
            <HelpCircle className="h-8 w-8 mx-auto mb-2 text-amber-600" />
            <p className="text-2xl font-bold text-amber-800 dark:text-amber-100">
              {recentFaqs?.length || 0}+
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">FAQs</p>
          </div>
          <div className="text-center">
            <Sparkles className="h-8 w-8 mx-auto mb-2 text-amber-600" />
            <p className="text-2xl font-bold text-amber-800 dark:text-amber-100">AI</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Assistant</p>
          </div>
          <div className="text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-amber-600" />
            <p className="text-2xl font-bold text-amber-800 dark:text-amber-100">24/7</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Available</p>
          </div>
        </div>
      </div>

      {/* Ask AI Question Section */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-700 border-amber-200 dark:border-slate-600">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-amber-800 dark:text-amber-100">
            <MessageSquare className="h-6 w-6" />
            <span>Ask Our AI Assistant</span>
            <Sparkles className="h-5 w-5 text-amber-500" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Have a question about Orthodox faith, traditions, or theology? Our AI assistant is here to help you find answers rooted in EOTC teachings.
          </p>
          <div className="space-y-3">
            <Textarea
              placeholder="Ask about Orthodox faith, fasting, prayer, theology, or any spiritual question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[100px] border-amber-200 dark:border-slate-600 focus:border-amber-500"
            />
            <Button 
              onClick={handleQuestionSubmit}
              disabled={isSubmitting || !question.trim()}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Getting Answer...
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Ask Question
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-amber-200 dark:border-slate-600 hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-amber-800 dark:text-amber-100">
              <Book className="h-6 w-6" />
              <span>Sacred Teachings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Discover profound spiritual teachings and theological insights from the Ethiopian Orthodox Tewahedo Church
            </p>
            {recentTeachings && recentTeachings.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-2">Recent teachings:</p>
                <div className="space-y-1">
                  {recentTeachings.slice(0, 2).map((teaching) => (
                    <div key={teaching.id} className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {teaching.title} ({teaching.read_time})
                    </div>
                  ))}
                </div>
              </div>
            )}
            <Button 
              onClick={() => navigate('/teachings')}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            >
              Explore Teachings
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-amber-200 dark:border-slate-600 hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-amber-800 dark:text-amber-100">
              <HelpCircle className="h-6 w-6" />
              <span>Frequently Asked</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Find answers to common questions about Orthodox faith, practices, and traditions
            </p>
            {recentFaqs && recentFaqs.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-2">Popular questions:</p>
                <div className="space-y-1">
                  {recentFaqs.slice(0, 2).map((faq) => (
                    <div key={faq.id} className="text-xs text-gray-500 dark:text-gray-400">
                      • {faq.question}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <Button 
              onClick={() => navigate('/faq')}
              variant="outline"
              className="w-full border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
            >
              Browse FAQ
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* User Dashboard */}
      {user && (
        <Card className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-slate-700 dark:to-slate-600 border-amber-300 dark:border-slate-500">
          <CardHeader>
            <CardTitle className="text-amber-800 dark:text-amber-100 flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Welcome back, {user.email?.split('@')[0]}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
              <div>
                <Star className="h-8 w-8 mx-auto mb-2 text-amber-600" />
                <p className="text-sm font-medium">Bookmarks</p>
                <p className="text-2xl font-bold text-amber-800 dark:text-amber-100">0</p>
              </div>
              <div>
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-amber-600" />
                <p className="text-sm font-medium">Progress</p>
                <p className="text-2xl font-bold text-amber-800 dark:text-amber-100">0%</p>
              </div>
              <div className="col-span-2 md:col-span-1">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 text-amber-600" />
                <p className="text-sm font-medium">Questions Asked</p>
                <p className="text-2xl font-bold text-amber-800 dark:text-amber-100">-</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
