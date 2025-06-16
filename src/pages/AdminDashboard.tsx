
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { AdminTeachings } from '@/components/admin/AdminTeachings';
import { AdminFAQs } from '@/components/admin/AdminFAQs';
import { AdminQuestions } from '@/components/admin/AdminQuestions';
import { AdminUsers } from '@/components/admin/AdminUsers';
import { Book, HelpCircle, MessageSquare, Users, Shield } from 'lucide-react';

export function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if user is admin
  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ['admin-check', user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      return !error && !!data;
    },
    enabled: !!user,
  });

  // Get dashboard stats
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [teachingsRes, faqsRes, questionsRes, usersRes] = await Promise.all([
        supabase.from('teachings').select('id', { count: 'exact' }),
        supabase.from('faqs').select('id', { count: 'exact' }),
        supabase.from('user_questions').select('id', { count: 'exact' }),
        supabase.from('admin_users').select('id', { count: 'exact' })
      ]);

      return {
        teachings: teachingsRes.count || 0,
        faqs: faqsRes.count || 0,
        questions: questionsRes.count || 0,
        admins: usersRes.count || 0,
      };
    },
    enabled: isAdmin,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 mx-auto mb-4 border-2 border-amber-600 border-t-transparent rounded-full"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600">
              <Shield className="h-5 w-5" />
              <span>Access Denied</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You don't have permission to access the admin dashboard.
            </p>
            <Button onClick={() => navigate('/')} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-amber-800 dark:text-amber-100">
          Admin Dashboard
        </h1>
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="border-amber-600 text-amber-600"
        >
          Back to Site
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Book className="h-8 w-8 text-amber-600" />
              <div>
                <p className="text-2xl font-bold">{stats?.teachings || 0}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Teachings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <HelpCircle className="h-8 w-8 text-amber-600" />
              <div>
                <p className="text-2xl font-bold">{stats?.faqs || 0}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">FAQs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-8 w-8 text-amber-600" />
              <div>
                <p className="text-2xl font-bold">{stats?.questions || 0}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Questions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-amber-600" />
              <div>
                <p className="text-2xl font-bold">{stats?.admins || 0}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Tabs */}
      <Tabs defaultValue="teachings" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="teachings">Teachings</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="teachings">
          <AdminTeachings />
        </TabsContent>

        <TabsContent value="faqs">
          <AdminFAQs />
        </TabsContent>

        <TabsContent value="questions">
          <AdminQuestions />
        </TabsContent>

        <TabsContent value="users">
          <AdminUsers />
        </TabsContent>
      </Tabs>
    </div>
  );
}
