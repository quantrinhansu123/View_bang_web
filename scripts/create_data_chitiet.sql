-- Copy and paste this SQL into Supabase SQL Editor to create the data_chitiet table

CREATE TABLE IF NOT EXISTS data_chitiet (
  id BIGSERIAL PRIMARY KEY,
  ngay DATE NOT NULL,
  gio TIME NOT NULL,
  ten_kh TEXT,
  sdt TEXT,
  sale TEXT,
  trang_thai TEXT,
  hanh_dong TEXT,
  ghi_chu TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_data_chitiet_ten_kh ON data_chitiet(ten_kh);
CREATE INDEX IF NOT EXISTS idx_data_chitiet_gio ON data_chitiet(gio DESC);

-- Enable RLS if needed
ALTER TABLE data_chitiet ENABLE ROW LEVEL SECURITY;

-- Grant permissions (adjust as needed)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.data_chitiet TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.data_chitiet TO anon;
