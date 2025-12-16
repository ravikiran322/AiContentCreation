import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Trash2, ChevronRight } from 'lucide-react';

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string;
    created_at: string;
  };
  onDeleted: (id: string) => void;
}

export function ProjectCard({ project, onDeleted }: ProjectCardProps) {
  const navigate = useNavigate();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', project.id);

      if (error) throw error;
      onDeleted(project.id);
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  return (
    <div
      onClick={() => navigate(`/project/${project.id}`)}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-300 hover:shadow-lg cursor-pointer transition"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
          {project.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {project.description}
            </p>
          )}
        </div>
        <button
          onClick={handleDelete}
          className="p-2 hover:bg-red-50 rounded-lg transition ml-2"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Created {new Date(project.created_at).toLocaleDateString()}
        </span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </div>
  );
}
