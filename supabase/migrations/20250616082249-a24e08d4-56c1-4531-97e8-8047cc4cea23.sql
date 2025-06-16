
-- Create teachings table for admin management
CREATE TABLE public.teachings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'beginner',
  read_time TEXT NOT NULL DEFAULT '5 min',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create FAQ table for admin management
CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user questions table
CREATE TABLE public.user_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  question TEXT NOT NULL,
  answer TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin users table for role management
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.teachings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for teachings (public read, admin write)
CREATE POLICY "Anyone can view teachings" ON public.teachings FOR SELECT USING (true);
CREATE POLICY "Only admins can modify teachings" ON public.teachings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

-- RLS Policies for FAQs (public read, admin write)
CREATE POLICY "Anyone can view faqs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Only admins can modify faqs" ON public.faqs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

-- RLS Policies for user questions
CREATE POLICY "Users can view their own questions" ON public.user_questions FOR SELECT USING (
  user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);
CREATE POLICY "Users can create questions" ON public.user_questions FOR INSERT WITH CHECK (
  user_id = auth.uid()
);
CREATE POLICY "Only admins can update questions" ON public.user_questions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

-- RLS Policies for admin users
CREATE POLICY "Admins can view admin users" ON public.admin_users FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage admin users" ON public.admin_users FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

-- Insert some sample data
INSERT INTO public.teachings (title, category, description, content, difficulty, read_time, tags) VALUES
('The Mystery of the Trinity', 'Theology', 'Understanding the divine nature of the Father, Son, and Holy Spirit in Orthodox theology', '<h1>The Mystery of the Trinity</h1><p>The Trinity is the central mystery of our faith...</p>', 'intermediate', '15 min', ARRAY['trinity', 'theology', 'divine nature']),
('The Spiritual Discipline of Fasting', 'Spiritual Practice', 'The role of fasting in Orthodox spiritual life and its theological significance', '<h1>Fasting in Orthodox Life</h1><p>Fasting is a cornerstone of spiritual discipline...</p>', 'beginner', '10 min', ARRAY['fasting', 'spiritual discipline', 'prayer']);

INSERT INTO public.faqs (subject, question, answer) VALUES
('Prayer', 'How many times should we pray daily?', 'Orthodox Christians traditionally pray seven times daily, following the monastic hours of prayer.'),
('Prayer', 'What is the significance of the Sign of the Cross?', 'The Sign of the Cross invokes the Trinity and sanctifies our actions.'),
('Fasting', 'Why do we fast before communion?', 'Fasting prepares our body and soul to receive the Eucharist with proper reverence.'),
('Fasting', 'What foods are allowed during fasting periods?', 'During fasting, we abstain from meat, dairy, eggs, and fish (except on certain feast days).');
