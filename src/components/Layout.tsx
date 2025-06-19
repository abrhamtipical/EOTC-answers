
import { ReactNode } from 'react';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Background with Multiple Gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-amber-900/10"></div>
      
      {/* Animated Background Elements */}
      <div className="fixed top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-amber-200/20 via-orange-200/15 to-yellow-200/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-0 right-0 w-[800px] h-[800px] bg-gradient-to-tl from-orange-200/15 via-amber-200/10 to-yellow-200/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-amber-100/10 to-orange-100/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      
      {/* Floating Particles */}
      <div className="fixed top-1/4 left-1/4 w-2 h-2 bg-amber-400/30 rounded-full animate-ping delay-300"></div>
      <div className="fixed top-3/4 right-1/4 w-3 h-3 bg-orange-400/25 rounded-full animate-ping delay-700"></div>
      <div className="fixed top-1/2 right-1/3 w-1 h-1 bg-yellow-400/40 rounded-full animate-ping delay-1000"></div>
      <div className="fixed bottom-1/3 left-1/5 w-2 h-2 bg-amber-300/20 rounded-full animate-ping delay-1500"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <Header />
        <main className="pb-20 pt-16 relative">
          <div className="relative z-10">
            {children}
          </div>
        </main>
        <BottomNavigation />
      </div>
    </div>
  );
}
