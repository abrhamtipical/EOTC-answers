
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BookOpen, Download, Search, Eye, FileText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

export function EbooksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { language, t } = useLanguage();

  const { data: ebooks, isLoading } = useQuery({
    queryKey: ['ebooks', language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ebooks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const categories = ['all', ...new Set(ebooks?.map(e => e.category).filter(Boolean) || [])];
  
  const filteredEbooks = ebooks?.filter(ebook => {
    const title = language === 'am' ? (ebook.title_am || ebook.title) : ebook.title;
    const description = language === 'am' ? (ebook.description_am || ebook.description) : ebook.description;
    
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (description && description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || ebook.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const handleDownload = async (ebook: any) => {
    try {
      // Increment download count
      await supabase
        .from('ebooks')
        .update({ download_count: (ebook.download_count || 0) + 1 })
        .eq('id', ebook.id);

      // In a real app, this would be a proper file download
      toast.success(language === 'am' ? 'የመጽሐፍ አውራድ ተጀመረ' : 'eBook download started');
    } catch (error) {
      toast.error(language === 'am' ? 'አውራድ ስህተት' : 'Download failed');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

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
          {t('nav.ebooks')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {language === 'am' ? 'ዲጂታል መጽሐፍቶችን እና ሃይማኖታዊ ቁሳቁሶችን ያግኙ' : 'Access digital books and religious materials'}
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={language === 'am' ? 'መጽሐፍቶችን ፈልግ...' : 'Search eBooks...'}
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
        {filteredEbooks.map(ebook => {
          const title = language === 'am' ? (ebook.title_am || ebook.title) : ebook.title;
          const description = language === 'am' ? (ebook.description_am || ebook.description) : ebook.description;
          
          return (
            <Card 
              key={ebook.id}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-amber-200 dark:border-slate-600 hover:shadow-lg transition-all"
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  {ebook.category && (
                    <Badge variant="secondary" className="text-xs">
                      {ebook.category}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs uppercase">
                    {ebook.file_type}
                  </Badge>
                </div>
                
                <div className="aspect-[3/4] bg-gradient-to-br from-amber-100 to-orange-100 dark:from-slate-700 dark:to-slate-600 rounded-lg flex items-center justify-center mb-3">
                  {ebook.cover_image ? (
                    <img 
                      src={ebook.cover_image} 
                      alt={title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <BookOpen className="h-16 w-16 text-amber-600" />
                  )}
                </div>
                
                <CardTitle className="text-amber-800 dark:text-amber-100 line-clamp-2">
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {description && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                    {description}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center space-x-3">
                    <span>{formatFileSize(ebook.file_size)}</span>
                    <span>{ebook.download_count || 0} {language === 'am' ? 'አውራዶች' : 'downloads'}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    {language === 'am' ? 'ዕይታ' : 'Preview'}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDownload(ebook)}
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    {t('common.download')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredEbooks.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
            {language === 'am' ? 'ምንም መጽሐፍ አልተገኘም' : 'No eBooks found'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {language === 'am' ? 'የፍለጋ ቃላትዎን ይለውጡ' : 'Try adjusting your search terms'}
          </p>
        </div>
      )}
    </div>
  );
}
