import React from 'react';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Download,
  Calendar,
  Layers,
  Clock
} from 'lucide-react';
import { INSURANCE_TYPES, COVERAGE_TERMS, QUEUE_STATUSES } from '../data/mockData';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedInsuranceType: string;
  onInsuranceTypeChange: (value: string) => void;
  selectedCoverageTerm: string;
  onCoverageTermChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  onResetFilters: () => void;
  onExportData: () => void;
  totalFilteredCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedInsuranceType,
  onInsuranceTypeChange,
  selectedCoverageTerm,
  onCoverageTermChange,
  selectedStatus,
  onStatusChange,
  onResetFilters,
  onExportData,
  totalFilteredCount,
}) => {
  const hasActiveFilters = 
    searchQuery.trim() !== '' ||
    selectedInsuranceType !== 'ทั้งหมด' ||
    selectedCoverageTerm !== 'ทั้งหมด' ||
    (selectedStatus !== 'ทั้งหมด' && selectedStatus !== '');

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
      
      {/* Search and Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        
        {/* Search input with icons */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ค้นหาเลขอ้างอิง, เลขกรมธรรม์, ชื่อผู้เอาประกัน, ผู้ชำระเบี้ย, ตัวแทน..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
            >
              ล้าง
            </button>
          )}
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="ล้างค่าตัวกรองทั้งหมด"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ล้างตัวกรอง</span>
            </button>
          )}

          <button
            onClick={onExportData}
            className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer shadow-2xs"
            title="ส่งออกรายการที่กรองเป็นไฟล์ CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>ส่งออก CSV</span>
          </button>
        </div>
      </div>

      {/* Dropdown Filters Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
        
        {/* Filter: ประเภทประกัน */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-blue-500" />
            ประเภทประกัน
          </label>
          <select
            value={selectedInsuranceType}
            onChange={(e) => onInsuranceTypeChange(e.target.value)}
            className="w-full py-1.5 px-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
          >
            {INSURANCE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Filter: งวดความคุ้มครอง */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-500" />
            งวดความคุ้มครอง / ความถี่ชำระ
          </label>
          <select
            value={selectedCoverageTerm}
            onChange={(e) => onCoverageTermChange(e.target.value)}
            className="w-full py-1.5 px-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
          >
            {COVERAGE_TERMS.map((term) => (
              <option key={term} value={term}>
                {term}
              </option>
            ))}
          </select>
        </div>

        {/* Filter: สถานะคิวงาน */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Layers className="w-3 h-3 text-purple-500" />
            สถานะคิวงาน
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full py-1.5 px-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
          >
            <option value="ทั้งหมด">ทั้งหมดทุกสถานะ</option>
            {QUEUE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Filter status indicator footer */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <div>
          ผลลัพธ์การกรอง: <span className="font-semibold text-slate-800">{totalFilteredCount}</span> รายการ
        </div>
        {hasActiveFilters && (
          <div className="flex items-center gap-1 text-blue-600">
            <span>กำลังใช้ตัวกรอง</span>
          </div>
        )}
      </div>

    </div>
  );
};
