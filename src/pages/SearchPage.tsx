
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Book, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import teachingsData from '@/data/teachings.json';
import faqData from '@/data/faq.json';

export function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return { teachings: [], faqs: [] };

    const term = searchTerm.toLowerCase();
    
    const teachings = teachingsData.filter(teaching =>
      teaching.title.toLowerCase().includes(term) ||
      teaching.description.toLowerCase().includes(term) ||
      teaching.category.toLowerCase().includes(term) ||
      teaching.tags.some(tag => tag.toLowerCase().includes(term))
    );

    const faqs = faqData.flatMap(faq =>
      faq.subtopics.filter(subtopic =>
        subtopic.title.toLowerCase().includes(term) ||
        subtopic.description.toLowerCase().includes(term) ||
        faq.title.toLowerCase().includes(term)
      ).map(subtopic => ({
        ...subtopic,
        parentTitle: faq.title
      }))
    );

    return { teachings, faqs };
  }, [searchTerm]);

  const totalResults = searchResults.teachings.length + searchResults.faqs.length;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-amber-800 dark:text-amber-100">
          Search
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Find teachings and answers across our content
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          placeholder="Search for teachings, FAQ, topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 h-12 text-lg bg-white/80 dark:bg-slate-800/80 border-amber-200 dark:border-slate-600"
          autoFocus
        />
      </div>

      {searchTerm.trim() && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {totalResults} result{totalResults !== 1 ? 's' : ''} found for "{searchTerm}"
        </div>
      )}

      {searchResults.teachings.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-amber-800 dark:text-amber-100 flex items-center space-x-2">
            <Book className="h-5 w-5" />
            <span>Teachings ({searchResults.teachings.length})</span>
          </h2>
          <div className="grid gap-4">
            {searchResults.teachings.map(teaching => (
              <Card
                key={teaching.id}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-amber-200 dark:border-slate-600 cursor-pointer hover:shadow-lg transition-all"
                onClick={() => navigate(`/teachings/${teaching.id}`)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {teaching.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {teaching.readTime}
                    </Badge>
                  </div>
                  <CardTitle className="text-amber-800 dark:text-amber-100">
                    {teaching.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                    {teaching.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {teaching.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {searchResults.faqs.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-amber-800 dark:text-amber-100 flex items-center space-x-2">
            <HelpCircle className="h-5 w-5" />
            <span>FAQ ({searchResults.faqs.length})</span>
          </h2>
          <div className="grid gap-4">
            {searchResults.faqs.map(faq => (
              <Card
                key={faq.id}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-amber-200 dark:border-slate-600 cursor-pointer hover:shadow-lg transition-all"
                onClick={() => navigate(`/faq/${faq.id}`)}
              >
                <CardHeader>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {faq.parentTitle}
                  </div>
                  <CardTitle className="text-amber-800 dark:text-amber-100">
                    {faq.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                    {faq.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {searchTerm.trim() && totalResults === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
            No results found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try different keywords or browse our categories
          </p>
        </div>
      )}

      {!searchTerm.trim() && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
            Start searching
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Enter keywords to find teachings and answers
          </p>
        </div>
      )}
    </div>
  );
}
