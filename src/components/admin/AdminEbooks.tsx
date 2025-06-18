
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, BookOpen, Download } from 'lucide-react';

export function AdminEbooks() {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    title_am: '',
    description: '',
    description_am: '',
    category: '',
    file_url: '',
    file_type: 'pdf',
    file_size: '',
    cover_image: '',
    language: 'en'
  });

  const { data: ebooks, isLoading } = useQuery({
    queryKey: ['admin-ebooks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ebooks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('ebooks')
        .insert({
          ...data,
          file_size: data.file_size ? parseInt(data.file_size) : null
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ebooks'] });
      toast.success('eBook created successfully');
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create eBook');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { error } = await supabase
        .from('ebooks')
        .update({
          ...data,
          file_size: data.file_size ? parseInt(data.file_size) : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ebooks'] });
      toast.success('eBook updated successfully');
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update eBook');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('ebooks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ebooks'] });
      toast.success('eBook deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete eBook');
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      title_am: '',
      description: '',
      description_am: '',
      category: '',
      file_url: '',
      file_type: 'pdf',
      file_size: '',
      cover_image: '',
      language: 'en'
    });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleEdit = (ebook: any) => {
    setFormData({
      title: ebook.title,
      title_am: ebook.title_am || '',
      description: ebook.description || '',
      description_am: ebook.description_am || '',
      category: ebook.category || '',
      file_url: ebook.file_url,
      file_type: ebook.file_type,
      file_size: ebook.file_size ? ebook.file_size.toString() : '',
      cover_image: ebook.cover_image || '',
      language: ebook.language
    });
    setEditingId(ebook.id);
    setIsCreating(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage eBooks</h2>
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-amber-600 hover:bg-amber-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add eBook
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit eBook' : 'Create New eBook'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title (English)</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Title (Amharic)</label>
                  <Input
                    value={formData.title_am}
                    onChange={(e) => setFormData(prev => ({ ...prev, title_am: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Description (English)</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description (Amharic)</label>
                  <Textarea
                    value={formData.description_am}
                    onChange={(e) => setFormData(prev => ({ ...prev, description_am: e.target.value }))}
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="Prayer, Liturgy, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">File Type</label>
                  <Select value={formData.file_type} onValueChange={(value) => setFormData(prev => ({ ...prev, file_type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="epub">ePub</SelectItem>
                      <SelectItem value="docx">Word</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">File Size (bytes)</label>
                  <Input
                    type="number"
                    value={formData.file_size}
                    onChange={(e) => setFormData(prev => ({ ...prev, file_size: e.target.value }))}
                    placeholder="1048576"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Language</label>
                  <Select value={formData.language} onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="am">Amharic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">File URL</label>
                  <Input
                    value={formData.file_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, file_url: e.target.value }))}
                    placeholder="https://example.com/book.pdf"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Cover Image URL</label>
                  <Input
                    value={formData.cover_image}
                    onChange={(e) => setFormData(prev => ({ ...prev, cover_image: e.target.value }))}
                    placeholder="https://example.com/cover.jpg"
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  {editingId ? 'Update' : 'Create'} eBook
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {ebooks?.map((ebook) => (
          <Card key={ebook.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <BookOpen className="h-4 w-4 text-amber-600" />
                    <h3 className="font-medium">{ebook.title}</h3>
                    <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded uppercase">
                      {ebook.file_type}
                    </span>
                  </div>
                  {ebook.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {ebook.description}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Category: {ebook.category || 'Uncategorized'}</span>
                    <span>Size: {formatFileSize(ebook.file_size)}</span>
                    <span>Downloads: {ebook.download_count || 0}</span>
                    <span>Language: {ebook.language}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(ebook)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(ebook.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
