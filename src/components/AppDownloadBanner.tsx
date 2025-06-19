
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Smartphone, Download, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function AppDownloadBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const { language, t } = useLanguage();

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-in-bottom">
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 text-white shadow-2xl">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 opacity-90"></div>
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-pulse delay-300"></div>
        <div className="absolute top-1/2 left-1/4 w-6 h-6 bg-white/20 rounded-full animate-ping delay-500"></div>
        <div className="absolute top-1/4 right-1/3 w-4 h-4 bg-white/15 rounded-full animate-ping delay-700"></div>
        
        <div className="relative container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
                <div className="relative p-3 bg-white/10 rounded-full backdrop-blur-sm">
                  <Smartphone className="h-6 w-6 text-white" />
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="font-bold text-lg flex items-center space-x-2">
                  <span>{t('download.title')}</span>
                  <Sparkles className="h-4 w-4 animate-pulse" />
                </h3>
                <p className="text-sm text-amber-100 font-medium">
                  {t('download.subtitle')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                size="sm" 
                className="group bg-white/90 hover:bg-white text-amber-600 hover:text-amber-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-4 py-2 backdrop-blur-sm"
              >
                <span className="mr-2 text-lg">📲</span>
                <span className="hidden sm:inline">
                  {language === 'am' ? 'Play Store' : 'Play Store'}
                </span>
                <Download className="h-4 w-4 ml-1 group-hover:animate-bounce" />
              </Button>
              
              <Button 
                size="sm" 
                className="group bg-white/90 hover:bg-white text-amber-600 hover:text-amber-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-4 py-2 backdrop-blur-sm"
              >
                <span className="mr-2 text-lg">📥</span>
                <span className="hidden sm:inline">
                  {language === 'am' ? 'App Store' : 'App Store'}
                </span>
                <Download className="h-4 w-4 ml-1 group-hover:animate-bounce" />
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsVisible(false)}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-300 hover:scale-110"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
