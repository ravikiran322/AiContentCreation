import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  type: string;
  platform: string;
  body: string;
  status: string;
}

interface ContentType {
  id: string;
  title: string;
  type: string;
  platform: string;
  body: string;
  status: string;
  project_id: string;
}

export function Editor() {
  const { projectId, contentId } = useParams<{
    projectId: string;
    contentId?: string;
  }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<ContentItem>({
    id: '',
    title: '',
    type: 'blog',
    platform: 'website',
    body: '',
    status: 'draft',
  });
  const [loading, setLoading] = useState(contentId ? true : false);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [topic, setTopic] = useState('');

  useEffect(() => {
    if (contentId) {
      fetchContent();
    }
  }, [contentId]);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('id', contentId)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setContent(data as ContentItem);
      }
    } catch (err) {
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (contentId) {
        const { error } = await supabase
          .from('content')
          .update({
            title: content.title,
            type: content.type,
            platform: content.platform,
            body: content.body,
            status: content.status,
            updated_at: new Date().toISOString(),
          })
          .eq('id', contentId);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('content').insert({
          project_id: projectId,
          title: content.title || 'Untitled',
          type: content.type,
          platform: content.platform,
          body: content.body,
          status: content.status,
        });

        if (error) throw error;
      }
    } catch (err) {
      console.error('Error saving content:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateAI = async () => {
    if (!content.title || !topic) {
      alert('Please enter a title and topic');
      return;
    }

    setGenerating(true);
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-content`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          title: content.title,
          type: content.type,
          platform: content.platform,
          topic: topic,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setContent({ ...content, body: data.content });
        setTopic('');
      } else {
        alert('Error generating content: ' + data.error);
      }
    } catch (err) {
      console.error('Error generating content:', err);
      alert('Failed to generate content');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/project/${projectId}`)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <input
              type="text"
              value={content.title}
              onChange={(e) => setContent({ ...content, title: e.target.value })}
              placeholder="Untitled content..."
              className="text-xl font-bold text-gray-900 border-0 bg-transparent focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter topic for AI..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              onClick={handleGenerateAI}
              disabled={generating}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 transition text-gray-700 font-medium"
            >
              <Sparkles className="w-4 h-4" />
              {generating ? 'Generating...' : 'AI Generate'}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Type
                  </label>
                  <select
                    value={content.type}
                    onChange={(e) =>
                      setContent({ ...content, type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="blog">Blog Post</option>
                    <option value="social">Social Media</option>
                    <option value="email">Email</option>
                    <option value="script">Script</option>
                    <option value="marketing">Marketing Copy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platform
                  </label>
                  <select
                    value={content.platform}
                    onChange={(e) =>
                      setContent({ ...content, platform: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="website">Website</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Twitter">Twitter</option>
                    <option value="email">Email</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={content.status}
                    onChange={(e) =>
                      setContent({ ...content, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <textarea
                value={content.body}
                onChange={(e) => setContent({ ...content, body: e.target.value })}
                placeholder="Start writing your content here..."
                className="w-full h-96 p-6 border-0 resize-none focus:outline-none focus:ring-0 text-gray-900"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
