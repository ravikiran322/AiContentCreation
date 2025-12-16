/*
  # Create Content Creation Platform Tables

  1. New Tables
    - `projects` - User projects/workspaces
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text)
      - `description` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `content` - Individual content pieces
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key)
      - `title` (text)
      - `type` (text) - blog, social, email, script, etc.
      - `platform` (text) - website, LinkedIn, Instagram, etc.
      - `body` (text)
      - `status` (text) - draft, published, archived
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `templates` - Content templates
      - `id` (uuid, primary key)
      - `name` (text)
      - `type` (text)
      - `platform` (text)
      - `structure` (jsonb)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for user data isolation
*/

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own projects"
  ON projects FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  type text NOT NULL DEFAULT 'blog',
  platform text DEFAULT 'website',
  body text DEFAULT '',
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view content in their projects"
  ON content FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = content.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create content in their projects"
  ON content FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update content in their projects"
  ON content FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = content.project_id
      AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete content in their projects"
  ON content FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = content.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  platform text DEFAULT 'website',
  structure jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view templates"
  ON templates FOR SELECT
  USING (true);

INSERT INTO templates (name, type, platform, structure) VALUES
('Blog Post', 'blog', 'website', '{"sections": ["Headline", "Introduction", "Body", "Conclusion", "CTA"]}'),
('LinkedIn Post', 'post', 'LinkedIn', '{"sections": ["Hook", "Body", "Hashtags"]}'),
('Email Campaign', 'email', 'email', '{"sections": ["Subject", "Introduction", "Body", "CTA"]}'),
('Instagram Caption', 'caption', 'Instagram', '{"sections": ["Caption", "Hashtags", "CTA"]}'),
('Product Description', 'marketing', 'website', '{"sections": ["Title", "Features", "Benefits", "Price", "CTA"]}'),
('How-To Guide', 'guide', 'website', '{"sections": ["Introduction", "Requirements", "Steps", "Tips", "Conclusion"]}')
ON CONFLICT DO NOTHING;
