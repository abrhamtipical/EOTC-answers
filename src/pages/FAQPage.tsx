
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, HelpCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: faqs, isLoading } = useQuery({
    queryKey: ['faqs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('subject', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  // Group FAQs by subject
  const groupedFaqs = faqs?.reduce((acc: any, faq) => {
    if (!acc[faq.subject]) {
      acc[faq.subject] = [];
    }
    acc[faq.subject].push(faq);
    return acc;
  }, {}) || {};

  const filteredSubjects = Object.keys(groupedFaqs).filter(subject =>
    subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    groupedFaqs[subject].some((faq: any) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 mx-auto mb-4 border-2 border-amber-600 border-t-transparent rounded-full"></div>
          <p>Loading FAQs...</p>
        </div>
      </div>
    );
  }

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
        {filteredSubjects.map(subject => (
          <Card key={subject} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-amber-200 dark:border-slate-600">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-800 dark:text-amber-100">
                <HelpCircle className="h-5 w-5" />
                <span>{subject}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {groupedFaqs[subject].map((faq: any) => (
                  <div key={faq.id} className="border-l-4 border-amber-200 pl-4">
                    <h4 className="font-medium text-amber-800 dark:text-amber-100 mb-2">
                      {faq.question}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSubjects.length === 0 && (
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
