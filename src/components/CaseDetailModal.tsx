import React, { useState } from 'react';
import { UnderwritingCase, QueueStatus, AuditLog } from '../types';
import { 
  X, 
  Shield, 
  User, 
  CreditCard, 
  UserCheck, 
  FileCheck, 
  History, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Send, 
  Calendar, 
  Phone, 
  MapPin, 
  HeartPulse,
  Activity,
  Award,
  FileWarning,
  AlertCircle,
  Pencil
} from 'lucide-react';
import { QUEUE_STATUSES } from '../data/mockData';
import { CustomerChangeRequestAlertBox } from './CustomerChangeRequestAlertBox';

interface CaseDetailModalProps {
  caseItem: UnderwritingCase | null;
  initialTab?: 'info' | 'medical' | 'documents' | 'history';
  onClose: () => void;
  onUpdateStatus: (caseId: string, newStatus: QueueStatus, note?: string) => void;
  onAddNote: (caseId: string, note: string) => void;
  onInspectCase?: (caseItem: UnderwritingCase) => void;
}

export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({
  caseItem,
  initialTab = 'info',
  onClose,
  onUpdateStatus,
  onAddNote,
  onInspectCase,
}) => {
  if (!caseItem) return null;

  const [activeTab, setActiveTab] = useState<'info' | 'medical' | 'documents' | 'history'>(initialTab);
  const [selectedStatus, setSelectedStatus] = useState<QueueStatus>(caseItem.status);
  const [underwriterNote, setUnderwriterNote] = useState('');
  const [decisionCondition, setDecisionCondition] = useState<'normal' | 'loading' | 'exclusion' | 'req_doc' | 'decline'>('normal');

  React.useEffect(() => {
    if (caseItem) {
      setSelectedStatus(caseItem.status);
      setActiveTab(initialTab);
    }
  }, [caseItem, initialTab]);

  const handleSaveDecision = (e: React.FormEvent) => {
    e.preventDefault();
    const finalNote = underwriterNote.trim() 
      ? `[การพิจารณา] ${underwriterNote.trim()}`
      : `ปรับสถานะเป็น ${selectedStatus}`;

    onUpdateStatus(caseItem.id, selectedStatus, finalNote);
    onClose();
  };

  const handleQuickAddNote = () => {
    if (!underwriterNote.trim()) return;
    onAddNote(caseItem.id, underwriterNote.trim());
    setUnderwriterNote('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-start justify-between bg-slate-50">
          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                {caseItem.refNo}
              </span>
              <span className="text-slate-300">|</span>
              <span className="font-mono text-xs text-slate-600">
                กรมธรรม์: <strong>{caseItem.policyNo}</strong>
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-xs font-semibold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                {caseItem.insuranceType}
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
              <span>{caseItem.insuredName}</span>
              {caseItem.isUrgent && (
                <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                  ด่วนพิเศษ (Urgent)
                </span>
              )}
            </h3>
            
            <p className="text-xs text-slate-500 mt-0.5">
              ยื่นคำขอเมื่อ: {caseItem.submittedDate} · ครบกำหนด SLA: <strong className="text-slate-800">{caseItem.dueDate}</strong>
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {onInspectCase && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onInspectCase(caseItem);
                }}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-[#0072b2] hover:bg-sky-100 border border-sky-200 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                title="เปิดหน้ารายละเอียดการตรวจสอบตามแบบฟอร์ม"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>เปิดหน้าจอตรวจสอบ</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Special Inspection / Document Error Callout Alert Banner */}
        {(caseItem.hasDocumentError || caseItem.requiresSpecialInspection || caseItem.status === 'เอกสารไม่ถูกต้อง' || caseItem.status === 'ตรวจสอบพิเศษ') && (
          <div className="bg-rose-50 border-b border-rose-200 px-6 py-3 flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-rose-100 text-rose-700 shrink-0 mt-0.5">
              <FileWarning className="w-5 h-5" />
            </div>
            <div className="text-xs flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-rose-900 text-sm">
                  ⚠️ คิวงานนี้ต้องได้รับการตรวจสอบพิเศษ (กรณีมีเอกสารผิด)
                </span>
                {caseItem.specialInspectionType && (
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-200/80 text-rose-800 font-bold text-[11px] border border-rose-300">
                    {caseItem.specialInspectionType}
                  </span>
                )}
              </div>
              {caseItem.documentErrorReason ? (
                <p className="text-rose-800 mt-1 font-medium bg-white/70 p-2 rounded-md border border-rose-200 inline-block">
                  <strong>สาเหตุที่เอกสารไม่ถูกต้อง:</strong> {caseItem.documentErrorReason}
                </p>
              ) : (
                <p className="text-rose-700 mt-1">
                  กรุณาตรวจสอบเอกสารแนบในแท็บ "เอกสารประกอบ" เพื่อระบุจุดที่ต้องส่งแก้ไข
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('documents')}
              className="text-xs font-bold text-rose-900 bg-rose-200 hover:bg-rose-300 px-3 py-1.5 rounded-lg transition-colors shrink-0 cursor-pointer shadow-2xs"
            >
              ดูเอกสารที่ผิด
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-white overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-3 px-4 border-b-2 flex items-center space-x-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'info'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>ข้อมูลทั่วไป & การเงิน</span>
          </button>

          <button
            onClick={() => setActiveTab('medical')}
            className={`py-3 px-4 border-b-2 flex items-center space-x-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'medical'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            <span>ประวัติสุขภาพ & ความเสี่ยง</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`py-3 px-4 border-b-2 flex items-center space-x-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'documents'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>เอกสารประกอบ ({caseItem.documents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-4 border-b-2 flex items-center space-x-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'history'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>บันทึกการพิจารณา ({caseItem.history.length})</span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          
          {/* TAB 1: INFO & FINANCIALS */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              
              {/* Alert Box for Customer Change Request if present */}
              {caseItem.customerChangeRequest?.hasRequest && (
                <CustomerChangeRequestAlertBox
                  changeRequest={caseItem.customerChangeRequest}
                />
              )}

              {/* Financial Highlight Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    ทุนประกันภัย (Sum Assured)
                  </span>
                  <span className="text-xl font-bold text-slate-900 mt-1 block">
                    ฿{caseItem.sumAssured.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-400">วงเงินคุ้มครอง</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    เบี้ยประกันภัย (Premium)
                  </span>
                  <span className="text-xl font-bold text-blue-600 mt-1 block">
                    ฿{caseItem.premium.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-400">งวด: {caseItem.coverageTerm}</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    ระดับความเสี่ยง (Underwriting Risk)
                  </span>
                  <span className="text-base font-bold text-slate-800 mt-1 block">
                    {caseItem.riskLevel}
                  </span>
                  <span className="text-[11px] text-slate-400">ประเมินโดยระบบ</span>
                </div>
              </div>

              {/* Insured vs Payer vs Agent 3-Column Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. ผู้เอาประกันภัย */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs pb-2 border-b border-slate-100">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>ข้อมูลผู้เอาประกันภัย (Insured)</span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">ชื่อ-นามสกุล</span>
                      <span className="font-semibold text-slate-800">{caseItem.insuredName}</span>
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <span className="text-slate-400 block text-[10px]">เพศ / อายุ</span>
                        <span className="text-slate-700">{caseItem.insuredGender} / {caseItem.insuredAge} ปี</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">เลขบัตรประชาชน</span>
                        <span className="font-mono text-slate-700">{caseItem.insuredIdCard}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">อาชีพและตำแหน่ง</span>
                      <span className="text-slate-700">{caseItem.insuredOccupation}</span>
                    </div>
                  </div>
                </div>

                {/* 2. ผู้ชำระเบี้ยประกันภัย */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs pb-2 border-b border-slate-100">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>ข้อมูลผู้ชำระเบี้ย (Payer)</span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">ชื่อผู้ชำระเบี้ย</span>
                      <span className="font-semibold text-slate-800">{caseItem.payerName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">ความสัมพันธ์กับผู้เอาประกัน</span>
                      <span className="text-slate-700">{caseItem.payerRelation}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">งวดความคุ้มครอง</span>
                      <span className="text-slate-700">{caseItem.coverageTerm}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">สถานะการตัดชำระ</span>
                      <span className="text-emerald-700 font-medium">ชำระงวดแรกเรียบร้อย (First Premium Paid)</span>
                    </div>
                  </div>
                </div>

                {/* 3. ข้อมูลตัวแทนและหน่วยงาน */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs pb-2 border-b border-slate-100">
                    <UserCheck className="w-4 h-4 text-purple-600" />
                    <span>ข้อมูลตัวแทน (Agent)</span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">ชื่อตัวแทน</span>
                      <span className="font-semibold text-slate-800">{caseItem.agentName}</span>
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <span className="text-slate-400 block text-[10px]">รหัสตัวแทน</span>
                        <span className="font-mono text-slate-700">{caseItem.agentCode}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">เบอร์โทร</span>
                        <span className="text-slate-700">{caseItem.agentPhone}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">สังกัดสาขา/หน่วยงาน</span>
                      <span className="text-slate-700">{caseItem.agentBranch}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Remarks note */}
              {caseItem.remarks && (
                <div className="bg-amber-50/60 border border-amber-200 p-3.5 rounded-xl text-xs">
                  <span className="font-bold text-amber-900 block mb-1">หมายเหตุสำคัญจากตัวแทน / ระบบ:</span>
                  <p className="text-amber-800 leading-relaxed">{caseItem.remarks}</p>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: MEDICAL & RISK */}
          {activeTab === 'medical' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-xs mb-3 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-rose-500" />
                  ประวัติสุขภาพและภาวะร่างกาย
                </h4>
                {caseItem.healthConditions && caseItem.healthConditions.length > 0 ? (
                  <ul className="space-y-2">
                    {caseItem.healthConditions.map((cond, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></span>
                        <span>{cond}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500">ไม่มีประวัติโรคประจำตัวที่ต้องแจ้งตามเกณฑ์มาตรฐาน</p>
                )}
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <span className="font-bold text-slate-900 block">เกณฑ์การพิจารณารับประกัน (Underwriting Guidelines):</span>
                <p className="text-slate-600 leading-relaxed">
                  สำหรับประเภท <strong>{caseItem.insuranceType}</strong> วงเงินทุนประกัน ฿{caseItem.sumAssured.toLocaleString()} 
                  อยู่ในอำนาจการอนุมัติระดับ Senior Underwriter (Level 2-3) กรุณาตรวจสอบผลการตรวจสุขภาพ ย้อนหลัง 6 เดือน
                  และคำนึงถึงประวัติความเสี่ยงด้านอาชีพ {caseItem.insuredOccupation}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-3">
              {caseItem.hasDocumentError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">รายการเอกสารที่มีข้อผิดพลาด:</span>
                    <p className="mt-0.5 text-rose-700">{caseItem.documentErrorReason || 'พบข้อผิดพลาดในเอกสารแนบ ต้องให้ตัวแทนส่งเอกสารแก้ไขใหม่'}</p>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
                {caseItem.documents.map((doc, idx) => {
                  const isErrDoc = caseItem.hasDocumentError && (idx === 0 || doc.status === 'รอเพิ่มเติม' || doc.status === 'ไม่ผ่านเกณฑ์');
                  return (
                    <div 
                      key={doc.id} 
                      className={`p-3.5 flex items-center justify-between transition-colors ${
                        isErrDoc ? 'bg-rose-50/40 hover:bg-rose-50/70 border-l-4 border-l-rose-500' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px] ${
                          isErrDoc ? 'bg-rose-100 text-rose-700' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {doc.type}
                        </div>
                        <div>
                          <div className="font-semibold text-xs text-slate-800 flex items-center gap-1.5">
                            <span>{doc.name}</span>
                            {isErrDoc && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9.5px] font-bold bg-rose-100 text-rose-800 rounded border border-rose-200">
                                <FileWarning className="w-3 h-3 text-rose-600" />
                                มีข้อผิดพลาด
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400">อัปโหลดเมื่อ {doc.uploadDate}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                          isErrDoc
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : doc.status === 'ครบถ้วน'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {isErrDoc ? 'เอกสารไม่ถูกต้อง' : doc.status}
                        </span>
                        <button 
                          type="button"
                          onClick={() => alert(`เปิดดูไฟล์ตัวอย่าง: ${doc.name}\n${isErrDoc ? 'หมายเหตุ: ' + (caseItem.documentErrorReason || 'เอกสารไม่ถูกต้อง') : 'สถานะ: ปกติ'}`)}
                          className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                        >
                          ดูเอกสาร
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: AUDIT HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {caseItem.history.map((log) => (
                  <div key={log.id} className="relative group">
                    <span className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white"></span>
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-slate-800">
                          {log.actor} <span className="font-normal text-slate-400">({log.role})</span>
                        </span>
                        <span className="text-[11px] text-slate-400">{log.timestamp}</span>
                      </div>
                      <div className="text-xs font-medium text-blue-700 mb-1">{log.action}</div>
                      <p className="text-xs text-slate-600 leading-relaxed">{log.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer: Underwriting Decision & Quick Status Update */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-200">
          <form onSubmit={handleSaveDecision} className="space-y-3">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              
              {/* Left: Change status selector */}
              <div className="flex items-center space-x-2">
                <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
                  อัปเดตสถานะคิวงาน:
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as QueueStatus)}
                  className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {QUEUE_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Right: Quick Note input */}
              <div className="flex-1 flex items-center space-x-2">
                <input
                  type="text"
                  value={underwriterNote}
                  onChange={(e) => setUnderwriterNote(e.target.value)}
                  placeholder="ระบุข้อความ/บันทึกความเห็นของผู้พิจารณา..."
                  className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
              
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>บันทึกการพิจารณาและอัปเดตสถานะ</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};
