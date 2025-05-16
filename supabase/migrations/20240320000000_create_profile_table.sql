-- Create profile table
CREATE TABLE IF NOT EXISTS public.profile (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    stripe_customer_id TEXT UNIQUE,
    email TEXT UNIQUE,
    full_name TEXT,
    shipping_address JSONB,
    billing_address JSONB
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.profile
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profile
    FOR UPDATE
    USING (auth.uid() = id);

-- Create a trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profile (id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profile_updated_at
    BEFORE UPDATE ON public.profile
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column(); 