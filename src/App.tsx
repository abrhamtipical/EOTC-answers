
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { HomePage } from '@/pages/HomePage';
import { TeachingsPage } from '@/pages/TeachingsPage';
import { TeachingDetailPage } from '@/pages/TeachingDetailPage';
import { ArticlesPage } from '@/pages/ArticlesPage';
import { ArticleDetailPage } from '@/pages/ArticleDetailPage';
import { EbooksPage } from '@/pages/EbooksPage';
import { FAQPage } from '@/pages/FAQPage';
import { FAQDetailPage } from '@/pages/FAQDetailPage';
import { ContactPage } from '@/pages/ContactPage';
import { SearchPage } from '@/pages/SearchPage';
import { BookmarksPage } from '@/pages/BookmarksPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { AuthPage } from '@/pages/AuthPage';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { Layout } from '@/components/Layout';
import { AuthProvider } from '@/providers/AuthProvider';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AppDownloadBanner } from '@/components/AppDownloadBanner';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <LanguageProvider>
          <AuthProvider>
            <Router>
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/teachings" element={<TeachingsPage />} />
                  <Route path="/teachings/:id" element={<TeachingDetailPage />} />
                  <Route path="/articles" element={<ArticlesPage />} />
                  <Route path="/articles/:id" element={<ArticleDetailPage />} />
                  <Route path="/ebooks" element={<EbooksPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/faq/:id" element={<FAQDetailPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/bookmarks" element={<BookmarksPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
              </Layout>
              <AppDownloadBanner />
            </Router>
            <Toaster />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
