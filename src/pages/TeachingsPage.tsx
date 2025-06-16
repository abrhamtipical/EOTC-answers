
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Book, Clock, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function TeachingsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  const { data: teachings, isLoading } = useQuery({
    queryKey: ['teachings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teachings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const categories = ['all', ...new Set(teachings?.map(t => t.category) || [])];
  
  const filteredTeachings = teachings?.filter(teaching => {
    const matchesSearch = teaching.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teaching.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teaching.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || teaching.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 mx-auto mb-4 border-2 border-amber-600 border-t-transparent rounded-full"></div>
          <p>Loading teachings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-amber-800 dark:text-amber-100">
          Sacred Teachings
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Explore the profound wisdom of the Ethiopian Orthodox Tewahedo Church
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search teachings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/80 dark:bg-slate-800/80 border-amber-200 dark:border-slate-600"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category 
                ? "bg-amber-600 hover:bg-amber-700 text-white" 
                : "border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
              }
            >
              {category === 'all' ? 'All Categories' : category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachings.map(teaching => (
          <Card 
            key={teaching.id}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-amber-200 dark:border-slate-600 hover:shadow-lg transition-all cursor-pointer"
            onClick={() => navigate(`/teachings/${teaching.id}`)}
          >
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant="secondary" className="text-xs">
                  {teaching.category}
                </Badge>
                <Badge className={getDifficultyColor(teaching.difficulty)}>
                  {teaching.difficulty}
                </Badge>
              </div>
              <CardTitle className="text-amber-800 dark:text-amber-100 line-clamp-2">
                {teaching.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                {teaching.description}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{teaching.read_time}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Book className="h-3 w-3" />
                  <span>Read More</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-3">
                {teaching.tags.slice(0, 3).map((tag: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTeachings.length === 0 && (
        <div className="text-center py-12">
          <Book className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
            No teachings found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search terms or category filter
          </p>
        </div>
      )}
    </div>
  );
}
