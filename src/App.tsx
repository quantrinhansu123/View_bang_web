import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  ArrowLeft, 
  Filter, 
  Trash2, 
  Pencil, 
  Eye,
  ExternalLink,
  List,
  LayoutGrid,
  ChevronDown,
  MoreHorizontal,
  X,
  Briefcase,
  FileText,
  Hash,
  RotateCcw,
  GripVertical,
  Phone
} from 'lucide-react';
import { Reorder, useDragControls } from 'motion/react';
import { supabase } from './services/supabase';

// Column name mapping (Vietnamese to English)
const columnNameMap: { [key: string]: string } = {
  'ngay': 'Date',
  'ho_ten': 'Customer Name',
  'sdt': 'Phone',
  'ghi_chu': 'Notes',
  'trang_thai': 'Status',
  'gio': 'Time',
  'mkt_pt': 'Source',
  'sale': 'Sales Person',
  'truc_page_pt': 'Page Support',
  'nguon_toi': 'Source Channel',
  'so_lan': 'Số lần gọi',
  'ho_va_ten': 'Name',
  'uu_tien': 'Priority',
  'bo_phan': 'Department',
  'data_count': 'Customer Count',
};

// Mock Data
type Status = 'pending' | 'approved' | 'draft' | 'rejected';

interface Proposal {
  id?: string;
  ngay?: string;        // Ngày
  ho_ten?: string;      // Tên KH
  sdt?: string;         // SĐT
  ghi_chu?: string;     // Ghi chú
  trang_thai?: string;  // Trạng thái
  gio?: string;         // Giờ
  mkt_pt?: string;      // MKT / Nguồn MKT
  sale?: string;        // Sale
  truc_page_pt?: string; // Trực Page
  nguon_toi?: string;   // Nguồn tới
}

const proposals: Proposal[] = [
  {
    id: '1',
    ngay: '28/02/2026',
    ho_ten: 'Nguyễn Văn A',
    sdt: '0901234567',
    ghi_chu: 'Customer interested in product',
    trang_thai: 'pending',
    gio: '09:30',
    mkt_pt: 'Facebook Ads',
    sale: 'Trần B',
    truc_page_pt: 'Admin 1',
    nguon_toi: 'Facebook',
  },
];

const StatusBadge = ({ status }: { status: Status }) => {
  const styles = {
    pending: 'bg-orange-100 text-orange-600 border-orange-200',
    approved: 'bg-green-100 text-green-600 border-green-200',
    draft: 'bg-gray-100 text-gray-600 border-gray-200',
    rejected: 'bg-red-100 text-red-600 border-red-200',
  };

  const labels = {
    pending: 'Chờ duyệt',
    approved: 'Đã duyệt',
    draft: 'Nháp',
    rejected: 'Từ chối',
  };

  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
  width?: string;
}

const DraggableColumnItem = ({ 
  column, 
  toggleColumn 
}: { 
  column: ColumnConfig; 
  toggleColumn: (key: string) => void;
}) => {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={column}
      dragListener={false}
      dragControls={controls}
      className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded-lg cursor-default group select-none bg-white"
    >
      <div 
        onPointerDown={(e) => controls.start(e)}
        className="cursor-grab active:cursor-grabbing touch-none"
      >
        <GripVertical className="w-3.5 h-3.5 text-gray-300 hover:text-gray-500 transition-colors" />
      </div>
      <div className="relative flex items-center">
        <input 
          type="checkbox" 
          checked={column.visible}
          onChange={() => toggleColumn(column.key)}
          className="peer appearance-none w-3.5 h-3.5 border border-gray-300 rounded checked:bg-orange-500 checked:border-orange-500 transition-colors cursor-pointer"
        />
        <svg className="absolute w-2.5 h-2.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 left-0.5 top-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <span className="text-xs text-gray-700">{column.label}</span>
    </Reorder.Item>
  );
};

