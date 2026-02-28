-- If your data_chitiet table already exists WITHOUT the ghi_chu column,
-- run this SQL in Supabase SQL Editor to add it:

ALTER TABLE data_chitiet ADD COLUMN IF NOT EXISTS ghi_chu TEXT;

-- After running this, the Note feature will be available!
