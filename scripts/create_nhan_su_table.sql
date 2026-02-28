-- Create nhan_su (Employee) table in Supabase

-- Drop existing table if it exists (to ensure clean recreate)
DROP TABLE IF EXISTS public.nhan_su;

CREATE TABLE public.nhan_su (
  id TEXT PRIMARY KEY,
  phong_ban TEXT,
  vi_tri TEXT,
  ho_va_ten TEXT,
  email TEXT,
  password TEXT,
  ngay_vao_cong_ty TEXT,
  chi_nhanh TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert sample data
INSERT INTO public.nhan_su (id, phong_ban, vi_tri, ho_va_ten, email, password, ngay_vao_cong_ty, chi_nhanh) VALUES
('đsdsdsd1', 'Admin', 'Admin', 'CEO', 'ceo.fata@gmail.com', '', '9/22/2025', 'Việt Nam'),
('đsdsdsd2', 'Admin', 'Leader', 'Công', 'vhns@nashimart.io.vn', '', '9/17/2025', ''),
('đsdsdsd3', 'Admin', 'Leader', 'Sale Admin', 'managersalekama@gmail.com', '', '10/8/2025', 'Cam'),
('đsdsdsd4', 'CSKH', 'NV', 'Nhanh', 'n8370672@gmail.com', '', '', ''),
('đsdsdsd5', 'CSKH', 'NV', 'Chanda', 'youronlychanda@gmail.com', '', '', ''),
('đsdsdsd6', 'CSKH', 'NV', 'Sreypop', 'sreypopyon8@gmail.com', '', '', ''),
('đsdsdsd7', 'CSKH', 'NV', 'Sopheakim', 'sopheavykim558@gmail.com', '', '', ''),
('đsdsdsd9', 'Kho', 'NV', 'Heng Seyha', 'seyhanhi12345@gmail.com', '', '', ''),
('đsdsdsd10', 'Admin', '', 'Lead MKT Phong', 'thanhphongkama@gmail.com', '', '', 'Việt Nam'),
('đsdsdsd11', 'Marketing', 'Admin', 'MKT Hieu', 'Vudinhhieudhqghn@gmail.com', '', '', 'Việt Nam'),
('đsdsdsd12', 'Marketing', 'NV', 'MKT Quang 8', 'balenguyenq@gmail.com', '', '', ''),
('đsdsdsd13', 'Marketing', 'NV', 'MKT Manh', 'dinhm9925@gmail.com', '', '', ''),
('đsdsdsd14', 'Marketing', 'NV', 'Phan Phong MKT 19', 'dinhnguyen302229@gmail.com', '', '', ''),
('đsdsdsd15', 'Marketing', 'NV', 'MKT Duc Phong', 'ducphonga2dt@gmail.com', '', '', ''),
('đsdsdsd16', 'Marketing', 'NV', 'Tuan MKT 10', 'lat26112000@gmail.com', '', '', ''),
('đsdsdsd17', 'Marketing', 'NV', 'MKT VUONG', 'levuong.vn8724@gmail.com', '', '', ''),
('đsdsdsd18', 'Marketing', 'NV', 'Dinh MKT 11', 'nguyentruongdinh2806@gmail.com', '', '', ''),
('đsdsdsd19', 'Marketing', 'NV', 'Toàn MKT 23', 'nguyenvantoan.nvt.20@gmail.com', '', '', ''),
('đsdsdsd20', 'Marketing', 'NV', 'Tiem MKT 14', 'phambatiem310@gmail.com', '', '', ''),
('đsdsdsd21', 'Marketing', 'NV', 'Phuong MKT 12', 'phuongvu11062003@gmail.com', '', '', ''),
('đsdsdsd22', 'Marketing', 'NV', 'Hoang Quan MKT 20', 'quandh.vivahomes@gmail.com', '', '', ''),
('đsdsdsd23', 'Marketing', 'NV', 'Minh MKT 7', 'tranbinhminh0904@gmail.com', '', '', ''),
('đsdsdsd24', 'Marketing', 'NV', 'Tran Duong MKT 21', 'tranduog2705@gmail.com', '', '', ''),
('đsdsdsd25', 'Marketing', 'NV', 'Tu Cao MKT 22', 'tucao.teg@gmail.com', '', '', ''),
('đsdsdsd26', 'Sale', 'NV', 'Vanny', 'boeurnvanny178@gmail.com', '', '30/06/2024', ''),
('đsdsdsd27', 'Sale', 'NV', 'Sreypov', 'hengsreypov2001@gmail.com', '', '17/05/2024', ''),
('đsdsdsd28', 'Sale', 'NV', 'DinHou', 'houd10828@gmail.com', '', '02/12/2024', ''),
('đsdsdsd29', 'Sale', 'NV', 'Nika', 'molika01082025@gmail.com', '', '01/08/2025', ''),
('đsdsdsd30', 'Sale', 'NV', 'Sreynith', 'ransreynith4444@gmail.com', '', '18/08/2025', ''),
('đsdsdsd31', 'Sale', 'NV', 'Rachana', 'seanrachana0@gmail.com', '', '18/08/2025', ''),
('đsdsdsd32', 'Sale', 'NV', 'Sokvang', 'sokvangn@gmail.com', '', '27/07/2025', ''),
('đsdsdsd33', 'Sale', 'NV', 'Ing Sony', 'ingsony8487@gmail.com', '', '29/11/2024', ''),
('đsdsdsd34', 'Sale', 'NV', 'Sreymean', 'sreymeanva66@gmail.com', '', '21/08/2025', ''),
('đsdsdsd35', 'Sale', 'NV', 'lysophy', 'ts.lysophy@gmail.com', '', '05/12/2024', ''),
('đsdsdsd36', 'Sale', 'NV', 'Tsovanchetra', 'tsovanchetra@gmail.com', '', '01/05/2025', ''),
('đsdsdsd37', 'Sale', 'NV', 'Tsreyraksa', 'tsreyraksa@gmail.com', '', '03/05/2025', ''),
('đsdsdsd38', 'Sale', 'NV', 'Vathana', 'Vathanaream117@gmail.com', '', '29/05/2025', ''),
('đsdsdsd39', 'Sale', 'NV', 'Yu Heang', 'Yuheang90@gmail.com', '', '06/05/2025', ''),
('đsdsdsd40', 'Trực Page', 'NV', 'SREYLUON', 'chhengsreyluon6@gmail.com', '', '', ''),
('đsdsdsd41', 'Trực Page', 'NV', 'Nie', 'nieeniee812@gmail.com', '', '', ''),
('đsdsdsd42', 'Vận đơn', 'NV', 'Sokmach_vd', 'sokmachrina@gmail.com', '', '', 'Cam'),
('đsdsdsd43', 'Vận đơn', 'NV', 'Thany_vd', 'tthourthany@gmail.com', '', '', 'Cam'),
('đsdsdsd45', 'CSKH', 'NV', 'Long Sanyo', 'longsayon139@gmail.com', '', '9/29/2025', ''),
('đsdsdsd46', 'CSKH', 'NV', 'Chantho', 'Phanchantho27@gmail.com', '', '29/09/2025', ''),
('đsdsdsd47', 'CSKH', 'NV', 'Chanthy', 'Ounthi888@gmail.com', '', '9/29/2025', ''),
('đsdsdsd48', 'Sale', 'NV', 'Vasreyya', 'vasreyya178@gmail.com', '', '02/12/2024', ''),
('đsdsdsd49', 'Sale', 'NV', 'Hourg', 'Chhayvannchhay19@gmail.com', '', '10/2/2025', ''),
('đsdsdsd50', 'Trực Page', 'NV', 'Linna', 'bolinna143@gmail.com', '', '10/2/2025', ''),
('đsdsdsd51', 'Marketing', 'NV', 'MKT Phuoc 16', 'Hoangphuoc165@gmail.com', '', '10/4/2025', ''),
('đsdsdsd52', 'Sale', 'NV', 'Sreynith_2003', 's02557548@gmail.com', '', '10/6/2025', ''),
('đsdsdsd53', 'CSKH', 'NV', 'Mat Asia', 'matasiza@gmail.com', '', '10/7/2025', ''),
('đsdsdsd54', 'Kho', 'NV', 'Lê Tuấn Lực', 'letuanluc2@gmail.com', '', '10/8/2025', ''),
('9cd31c3b', 'Sale', 'NV', 'Sovannimul', 'bongdom345764@gmail.com', '', '17/10/2025', ''),
('c0ceff1b', 'Kế toán', 'NV', 'Hoàng Hà', 'hoangthithuha0104@gmail.com', '', '29/10/2025', ''),
('65f0e766', 'Marketing', 'NV', 'Hoàng Minh MKT 24', 'vanmjnh123xx@gmail.com', '', '07/11/2025', ''),
('402a6c11', 'Marketing', 'NV', 'Vũ Cần MKT 27', 'canvm2528@gmail.com', '', '07/11/2025', ''),
('8930ee71', 'Marketing', 'NV', 'Hoàng Anh MKT 25', 'hoanganh17821@gmail.com', '', '07/11/2025', ''),
('b7f737dc', 'Admin', 'Admin', 'Oanh Kieu', 'oanhhh1102@gmail.com', '', '13/11/2025', ''),
('6338c4da', 'Marketing', 'NV', 'Dần MKT 28', 'doandan24798@gmail.com', '', '17/11/2025', ''),
('f9b102fb', 'CSKH', 'NV', 'Hean Sodalen', 'heansodalen17@gmail.com', '', '01/11/2025', ''),
('0926344b', 'Marketing', 'NV', 'Lê Huy Hoàng', 'hoanglee17122002@gmail.com', '', '21/11/2025', ''),
('e7bbc32c', 'Kế toán', 'Admin', 'Huyền Anh', 'ketoannoibokama@gmail.com', '', '22/11/2025', ''),
('a6f524a2', 'Marketing', 'NV', 'Biokama 29 MKT Dũng', 'dungnguyen20703@gmail.com', '', '24/11/2025', ''),
('86eb294b', 'Marketing', 'NV', 'Bình Nguyên', 'nbn.hn3333@gmail.com', '', '26/11/2025', ''),
('17e91a62', 'Marketing', 'NV', 'Đình Dũng', 'dungnguyen2499@gmail.com', '', '26/11/2025', '')
ON CONFLICT (id) DO NOTHING;

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_nhan_su_phong_ban ON public.nhan_su(phong_ban);
CREATE INDEX IF NOT EXISTS idx_nhan_su_vi_tri ON public.nhan_su(vi_tri);
CREATE INDEX IF NOT EXISTS idx_nhan_su_email ON public.nhan_su(email);
CREATE INDEX IF NOT EXISTS idx_nhan_su_ho_va_ten ON public.nhan_su(ho_va_ten);

-- Enable RLS
ALTER TABLE public.nhan_su ENABLE ROW LEVEL SECURITY;

-- Add RLS policies (using service_role so all operations work)
CREATE POLICY "Allow all access for authenticated users" ON public.nhan_su
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.nhan_su TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.nhan_su TO anon;
