import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qrjkyopjpbtmnksnniwr.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyamt5b3BqcGJ0bW5rc25uaXdyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjIxMzYxOCwiZXhwIjoyMDg3Nzg5NjE4fQ.Iw42iQAO5FJvitL5pTvksCtyn8MPD4wByYlu0sjYwpg';

const supabase = createClient(supabaseUrl, serviceKey);

async function insertNhanSu() {
  console.log('Inserting data into nhan_su table...');
  
  const nhanSuData = [
    { ho_va_ten: 'Vanny', uu_tien: '', bo_phan: 'Sale', gio_chia: '2025-12-02 13:36:22' },
    { ho_va_ten: 'DinHou', uu_tien: '', bo_phan: 'Sale', gio_chia: '2025-12-01 09:09:24' },
    { ho_va_ten: 'Nika', uu_tien: '', bo_phan: 'Sale', gio_chia: '2025-12-02 13:37:13' },
    { ho_va_ten: 'Sreynith', uu_tien: '', bo_phan: 'Sale', gio_chia: '2025-12-02 10:16:18' },
    { ho_va_ten: 'Rachana', uu_tien: '', bo_phan: 'Sale', gio_chia: '2025-12-02 13:37:44' },
    { ho_va_ten: 'Sokvang', uu_tien: '', bo_phan: 'Sale', gio_chia: null },
    { ho_va_ten: 'Ing Sony', uu_tien: '', bo_phan: 'Sale', gio_chia: null },
    { ho_va_ten: 'Sreymean', uu_tien: '', bo_phan: 'Sale', gio_chia: '2025-12-02 13:38:38' },
    { ho_va_ten: 'lysophy', uu_tien: '', bo_phan: 'Sale', gio_chia: '2025-12-02 13:39:29' },
    { ho_va_ten: 'Tsovanchetra', uu_tien: 'U1', bo_phan: 'Sale', gio_chia: '2025-12-03 20:10:48' },
    { ho_va_ten: 'Tsreyraksa', uu_tien: 'U1', bo_phan: 'Sale', gio_chia: '2025-12-03 19:36:25' },
    { ho_va_ten: 'Vathana', uu_tien: '', bo_phan: 'Sale', gio_chia: '2025-12-01 07:17:06' },
    { ho_va_ten: 'Yu Heang', uu_tien: '', bo_phan: 'Sale', gio_chia: '2025-12-01 09:03:58' },
    { ho_va_ten: 'Sreynith_2003', uu_tien: '', bo_phan: 'Sale', gio_chia: '2025-12-02 13:51:00' },
    { ho_va_ten: 'Sreypov', uu_tien: '', bo_phan: 'Sale', gio_chia: null },
    { ho_va_ten: 'Sokmach_vd', uu_tien: '', bo_phan: 'Van don', gio_chia: null },
    { ho_va_ten: 'Thany_vd', uu_tien: '', bo_phan: 'Van don', gio_chia: null },
    { ho_va_ten: 'Sovannimul', uu_tien: '', bo_phan: 'Sale', gio_chia: '2025-12-02 13:53:28' },
    { ho_va_ten: 'Hourg', uu_tien: '', bo_phan: 'Sale', gio_chia: null },
  ];
  
  const { data, error } = await supabase
    .from('nhan_su')
    .insert(nhanSuData)
    .select();
  
  if (error) {
    console.error('Insert ERROR:', error.message);
    console.error('Code:', error.code);
    
    if (error.code === 'PGRST205' || error.code === '42P01') {
      console.log('\n⚠️  Table nhan_su does not exist!');
      console.log('\n📋 Please run this SQL in Supabase Dashboard > SQL Editor:\n');
      console.log(`
CREATE TABLE nhan_su (
  id SERIAL PRIMARY KEY,
  ho_va_ten VARCHAR(255),
  uu_tien VARCHAR(50),
  bo_phan VARCHAR(100),
  gio_chia TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS to allow public access
ALTER TABLE nhan_su DISABLE ROW LEVEL SECURITY;
      `);
    }
  } else {
    console.log('✅ SUCCESS! Inserted', data?.length, 'rows');
    console.log('Columns:', Object.keys(data[0]));
  }
}

insertNhanSu();
