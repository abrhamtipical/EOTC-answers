
import { Home, Book, HelpCircle, Bookmark } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Book, label: 'Teachings', path: '/teachings' },
    { icon: HelpCircle, label: 'FAQ', path: '/faq' },
    { icon: Bookmark, label: 'Saved', path: '/bookmarks' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-amber-200 dark:border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-around py-2">
          {navItems.map(({ icon: Icon, label, path }) => {
            const isActive = location.pathname === path;
            return (
              <Button
                key={path}
                variant="ghost"
                onClick={() => navigate(path)}
                className={`flex flex-col items-center space-y-1 p-2 h-auto ${
                  isActive
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
