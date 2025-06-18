
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Mail, Calendar, User, MessageSquare, Check, X } from 'lucide-react';

export function AdminContacts() {
  const queryClient = useQueryClient();

  const { data: contacts, isLoading } = useQuery({
    queryKey: ['admin-contacts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
      toast.success('Contact status updated');
    },
    onError: (error) => {
      toast.error('Failed to update status');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
      toast.success('Contact submission deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete submission');
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'responded': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Contact Submissions</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
          <span>Total: {contacts?.length || 0}</span>
        </div>
      </div>

      <div className="grid gap-4">
        {contacts?.map((contact) => (
          <Card key={contact.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                    <Mail className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-800 dark:text-gray-200">
                        {contact.name}
                      </h3>
                      <Badge className={getStatusColor(contact.status || 'pending')}>
                        {contact.status || 'pending'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {contact.email}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatusMutation.mutate({ 
                      id: contact.id, 
                      status: contact.status === 'pending' ? 'responded' : 'pending' 
                    })}
                    className="text-green-600 border-green-600 hover:bg-green-50"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(contact.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {contact.subject && (
                <div className="mb-3">
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                    Subject: {contact.subject}
                  </h4>
                </div>
              )}

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
                <div className="flex items-start space-x-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-gray-500 mt-1" />
                  <div className="flex-1">
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {contact.message}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(contact.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>Language: {contact.language || 'en'}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatusMutation.mutate({ id: contact.id, status: 'archived' })}
                    className="text-xs"
                  >
                    Archive
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`mailto:${contact.email}?subject=Re: ${contact.subject || 'Your message'}`)}
                    className="text-xs"
                  >
                    Reply
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {contacts?.length === 0 && (
          <div className="text-center py-12">
            <Mail className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
              No contact submissions yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Contact submissions will appear here when users send messages
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
