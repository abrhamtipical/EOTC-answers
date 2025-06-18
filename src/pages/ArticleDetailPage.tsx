
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Share2, Calendar, User } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

export function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', id],
    queryFn: async () => {
      if (!id) throw new Error('No article ID provided');
      
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .eq('status', 'published')
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

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

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          {language === 'am' ? 'ጽሑፍ አልተገኘም' : 'Article Not Found'}
        </h1>
        <Button onClick={() => navigate('/articles')}>
          {language === 'am' ? 'ወደ ጽሑፎች ተመለስ' : 'Back to Articles'}
        </Button>
      </div>
    );
  }

  const title = language === 'am' ? (article.title_am || article.title) : article.title;
  const content = language === 'am' ? (article.content_am || article.content) : article.content;

  const handleShare = () => {
    navigator.share?.({
      title: title,
      text: article.excerpt || '',
      url: window.location.href,
    }).catch(() => {
      navigator.clipboard.writeText(window.location.href);
      toast.success(language === 'am' ? 'አገናኝ ተቀድቷል!' : 'Link copied to clipboard!');
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/articles')}
          className="mb-4 text-amber-600 hover:text-amber-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {language === 'am' ? 'ወደ ጽሑፎች ተመለስ' : 'Back to Articles'}
        </Button>
        
        {article.cover_image && (
          <div className="aspect-video overflow-hidden rounded-lg mb-6">
            <img 
              src={article.cover_image} 
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{article.category}</Badge>
            {article.tags.map((tag: string, index: number) => (
              <Badge key={index} variant="outline">{tag}</Badge>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-amber-800 dark:text-amber-100">
              {title}
            </h1>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
            >
              <Share2 className="h-4 w-4 mr-1" />
              {language === 'am' ? 'አጋራ' : 'Share'}
            </Button>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(article.created_at).toLocaleDateString(language === 'am' ? 'am-ET' : 'en-US')}</span>
            </div>
          </div>
        </div>
      </div>

      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-amber-200 dark:border-slate-600">
        <CardContent className="p-8">
          <div 
            className="prose prose-amber dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
