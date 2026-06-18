-- Add gamification and telegram fields to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS xp INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS completed_modules INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS telegram_chat_id TEXT;

-- Make sure users and bot can update profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public update profiles" ON public.profiles;
CREATE POLICY "Public update profiles" ON public.profiles FOR UPDATE USING (true);

-- Forum Posts Table
CREATE TABLE IF NOT EXISTS public.forum_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    tags TEXT[] DEFAULT '{}',
    likes INT DEFAULT 0,
    replies INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Forum Replies Table
CREATE TABLE IF NOT EXISTS public.forum_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Calendar Events Table
CREATE TABLE IF NOT EXISTS public.calendar_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    date DATE NOT NULL,
    time TEXT,
    type TEXT NOT NULL, -- e.g., 'Хакатон', 'IELTS', 'Олимпиада'
    color TEXT NOT NULL, -- e.g., 'border-blue-500 text-blue-500 bg-blue-500/10'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS FOR FORUM POSTS
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.forum_posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.forum_posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON public.forum_posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON public.forum_posts;

CREATE POLICY "Public profiles are viewable by everyone" ON public.forum_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON public.forum_posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own posts" ON public.forum_posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own posts" ON public.forum_posts FOR DELETE USING (auth.uid() = author_id);

-- RLS FOR FORUM REPLIES
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public replies are viewable by everyone" ON public.forum_replies;
DROP POLICY IF EXISTS "Authenticated users can create replies" ON public.forum_replies;
DROP POLICY IF EXISTS "Users can update their own replies" ON public.forum_replies;
DROP POLICY IF EXISTS "Users can delete their own replies" ON public.forum_replies;

CREATE POLICY "Public replies are viewable by everyone" ON public.forum_replies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create replies" ON public.forum_replies FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own replies" ON public.forum_replies FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own replies" ON public.forum_replies FOR DELETE USING (auth.uid() = author_id);

-- RLS FOR CALENDAR EVENTS
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Events are viewable by everyone" ON public.calendar_events;
DROP POLICY IF EXISTS "Only admins can create events" ON public.calendar_events;

CREATE POLICY "Events are viewable by everyone" ON public.calendar_events FOR SELECT USING (true);
CREATE POLICY "Only admins can create events" ON public.calendar_events FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Set realtime replication for forum safely
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'forum_posts'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE forum_posts;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'forum_replies'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE forum_replies;
  END IF;
END $$;

-- Dummy Data for Calendar
INSERT INTO public.calendar_events (title, date, type, color) VALUES
('IELTS Mock Test', '2026-10-15', 'IELTS', 'border-blue-500 text-blue-400 bg-blue-500/20'),
('Google Internship Deadline', '2026-10-18', 'Стажировка', 'border-green-500 text-green-400 bg-green-500/20'),
('Республиканская Олимпиада', '2026-10-22', 'Олимпиада', 'border-purple-500 text-purple-400 bg-purple-500/20'),
('Kausar Hackathon', '2026-10-25', 'Хакатон', 'border-[--accent-from] text-[--accent-to] bg-[--accent-from]/20')
ON CONFLICT DO NOTHING;
