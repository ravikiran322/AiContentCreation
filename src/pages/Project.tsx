import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Plus, ArrowLeft, Trash2, Edit3 } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  type: string;
  platform: string;
  body: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface ProjectData {
  id: string;
  name: string;
  description: string;
}

export function Project() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
    fetchContents();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, name, description')
        .eq('id', projectId)
        .maybeSingle();

      if (error) throw error;
      if (data) setProject(data as ProjectData);
    } catch (err) {
      console.error('Error fetching project:', err);
    }
  };

  const fetchContents = async () => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContents(data || []);
    } catch (err) {
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (contentId: string) => {
    try {
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', contentId);

      if (error) throw error;
      setContents(contents.filter((c) => c.id !== contentId));
    } catch (err) {
      console.error('Error deleting content:', err);
    }
  };

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800',
    published: 'bg-green-100 text-green-800',
    archived: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            {project && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                {project.description && (
                  <p className="text-sm text-gray-600">{project.description}</p>
                )}
              </div>
            )}
          </div>
          <button
            onClick={() => navigate(`/project/${projectId}/editor`)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            <Plus className="w-5 h-5" />
            New Content
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading content...</p>
          </div>
        ) : contents.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No content yet
            </h2>
            <p className="text-gray-600 mb-6">
              Create your first piece of content for this project
            </p>
            <button
              onClick={() => navigate(`/project/${projectId}/editor`)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Create Content
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {contents.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-300 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 cursor-pointer" onClick={() => navigate(`/project/${projectId}/editor/${item.id}`)}>
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition">
                      {item.title || 'Untitled'}
                    </h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm text-gray-600 capitalize">
                        {item.type}
                      </span>
                      <span className="text-sm text-gray-600">
                        {item.platform}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          statusColors[item.status] || statusColors.draft
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    {item.body && (
                      <p className="text-gray-600 mt-3 line-clamp-2">
                        {item.body}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => navigate(`/project/${projectId}/editor/${item.id}`)}
                      className="p-2 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Edit3 className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
