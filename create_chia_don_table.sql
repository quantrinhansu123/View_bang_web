-- Create chia_don table
CREATE TABLE IF NOT EXISTS chia_don (
  id SERIAL PRIMARY KEY,
  ho_va_ten TEXT NOT NULL,
  uu_tien TEXT,
  bo_phan TEXT NOT NULL
);

-- Insert data
INSERT INTO chia_don (ho_va_ten, uu_tien, bo_phan) VALUES
('Vanny', NULL, 'Sale'),
('DinHou', NULL, 'Sale'),
('Nika', NULL, 'Sale'),
('Sreynith', NULL, 'Sale'),
('Rachana', NULL, 'Sale'),
('Sokvang', NULL, 'Sale'),
('Ing Sony', NULL, 'Sale'),
('Sreymean', NULL, 'Sale'),
('lysophy', NULL, 'Sale'),
('Tsovanchetra', 'U1', 'Sale'),
('Tsreyraksa', 'U1', 'Sale'),
('Vathana', NULL, 'Sale'),
('Yu Heang', NULL, 'Sale'),
('Sreynith_2003', NULL, 'Sale'),
('Sreypov', NULL, 'Sale'),
('Sokmach_vd', NULL, 'Vận đơn'),
('Thany_vd', NULL, 'Vận đơn'),
('Sovannimul', NULL, 'Sale'),
('Hourg', NULL, 'Sale')
ON CONFLICT DO NOTHING;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_chia_don_ho_va_ten ON chia_don(ho_va_ten);
CREATE INDEX IF NOT EXISTS idx_chia_don_bo_phan ON chia_don(bo_phan);

-- Enable Row Level Security
ALTER TABLE chia_don ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow all access to chia_don" ON chia_don;

-- Create policy to allow all operations
CREATE POLICY "Allow all access to chia_don" ON chia_don
  FOR ALL USING (true) WITH CHECK (true);

-- Grant permissions
GRANT ALL ON chia_don TO postgres, anon, authenticated, service_role;
GRANT USAGE, SELECT ON SEQUENCE chia_don_id_seq TO postgres, anon, authenticated, service_role;
