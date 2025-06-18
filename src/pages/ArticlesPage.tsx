
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Book, Clock, Search, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

export function ArticlesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const { data: articles, isLoading } = useQuery({
    queryKey: ['articles', language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const categories = ['all', ...new Set(articles?.map(a => a.category) || [])];
  
  const filteredArticles = articles?.filter(article => {
    const title = language === 'am' ? (article.title_am || article.title) : article.title;
    const excerpt = language === 'am' ? (article.excerpt_am || article.excerpt) : article.excerpt;
    
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (excerpt && excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         article.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 mx-auto mb-4 border-2 border-amber-600 border-t-transparent rounded-full"></div>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-amber-800 dark:text-amber-100">
          {t('nav.articles')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {language === 'am' ? 'የተወጣጣ ጽሑፎችን እና ምሁራዊ ሀሳቦችን ያግኙ' : 'Discover theological articles and scholarly insights'}
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={language === 'am' ? 'ጽሑፎችን ፈልግ...' : 'Search articles...'}
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
              {category === 'all' ? (language === 'am' ? 'ሁሉም ምድቦች' : 'All Categories') : category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map(article => {
          const title = language === 'am' ? (article.title_am || article.title) : article.title;
          const excerpt = language === 'am' ? (article.excerpt_am || article.excerpt) : article.excerpt;
          
          return (
            <Card 
              key={article.id}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-amber-200 dark:border-slate-600 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => navigate(`/articles/${article.id}`)}
            >
              {article.cover_image && (
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img 
                    src={article.cover_image} 
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {article.category}
                  </Badge>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(article.created_at).toLocaleDateString(language === 'am' ? 'am-ET' : 'en-US')}
                  </div>
                </div>
                <CardTitle className="text-amber-800 dark:text-amber-100 line-clamp-2">
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {excerpt && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                    {excerpt}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Book className="h-3 w-3" />
                    <span>{t('common.read_more')}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {article.tags.slice(0, 3).map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <Book className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
            {language === 'am' ? 'ምንም ጽሑፍ አልተገኘም' : 'No articles found'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {language === 'am' ? 'የፍለጋ ቃላትዎን ይለውጡ' : 'Try adjusting your search terms'}
          </p>
        </div>
      )}
    </div>
  );
}
