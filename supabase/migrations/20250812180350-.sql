-- Create cohort_projects table for managing product development cohorts
CREATE TABLE public.cohort_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  active_days TEXT[] DEFAULT '{}',
  participants INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'planning',
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.cohort_projects ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since no authentication is implemented yet)
CREATE POLICY "Allow public read access for cohort_projects" 
ON public.cohort_projects 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access for cohort_projects" 
ON public.cohort_projects 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update access for cohort_projects" 
ON public.cohort_projects 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete access for cohort_projects" 
ON public.cohort_projects 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_cohort_projects_updated_at
BEFORE UPDATE ON public.cohort_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert dummy data for testing
INSERT INTO public.cohort_projects (project_name, start_date, end_date, active_days, participants, status, progress) VALUES
('AI-Powered Learning Platform', '2024-03-01', '2024-04-26', '{"monday","wednesday","friday"}', 12, 'active', 45),
('Sustainable Energy Monitor', '2024-02-15', '2024-04-10', '{"tuesday","thursday"}', 8, 'active', 65),
('Campus Food Delivery App', '2024-01-20', '2024-03-15', '{"monday","tuesday","wednesday","thursday","friday"}', 15, 'completed', 100),
('Smart Campus Navigation', '2024-04-01', '2024-05-31', '{"monday","wednesday","friday"}', 10, 'planning', 10),
('Virtual Reality Study Rooms', '2024-03-15', '2024-05-10', '{"tuesday","thursday","saturday"}', 6, 'active', 30),
('Blockchain Student Records', '2024-02-01', '2024-04-15', '{"monday","tuesday","wednesday","thursday"}', 14, 'active', 55),
('IoT Weather Monitoring', '2024-01-10', '2024-03-05', '{"wednesday","friday"}', 7, 'completed', 100),
('Machine Learning Tutor', '2024-04-10', '2024-06-20', '{"monday","wednesday","friday","saturday"}', 11, 'planning', 5),
('Augmented Reality Library', '2024-03-20', '2024-05-25', '{"tuesday","thursday"}', 9, 'active', 25),
('Digital Wellness Tracker', '2024-02-10', '2024-04-05', '{"monday","tuesday","wednesday","thursday","friday"}', 13, 'active', 70);