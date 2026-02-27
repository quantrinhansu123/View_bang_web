import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  ArrowLeft, 
  Filter, 
  Trash2, 
  Pencil, 
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
  GripVertical
} from 'lucide-react';
import { Reorder, useDragControls } from 'motion/react';

// Mock Data
type Status = 'pending' | 'approved' | 'draft' | 'rejected';

interface Proposal {
  id: string;
  position: string;
  department: string;
  title: string;
  description: string;
  quantity: number;
  hired: number;
  resigned: number;
  remaining: number;
  status: Status;
  createdAt: string;
}

const proposals: Proposal[] = [
  {
    id: 'DX-2025-001',
    position: 'Lập trình viên Senior',
    department: 'Nhóm Phát triển phần mềm',
    title: 'Tuyển Lập trình viên Senior',
    description: 'Tham gia phát triển sản phẩm core,...',
    quantity: 2,
    hired: 0,
    resigned: 0,
    remaining: 2,
    status: 'pending',
    createdAt: '16:30 - 15/01/2025',
  },
  {
    id: 'DX-2025-002',
    position: 'Chuyên viên Tuyển dụng',
    department: 'Nhóm Tuyển dụng',
    title: 'Tuyển Chuyên viên Tuyển dụng',
    description: 'Phụ trách tuyển dụng cho các vị trí kỹ thu...',
    quantity: 1,
    hired: 1,
    resigned: 0,
    remaining: 0,
    status: 'approved',
    createdAt: '09:15 - 14/01/2025',
  },
  {
    id: 'DX-2025-003',
    position: 'Trưởng Nhóm Phát triển',
    department: 'Nhóm Phát triển phần mềm',
    title: '—',
    description: 'Lead team phát triển phần mềm, quản lý...',
    quantity: 1,
    hired: 0,
    resigned: 0,
    remaining: 1,
    status: 'draft',
    createdAt: '14:20 - 12/01/2025',
  },
  {
    id: 'DX-2025-004',
    position: 'Lập trình viên Frontend',
    department: 'Nhóm Phát triển phần mềm',
    title: 'Tuyển Lập trình viên Frontend',
    description: 'Phát triển giao diện người dùng, tối ưu tr...',
    quantity: 3,
    hired: 0,
    resigned: 0,
    remaining: 3,
    status: 'rejected',
    createdAt: '10:00 - 10/01/2025',
  },
  {
    id: 'DX-2025-005',
    position: 'Nhân viên Kinh doanh',
    department: 'Nhóm Kinh doanh B2B',
    title: 'Tuyển Nhân viên Kinh doanh B2B',
    description: 'Chăm sóc khách hàng doanh nghiệp, mở...',
    quantity: 2,
    hired: 0,
    resigned: 0,
    remaining: 2,
    status: 'pending',
    createdAt: '08:45 - 08/01/2025',
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
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
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

export default function App() {
  const [activeTab, setActiveTab] = useState<'list' | 'stats'>('list');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);

  // Initial Columns Configuration
  const initialColumns: ColumnConfig[] = [
    { key: 'id', label: 'Mã đề xuất', visible: true, width: 'min-w-[120px]' },
    { key: 'position', label: 'Chức vụ', visible: true, width: 'min-w-[200px]' },
    { key: 'title', label: 'Tiêu đề', visible: true, width: 'min-w-[200px]' },
    { key: 'description', label: 'Mô tả', visible: true, width: 'min-w-[250px]' },
    { key: 'quantity', label: 'Số lượng', visible: true, width: 'w-24' },
    { key: 'hired', label: 'Đã tuyển (đang làm)', visible: true, width: 'w-32' },
    { key: 'resigned', label: 'Đã nghỉ', visible: true, width: 'w-24' },
    { key: 'remaining', label: 'Còn lại', visible: true, width: 'w-24' },
    { key: 'link', label: 'Link', visible: true, width: 'w-32' },
    { key: 'status', label: 'Trạng thái', visible: true, width: 'w-32' },
    { key: 'createdAt', label: 'Ngày tạo', visible: true, width: 'w-40' },
  ];

  const [columns, setColumns] = useState<ColumnConfig[]>(initialColumns);

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
    if (selectedItems.size === proposals.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(proposals.map(p => p.id)));
    }
  };

  const toggleColumn = (key: string) => {
    setColumns(prev => prev.map(col => 
      col.key === key ? { ...col, visible: !col.visible } : col
    ));
  };

  const resetColumns = () => {
    setColumns(initialColumns);
  };

  const visibleCount = columns.filter(c => c.visible).length;

  const renderCellContent = (item: Proposal, key: string) => {
    switch (key) {
      case 'id':
        return <span className="font-medium text-gray-900">{item.id}</span>;
      case 'position':
        return (
          <div>
            <div className="font-medium text-gray-900">{item.position}</div>
            <div className="text-xs text-gray-500 mt-0.5">{item.department}</div>
          </div>
        );
      case 'title':
        return <span className="text-gray-900">{item.title}</span>;
      case 'description':
        return (
          <div className="text-gray-500 truncate max-w-[250px]" title={item.description}>
            {item.description}
          </div>
        );
      case 'quantity':
        return <span className="font-medium text-gray-900">{item.quantity}</span>;
      case 'hired':
        return <span className="font-medium text-green-600">{item.hired}</span>;
      case 'resigned':
        return <span className="font-medium text-orange-600">{item.resigned}</span>;
      case 'remaining':
        return <span className="font-medium text-gray-900">{item.remaining}</span>;
      case 'link':
        return (
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-orange-200 text-orange-600 text-xs font-medium hover:bg-orange-50 transition-colors">
            <ExternalLink className="w-3 h-3" />
            Xem link
          </button>
        );
      case 'status':
        return <StatusBadge status={item.status} />;
      case 'createdAt':
        return <span className="text-gray-500 text-xs">{item.createdAt}</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
      {/* Top Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 px-6 pt-4">
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveTab('list')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'list'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <List className="w-4 h-4" />
              Danh sách
            </div>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'stats'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" />
              Thống kê
            </div>
          </button>
        </div>
      </div>

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
                  placeholder="Tìm theo mã, tiêu đề, mô tả..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto justify-end relative">
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
                    <span className="text-xs font-medium text-gray-500">Cột hiển thị <span className="text-gray-900">{visibleCount}/{columns.length}</span></span>
                    <button onClick={resetColumns} className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600 transition-colors" title="Đặt lại mặc định">
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
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-600 hover:bg-gray-100 transition-colors">
                <Filter className="w-3 h-3" />
                Trạng thái
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>
            </div>
            <div className="relative">
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-600 hover:bg-gray-100 transition-colors">
                <LayoutGrid className="w-3 h-3" />
                Chức vụ
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>
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
                      checked={selectedItems.size === proposals.length && proposals.length > 0}
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
                {proposals.map((item) => (
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
                          onClick={() => setIsFormOpen(true)}
                          className="p-1 text-orange-500 hover:bg-orange-50 rounded transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors" title="Xóa">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination (Visual only for now) */}
          <div className="border-t border-gray-200 px-3 py-2 flex items-center justify-between text-xs text-gray-500">
            <div>Hiển thị 1-5 của 5 bản ghi</div>
            <div className="flex gap-1">
              <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Trước</button>
              <button className="px-2 py-1 bg-orange-500 text-white rounded hover:bg-orange-600">1</button>
              <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Sau</button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-orange-500" />
                </div>
                <h2 className="font-semibold text-gray-900 text-base">Thêm đề xuất tuyển dụng</h2>
              </div>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {/* Section 1: Basic Info */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-orange-600 font-medium text-xs uppercase tracking-wide">
                  <List className="w-3.5 h-3.5" />
                  Thông tin cơ bản
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      <div className="flex items-center gap-1">
                        <Hash className="w-3 h-3 text-gray-400" />
                        Mã đề xuất <span className="text-red-500">*</span>
                      </div>
                    </label>
                    <input 
                      type="text" 
                      placeholder="VD: DX-2025-001"
                      className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Chức vụ <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <select className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 appearance-none">
                        <option value="">Chọn chức vụ</option>
                        <option>Lập trình viên Senior</option>
                        <option>Chuyên viên Tuyển dụng</option>
                        <option>Trưởng Nhóm Phát triển</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-1">
                      <FileText className="w-3 h-3 text-gray-400" />
                      Tiêu đề
                    </div>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Tiêu đề ngắn (tùy chọn)"
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>

                <div className="w-full md:w-1/2 pr-0 md:pr-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Trạng thái <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <select className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 appearance-none">
                      <option>Nháp</option>
                      <option>Chờ duyệt</option>
                      <option>Đã duyệt</option>
                      <option>Từ chối</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Section 2: Content */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-orange-600 font-medium text-xs uppercase tracking-wide">
                  <FileText className="w-3.5 h-3.5" />
                  Nội dung tuyển dụng
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Mô tả công việc <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    rows={3}
                    placeholder="Mô tả chi tiết công việc"
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Yêu cầu ứng viên <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    rows={3}
                    placeholder="Yêu cầu về kinh nghiệm, kỹ năng..."
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-1">
                      <ExternalLink className="w-3 h-3 text-gray-400" />
                      Link tin tuyển <span className="text-red-500">*</span>
                    </div>
                  </label>
                  <input 
                    type="text" 
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Section 3: Quantity & Deadline */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-orange-600 font-medium text-xs uppercase tracking-wide">
                  <LayoutGrid className="w-3.5 h-3.5" />
                  Số lượng & Thời hạn
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                   <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Số lượng cần tuyển <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="number" 
                      min="1"
                      className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-100 flex justify-between items-center bg-white">
              <button 
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button className="px-4 py-1.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors flex items-center gap-1.5 shadow-sm shadow-orange-200">
                <Plus className="w-3.5 h-3.5" />
                Thêm mới
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
