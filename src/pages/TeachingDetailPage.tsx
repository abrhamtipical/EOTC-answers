
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Bookmark, Share2, Clock, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import teachingsData from '@/data/teachings.json';

const teachingContent: Record<string, string> = {
  'trinity-mystery': `
    <h2>The Mystery of the Trinity</h2>
    <p>The doctrine of the Trinity is central to Ethiopian Orthodox theology. We confess one God in three persons: the Father, the Son, and the Holy Spirit.</p>
    
    <h3>The Divine Unity</h3>
    <p>Though distinct in persons, the Trinity shares one divine essence. This mystery transcends human understanding yet forms the foundation of our faith.</p>
    
    <h3>The Role of Each Person</h3>
    <ul>
      <li><strong>The Father:</strong> The source and origin of divinity</li>
      <li><strong>The Son:</strong> The Word made flesh, our Savior</li>
      <li><strong>The Holy Spirit:</strong> The sanctifier and life-giver</li>
    </ul>
    
    <h3>Orthodox Understanding</h3>
    <p>The Ethiopian Orthodox Church maintains the ancient faith, rejecting both Arianism and modalism. We affirm the equality and co-eternity of the three persons.</p>
  `,
  'fasting-spirituality': `
    <h2>The Spiritual Discipline of Fasting</h2>
    <p>Fasting is a cornerstone of Orthodox spiritual life, involving both physical abstinence and spiritual discipline.</p>
    
    <h3>Types of Fasting</h3>
    <ul>
      <li><strong>Hudadi (Great Lent):</strong> 55 days of preparation for Easter</li>
      <li><strong>Tsom Hawaryat:</strong> Fast of the Apostles</li>
      <li><strong>Weekly Fasts:</strong> Wednesdays and Fridays</li>
    </ul>
    
    <h3>Spiritual Benefits</h3>
    <p>Fasting purifies the soul, increases prayer life, and develops self-control. It prepares us for spiritual encounters and deepens our relationship with God.</p>
  `,
  'mary-theotokos': `
    <h2>Mary, the Theotokos</h2>
    <p>The Ethiopian Orthodox Church venerates the Virgin Mary as Theotokos (God-bearer), the highest title given to any human being.</p>
    
    <h3>The Incarnation</h3>
    <p>Through Mary's "yes" to God, the Word became flesh. She is the bridge between heaven and earth, through whom our salvation came.</p>
    
    <h3>Perpetual Virginity</h3>
    <p>Orthodox tradition maintains Mary's perpetual virginity - before, during, and after the birth of Christ, emphasizing her unique role in salvation history.</p>
  `,
  'resurrection-victory': `
    <h2>The Victory of the Resurrection</h2>
    <p>The Resurrection of Jesus Christ is the cornerstone of Orthodox faith, the victory over death and the promise of eternal life.</p>
    
    <h3>The Paschal Mystery</h3>
    <p>Through His death and resurrection, Christ trampled down death by death, opening the gates of paradise to all who believe.</p>
    
    <h3>Our Participation</h3>
    <p>Through baptism, we die and rise with Christ. The resurrection is not just a historical event but a present reality in the life of every believer.</p>
  `
};

export function TeachingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const teaching = teachingsData.find(t => t.id === id);
  
  if (!teaching) {
    return (
      <div className="container mx-auto px-4 py-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Teaching Not Found
        </h1>
        <Button onClick={() => navigate('/teachings')}>
          Back to Teachings
        </Button>
      </div>
    );
  }

  const handleBookmark = () => {
    toast.success('Teaching bookmarked!');
  };

  const handleShare = () => {
    navigator.share?.({
      title: teaching.title,
      text: teaching.description,
      url: window.location.href,
    }).catch(() => {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/teachings')}
          className="mb-4 text-amber-600 hover:text-amber-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Teachings
        </Button>
        
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary">{teaching.category}</Badge>
            <Badge className={getDifficultyColor(teaching.difficulty)}>
              {teaching.difficulty}
            </Badge>
          </div>
          
          <h1 className="text-3xl font-bold text-amber-800 dark:text-amber-100">
            {teaching.title}
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {teaching.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{teaching.readTime}</span>
              </div>
              <div className="flex items-center space-x-1">
                <BookOpen className="h-4 w-4" />
                <span>{teaching.category}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBookmark}
                className="border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
              >
                <Bookmark className="h-4 w-4 mr-1" />
                Save
              </Button>
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
      </div>

      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-amber-200 dark:border-slate-600">
        <CardContent className="p-8">
          <div 
            className="prose prose-amber dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: teachingContent[teaching.id] || '<p>Content not available</p>' }}
          />
        </CardContent>
      </Card>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-100 mb-3">
          Related Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {teaching.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-sm">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
