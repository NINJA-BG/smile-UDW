import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Plus, 
  Pencil, 
  Clock, 
  RefreshCw, 
  CheckCircle2, 
  X, 
  RotateCcw, 
  Eye, 
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Check,
  AlertTriangle,
  FileWarning,
  AlertCircle,
  ClipboardCheck,
  Send,
  UserCheck,
  BadgeAlert,
  HeartPulse
} from 'lucide-react';
import { UnderwritingCase, QueueStatus, InsuranceType } from '../types';
import { INSURANCE_TYPES } from '../data/mockData';

interface SmileUnderwriteQueueSectionProps {
  cases: UnderwritingCase[];
  onSelectCase: (caseItem: UnderwritingCase) => void;
  onOpenAuditLog: (caseItem: UnderwritingCase) => void;
  onOpenEditStatus: (caseItem: UnderwritingCase) => void;
  onOpenNewCaseModal?: () => void;
}

export const SmileUnderwriteQueueSection: React.FC<SmileUnderwriteQueueSectionProps> = ({
  cases,
  onSelectCase,
  onOpenAuditLog,
  onOpenEditStatus,
  onOpenNewCaseModal,
}) => {
  // Filter States
  const [selectedProduct, setSelectedProduct] = useState<string>('ประกันสุขภาพ');
  const [selectedQueueCategory, setSelectedQueueCategory] = useState<string>('ทั้งหมด');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['ใหม่', 'รอดำเนินการ']);
  const [coverageStartDateFilter, setCoverageStartDateFilter] = useState<string>('01/05/2569');
  const [searchBy, setSearchBy] = useState<string>('เลขที่ Application');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeBannerTab, setActiveBannerTab] = useState<string>('ทั้งหมด');

  // Status Multi-select dropdown open state
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState<boolean>(false);

  // Pagination states (matching screenshot default 10 per page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Available statuses for multi-select
  const ALL_STATUS_OPTIONS = [
    'ใหม่',
    'รอดำเนินการ',
    'ตรวจเอกสารผ่าน',
    'ใหม่(แก้ไข)',
    'รอดำเนินการ(แก้ไข)',
    'ส่งกลับแก้ไข (รอผู้แทนดำเนินการ)',
    'เอกสารไม่ถูกต้อง',
    'ตรวจสอบพิเศษ',
    'ไม่อนุมัติ'
  ];

  // Calculate status counts for the top 7 cards in banner
  const bannerCounts = useMemo(() => {
    let total = cases.length;
    let countNew = 0;
    let countNewRevised = 0;
    let countPending = 0;
    let countPendingRevised = 0;
    let countApproved = 0;
    let countRejected = 0;
    let countSpecialInspection = 0;

    cases.forEach(c => {
      if (c.hasDocumentError || c.requiresSpecialInspection || c.status === 'เอกสารไม่ถูกต้อง' || c.status === 'ตรวจสอบพิเศษ') {
        countSpecialInspection++;
      }
      const st = c.status;
      if (st === 'ใหม่' || st === 'เข้ามาใหม่') countNew++;
      else if (st === 'ใหม่(แก้ไข)' || st === 'ส่งกลับแก้ไข (รอผู้แทนดำเนินการ)') countNewRevised++;
      else if (st === 'รอดำเนินการ') countPending++;
      else if (st === 'รอดำเนินการ(แก้ไข)') countPendingRevised++;
      else if (st === 'ตรวจเอกสารผ่าน' || st === 'เสร็จสิ้น' || st === 'อนุมัติตรวจเอกสารผ่าน') countApproved++;
      else if (st === 'ไม่อนุมัติ') countRejected++;
    });

    return {
      total,
      countNew,
      countNewRevised,
      countPending,
      countPendingRevised,
      countApproved,
      countRejected,
      countSpecialInspection
    };
  }, [cases]);

  // Handle Banner Card Click
  const handleBannerTabClick = (tabKey: string) => {
    setActiveBannerTab(tabKey);
    setCurrentPage(1);

    if (tabKey === 'ทั้งหมด') {
      setSelectedStatuses([]);
    } else if (tabKey === 'ใหม่') {
      setSelectedStatuses(['ใหม่']);
    } else if (tabKey === 'ใหม่(แก้ไข)') {
      setSelectedStatuses(['ใหม่(แก้ไข)']);
    } else if (tabKey === 'รอดำเนินการ') {
      setSelectedStatuses(['รอดำเนินการ']);
    } else if (tabKey === 'รอดำเนินการ(แก้ไข)') {
      setSelectedStatuses(['รอดำเนินการ(แก้ไข)']);
    } else if (tabKey === 'อนุมัติตรวจเอกสารผ่าน') {
      setSelectedStatuses(['ตรวจเอกสารผ่าน', 'อนุมัติตรวจเอกสารผ่าน', 'เสร็จสิ้น']);
    } else if (tabKey === 'ไม่อนุมัติ') {
      setSelectedStatuses(['ไม่อนุมัติ']);
    }
  };

  // Toggle status in multi-select
  const toggleStatusSelection = (statusVal: string) => {
    setSelectedStatuses(prev => {
      if (prev.includes(statusVal)) {
        return prev.filter(s => s !== statusVal);
      } else {
        return [...prev, statusVal];
      }
    });
    setCurrentPage(1);
  };

  const removeStatusTag = (statusVal: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedStatuses(prev => prev.filter(s => s !== statusVal));
    setCurrentPage(1);
  };

  // Filter cases logic
  const filteredCases = useMemo(() => {
    return cases.filter(c => {
      // 1. Product Filter
      if (selectedProduct !== 'ทั้งหมด') {
        if (!c.insuranceType.includes(selectedProduct) && !selectedProduct.includes(c.insuranceType)) {
          // If selected is 'ประกันสุขภาพ', matches if insuranceType contains 'สุขภาพ'
          if (!c.insuranceType.toLowerCase().includes(selectedProduct.toLowerCase().replace(/ประกัน|\s+/g, ''))) {
            return false;
          }
        }
      }

      // 2. Queue Category Filter
      if (selectedQueueCategory === 'งานเร่งด่วน' && !c.isUrgent) {
        return false;
      }
      if (selectedQueueCategory === 'งานแก้ไขเอกสาร' && !c.status.includes('แก้ไข')) {
        return false;
      }
      if (selectedQueueCategory === 'ตรวจสอบพิเศษ (เอกสารผิด)') {
        if (!c.hasDocumentError && !c.requiresSpecialInspection && c.status !== 'เอกสารไม่ถูกต้อง' && c.status !== 'ตรวจสอบพิเศษ') {
          return false;
        }
      }

      // 3. Status Filter (Multi-select)
      if (selectedStatuses.length > 0) {
        const matchesStatus = selectedStatuses.some(targetSt => {
          if (targetSt === 'ใหม่') return c.status === 'ใหม่' || c.status === 'เข้ามาใหม่';
          if (targetSt === 'ตรวจเอกสารผ่าน' || targetSt === 'อนุมัติตรวจเอกสารผ่าน') {
            return c.status === 'ตรวจเอกสารผ่าน' || c.status === 'เสร็จสิ้น' || c.status === 'อนุมัติตรวจเอกสารผ่าน';
          }
          return c.status === targetSt;
        });
        if (!matchesStatus) return false;
      }

      // 4. Search By
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        if (searchBy === 'เลขที่ Application') {
          const appNo = c.applicationNo || c.policyNo.replace('POL-', '690') || c.refNo;
          if (!appNo.toLowerCase().includes(q)) return false;
        } else if (searchBy === 'ชื่อ-สกุลผู้เอาประกัน') {
          if (!c.insuredName.toLowerCase().includes(q)) return false;
        } else if (searchBy === 'ชื่อ-สกุลผู้ชำระเบี้ย') {
          if (!c.payerName.toLowerCase().includes(q)) return false;
        } else if (searchBy === 'รหัสผู้แทน') {
          if (!c.agentCode.toLowerCase().includes(q) && !c.agentName.toLowerCase().includes(q)) return false;
        } else if (searchBy === 'เลขกรมธรรม์') {
          if (!c.policyNo.toLowerCase().includes(q)) return false;
        } else {
          // General search
          const fullStr = `${c.applicationNo || ''} ${c.refNo} ${c.policyNo} ${c.insuredName} ${c.payerName} ${c.agentCode}`.toLowerCase();
          if (!fullStr.includes(q)) return false;
        }
      }

      return true;
    });
  }, [cases, selectedProduct, selectedQueueCategory, selectedStatuses, searchBy, searchQuery]);

  // Pagination calculation
  const totalItems = filteredCases.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentCases = filteredCases.slice(startIndex, endIndex);

  // Helper for status pill styling in the table matching the screenshot
  const renderStatusPill = (status: QueueStatus) => {
    switch (status) {
      case 'ใหม่':
      case 'เข้ามาใหม่':
        return (
          <span className="inline-block px-4 py-1 rounded-md text-xs font-medium bg-[#e0f2fe] text-[#0369a1]">
            ใหม่
          </span>
        );
      case 'รอดำเนินการ':
        return (
          <span className="inline-block px-4 py-1 rounded-md text-xs font-medium bg-[#fef3c7] text-[#92400e]">
            รอดำเนินการ
          </span>
        );
      case 'ตรวจเอกสารผ่าน':
      case 'อนุมัติตรวจเอกสารผ่าน':
      case 'เสร็จสิ้น':
        return (
          <span className="inline-block px-4 py-1 rounded-md text-xs font-medium bg-[#dcfce7] text-[#15803d]">
            ตรวจเอกสารผ่าน
          </span>
        );
      case 'ใหม่(แก้ไข)':
        return (
          <span className="inline-block px-4 py-1 rounded-md text-xs font-medium bg-[#e0f7fa] text-[#00838f]">
            ใหม่(แก้ไข)
          </span>
        );
      case 'รอดำเนินการ(แก้ไข)':
        return (
          <span className="inline-block px-4 py-1 rounded-md text-xs font-medium bg-[#fffbeb] text-[#b45309]">
            รอดำเนินการ(แก้ไข)
          </span>
        );
      case 'ส่งกลับแก้ไข (รอผู้แทนดำเนินการ)':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-semibold bg-[#e0f7fa] text-[#006064] border border-cyan-300">
            <Send className="w-3 h-3 text-cyan-600" />
            ส่งกลับแก้ไข (รอผู้แทน)
          </span>
        );
      case 'เอกสารไม่ถูกต้อง':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-semibold bg-[#ffe4e6] text-[#be123c] border border-rose-300">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            เอกสารไม่ถูกต้อง
          </span>
        );
      case 'ตรวจสอบพิเศษ':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-semibold bg-[#fef3c7] text-[#92400e] border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            ตรวจสอบพิเศษ
          </span>
        );
      case 'ไม่อนุมัติ':
        return (
          <span className="inline-block px-4 py-1 rounded-md text-xs font-medium bg-[#ffe4e6] text-[#be123c]">
            ไม่อนุมัติ
          </span>
        );
      default:
        return (
          <span className="inline-block px-4 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      
      {/* 1. Top Blue Header Banner (matching exact screenshot) */}
      <div className="bg-[#0072b2] text-white rounded-2xl p-6 shadow-md">
        
        {/* Title & Subtitle Badge */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-xs">
            SmileUnderwrite
          </h1>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center px-3 py-1 rounded-md text-xs sm:text-sm font-medium bg-white/10 border border-white/25 text-sky-100 backdrop-blur-xs">
              ระบบติดตามงานและตรวจสอบรายการส่งขออนุมัติ
            </span>

            {/* Special Inspection / Document Error Quick Filter Badge */}
            <button
              type="button"
              onClick={() => {
                setSelectedQueueCategory('ตรวจสอบพิเศษ (เอกสารผิด)');
                setSelectedStatuses([]);
                setActiveBannerTab('');
                setCurrentPage(1);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs ${
                selectedQueueCategory === 'ตรวจสอบพิเศษ (เอกสารผิด)'
                  ? 'bg-amber-300 text-slate-950 ring-2 ring-white shadow-md'
                  : 'bg-amber-400/20 text-amber-200 border border-amber-300/40 hover:bg-amber-400/30'
              }`}
              title="คลิกเพื่อกรองเฉพาะคิวงานที่ต้องตรวจสอบพิเศษเนื่องจากพบเอกสารผิด"
            >
              <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
              <span>
                ตรวจสอบพิเศษ (เอกสารผิด): <strong className="underline decoration-amber-400 underline-offset-2">{bannerCounts.countSpecialInspection}</strong> เคส
              </span>
            </button>
          </div>
        </div>

        {/* Row of 7 Status Filter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mt-6">
          
          {/* 1. ทั้งหมด */}
          <button
            type="button"
            onClick={() => handleBannerTabClick('ทั้งหมด')}
            className={`p-3 rounded-xl border flex items-center space-x-3 text-left transition-all cursor-pointer ${
              activeBannerTab === 'ทั้งหมด'
                ? 'bg-white/25 border-white shadow-sm ring-2 ring-white/50'
                : 'bg-white/10 border-white/20 hover:bg-white/15'
            }`}
          >
            <FileText className="w-6 h-6 text-white shrink-0" />
            <div>
              <div className="text-xs text-sky-100">ทั้งหมด</div>
              <div className="text-sm font-bold text-white">{bannerCounts.total || 500}</div>
            </div>
          </button>

          {/* 2. ใหม่ */}
          <button
            type="button"
            onClick={() => handleBannerTabClick('ใหม่')}
            className={`p-3 rounded-xl border flex items-center space-x-3 text-left transition-all cursor-pointer ${
              activeBannerTab === 'ใหม่'
                ? 'bg-white/25 border-white shadow-sm ring-2 ring-white/50'
                : 'bg-white/10 border-white/20 hover:bg-white/15'
            }`}
          >
            <Plus className="w-6 h-6 text-white shrink-0" />
            <div>
              <div className="text-xs text-sky-100">ใหม่</div>
              <div className="text-sm font-bold text-white">{bannerCounts.countNew || 300}</div>
            </div>
          </button>

          {/* 3. ใหม่(แก้ไข) */}
          <button
            type="button"
            onClick={() => handleBannerTabClick('ใหม่(แก้ไข)')}
            className={`p-3 rounded-xl border flex items-center space-x-3 text-left transition-all cursor-pointer ${
              activeBannerTab === 'ใหม่(แก้ไข)'
                ? 'bg-white/25 border-white shadow-sm ring-2 ring-white/50'
                : 'bg-white/10 border-white/20 hover:bg-white/15'
            }`}
          >
            <Pencil className="w-6 h-6 text-white shrink-0" />
            <div>
              <div className="text-xs text-sky-100">ใหม่(แก้ไข)</div>
              <div className="text-sm font-bold text-white">{bannerCounts.countNewRevised || 300}</div>
            </div>
          </button>

          {/* 4. รอดำเนินการ */}
          <button
            type="button"
            onClick={() => handleBannerTabClick('รอดำเนินการ')}
            className={`p-3 rounded-xl border flex items-center space-x-3 text-left transition-all cursor-pointer ${
              activeBannerTab === 'รอดำเนินการ'
                ? 'bg-white/25 border-white shadow-sm ring-2 ring-white/50'
                : 'bg-white/10 border-white/20 hover:bg-white/15'
            }`}
          >
            <Clock className="w-6 h-6 text-white shrink-0" />
            <div>
              <div className="text-xs text-sky-100">รอดำเนินการ</div>
              <div className="text-sm font-bold text-white">{bannerCounts.countPending || 30}</div>
            </div>
          </button>

          {/* 5. รอดำเนินการ(แก้ไข) */}
          <button
            type="button"
            onClick={() => handleBannerTabClick('รอดำเนินการ(แก้ไข)')}
            className={`p-3 rounded-xl border flex items-center space-x-3 text-left transition-all cursor-pointer ${
              activeBannerTab === 'รอดำเนินการ(แก้ไข)'
                ? 'bg-white/25 border-white shadow-sm ring-2 ring-white/50'
                : 'bg-white/10 border-white/20 hover:bg-white/15'
            }`}
          >
            <RefreshCw className="w-6 h-6 text-white shrink-0" />
            <div>
              <div className="text-xs text-sky-100">รอดำเนินการ(แก้ไข)</div>
              <div className="text-sm font-bold text-white">{bannerCounts.countPendingRevised || 30}</div>
            </div>
          </button>

          {/* 6. อนุมัติตรวจเอกสารผ่าน */}
          <button
            type="button"
            onClick={() => handleBannerTabClick('อนุมัติตรวจเอกสารผ่าน')}
            className={`p-3 rounded-xl border flex items-center space-x-3 text-left transition-all cursor-pointer ${
              activeBannerTab === 'อนุมัติตรวจเอกสารผ่าน'
                ? 'bg-white/25 border-white shadow-sm ring-2 ring-white/50'
                : 'bg-white/10 border-white/20 hover:bg-white/15'
            }`}
          >
            <CheckCircle2 className="w-6 h-6 text-white shrink-0" />
            <div>
              <div className="text-xs text-sky-100 leading-tight">อนุมัติตรวจเอกสารผ่าน</div>
              <div className="text-sm font-bold text-white">{bannerCounts.countApproved || 30}</div>
            </div>
          </button>

          {/* 7. ไม่อนุมัติ */}
          <button
            type="button"
            onClick={() => handleBannerTabClick('ไม่อนุมัติ')}
            className={`p-3 rounded-xl border flex items-center space-x-3 text-left transition-all cursor-pointer ${
              activeBannerTab === 'ไม่อนุมัติ'
                ? 'bg-white/25 border-white shadow-sm ring-2 ring-white/50'
                : 'bg-white/10 border-white/20 hover:bg-white/15'
            }`}
          >
            <X className="w-6 h-6 text-white shrink-0" />
            <div>
              <div className="text-xs text-sky-100">ไม่อนุมัติ</div>
              <div className="text-sm font-bold text-white">{bannerCounts.countRejected || 30}</div>
            </div>
          </button>

        </div>
      </div>

      {/* 2. Filter Card with Floating Legend Labels (matching exact screenshot layout) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        
        {/* Row 1: 4 columns (ผลิตภัณฑ์, ประเภทคิวงาน, สถานะคิวงาน, วันที่เริ่มคุ้มครอง) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Field 1: ผลิตภัณฑ์ */}
          <div className="relative">
            <fieldset className="border border-slate-300 rounded-lg px-3 pt-1 pb-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all bg-white">
              <legend className="text-[11px] font-medium text-slate-500 px-1">ผลิตภัณฑ์</legend>
              <div className="relative">
                <select
                  value={selectedProduct}
                  onChange={(e) => {
                    setSelectedProduct(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-transparent text-sm text-slate-800 pr-6 py-0.5 focus:outline-none appearance-none cursor-pointer font-normal"
                >
                  <option value="ทั้งหมด">ทั้งหมดทุกผลิตภัณฑ์</option>
                  <option value="ประกันสุขภาพ">ประกันสุขภาพ</option>
                  <option value="ประกันชีวิต">ประกันชีวิต (Life)</option>
                  <option value="ประกันโรคร้ายแรง">ประกันโรคร้ายแรง (CI)</option>
                  <option value="ประกันอุบัติเหตุ">ประกันอุบัติเหตุ (PA)</option>
                  <option value="ประกันออมทรัพย์">ประกันสะสมทรัพย์/บำนาญ</option>
                  <option value="ประกันควบการลงทุน">ประกันควบการลงทุน (Unit Linked)</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </fieldset>
          </div>

          {/* Field 2: ประเภทคิวงาน */}
          <div className="relative">
            <fieldset className="border border-slate-300 rounded-lg px-3 pt-1 pb-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all bg-white">
              <legend className="text-[11px] font-medium text-slate-500 px-1">ประเภทคิวงาน</legend>
              <div className="relative">
                <select
                  value={selectedQueueCategory}
                  onChange={(e) => {
                    setSelectedQueueCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-transparent text-sm text-slate-800 pr-6 py-0.5 focus:outline-none appearance-none cursor-pointer font-normal"
                >
                  <option value="ทั้งหมด">ทั้งหมด</option>
                  <option value="งานปกติ">งานปกติ (Standard)</option>
                  <option value="งานเร่งด่วน">งานเร่งด่วน (Urgent SLA)</option>
                  <option value="ตรวจสอบพิเศษ (เอกสารผิด)">⚠️ ตรวจสอบพิเศษ (เอกสารผิด)</option>
                  <option value="งานแก้ไขเอกสาร">งานแก้ไขเอกสาร (Revision)</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </fieldset>
          </div>

          {/* Field 3: สถานะคิวงาน (Multi-select Tag field matching screenshot: [ใหม่ x] [รอดำเนินการ x]) */}
          <div className="relative">
            <fieldset 
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              className="border border-slate-300 rounded-lg px-3 pt-1 pb-1.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all bg-white cursor-pointer min-h-[46px] flex flex-col justify-center"
            >
              <legend className="text-[11px] font-medium text-slate-500 px-1">สถานะคิวงาน</legend>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-1.5 pr-4">
                  {selectedStatuses.length === 0 ? (
                    <span className="text-xs text-slate-400">เลือกสถานะคิวงาน...</span>
                  ) : (
                    selectedStatuses.map((st) => (
                      <span 
                        key={st}
                        className="inline-flex items-center space-x-1 px-2 py-0.5 bg-[#0077b6] text-white text-[11px] rounded-md font-medium"
                      >
                        <span>{st}</span>
                        <button
                          type="button"
                          onClick={(e) => removeStatusTag(st, e)}
                          className="hover:bg-white/20 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
            </fieldset>

            {/* Status Dropdown Menu */}
            {isStatusDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-20"
                  onClick={() => setIsStatusDropdownOpen(false)}
                />
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-30 space-y-1 text-xs">
                  <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase">
                    เลือกสถานะที่ต้องการแสดง:
                  </div>
                  {ALL_STATUS_OPTIONS.map((opt) => {
                    const isSelected = selectedStatuses.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleStatusSelection(opt)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected ? 'bg-blue-50 text-blue-700 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    );
                  })}
                  <div className="pt-1 border-t border-slate-100 flex justify-between px-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedStatuses([]);
                        setIsStatusDropdownOpen(false);
                      }}
                      className="text-[11px] text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      ล้างทั้งหมด
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsStatusDropdownOpen(false)}
                      className="text-[11px] text-blue-600 font-bold hover:underline cursor-pointer"
                    >
                      เสร็จสิ้น
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Field 4: วันที่เริ่มคุ้มครอง */}
          <div className="relative">
            <fieldset className="border border-slate-300 rounded-lg px-3 pt-1 pb-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all bg-white">
              <legend className="text-[11px] font-medium text-slate-500 px-1">วันที่เริ่มคุ้มครอง</legend>
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={coverageStartDateFilter}
                  onChange={(e) => setCoverageStartDateFilter(e.target.value)}
                  placeholder="01/05/2569"
                  className="w-full bg-transparent text-sm text-slate-800 py-0.5 focus:outline-none"
                />
                <CalendarIcon className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
            </fieldset>
          </div>

        </div>

        {/* Row 2: ค้นหาจาก, ค้นหา input, ปุ่ม ค้นหา */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-1">
          
          {/* Field 5: ค้นหาจาก (4 cols on sm/lg) */}
          <div className="sm:col-span-4 lg:col-span-3">
            <fieldset className="border border-slate-300 rounded-lg px-3 pt-1 pb-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all bg-white">
              <legend className="text-[11px] font-medium text-slate-500 px-1">ค้นหาจาก</legend>
              <div className="relative">
                <select
                  value={searchBy}
                  onChange={(e) => setSearchBy(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-800 pr-6 py-0.5 focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="เลขที่ Application">เลขที่ Application</option>
                  <option value="ชื่อ-สกุลผู้เอาประกัน">ชื่อ-สกุลผู้เอาประกัน</option>
                  <option value="ชื่อ-สกุลผู้ชำระเบี้ย">ชื่อ-สกุลผู้ชำระเบี้ย</option>
                  <option value="รหัสผู้แทน">รหัสผู้แทน</option>
                  <option value="เลขกรมธรรม์">เลขกรมธรรม์</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </fieldset>
          </div>

          {/* Field 6: ช่องพิมพ์ค้นหา (6 cols on sm/lg) */}
          <div className="sm:col-span-6 lg:col-span-7">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="ค้นหา..."
              className="w-full h-[46px] px-3.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Field 7: ปุ่ม "ค้นหา" (2 cols on sm/lg) */}
          <div className="sm:col-span-2 lg:col-span-2 flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              className="w-full h-[46px] px-6 rounded-lg bg-[#0077b6] hover:bg-[#005f94] text-white font-bold text-sm shadow-xs transition-colors flex items-center justify-center cursor-pointer"
            >
              ค้นหา
            </button>
            {(searchQuery || selectedStatuses.length > 0 || selectedProduct !== 'ประกันสุขภาพ') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedProduct('ประกันสุขภาพ');
                  setSelectedQueueCategory('ทั้งหมด');
                  setSelectedStatuses(['ใหม่', 'รอดำเนินการ']);
                  setActiveBannerTab('ทั้งหมด');
                  setCurrentPage(1);
                }}
                className="h-[46px] px-3 text-xs text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors whitespace-nowrap cursor-pointer"
                title="ล้างตัวกรอง"
              >
                ล้าง
              </button>
            )}
          </div>

        </div>

      </div>

      {/* 2.5 Alert Notification Banner for Change Requests */}
      <div className="bg-orange-50/70 border border-orange-200 rounded-xl p-3 text-slate-800 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-orange-100 rounded-lg shrink-0">
            <AlertCircle className="w-4 h-4 text-orange-600" />
          </div>
          <div>
            <h4 className="font-semibold text-xs text-slate-900 flex items-center gap-2">
              <span>รายการแจ้งขอแก้ไขข้อมูล</span>
              <span className="text-[11px] bg-white px-2 py-0.5 rounded-full font-semibold text-orange-800 border border-orange-200">รอดำเนินการ 2 รายการ</span>
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              แสดงรายละเอียดก่อนกล่องผลการตรวจสอบ พร้อมระบุประเภทผู้แจ้ง ชื่อ วันที่ เวลา และหมายเหตุ
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => {
              const targetCase = cases.find(c => c.healthProfile?.isAbnormal) || cases[0];
              onSelectCase(targetCase);
            }}
            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-950 rounded-lg text-xs font-bold transition-colors border border-rose-300 shadow-2xs cursor-pointer flex items-center gap-1.5"
          >
            <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
            <span>ทดสอบ: เคสแถลงสุขภาพผิดปกติ (ผ่าตัดซีสต์/APS)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              const targetCase = cases.find(c => c.customerChangeRequest?.source.includes('ลูกค้า')) || cases[0];
              onOpenEditStatus(targetCase);
            }}
            className="px-3 py-1.5 bg-white hover:bg-orange-50 text-orange-950 rounded-lg text-xs font-semibold transition-colors border border-orange-200 shadow-2xs cursor-pointer flex items-center gap-1.5"
          >
            <span>ลูกค้าขอแก้ไข (18/09/2569)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              const targetCase = cases.find(c => c.customerChangeRequest?.source.includes('ผู้ให้บริการ') || c.customerChangeRequest?.source.includes('ตัวแทน')) || cases[3] || cases[0];
              onOpenEditStatus(targetCase);
            }}
            className="px-3 py-1.5 bg-white hover:bg-orange-50 text-orange-950 rounded-lg text-xs font-semibold transition-colors border border-orange-200 shadow-2xs cursor-pointer flex items-center gap-1.5"
          >
            <span>ผู้ให้บริการขอแก้ไข (18/09/2569)</span>
          </button>
        </div>
      </div>

      {/* 3. Table with Exact Blue Header Bar (matching screenshot) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            
            {/* Header row in solid cyan-blue bg-[#0072b2] with white text */}
            <thead>
              <tr className="bg-[#0072b2] text-white text-xs font-semibold">
                <th className="py-3 px-4 whitespace-nowrap">ผลิตภัณฑ์</th>
                <th className="py-3 px-4 whitespace-nowrap">เลขที่ Application</th>
                <th className="py-3 px-4 whitespace-nowrap">วันที่เริ่มคุ้มครอง</th>
                <th className="py-3 px-4 whitespace-nowrap">ชื่อ-สกุลผู้เอาประกัน</th>
                <th className="py-3 px-4 whitespace-nowrap">ชื่อ-สกุลผู้ชำระเบี้ย</th>
                <th className="py-3 px-4 whitespace-nowrap">วันที่หมดอายุ</th>
                <th className="py-3 px-4 whitespace-nowrap">รหัสผู้แทน</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">จุดตรวจสอบ</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">สถานะคิวงาน</th>
                <th className="py-3 px-4 text-center whitespace-nowrap w-28">การจัดการ</th>
              </tr>
            </thead>

            {/* Table Body with clean rows and action icons */}
            <tbody className="divide-y divide-slate-200 text-xs text-slate-800">
              {currentCases.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FileText className="w-8 h-8 text-slate-300" />
                      <p className="text-sm font-semibold text-slate-600">ไม่พบรายการคิวงานที่ตรงกับเงื่อนไขการค้นหา</p>
                      <p className="text-xs text-slate-400">โปรดลองเปลี่ยนคำค้นหา หรือกดล้างตัวกรอง</p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedProduct('ทั้งหมด');
                          setSelectedStatuses([]);
                          setActiveBannerTab('ทั้งหมด');
                        }}
                        className="mt-2 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                      >
                        แสดงคิวงานทั้งหมด
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                currentCases.map((c) => {
                  const appNo = c.applicationNo || c.policyNo.replace('POL-', '690') || '690300001';
                  const startDate = c.coverageStartDate || '01/10/2569';
                  const expDate = c.expiryDate || '20/10/2569 21:00:00';
                  const agentCodeDisplay = c.agentCode.replace(/[^0-9]/g, '').slice(-5) || '08876';
                  const checkpoints = c.checkpointsCount ?? (c.status.includes('แก้ไข') ? 3 : c.status === 'รอดำเนินการ' ? 1 : 0);
                  const isDocError = c.hasDocumentError || c.status === 'เอกสารไม่ถูกต้อง';
                  const isSpecialInspection = c.requiresSpecialInspection || c.status === 'ตรวจสอบพิเศษ';

                  return (
                    <tr 
                      key={c.id} 
                      className={`transition-colors ${
                        isDocError
                          ? 'bg-rose-50/50 hover:bg-rose-50/80 border-l-4 border-l-rose-500'
                          : isSpecialInspection
                            ? 'bg-amber-50/50 hover:bg-amber-50/80 border-l-4 border-l-amber-500'
                            : 'hover:bg-blue-50/40'
                      }`}
                    >
                      {/* ผลิตภัณฑ์ พร้อมสัญลักษณ์เคสที่มีจุดตรวจสอบ */}
                      <td className="py-3.5 px-4 font-medium text-slate-900 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {checkpoints > 0 ? (
                            <span 
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold shadow-2xs cursor-pointer transition-all ${
                                isDocError
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300 ring-1 ring-rose-400/30 hover:bg-rose-200'
                                  : isSpecialInspection
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300 ring-1 ring-amber-400/30 hover:bg-amber-200'
                                    : 'bg-sky-50 text-[#0072b2] border border-sky-200 ring-1 ring-sky-300/40 hover:bg-sky-100'
                              }`}
                              title={
                                isDocError
                                  ? `เคสนี้มีจุดตรวจสอบ ${checkpoints} จุด (มีเอกสารไม่ถูกต้อง: ${c.documentErrorReason || ''}) - คลิกเพื่อดูรายละเอียด`
                                  : `เคสนี้มีจุดตรวจสอบ ${checkpoints} จุด - คลิกเพื่อดูรายละเอียด`
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectCase(c);
                              }}
                            >
                              {isDocError ? (
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 animate-pulse shrink-0" />
                              ) : (
                                <ClipboardCheck className="w-3.5 h-3.5 text-[#0072b2] shrink-0" />
                              )}
                              <span>{checkpoints} จุด</span>
                            </span>
                          ) : (
                            <span 
                              className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-400 text-[10px] font-medium shrink-0"
                              title="ไม่มีจุดตรวจสอบคั่งค้าง"
                            >
                              -
                            </span>
                          )}
                          <span className="font-semibold text-slate-900">{c.insuranceType.split(' ')[0]}</span>
                        </div>
                      </td>

                      {/* เลขที่ Application พร้อมสัญลักษณ์ตรวจสอบพิเศษกรณีเอกสารผิด */}
                      <td className="py-3.5 px-4 font-mono text-slate-700 whitespace-nowrap">
                        <div className="flex flex-col items-start gap-1">
                          <span className="font-semibold text-slate-900">{appNo}</span>
                          {(isDocError || isSpecialInspection) && (
                            <div 
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-bold shadow-2xs cursor-pointer transition-all ${
                                isDocError
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200'
                                  : 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                              }`}
                              title={c.documentErrorReason || 'เอกสารไม่ถูกต้อง ต้องตรวจสอบพิเศษ'}
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectCase(c);
                              }}
                            >
                              <AlertTriangle className={`w-3.5 h-3.5 shrink-0 ${isDocError ? 'text-rose-600 animate-pulse' : 'text-amber-600'}`} />
                              <span>{isDocError ? 'ตรวจสอบพิเศษ (เอกสารผิด)' : 'ตรวจสอบพิเศษ'}</span>
                            </div>
                          )}
                          {c.documentErrorReason && (
                            <span className="text-[10px] text-rose-600 max-w-[180px] truncate" title={`สาเหตุ: ${c.documentErrorReason}`}>
                              {c.documentErrorReason}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* วันที่เริ่มคุ้มครอง */}
                      <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                        {startDate}
                      </td>

                      {/* ชื่อ-สกุลผู้เอาประกัน */}
                      <td className="py-3.5 px-4 font-medium text-slate-900 whitespace-nowrap">
                        <div className="flex flex-col items-start gap-0.5">
                          <span>{c.insuredName}</span>
                          {c.healthProfile?.isAbnormal && (
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-bold border ${
                              c.healthProfile.scenarioType === 'abnormal_tumor_pending'
                                ? 'bg-rose-50 text-rose-800 border-rose-200'
                                : 'bg-amber-50 text-amber-900 border-amber-200'
                            }`}>
                              <HeartPulse className="w-3 h-3 text-rose-500 shrink-0" />
                              <span>{c.healthProfile.summaryFlag}</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* ชื่อ-สกุลผู้ชำระเบี้ย พร้อมป้ายแจ้งเตือนเมื่อมีการขอแก้ไขข้อมูล */}
                      <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                        <div className="flex flex-col items-start gap-0.5">
                          <span>{c.payerName}</span>
                          {c.customerChangeRequest?.hasRequest && (
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer transition-colors"
                              title={`มีแจ้งขอแก้ไข: ${c.customerChangeRequest.reason} (${c.customerChangeRequest.source}) ${c.customerChangeRequest.requestDate} ${c.customerChangeRequest.requestTime}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenEditStatus(c);
                              }}
                            >
                              <UserCheck className="w-3 h-3 text-slate-500" />
                              <span>
                                {c.customerChangeRequest.source.includes('ลูกค้า') ? 'ลูกค้าขอแก้ไข' : 'ผู้ให้บริการขอแก้ไข'}
                              </span>
                            </button>
                          )}
                        </div>
                      </td>

                      {/* วันที่หมดอายุ */}
                      <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">
                        {expDate}
                      </td>

                      {/* รหัสผู้แทน */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onSelectCase(c)}
                          className="font-medium text-[#0072b2] hover:underline cursor-pointer"
                        >
                          {agentCodeDisplay}
                        </button>
                      </td>

                      {/* จุดตรวจสอบ พร้อมสัญลักษณ์แจ้งเตือนเอกสารผิด */}
                      <td className="py-3.5 px-4 text-center font-medium whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-1.5">
                          <span className={`inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full text-xs font-bold ${
                            isDocError
                              ? 'bg-rose-100 text-rose-800 ring-2 ring-rose-300'
                              : isSpecialInspection
                                ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-300'
                                : 'bg-slate-100 text-slate-700'
                          }`}>
                            {checkpoints}
                          </span>
                          {isDocError && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectCase(c);
                              }}
                              className="cursor-pointer text-rose-500 hover:text-rose-700 transition-colors"
                              title={`เอกสารไม่ถูกต้อง: ${c.documentErrorReason || 'คลิกเพื่อตรวจสอบเอกสาร'}`}
                            >
                              <FileWarning className="w-4 h-4 text-rose-500 animate-bounce" />
                            </button>
                          )}
                        </div>
                      </td>

                      {/* สถานะคิวงาน (soft-colored pill tags) */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {renderStatusPill(c.status)}
                      </td>

                      {/* Action Icons (3 rounded action buttons matching screenshot: Purple History, Blue Eye, Orange Pencil) */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-1.5">
                          
                          {/* 1. History / Audit Log (Purple icon) */}
                          <button
                            type="button"
                            onClick={() => onOpenAuditLog(c)}
                            title="ดูประวัติการดำเนินงาน (History / Audit Trail)"
                            className="w-7 h-7 rounded-full flex items-center justify-center text-purple-600 hover:bg-purple-100/70 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>

                          {/* 2. View Details (Blue eye icon) */}
                          <button
                            type="button"
                            onClick={() => onSelectCase(c)}
                            title="ดูรายละเอียดใบคำขอและเอกสารแนบ"
                            className="w-7 h-7 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-100/70 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* 3. Edit / Inspection View (Pencil icon) */}
                          <button
                            type="button"
                            onClick={() => onOpenEditStatus(c)}
                            title={c.customerChangeRequest?.hasRequest 
                              ? `เปิดหน้ารายละเอียดการตรวจสอบ (มีแจ้งขอแก้ไขจาก${c.customerChangeRequest.source})` 
                              : "เปิดหน้ารายละเอียดการตรวจสอบ (Inspection Detail View)"}
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer relative ${
                              c.customerChangeRequest?.hasRequest
                                ? 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                                : 'text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <Pencil className="w-4 h-4" />
                            {c.customerChangeRequest?.hasRequest && (
                              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-slate-600 rounded-full"></span>
                            )}
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>

          </table>
        </div>

        {/* 4. Pagination Footer (matching exact screenshot layout: หน้า 1 ▾, ข้อมูลต่อหน้า 10 ▾, 1 - 10 จาก 125, < >) */}
        <div className="px-5 py-3.5 border-t border-slate-200 bg-white flex flex-wrap items-center justify-end gap-5 text-xs text-slate-700">
          
          {/* หน้า 1 ▾ */}
          <div className="flex items-center space-x-1">
            <span>หน้า</span>
            <div className="relative inline-block">
              <select
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                className="bg-transparent font-medium text-slate-800 pr-4 pl-1 py-0.5 appearance-none focus:outline-none cursor-pointer"
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <option key={pg} value={pg}>{pg}</option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-500 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* ข้อมูลต่อหน้า 10 ▾ */}
          <div className="flex items-center space-x-1">
            <span>ข้อมูลต่อหน้า</span>
            <div className="relative inline-block">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-transparent font-medium text-slate-800 pr-4 pl-1 py-0.5 appearance-none focus:outline-none cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-500 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 1 - 10 จาก 125 */}
          <div className="text-slate-700 font-medium">
            {totalItems === 0 ? '0 จาก 0' : `${startIndex + 1} - ${endIndex} จาก ${totalItems}`}
          </div>

          {/* Navigation Arrows < > */}
          <div className="flex items-center space-x-1 text-slate-400">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
