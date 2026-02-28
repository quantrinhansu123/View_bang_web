import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qrjkyopjpbtmnksnniwr.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyamt5b3BqcGJ0bW5rc25uaXdyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjIxMzYxOCwiZXhwIjoyMDg3Nzg5NjE4fQ.Iw42iQAO5FJvitL5pTvksCtyn8MPD4wByYlu0sjYwpg';

const supabase = createClient(supabaseUrl, serviceKey);

async function testInsert() {
  console.log('Testing insert into data_chitiet...');
  
  const testData = [
    {
      ngay: '2026-02-28',
      gio: '09:30:00',
      ten_kh: 'Nguyen Van A',
      sdt: '0901234567',
      sale: 'Tran B',
      trang_thai: 'Cho xu ly',
      hanh_dong: 'Goi dien'
    },
    {
      ngay: '2026-02-28',
      gio: '10:15:00',
      ten_kh: 'Tran Thi B',
      sdt: '0912345678',
      sale: 'Nguyen C',
      trang_thai: 'Da hoan thanh',
      hanh_dong: 'Gui email'
    },
    {
      ngay: '2026-02-27',
      gio: '14:00:00',
      ten_kh: 'Le Van C',
      sdt: '0923456789',
      sale: 'Pham D',
      trang_thai: 'Dang xu ly',
      hanh_dong: 'Gap mat'
    }
  ];
  
  const { data, error } = await supabase
    .from('data_chitiet')
    .insert(testData)
    .select();
  
  if (error) {
    console.error('Insert ERROR:', error.message);
    console.error('Code:', error.code);
    console.error('Details:', error.details);
    
    if (error.code === '42P01') {
      console.log('\n⚠️  Table data_chitiet does not exist!');
      console.log('\n📋 Please run this SQL in Supabase Dashboard > SQL Editor:\n');
      console.log(`
CREATE TABLE data_chitiet (
  id SERIAL PRIMARY KEY,
  ngay DATE,
  gio TIME,
  ten_kh VARCHAR(255),
  sdt VARCHAR(20),
  sale VARCHAR(255),
  trang_thai VARCHAR(100),
  hanh_dong VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Allow public access (optional, for testing)
ALTER TABLE data_chitiet ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON data_chitiet FOR ALL USING (true);
      `);
    }
  } else {
    console.log('✅ SUCCESS! Inserted', data?.length, 'rows');
    console.log('Columns:', Object.keys(data[0]));
    console.log('Sample:', JSON.stringify(data[0], null, 2));
  }
}

testInsert();
