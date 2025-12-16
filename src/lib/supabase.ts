import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          description?: string;
        };
        Update: {
          name?: string;
          description?: string;
        };
      };
      content: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          type: string;
          platform: string;
          body: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          project_id: string;
          title: string;
          type?: string;
          platform?: string;
          body?: string;
          status?: string;
        };
        Update: {
          title?: string;
          type?: string;
          platform?: string;
          body?: string;
          status?: string;
        };
      };
      templates: {
        Row: {
          id: string;
          name: string;
          type: string;
          platform: string;
          structure: Record<string, string[]>;
          created_at: string;
        };
      };
    };
  };
};
