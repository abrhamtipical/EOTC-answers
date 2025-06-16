
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Share2, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import faqData from '@/data/faq.json';

export function FAQDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  let faqItem: any = null;
  let parentFAQ: any = null;
  
  for (const faq of faqData) {
    const subtopic = faq.subtopics.find(s => s.id === id);
    if (subtopic) {
      faqItem = subtopic;
      parentFAQ = faq;
      break;
    }
  }
  
  if (!faqItem) {
    return (
      <div className="container mx-auto px-4 py-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          FAQ Not Found
        </h1>
        <Button onClick={() => navigate('/faq')}>
          Back to FAQ
        </Button>
      </div>
    );
  }

  const handleShare = () => {
    navigator.share?.({
      title: faqItem.title,
      text: faqItem.description,
      url: window.location.href,
    }).catch(() => {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/faq')}
          className="mb-4 text-amber-600 hover:text-amber-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to FAQ
        </Button>
        
        <div className="space-y-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {parentFAQ.title} • FAQ
          </div>
          
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-amber-800 dark:text-amber-100">
              {faqItem.title}
            </h1>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </div>

      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-amber-200 dark:border-slate-600">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-amber-800 dark:text-amber-100">
            <HelpCircle className="h-5 w-5" />
            <span>Answer</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-amber dark:prose-invert max-w-none">
            <p>{faqItem.description}</p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-100 mb-3">
          Related Questions
        </h3>
        <div className="grid gap-3">
          {parentFAQ.subtopics
            .filter((s: any) => s.id !== faqItem.id)
            .map((subtopic: any) => (
              <Card
                key={subtopic.id}
                className="bg-white/60 dark:bg-slate-800/60 border-amber-200 dark:border-slate-600 cursor-pointer hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors"
                onClick={() => navigate(`/faq/${subtopic.id}`)}
              >
                <CardContent className="p-4">
                  <h4 className="font-medium text-amber-800 dark:text-amber-100 mb-1">
                    {subtopic.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {subtopic.description}
                  </p>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
