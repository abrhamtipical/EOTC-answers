
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Smartphone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function AppDownloadBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const { language, t } = useLanguage();

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-amber-600 to-orange-600 text-white p-4 shadow-lg z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Smartphone className="h-6 w-6" />
          <div>
            <h3 className="font-medium">{t('download.title')}</h3>
            <p className="text-sm text-amber-100">{t('download.subtitle')}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            size="sm" 
            variant="secondary"
            className="bg-white text-amber-600 hover:bg-amber-50"
          >
            📲 {language === 'am' ? 'Play Store' : 'Play Store'}
          </Button>
          <Button 
            size="sm" 
            variant="secondary"
            className="bg-white text-amber-600 hover:bg-amber-50"
          >
            📥 {language === 'am' ? 'App Store' : 'App Store'}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsVisible(false)}
            className="text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
