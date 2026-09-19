import React, { useState } from 'react';
import { 
  FileText, 
  Users, 
  CreditCard, 
  Banknote, 
  HeartPulse, 
  ClipboardCheck, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  CheckCircle2, 
  Scan, 
  Plus, 
  ChevronLeft, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCw, 
  Menu, 
  Grid, 
  Bell, 
  Briefcase, 
  User, 
  Save, 
  ArrowLeft, 
  ArrowRight,
  ShieldAlert,
  FileCheck,
  Check,
  Building2,
  ExternalLink,
  Sparkles,
  Info,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  UserCheck,
  MessageSquare
} from 'lucide-react';
import { UnderwritingCase } from '../types';
import { ThaiIdCardGraphic } from './ThaiIdCardGraphic';
import { InspectionSummaryView } from './InspectionSummaryView';

interface UnderwritingInspectionDetailViewProps {
  caseItem: UnderwritingCase;
  onBack: () => void;
  onSaveCase?: (updatedCase: UnderwritingCase) => void;
}

export const UnderwritingInspectionDetailView: React.FC<UnderwritingInspectionDetailViewProps> = ({
  caseItem,
  onBack,
  onSaveCase,
}) => {
  // Stepper state (1 to 6, default 2: ข้อมูลผู้เอาประกัน as shown in screenshot)
  const [activeStep, setActiveStep] = useState<number>(2);

  // Collapsible section states
  const [isInsuredInfoOpen, setIsInsuredInfoOpen] = useState<boolean>(true);
  const [isPayerCheckOpen, setIsPayerCheckOpen] = useState<boolean>(true);

  // OCR state
  const [isOcrEnabled, setIsOcrEnabled] = useState<boolean>(false);
  const [isOcrScanning, setIsOcrScanning] = useState<boolean>(false);
  const [ocrSuccess, setOcrSuccess] = useState<boolean>(false);

  // ID type tab: 'id_card' | 'passport'
  const [idTypeTab, setIdTypeTab] = useState<'id_card' | 'passport'>('id_card');

  // Form Fields State (initialized with exact screenshot data or fallback to caseItem)
  const [idNumber, setIdNumber] = useState<string>(
    caseItem.insuredIdCard || '1-234-56789-00-1'
  );
  const [prefix, setPrefix] = useState<string>('นางสาว');
  const [firstName, setFirstName] = useState<string>(
    caseItem.insuredName.split(' ')[0] || 'ทานตะวัน'
  );
  const [lastName, setLastName] = useState<string>(
    caseItem.insuredName.split(' ')[1] || 'รุ่งรัศมีทรัพย์สิน'
  );
  const [birthDate, setBirthDate] = useState<string>('24/03/2508');
  const [occupationGroup, setOccupationGroup] = useState<string>('พนักงานบริษัท');
  const [occupation, setOccupation] = useState<string>('พนักงานทั่วไป');
  const [gender, setGender] = useState<string>('หญิง');
  const [height, setHeight] = useState<string>('165');
  const [weight, setWeight] = useState<string>('60');
  const [mobilePhone, setMobilePhone] = useState<string>('081-234-5678');
  const [email, setEmail] = useState<string>('Siamsmile123@gmail.com');

  // Address: ID Card
  const [idAddress, setIdAddress] = useState<string>('236/1 ซ. ลานดอกไม้');
  const [idProvince, setIdProvince] = useState<string>('กรุงเทพมหานคร');
  const [idDistrict, setIdDistrict] = useState<string>('สายไหม');
  const [idSubDistrict, setIdSubDistrict] = useState<string>('สายไหม');
  const [idPostalCode] = useState<string>('10220');

  // Contact Address Toggle
  const [hasContactAddress, setHasContactAddress] = useState<boolean>(false);

  // Workplace Section Toggles & Fields
  const [hasWorkplace, setHasWorkplace] = useState<boolean>(true);
  const [workProvince, setWorkProvince] = useState<string>('กรุงเทพมหานคร');
  const [workDistrict, setWorkDistrict] = useState<string>('สายไหม');
  const [workSubDistrict, setWorkSubDistrict] = useState<string>('สายไหม');
  const [hasOrganization, setHasOrganization] = useState<boolean>(true);
  const [organizationName, setOrganizationName] = useState<string>(
    'บริษัท สยามสไมล์โบรกเกอร์ ประเทศไทย จำกัด(สำนักงานใหญ่)'
  );
  const [workAddress, setWorkAddress] = useState<string>('236/1 ซ. ลานดอกไม้');

  // Is Insured same as Payer?
  const [isSamePayer, setIsSamePayer] = useState<'yes' | 'no'>('yes');
  const [payerName, setPayerName] = useState<string>('นายสมชาย รุ่งรัศมีทรัพย์สิน');
  const [payerRelation, setPayerRelation] = useState<string>('บิดา');
  const [payerIdNumber, setPayerIdNumber] = useState<string>('3-1005-00123-45-6');
  const [payerPhone, setPayerPhone] = useState<string>('089-765-4321');

  // Payer Category Verification State (กล่องผลการตรวจสอบ หมวดผู้ชำระเบี้ย)
  const [payerVerificationStatus, setPayerVerificationStatus] = useState<'valid' | 'invalid'>(
    caseItem.status === 'เอกสารไม่ถูกต้อง' || caseItem.hasDocumentError ? 'invalid' : 'valid'
  );
  const [payerVerificationNote, setPayerVerificationNote] = useState<string>(
    caseItem.documentErrorReason || ''
  );
  const [payerCheckpoints, setPayerCheckpoints] = useState({
    identityVerified: true,
    relationshipValid: true,
    paymentProofMatched: true,
  });
  const [isPayerInspectionSaved, setIsPayerInspectionSaved] = useState<boolean>(false);

  // Document Viewer states
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [currentDocIndex, setCurrentDocIndex] = useState<number>(0);
  const [isDocModalOpen, setIsDocModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Attached documents list
  const attachedDocs = [
    {
      code: 'PHDOC67090000712',
      title: 'สำเนาบัตรประชาชนผู้เอาประกัน',
      date: '16-07-2569 15:56:31',
      type: 'id_card',
    },
    {
      code: 'PHDOC67090000713',
      title: 'สำเนาทะเบียนบ้าน',
      date: '16-07-2569 15:58:10',
      type: 'house_reg',
    },
    {
      code: 'PHDOC67090000714',
      title: 'สำเนาสลิปโอนเงิน / หลักฐานชำระเบี้ย',
      date: '16-07-2569 16:02:45',
      type: 'slip',
    },
    {
      code: 'PHDOC67090000715',
      title: 'ใบแถลงสุขภาพและผลตรวจคัดกรอง',
      date: '16-07-2569 16:05:20',
      type: 'health',
    },
  ];

  // Helper toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // OCR Scan Simulation
  const handleTriggerOcr = () => {
    setIsOcrScanning(true);
    triggerToast('กำลังเชื่อมต่อระบบ AI OCR และวิเคราะห์เอกสารบัตรประชาชน...');
    setTimeout(() => {
      setIsOcrScanning(false);
      setOcrSuccess(true);
      setIsOcrEnabled(true);
      setIdNumber('1-234-56789-00-1');
      setPrefix('นางสาว');
      setFirstName('ทานตะวัน');
      setLastName('รุ่งรัศมีทรัพย์สิน');
      setBirthDate('24/03/2508');
      triggerToast('AI OCR สแกนสำเร็จ: ดึงข้อมูลและตรวจสอบความถูกต้องเรียบร้อยแล้ว (100% Match)');
    }, 1200);
  };

  // Save changes
  const handleSave = () => {
    let finalStatus = caseItem.status;
    if (payerVerificationStatus === 'invalid') {
      finalStatus = 'เอกสารไม่ถูกต้อง';
    } else if (caseItem.status === 'เข้ามาใหม่') {
      finalStatus = 'รอดำเนินการ';
    }

    const updated: UnderwritingCase = {
      ...caseItem,
      insuredName: `${firstName} ${lastName}`,
      insuredIdCard: idNumber,
      insuredGender: gender as 'ชาย' | 'หญิง',
      status: finalStatus,
      hasDocumentError: payerVerificationStatus === 'invalid',
      documentErrorReason: payerVerificationStatus === 'invalid'
        ? (payerVerificationNote.trim() || 'ข้อมูลหมวดผู้ชำระเบี้ยไม่ถูกต้อง')
        : undefined,
      history: [
        {
          id: `log-${Date.now()}`,
          timestamp: `2026-09-18 ${new Date().toLocaleTimeString('th-TH')}`,
          actor: 'สิรภพ ซื่อจริง (01604)',
          role: 'ผู้พิจารณารับประกัน',
          action: `ผลตรวจสอบหมวดผู้ชำระเบี้ย: ${payerVerificationStatus === 'valid' ? 'ข้อมูลถูกต้อง' : 'ข้อมูลไม่ถูกต้อง'}`,
          note: payerVerificationNote.trim() 
            ? payerVerificationNote.trim() 
            : (payerVerificationStatus === 'valid' ? 'ข้อมูลผู้ชำระเบี้ยถูกต้องตรงตามเอกสาร' : 'พบข้อผิดพลาดในข้อมูลผู้ชำระเบี้ย'),
        },
        ...caseItem.history,
      ]
    };
    if (onSaveCase) onSaveCase(updated);
    setIsPayerInspectionSaved(true);
    triggerToast('บันทึกผลการตรวจสอบหมวดผู้ชำระเบี้ยและคิวงานเรียบร้อย');
  };

  // BMI Calculation
  const hM = Number(height) / 100;
  const wKg = Number(weight);
  const bmiVal = (hM > 0 && wKg > 0) ? (wKg / (hM * hM)).toFixed(1) : '22.0';

  // Stepper definition (matching exact screenshot: 6 steps)
  const steps = [
    { id: 1, label: 'ข้อมูล Application', icon: FileText },
    { id: 2, label: 'ข้อมูลผู้เอาประกัน', icon: Users },
    { id: 3, label: 'ข้อมูลผู้ชำระเบี้ย', icon: CreditCard },
    { id: 4, label: 'ข้อมูลการชำระเบี้ย', icon: Banknote },
    { id: 5, label: 'แถลงสุขภาพ', icon: HeartPulse },
    { id: 6, label: 'ผลการตรวจสอบเอกสาร', icon: ClipboardCheck },
  ];

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-800 font-sans pb-16">
      
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900/95 text-white px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 text-xs font-medium flex items-center space-x-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP HEADER (matching screenshot) */}
      <header className="h-14 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
        
        {/* Left: Hamburger + Page Title */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="ย้อนกลับไปหน้าคิวงาน"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <h1 className="text-sm sm:text-base font-bold text-[#0072b2]">
              ติดตามงานส่งขออนุมัติ
            </h1>
            <span className="hidden sm:inline-block text-xs px-2 py-0.5 rounded bg-blue-50 text-[#0072b2] border border-blue-200 font-medium">
              หน้ารายละเอียดการตรวจสอบ
            </span>
          </div>
        </div>

        {/* Right: Grid, Bell, Briefcase, Profile */}
        <div className="flex items-center space-x-3 text-slate-600">
          
          <button 
            type="button" 
            className="p-1.5 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="แอปพลิเคชันระบบ"
          >
            <Grid className="w-4 h-4" />
          </button>

          <button 
            type="button" 
            className="p-1.5 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative transition-colors cursor-pointer"
            title="การแจ้งเตือน"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
          </button>

          <button 
            type="button" 
            className="p-1.5 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="กระเป๋างาน"
          >
            <Briefcase className="w-4 h-4" />
          </button>

          {/* User Profile avatar + Name (matching screenshot: สิรภพ ซื่อจริง (01604)) */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 text-xs text-slate-700">
            <div className="w-7 h-7 rounded-full bg-[#0072b2] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              <User className="w-4 h-4" />
            </div>
            <span className="font-semibold hidden sm:inline-block">
              สิรภพ ซื่อจริง (01604)
            </span>
          </div>

        </div>
      </header>

      {/* 2. SUB-BAR / BREADCRUMB */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center space-x-2">
          <button 
            onClick={onBack}
            className="hover:text-[#0072b2] transition-colors cursor-pointer"
          >
            ติดตามงานส่งขออนุมัติ
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-medium">
            เลขที่ Application: {caseItem.applicationNo || 'PH691000001'}
          </span>
        </div>

        <button 
          onClick={onBack}
          className="text-xs text-[#0072b2] hover:underline flex items-center space-x-1 cursor-pointer font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>กลับหน้ารายการคิว</span>
        </button>
      </div>

      {/* 3. MAIN WORKSPACE CONTAINER */}
      <div className="max-w-[1520px] mx-auto px-3 sm:px-6 py-4 space-y-4">
        
        {/* White Base Card holding Stepper and Top Context */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          
          {/* A. 6-STEPPER PROCESS BAR (matching exact screenshot layout) */}
          <div className="flex items-center justify-between overflow-x-auto pb-2 border-b border-slate-100 no-scrollbar gap-2 sm:gap-4">
            {steps.map((st, index) => {
              const StepIcon = st.icon;
              const isActive = activeStep === st.id;
              const isPassed = activeStep > st.id;

              return (
                <React.Fragment key={st.id}>
                  <button
                    type="button"
                    onClick={() => setActiveStep(st.id)}
                    className={`flex items-center space-x-2 shrink-0 py-1.5 px-2.5 rounded-lg transition-all cursor-pointer ${
                      isActive 
                        ? 'text-[#0072b2] font-bold bg-sky-50/80 ring-1 ring-sky-200' 
                        : isPassed
                          ? 'text-slate-700 font-medium hover:text-[#0072b2]'
                          : 'text-slate-400 hover:text-slate-600 font-medium'
                    }`}
                  >
                    <StepIcon className={`w-4 h-4 ${isActive ? 'text-[#0072b2]' : isPassed ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className="text-xs whitespace-nowrap">{st.label}</span>
                    {st.id === 6 && payerVerificationStatus === 'invalid' && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                    )}
                  </button>

                  {index < steps.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0 mx-1" />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* B. CONTEXT INFO STRIP (matching exact screenshot row) */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-3 text-xs text-slate-600">
            <div>
              <span>เลขที่อ้างอิงการชำระ </span>
              <a href="#payment-ref" onClick={(e) => { e.preventDefault(); triggerToast('คัดลอกเลขที่อ้างอิงแล้ว'); }} className="text-[#0072b2] underline font-medium hover:text-blue-800">
                {caseItem.refNo || 'INNW6801000256'}
              </a>
            </div>

            <div>
              <span>แผน </span>
              <a href="#plan" onClick={(e) => { e.preventDefault(); }} className="text-[#0072b2] underline font-medium hover:text-blue-800">
                503-Gold
              </a>
            </div>

            <div>
              <span>ประเภทการจ่าย </span>
              <span className="text-[#0072b2] font-semibold">
                {caseItem.coverageTerm.split(' ')[0] || 'รายเดือน'}
              </span>
            </div>

            <div>
              <span>เบี้ย </span>
              <span className="text-[#0072b2] font-bold">
                {caseItem.premium ? caseItem.premium.toLocaleString() : '675'} บาท
              </span>
            </div>

            <div>
              <span>เลขที่ Application </span>
              <a href="#app-no" onClick={(e) => { e.preventDefault(); triggerToast('คัดลอกเลข Application แล้ว'); }} className="text-[#0072b2] underline font-bold hover:text-blue-800">
                {caseItem.applicationNo || 'PH691000001'}
              </a>
            </div>

            {/* Checkpoints pill indicator */}
            {caseItem.checkpointsCount && caseItem.checkpointsCount > 0 ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                <span>เคสมีจุดตรวจสอบ {caseItem.checkpointsCount} จุด</span>
              </span>
            ) : null}

            {/* Quick jump to Step 6 summary button */}
            <div className="ml-auto flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setActiveStep(6)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-2xs ${
                  activeStep === 6
                    ? 'bg-[#0072b2] text-white ring-2 ring-blue-300'
                    : payerVerificationStatus === 'invalid'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                      : 'bg-blue-50 text-[#0072b2] border border-blue-200 hover:bg-blue-100'
                }`}
              >
                <ClipboardCheck className="w-3.5 h-3.5" />
                <span>หน้าสรุปผลตรวจทุกหมวด & ส่งคิวงาน (Step 6)</span>
                {payerVerificationStatus === 'invalid' && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-bold">
                    พบข้อผิดพลาด
                  </span>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* 4. MAIN WORKSPACE: STEP 6 SUMMARY & FORWARDING VIEW OR STEP 1-5 INSPECTION FORM & DOC VIEWER */}
        {activeStep === 6 ? (
          <InspectionSummaryView
            caseItem={caseItem}
            payerVerificationStatus={payerVerificationStatus}
            payerVerificationNote={payerVerificationNote}
            onJumpToStep={(stepId) => setActiveStep(stepId)}
            onBackToInspection={() => setActiveStep(2)}
            onFinalizeCase={(updatedCase, actionType) => {
              if (onSaveCase) onSaveCase(updatedCase);
              if (actionType === 'forward_agent') {
                triggerToast(`ส่งต่อคิวงานไปยัง UDW ผู้แทน (${caseItem.agentName || 'เจ้าของงาน'}) เรียบร้อยแล้ว`);
              } else if (actionType === 'approve') {
                triggerToast('อนุมัติเอกสารผ่านครบทุกหมวดเรียบร้อยแล้ว');
              } else {
                triggerToast('บันทึกเพื่อรอแก้ไขเรียบร้อยแล้ว');
              }
              setTimeout(() => {
                onBack();
              }, 1200);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* ========================================================== */}
          {/* LEFT COLUMN: FORM SECTIONS (Width 7/12 or 8/12) */}
          {/* ========================================================== */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* ---------------- CARD 1: ข้อมูลผู้เอาประกัน ---------------- */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              
              {/* Header with Accordion toggle */}
              <div 
                onClick={() => setIsInsuredInfoOpen(!isInsuredInfoOpen)}
                className="px-5 py-3.5 bg-white flex items-center justify-between border-b border-slate-100 cursor-pointer select-none hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <h2 className="text-sm font-bold text-slate-800">
                    ข้อมูลผู้เอาประกัน
                  </h2>
                </div>
                <button type="button" className="text-slate-400 hover:text-slate-600">
                  {isInsuredInfoOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>

              {isInsuredInfoOpen && (
                <div className="p-5 space-y-4 text-xs">
                  
                  {/* OCR Switch and Scan Button (matching screenshot) */}
                  <div className="flex items-center space-x-3">
                    {/* Toggle switch */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isOcrEnabled}
                        onChange={(e) => setIsOcrEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0072b2]"></div>
                    </label>

                    {/* OCR Button */}
                    <button
                      type="button"
                      onClick={handleTriggerOcr}
                      disabled={isOcrScanning}
                      className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-dashed border-slate-300 hover:border-[#0072b2] text-slate-700 hover:text-[#0072b2] bg-white transition-all cursor-pointer text-xs font-medium"
                    >
                      {isOcrScanning ? (
                        <RotateCw className="w-3.5 h-3.5 animate-spin text-[#0072b2]" />
                      ) : (
                        <Scan className="w-3.5 h-3.5 text-[#0072b2]" />
                      )}
                      <span>OCR บัตรประชาชนผู้เอาประกัน</span>
                      {ocrSuccess && (
                        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          Match 100%
                        </span>
                      )}
                    </button>
                  </div>

                  {/* ID type pills: [หมายเลขบัตรประชาชน] [หมายเลข Passport] */}
                  <div className="inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setIdTypeTab('id_card')}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                        idTypeTab === 'id_card'
                          ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/80'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      หมายเลขบัตรประชาชน
                    </button>
                    <button
                      type="button"
                      onClick={() => setIdTypeTab('passport')}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                        idTypeTab === 'passport'
                          ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/80'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      หมายเลข Passport
                    </button>
                  </div>

                  {/* Row 1: หมายเลขบัตรประชาชน + ค้นหา */}
                  <div className="flex flex-col sm:flex-row sm:items-end gap-2.5">
                    <div className="flex-1">
                      <label className="block text-slate-600 text-xs font-medium mb-1">
                        หมายเลขบัตรประชาชนผู้เอาประกัน <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={idNumber}
                          onChange={(e) => setIdNumber(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-emerald-500 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 pr-9"
                        />
                        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => triggerToast('ค้นหาข้อมูลประวัติผู้เอาประกันภัยในฐานข้อมูลสำเร็จ')}
                      className="px-5 py-2 rounded-lg bg-[#0072b2] hover:bg-[#005a92] text-white font-semibold text-xs shadow-2xs transition-colors cursor-pointer shrink-0 h-[34px]"
                    >
                      ค้นหา
                    </button>
                  </div>

                  {/* Row 2: คำนำหน้า, ชื่อผู้เอาประกัน, นามสกุลผู้เอาประกัน (3 columns) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-600 text-xs font-medium mb-1">
                        คำนำหน้า <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={prefix}
                          onChange={(e) => setPrefix(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-emerald-500 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 pr-8"
                        />
                        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-600 text-xs font-medium mb-1">
                        ชื่อผู้เอาประกัน <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-emerald-500 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 pr-8"
                        />
                        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-600 text-xs font-medium mb-1">
                        นามสกุลผู้เอาประกัน <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-emerald-500 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 pr-8"
                        />
                        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Row 3: วันเกิดผู้เอาประกัน + อายุมือสมัคร */}
                  <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <div className="w-full md:w-60">
                      <label className="block text-slate-600 text-xs font-medium mb-1">
                        วันเกิดผู้เอาประกัน <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={birthDate}
                          onChange={(e) => setBirthDate(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-emerald-500 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 pr-8"
                        />
                        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </div>
                      </div>
                    </div>

                    {/* Age and eligibility text (matching screenshot) */}
                    <div className="pt-2 text-xs flex flex-wrap items-center gap-x-2">
                      <span className="text-slate-600">
                        อายุมือสมัคร : <strong className="text-slate-800 font-semibold">26 ปี 1 เดือน 12 วัน</strong>
                      </span>
                      <span className="text-rose-500 font-medium">
                        เกิดวันที่ 1/10/2499 ถึงวันที่ 30/4/2514
                      </span>
                    </div>
                  </div>

                  {/* Row 4: กลุ่มอาชีพ, อาชีพ, เพศ (3 dropdowns) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-600 text-xs font-medium mb-1">
                        กลุ่มอาชีพ <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={occupationGroup}
                        onChange={(e) => setOccupationGroup(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-[#0072b2]"
                      >
                        <option value="พนักงานบริษัท">พนักงานบริษัท</option>
                        <option value="ข้าราชการ/รัฐวิสาหกิจ">ข้าราชการ/รัฐวิสาหกิจ</option>
                        <option value="เจ้าของกิจการ/ธุรกิจส่วนตัว">เจ้าของกิจการ/ธุรกิจส่วนตัว</option>
                        <option value="นักเรียน/นักศึกษา">นักเรียน/นักศึกษา</option>
                        <option value="รับจ้างทั่วไป">รับจ้างทั่วไป</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 text-xs font-medium mb-1">
                        อาชีพ <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-[#0072b2]"
                      >
                        <option value="พนักงานทั่วไป">พนักงานทั่วไป</option>
                        <option value="ผู้จัดการ/หัวหน้างาน">ผู้จัดการ/หัวหน้างาน</option>
                        <option value="เจ้าหน้าที่บัญชีและการเงิน">เจ้าหน้าที่บัญชีและการเงิน</option>
                        <option value="วิศวกร/สถาปนิก">วิศวกร/สถาปนิก</option>
                        <option value="แพทย์/พยาบาล">แพทย์/พยาบาล</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 text-xs font-medium mb-1">
                        เพศ <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-[#0072b2]"
                      >
                        <option value="หญิง">หญิง</option>
                        <option value="ชาย">ชาย</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 5: ส่วนสูง, น้ำหนัก, BMI indicator */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <div className="sm:col-span-4">
                      <label className="block text-slate-600 text-xs font-medium mb-1">
                        ส่วนสูง (ซม.)
                      </label>
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-[#0072b2]"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="block text-slate-600 text-xs font-medium mb-1">
                        น้ำหนัก (กก.)
                      </label>
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-[#0072b2]"
                      />
                    </div>

                    <div className="sm:col-span-4 pt-4 sm:pt-5">
                      <div className="flex items-center space-x-1.5 text-xs">
                        <span className="text-slate-600 font-medium">BMI : </span>
                        <span className="text-[#0072b2] font-bold">
                          {bmiVal} อยู่ในเกณฑ์ปกติ
                        </span>
                        <User className="w-4 h-4 text-[#0072b2] fill-sky-200" />
                      </div>
                    </div>
                  </div>

                  {/* Row 6: โทรศัพท์มือถือ, Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 text-xs font-medium mb-1">
                        โทรศัพท์มือถือ <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={mobilePhone}
                        onChange={(e) => setMobilePhone(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-[#0072b2]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 text-xs font-medium mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-[#0072b2]"
                      />
                    </div>
                  </div>

                  {/* =================================================== */}
                  {/* SUB-SECTION 1: ที่อยู่ตามบัตรประชาชนของผู้เอาประกัน */}
                  {/* =================================================== */}
                  <div className="pt-2">
                    {/* Light Blue Banner Header */}
                    <div className="w-full bg-[#e8f3fc] text-[#005a9e] px-3 py-2 rounded-lg font-bold text-xs">
                      ที่อยู่ตามบัตรประชาชนของผู้เอาประกัน
                    </div>

                    <div className="pt-3 space-y-3">
                      <div>
                        <label className="block text-slate-600 text-xs font-medium mb-1">
                          ที่อยู่ <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={idAddress}
                            onChange={(e) => setIdAddress(e.target.value)}
                            className="w-full px-3 py-1.5 bg-white border border-emerald-500 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 pr-8"
                          />
                          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          *ระบุเลขที่ ซอย ถนน อาคาร ห้องเลขที่ หรือหมู่บ้าน
                        </p>
                      </div>

                      {/* จังหวัด, อำเภอ, ตำบล, รหัสไปรษณีย์ */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                        <div>
                          <label className="block text-slate-600 text-xs font-medium mb-1">
                            จังหวัด <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <select
                              value={idProvince}
                              onChange={(e) => setIdProvince(e.target.value)}
                              className="w-full px-3 py-1.5 bg-white border border-emerald-500 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 pr-8"
                            >
                              <option value="กรุงเทพมหานคร">กรุงเทพมหานคร</option>
                              <option value="นนทบุรี">นนทบุรี</option>
                              <option value="ปทุมธานี">ปทุมธานี</option>
                              <option value="สมุทรปราการ">สมุทรปราการ</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-600 text-xs font-medium mb-1">
                            อำเภอ <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <select
                              value={idDistrict}
                              onChange={(e) => setIdDistrict(e.target.value)}
                              className="w-full px-3 py-1.5 bg-white border border-emerald-500 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 pr-8"
                            >
                              <option value="สายไหม">สายไหม</option>
                              <option value="บางเขน">บางเขน</option>
                              <option value="ดอนเมือง">ดอนเมือง</option>
                              <option value="จตุจักร">จตุจักร</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-600 text-xs font-medium mb-1">
                            ตำบล <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <select
                              value={idSubDistrict}
                              onChange={(e) => setIdSubDistrict(e.target.value)}
                              className="w-full px-3 py-1.5 bg-white border border-emerald-500 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 pr-8"
                            >
                              <option value="สายไหม">สายไหม</option>
                              <option value="ออเงิน">ออเงิน</option>
                              <option value="คลองถนน">คลองถนน</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                          </div>
                        </div>

                        <div className="pt-4">
                          <span className="text-slate-600 font-medium text-xs">
                            รหัสไปรษณีย์ : <strong className="text-slate-900 font-bold">{idPostalCode}</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* =================================================== */}
                  {/* SUB-SECTION 2: ที่อยู่ที่ติดต่อได้ของผู้เอาประกัน */}
                  {/* =================================================== */}
                  <div className="pt-2">
                    <div className="w-full bg-[#e8f3fc] text-[#005a9e] px-3 py-2 rounded-lg font-bold text-xs">
                      ที่อยู่ที่ติดต่อได้ของผู้เอาประกัน
                    </div>

                    <div className="pt-3">
                      <label className="inline-flex items-center space-x-2.5 cursor-pointer">
                        <div className="relative inline-flex items-center">
                          <input 
                            type="checkbox" 
                            checked={hasContactAddress}
                            onChange={(e) => setHasContactAddress(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0072b2]"></div>
                        </div>
                        <span className="text-xs text-slate-700 font-medium select-none">
                          มีที่อยู่ที่ติดต่อได้ของผู้เอาประกัน
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* =================================================== */}
                  {/* SUB-SECTION 3: สถานที่ทำงานของผู้เอาประกัน */}
                  {/* =================================================== */}
                  <div className="pt-2 space-y-3">
                    <div className="w-full bg-[#e8f3fc] text-[#005a9e] px-3 py-2 rounded-lg font-bold text-xs">
                      สถานที่ทำงานของผู้เอาประกัน
                    </div>

                    {/* Toggle: มีสถานที่ทำงานของผู้เอาประกัน */}
                    <div>
                      <label className="inline-flex items-center space-x-2.5 cursor-pointer">
                        <div className="relative inline-flex items-center">
                          <input 
                            type="checkbox" 
                            checked={hasWorkplace}
                            onChange={(e) => setHasWorkplace(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0072b2]"></div>
                        </div>
                        <span className="text-xs text-slate-700 font-medium select-none">
                          มีสถานที่ทำงานของผู้เอาประกัน
                        </span>
                      </label>
                    </div>

                    {hasWorkplace && (
                      <div className="space-y-3 pt-1">
                        
                        {/* จังหวัด, อำเภอ, ตำบล, รหัสไปรษณีย์ */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                          <div>
                            <label className="block text-slate-600 text-xs font-medium mb-1">
                              จังหวัด <span className="text-rose-500">*</span>
                            </label>
                            <select
                              value={workProvince}
                              onChange={(e) => setWorkProvince(e.target.value)}
                              className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-[#0072b2]"
                            >
                              <option value="กรุงเทพมหานคร">กรุงเทพมหานคร</option>
                              <option value="นนทบุรี">นนทบุรี</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-slate-600 text-xs font-medium mb-1">
                              อำเภอ <span className="text-rose-500">*</span>
                            </label>
                            <select
                              value={workDistrict}
                              onChange={(e) => setWorkDistrict(e.target.value)}
                              className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-[#0072b2]"
                            >
                              <option value="สายไหม">สายไหม</option>
                              <option value="บางเขน">บางเขน</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-slate-600 text-xs font-medium mb-1">
                              ตำบล <span className="text-rose-500">*</span>
                            </label>
                            <select
                              value={workSubDistrict}
                              onChange={(e) => setWorkSubDistrict(e.target.value)}
                              className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-[#0072b2]"
                            >
                              <option value="สายไหม">สายไหม</option>
                              <option value="ออเงิน">ออเงิน</option>
                            </select>
                          </div>

                          <div className="pt-4">
                            <span className="text-slate-600 font-medium text-xs">
                              รหัสไปรษณีย์ : <strong className="text-slate-900 font-bold">10220</strong>
                            </span>
                          </div>
                        </div>

                        {/* Toggle: มีหน่วยงาน (เช่น โรงเรียน, อบต., เทศบาล, บริษัท เป็นต้น) */}
                        <div className="pt-1">
                          <label className="inline-flex items-center space-x-2.5 cursor-pointer">
                            <div className="relative inline-flex items-center">
                              <input 
                                type="checkbox" 
                                checked={hasOrganization}
                                onChange={(e) => setHasOrganization(e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0072b2]"></div>
                            </div>
                            <span className="text-xs text-slate-700 font-medium select-none">
                              มีหน่วยงาน (เช่น โรงเรียน, อบต., เทศบาล, บริษัท เป็นต้น)
                            </span>
                          </label>
                        </div>

                        {hasOrganization && (
                          <div className="space-y-2 pt-1">
                            {/* ชื่อหน่วยงาน + เพิ่มสถานที่ทำงาน button */}
                            <div className="flex flex-col sm:flex-row sm:items-end gap-2.5">
                              <div className="flex-1">
                                <label className="block text-slate-600 text-xs font-medium mb-1">
                                  ชื่อหน่วยงาน <span className="text-rose-500">*</span>
                                </label>
                                <select
                                  value={organizationName}
                                  onChange={(e) => setOrganizationName(e.target.value)}
                                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-[#0072b2]"
                                >
                                  <option value="บริษัท สยามสไมล์โบรกเกอร์ ประเทศไทย จำกัด(สำนักงานใหญ่)">
                                    บริษัท สยามสไมล์โบรกเกอร์ ประเทศไทย จำกัด(สำนักงานใหญ่)
                                  </option>
                                  <option value="บริษัท เมืองไทยประกันภัย จำกัด (มหาชน)">
                                    บริษัท เมืองไทยประกันภัย จำกัด (มหาชน)
                                  </option>
                                  <option value="โรงเรียนสายไหมศึกษา">
                                    โรงเรียนสายไหมศึกษา
                                  </option>
                                </select>
                              </div>

                              <button
                                type="button"
                                onClick={() => triggerToast('เปิดฟอร์มเพิ่มสถานที่ทำงานใหม่')}
                                className="px-3.5 py-1.5 rounded-lg border border-[#0072b2] text-[#0072b2] hover:bg-sky-50 font-semibold text-xs transition-colors cursor-pointer shrink-0 inline-flex items-center space-x-1 h-[32px]"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>เพิ่มสถานที่ทำงาน</span>
                              </button>
                            </div>

                            <p className="text-[11px] text-slate-400">
                              กรณีไม่มีหน่วยงานในระบบ กรุณาเพิ่มสถานที่ทำงาน
                            </p>

                            {/* ที่อยู่สถานที่ทำงาน */}
                            <div className="pt-1">
                              <label className="block text-slate-600 text-xs font-medium mb-1">
                                ที่อยู่ <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={workAddress}
                                onChange={(e) => setWorkAddress(e.target.value)}
                                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-[#0072b2]"
                              />
                            </div>
                          </div>
                        )}

                      </div>
                    )}

                  </div>

                </div>
              )}

            </div>

            {/* ---------------- CARD 2: ผู้เอาประกันเป็นบุคคลเดียวกับผู้ชำระเบี้ยหรือไม่ ---------------- */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <div 
                onClick={() => setIsPayerCheckOpen(!isPayerCheckOpen)}
                className="px-5 py-3.5 bg-white flex items-center justify-between border-b border-slate-100 cursor-pointer select-none hover:bg-slate-50/60 transition-colors"
              >
                <h2 className="text-sm font-bold text-slate-800">
                  ผู้เอาประกันเป็นบุคคลเดียวกับผู้ชำระเบี้ยหรือไม่
                </h2>
                <button type="button" className="text-slate-400 hover:text-slate-600">
                  {isPayerCheckOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>

              {isPayerCheckOpen && (
                <div className="p-5 space-y-4 text-xs font-semibold">
                  <div className="flex items-center space-x-6">
                    <label className="inline-flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="payerRelation"
                        value="yes"
                        checked={isSamePayer === 'yes'}
                        onChange={() => setIsSamePayer('yes')}
                        className="w-4 h-4 text-[#0072b2] focus:ring-[#0072b2]"
                      />
                      <span className="text-slate-800">ใช่ (ผู้เอาประกันชำระเบี้ยเอง)</span>
                    </label>

                    <label className="inline-flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="payerRelation"
                        value="no"
                        checked={isSamePayer === 'no'}
                        onChange={() => setIsSamePayer('no')}
                        className="w-4 h-4 text-[#0072b2] focus:ring-[#0072b2]"
                      />
                      <span className="text-slate-800">ไม่ (บุคคลอื่นเป็นผู้ชำระเบี้ย)</span>
                    </label>
                  </div>

                  {/* If not same person, show detailed payer fields */}
                  {isSamePayer === 'no' && (
                    <div className="pt-3 border-t border-slate-100 space-y-3 bg-slate-50/70 -mx-5 -mb-5 p-5 rounded-b-xl">
                      <div className="flex items-center justify-between text-xs text-slate-700 font-bold">
                        <span>ข้อมูลผู้ชำระเบี้ย (Payer Information)</span>
                        <span className="text-[11px] text-[#0072b2] font-normal">
                          * ตรวจสอบผลได้ที่กล่องผลการตรวจสอบด้านขวา
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-slate-600 font-normal mb-1">
                            ชื่อ-นามสกุล ผู้ชำระเบี้ย
                          </label>
                          <input
                            type="text"
                            value={payerName}
                            onChange={(e) => setPayerName(e.target.value)}
                            className="w-full h-8 px-2.5 rounded border border-slate-300 bg-white text-slate-800 text-xs focus:ring-1 focus:ring-[#0072b2] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-600 font-normal mb-1">
                            ความสัมพันธ์กับผู้เอาประกันภัย
                          </label>
                          <select
                            value={payerRelation}
                            onChange={(e) => setPayerRelation(e.target.value)}
                            className="w-full h-8 px-2.5 rounded border border-slate-300 bg-white text-slate-800 text-xs focus:ring-1 focus:ring-[#0072b2] focus:outline-none"
                          >
                            <option value="บิดา">บิดา</option>
                            <option value="มารดา">มารดา</option>
                            <option value="คู่สมรส">คู่สมรส</option>
                            <option value="บุตร">บุตร</option>
                            <option value="พี่น้องร่วมบิดามารดา">พี่น้องร่วมบิดามารดา</option>
                            <option value="นายจ้าง/องค์กร">นายจ้าง / องค์กร</option>
                            <option value="อื่นๆ">อื่นๆ</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-600 font-normal mb-1">
                            เลขประจำตัวประชาชนผู้ชำระเบี้ย
                          </label>
                          <input
                            type="text"
                            value={payerIdNumber}
                            onChange={(e) => setPayerIdNumber(e.target.value)}
                            className="w-full h-8 px-2.5 rounded border border-slate-300 bg-white text-slate-800 text-xs focus:ring-1 focus:ring-[#0072b2] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-600 font-normal mb-1">
                            เบอร์โทรศัพท์ติดต่อ
                          </label>
                          <input
                            type="text"
                            value={payerPhone}
                            onChange={(e) => setPayerPhone(e.target.value)}
                            className="w-full h-8 px-2.5 rounded border border-slate-300 bg-white text-slate-800 text-xs focus:ring-1 focus:ring-[#0072b2] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Actions Row (matching screenshot: [ย้อนกลับ] on left, [บันทึกคิวงาน] [ถัดไป] on right) */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-2 rounded-lg border border-slate-300 hover:border-slate-400 hover:bg-white text-slate-700 font-semibold text-xs transition-colors cursor-pointer shadow-2xs"
              >
                ย้อนกลับ
              </button>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-6 py-2 rounded-lg bg-[#2e7d32] hover:bg-[#256629] text-white font-semibold text-xs shadow-2xs transition-colors cursor-pointer inline-flex items-center space-x-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>บันทึกคิวงาน</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (activeStep < 6) {
                      setActiveStep(activeStep + 1);
                      triggerToast(`เปลี่ยนไปยังขั้นตอนที่ ${activeStep + 1}`);
                    } else {
                      triggerToast('อยู่ในขั้นตอนสุดท้ายของการตรวจสอบแล้ว');
                    }
                  }}
                  className="px-6 py-2 rounded-lg bg-[#0072b2] hover:bg-[#005a92] text-white font-semibold text-xs shadow-2xs transition-colors cursor-pointer inline-flex items-center space-x-1"
                >
                  <span>ถัดไป</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* ========================================================== */}
          {/* RIGHT COLUMN: DOCUMENT VIEWER & METADATA (Width 4/12 or 5/12) */}
          {/* ========================================================== */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
              
              {/* Header: รายละเอียดเอกสาร */}
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  รายละเอียดเอกสาร
                </h2>
                <div className="mt-1">
                  <span className="text-xs font-semibold text-[#0072b2]">
                    {attachedDocs[currentDocIndex].title}
                  </span>
                </div>
              </div>

              {/* Document Display Box with Left/Right Navigation */}
              <div className="relative bg-slate-100 rounded-xl p-3 border border-slate-200 flex flex-col items-center justify-center min-h-[220px]">
                
                {/* Previous Document Button */}
                <button
                  type="button"
                  onClick={() => setCurrentDocIndex((prev) => (prev > 0 ? prev - 1 : attachedDocs.length - 1))}
                  className="absolute left-1.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white/90 shadow hover:bg-white text-slate-700 flex items-center justify-center cursor-pointer transition-transform active:scale-95 border border-slate-200"
                  title="เอกสารก่อนหน้า"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Next Document Button */}
                <button
                  type="button"
                  onClick={() => setCurrentDocIndex((prev) => (prev < attachedDocs.length - 1 ? prev + 1 : 0))}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white/90 shadow hover:bg-white text-slate-700 flex items-center justify-center cursor-pointer transition-transform active:scale-95 border border-slate-200"
                  title="เอกสารถัดไป"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Document Graphic Render based on selected doc */}
                <div 
                  className="w-full flex justify-center transition-transform duration-200 cursor-pointer"
                  style={{ transform: `scale(${zoomLevel / 100})` }}
                  onClick={() => setIsDocModalOpen(true)}
                  title="คลิกเพื่อดูเอกสารขนาดเต็ม"
                >
                  {currentDocIndex === 0 ? (
                    <ThaiIdCardGraphic
                      idNumber={idNumber}
                      nameThai={`${prefix} ${firstName} ${lastName}`}
                      nameEng="Miss Tantawan Rungratsameesap"
                      dobThai="24 มี.ค. 2508"
                      dobEng="24 Mar. 1965"
                      address={`${idAddress} แขวง${idSubDistrict} เขต${idDistrict} ${idProvince}`}
                    />
                  ) : currentDocIndex === 1 ? (
                    /* House Registration Card Simulation */
                    <div className="w-full max-w-[420px] aspect-[1.58] bg-blue-900 text-white rounded-xl p-4 flex flex-col justify-between border-2 border-amber-400 shadow-md">
                      <div className="text-center">
                        <div className="text-[11px] font-bold tracking-widest text-amber-300">สำเนาทะเบียนบ้าน (ทร.14)</div>
                        <div className="text-[9px] text-blue-200">กรมการปกครอง กระทรวงมหาดไทย</div>
                      </div>
                      <div className="text-[10px] space-y-1 bg-white/10 p-2.5 rounded-lg border border-white/20">
                        <div>เลขรหัสประจำบ้าน: <strong>1034-089123-4</strong></div>
                        <div>เจ้าบ้าน/ผู้อาศัย: <strong>{prefix} {firstName} {lastName}</strong></div>
                        <div>ที่อยู่: {idAddress} ต.{idSubDistrict} อ.{idDistrict} จ.{idProvince}</div>
                      </div>
                      <div className="text-[8px] text-blue-200 text-right">
                        นายทะเบียนท้องถิ่นเขตสายไหม
                      </div>
                    </div>
                  ) : currentDocIndex === 2 ? (
                    /* Bank Transfer Slip Simulation */
                    <div className="w-full max-w-[400px] aspect-[1.5] bg-gradient-to-br from-emerald-50 to-teal-100 text-slate-800 rounded-xl p-4 flex flex-col justify-between border border-emerald-300 shadow-md">
                      <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                        <div className="font-bold text-emerald-800 text-xs">สลิปโอนเงินชำระเบี้ยประกันภัย</div>
                        <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full">สำเร็จ</span>
                      </div>
                      <div className="text-[11px] space-y-1 py-1">
                        <div>ยอดชำระ: <strong className="text-emerald-700 text-sm">675.00 บาท</strong></div>
                        <div>ผู้ชำระ: {prefix} {firstName} {lastName}</div>
                        <div>เข้าบัญชี: บมจ. สยามสไมล์ประกันภัย</div>
                        <div>เลขอ้างอิง: INNW6801000256</div>
                      </div>
                      <div className="text-[9px] text-slate-500">
                        วัน-เวลา: 16 ก.ค. 2569 - 15:56:31
                      </div>
                    </div>
                  ) : (
                    /* Health Medical Form Simulation */
                    <div className="w-full max-w-[400px] aspect-[1.5] bg-white text-slate-800 rounded-xl p-4 flex flex-col justify-between border border-slate-300 shadow-md">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                        <div className="font-bold text-slate-900 text-xs">ใบแถลงสุขภาพและคัดกรอง</div>
                        <span className="text-[10px] bg-blue-100 text-[#0072b2] font-semibold px-2 py-0.5 rounded">Standard</span>
                      </div>
                      <div className="text-[10px] space-y-1">
                        <div>ส่วนสูง: 165 ซม. / น้ำหนัก: 60 กก. (BMI 22.0)</div>
                        <div>ประวัติการรักษาใน 5 ปี: <span className="text-emerald-700 font-semibold">ไม่มี</span></div>
                        <div>โรคประจำตัว/ผ่าตัด: <span className="text-emerald-700 font-semibold">ไม่มี</span></div>
                      </div>
                      <div className="text-[8px] text-slate-400 border-t pt-1">
                        แพทย์ผู้ตรวจ: ทพญ. กนกพร / ใบอนุญาต ว.44192
                      </div>
                    </div>
                  )}
                </div>

                {/* Floating Zoom Control pill at bottom of image (matching screenshot: [-] 100% [+] [⛶]) */}
                <div className="absolute bottom-2.5 z-20 bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center space-x-2 shadow-md">
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.max(z - 10, 70))}
                    className="hover:text-sky-300 transition-colors cursor-pointer"
                    title="ย่อขนาด"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono select-none px-1">
                    {zoomLevel}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.min(z + 10, 160))}
                    className="hover:text-sky-300 transition-colors cursor-pointer"
                    title="ขยายขนาด"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-px h-3 bg-slate-600"></span>
                  <button
                    type="button"
                    onClick={() => setIsDocModalOpen(true)}
                    className="hover:text-sky-300 transition-colors cursor-pointer"
                    title="ดูภาพเต็มจอ"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

              {/* Carousel Pagination Dots (matching screenshot: ● ○ ○ ○) */}
              <div className="flex items-center justify-center space-x-1.5 pt-1">
                {attachedDocs.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentDocIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentDocIndex === idx 
                        ? 'w-4 bg-[#0072b2]' 
                        : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>

              {/* Document Metadata Table (matching exact screenshot labels) */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-start justify-between">
                  <span className="text-slate-500">รหัสเอกสาร</span>
                  <span className="font-mono font-semibold text-slate-800 text-right">
                    {attachedDocs[currentDocIndex].code}
                  </span>
                </div>

                <div className="flex items-start justify-between">
                  <span className="text-slate-500">ชื่อเอกสาร</span>
                  <span className="font-semibold text-slate-800 text-right">
                    {attachedDocs[currentDocIndex].title}
                  </span>
                </div>

                <div className="flex items-start justify-between">
                  <span className="text-slate-500">วันที่สร้างรายการ</span>
                  <span className="font-mono text-slate-700 text-right">
                    {attachedDocs[currentDocIndex].date}
                  </span>
                </div>
              </div>

              {/* Checkpoint Inspection Summary Box */}
              <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0072b2] flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>ผลการตรวจสอบเอกสาร</span>
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    ผ่านเกณฑ์
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  ชื่อ-สกุล เลขบัตรประชาชน และที่อยู่ ตรงกับแบบคำขอรับประกันภัย สามารถอนุมัติในขั้นตอนถัดไปได้
                </p>
              </div>

            </div>

            {/* ========================================================== */}
            {/* กล่องผลการตรวจสอบ (หมวดผู้ชำระเบี้ย) ตามที่ผู้ใช้ระบุ */}
            {/* ========================================================== */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
              
              {/* Header: กล่องผลการตรวจสอบ */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center space-x-1.5">
                    <ClipboardCheck className="w-4 h-4 text-[#0072b2]" />
                    <h3 className="text-sm font-bold text-slate-900">
                      กล่องผลการตรวจสอบ
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    หมวดผู้ชำระเบี้ยประกันภัย (Payer Information Verification)
                  </p>
                </div>

                {/* Status Pill Badge */}
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border transition-colors ${
                  payerVerificationStatus === 'valid'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-rose-50 text-rose-700 border-rose-300'
                }`}>
                  {payerVerificationStatus === 'valid' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>ข้อมูลถูกต้อง</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>ข้อมูลไม่ถูกต้อง</span>
                    </>
                  )}
                </span>
              </div>

              {/* Question & Interactive Choice for: ข้อมูลถูกต้อง หรือ ไม่ */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  ระบุผลการตรวจสอบหมวดผู้ชำระเบี้ย <span className="text-rose-500">*</span>
                </label>

                <div className="grid grid-cols-2 gap-2.5">
                  {/* Option 1: ข้อมูลถูกต้อง */}
                  <button
                    type="button"
                    onClick={() => {
                      setPayerVerificationStatus('valid');
                      setIsPayerInspectionSaved(false);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      payerVerificationStatus === 'valid'
                        ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20 text-emerald-950 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 className={`w-4 h-4 ${payerVerificationStatus === 'valid' ? 'text-emerald-600' : 'text-slate-400'}`} />
                        ข้อมูลถูกต้อง
                      </span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        payerVerificationStatus === 'valid' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300 bg-white'
                      }`}>
                        {payerVerificationStatus === 'valid' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                    <p className="text-[10.5px] mt-1.5 leading-snug text-slate-500">
                      ผู้ชำระเบี้ยถูกต้อง ตรงตามหลักเกณฑ์
                    </p>
                  </button>

                  {/* Option 2: ข้อมูลไม่ถูกต้อง */}
                  <button
                    type="button"
                    onClick={() => {
                      setPayerVerificationStatus('invalid');
                      setIsPayerInspectionSaved(false);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      payerVerificationStatus === 'invalid'
                        ? 'border-rose-500 bg-rose-50/80 ring-2 ring-rose-500/20 text-rose-950 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold flex items-center gap-1.5">
                        <XCircle className={`w-4 h-4 ${payerVerificationStatus === 'invalid' ? 'text-rose-600' : 'text-slate-400'}`} />
                        ข้อมูลไม่ถูกต้อง
                      </span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        payerVerificationStatus === 'invalid' ? 'border-rose-600 bg-rose-600' : 'border-slate-300 bg-white'
                      }`}>
                        {payerVerificationStatus === 'invalid' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                    <p className="text-[10.5px] mt-1.5 leading-snug text-slate-500">
                      พบข้อผิดพลาด หรือเอกสารไม่ครบ
                    </p>
                  </button>
                </div>
              </div>

              {/* Sub-checkpoints Checklist */}
              <div className="bg-slate-50/90 rounded-lg p-2.5 border border-slate-200/80 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-700 block">
                  จุดตรวจสอบย่อย (Checklist):
                </span>
                
                <label className="flex items-start space-x-2 text-[11px] text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={payerCheckpoints.identityVerified}
                    onChange={(e) => setPayerCheckpoints(prev => ({ ...prev, identityVerified: e.target.checked }))}
                    className="mt-0.5 rounded text-[#0072b2] focus:ring-[#0072b2]"
                  />
                  <span>ชื่อ-สกุล และเลขประจำตัวประชาชนตรงตามหลักฐาน</span>
                </label>

                <label className="flex items-start space-x-2 text-[11px] text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={payerCheckpoints.relationshipValid}
                    onChange={(e) => setPayerCheckpoints(prev => ({ ...prev, relationshipValid: e.target.checked }))}
                    className="mt-0.5 rounded text-[#0072b2] focus:ring-[#0072b2]"
                  />
                  <span>ความสัมพันธ์ระหว่างผู้เอาประกันภัยกับผู้ชำระเบี้ยถูกต้อง</span>
                </label>

                <label className="flex items-start space-x-2 text-[11px] text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={payerCheckpoints.paymentProofMatched}
                    onChange={(e) => setPayerCheckpoints(prev => ({ ...prev, paymentProofMatched: e.target.checked }))}
                    className="mt-0.5 rounded text-[#0072b2] focus:ring-[#0072b2]"
                  />
                  <span>สลิปโอนเงินหรือหลักฐานชำระเบี้ยตรงตามเงื่อนไข</span>
                </label>
              </div>

              {/* กล่องหมายเหตุ (Remark / Notes Box) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                    <MessageSquare className="w-3.5 h-3.5 text-[#0072b2]" />
                    <span>กล่องหมายเหตุการตรวจสอบ</span>
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {payerVerificationNote.length}/200 ตัวอักษร
                  </span>
                </div>

                <textarea
                  value={payerVerificationNote}
                  onChange={(e) => {
                    setPayerVerificationNote(e.target.value);
                    setIsPayerInspectionSaved(false);
                  }}
                  placeholder={
                    payerVerificationStatus === 'valid'
                      ? "ระบุหมายเหตุ เช่น ข้อมูลผู้ชำระเบี้ยถูกต้อง ตรวจสอบสลิปตรงกับระบบแล้ว..."
                      : "ระบุข้อผิดพลาด เช่น ขาดหนังสือยินยอมชำระแทน, เลขบัตรประชาชนไม่ตรงกับสลิป..."
                  }
                  rows={3}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0072b2] focus:border-transparent text-slate-800 placeholder-slate-400 resize-y"
                />

                {/* Preset Quick Remark Chips */}
                <div className="pt-0.5">
                  <span className="text-[10.5px] font-semibold text-slate-500 block mb-1">
                    เลือกข้อความด่วน:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {payerVerificationStatus === 'valid' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setPayerVerificationNote("ข้อมูลผู้ชำระเบี้ยถูกต้อง ครบถ้วนตามเกณฑ์");
                            setIsPayerInspectionSaved(false);
                          }}
                          className="text-[10.5px] px-2 py-0.5 rounded bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 transition-colors cursor-pointer border border-slate-200"
                        >
                          + ข้อมูลครบถ้วนถูกต้อง
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPayerVerificationNote("เป็นบุคคลเดียวกับผู้เอาประกันภัย เอกสารสลิปตรงกัน");
                            setIsPayerInspectionSaved(false);
                          }}
                          className="text-[10.5px] px-2 py-0.5 rounded bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 transition-colors cursor-pointer border border-slate-200"
                        >
                          + เป็นบุคคลเดียวกัน
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPayerVerificationNote("ตรวจสอบความสัมพันธ์บิดา/มารดา ถูกต้องตามแบบคำขอ");
                            setIsPayerInspectionSaved(false);
                          }}
                          className="text-[10.5px] px-2 py-0.5 rounded bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 transition-colors cursor-pointer border border-slate-200"
                        >
                          + ความสัมพันธ์ถูกต้อง
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setPayerVerificationNote("ชื่อผู้ชำระเบี้ยในสลิปไม่ตรงกับข้อมูลในแบบคำขอ");
                            setIsPayerInspectionSaved(false);
                          }}
                          className="text-[10.5px] px-2 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer border border-rose-200"
                        >
                          + ชื่อในสลิปไม่ตรง
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPayerVerificationNote("ขาดหนังสือยินยอมการชำระเบี้ยแทน / ความยินยอมหักบัญชี");
                            setIsPayerInspectionSaved(false);
                          }}
                          className="text-[10.5px] px-2 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer border border-rose-200"
                        >
                          + ขาดหนังสือยินยอม
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPayerVerificationNote("ขาดเอกสารแสดงความสัมพันธ์ระหว่างผู้เอาประกันกับผู้ชำระเบี้ย");
                            setIsPayerInspectionSaved(false);
                          }}
                          className="text-[10.5px] px-2 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer border border-rose-200"
                        >
                          + ขาดหลักฐานความสัมพันธ์
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPayerVerificationNote("ภาพถ่ายสลิปไม่ชัดเจน ไม่เห็นยอดเงินหรือวันที่ทำรายการ");
                            setIsPayerInspectionSaved(false);
                          }}
                          className="text-[10.5px] px-2 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer border border-rose-200"
                        >
                          + สลิปไม่ชัดเจน
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Confirmation Button */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {isPayerInspectionSaved ? (
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> บันทึกผลแล้ว
                    </span>
                  ) : (
                    <span>ยังไม่ได้บันทึกผลหมวดนี้</span>
                  )}
                </span>

                <button
                  type="button"
                  onClick={handleSave}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-2xs flex items-center space-x-1.5 ${
                    payerVerificationStatus === 'valid'
                      ? 'bg-[#2e7d32] hover:bg-[#256629] text-white'
                      : 'bg-[#d32f2f] hover:bg-[#b71c1c] text-white'
                  }`}
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>บันทึกผลตรวจหมวดนี้</span>
                </button>
              </div>

            </div>

            {/* Step Navigation Bar at bottom of Left Column */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500">
                  หมวดที่ {activeStep} จาก 5:
                </span>
                <span className="text-xs font-bold text-slate-800">
                  {steps.find(s => s.id === activeStep)?.label}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                  disabled={activeStep <= 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center space-x-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>หมวดก่อนหน้า</span>
                </button>

                {activeStep < 5 && (
                  <button
                    type="button"
                    onClick={() => setActiveStep(prev => Math.min(5, prev + 1))}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold cursor-pointer flex items-center space-x-1"
                  >
                    <span>หมวดถัดไป</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setActiveStep(6)}
                  className="px-4 py-1.5 rounded-lg bg-[#0072b2] hover:bg-blue-700 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <ClipboardCheck className="w-3.5 h-3.5" />
                  <span>ตรวจเสร็จทุกหมวดแล้ว ไปหน้าสรุป & ส่งงาน (Step 6)</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>
        )}

      </div>

      {/* MODAL: Fullscreen Document Viewer */}
      {isDocModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {attachedDocs[currentDocIndex].title}
                </h3>
                <p className="text-xs text-slate-500">
                  รหัสเอกสาร: {attachedDocs[currentDocIndex].code} | สร้างเมื่อ: {attachedDocs[currentDocIndex].date}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDocModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex justify-center p-4 bg-slate-100 rounded-xl overflow-auto max-h-[70vh]">
              {currentDocIndex === 0 ? (
                <div className="w-full max-w-[650px]">
                  <ThaiIdCardGraphic
                    idNumber={idNumber}
                    nameThai={`${prefix} ${firstName} ${lastName}`}
                    nameEng="Miss Tantawan Rungratsameesap"
                    dobThai="24 มี.ค. 2508"
                    dobEng="24 Mar. 1965"
                    address={`${idAddress} แขวง${idSubDistrict} เขต${idDistrict} ${idProvince}`}
                  />
                </div>
              ) : (
                <div className="p-8 text-center text-slate-600 text-sm">
                  {attachedDocs[currentDocIndex].title} - ความละเอียดระดับ HD ตรวจสอบเรียบร้อย
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t text-xs">
              <span className="text-slate-500">
                เอกสารแนบ {currentDocIndex + 1} จาก {attachedDocs.length}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => triggerToast('ดาวน์โหลดไฟล์เอกสารสำเร็จ')}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium cursor-pointer"
                >
                  ดาวน์โหลดเอกสาร
                </button>
                <button
                  type="button"
                  onClick={() => setIsDocModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg bg-[#0072b2] text-white font-semibold cursor-pointer"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
