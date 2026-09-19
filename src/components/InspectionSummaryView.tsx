import React, { useState } from 'react';
import { UnderwritingCase, QueueStatus } from '../types';
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Send,
  User,
  Phone,
  Building2,
  FileText,
  Users,
  CreditCard,
  Banknote,
  HeartPulse,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
  BellRing,
  MessageSquare,
  Sparkles,
  Check,
  Clock,
  RotateCcw
} from 'lucide-react';

export interface CategoryInspectionResult {
  id: string;
  stepId: number;
  categoryName: string;
  icon: any;
  status: 'valid' | 'invalid';
  note: string;
  checkItems: string[];
}

interface InspectionSummaryViewProps {
  caseItem: UnderwritingCase;
  payerVerificationStatus: 'valid' | 'invalid';
  payerVerificationNote: string;
  onJumpToStep: (stepId: number) => void;
  onFinalizeCase: (
    updatedCase: UnderwritingCase,
    actionType: 'forward_agent' | 'approve' | 'hold',
    actionDetails: {
      status: QueueStatus;
      note: string;
      agentMessage?: string;
      notifyAgentApp?: boolean;
      notifyAgentSms?: boolean;
    }
  ) => void;
  onBackToInspection: () => void;
}

export const InspectionSummaryView: React.FC<InspectionSummaryViewProps> = ({
  caseItem,
  payerVerificationStatus,
  payerVerificationNote,
  onJumpToStep,
  onFinalizeCase,
  onBackToInspection,
}) => {
  // 5 Categories Inspection Results State
  const [categories, setCategories] = useState<CategoryInspectionResult[]>([
    {
      id: 'app_info',
      stepId: 1,
      categoryName: 'หมวดที่ 1: ข้อมูล Application',
      icon: FileText,
      status: 'valid',
      note: 'ข้อมูลใบสมัคร Application เลขที่ ' + (caseItem.applicationNo || 'PH691000001') + ' แผนประกัน 503-Gold ถูกต้องตรงตามระบบ',
      checkItems: [
        'เลขที่ Application ถูกต้องตรงกับฐานข้อมูล',
        'แผนประกันภัยและความคุ้มครองตรงตามแบบคำขอ',
        'วันที่เริ่มต้นคุ้มครองและงวดการชำระถูกต้อง',
      ],
    },
    {
      id: 'insured_info',
      stepId: 2,
      categoryName: 'หมวดที่ 2: ข้อมูลผู้เอาประกัน',
      icon: Users,
      status: 'valid',
      note: 'ชื่อ-นามสกุล ' + caseItem.insuredName + ' และเลขบัตร 13 หลัก ผ่านการตรวจสอบ OCR และยืนยันตัวตนเรียบร้อย',
      checkItems: [
        'ชื่อ-สกุล ตรงกับบัตรประจำตัวประชาชน',
        'เลขประจำตัวประชาชน 13 หลัก ผ่านเกณฑ์ DOPA',
        'ดัชนีมวลกาย (BMI) 22.0 อยู่ในเกณฑ์มาตรฐาน',
      ],
    },
    {
      id: 'payer_info',
      stepId: 3,
      categoryName: 'หมวดที่ 3: ข้อมูลผู้ชำระเบี้ย',
      icon: CreditCard,
      status: payerVerificationStatus,
      note: payerVerificationNote.trim()
        ? payerVerificationNote.trim()
        : payerVerificationStatus === 'invalid'
          ? 'พบข้อผิดพลาดในข้อมูลผู้ชำระเบี้ย / ขาดหนังสือยินยอมชำระแทน'
          : 'ข้อมูลผู้ชำระเบี้ยถูกต้อง ครบถ้วนตรงตามหลักเกณฑ์',
      checkItems: [
        'ชื่อ-สกุล และเลขประจำตัวประชาชนผู้ชำระเบี้ย',
        'ความสัมพันธ์ระหว่างผู้เอาประกันกับผู้ชำระเบี้ย',
        'หนังสือยินยอมการชำระเบี้ยแทน / ความยินยอมหักบัญชี',
      ],
    },
    {
      id: 'payment_info',
      stepId: 4,
      categoryName: 'หมวดที่ 4: ข้อมูลการชำระเบี้ย & สลิปโอนเงิน',
      icon: Banknote,
      status: 'valid',
      note: 'สลิปหลักฐานการโอนเงินชัดเจน ยอดชำระ ' + (caseItem.premium ? caseItem.premium.toLocaleString() : '675') + ' บาท ตรงตามงวด',
      checkItems: [
        'สลิปการโอนเงินภาพคมชัด ไม่ถูกดัดแปลง',
        'ยอดเงินชำระตรงกับเบี้ยประกันภัยในสัญญา',
        'วันที่ทำรายการและบัญชีปลายทางของบริษัทถูกต้อง',
      ],
    },
    {
      id: 'health_info',
      stepId: 5,
      categoryName: 'หมวดที่ 5: แถลงสุขภาพ',
      icon: HeartPulse,
      status: 'valid',
      note: 'ผู้เอาประกันแถลงสุขภาพปกติ ไม่มีประวัติโรคร้ายแรงหรือการผ่าตัดย้อนหลัง 5 ปี',
      checkItems: [
        'ตอบคำถามแถลงสุขภาพครบถ้วนทุกข้อ',
        'ไม่มีข้อยกเว้นพิเศษทางการแพทย์',
        'ผ่านเกณฑ์การพิจารณารับประกันขั้นต้น',
      ],
    },
  ]);

  // Routing Selection State: 'forward_agent' | 'internal'
  const [forwardingTarget, setForwardingTarget] = useState<'forward_agent' | 'internal'>('forward_agent');

  // Internal Action State (when forwardingTarget === 'internal'): 'approve' | 'hold'
  const [internalAction, setInternalAction] = useState<'approve' | 'hold'>('approve');

  // Message to Agent (when forwardingTarget === 'forward_agent')
  const [agentMessage, setAgentMessage] = useState<string>(() => {
    const errorCats = categories.filter(c => c.status === 'invalid');
    if (errorCats.length > 0) {
      return `เรียนตัวแทนเจ้าของงาน (${caseItem.agentName || 'ตัวแทน'}): ตรวจสอบพบข้อผิดพลาดใน ${errorCats.map(c => c.categoryName).join(', ')} รายละเอียด: ${errorCats.map(c => c.note).join(' | ')} กรุณาประสานงานลูกค้าเพื่อแก้ไขและแนบเอกสารเพิ่มเติม`;
    }
    return `เรียนตัวแทนเจ้าของงาน (${caseItem.agentName || 'ตัวแทน'}): กรุณาตรวจสอบเอกสารเพิ่มเติมตามบันทึกการพิจารณา`;
  });

  // Hold reason (when internalAction === 'hold')
  const [holdReason, setHoldReason] = useState<string>(
    'บันทึกเพื่อรอแก้ไขข้อมูลภายในหน่วยงานรับประกัน ยังไม่ส่งต่อตัวแทน'
  );

  // Agent notification options
  const [notifyApp, setNotifyApp] = useState<boolean>(true);
  const [notifySms, setNotifySms] = useState<boolean>(true);

  // Show confirmation / completion modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [pendingActionType, setPendingActionType] = useState<'forward_agent' | 'approve' | 'hold' | null>(null);

  // Derived metrics
  const errorCategories = categories.filter((c) => c.status === 'invalid');
  const validCategories = categories.filter((c) => c.status === 'valid');
  const hasErrors = errorCategories.length > 0;

  // Toggle category status
  const handleToggleCategoryStatus = (catId: string) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === catId) {
          const newStatus = cat.status === 'valid' ? 'invalid' : 'valid';
          const defaultNote =
            newStatus === 'invalid'
              ? `พบข้อผิดพลาดใน ${cat.categoryName} กรุณาตรวจสอบเอกสารใหม่`
              : `ข้อมูล ${cat.categoryName} ผ่านการตรวจสอบเรียบร้อยแล้ว`;
          return {
            ...cat,
            status: newStatus,
            note: cat.status === 'valid' ? defaultNote : cat.note,
          };
        }
        return cat;
      })
    );
  };

  // Update note for specific category
  const handleUpdateCategoryNote = (catId: string, newNote: string) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === catId ? { ...cat, note: newNote } : cat))
    );
  };

  // When clicking submit
  const handleOpenConfirm = (type: 'forward_agent' | 'approve' | 'hold') => {
    setPendingActionType(type);
    setIsConfirmModalOpen(true);
  };

  const handleExecuteFinalize = () => {
    if (!pendingActionType) return;

    let targetStatus: QueueStatus = 'ตรวจเอกสารผ่าน';
    let summaryNote = '';

    if (pendingActionType === 'forward_agent') {
      targetStatus = 'ส่งกลับแก้ไข (รอผู้แทนดำเนินการ)';
      summaryNote = `ส่งต่อคิวงานไปยัง UDW ผู้แทน (${caseItem.agentName || 'เจ้าของงาน'} รหัส ${caseItem.agentCode || 'AG-01'}): ${agentMessage}`;
    } else if (pendingActionType === 'approve') {
      targetStatus = 'ตรวจเอกสารผ่าน';
      summaryNote = 'ผู้ตรวจรับประกันอนุมัติเอกสารผ่านครบทุกหมวด ส่งต่อขั้นตอนการออกกรมธรรม์';
    } else if (pendingActionType === 'hold') {
      targetStatus = 'เอกสารไม่ถูกต้อง';
      summaryNote = `บันทึกเพื่อรอแก้ไข (ภายใน): ${holdReason}`;
    }

    const updated: UnderwritingCase = {
      ...caseItem,
      status: targetStatus,
      hasDocumentError: pendingActionType === 'hold' || (pendingActionType === 'forward_agent' && hasErrors),
      documentErrorReason: hasErrors ? errorCategories.map(e => `${e.categoryName}: ${e.note}`).join('; ') : undefined,
      history: [
        {
          id: `log-${Date.now()}`,
          timestamp: `2026-09-18 ${new Date().toLocaleTimeString('th-TH')}`,
          actor: 'สิรภพ ซื่อจริง (01604)',
          role: 'ผู้พิจารณารับประกัน',
          action:
            pendingActionType === 'forward_agent'
              ? `ส่งต่อ UDW ผู้แทน (${caseItem.agentName || 'เจ้าของงาน'})`
              : pendingActionType === 'approve'
                ? 'อนุมัติเอกสารผ่านทุกหมวด'
                : 'บันทึกเพื่อรอแก้ไข (ภายใน)',
          note: summaryNote,
        },
        ...caseItem.history,
      ],
    };

    setIsConfirmModalOpen(false);
    onFinalizeCase(updated, pendingActionType, {
      status: targetStatus,
      note: summaryNote,
      agentMessage: pendingActionType === 'forward_agent' ? agentMessage : undefined,
      notifyAgentApp: notifyApp,
      notifyAgentSms: notifySms,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. TOP BANNER / STATS OVERVIEW */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0072b2] flex items-center justify-center font-bold">
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                หน้าสรุปผลการตรวจสอบเอกสารทุกหมวด
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              ผลการตรวจรับประกัน Application เลขที่ <span className="font-semibold text-slate-700">{caseItem.applicationNo || 'PH691000001'}</span> | ผู้เอาประกัน: <span className="font-semibold text-slate-700">{caseItem.insuredName}</span>
            </p>
          </div>

          {/* Quick Back Button to Step by Step */}
          <button
            type="button"
            onClick={onBackToInspection}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer self-start md:self-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>กลับไปหน้าแบบฟอร์มตรวจสอบ</span>
          </button>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-5">
          
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-500 block">หมวดที่ตรวจสอบทั้งหมด</span>
              <span className="text-xl font-bold text-slate-800">{categories.length} หมวด</span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-emerald-50/70 rounded-xl p-3.5 border border-emerald-200/80 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-emerald-700 block">ผ่านการตรวจสอบ (ถูกต้อง)</span>
              <span className="text-xl font-bold text-emerald-800">{validCategories.length} หมวด</span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className={`rounded-xl p-3.5 border flex items-center justify-between transition-colors ${
            hasErrors 
              ? 'bg-rose-50/80 border-rose-300 text-rose-950' 
              : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            <div>
              <span className="text-xs font-medium block">
                {hasErrors ? 'ตรวจพบข้อผิดพลาด' : 'ไม่พบข้อผิดพลาด'}
              </span>
              <span className={`text-xl font-bold ${hasErrors ? 'text-rose-700' : 'text-slate-700'}`}>
                {errorCategories.length} หมวด
              </span>
            </div>
            <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${
              hasErrors 
                ? 'bg-rose-100 border-rose-300 text-rose-700' 
                : 'bg-white border-slate-200 text-slate-400'
            }`}>
              {hasErrors ? <XCircle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
          </div>

        </div>

        {/* Highlight Alert Banner */}
        <div className={`mt-4 p-3.5 rounded-xl border flex items-start space-x-3 text-xs leading-relaxed ${
          hasErrors
            ? 'bg-amber-50/80 border-amber-300 text-amber-900'
            : 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
        }`}>
          {hasErrors ? (
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          )}
          <div className="space-y-0.5">
            <span className="font-bold block">
              {hasErrors
                ? `แจ้งเตือน: พบข้อผิดพลาดใน ${errorCategories.length} หมวด (${errorCategories.map(c => c.categoryName).join(', ')})`
                : 'ผลการตรวจสอบสมบูรณ์: เอกสารและข้อมูลทุกหมวดผ่านเกณฑ์การรับประกัน'}
            </span>
            <p className="text-[11.5px] opacity-90">
              {hasErrors
                ? 'กรุณาตรวจสอบรายละเอียดข้อผิดพลาดในแต่ละหมวดด้านล่าง และเลือกว่าจะส่งต่อให้ UDW ผู้แทนที่เป็นเจ้าของงาน หรือดำเนินการตัดสินภายในระบบ'
                : 'สามารถส่งต่อให้ผู้แทนเพื่อทราบ หรือเลือก "ไม่ส่งต่อ" แล้วกดอนุมัติเอกสารผ่านได้ทันที'}
            </p>
          </div>
        </div>

      </div>

      {/* 2. SECTION: รายละเอียดผลการตรวจสอบแต่ละหมวด (5 หมวด) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              รายละเอียดผลการตรวจสอบแยกตามหมวด (5 หมวด)
            </h3>
            <p className="text-xs text-slate-500">
              แสดงสถานะการตรวจ ข้อผิดพลาด และรายละเอียดในแต่ละหมวด สามารถคลิกเปลี่ยนสถานะหรือกดเข้าไปดูแต่ละหน้าได้
            </p>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            คลิกที่ปุ่มสลับสถานะเพื่อปรับแก้ผลตรวจ
          </span>
        </div>

        {/* Category Cards List */}
        <div className="space-y-3.5 pt-1">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            const isErr = cat.status === 'invalid';

            return (
              <div
                key={cat.id}
                className={`rounded-xl border p-4 transition-all ${
                  isErr
                    ? 'bg-rose-50/40 border-rose-300 ring-1 ring-rose-200'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                  
                  {/* Left: Icon, Category Name, and Sub-checkpoints */}
                  <div className="flex items-start space-x-3.5 flex-1">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isErr ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-[#0072b2]'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-slate-900">
                          {cat.categoryName}
                        </span>

                        {/* Status Badge */}
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          isErr
                            ? 'bg-rose-100/90 text-rose-800 border-rose-300'
                            : 'bg-emerald-100/80 text-emerald-800 border-emerald-300'
                        }`}>
                          {isErr ? (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              <span>พบข้อผิดพลาด / ข้อมูลไม่ถูกต้อง</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>ข้อมูลถูกต้อง / ผ่านเกณฑ์</span>
                            </>
                          )}
                        </span>
                      </div>

                      {/* Check items tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {cat.checkItems.map((ci, cIdx) => (
                          <span
                            key={cIdx}
                            className="text-[10.5px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/80"
                          >
                            ✓ {ci}
                          </span>
                        ))}
                      </div>

                      {/* Note / Error Detail Input */}
                      <div className="pt-1">
                        <label className="text-[11px] font-bold text-slate-700 block mb-1 flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-[#0072b2]" />
                          <span>รายละเอียดผลการตรวจสอบ / ข้อผิดพลาดที่ต้องระบุ:</span>
                        </label>
                        <input
                          type="text"
                          value={cat.note}
                          onChange={(e) => handleUpdateCategoryNote(cat.id, e.target.value)}
                          placeholder="ระบุรายละเอียดผลการตรวจของหมวดนี้..."
                          className={`w-full text-xs px-3 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-[#0072b2] ${
                            isErr
                              ? 'border-rose-300 bg-white text-rose-900 font-medium'
                              : 'border-slate-300 bg-white text-slate-800'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Actions: Quick Toggle & Go to Step Button */}
                  <div className="flex items-center space-x-2 shrink-0 self-end md:self-center pt-2 md:pt-0">
                    {/* Toggle Status Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleCategoryStatus(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center space-x-1.5 ${
                        isErr
                          ? 'bg-white border-rose-300 text-rose-700 hover:bg-rose-50'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                      title="กดเพื่อสลับสถานะ ถูกต้อง / ไม่ถูกต้อง"
                    >
                      <RotateCcw className="w-3 h-3 text-slate-400" />
                      <span>สลับเป็น: {isErr ? 'ถูกต้อง' : 'ไม่ถูกต้อง'}</span>
                    </button>

                    {/* View Details / Jump Button */}
                    <button
                      type="button"
                      onClick={() => onJumpToStep(cat.stepId)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-[#0072b2] hover:bg-blue-100 transition-colors cursor-pointer flex items-center space-x-1"
                    >
                      <span>ดูหมวดนี้</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* 3. SECTION: ตัวเลือกการส่งคิวงานต่อ (ตามที่ผู้ใช้ระบุ) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-6">
        
        {/* Header Question */}
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2">
            <Send className="w-5 h-5 text-[#0072b2]" />
            <h3 className="text-base font-bold text-slate-900">
              ตัวเลือกการส่งคิวงานต่อ (Queue Routing & Forwarding)
            </h3>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            ระบุความต้องการในการส่งต่อคิวงานหลังจากตรวจครบทุกหมวดเรียบร้อยแล้ว
          </p>
        </div>

        {/* Question: ส่งต่อ UDW ผู้แทน หรือไม่ */}
        <div className="space-y-3">
          <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center space-x-2">
            <span>ต้องการส่งต่อ UDW ผู้แทน (เจ้าของงาน) หรือไม่?</span>
            <span className="text-rose-500">*</span>
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* OPTION 1: ส่งต่อ UDW ผู้แทน */}
            <div
              onClick={() => setForwardingTarget('forward_agent')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                forwardingTarget === 'forward_agent'
                  ? 'border-[#0072b2] bg-sky-50/70 shadow-xs ring-2 ring-[#0072b2]/20'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full border border-blue-600 bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                      {forwardingTarget === 'forward_agent' && '✓'}
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      ส่งต่อ UDW ผู้แทน (เจ้าของงาน)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 pl-7 leading-relaxed">
                    ส่งคิวงานกลับไปยังผู้แทนที่เป็นเจ้าของงาน เพื่อให้ผู้แทนติดต่อลูกค้าและแก้ไขข้อผิดพลาดในหมวดที่ไม่ถูกต้อง
                  </p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-[#0072b2] font-semibold border border-blue-200 shrink-0">
                  ส่งแก้ไขภายนอก
                </span>
              </div>
            </div>

            {/* OPTION 2: ไม่ส่งต่อ UDW ผู้แทน (ดำเนินการภายใน) */}
            <div
              onClick={() => setForwardingTarget('internal')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                forwardingTarget === 'internal'
                  ? 'border-[#0072b2] bg-sky-50/70 shadow-xs ring-2 ring-[#0072b2]/20'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full border border-blue-600 bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                      {forwardingTarget === 'internal' && '✓'}
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      ไม่ส่งต่อ UDW ผู้แทน (ดำเนินการภายใน)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 pl-7 leading-relaxed">
                    ไม่ส่งคิวงานกลับไปยังผู้แทน โดยผู้ตรวจจะตัดสินใจภายในระบบว่า <strong>อนุมัติเอกสารผ่าน</strong> หรือ <strong>บันทึกเพื่อรอแก้ไข</strong>
                  </p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200 shrink-0">
                  ตัดสินผลภายใน
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* ---------------- SUB-VIEW A: เมื่อเลือก "ส่งต่อ UDW ผู้แทน" ---------------- */}
        {forwardingTarget === 'forward_agent' && (
          <div className="p-4 sm:p-5 rounded-xl bg-blue-50/50 border border-blue-200 space-y-4 animate-in fade-in duration-200">
            
            <div className="flex items-center justify-between border-b border-blue-100 pb-3">
              <span className="text-xs font-bold text-[#0072b2] uppercase tracking-wide flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span>ข้อมูลผู้แทนที่เป็นเจ้าของงาน (Assigned Agent Profile)</span>
              </span>
              <span className="text-[11px] text-blue-700 font-semibold">
                สถานะที่จะได้รับ: ส่งกลับแก้ไข (รอผู้แทนดำเนินการ)
              </span>
            </div>

            {/* Agent Info Card */}
            <div className="bg-white rounded-xl p-4 border border-blue-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0072b2] to-blue-700 text-white font-bold text-base flex items-center justify-center shadow-xs">
                  {caseItem.agentName ? caseItem.agentName.charAt(0) : 'ต'}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-bold text-slate-900">
                      {caseItem.agentName || 'กนกพร พิทักษ์ธรรม'}
                    </h4>
                    <span className="text-[11px] px-2 py-0.2 rounded-full bg-blue-50 text-[#0072b2] font-semibold border border-blue-200">
                      รหัส {caseItem.agentCode || 'AG-90442'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {caseItem.agentBranch || 'สาขาสะพานใหม่ (กรุงเทพฯ)'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {caseItem.agentPhone || '082-991-8823'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right sm:border-l sm:border-slate-100 sm:pl-4">
                <span className="text-[11px] text-slate-500 block">ช่องทางการส่งต่อ</span>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Smile Agent App & UDW Portal
                </span>
              </div>
            </div>

            {/* List of Error Categories to send */}
            {hasErrors && (
              <div className="bg-rose-50/80 rounded-xl p-3 border border-rose-200 text-xs text-rose-950 space-y-1">
                <span className="font-bold flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  หมวดที่ส่งให้ตัวแทนแก้ไข ({errorCategories.length} หมวด):
                </span>
                <ul className="list-disc pl-5 space-y-0.5 text-[11.5px] text-rose-800">
                  {errorCategories.map((ec) => (
                    <li key={ec.id}>
                      <strong>{ec.categoryName}:</strong> {ec.note}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Note to Agent */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>ข้อความกำกับถึงผู้แทน (Instructions for Agent)</span>
                <span className="text-[10px] text-slate-400">ตัวแทนจะเห็นข้อความนี้ในแอปพลิเคชัน</span>
              </label>
              <textarea
                value={agentMessage}
                onChange={(e) => setAgentMessage(e.target.value)}
                rows={3}
                placeholder="ระบุรายละเอียดและคำแนะนำให้ตัวแทนแก้ไขเอกสาร..."
                className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-[#0072b2] focus:outline-none"
              />
            </div>

            {/* Notification Checkboxes */}
            <div className="flex flex-wrap gap-4 text-xs text-slate-700 pt-1">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={notifyApp}
                  onChange={(e) => setNotifyApp(e.target.checked)}
                  className="rounded text-[#0072b2] focus:ring-[#0072b2]"
                />
                <span>ส่ง Push Notification แจ้งเตือนเข้า Smile Agent App</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={notifySms}
                  onChange={(e) => setNotifySms(e.target.checked)}
                  className="rounded text-[#0072b2] focus:ring-[#0072b2]"
                />
                <span>ส่ง SMS แจ้งเตือนไปยังเบอร์มือถือตัวแทน ({caseItem.agentPhone || '082-991-8823'})</span>
              </label>
            </div>

            {/* Action Button: ส่งต่อคิวงานไปยังผู้แทน */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => handleOpenConfirm('forward_agent')}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#0072b2] hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>ยืนยันส่งต่อคิวงานไปยังผู้แทน ({caseItem.agentName || 'เจ้าของงาน'})</span>
              </button>
            </div>

          </div>
        )}

        {/* ---------------- SUB-VIEW B: เมื่อเลือก "ไม่ส่งต่อ UDW ผู้แทน" ---------------- */}
        {forwardingTarget === 'internal' && (
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in duration-200">
            
            <div className="border-b border-slate-200 pb-2.5">
              <span className="text-xs font-bold text-slate-700">
                เลือกการตัดสินผลเอกสารภายในระบบ (Internal Decision)
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                โปรดเลือกตัวเลือกว่าต้องการ <strong>อนุมัติเอกสารผ่าน</strong> หรือ <strong>บันทึกเพื่อรอแก้ไข</strong>
              </p>
            </div>

            {/* 2 Internal Choices: Approve vs Hold */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              
              {/* Choice B1: อนุมัติเอกสารผ่าน */}
              <div
                onClick={() => setInternalAction('approve')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  internalAction === 'approve'
                    ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-2.5 mb-1.5">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold ${
                    internalAction === 'approve'
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-slate-300 bg-white text-transparent'
                  }`}>
                    ✓
                  </div>
                  <span className="text-sm font-bold text-emerald-900 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    อนุมัติเอกสารผ่าน
                  </span>
                </div>
                <p className="text-xs text-slate-600 pl-7 leading-relaxed">
                  เอกสารและข้อมูลทุกหมวดถูกต้อง หรือได้รับการแก้ไขยืนยันเรียบร้อยแล้ว ส่งต่อไปยังขั้นตอนการพิจารณารับประกันและออกกรมธรรม์
                </p>
                <div className="mt-3 pl-7">
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-200">
                    สถานะใหม่: ตรวจเอกสารผ่าน
                  </span>
                </div>
              </div>

              {/* Choice B2: บันทึกเพื่อรอแก้ไข */}
              <div
                onClick={() => setInternalAction('hold')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  internalAction === 'hold'
                    ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-500/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-2.5 mb-1.5">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold ${
                    internalAction === 'hold'
                      ? 'border-amber-600 bg-amber-600 text-white'
                      : 'border-slate-300 bg-white text-transparent'
                  }`}>
                    ✓
                  </div>
                  <span className="text-sm font-bold text-amber-950 flex items-center gap-1">
                    <Clock className="w-4 h-4 text-amber-600" />
                    บันทึกเพื่อรอแก้ไข
                  </span>
                </div>
                <p className="text-xs text-slate-600 pl-7 leading-relaxed">
                  พบข้อผิดพลาดหรือเอกสารยังไม่สมบูรณ์ แต่ต้องการพักคิวงานไว้ภายใน เพื่อรอสอบถามเพิ่มเติม ประสานงานภายใน หรือรอข้อมูลประกอบ
                </p>
                <div className="mt-3 pl-7">
                  <span className="text-[11px] font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-200">
                    สถานะใหม่: เอกสารไม่ถูกต้อง (รอแก้ไขภายใน)
                  </span>
                </div>
              </div>

            </div>

            {/* Note input for Hold or Approve */}
            {internalAction === 'hold' ? (
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>ระบุเหตุผลการพักคิวงานเพื่อรอแก้ไข (Hold Reason) <span className="text-rose-500">*</span></span>
                </label>
                <textarea
                  value={holdReason}
                  onChange={(e) => setHoldReason(e.target.value)}
                  rows={2}
                  placeholder="ระบุข้อผิดพลาดหรือเหตุผลที่ต้องรอแก้ไขภายใน..."
                  className="w-full text-xs p-3 rounded-xl border border-amber-300 bg-white text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-800">
                <span>✓ พร้อมอนุมัติเอกสารผ่าน สามารถกดปุ่มยืนยันเพื่อส่งเคสไปยังกระบวนการถัดไปได้ทันที</span>
              </div>
            )}

            {/* Action Buttons for Internal Decision */}
            <div className="pt-2 flex justify-end">
              {internalAction === 'approve' ? (
                <button
                  type="button"
                  onClick={() => handleOpenConfirm('approve')}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ยืนยัน: อนุมัติเอกสารผ่าน</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleOpenConfirm('hold')}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Clock className="w-4 h-4" />
                  <span>ยืนยัน: บันทึกเพื่อรอแก้ไข</span>
                </button>
              )}
            </div>

          </div>
        )}

      </div>

      {/* CONFIRMATION MODAL POPUP */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 relative">
            
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                pendingActionType === 'forward_agent'
                  ? 'bg-blue-100 text-[#0072b2]'
                  : pendingActionType === 'approve'
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'bg-amber-100 text-amber-600'
              }`}>
                {pendingActionType === 'forward_agent' ? (
                  <Send className="w-5 h-5" />
                ) : pendingActionType === 'approve' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Clock className="w-5 h-5" />
                )}
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  {pendingActionType === 'forward_agent'
                    ? 'ยืนยันส่งต่อคิวงานไปยังผู้แทน'
                    : pendingActionType === 'approve'
                      ? 'ยืนยันอนุมัติเอกสารผ่าน'
                      : 'ยืนยันบันทึกเพื่อรอแก้ไข'}
                </h4>
                <p className="text-xs text-slate-500">
                  Application: {caseItem.applicationNo || 'PH691000001'}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs text-slate-700 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">ผู้เอาประกัน:</span>
                <span className="font-semibold text-slate-900">{caseItem.insuredName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ตัวแทนผู้ดูแล:</span>
                <span className="font-semibold text-slate-900">{caseItem.agentName || 'กนกพร พิทักษ์ธรรม'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">การดำเนินการ:</span>
                <span className={`font-bold ${
                  pendingActionType === 'forward_agent'
                    ? 'text-blue-700'
                    : pendingActionType === 'approve'
                      ? 'text-emerald-700'
                      : 'text-amber-700'
                }`}>
                  {pendingActionType === 'forward_agent'
                    ? 'ส่งต่อ UDW ผู้แทน (เจ้าของงาน)'
                    : pendingActionType === 'approve'
                      ? 'อนุมัติเอกสารผ่าน'
                      : 'บันทึกเพื่อรอแก้ไข (ภายใน)'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              {pendingActionType === 'forward_agent'
                ? 'ระบบจะส่งคิวงานนี้กลับไปยังกระเป๋างานของตัวแทน พร้อมทั้งแจ้งเตือนไปยังแอปพลิเคชัน Smile Agent ทันที'
                : pendingActionType === 'approve'
                  ? 'เอกสารจะได้รับการอนุมัติ และส่งต่อไปยังขั้นตอนการออกกรมธรรม์โดยอัตโนมัติ'
                  : 'ระบบจะบันทึกสถานะเป็น "เอกสารไม่ถูกต้อง" และเก็บคิวงานไว้เพื่อรอการแก้ไขต่อไป'}
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleExecuteFinalize}
                className={`px-5 py-2 rounded-xl text-xs font-bold text-white cursor-pointer shadow-xs transition-colors ${
                  pendingActionType === 'forward_agent'
                    ? 'bg-[#0072b2] hover:bg-blue-700'
                    : pendingActionType === 'approve'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                ยืนยันการทำรายการ
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
