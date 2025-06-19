import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Book, HelpCircle, Star, Users, MessageSquare, Sparkles, Clock, TrendingUp, ArrowRight, Zap, Shield, Heart } from 'lucide-react';
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
    <div className="container mx-auto px-4 py-6 space-y-12">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-amber-900/20 rounded-3xl"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-amber-200/30 to-orange-300/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-yellow-200/20 to-amber-300/20 rounded-full blur-3xl"></div>
        
        <div className="relative text-center space-y-8 p-12">
          {/* Animated Icon */}
          <div className="w-24 h-24 mx-auto text-amber-600 dark:text-amber-400 animate-pulse">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full opacity-20 animate-ping"></div>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full relative z-10">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
                <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="1" fill="none"/>
              </svg>
            </div>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-700 via-orange-600 to-yellow-600 bg-clip-text text-transparent mb-4">
              EOTC Answers
            </h1>
            <div className="space-y-2">
              <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 font-medium">
                Your Spiritual Journey Starts Here
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Explore the rich teachings and ancient wisdom of the Ethiopian Orthodox Tewahedo Church. 
                Get instant answers to your spiritual questions with our advanced AI assistant.
              </p>
            </div>
          </div>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div className="group text-center p-6 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-amber-200/50 dark:border-slate-600/50 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 mx-auto mb-3 text-amber-600 group-hover:scale-110 transition-transform duration-300">
                <Book className="w-full h-full" />
              </div>
              <p className="text-3xl font-bold text-amber-800 dark:text-amber-100 mb-1">
                {recentTeachings?.length || 0}+
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Sacred Teachings</p>
            </div>
            
            <div className="group text-center p-6 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-amber-200/50 dark:border-slate-600/50 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 mx-auto mb-3 text-amber-600 group-hover:scale-110 transition-transform duration-300">
                <HelpCircle className="w-full h-full" />
              </div>
              <p className="text-3xl font-bold text-amber-800 dark:text-amber-100 mb-1">
                {recentFaqs?.length || 0}+
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">FAQ Answered</p>
            </div>
            
            <div className="group text-center p-6 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-amber-200/50 dark:border-slate-600/50 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 mx-auto mb-3 text-amber-600 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-full h-full" />
              </div>
              <p className="text-3xl font-bold text-amber-800 dark:text-amber-100 mb-1">AI</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Powered</p>
            </div>
            
            <div className="group text-center p-6 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-amber-200/50 dark:border-slate-600/50 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 mx-auto mb-3 text-amber-600 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-full h-full" />
              </div>
              <p className="text-3xl font-bold text-amber-800 dark:text-amber-100 mb-1">24/7</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced AI Question Section */}
      <Card className="relative overflow-hidden border-0 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-800 dark:via-slate-700 dark:to-amber-900/20"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-200/20 to-orange-300/20 rounded-full blur-2xl"></div>
        
        <CardHeader className="relative">
          <CardTitle className="flex items-center space-x-3 text-2xl text-amber-800 dark:text-amber-100">
            <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-white">
              <MessageSquare className="h-6 w-6" />
            </div>
            <span>Ask Our AI Assistant</span>
            <Sparkles className="h-6 w-6 text-amber-500 animate-pulse" />
          </CardTitle>
        </CardHeader>
        <CardContent className="relative space-y-6 p-8">
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
            Have a question about Orthodox faith, traditions, or theology? Our advanced AI assistant 
            provides instant answers rooted in authentic EOTC teachings and centuries of wisdom.
          </p>
          
          <div className="space-y-4">
            <Textarea
              placeholder="Ask about Orthodox faith, fasting, prayer, theology, or any spiritual question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[120px] border-2 border-amber-200/50 dark:border-slate-600/50 focus:border-amber-500 dark:focus:border-amber-400 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-lg"
            />
            
            <Button 
              onClick={handleQuestionSubmit}
              disabled={isSubmitting || !question.trim()}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 hover:from-amber-700 hover:via-orange-700 hover:to-yellow-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="h-5 w-5 mr-3 animate-spin" />
                  Getting Divine Wisdom...
                </>
              ) : (
                <>
                  <MessageSquare className="h-5 w-5 mr-3" />
                  Ask Your Question
                  <ArrowRight className="h-5 w-5 ml-3" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Main Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-amber-50 to-orange-50 dark:from-slate-800 dark:via-slate-700 dark:to-amber-900/30"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200/30 to-orange-300/30 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
          
          <CardHeader className="relative">
            <CardTitle className="flex items-center space-x-3 text-xl text-amber-800 dark:text-amber-100">
              <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg text-white group-hover:scale-110 transition-transform duration-300">
                <Book className="h-6 w-6" />
              </div>
              <span>Sacred Teachings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative space-y-6">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Discover profound spiritual teachings and theological insights from the Ethiopian Orthodox Tewahedo Church
            </p>
            
            {recentTeachings && recentTeachings.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">Recent teachings:</p>
                <div className="space-y-2">
                  {recentTeachings.slice(0, 2).map((teaching) => (
                    <div key={teaching.id} className="flex items-center text-sm text-gray-500 dark:text-gray-400 p-2 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                      <Clock className="h-4 w-4 mr-2 text-amber-500" />
                      <span className="flex-1">{teaching.title}</span>
                      <span className="text-xs font-medium">({teaching.read_time})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <Button 
              onClick={() => navigate('/teachings')}
              className="w-full h-12 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Explore Teachings
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-slate-800 dark:via-slate-700 dark:to-blue-900/30"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-indigo-300/30 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
          
          <CardHeader className="relative">
            <CardTitle className="flex items-center space-x-3 text-xl text-blue-800 dark:text-blue-100">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg text-white group-hover:scale-110 transition-transform duration-300">
                <HelpCircle className="h-6 w-6" />
              </div>
              <span>Frequently Asked</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative space-y-6">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Find answers to common questions about Orthodox faith, practices, and traditions
            </p>
            
            {recentFaqs && recentFaqs.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">Popular questions:</p>
                <div className="space-y-2">
                  {recentFaqs.slice(0, 2).map((faq) => (
                    <div key={faq.id} className="text-sm text-gray-500 dark:text-gray-400 p-2 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                      • {faq.question}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <Button 
              onClick={() => navigate('/faq')}
              variant="outline"
              className="w-full h-12 border-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold rounded-xl transition-all duration-300"
            >
              Browse FAQ
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced User Dashboard */}
      {user && (
        <Card className="relative overflow-hidden border-0 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-100 via-orange-100 to-yellow-100 dark:from-slate-700 dark:via-slate-600 dark:to-amber-800/30"></div>
          <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-amber-300/20 to-orange-400/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-56 h-56 bg-gradient-to-tl from-yellow-300/20 to-amber-400/20 rounded-full blur-3xl"></div>
          
          <CardHeader className="relative">
            <CardTitle className="text-2xl text-amber-800 dark:text-amber-100 flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-white">
                <Heart className="h-6 w-6" />
              </div>
              <span>Welcome back, {user.email?.split('@')[0]}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
              <div className="group p-6 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 mx-auto mb-3 text-amber-600 group-hover:scale-110 transition-transform duration-300">
                  <Star className="w-full h-full" />
                </div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Bookmarks</p>
                <p className="text-3xl font-bold text-amber-800 dark:text-amber-100">0</p>
              </div>
              
              <div className="group p-6 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 mx-auto mb-3 text-amber-600 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-full h-full" />
                </div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Progress</p>
                <p className="text-3xl font-bold text-amber-800 dark:text-amber-100">0%</p>
              </div>
              
              <div className="group p-6 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 hover:scale-105 col-span-2 md:col-span-1">
                <div className="w-12 h-12 mx-auto mb-3 text-amber-600 group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="w-full h-full" />
                </div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Questions Asked</p>
                <p className="text-3xl font-bold text-amber-800 dark:text-amber-100">-</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
