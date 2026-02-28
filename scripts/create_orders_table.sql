-- Create order table in Supabase SQL Editor

DROP TABLE IF EXISTS public.orders;

CREATE TABLE public.orders (
  id BIGSERIAL PRIMARY KEY,
  ma_don_hang TEXT NOT NULL,
  ngay DATE NOT NULL,
  gio TIME,
  ten_kh TEXT,
  sdt TEXT,
  dia_chi TEXT,
  vuon TEXT,
  dien_tich NUMERIC,
  cay_trong TEXT,
  ghi_chu TEXT,
  status TEXT,
  san_pham TEXT,
  don_vi_tien TEXT,
  ti_gia NUMERIC,
  gia_riel NUMERIC,
  gia_usd NUMERIC,
  trang_thai_van_don TEXT,
  don_vi_van_chuyen TEXT,
  nv_van_don TEXT,
  sale TEXT,
  mkt TEXT,
  nguon_toi TEXT,
  truc_page TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_ma_don_hang ON public.orders(ma_don_hang);
CREATE INDEX IF NOT EXISTS idx_orders_ngay ON public.orders(ngay DESC);
CREATE INDEX IF NOT EXISTS idx_orders_ten_kh ON public.orders(ten_kh);
CREATE INDEX IF NOT EXISTS idx_orders_sdt ON public.orders(sdt);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
DROP POLICY IF EXISTS "Allow all access to orders" ON public.orders;
CREATE POLICY "Allow all access to orders" ON public.orders
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Grant permissions
GRANT ALL ON public.orders TO authenticated;
GRANT ALL ON public.orders TO anon;
GRANT USAGE, SELECT ON SEQUENCE public.orders_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.orders_id_seq TO anon;
