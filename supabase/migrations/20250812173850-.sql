-- Create events table for the calendar/events functionality
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'academic',
  venue TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create content_plans table for the studios functionality
CREATE TABLE public.content_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'video',
  status TEXT NOT NULL DEFAULT 'planning',
  shoot_date DATE NOT NULL,
  edit_date DATE,
  post_date DATE,
  team_member TEXT,
  project_document TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mentoring_sessions table for the mentoring functionality
CREATE TABLE public.mentoring_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  week_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_holiday BOOLEAN DEFAULT FALSE,
  mentor TEXT,
  topic TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (allowing public read access for this demo)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentoring_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access for events" 
ON public.events FOR SELECT USING (true);

CREATE POLICY "Allow public read access for content_plans" 
ON public.content_plans FOR SELECT USING (true);

CREATE POLICY "Allow public read access for mentoring_sessions" 
ON public.mentoring_sessions FOR SELECT USING (true);

-- Insert dummy data for events
INSERT INTO public.events (title, event_date, event_type, venue, description) VALUES
('Innovation Workshop', '2024-08-15', 'academic', 'Main Hall', 'Workshop on latest tech innovations'),
('Entrepreneurship Seminar', '2024-08-20', 'academic', 'Conference Room A', 'Guest speaker on startup strategies'),
('Mid-term Examinations', '2024-08-25', 'exam', 'Various Rooms', 'Mid-semester examination period'),
('Sports Day', '2024-09-01', 'sports', 'Sports Complex', 'Annual inter-departmental sports competition'),
('Cultural Festival', '2024-09-05', 'cultural', 'Campus Grounds', 'Annual cultural celebration'),
('Industry Visit', '2024-09-10', 'academic', 'Tech Park', 'Visit to leading technology companies'),
('Summer Break', '2024-09-15', 'holiday', NULL, 'Summer vacation period begins'),
('Hackathon 2024', '2024-09-20', 'academic', 'Computer Lab', '48-hour coding competition'),
('Alumni Meet', '2024-09-25', 'cultural', 'Auditorium', 'Annual alumni gathering'),
('Project Showcase', '2024-09-30', 'academic', 'Exhibition Hall', 'Student project presentations');

-- Insert dummy data for content_plans
INSERT INTO public.content_plans (title, type, status, shoot_date, edit_date, post_date, team_member, project_document) VALUES
('Innovation in Tech Startups', 'video', 'edit', '2024-08-20', '2024-08-25', '2024-09-01', 'Alice Johnson', 'tech-startups-brief.pdf'),
('Entrepreneurship Podcast Episode 5', 'podcast', 'planning', '2024-09-10', '2024-09-12', '2024-09-15', 'Bob Smith', 'podcast-script-ep5.docx'),
('Social Media Campaign - Innovation Week', 'social', 'post', '2024-08-18', NULL, '2024-08-22', 'Carol Davis', 'social-campaign-brief.pdf'),
('Blog: Future of AI in Education', 'blog', 'completed', '2024-08-10', '2024-08-12', '2024-08-15', 'Alice Johnson', 'ai-education-outline.docx'),
('Campus Tour Video', 'video', 'shoot', '2024-08-30', '2024-09-05', '2024-09-10', 'Bob Smith', 'campus-tour-storyboard.pdf'),
('Student Success Stories Podcast', 'podcast', 'edit', '2024-08-28', '2024-09-02', '2024-09-08', 'Carol Davis', 'success-stories-script.docx'),
('Instagram Reels - Lab Facilities', 'social', 'planning', '2024-09-05', NULL, '2024-09-08', 'Alice Johnson', 'reels-concept.pdf'),
('Research Paper Feature Blog', 'blog', 'shoot', '2024-09-01', '2024-09-03', '2024-09-06', 'Bob Smith', 'research-feature-brief.docx'),
('Alumni Interview Series', 'video', 'planning', '2024-09-15', '2024-09-20', '2024-09-25', 'Carol Davis', 'alumni-interview-plan.pdf'),
('Weekly Newsletter Content', 'blog', 'post', '2024-08-26', '2024-08-28', '2024-08-30', 'Alice Johnson', 'newsletter-template.docx');

-- Insert dummy data for mentoring_sessions
INSERT INTO public.mentoring_sessions (week_number, title, start_date, end_date, is_holiday, mentor, topic) VALUES
(1, 'Introduction & Goal Setting', '2024-08-12', '2024-08-18', FALSE, 'Dr. Sarah Wilson', 'Program orientation and personal goal setting'),
(2, 'Industry Fundamentals', '2024-08-19', '2024-08-25', FALSE, 'Prof. Michael Chen', 'Understanding industry landscape and trends'),
(3, 'Mid-semester Break', '2024-08-26', '2024-09-01', TRUE, NULL, 'Academic break period'),
(4, 'Skill Development Workshop', '2024-09-02', '2024-09-08', FALSE, 'Dr. Sarah Wilson', 'Technical and soft skills development'),
(5, 'Project Planning', '2024-09-09', '2024-09-15', FALSE, 'Prof. Michael Chen', 'Project ideation and planning methodologies'),
(6, 'Networking & Communication', '2024-09-16', '2024-09-22', FALSE, 'Ms. Emma Rodriguez', 'Professional networking and communication skills'),
(7, 'Career Development', '2024-09-23', '2024-09-29', FALSE, 'Dr. Sarah Wilson', 'Career planning and job search strategies'),
(8, 'Final Presentations', '2024-09-30', '2024-10-06', FALSE, 'Prof. Michael Chen', 'Project presentations and program wrap-up'),
(9, 'Holiday Week', '2024-10-07', '2024-10-13', TRUE, NULL, 'Festival break period'),
(10, 'Follow-up & Evaluation', '2024-10-14', '2024-10-20', FALSE, 'Ms. Emma Rodriguez', 'Program evaluation and future planning');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_content_plans_updated_at
  BEFORE UPDATE ON public.content_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mentoring_sessions_updated_at
  BEFORE UPDATE ON public.mentoring_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();