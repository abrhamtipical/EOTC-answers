
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import faqData from '@/data/faq.json';

export function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openSections, setOpenSections] = useState<string[]>([]);
  const navigate = useNavigate();

  const filteredFAQs = faqData.filter(faq =>
    faq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.subtopics.some(subtopic =>
      subtopic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subtopic.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const toggleSection = (id: string) => {
    setOpenSections(prev =>
      prev.includes(id)
        ? prev.filter(sectionId => sectionId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-amber-800 dark:text-amber-100">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Find answers to common questions about Orthodox faith and practice
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search FAQ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/80 dark:bg-slate-800/80 border-amber-200 dark:border-slate-600"
        />
      </div>

      <div className="space-y-4">
        {filteredFAQs.map(faq => (
          <Card key={faq.id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-amber-200 dark:border-slate-600">
            <Collapsible
              open={openSections.includes(faq.id)}
              onOpenChange={() => toggleSection(faq.id)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-amber-50 dark:hover:bg-slate-700/50 transition-colors">
                  <CardTitle className="flex items-center justify-between text-amber-800 dark:text-amber-100">
                    <span className="flex items-center space-x-2">
                      <HelpCircle className="h-5 w-5" />
                      <span>{faq.title}</span>
                    </span>
                    <ChevronDown 
                      className={`h-5 w-5 transition-transform ${
                        openSections.includes(faq.id) ? 'rotate-180' : ''
                      }`}
                    />
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {faq.subtopics.map(subtopic => (
                      <div
                        key={subtopic.id}
                        onClick={() => navigate(`/faq/${subtopic.id}`)}
                        className="p-4 bg-amber-50 dark:bg-slate-700/50 rounded-lg cursor-pointer hover:bg-amber-100 dark:hover:bg-slate-600/50 transition-colors"
                      >
                        <h4 className="font-medium text-amber-800 dark:text-amber-100 mb-2">
                          {subtopic.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {subtopic.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      {filteredFAQs.length === 0 && (
        <div className="text-center py-12">
          <HelpCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
            No FAQs found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search terms
          </p>
        </div>
      )}
    </div>
  );
}
