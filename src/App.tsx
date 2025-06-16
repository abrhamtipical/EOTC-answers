
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { HomePage } from '@/pages/HomePage';
import { TeachingsPage } from '@/pages/TeachingsPage';
import { TeachingDetailPage } from '@/pages/TeachingDetailPage';
import { FAQPage } from '@/pages/FAQPage';
import { FAQDetailPage } from '@/pages/FAQDetailPage';
import { SearchPage } from '@/pages/SearchPage';
import { BookmarksPage } from '@/pages/BookmarksPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { AuthPage } from '@/pages/AuthPage';
import { Layout } from '@/components/Layout';
import { AuthProvider } from '@/providers/AuthProvider';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <AuthProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/teachings" element={<TeachingsPage />} />
                <Route path="/teachings/:id" element={<TeachingDetailPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/faq/:id" element={<FAQDetailPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/bookmarks" element={<BookmarksPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/auth" element={<AuthPage />} />
              </Routes>
            </Layout>
          </Router>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
