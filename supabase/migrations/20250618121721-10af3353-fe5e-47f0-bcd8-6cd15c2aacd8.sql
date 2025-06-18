
-- Create articles table
CREATE TABLE public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_am TEXT, -- Amharic title
  content TEXT NOT NULL,
  content_am TEXT, -- Amharic content
  excerpt TEXT,
  excerpt_am TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  cover_image TEXT,
  language TEXT NOT NULL DEFAULT 'en',
  status TEXT NOT NULL DEFAULT 'published',
  author_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ebooks table
CREATE TABLE public.ebooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_am TEXT,
  description TEXT,
  description_am TEXT,
  cover_image TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'pdf',
  file_size BIGINT,
  category TEXT,
  language TEXT NOT NULL DEFAULT 'en',
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contact submissions table
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  language TEXT DEFAULT 'en',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add language columns to existing tables
ALTER TABLE public.teachings ADD COLUMN title_am TEXT;
ALTER TABLE public.teachings ADD COLUMN description_am TEXT;
ALTER TABLE public.teachings ADD COLUMN content_am TEXT;
ALTER TABLE public.teachings ADD COLUMN language TEXT DEFAULT 'en';

ALTER TABLE public.faqs ADD COLUMN question_am TEXT;
ALTER TABLE public.faqs ADD COLUMN answer_am TEXT;
ALTER TABLE public.faqs ADD COLUMN language TEXT DEFAULT 'en';

-- Enable RLS
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for articles (public read, admin write)
CREATE POLICY "Anyone can view published articles" ON public.articles 
FOR SELECT USING (status = 'published');

CREATE POLICY "Only admins can modify articles" ON public.articles 
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

-- RLS Policies for ebooks (public read, admin write)
CREATE POLICY "Anyone can view ebooks" ON public.ebooks FOR SELECT USING (true);
CREATE POLICY "Only admins can modify ebooks" ON public.ebooks FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

-- RLS Policies for contact submissions
CREATE POLICY "Anyone can create contact submissions" ON public.contact_submissions 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can view contact submissions" ON public.contact_submissions 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

CREATE POLICY "Only admins can update contact submissions" ON public.contact_submissions 
FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

-- Insert sample articles
INSERT INTO public.articles (title, title_am, content, content_am, excerpt, excerpt_am, category, tags, language) VALUES
('The Holy Trinity in Ethiopian Orthodox Faith', 'በኢትዮጵያ ኦርቶዶክስ እምነት ውስጥ ቅድስት ሥላሴ', 
'<h1>Understanding the Trinity</h1><p>The Trinity is central to our Orthodox faith...</p>',
'<h1>ቅድስት ሥላሴን መረዳት</h1><p>ሥላሴ በእኛ ኦርቶዶክስ እምነት ውስጥ ማዕከላዊ ነው...</p>',
'Exploring the mystery of the Holy Trinity in Ethiopian Orthodox theology',
'በኢትዮጵያ ኦርቶዶክስ መጽሐፍ ቅዱስ ውስጥ የቅድስት ሥላሴን ሚስጢር መመርመር',
'Theology', ARRAY['trinity', 'theology', 'orthodox'], 'en'),

('The Significance of Fasting', 'የጾምን ጠቀሜታ',
'<h1>Orthodox Fasting Practices</h1><p>Fasting is a spiritual discipline...</p>',
'<h1>የኦርቶዶክስ ጾም ልምድ</h1><p>ጾም መንፈሳዊ ግሥ ነው...</p>',
'Understanding the spiritual importance of fasting in Orthodox tradition',
'በኦርቶዶክስ ወግ ውስጥ የጾምን መንፈሳዊ ጠቀሜታ መረዳት',
'Spiritual Practice', ARRAY['fasting', 'spirituality', 'practice'], 'en');

-- Insert sample ebooks
INSERT INTO public.ebooks (title, title_am, description, description_am, file_url, file_type, category, language) VALUES
('Orthodox Prayer Book', 'የኦርቶዶክስ ጸሎት መጽሐፍ',
'Complete collection of Orthodox prayers for daily spiritual practice',
'ለዕለታዊ መንፈሳዊ ልምምድ የኦርቶዶክስ ጸሎቶች ሙሉ ስብስብ',
'/ebooks/orthodox-prayer-book.pdf', 'pdf', 'Prayer', 'en'),

('The Book of Hours', 'የሰዓታት መጽሐፍ',
'Traditional Ethiopian Orthodox liturgical hours and prayers',
'ተለምዷዊ የኢትዮጵያ ኦርቶዶክስ ሊተርጂካል ሰዓታት እና ጸሎቶች',
'/ebooks/book-of-hours.pdf', 'pdf', 'Liturgy', 'am');