export default function App({ initialTab = 'customers' }: { initialTab?: 'customers' | 'people' }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'customers' | 'people'>(initialTab);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
  const [data, setData] = useState<Proposal[]>(proposals);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dynamicColumns, setDynamicColumns] = useState<ColumnConfig[]>([]);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [isCallHistoryModalOpen, setIsCallHistoryModalOpen] = useState(false);
  const [callHistoryData, setCallHistoryData] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [selectedCallRecord, setSelectedCallRecord] = useState<any>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderFormData, setOrderFormData] = useState<any>({});
  const [selectedOrderCustomer, setSelectedOrderCustomer] = useState<any>(null);
  
  // People tab states
  const [peopleData, setPeopleData] = useState<any[]>([]);
  const [peopleLoading, setPeopleLoading] = useState(false);
  const [searchPeople, setSearchPeople] = useState('');
  const [peopleColumns, setPeopleColumns] = useState<ColumnConfig[]>([
    { key: 'ho_va_ten', label: 'Name', visible: true, width: 'min-w-[150px]' },
    { key: 'email', label: 'Email', visible: true, width: 'min-w-[200px]' },
    { key: 'phong_ban', label: 'Department', visible: true, width: 'min-w-[120px]' },
    { key: 'vi_tri', label: 'Position', visible: true, width: 'min-w-[100px]' },
    { key: 'ngay_vao_cong_ty', label: 'Join Date', visible: true, width: 'min-w-[180px]' },
    { key: 'chi_nhanh', label: 'Status', visible: true, width: 'w-32' },
    { key: 'data_count', label: 'Customer Count', visible: true, width: 'w-32' },
  ]);

  // Filter states for Customers tab
  const [globalSearch, setGlobalSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterSales, setFilterSales] = useState<string[]>([]);
  const [filterSource, setFilterSource] = useState<string[]>([]);
  const [filterPageSupport, setFilterPageSupport] = useState<string[]>([]);
  const [filterSourceChannel, setFilterSourceChannel] = useState<string[]>([]);
  
  // Dropdown open states
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isSalesOpen, setIsSalesOpen] = useState(false);
  const [isSourceOpen, setIsSourceOpen] = useState(false);
  const [isPageSupportOpen, setIsPageSupportOpen] = useState(false);
  const [isSourceChannelOpen, setIsSourceChannelOpen] = useState(false);
  
  // Orders count
  const [ordersCount, setOrdersCount] = useState(0);

  // Compute filtered data
  const filteredData = data.filter(item => {
    // Global search - search across all visible text fields
    if (globalSearch) {
      const searchLower = globalSearch.toLowerCase();
      const searchableFields = Object.values(item).join(' ').toLowerCase();
      if (!searchableFields.includes(searchLower)) return false;
    }

    // Date range filter
    if (dateFrom && item.ngay && item.ngay < dateFrom) return false;
    if (dateTo && item.ngay && item.ngay > dateTo) return false;

    // Status filter (multiple selection)
    if (filterStatus.length > 0 && !filterStatus.includes(item.trang_thai)) return false;

    // Sales person filter (multiple selection)
    if (filterSales.length > 0 && !filterSales.includes(item.sale)) return false;

    // Source filter (multiple selection)
    if (filterSource.length > 0 && !filterSource.includes(item.nguon_toi)) return false;

    // Page support filter (multiple selection)
    if (filterPageSupport.length > 0 && !filterPageSupport.includes((item as any).truc_page)) return false;

    // Source channel filter (multiple selection)
    if (filterSourceChannel.length > 0 && !filterSourceChannel.includes((item as any).kenh_nguon)) return false;

    return true;
  });

  // Get unique values for filters
  const uniqueStatuses = Array.from(new Set(data.map(d => d.trang_thai).filter(Boolean)));
  const uniqueSales = Array.from(new Set(data.map(d => d.sale).filter(Boolean)));
  const uniqueSources = Array.from(new Set(data.map(d => d.nguon_toi).filter(Boolean)));
  const uniquePageSupports = Array.from(new Set(data.map(d => (d as any).truc_page).filter(Boolean)));
  const uniqueSourceChannels = Array.from(new Set(data.map(d => (d as any).kenh_nguon).filter(Boolean)));

  // Toggle filter checkbox
  const toggleFilterItem = (currentArray: string[], value: string, setter: (arr: string[]) => void) => {
    if (currentArray.includes(value)) {
      setter(currentArray.filter(v => v !== value));
    } else {
      setter([...currentArray, value]);
    }
  };

  // Add new record handler
  const handleAddNew = async () => {
    try {
      const { error } = await supabase
        .from('data_new')
        .insert([formData]);
      
      if (error) {
        setError('❌ Error creating record: ' + error.message);
      } else {
        setError(null);
        setFormData({});
        setIsFormOpen(false);
        fetchData();
      }
    } catch (err) {
      setError('❌ Lỗi: ' + String(err));
    }
  };

  // Delete handler
  const handleDelete = async (id: any) => {
    if (confirm('Are you sure you want to delete this record?')) {
      try {
        const { error } = await supabase
          .from('data_new')
          .delete()
          .eq('id', id);
        
        if (error) {
          setError('❌ Error deleting: ' + error.message);
        } else {
          // Remove from local data
          setData(data.filter(row => row.id !== id));
          setError(null);
        }
      } catch (err: any) {
        setError('❌ Lỗi: ' + err.message);
      }
    }
  };

  // View handler
  const handleView = (row: any) => {
    setSelectedRow(row);
    setIsViewModalOpen(true);
  };

  // Edit handler
  const handleEdit = (row: any) => {
    setEditingRow({ ...row });
    setIsEditModalOpen(true);
  };

  // Handle edit for people records
  const handleEditPerson = (person: any) => {
    setEditingRow({ ...person, isFromPeopleTab: true });
    setIsEditModalOpen(true);
  };

  // Handle delete for people records
  const handleDeletePerson = async (person: any) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    
    try {
      let deleteQuery = supabase
        .from('chia_don')
        .delete();

      if (person.id !== undefined && person.id !== null) {
        deleteQuery = deleteQuery.eq('id', person.id);
      } else {
        deleteQuery = deleteQuery.eq('ho_va_ten', person.ho_va_ten);
      }

      const { error } = await deleteQuery;
      
      if (error) {
        setError('❌ Error deleting: ' + error.message);
      } else {
        setPeopleData(peopleData.filter(p =>
          (person.id !== undefined && person.id !== null)
            ? p.id !== person.id
            : p.ho_va_ten !== person.ho_va_ten
        ));
        setError(null);
      }
    } catch (err: any) {
      setError('❌ Error: ' + err.message);
    }
  };

  // Save edit
  const handleSaveEdit = async () => {
    if (!editingRow) return;
    
    try {
      const tableName = editingRow.isFromPeopleTab ? 'chia_don' : 'data_new';
      const { isFromPeopleTab, data_count, ...dataToSave } = editingRow;

      let updateQuery = supabase
        .from(tableName)
        .update(dataToSave);

      if (editingRow.isFromPeopleTab) {
        if (editingRow.id !== undefined && editingRow.id !== null) {
          updateQuery = updateQuery.eq('id', editingRow.id);
        } else {
          updateQuery = updateQuery.eq('ho_va_ten', editingRow.ho_va_ten);
        }
      } else {
        updateQuery = updateQuery.eq('id', editingRow.id);
      }
      
      const { error } = await updateQuery;
      
      if (error) {
        setError('Error updating: ' + error.message);
      } else {
        if (editingRow.isFromPeopleTab) {
          // Update people data
          setPeopleData(peopleData.map(p => {
            const isMatch = (editingRow.id !== undefined && editingRow.id !== null)
              ? p.id === editingRow.id
              : p.ho_va_ten === editingRow.ho_va_ten;
            return isMatch ? { ...editingRow, data_count: p.data_count } : p;
          }));
        } else {
          // Update customers data
          setData(data.map(row => row.id === editingRow.id ? editingRow : row));
        }
        setIsEditModalOpen(false);
        setEditingRow(null);
        setError(null);
      }
    } catch (err: any) {
      setError('Error: ' + err.message);
    }
  };

  // Call handler - Save action history to data_chitiet
  const handleCall = async (row: any) => {
    try {
      // Open modal immediately with current data (optimistic update)
      setSelectedCustomer(row);
      setIsCallHistoryModalOpen(true);
      
      // Get current call count for this customer by phone number - use count only
      const { count, error: countError } = await supabase
        .from('data_chitiet')
        .select('*', { count: 'exact', head: true })
        .eq('sdt', row.sdt);
      
      const currentCallCount = count || 0;
      
      // If already called 4 times or more, set to floating and don't record new call
      if (currentCallCount >= 4) {
        // Update data_new: clear sale, set status to floating, and update call count
        await supabase
          .from('data_new')
          .update({ 
            sale: '', 
            trang_thai: 'floating',
            so_lan: currentCallCount
          })
          .eq('sdt', row.sdt);
        
        // Update local state immediately
        setData(data.map(item => 
          item.sdt === row.sdt 
            ? { ...item, sale: '', trang_thai: 'floating', so_lan: currentCallCount }
            : item
        ));
        
        setError('⚠️ Called more than 4 times. Customer changed to Floating status.');
        
        // Fetch call history for modal
        const { data: history } = await supabase
          .from('data_chitiet')
          .select('*')
          .eq('sdt', row.sdt)
          .order('ngay', { ascending: false })
          .order('gio', { ascending: false });
        
        setCallHistoryData(history || []);
        return;
      }
      
      // If less than 4 calls, insert new call record
      const callCount = currentCallCount + 1;
      
      // Format current time
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const timeString = `${hours}:${minutes}:${seconds}`;
      const todayString = now.toISOString().split('T')[0];
      
      // Create new call record
      const newCallRecord = {
        ngay: todayString,
        gio: timeString,
        ten_kh: row.ho_ten || '',
        sdt: row.sdt || '',
        sale: row.sale || '',
        trang_thai: row.trang_thai || '',
        hanh_dong: `call ${callCount}`
      };
      
      // Insert into data_chitiet
      const { error } = await supabase
        .from('data_chitiet')
        .insert([newCallRecord]);
      
      if (error) {
        setError('❌ Error saving call history: ' + error.message);
        return;
      }
      
      // Update so_lan (call count) in data_new
      await supabase
        .from('data_new')
        .update({ so_lan: callCount })
        .eq('sdt', row.sdt);
      
      // Update local state immediately (optimistic update)
      setData(data.map(item => 
        item.sdt === row.sdt 
          ? { ...item, so_lan: callCount }
          : item
      ));
      
      // Fetch updated call history for modal
      const { data: history } = await supabase
        .from('data_chitiet')
        .select('*')
        .eq('sdt', row.sdt)
        .order('ngay', { ascending: false })
        .order('gio', { ascending: false });
      
      setCallHistoryData(history || []);
      setError(null);
      
    } catch (err: any) {
      setError('❌ Lỗi: ' + err.message);
    }
  };

  // Save note handler
  const handleSaveNote = async () => {
    if (!selectedCallRecord) return;
    
    try {
      const { error } = await supabase
        .from('data_chitiet')
        .update({ ghi_chu: noteText })
        .eq('id', selectedCallRecord.id);
      
      if (error) {
        setError('❌ Error saving note: ' + error.message);
      } else {
        setError(null);
        // Update local call history data
        setCallHistoryData(callHistoryData.map(record => 
          record.id === selectedCallRecord.id ? { ...record, ghi_chu: noteText } : record
        ));
        
        // Update ghi_chu in data_new table with latest note
        const phone = selectedCallRecord.sdt;
        if (phone) {
          // Get the latest note from data_chitiet for this phone
          const { data: latestCall } = await supabase
            .from('data_chitiet')
            .select('ghi_chu')
            .eq('sdt', phone)
            .order('ngay', { ascending: false })
            .order('gio', { ascending: false })
            .limit(1)
            .single();
          
          if (latestCall) {
            // Update data_new with latest note
            await supabase
              .from('data_new')
              .update({ ghi_chu: latestCall.ghi_chu })
              .eq('sdt', phone);
            
            // Update local state optimistically
            setData(data.map(item => 
              item.sdt === phone 
                ? { ...item, ghi_chu: latestCall.ghi_chu }
                : item
            ));
          }
        }
        
        setIsNoteModalOpen(false);
        setNoteText('');
        setSelectedCallRecord(null);
      }
    } catch (err: any) {
      setError('❌ Lỗi: ' + err.message);
    }
  };

  // Open note modal for specific call record
  const handleOpenNoteModal = (record: any) => {
    setSelectedCallRecord(record);
    setNoteText(record.ghi_chu || '');
    setIsNoteModalOpen(true);
  };

  // Handle Order action
  const handleOrder = async (record: any) => {
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toTimeString().split(' ')[0];
    
    // Get latest status and notes from data_chitiet by phone number
    let latestStatus = '';
    let latestNotes = '';
    try {
      const { data: callHistory, error } = await supabase
        .from('data_chitiet')
        .select('trang_thai, ghi_chu')
        .eq('sdt', record.sdt)
        .order('ngay', { ascending: false })
        .order('gio', { ascending: false })
        .limit(1);
      
      if (!error && callHistory && callHistory.length > 0) {
        latestStatus = callHistory[0].trang_thai || '';
        latestNotes = callHistory[0].ghi_chu || '';
      }
    } catch (err) {
      console.error('Failed to fetch latest status and notes:', err);
    }
    
    setOrderFormData({
      ma_don_hang: '',
      ngay: today,
      gio: currentTime,
      ten_kh: record.ten_kh || '',
      sdt: record.sdt || '',
      dia_chi: '',
      vuon: '',
      dien_tich: '',
      cay_trong: '',
      ghi_chu: latestNotes,
      status: latestStatus,
      san_pham: '',
      don_vi_tien: '',
      ti_gia: '',
      gia_riel: '',
      gia_usd: '',
      trang_thai_van_don: '',
      don_vi_van_chuyen: '',
      nv_van_don: '',
      sale: record.sale || '',
      mkt: '',
      nguon_toi: '',
      truc_page: ''
    });
    setSelectedOrderCustomer(record);
    setIsOrderModalOpen(true);
  };

  // Save order and update call history status to Success
  const handleSaveOrder = async () => {
    try {
      // Validate required fields
      if (!orderFormData.ma_don_hang || !orderFormData.ngay) {
        setError('❌ Please enter Order Code and Date');
        return;
      }

      // Save order to orders table
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          ma_don_hang: orderFormData.ma_don_hang || '',
          ngay: orderFormData.ngay || '',
          gio: orderFormData.gio || null,
          ten_kh: orderFormData.ten_kh || '',
          sdt: orderFormData.sdt || '',
          dia_chi: orderFormData.dia_chi || '',
          vuon: orderFormData.vuon || '',
          dien_tich: orderFormData.dien_tich || null,
          cay_trong: orderFormData.cay_trong || '',
          ghi_chu: orderFormData.ghi_chu || '',
          status: orderFormData.status || '',
          san_pham: orderFormData.san_pham || '',
          don_vi_tien: orderFormData.don_vi_tien || '',
          ti_gia: orderFormData.ti_gia || null,
          gia_riel: orderFormData.gia_riel || null,
          gia_usd: orderFormData.gia_usd || null,
          trang_thai_van_don: orderFormData.trang_thai_van_don || '',
          don_vi_van_chuyen: orderFormData.don_vi_van_chuyen || '',
          nv_van_don: orderFormData.nv_van_don || '',
          sale: orderFormData.sale || '',
          mkt: orderFormData.mkt || '',
          nguon_toi: orderFormData.nguon_toi || '',
          truc_page: orderFormData.truc_page || ''
        }])
        .select();
      
      if (orderError) {
        console.error('Order insert error:', orderError);
        setError('❌ Error saving order: ' + orderError.message);
        return;
      }
      
      // Update call history status to Success
      if (selectedCallRecord) {
        // Update data_chitiet
        const { error: updateError } = await supabase
          .from('data_chitiet')
          .update({ trang_thai: 'Success' })
          .eq('id', selectedCallRecord.id);
        
        if (updateError) {
          setError('❌ Error updating status: ' + updateError.message);
        } else {
          // Update local state
          setCallHistoryData(callHistoryData.map(r => 
            r.id === selectedCallRecord.id ? { ...r, trang_thai: 'Success' } : r
          ));

          // Update data_new table as well
          await supabase
            .from('data_new')
            .update({ trang_thai: 'Success' })
            .eq('sdt', selectedCallRecord.sdt);

          // Refresh main data
          fetchData();
        }
      }
      
      // Refresh orders count
      fetchOrdersCount();
      
      setError(null);
      setIsOrderModalOpen(false);
      setOrderFormData({});
      alert('✅ Order saved successfully!');
    } catch (err: any) {
      setError('❌ Lỗi: ' + err.message);
    }
  };

  // Update status in call history
  const handleStatusChange = async (record: any, newStatus: string) => {
    // Optimistic update - immediate UI feedback
    setCallHistoryData(callHistoryData.map(r => 
      r.id === record.id ? { ...r, trang_thai: newStatus } : r
    ));

    try {
      // Update data_chitiet table
      const { error: chitietError } = await supabase
        .from('data_chitiet')
        .update({ trang_thai: newStatus })
        .eq('id', record.id);
      
      if (chitietError) {
        setError('❌ Error updating status: ' + chitietError.message);
        // Revert optimistic update
        setCallHistoryData(callHistoryData.map(r => 
          r.id === record.id ? { ...r, trang_thai: record.trang_thai } : r
        ));
        return;
      }

      // Update data_new table with the same status
      const { error: dataNewError } = await supabase
        .from('data_new')
        .update({ trang_thai: newStatus })
        .eq('sdt', record.sdt);
      
      if (dataNewError) {
        console.error('Failed to update data_new:', dataNewError.message);
      } else {
        // Update local state optimistically
        setData(data.map(item => 
          item.sdt === record.sdt 
            ? { ...item, trang_thai: newStatus }
            : item
        ));
      }

      setError(null);
    } catch (err: any) {
      setError('❌ Lỗi: ' + err.message);
      // Revert optimistic update
      setCallHistoryData(callHistoryData.map(r => 
        r.id === record.id ? { ...r, trang_thai: record.trang_thai } : r
      ));
    }
  };

  // Fetch data from Supabase
  useEffect(() => {
    fetchData();
    fetchOrdersCount();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Check if click is outside all filter dropdowns
      if (!target.closest('.filter-dropdown')) {
        setIsStatusOpen(false);
        setIsSalesOpen(false);
        setIsSourceOpen(false);
        setIsPageSupportOpen(false);
        setIsSourceChannelOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Distribute empty Sales Person records to U1 priority people
  const handleDistributeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📊 Starting data distribution...');
      
      // 1. Get all records with empty sale from data_new
      const { data: emptyRecords, error: fetchError } = await supabase
        .from('data_new')
        .select('*')
        .eq('sale', '');
      
      if (fetchError) {
        setError('❌ Error fetching empty records: ' + fetchError.message);
        return;
      }
      
      if (!emptyRecords || emptyRecords.length === 0) {
        setError('ℹ️ No empty sales person records to distribute');
        return;
      }
      
      // 2. Get all U1 priority people from chia_don
      const { data: u1People, error: u1Error } = await supabase
        .from('chia_don')
        .select('*')
        .eq('uu_tien', 'U1');
      
      if (u1Error) {
        setError('❌ Error fetching U1 people: ' + u1Error.message);
        return;
      }
      
      if (!u1People || u1People.length === 0) {
        setError('❌ No U1 priority people found to assign');
        return;
      }
      
      const totalRecords = emptyRecords.length;
      const totalPeople = u1People.length;
      const recordsPerPerson = Math.floor(totalRecords / totalPeople);
      const remainder = totalRecords % totalPeople;
      
      console.log(`📦 Distributing ${totalRecords} records to ${totalPeople} U1 people`);
      console.log(`📍 ${recordsPerPerson} records per person + ${remainder} extra`);
      
      // 3. Distribute records evenly
      let recordIndex = 0;
      const updates: any[] = [];
      
      for (let i = 0; i < totalPeople; i++) {
        const person = u1People[i];
        const count = recordsPerPerson + (i < remainder ? 1 : 0);
        
        for (let j = 0; j < count; j++) {
          if (recordIndex < emptyRecords.length) {
            const record = emptyRecords[recordIndex];
            updates.push({
              id: record.id,
              sale: person.ho_va_ten
            });
            recordIndex++;
          }
        }
      }
      
      // 4. Update all records in batches
      const batchSize = 10;
      for (let i = 0; i < updates.length; i += batchSize) {
        const batch = updates.slice(i, i + batchSize);
        
        for (const update of batch) {
          const { error: updateError } = await supabase
            .from('data_new')
            .update({ sale: update.sale })
            .eq('id', update.id);
          
          if (updateError) {
            console.error('❌ Error updating record:', updateError);
          }
        }
      }
      
      console.log(`✅ Successfully distributed ${updates.length} records`);
      setError(`✅ Distributed ${updates.length} records to U1 people`);
      
      // Refresh data
      await fetchData();
    } catch (err: any) {
      setError('❌ Error: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📥 Fetching data from Supabase (data_new table)...');
      
      const { data: result, error: supabaseError } = await supabase
        .from('data_new')
        .select('*')
        .order('so_lan', { ascending: false });
      
      console.log('📊 Supabase Response:', { hasError: !!supabaseError, rowCount: result?.length || 0, error: supabaseError });
      
      if (supabaseError) {
        const errorDetails = `${supabaseError.message} (Code: ${supabaseError.code}, Status: ${supabaseError.status})`;
        const errorMsg = `❌ Failed to fetch data_new table: ${errorDetails}`;
        console.error(errorMsg, supabaseError);
        console.warn('⚠️  Make sure the "data_new" table exists in your Supabase database');
        setError(errorMsg);
        console.log('📋 Using mock data instead');
        setData(proposals);
        initializeMockColumns();
      } else if (result && result.length > 0) {
        console.log('✅ Successfully fetched', result.length, 'rows from Supabase');
        console.log('📄 Sample row:', result[0]);
        
        // Detect Dynamic Columns from first row
        const firstRow = result[0];
        const detectedKeys = Object.keys(firstRow);
        console.log('🔑 Detected columns:', detectedKeys);
        
        // Columns to exclude from view
        const excludeColumns = ['id', 'text_dem', 'so_don_hom_nay', 'created_at', 'ma_don_hang'];
        
        // Create dynamic columns config (filter out excluded columns)
        const dynamicCols = detectedKeys
          .filter(key => !excludeColumns.includes(key))
          .map(key => ({
            key: key,
            label: columnNameMap[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
            visible: true,
            width: 'min-w-[120px]'
          }));
        
        setDynamicColumns(dynamicCols);
        console.log('📋 Created', dynamicCols.length, 'columns');
        
        // Map Supabase data - keep original structure
        setData(result);
        setError(null);
      } else {
        console.log('⚠️  No data found in table, using mock data');
        setData(proposals);
        initializeMockColumns();
        setError('No data in data_new table');
      }
    } catch (err: any) {
      const errorMsg = `💥 Unexpected error: ${err?.message || 'Unknown error'}`;
      console.error(errorMsg, err);
      setError(errorMsg);
      setData(proposals);
      initializeMockColumns();
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders count
  const fetchOrdersCount = async () => {
    try {
      const { count, error } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error('❌ Error fetching orders count:', error);
        console.error('Error details:', { status: error.status, message: error.message, code: error.code });
      } else if (count !== null) {
        setOrdersCount(count);
        console.log('📦 Orders count:', count);
      }
    } catch (err) {
      console.error('Failed to fetch orders count:', err);
    }
  };

  const initializeMockColumns = () => {
    const mockCols: ColumnConfig[] = [
      { key: 'ngay', label: 'Ngày', visible: true, width: 'min-w-[100px]' },
      { key: 'ho_ten', label: 'Customer Name', visible: true, width: 'min-w-[150px]' },
      { key: 'sdt', label: 'Phone', visible: true, width: 'min-w-[120px]' },
      { key: 'ghi_chu', label: 'Notes', visible: true, width: 'min-w-[200px]' },
      { key: 'trang_thai', label: 'Status', visible: true, width: 'w-32' },
      { key: 'gio', label: 'Giờ', visible: true, width: 'w-24' },
      { key: 'mkt_pt', label: 'MKT', visible: true, width: 'min-w-[120px]' },
      { key: 'sale', label: 'Sale', visible: true, width: 'min-w-[120px]' },
      { key: 'nguon_mkt', label: 'Nguồn MKT', visible: true, width: 'min-w-[120px]' },
      { key: 'truc_page_pt', label: 'Trực Page', visible: true, width: 'min-w-[120px]' },
      { key: 'nguon_toi', label: 'Nguồn tới', visible: true, width: 'min-w-[120px]' },
    ];
    setDynamicColumns(mockCols);
  };
  
  // Fetch People data from nhan_su table
  const fetchPeople = async () => {
    try {
      setPeopleLoading(true);
      console.log('📥 Fetching people data from Supabase (chia_don table)...');
      
      const { data: result, error: supabaseError } = await supabase
        .from('chia_don')
        .select('*')
        .order('ho_va_ten', { ascending: true });
      
      if (supabaseError) {
        console.error('❌ Error:', supabaseError);
        setError(`❌ Error: ${supabaseError.message}`);
      } else {
        console.log('✅ Fetched', result?.length || 0, 'people records');
        
        // Get count of records for each person from data_new
        const peopleWithCounts = await Promise.all(
          (result || []).map(async (person) => {
            const { count } = await supabase
              .from('data_new')
              .select('*', { count: 'exact', head: true })
              .eq('sale', person.ho_va_ten);
            
            return {
              ...person,
              data_count: count || 0
            };
          })
        );
        
        setPeopleData(peopleWithCounts);
        
        // Generate columns from first row, excluding id
        if (peopleWithCounts && peopleWithCounts.length > 0) {
          const firstRow = peopleWithCounts[0];
          const excludeColumns = ['id']; // Hide ID
          const generatedCols = Object.keys(firstRow)
            .filter(key => !excludeColumns.includes(key))
            .map(key => ({
              key: key,
              label: columnNameMap[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
              visible: true,
              width: 'min-w-[120px]'
            }));
          setPeopleColumns(generatedCols);
        }
      }
    } catch (err: any) {
      console.error('💥 Error:', err);
      setError(`💥 Error: ${err.message}`);
    } finally {
      setPeopleLoading(false);
    }
  };
  
  // Fetch people data when switching to People tab
  useEffect(() => {
    if (activeTab === 'people' && peopleData.length === 0) {
      fetchPeople();
    }
  }, [activeTab]);
  
  // Initial Columns Configuration - sử dụng dynamicColumns khi có data mới
  const [columns, setColumns] = useState<ColumnConfig[]>(dynamicColumns.length > 0 ? dynamicColumns : []);

  // Update columns when dynamicColumns changes
  useEffect(() => {
    if (dynamicColumns.length > 0) {
      setColumns(dynamicColumns);
    }
  }, [dynamicColumns]);

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedItems(newSelection);
  };

  const toggleAll = () => {
    if (selectedItems.size === data.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(data.map(p => p.id)));
    }
  };

  const toggleColumn = (key: string) => {
    setColumns(prev => prev.map(col => 
      col.key === key ? { ...col, visible: !col.visible } : col
    ));
  };

  const resetColumns = () => {
    setColumns(dynamicColumns.length > 0 ? dynamicColumns : []);
  };

  const visibleCount = columns.filter(c => c.visible).length;

  const renderCellContent = (item: any, key: string) => {
    const value = item[key];
    
    // Handle date field (ngay) - format as dd/mm/yyyy
    if (key === 'ngay' && value) {
      try {
        const date = new Date(value);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return <span className="text-gray-900 text-sm">{day}/{month}/{year}</span>;
      } catch (e) {
        return <span className="text-gray-900 text-sm">{value}</span>;
      }
    }
    
    // Handle status field with comprehensive color coding
    if (key === 'trang_thai' || key.includes('status')) {
      const statusColors: { [key: string]: string } = {
        'success': 'bg-green-100 text-green-700 border-green-200',
        'buy already': 'bg-green-100 text-green-700 border-green-200',
        'still have unused stock': 'bg-yellow-100 text-yellow-700 border-yellow-200',
        'no answer': 'bg-red-100 text-red-700 border-red-200',
        'think more': 'bg-orange-100 text-orange-700 border-orange-200',
        'call back later': 'bg-orange-100 text-orange-700 border-orange-200',
        'don\'t buy': 'bg-red-100 text-red-700 border-red-200',
        'no money yet': 'bg-orange-100 text-orange-700 border-orange-200',
        'too expensive': 'bg-orange-100 text-orange-700 border-orange-200',
        'wrong number': 'bg-gray-100 text-gray-700 border-gray-200',
        'there\'s a problem': 'bg-red-100 text-red-700 border-red-200',
        'telegram': 'bg-blue-100 text-blue-700 border-blue-200',
        'floating': 'bg-purple-100 text-purple-700 border-purple-200',
      };
      
      const statusKey = value?.toLowerCase() || '';
      const colors = statusColors[statusKey] || 'bg-blue-100 text-blue-700 border-blue-200';
      
      return (
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors}`}>
          {value}
        </span>
      );
    }
    
    // Handle long text with line wrapping
    if (typeof value === 'string' && value.length > 50) {
      return (
        <div className="text-gray-500 break-words whitespace-normal max-w-[250px]">
          {value}
        </div>
      );
    }
    
    // Default rendering
    return <span className="text-gray-900 text-sm">{value}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
      {/* Top Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 px-6 pt-4">
        <div className="flex space-x-6">
          <button
            onClick={() => navigate('/customers')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'customers'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <List className="w-4 h-4" />
              Customers
            </div>
          </button>
          <button
            onClick={() => navigate('/people')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'people'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" />
              People
            </div>
          </button>
        </div>
      </div>

      {/* Customers Tab Content */}
      {activeTab === 'customers' && (
      <>
      <div className="p-4 max-w-[1600px] mx-auto">
        {/* Toolbar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 mb-3">
          <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center mb-3">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <button className="p-1.5 hover:bg-gray-100 rounded-lg border border-gray-200 text-gray-600 transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  placeholder="Search all data..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto justify-end relative">
              <button 
                onClick={fetchData}
                disabled={loading}
                className="p-1.5 hover:bg-gray-100 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Refresh data from Supabase"
              >
                <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              
              <button 
                onClick={handleDistributeData}
                disabled={loading}
                className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg border border-green-600 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Distribute empty sales records to U1 people"
              >
                Distribute Data
              </button>
              
              <button 
                onClick={() => setIsColumnMenuOpen(!isColumnMenuOpen)}
                className={`p-1.5 hover:bg-gray-100 rounded-lg border transition-colors ${isColumnMenuOpen ? 'bg-orange-50 border-orange-200 text-orange-600' : 'border-gray-200 text-gray-600'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>

              {/* Column Visibility Menu */}
              {isColumnMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden">
                  <div className="p-2 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <span className="text-xs font-medium text-gray-500">Visible Columns <span className="text-gray-900">{visibleCount}/{columns.length}</span></span>
                    <button onClick={resetColumns} className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600 transition-colors" title="Reset to default">
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto p-1.5">
                    <Reorder.Group axis="y" values={columns} onReorder={setColumns}>
                      {columns.map((col) => (
                        <DraggableColumnItem 
                          key={col.key} 
                          column={col} 
                          toggleColumn={toggleColumn} 
                        />
                      ))}
                    </Reorder.Group>
                  </div>
                </div>
              )}

              <button 
                onClick={() => setIsFormOpen(true)}
                className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Thêm
              </button>
            </div>
          </div>

          {/* Filters */}
          {error && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
              <button 
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          )}

          {/* Filters Row */}
          <div className="flex flex-wrap gap-2 items-center">
            {/* Date Range */}
            <div className="flex items-center gap-1">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                placeholder="From"
              />
              <span className="text-xs text-gray-400">→</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                placeholder="To"
              />
            </div>

            {/* Status Filter */}
            <div className="relative filter-dropdown">
              <button
                onClick={() => setIsStatusOpen(!isStatusOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 border border-gray-200 rounded text-xs bg-white hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-3 h-3" />
                Status {filterStatus.length > 0 && `(${filterStatus.length})`}
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>
              {isStatusOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-64 overflow-y-auto">
                  <div className="p-2">
                    {uniqueStatuses.map(status => (
                      <label key={status} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filterStatus.includes(status)}
                          onChange={() => toggleFilterItem(filterStatus, status, setFilterStatus)}
                          className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="text-xs text-gray-700">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sales Person Filter */}
            <div className="relative filter-dropdown">
              <button
                onClick={() => setIsSalesOpen(!isSalesOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 border border-gray-200 rounded text-xs bg-white hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-3 h-3" />
                Sale {filterSales.length > 0 && `(${filterSales.length})`}
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>
              {isSalesOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-64 overflow-y-auto">
                  <div className="p-2">
                    {uniqueSales.map(sale => (
                      <label key={sale} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filterSales.includes(sale)}
                          onChange={() => toggleFilterItem(filterSales, sale, setFilterSales)}
                          className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="text-xs text-gray-700">{sale}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Source Filter */}
            <div className="relative filter-dropdown">
              <button
                onClick={() => setIsSourceOpen(!isSourceOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 border border-gray-200 rounded text-xs bg-white hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-3 h-3" />
                Source {filterSource.length > 0 && `(${filterSource.length})`}
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>
              {isSourceOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-64 overflow-y-auto">
                  <div className="p-2">
                    {uniqueSources.map(source => (
                      <label key={source} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filterSource.includes(source)}
                          onChange={() => toggleFilterItem(filterSource, source, setFilterSource)}
                          className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="text-xs text-gray-700">{source}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Page Support Filter */}
            <div className="relative filter-dropdown">
              <button
                onClick={() => setIsPageSupportOpen(!isPageSupportOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 border border-gray-200 rounded text-xs bg-white hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-3 h-3" />
                Page Support {filterPageSupport.length > 0 && `(${filterPageSupport.length})`}
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>
              {isPageSupportOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-64 overflow-y-auto">
                  <div className="p-2">
                    {uniquePageSupports.map(page => (
                      <label key={page} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filterPageSupport.includes(page)}
                          onChange={() => toggleFilterItem(filterPageSupport, page, setFilterPageSupport)}
                          className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="text-xs text-gray-700">{page}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Source Channel Filter */}
            <div className="relative filter-dropdown">
              <button
                onClick={() => setIsSourceChannelOpen(!isSourceChannelOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 border border-gray-200 rounded text-xs bg-white hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-3 h-3" />
                Source Channel {filterSourceChannel.length > 0 && `(${filterSourceChannel.length})`}
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>
              {isSourceChannelOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-64 overflow-y-auto">
                  <div className="p-2">
                    {uniqueSourceChannels.map(channel => (
                      <label key={channel} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filterSourceChannel.includes(channel)}
                          onChange={() => toggleFilterItem(filterSourceChannel, channel, setFilterSourceChannel)}
                          className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="text-xs text-gray-700">{channel}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Clear Filters */}
            {(dateFrom || dateTo || filterStatus.length > 0 || filterSales.length > 0 || filterSource.length > 0 || filterPageSupport.length > 0 || filterSourceChannel.length > 0) && (
              <button
                onClick={() => {
                  setDateFrom('');
                  setDateTo('');
                  setFilterStatus([]);
                  setFilterSales([]);
                  setFilterSource([]);
                  setFilterPageSupport([]);
                  setFilterSourceChannel([]);
                }}
                className="px-2.5 py-1 bg-red-50 text-red-600 border border-red-200 rounded text-xs hover:bg-red-100 transition-colors"
              >
                Clear Filters
              </button>
            )}

            {/* Counter Badge */}
            <div className="ml-auto flex items-center gap-2">
              <div className="px-3 py-1 bg-orange-50 border border-orange-200 rounded-full">
                <span className="text-xs font-medium text-orange-700">
                  Showing: <span className="font-bold">{filteredData.length}</span> / {data.length}
                </span>
              </div>
              <div className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-full">
                <span className="text-xs font-medium text-blue-700">
                  Orders: <span className="font-bold">{ordersCount}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                <tr>
                  <th className="px-3 py-2 w-10">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                      checked={selectedItems.size === data.length && data.length > 0}
                      onChange={toggleAll}
                    />
                  </th>
                  {columns.map((col) => (
                    col.visible && (
                      <th key={col.key} className={`px-3 py-2 ${col.width || ''}`}>
                        {col.label}
                      </th>
                    )
                  ))}
                  <th className="px-3 py-2 w-20 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={columns.filter(c => c.visible).length + 2} className="px-3 py-8 text-center text-gray-500">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        Loading data...
                      </div>
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={columns.filter(c => c.visible).length + 2} className="px-3 py-8 text-center text-gray-500">
                      No data
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-3 py-2">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                          checked={selectedItems.has(item.id)}
                          onChange={() => toggleSelection(item.id)}
                        />
                      </td>
                      {columns.map((col) => (
                        col.visible && (
                          <td key={col.key} className="px-3 py-2">
                            {renderCellContent(item, col.key)}
                          </td>
                        )
                      ))}
                      <td className="px-3 py-2">
                        <div className="flex items-center justify-center gap-1.5">
                          <button 
                            onClick={() => handleCall(item)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Call"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleView(item)}
                            className="p-1 text-blue-500 hover:bg-blue-50 rounded transition-colors"
                            title="View details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleEdit(item)}
                            className="p-1 text-orange-500 hover:bg-orange-50 rounded transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination (Visual only for now) */}
          <div className="border-t border-gray-200 px-3 py-2 flex items-center justify-between text-xs text-gray-500">
            <div>Hiển thị {filteredData.length > 0 ? '1' : '0'}-{filteredData.length} của {data.length} bản ghi</div>
            <div className="flex gap-1">
              <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Trước</button>
              <button className="px-2 py-1 bg-orange-500 text-white rounded hover:bg-orange-600">1</button>
              <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Sau</button>
            </div>
          </div>
        </div>
      </div>

      {/* View Modal */}
      {isViewModalOpen && selectedRow && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Xem chi tiết</h2>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-4">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(selectedRow)
                  .filter(([key]) => !['id', 'text_dem', 'so_don_hom_nay', 'created_at', 'ma_don_hang'].includes(key))
                  .map(([key, value]) => (
                    <div key={key} className="border border-gray-200 rounded p-3">
                      <div className="text-xs text-gray-500 font-medium uppercase mb-1">{key.replace(/_/g, ' ')}</div>
                      <div className="text-sm text-gray-900">{String(value || '-')}</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingRow && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Edit Record</h2>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-4">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(editingRow).map(([key, value]) => (
                  !['id', 'text_dem', 'so_don_hom_nay', 'created_at', 'ma_don_hang', 'data_count', 'isFromPeopleTab'].includes(key) && (
                    <div key={key}>
                      <label className="text-xs text-gray-500 font-medium uppercase mb-1 block">{key.replace(/_/g, ' ')}</label>
                      <input 
                        type="text"
                        value={String(value || '')}
                        onChange={(e) => setEditingRow({ ...editingRow, [key]: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  )
                ))}
              </div>
            </div>
            <div className="border-t border-gray-100 px-4 py-3 flex justify-end gap-2">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50"
              >
                Hủy
              </button>
              <button 
                onClick={handleSaveEdit}
                className="px-3 py-1.5 bg-orange-500 text-white rounded text-sm hover:bg-orange-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Add New Record</h2>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-4">
              <div className="grid grid-cols-2 gap-4">
                {dynamicColumns.map((col) => (
                  <div key={col.key}>
                    <label className="text-xs text-gray-500 font-medium uppercase mb-1 block">{col.label}</label>
                    <input 
                      type="text"
                      placeholder={col.label}
                      value={formData[col.key] || ''}
                      onChange={(e) => setFormData({ ...formData, [col.key]: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-100 px-4 py-3 flex justify-end gap-2">
              <button 
                onClick={() => setIsFormOpen(false)}
                className="px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50"
              >
                Hủy
              </button>
              <button 
                onClick={handleAddNew}
                className="px-3 py-1.5 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Call History Modal */}
      {isCallHistoryModalOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div>
                <h2 className="font-semibold text-gray-900">Call History</h2>
                <p className="text-xs text-gray-500 mt-1">{selectedCustomer.ho_ten || selectedCustomer.ten_kh}</p>
              </div>
              <button 
                onClick={() => setIsCallHistoryModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-auto flex-1 p-4">
              {callHistoryData && callHistoryData.length > 0 ? (
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Date</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Time</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Customer Name</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Phone</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Sales Person</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Status</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Action</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Notes Content</th>
                      <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600">Edit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {callHistoryData.map((record, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-3 py-2 text-sm text-gray-900">{record.ngay}</td>
                        <td className="px-3 py-2 text-sm text-gray-900">{record.gio}</td>
                        <td className="px-3 py-2 text-sm text-gray-900">{record.ten_kh}</td>
                        <td className="px-3 py-2 text-sm text-gray-900">{record.sdt}</td>
                        <td className="px-3 py-2 text-sm text-gray-900">{record.sale}</td>
                        <td className="px-3 py-2 text-sm">
                          <select
                            value={record.trang_thai || ''}
                            onChange={(e) => handleStatusChange(record, e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                          >
                            <option value="">- Select Status -</option>
                            <option value="Success">Success</option>
                            <option value="Buy already">Buy already</option>
                            <option value="Still have unused stock">Still have unused stock</option>
                            <option value="No answer">No answer</option>
                            <option value="Think more">Think more</option>
                            <option value="Call back later">Call back later</option>
                            <option value="Don't buy">Don't buy</option>
                            <option value="No money yet">No money yet</option>
                            <option value="Too expensive">Too expensive</option>
                            <option value="Wrong number">Wrong number</option>
                            <option value="There's a problem">There's a problem</option>
                            <option value="Telegram">Telegram</option>
                          </select>
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-900 font-medium text-green-600">{record.hanh_dong}</td>
                        <td className="px-3 py-2 text-sm text-gray-700 max-w-sm break-words whitespace-pre-wrap">
                          {record.ghi_chu || <span className="text-gray-400 italic">No notes yet</span>}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <div className="flex gap-1 justify-center">
                            <button
                              onClick={() => handleOpenNoteModal(record)}
                              className="px-2 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600 transition-colors"
                            >
                              Note
                            </button>
                            <button
                              onClick={() => handleOrder(record)}
                              className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
                            >
                              Order
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No call history
                </div>
              )}
            </div>
            <div className="border-t border-gray-100 px-4 py-3 flex justify-end gap-2">
              <button 
                onClick={() => setIsCallHistoryModalOpen(false)}
                className="px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Note Modal */}
      {isNoteModalOpen && selectedCallRecord && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Add Note</h2>
              <button 
                onClick={() => {
                  setIsNoteModalOpen(false);
                  setNoteText('');
                }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 flex-1">
              <label className="text-xs text-gray-500 font-medium uppercase mb-2 block">Note for this call</label>
              <textarea 
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Enter call notes..."
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>
            <div className="border-t border-gray-100 px-4 py-3 flex justify-end gap-2">
              <button 
                onClick={() => {
                  setIsNoteModalOpen(false);
                  setNoteText('');
                }}
                className="px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50"
              >
                Hủy
              </button>
              <button 
                onClick={handleSaveNote}
                className="px-3 py-1.5 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Modal */}
      {isOrderModalOpen && selectedOrderCustomer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Create Order</h2>
              <button 
                onClick={() => {
                  setIsOrderModalOpen(false);
                  setOrderFormData({});
                }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-medium uppercase mb-1 block">Order Code</label>
                  <input type="text" value={orderFormData.ma_don_hang || ''} onChange={(e) => setOrderFormData({...orderFormData, ma_don_hang: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium uppercase mb-1 block">Date</label>
                  <input type="date" value={orderFormData.ngay || ''} onChange={(e) => setOrderFormData({...orderFormData, ngay: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium uppercase mb-1 block">Time</label>
                  <input type="time" value={orderFormData.gio || ''} onChange={(e) => setOrderFormData({...orderFormData, gio: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium uppercase mb-1 block">Customer Name</label>
                  <input type="text" value={orderFormData.ten_kh || ''} onChange={(e) => setOrderFormData({...orderFormData, ten_kh: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium uppercase mb-1 block">Phone</label>
                  <input type="text" value={orderFormData.sdt || ''} onChange={(e) => setOrderFormData({...orderFormData, sdt: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium uppercase mb-1 block">Address</label>
                  <input type="text" value={orderFormData.dia_chi || ''} onChange={(e) => setOrderFormData({...orderFormData, dia_chi: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium uppercase mb-1 block">Garden</label>
                  <input type="text" value={orderFormData.vuon || ''} onChange={(e) => setOrderFormData({...orderFormData, vuon: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium uppercase mb-1 block">Area</label>
                  <input type="text" value={orderFormData.dien_tich || ''} onChange={(e) => setOrderFormData({...orderFormData, dien_tich: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium uppercase mb-1 block">Crops</label>
                  <input type="text" value={orderFormData.cay_trong || ''} onChange={(e) => setOrderFormData({...orderFormData, cay_trong: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium uppercase mb-1 block">Status</label>
                  <input type="text" value={orderFormData.status || ''} onChange={(e) => setOrderFormData({...orderFormData, status: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium uppercase mb-1 block">Product</label>
                  <input type="text" value={orderFormData.san_pham || ''} onChange={(e) => setOrderFormData({...orderFormData, san_pham: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium uppercase mb-1 block">Currency</label>
                  <input type="text" value={orderFormData.don_vi_tien || ''} onChange={(e) => setOrderFormData({...orderFormData, don_vi_tien: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium uppercase mb-1 block">Exchange Rate</label>
                  <input type="text" value={orderFormData.ti_gia || ''} onChange={(e) => setOrderFormData({...orderFormData, ti_gia: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium uppercase mb-1 block">Price Riel</label>
                  <input type="text" value={orderFormData.gia_riel || ''} onChange={(e) => setOrderFormData({...orderFormData, gia_riel: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium uppercase mb-1 block">Price USD</label>
                  <input type="text" value={orderFormData.gia_usd || ''} onChange={(e) => setOrderFormData({...orderFormData, gia_usd: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium uppercase mb-1 block">Shipping Status</label>
                  <input type="text" value={orderFormData.trang_thai_van_don || ''} onChange={(e) => setOrderFormData({...orderFormData, trang_thai_van_don: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium uppercase mb-1 block">Shipping Unit</label>
                  <input type="text" value={orderFormData.don_vi_van_chuyen || ''} onChange={(e) => setOrderFormData({...orderFormData, don_vi_van_chuyen: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium uppercase mb-1 block">Shipping Staff</label>
                  <input type="text" value={orderFormData.nv_van_don || ''} onChange={(e) => setOrderFormData({...orderFormData, nv_van_don: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium uppercase mb-1 block">Sale</label>
                  <input type="text" value={orderFormData.sale || ''} onChange={(e) => setOrderFormData({...orderFormData, sale: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium uppercase mb-1 block">MKT</label>
                  <input type="text" value={orderFormData.mkt || ''} onChange={(e) => setOrderFormData({...orderFormData, mkt: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium uppercase mb-1 block">Source</label>
                  <input type="text" value={orderFormData.nguon_toi || ''} onChange={(e) => setOrderFormData({...orderFormData, nguon_toi: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium uppercase mb-1 block">Page Manager</label>
                  <input type="text" value={orderFormData.truc_page || ''} onChange={(e) => setOrderFormData({...orderFormData, truc_page: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="mt-4">
                <label className="text-xs text-gray-500 font-medium uppercase mb-1 block">Notes</label>
                <textarea value={orderFormData.ghi_chu || ''} onChange={(e) => setOrderFormData({...orderFormData, ghi_chu: e.target.value})} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="border-t border-gray-100 px-4 py-3 flex justify-end gap-2">
              <button 
                onClick={() => setIsOrderModalOpen(false)}
                className="px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveOrder}
                className="px-3 py-1.5 bg-green-500 text-white rounded text-sm hover:bg-green-600"
              >
                Create Order
              </button>
            </div>
          </div>
        </div>
      )}
      </>
      )}

      {/* People Tab Content */}
      {activeTab === 'people' && (
      <div className="p-4 max-w-[1600px] mx-auto">
        {/* People Toolbar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 mb-3">
          <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center mb-3">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <button className="p-1.5 hover:bg-gray-100 rounded-lg border border-gray-200 text-gray-600 transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  value={searchPeople}
                  onChange={(e) => setSearchPeople(e.target.value)}
                  placeholder="Search by name, email, phone..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto justify-end relative">
              <button 
                onClick={fetchPeople}
                disabled={peopleLoading}
                className="p-1.5 hover:bg-gray-100 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RotateCcw className={`w-4 h-4 ${peopleLoading ? 'animate-spin' : ''}`} />
              </button>

              <button className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-600 hover:bg-gray-100 transition-colors">
              <Filter className="w-3 h-3" />
              Status
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-600 hover:bg-gray-100 transition-colors">
              <Filter className="w-3 h-3" />
              Position Applied
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-600 hover:bg-gray-100 transition-colors">
              <Filter className="w-3 h-3" />
              Source
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
          </div>
        </div>

        {/* People Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {peopleLoading ? (
            <div className="p-8 text-center text-gray-500">
              <RotateCcw className="w-6 h-6 animate-spin mx-auto mb-2" />
              Loading data...
            </div>
          ) : peopleData.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No employee data
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-3 py-2 text-left">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </th>
                    {peopleColumns.filter(col => col.visible).map((col) => (
                      <th key={col.key} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {col.label}
                      </th>
                    ))}
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {peopleData
                    .filter(person => {
                      if (!searchPeople) return true;
                      const search = searchPeople.toLowerCase();
                      return (
                        person.ho_va_ten?.toLowerCase().includes(search) ||
                        person.email?.toLowerCase().includes(search)
                      );
                    })
                    .map((person, idx) => (
                    <tr key={person.id || idx} className="hover:bg-gray-50">
                      <td className="px-3 py-2">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </td>
                      {peopleColumns.filter(col => col.visible).map((col) => (
                        <td key={col.key} className="px-3 py-2 text-sm text-gray-900">
                          {col.key === 'data_count' ? (
                            <span className="inline-block px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                              {person[col.key] || 0}
                            </span>
                          ) : (
                            person[col.key] || '—'
                          )}
                        </td>
                      ))}
                      <td className="px-3 py-2 text-center">
                        <div className="flex gap-1 justify-center">
                          <button 
                            onClick={() => handleEditPerson(person)}
                            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDeletePerson(person)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
}
