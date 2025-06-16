
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bookmark, Book, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function BookmarksPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // In a real app, this would fetch bookmarks from the database
  const bookmarks: any[] = [];

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-12">
          <Bookmark className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
            Sign in to save bookmarks
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Create an account to bookmark your favorite teachings and FAQ
          </p>
          <Button
            onClick={() => navigate('/auth')}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-amber-800 dark:text-amber-100">
          Your Bookmarks
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Keep track of your favorite teachings and answers
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-12">
          <Bookmark className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
            No bookmarks yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Start exploring and bookmark content you want to revisit
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => navigate('/teachings')}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              <Book className="h-4 w-4 mr-2" />
              Browse Teachings
            </Button>
            <Button
              onClick={() => navigate('/faq')}
              variant="outline"
              className="border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Browse FAQ
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {/* Bookmarks would be rendered here */}
        </div>
      )}
    </div>
  );
}
