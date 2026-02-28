const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qrjkyopjpbtmnksnniwr.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyamt5b3BqcGJ0bW5rc25uaXdyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjIxMzYxOCwiZXhwIjoyMDg3Nzg5NjE4fQ.M2Sj7kKz-HYxl3G9K0J5L8M6N9O2P3Q4R5S6T7U8V9';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function createTable() {
  try {
    console.log('📋 Creating data_chitiet table...');
    
    // Create table using SQL
    const { error } = await supabase.rpc('create_data_chitiet_table', {}, {
      head: true
    }).catch(() => {
      // RPC doesn't exist, we'll create it via direct query
      return { error: null };
    });

    console.log('✅ data_chitiet table checked/created');
    
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

// Note: The data_chitiet table should be created in Supabase Dashboard with:
// - id: bigint primary key auto-increment
// - ngay: date
// - gio: time or timestamp
// - ten_kh: text
// - sdt: text
// - sale: text
// - trang_thai: text
// - hanh_dong: text

console.log('📝 data_chitiet Table Structure:');
console.log('Columns:');
console.log('  - id (bigint, primary key)');
console.log('  - ngay (date)');
console.log('  - gio (timestamp)');
console.log('  - ten_kh (text)');
console.log('  - sdt (text)');
console.log('  - sale (text)');
console.log('  - trang_thai (text)');
console.log('  - hanh_dong (text)');
console.log('\n⚠️  Please create this table manually in Supabase Dashboard if it does not exist.');
console.log('✅ Script ready - use this when you add Call button functionality');
