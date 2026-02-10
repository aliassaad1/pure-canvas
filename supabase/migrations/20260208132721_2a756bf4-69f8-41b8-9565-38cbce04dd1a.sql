-- Create enum for business types
CREATE TYPE public.business_type AS ENUM ('restaurant', 'grocery', 'clothing', 'electronics', 'beauty', 'services', 'other');

-- Create enum for delivery options
CREATE TYPE public.delivery_option AS ENUM ('pickup', 'delivery', 'both');

-- Create buyers table
CREATE TABLE public.buyers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    city_area TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    preferred_language TEXT NOT NULL DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id)
);

-- Create sellers table
CREATE TABLE public.sellers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    business_name TEXT NOT NULL,
    business_type business_type NOT NULL,
    business_description TEXT,
    city_area TEXT NOT NULL,
    business_address TEXT NOT NULL,
    working_hours_open TIME NOT NULL,
    working_hours_close TIME NOT NULL,
    delivery_option delivery_option NOT NULL,
    accepts_cash BOOLEAN NOT NULL DEFAULT false,
    accepts_card BOOLEAN NOT NULL DEFAULT false,
    accepts_omt BOOLEAN NOT NULL DEFAULT false,
    accepts_whish BOOLEAN NOT NULL DEFAULT false,
    whatsapp_number TEXT NOT NULL,
    instagram_handle TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for buyers
CREATE POLICY "Users can view their own buyer profile" 
ON public.buyers 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own buyer profile" 
ON public.buyers 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own buyer profile" 
ON public.buyers 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for sellers
CREATE POLICY "Users can view their own seller profile" 
ON public.sellers 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own seller profile" 
ON public.sellers 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own seller profile" 
ON public.sellers 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Public can view seller profiles (for marketplace)
CREATE POLICY "Anyone can view seller profiles" 
ON public.sellers 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_buyers_updated_at
BEFORE UPDATE ON public.buyers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sellers_updated_at
BEFORE UPDATE ON public.sellers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();