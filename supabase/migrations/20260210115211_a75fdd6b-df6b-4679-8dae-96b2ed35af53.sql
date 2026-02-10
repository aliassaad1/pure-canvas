
-- Create ai_agent_config table for seller AI chatbot settings
CREATE TABLE public.ai_agent_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  
  -- Knowledge Base
  store_description TEXT DEFAULT '',
  faq JSONB DEFAULT '[]'::jsonb,
  return_policy TEXT DEFAULT '',
  delivery_time_estimate TEXT DEFAULT '',
  minimum_order_amount NUMERIC DEFAULT 0,
  special_instructions TEXT DEFAULT '',

  -- Agent Personality
  agent_name TEXT DEFAULT 'Shopping Assistant',
  tone TEXT DEFAULT 'friendly' CHECK (tone IN ('professional', 'friendly', 'casual')),
  language TEXT DEFAULT 'both' CHECK (language IN ('arabic', 'english', 'both')),
  auto_greeting TEXT DEFAULT 'Hi! Welcome to our store 👋 How can I help you today?',

  -- Order Settings
  can_take_orders BOOLEAN DEFAULT true,
  can_give_quotes BOOLEAN DEFAULT true,
  collect_delivery_address BOOLEAN DEFAULT true,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

  UNIQUE(seller_id)
);

-- Enable RLS
ALTER TABLE public.ai_agent_config ENABLE ROW LEVEL SECURITY;

-- Sellers can manage their own config
CREATE POLICY "Sellers can view their own ai config"
  ON public.ai_agent_config FOR SELECT
  USING (seller_id IN (SELECT id FROM public.sellers WHERE user_id = auth.uid()));

CREATE POLICY "Sellers can insert their own ai config"
  ON public.ai_agent_config FOR INSERT
  WITH CHECK (seller_id IN (SELECT id FROM public.sellers WHERE user_id = auth.uid()));

CREATE POLICY "Sellers can update their own ai config"
  ON public.ai_agent_config FOR UPDATE
  USING (seller_id IN (SELECT id FROM public.sellers WHERE user_id = auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_ai_agent_config_updated_at
  BEFORE UPDATE ON public.ai_agent_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
