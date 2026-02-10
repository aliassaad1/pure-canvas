
-- Products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'other',
  image_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sellers can manage their own products" ON public.products FOR ALL USING (
  seller_id IN (SELECT id FROM public.sellers WHERE user_id = auth.uid())
);

CREATE POLICY "Anyone can view available products" ON public.products FOR SELECT USING (is_available = true);

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Order status enum
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'preparing', 'delivered', 'cancelled');

-- Orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID NOT NULL REFERENCES public.buyers(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  status public.order_status NOT NULL DEFAULT 'pending',
  buyer_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sellers can view their orders" ON public.orders FOR SELECT USING (
  seller_id IN (SELECT id FROM public.sellers WHERE user_id = auth.uid())
);

CREATE POLICY "Sellers can update their orders" ON public.orders FOR UPDATE USING (
  seller_id IN (SELECT id FROM public.sellers WHERE user_id = auth.uid())
);

CREATE POLICY "Buyers can view their orders" ON public.orders FOR SELECT USING (
  buyer_id IN (SELECT id FROM public.buyers WHERE user_id = auth.uid())
);

CREATE POLICY "Buyers can create orders" ON public.orders FOR INSERT WITH CHECK (
  buyer_id IN (SELECT id FROM public.buyers WHERE user_id = auth.uid())
);

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
