-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_status TEXT CHECK (subscription_status IN ('free', 'premium')) DEFAULT 'free' NOT NULL,
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  interview_credits INTEGER DEFAULT 3 NOT NULL,
  total_interviews INTEGER DEFAULT 0 NOT NULL
);

-- Create interview_sessions table
CREATE TABLE IF NOT EXISTS public.interview_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  interview_type TEXT CHECK (interview_type IN ('behavioral', 'technical', 'system_design')) NOT NULL,
  difficulty_level TEXT CHECK (difficulty_level IN ('entry', 'mid', 'senior')) NOT NULL,
  position_title TEXT,
  company_name TEXT,
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending' NOT NULL,
  score NUMERIC(3,1) CHECK (score >= 0 AND score <= 10),
  feedback JSONB,
  duration_minutes INTEGER,
  questions_asked JSONB,
  responses_given JSONB
);

-- Create preorders table
CREATE TABLE IF NOT EXISTS public.preorders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  source TEXT,
  utm_campaign TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  interested_features TEXT[],
  expected_launch_interest INTEGER CHECK (expected_launch_interest >= 1 AND expected_launch_interest <= 10),
  converted_to_user BOOLEAN DEFAULT FALSE NOT NULL,
  converted_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_interview_sessions_user_id ON public.interview_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_status ON public.interview_sessions(status);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_created_at ON public.interview_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_preorders_email ON public.preorders(email);
CREATE INDEX IF NOT EXISTS idx_preorders_created_at ON public.preorders(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER interview_sessions_updated_at
  BEFORE UPDATE ON public.interview_sessions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preorders ENABLE ROW LEVEL SECURITY;