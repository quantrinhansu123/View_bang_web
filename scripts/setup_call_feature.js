import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qrjkyopjpbtmnksnniwr.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyamt5b3BqcGJ0bW5rc25uaXdyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjIxMzYxOCwiZXhwIjoyMDg3Nzg5NjE4fQ.M2Sj7kKz-HYxl3G9K0J5L8M6N9O2P3Q4R5S6T7U8V9';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function setupDataChitiet() {
  try {
    console.log('🔍 Checking if data_chitiet table exists...');
    
    // Try to select from table
    const { data, error } = await supabase
      .from('data_chitiet')
      .select('*')
      .limit(0);
    
    if (error && error.code === 'PGRST104') {
      console.log('❌ Table does not exist. Please create it manually:');
      console.log('\n📋 Run this SQL in Supabase Dashboard > SQL Editor:\n');
      
      const sql = `
CREATE TABLE IF NOT EXISTS public.data_chitiet (
  id BIGSERIAL PRIMARY KEY,
  ngay DATE NOT NULL,
  gio TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ten_kh TEXT,
  sdt TEXT,
  sale TEXT,
  trang_thai TEXT,
  hanh_dong TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_data_chitiet_ten_kh ON public.data_chitiet(ten_kh);
CREATE INDEX IF NOT EXISTS idx_data_chitiet_gio ON public.data_chitiet(gio DESC);

ALTER TABLE public.data_chitiet ENABLE ROW LEVEL SECURITY;
      `;
      
      console.log(sql);
      console.log('\n✅ After creating the table, you can use the Call feature!');
    } else if (error) {
      console.error('❌ Error checking table:', error.message);
    } else {
      console.log('✅ data_chitiet table exists!');
      console.log('✅ Call feature is ready to use!');
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

setupDataChitiet();
