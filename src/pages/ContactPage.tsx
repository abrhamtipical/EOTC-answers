
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function ContactPage() {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error(language === 'am' ? 'እባክዎ ሁሉንም የተጠየቁ መስኮች ይሙሉ' : 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          name: formData.name,
          email: formData.email,
          subject: formData.subject || 'General Inquiry',
          message: formData.message,
          language: language,
          status: 'pending'
        });

      if (error) throw error;

      toast.success(language === 'am' ? 'መልእክትዎ በተሳካ ሁኔታ ተልኳል!' : 'Your message was sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error(language === 'am' ? 'መልእክት መላክ አልተሳካም' : 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-amber-800 dark:text-amber-100">
          {t('nav.contact')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {language === 'am' 
            ? 'እኛ ከእርስዎ ጋር መስማት እንወዳለን። ጥያቄዎች፣ አስተያየቶች ወይም ድጋፍ ለሚፈልጉ ሰዎች እኛን ያግኙን።'
            : 'We would love to hear from you. Reach out to us for questions, feedback, or support.'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-amber-200 dark:border-slate-600">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-amber-800 dark:text-amber-100">
              <MessageSquare className="h-5 w-5" />
              <span>{language === 'am' ? 'መልእክት ይላኩ' : 'Send us a Message'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {language === 'am' ? 'ስም *' : 'Name *'}
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={language === 'am' ? 'ሙሉ ስምዎን ያስገቡ' : 'Enter your full name'}
                    className="border-amber-200 dark:border-slate-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {language === 'am' ? 'ኢሜይል *' : 'Email *'}
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder={language === 'am' ? 'ኢሜይል አድራሻዎን ያስገቡ' : 'Enter your email address'}
                    className="border-amber-200 dark:border-slate-600"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {language === 'am' ? 'ርዕስ' : 'Subject'}
                </label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}>
                  <SelectTrigger className="border-amber-200 dark:border-slate-600">
                    <SelectValue placeholder={language === 'am' ? 'ርዕስ ይምረጡ' : 'Select a subject'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">{language === 'am' ? 'አጠቃላይ ጥያቄ' : 'General Inquiry'}</SelectItem>
                    <SelectItem value="support">{language === 'am' ? 'ቴክኒካል ድጋፍ' : 'Technical Support'}</SelectItem>
                    <SelectItem value="content">{language === 'am' ? 'የይዘት ጥያቄ' : 'Content Question'}</SelectItem>
                    <SelectItem value="feedback">{language === 'am' ? 'አስተያየት' : 'Feedback'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {language === 'am' ? 'መልእክት *' : 'Message *'}
                </label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder={language === 'am' ? 'መልእክትዎን እዚህ ይፃፉ...' : 'Write your message here...'}
                  className="min-h-[120px] border-amber-200 dark:border-slate-600"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                    {language === 'am' ? 'በመላክ ላይ...' : 'Sending...'}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    {language === 'am' ? 'መልእክት ላክ' : 'Send Message'}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="space-y-6">
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-amber-200 dark:border-slate-600">
            <CardHeader>
              <CardTitle className="text-amber-800 dark:text-amber-100">
                {language === 'am' ? 'የእኛ መረጃ' : 'Get in Touch'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-amber-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">
                    {language === 'am' ? 'ኢሜይል' : 'Email'}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">contact@eotcanswers.org</p>
                  <p className="text-gray-600 dark:text-gray-300">support@eotcanswers.org</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-amber-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">
                    {language === 'am' ? 'ስልክ' : 'Phone'}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">+251 11 123 4567</p>
                  <p className="text-gray-600 dark:text-gray-300">+251 91 234 5678</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-amber-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">
                    {language === 'am' ? 'አድራሻ' : 'Address'}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {language === 'am' 
                      ? 'አዲስ አበባ፣ ኢትዮጵያ'
                      : 'Addis Ababa, Ethiopia'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Media & Apps */}
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-700 dark:to-slate-600 border-amber-200 dark:border-slate-500">
            <CardHeader>
              <CardTitle className="text-amber-800 dark:text-amber-100">
                {language === 'am' ? 'እኛን ይከተሉን' : 'Follow Us'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50">
                  📘 Facebook
                </Button>
                <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50">
                  📺 YouTube
                </Button>
                <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50">
                  📱 Telegram
                </Button>
                <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50">
                  📷 Instagram
                </Button>
              </div>
              
              <div className="border-t border-amber-200 dark:border-slate-500 pt-4">
                <h4 className="font-medium text-amber-800 dark:text-amber-100 mb-3">
                  {t('download.title')}
                </h4>
                <div className="space-y-2">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    📲 {t('download.playstore')}
                  </Button>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    📥 {t('download.appstore')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
