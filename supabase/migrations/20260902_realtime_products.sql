-- FreshMart Real-Time Product Pricing & Inventory Availability Migration
-- File: supabase/migrations/20260902_realtime_products.sql

-- 1. Create or Upgrade Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category_id TEXT,
    category TEXT NOT NULL,
    sub_category TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    mrp NUMERIC(10, 2) CHECK (mrp >= price),
    stock_quantity INTEGER NOT NULL DEFAULT 50 CHECK (stock_quantity >= 0),
    is_available BOOLEAN NOT NULL DEFAULT true,
    discount_percentage NUMERIC(5, 2) DEFAULT 0,
    unit TEXT DEFAULT '1 unit',
    brand TEXT DEFAULT 'FreshMart',
    image_url TEXT,
    badge TEXT,
    rating NUMERIC(3, 2) DEFAULT 4.5,
    reviews_count INTEGER DEFAULT 100,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_available ON public.products(is_available);
CREATE INDEX IF NOT EXISTS idx_products_stock ON public.products(stock_quantity);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies: Public Read Access
DROP POLICY IF EXISTS "Public products read access" ON public.products;
CREATE POLICY "Public products read access"
ON public.products FOR SELECT
USING (true);

-- 5. RLS Policies: Restricted Admin Write Access
DROP POLICY IF EXISTS "Admin write access to products" ON public.products;
CREATE POLICY "Admin write access to products"
ON public.products FOR ALL
USING (auth.role() = 'service_role' OR auth.jwt() ->> 'email' LIKE '%admin%')
WITH CHECK (auth.role() = 'service_role' OR auth.jwt() ->> 'email' LIKE '%admin%');

-- 6. Atomic Inventory Decrement Function (Prevents Overselling & Race Conditions)
CREATE OR REPLACE FUNCTION public.decrease_product_stock_atomic(
    p_product_id TEXT,
    p_quantity INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_current_stock INTEGER;
    v_is_available BOOLEAN;
    v_new_stock INTEGER;
BEGIN
    -- Lock product row for update
    SELECT stock_quantity, is_available 
    INTO v_current_stock, v_is_available
    FROM public.products
    WHERE id = p_product_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Product not found', 'code', 'NOT_FOUND');
    END IF;

    IF NOT v_is_available OR v_current_stock < p_quantity THEN
        RETURN jsonb_build_object(
            'success', false, 
            'error', 'Insufficient stock available', 
            'code', 'INSUFFICIENT_STOCK',
            'available_stock', v_current_stock
        );
    END IF;

    v_new_stock := v_current_stock - p_quantity;

    -- Update stock and auto-toggle is_available when reaching 0
    UPDATE public.products
    SET 
        stock_quantity = v_new_stock,
        is_available = (v_new_stock > 0),
        updated_at = NOW()
    WHERE id = p_product_id;

    RETURN jsonb_build_object(
        'success', true, 
        'product_id', p_product_id, 
        'previous_stock', v_current_stock, 
        'new_stock', v_new_stock,
        'is_available', (v_new_stock > 0)
    );
END;
$$;

-- 7. Enable Supabase Realtime Publication for Products Table
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
    END IF;
EXCEPTION WHEN OTHERS THEN
    -- Ignore if already added
END $$;
