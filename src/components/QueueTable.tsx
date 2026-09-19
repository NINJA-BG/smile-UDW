import React, { useState } from 'react';
import { UnderwritingCase, QueueStatus } from '../types';
import { 
  Eye, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  User, 
  Shield, 
  ChevronRight,
  Sparkles,
  ArrowUpDown,
  ExternalLink,
  Flame,
  Check,
  FileWarning,
  ClipboardCheck,
  Pencil
} from 'lucide-react';
import { QUEUE_STATUSES } from '../data/mockData';

interface QueueTableProps {
  cases: UnderwritingCase[];
  onSelectCase: (caseItem: UnderwritingCase) => void;
  onUpdateStatus: (caseId: string, newStatus: QueueStatus, note?: string) => void;
  onResetFilters?: () => void;
  onOpenEditStatus?: (caseItem: UnderwritingCase) => void;
}

export const QueueTable: React.FC<QueueTableProps> = ({
  cases,
  onSelectCase,
  onUpdateStatus,
  onResetFilters,
  onOpenEditStatus,
}) => {
  const [sortField, setSortField] = useState<'dueDate' | 'submittedDate' | 'premium'>('dueDate');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Sorting logic
  const sortedCases = [...cases].sort((a, b) => {
    if (sortField === 'dueDate') {
      const cmp = a.dueDate.localeCompare(b.dueDate);
      return sortAsc ? cmp : -cmp;
    }
    if (sortField === 'submittedDate') {
      const cmp = a.submittedDate.localeCompare(b.submittedDate);
      return sortAsc ? cmp : -cmp;
    }
    if (sortField === 'premium') {
      return sortAsc ? a.premium - b.premium : b.premium - a.premium;
    }
    return 0;
  });

  const handleSort = (field: 'dueDate' | 'submittedDate' | 'premium') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleInlineStatusChange = (caseItem: UnderwritingCase, newStatus: QueueStatus) => {
    if (caseItem.status === newStatus) return;
    setUpdatingId(caseItem.id);
    onUpdateStatus(caseItem.id, newStatus, `อัปเดตสถานะทันทีในตารางเป็น "${newStatus}"`);
    setTimeout(() => {
      setUpdatingId(null);
    }, 400);
  };

  // Helper for Status Badge styling
  const getStatusBadge = (status: QueueStatus) => {
    switch (status) {
      case 'เข้ามาใหม่':
        return 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-500/20';
      case 'รอดำเนินการ':
        return 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-500/20';
      case 'เสร็จสิ้น':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-500/20';
      case 'ใหม่(แก้ไข)':
        return 'bg-purple-50 text-purple-700 border-purple-200 ring-1 ring-purple-500/20';
      case 'รอดำเนินการ(แก้ไข)':
        return 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-500/20';
      case 'เอกสารไม่ถูกต้อง':
        return 'bg-rose-100 text-rose-800 border-rose-300 ring-1 ring-rose-500/30';
      case 'ตรวจสอบพิเศษ':
        return 'bg-amber-100 text-amber-900 border-amber-300 ring-1 ring-amber-500/30';
      case 'ไม่อนุมัติ':
        return 'bg-red-50 text-red-700 border-red-200 ring-1 ring-red-500/20';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Helper for Insurance Type style
  const getInsuranceTypeBadge = (type: string) => {
    if (type.includes('สุขภาพ')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (type.includes('ชีวิต')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (type.includes('โรคร้ายแรง')) return 'bg-rose-50 text-rose-700 border-rose-200';
    if (type.includes('อุบัติเหตุ')) return 'bg-amber-50 text-amber-700 border-amber-200';
    if (type.includes('ออมทรัพย์')) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    if (type.includes('ควบการลงทุน')) return 'bg-purple-50 text-purple-700 border-purple-200';
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  // Helper for Due Date indicator
  const getDueDateInfo = (dueDateStr: string) => {
    const today = new Date('2026-09-18');
    const due = new Date(dueDateStr);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        label: `เกินกำหนด ${Math.abs(diffDays)} วัน`,
        classes: 'text-rose-700 bg-rose-50 border border-rose-200 font-bold',
        isOverdue: true
      };
    } else if (diffDays === 0) {
      return {
        label: 'ครบกำหนดวันนี้',
        classes: 'text-amber-700 bg-amber-50 border border-amber-200 font-bold',
        isToday: true
      };
    } else if (diffDays === 1) {
      return {
        label: 'ครบกำหนดพรุ่งนี้',
        classes: 'text-amber-600 bg-amber-50/50 border border-amber-100',
        isSoon: true
      };
    } else {
      return {
        label: `เหลือ ${diffDays} วัน`,
        classes: 'text-slate-600 bg-slate-100 border border-slate-200',
      };
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* Table Top Controls & Record Count */}
      <div className="px-4 py-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/60">
        <div className="flex items-center space-x-2 text-xs text-slate-600">
          <span className="font-semibold text-slate-900">รายการคิวงานและคำขออนุมัติ:</span>
          <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
            {cases.length}
          </span>
          <span>รายการ</span>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <span>เรียงตาม:</span>
          <button
            onClick={() => handleSort('dueDate')}
            className={`px-2.5 py-1 rounded-md border flex items-center gap-1 transition-colors cursor-pointer ${
              sortField === 'dueDate' ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold' : 'bg-white border-slate-200'
            }`}
          >
            <span>วันครบกำหนด</span>
            <ArrowUpDown className="w-3 h-3" />
          </button>
          <button
            onClick={() => handleSort('submittedDate')}
            className={`px-2.5 py-1 rounded-md border flex items-center gap-1 transition-colors cursor-pointer ${
              sortField === 'submittedDate' ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold' : 'bg-white border-slate-200'
            }`}
          >
            <span>เวลายื่นคำขอ</span>
            <ArrowUpDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/90 text-slate-600 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
              <th className="py-3.5 px-3 text-center w-12">#</th>
              <th className="py-3.5 px-3">ประเภทประกัน</th>
              <th className="py-3.5 px-3">เลขอ้างอิง</th>
              <th className="py-3.5 px-3">ชื่อผู้เอา (ผู้เอาประกันภัย)</th>
              <th className="py-3.5 px-3">ชื่อผู้ชำ (ผู้ชำระเบี้ย)</th>
              <th className="py-3.5 px-3">ชื่อตัวแทน</th>
              <th className="py-3.5 px-3">เลขกรมธรรม์</th>
              <th className="py-3.5 px-3">วันที่ครบกำหนด</th>
              <th className="py-3.5 px-3">สถานะคิวงาน</th>
              <th className="py-3.5 px-3 text-center min-w-[200px]">การจัดการ & อัปเดตทันที</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {sortedCases.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FileText className="w-8 h-8 text-slate-300" />
                    <p className="text-sm font-medium text-slate-600">ไม่พบคิวงานที่ตรงกับเงื่อนไขการค้นหา</p>
                    <p className="text-xs text-slate-400">โปรดลองปรับเปลี่ยนคำค้นหาหรือตัวกรองด้านบน</p>
                    {onResetFilters && (
                      <button
                        onClick={onResetFilters}
                        className="mt-2 text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
                      >
                        ล้างค่าตัวกรองทั้งหมด
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              sortedCases.map((c, index) => {
                const dueDateInfo = getDueDateInfo(c.dueDate);
                const isItemUpdating = updatingId === c.id;
                const isDocError = c.hasDocumentError || c.status === 'เอกสารไม่ถูกต้อง';
                const isSpecialInspection = c.requiresSpecialInspection || c.status === 'ตรวจสอบพิเศษ';

                return (
                  <tr 
                    key={c.id} 
                    className={`transition-colors group ${
                      isDocError 
                        ? 'bg-rose-50/40 hover:bg-rose-50/70 border-l-4 border-l-rose-500' 
                        : isSpecialInspection
                          ? 'bg-amber-50/40 hover:bg-amber-50/70 border-l-4 border-l-amber-500'
                          : 'hover:bg-blue-50/40'
                    }`}
                  >
                    {/* Index & Urgent indicator */}
                    <td className="py-3 px-3 text-center font-medium text-slate-400">
                      <div className="flex items-center justify-center space-x-1">
                        {c.isUrgent && (
                          <span title="เคสเร่งด่วนพิเศษ">
                            <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                          </span>
                        )}
                        <span>{index + 1}</span>
                      </div>
                    </td>

                    {/* ประเภทประกัน พร้อมสัญลักษณ์เคสที่มีจุดตรวจสอบ */}
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-1.5">
                        {c.checkpointsCount && c.checkpointsCount > 0 ? (
                          <span 
                            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold border shrink-0 cursor-pointer ${
                              isDocError
                                ? 'bg-rose-100 text-rose-800 border-rose-300'
                                : isSpecialInspection
                                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                                  : 'bg-sky-50 text-[#0072b2] border-sky-200'
                            }`}
                            title={`มีจุดตรวจสอบ ${c.checkpointsCount} จุด`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectCase(c);
                            }}
                          >
                            <ClipboardCheck className="w-3 h-3 shrink-0" />
                            <span>{c.checkpointsCount}</span>
                          </span>
                        ) : null}
                        <div className="flex flex-col">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border w-fit ${getInsuranceTypeBadge(c.insuranceType)}`}>
                            {c.insuranceType.split(' ')[0]}
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5">
                            {c.coverageTerm.split(' ')[0]}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* เลขอ้างอิง */}
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      <div className="flex items-center space-x-1 flex-wrap gap-y-1">
                        <span className="font-mono text-xs text-blue-700 bg-blue-50/50 px-1.5 py-0.5 rounded border border-blue-100">
                          {c.refNo}
                        </span>
                        {(isDocError || isSpecialInspection) && (
                          <span 
                            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9.5px] font-bold shadow-2xs ${
                              isDocError ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}
                            title={c.documentErrorReason || 'ต้องตรวจสอบพิเศษเนื่องจากพบเอกสารผิด'}
                          >
                            <AlertTriangle className="w-3 h-3 text-rose-600 animate-pulse" />
                            <span>เอกสารผิด</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        ยื่นเมื่อ {c.submittedDate.split(' ')[0]}
                      </span>
                    </td>

                    {/* ชื่อผู้เอา (ชื่อผู้เอาประกันภัย) */}
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-900">{c.insuredName}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <span>อายุ {c.insuredAge} ปี</span>
                        <span>·</span>
                        <span className="truncate max-w-[120px]">{c.insuredOccupation}</span>
                      </div>
                    </td>

                    {/* ชื่อผู้ชำ (ชื่อผู้ชำระเบี้ย) */}
                    <td className="py-3 px-3">
                      <div className="text-slate-800 font-medium">{c.payerName}</div>
                      <span className="inline-block text-[10px] text-slate-400 mt-0.5">
                        ({c.payerRelation})
                      </span>
                    </td>

                    {/* ชื่อตัวแทน */}
                    <td className="py-3 px-3">
                      <div className="text-slate-900">{c.agentName}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <span className="font-mono">{c.agentCode}</span>
                        <span>·</span>
                        <span className="truncate max-w-[100px]">{c.agentBranch}</span>
                      </div>
                    </td>

                    {/* เลขกรมธรรม์ */}
                    <td className="py-3 px-3 font-mono text-slate-700 text-xs">
                      {c.policyNo}
                    </td>

                    {/* วันที่ครบกำหนด */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-medium text-slate-900">
                        {c.dueDate}
                      </div>
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] mt-0.5 ${dueDateInfo.classes}`}>
                        {dueDateInfo.label}
                      </span>
                    </td>

                    {/* สถานะคิวงาน */}
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-semibold border ${getStatusBadge(c.status)}`}>
                        {c.status}
                      </span>
                    </td>

                    {/* การจัดการ & อัปเดตสถานะทันที */}
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-2">
                        
                        {/* ปุ่มคลิกเพื่อดูรายละเอียดเชิงลึก */}
                        <button
                          onClick={() => onSelectCase(c)}
                          className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 active:bg-blue-200 border border-blue-200 text-xs font-semibold transition-all cursor-pointer shadow-2xs whitespace-nowrap"
                          title="ดูรายละเอียดเชิงลึกและประวัติของคำขอนี้"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>ดูเชิงลึก</span>
                        </button>

                        {/* ปุ่มเปิดหน้ารายละเอียดการตรวจสอบตามแบบฟอร์ม (Pencil icon) */}
                        {onOpenEditStatus && (
                          <button
                            onClick={() => onOpenEditStatus(c)}
                            className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 active:bg-amber-200 border border-amber-200 text-xs font-semibold transition-all cursor-pointer shadow-2xs whitespace-nowrap"
                            title="เปิดหน้ารายละเอียดการตรวจสอบ (Inspection UI)"
                          >
                            <Pencil className="w-3.5 h-3.5 text-amber-600" />
                            <span>ตรวจสอบ</span>
                          </button>
                        )}

                        {/* อัปเดตสถานะงานรายบุคคลได้ทันทีในตาราง */}
                        <div className="relative">
                          <select
                            value={c.status}
                            onChange={(e) => handleInlineStatusChange(c, e.target.value as QueueStatus)}
                            disabled={isItemUpdating}
                            className={`py-1.5 pl-2 pr-6 text-[11px] font-semibold rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all ${
                              isItemUpdating 
                                ? 'opacity-50 cursor-wait' 
                                : 'hover:border-slate-300 text-slate-700 border-slate-200'
                            }`}
                            title="เปลี่ยนสถานะงานของรายการนี้ทันที"
                          >
                            {QUEUE_STATUSES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </div>

                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer with Summary notes */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>ระบบเชื่อมโยงข้อมูลสถานะคิวงานแบบทันที (Instant Sync)</span>
        </div>
        <div>
          <span>แสดง {sortedCases.length} จากทั้งหมด {cases.length} รายการ</span>
        </div>
      </div>

    </div>
  );
};
