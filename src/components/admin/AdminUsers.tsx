
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserPlus, Trash2, Shield } from 'lucide-react';

export function AdminUsers() {
  const queryClient = useQueryClient();
  const [newAdminEmail, setNewAdminEmail] = useState('');

  const { data: admins, isLoading } = useQuery({
    queryKey: ['admin-users-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id, user_id, role, created_at');
      
      if (error) throw error;
      return data;
    },
  });

  const addAdminMutation = useMutation({
    mutationFn: async (email: string) => {
      // First, check if user exists in auth.users
      const { data: users, error: userError } = await supabase.auth.admin.listUsers();
      
      if (userError) throw userError;
      
      const user = users.users.find(u => u.email === email);
      if (!user) {
        throw new Error('User not found');
      }

      // Add to admin_users table
      const { error } = await supabase
        .from('admin_users')
        .insert({
          user_id: user.id,
          role: 'admin'
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users-list'] });
      toast.success('Admin user added successfully');
      setNewAdminEmail('');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add admin user');
      console.error(error);
    },
  });

  const removeAdminMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users-list'] });
      toast.success('Admin user removed successfully');
    },
    onError: (error) => {
      toast.error('Failed to remove admin user');
      console.error(error);
    },
  });

  const handleAddAdmin = () => {
    if (newAdminEmail.trim()) {
      addAdminMutation.mutate(newAdminEmail.trim());
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Admin Users</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Admin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter email address"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleAddAdmin}
              disabled={addAdminMutation.isPending || !newAdminEmail.trim()}
              className="bg-amber-600 hover:bg-amber-700"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Admin
            </Button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            The user must already be registered in the system before they can be made an admin.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {admins?.map((admin) => (
          <Card key={admin.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="font-medium">Admin User</p>
                    <p className="text-sm text-gray-500">ID: {admin.user_id}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removeAdminMutation.mutate(admin.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {admins?.length === 0 && (
        <div className="text-center py-12">
          <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
            No admin users yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Add admin users to manage the application content
          </p>
        </div>
      )}
    </div>
  );
}
