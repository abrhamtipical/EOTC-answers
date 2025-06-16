
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, HelpCircle, Star, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto text-amber-600 dark:text-amber-400">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
            <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="1" fill="none"/>
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-amber-800 dark:text-amber-100">
          Welcome to EOTC Answers
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
          Explore the rich teachings and traditions of the Ethiopian Orthodox Tewahedo Church
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-amber-200 dark:border-slate-600">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-amber-800 dark:text-amber-100">
              <Book className="h-5 w-5" />
              <span>Sacred Teachings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Discover profound spiritual teachings and theological insights
            </p>
            <Button 
              onClick={() => navigate('/teachings')}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            >
              Explore Teachings
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-amber-200 dark:border-slate-600">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-amber-800 dark:text-amber-100">
              <HelpCircle className="h-5 w-5" />
              <span>Frequently Asked</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Find answers to common questions about our faith
            </p>
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

      {user && (
        <Card className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-slate-700 dark:to-slate-600 border-amber-300 dark:border-slate-500">
          <CardHeader>
            <CardTitle className="text-amber-800 dark:text-amber-100">
              Welcome back, {user.email}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <Star className="h-8 w-8 mx-auto mb-2 text-amber-600" />
                <p className="text-sm font-medium">Bookmarks</p>
                <p className="text-2xl font-bold text-amber-800 dark:text-amber-100">0</p>
              </div>
              <div>
                <Users className="h-8 w-8 mx-auto mb-2 text-amber-600" />
                <p className="text-sm font-medium">Progress</p>
                <p className="text-2xl font-bold text-amber-800 dark:text-amber-100">0%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
