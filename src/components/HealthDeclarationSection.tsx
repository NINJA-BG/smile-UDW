import React, { useState } from 'react';
import { 
  HeartPulse, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Stethoscope, 
  FileSearch, 
  ExternalLink, 
  Save, 
  RefreshCw,
  Info,
  Scale,
  Thermometer,
  Pill,
  Syringe,
  AlertCircle
} from 'lucide-react';
import { UnderwritingCase } from '../types';

export interface HealthQuestionItem {
  id: string;
  number: number;
  category: string;
  title: string;
  description: string;
  disclosedAnswer: 'ไม่มี' | 'มี' | 'ไม่เคย' | 'เคย' | 'ปกติ';
  disclosedDetail?: string;
  underwritingRule: string;
  verifiedStatus: 'verified_pass' | 'requires_attention' | 'verified_fail';
  note?: string;
}

interface HealthDeclarationSectionProps {
  caseItem: UnderwritingCase;
  height: string;
  weight: string;
  bmi: string;
  onOpenHealthDoc: () => void;
  onSaveHealthInspection?: (status: 'valid' | 'requires_aps' | 'invalid', notes: string) => void;
}

export const HealthDeclarationSection: React.FC<HealthDeclarationSectionProps> = ({
  caseItem,
  height,
  weight,
  bmi,
  onOpenHealthDoc,
  onSaveHealthInspection,
}) => {
  // Questions list with high-detail underwriting criteria
  const [questions, setQuestions] = useState<HealthQuestionItem[]>([
    {
      id: 'q1',
      number: 1,
      category: 'ประวัติการนอนโรงพยาบาล & การรักษา',
      title: 'ในระยะเวลา 5 ปีที่ผ่านมา เคยเจ็บป่วย ได้รับบาดเจ็บ หรือเข้ารับการตรวจรักษาในโรงพยาบาลหรือไม่?',
      description: 'รวมถึงการนอนพักรักษาตัวเป็นผู้ป่วยใน (IPD) หรือการตรวจร่างกายเพื่อวินิจฉัยโรคเฉพาะทาง',
      disclosedAnswer: 'ไม่มี',
      disclosedDetail: 'ไม่เคยนอนพักรักษาตัวในโรงพยาบาล หรือผ่าตัดใหญ่ย้อนหลัง 5 ปี (มีเพียงตรวจสุขภาพประจำปีของบริษัท)',
      underwritingRule: 'เกณฑ์มาตรฐาน: หากไม่มีประวัติรักษาหรือแอดมิดเกิน 3 วัน สามารถรับประกันในอัตรามาตรฐาน (Standard)',
      verifiedStatus: 'verified_pass',
    },
    {
      id: 'q2',
      number: 2,
      category: 'โรคร้ายแรง & โรคเรื้อรัง (Critical Illnesses)',
      title: 'เคยได้รับการวินิจฉัย เป็น หรือกำลังรักษา โรคหัวใจ ความดันโลหิตสูง เบาหวาน มะเร็ง ไต ตับ หรือไม่?',
      description: 'รวมถึงโรคระบบหลอดเลือดสมอง โรคเลือด ภูมิแพ้ตัวเอง (SLE) หรือภาวะภูมิคุ้มกันบกพร่อง',
      disclosedAnswer: 'ไม่มี',
      disclosedDetail: 'ปฏิเสธประวัติโรคร้ายแรงทุกกลุ่ม ผลตรวจสุขภาพประจำปีล่าสุดค่าน้ำตาลและไขมันอยู่ในเกณฑ์ปกติ',
      underwritingRule: 'เกณฑ์สำคัญ: ห้ามมีประวัติโรคร้ายแรงระยะวิกฤต ตรวจสอบความสอดคล้องกับผลตรวจเลือด/ปัสสาวะ',
      verifiedStatus: 'verified_pass',
    },
    {
      id: 'q3',
      number: 3,
      category: 'ประวัติการผ่าตัด & อาการรอตรวจรักษา',
      title: 'เคยได้รับการผ่าตัด หรือกำลังรอรับการผ่าตัด หรืออยู่ระหว่างรอผลตรวจวินิจฉัยพิเศษหรือไม่?',
      description: 'เช่น การส่องกล้อง, ตรวจชิ้นเนื้อ (Biopsy), เอ็กซเรย์คอมพิวเตอร์ (CT/MRI), อัลตราซาวด์ผิดปกติ',
      disclosedAnswer: 'ไม่มี',
      disclosedDetail: 'ไม่มีนัดหมายการผ่าตัดหรือการรักษาค้างคา ไม่มีอาการผิดปกติที่แพทย์แนะนำให้ตรวจเพิ่มเติม',
      underwritingRule: 'เกณฑ์มาตรฐาน: กรณีอยู่ระหว่างรอการตรวจวินิจฉัย ต้องระงับการพิจารณาจนกว่าผลตรวจจะออกครบถ้วน',
      verifiedStatus: 'verified_pass',
    },
    {
      id: 'q4',
      number: 4,
      category: 'ประวัติครอบครัว & พันธุกรรม (Family History)',
      title: 'มีบิดา มารดา หรือพี่น้องสายตรง ป่วยหรือเสียชีวิตด้วยโรคร้ายแรงก่อนอายุ 60 ปีหรือไม่?',
      description: 'ได้แก่ โรคมะเร็ง, โรคหัวใจขาดเลือด, โรคถุงน้ำในไต, เบาหวานชนิดพึ่งอินซูลิน',
      disclosedAnswer: 'ไม่มี',
      disclosedDetail: 'บิดา (อายุ 62 ปี) และ มารดา (อายุ 59 ปี) แข็งแรงดี ไม่มีประวัติโรคมะเร็งหรือโรคพันธุกรรมรุนแรง',
      underwritingRule: 'เกณฑ์ทั่วไป: หากมีสมาชิกในครอบครัวเป็นมะเร็งหรือหัวใจก่อนอายุ 50 ปีเกิน 2 ท่าน อาจต้องพิจารณาเงื่อนไขพิเศษ',
      verifiedStatus: 'verified_pass',
    },
    {
      id: 'q5',
      number: 5,
      category: 'ระบบประสาท สุขภาพจิต & พฤติกรรมเสี่ยง',
      title: 'เคยมีอาการชัก โรคหลอดเลือดสมอง โรคทางจิตเวช ซึมเศร้า หรือเสพติดสารเสพติด/แอลกอฮอล์หรือไม่?',
      description: 'รวมถึงประวัติการบำบัดสารเสพติด หรือดื่มแอลกอฮอล์ในปริมาณเสี่ยงต่อตับแข็ง',
      disclosedAnswer: 'ไม่มี',
      disclosedDetail: 'ไม่เคยมีอาการทางจิตเวชหรือการใช้ยาระงับประสาท ดื่มแอลกอฮอล์เฉพาะงานสังสรรค์ ไม่สูบบุหรี่',
      underwritingRule: 'เกณฑ์มาตรฐาน: ไม่สูบบุหรี่และไม่ดื่มเป็นประจำ ได้รับสิทธิส่วนลดเบี้ย Non-Smoker Standard',
      verifiedStatus: 'verified_pass',
    },
    {
      id: 'q6',
      number: 6,
      category: 'ประวัติการขอทำประกันภัยกับบริษัทอื่น',
      title: 'เคยถูกบริษัทประกันชีวิตหรือประกันภัยอื่น ปฏิเสธ เลื่อนรับประกัน หรือเพิ่มเบี้ยพิเศษหรือไม่?',
      description: 'รวมถึงการถูกตัดสิทธิความคุ้มครอง หรือยกเลิกสัญญาเพิ่มเติมสุขภาพในอดีต',
      disclosedAnswer: 'ไม่เคย',
      disclosedDetail: 'ไม่เคยถูกปฏิเสธหรือเพิ่มเบี้ยจากที่ใด มีกรมธรรม์อุบัติเหตุส่วนบุคคล (PA) ปกติกับอีก 1 บริษัท',
      underwritingRule: 'เกณฑ์คัดกรอง: ตรวจสอบข้อมูล TIA / ICIS เพื่อยืนยันว่าไม่มีประวัติ Blacklist หรือแจ้งเท็จ',
      verifiedStatus: 'verified_pass',
    },
    {
      id: 'q7',
      number: 7,
      category: 'ความสมบูรณ์ของร่างกาย & สตรี (เฉพาะหญิง)',
      title: 'มีความพิการ บกพร่องทางร่างกาย หรือกำลังตั้งครรภ์/มีภาวะแทรกซ้อนทางสูตินรีเวชหรือไม่?',
      description: 'รวมถึงภาวะครรภ์เสี่ยงสูง หรือเนื้องอกในมดลูก/รังไข่',
      disclosedAnswer: 'ปกติ',
      disclosedDetail: 'ร่างกายสมบูรณ์ปกติ 100% ไม่มีความพิการ ไม่อยู่ระหว่างตั้งครรภ์ ผลตรวจภายในประจำปีปกติ',
      underwritingRule: 'เกณฑ์มาตรฐาน: ร่างกายสมบูรณ์ปกติ สามารถคุ้มครองแผนสุขภาพมาตรฐานได้เต็มรูปแบบ',
      verifiedStatus: 'verified_pass',
    },
  ]);

  // Underwriter Overall Decision for Health Category
  const [overallStatus, setOverallStatus] = useState<'valid' | 'requires_aps' | 'invalid'>('valid');
  const [underwriterNote, setUnderwriterNote] = useState<string>(
    'ผู้เอาประกันแถลงสุขภาพปกติครบถ้วนทุกข้อ ผลดัชนีมวลกาย BMI 22.0 อยู่ในเกณฑ์มาตรฐาน ไม่พบประวัติโรคร้ายแรงหรือการรักษาใน 5 ปี ข้อมูลตรงกับเอกสารแนบ PHDOC67090000715'
  );
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [filterMode, setFilterMode] = useState<'all' | 'verified' | 'flagged'>('all');

  // Toggle single question check status
  const handleToggleQuestionStatus = (index: number) => {
    setQuestions(prev => {
      const next = [...prev];
      const cur = next[index].verifiedStatus;
      next[index].verifiedStatus = cur === 'verified_pass' ? 'requires_attention' : 'verified_pass';
      return next;
    });
    setIsSaved(false);
  };

  // Mark all pass
  const handleMarkAllPass = () => {
    setQuestions(prev => prev.map(q => ({ ...q, verifiedStatus: 'verified_pass' })));
    setOverallStatus('valid');
    setIsSaved(false);
  };

  const handleSave = () => {
    setIsSaved(true);
    if (onSaveHealthInspection) {
      onSaveHealthInspection(overallStatus, underwriterNote);
    }
  };

  const filteredQuestions = questions.filter(q => {
    if (filterMode === 'verified') return q.verifiedStatus === 'verified_pass';
    if (filterMode === 'flagged') return q.verifiedStatus === 'requires_attention';
    return true;
  });

  // Calculate BMI indicator position & color
  const numBmi = parseFloat(bmi) || 22.0;
  let bmiCategory = 'ปกติ (Standard)';
  let bmiColor = 'text-emerald-700 bg-emerald-50 border-emerald-300';
  if (numBmi < 18.5) {
    bmiCategory = 'น้ำหนักต่ำกว่าเกณฑ์ (Underweight)';
    bmiColor = 'text-amber-700 bg-amber-50 border-amber-300';
  } else if (numBmi >= 23.0 && numBmi < 25.0) {
    bmiCategory = 'น้ำหนักเกินมาตรฐานเล็กน้อย (Overweight)';
    bmiColor = 'text-amber-700 bg-amber-50 border-amber-300';
  } else if (numBmi >= 25.0) {
    bmiCategory = 'เข้าเกณฑ์โรคอ้วน (Obesity)';
    bmiColor = 'text-rose-700 bg-rose-50 border-rose-300';
  }

  return (
    <div className="space-y-4">
      
      {/* 1. TOP HIGHLIGHT: HEALTH STATUS & VITAL METRICS CARD */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        
        {/* Header Title with Action */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-xs">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  หมวดแถลงสุขภาพ (Health Declaration & Medical Screening)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  เกณฑ์มาตรฐาน (Standard Risk)
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                ประวัติสุขภาพ คำแถลงโรคประจำตัว และสัญญาณชีพสำหรับการอนุมัติรับประกันภัย
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onOpenHealthDoc}
              className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-[#0072b2] rounded-lg text-xs font-semibold border border-sky-200 transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
              title="เปิดดูเอกสารใบแถลงสุขภาพแนบที่หน้าต่างขวา"
            >
              <FileSearch className="w-3.5 h-3.5" />
              <span>เปิดตรวจเอกสารใบแถลงสุขภาพ (PHDOC...715)</span>
            </button>
          </div>
        </div>

        {/* 4-Box Key Physical & Vital Metrics (High Readability for Underwriters) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          {/* Metric 1: BMI & Weight/Height */}
          <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-[#0072b2]" />
                ดัชนีมวลกาย (BMI)
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-emerald-100 text-emerald-800">
                ปกติ
              </span>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline space-x-1.5">
                <span className="text-xl font-extrabold text-slate-900 font-mono">{bmi}</span>
                <span className="text-[11px] text-slate-500 font-medium">kg/m²</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                สูง {height} ซม. / หนัก {weight} กก.
              </p>
            </div>
          </div>

          {/* Metric 2: Blood Pressure */}
          <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-rose-500" />
                ความดันโลหิต (BP)
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-emerald-100 text-emerald-800">
                Optimal
              </span>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline space-x-1.5">
                <span className="text-xl font-extrabold text-slate-900 font-mono">120/80</span>
                <span className="text-[11px] text-slate-500 font-medium">mmHg</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                ชีพจร 72 ครั้ง/นาที (สม่ำเสมอ)
              </p>
            </div>
          </div>

          {/* Metric 3: Smoking Habit */}
          <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                ประวัติสูบบุหรี่
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-emerald-100 text-emerald-800">
                Non-Smoker
              </span>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline space-x-1.5">
                <span className="text-base font-bold text-slate-900">ไม่สูบบุหรี่</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                ไม่เคยสูบหรือหยุดมานานกว่า 3 ปี
              </p>
            </div>
          </div>

          {/* Metric 4: Alcohol & Risk Behavior */}
          <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <Pill className="w-3.5 h-3.5 text-indigo-500" />
                สุรา / สารเสพติด
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-emerald-100 text-emerald-800">
                ปลอดภัย
              </span>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline space-x-1.5">
                <span className="text-base font-bold text-slate-900">นานๆ ครั้ง</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                ไม่มีประวัติดื่มเสี่ยง / ไม่ใช้สารเสพติด
              </p>
            </div>
          </div>

        </div>

        {/* Visual BMI Bar Scale */}
        <div className="bg-sky-50/50 rounded-xl p-3 border border-sky-100/80 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#0072b2]" />
              แถบวัดเกณฑ์มาตรฐานดัชนีมวลกายสำหรับคนเอเชีย (Asian BMI Classification):
            </span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${bmiColor}`}>
              ปัจจุบัน: {bmi} ({bmiCategory})
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1 pt-1 text-center text-[10px]">
            <div className="bg-amber-100/80 text-amber-900 py-1 rounded font-medium">
              &lt; 18.5 (ผอม)
            </div>
            <div className="bg-emerald-500 text-white py-1 rounded font-bold shadow-xs ring-2 ring-emerald-600">
              18.5 - 22.9 (ปกติ/มาตรฐาน) ✓
            </div>
            <div className="bg-amber-100/80 text-amber-900 py-1 rounded font-medium">
              23.0 - 24.9 (ท้วม/น้ำหนักเกิน)
            </div>
            <div className="bg-rose-100 text-rose-900 py-1 rounded font-medium">
              ≥ 25.0 (อ้วน / เสี่ยงสูง)
            </div>
          </div>
        </div>

      </div>

      {/* 2. MAIN HEALTH QUESTIONNAIRE CHECKLIST (Crafted for Underwriting Inspection) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        
        {/* Section Title & Filter Controls */}
        <div className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
              <Stethoscope className="w-4 h-4 text-[#0072b2]" />
              <span>รายการคำถามแถลงสุขภาพ (Medical Disclosure Checklist - 7 ข้อ)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              คลิกที่เครื่องหมายตรวจสอบเพื่อเปลี่ยนสถานะการพิจารณาแต่ละข้อ
            </p>
          </div>

          {/* Quick Actions: Filter & Mark All */}
          <div className="flex items-center space-x-2">
            <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs font-medium text-slate-600">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  filterMode === 'all' ? 'bg-[#0072b2] text-white font-semibold' : 'hover:bg-slate-100'
                }`}
              >
                ทั้งหมด (7)
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('verified')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  filterMode === 'verified' ? 'bg-emerald-600 text-white font-semibold' : 'hover:bg-slate-100'
                }`}
              >
                ผ่านเกณฑ์
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('flagged')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  filterMode === 'flagged' ? 'bg-amber-600 text-white font-semibold' : 'hover:bg-slate-100'
                }`}
              >
                มีข้อสังเกต
              </button>
            </div>

            <button
              type="button"
              onClick={handleMarkAllPass}
              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-200 transition-colors cursor-pointer flex items-center space-x-1"
              title="ตั้งค่าให้ผ่านการตรวจสอบครบทุกข้อ"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>ผ่านทุกข้อ</span>
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="divide-y divide-slate-100">
          {filteredQuestions.map((q, idx) => {
            const isPass = q.verifiedStatus === 'verified_pass';

            return (
              <div 
                key={q.id}
                className={`p-4 transition-colors ${
                  isPass ? 'bg-white hover:bg-slate-50/50' : 'bg-amber-50/40 hover:bg-amber-50/70'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  
                  {/* Left: Number + Category + Question Content */}
                  <div className="space-y-1.5 flex-1">
                    
                    <div className="flex items-center space-x-2 flex-wrap">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center font-mono">
                        {q.number}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-slate-100 text-slate-700">
                        {q.category}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        • แบบฟอร์มใบแถลงสุขภาพหน้า 1
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-snug">
                      {q.title}
                    </h4>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      {q.description}
                    </p>

                    {/* Disclosed Answer Box */}
                    <div className="mt-2 pt-2 border-t border-slate-100/80 flex flex-wrap items-start gap-2 bg-slate-50/80 rounded-lg p-2.5">
                      <span className="text-[11px] font-semibold text-slate-500 shrink-0">
                        คำแถลงของลูกค้า:
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {q.disclosedAnswer}
                      </span>
                      <p className="text-xs text-slate-700 flex-1 min-w-[200px]">
                        {q.disclosedDetail}
                      </p>
                    </div>

                    {/* Underwriting Tip / Rule */}
                    <div className="flex items-center space-x-1.5 text-[11px] text-[#0072b2]">
                      <Sparkles className="w-3.5 h-3.5 shrink-0 text-sky-600" />
                      <span>{q.underwritingRule}</span>
                    </div>

                  </div>

                  {/* Right: Verification Toggle Button */}
                  <div className="shrink-0 flex flex-col items-end space-y-2">
                    <button
                      type="button"
                      onClick={() => handleToggleQuestionStatus(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer border shadow-2xs ${
                        isPass 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                          : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100 ring-2 ring-amber-400/30'
                      }`}
                    >
                      {isPass ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>ผ่านการตรวจสอบ</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          <span>มีข้อสังเกต / ต้องตรวจเพิ่ม</span>
                        </>
                      )}
                    </button>

                    <span className="text-[10px] text-slate-400">
                      คลิกเพื่อสลับสถานะ
                    </span>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* 3. UNDERWRITING HEALTH VERIFICATION BOX (MATCHING SYSTEM ARCHITECTURE) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center space-x-1.5">
              <ClipboardCheckIcon className="w-4 h-4 text-[#0072b2]" />
              <h3 className="text-sm font-bold text-slate-900">
                กล่องผลการตรวจสอบหมวดแถลงสุขภาพ (Health Verification Decision)
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              บันทึกผลการประเมินความเสี่ยงทางการแพทย์และผลตรวจเอกสารสุขภาพ
            </p>
          </div>

          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
            overallStatus === 'valid'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
              : overallStatus === 'requires_aps'
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-rose-50 text-rose-700 border-rose-300'
          }`}>
            {overallStatus === 'valid' && (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>แถลงสุขภาพผ่านเกณฑ์ (Standard)</span>
              </>
            )}
            {overallStatus === 'requires_aps' && (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>ขอประวัติเวชระเบียนเพิ่ม (APS)</span>
              </>
            )}
            {overallStatus === 'invalid' && (
              <>
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>ไม่ผ่านเกณฑ์การรับประกัน</span>
              </>
            )}
          </span>
        </div>

        {/* 3 Decision Radio Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Option 1: ผ่านเกณฑ์ (Standard) */}
          <button
            type="button"
            onClick={() => { setOverallStatus('valid'); setIsSaved(false); }}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              overallStatus === 'valid'
                ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20 text-emerald-950 shadow-xs'
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className={`w-4 h-4 ${overallStatus === 'valid' ? 'text-emerald-600' : 'text-slate-400'}`} />
                แถลงสุขภาพผ่านเกณฑ์
              </span>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                overallStatus === 'valid' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300 bg-white'
              }`}>
                {overallStatus === 'valid' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </div>
            <p className="text-[10.5px] mt-1.5 text-slate-500 leading-relaxed">
              ไม่มีประวัติเสี่ยง สุขภาพสมบูรณ์ปกติ รับประกันอัตรา Standard
            </p>
          </button>

          {/* Option 2: ขอประวัติเวชระเบียนเพิ่ม (APS) */}
          <button
            type="button"
            onClick={() => { setOverallStatus('requires_aps'); setIsSaved(false); }}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              overallStatus === 'requires_aps'
                ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-500/20 text-amber-950 shadow-xs'
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <AlertCircle className={`w-4 h-4 ${overallStatus === 'requires_aps' ? 'text-amber-600' : 'text-slate-400'}`} />
                ขอประวัติเวชระเบียน (APS)
              </span>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                overallStatus === 'requires_aps' ? 'border-amber-600 bg-amber-600' : 'border-slate-300 bg-white'
              }`}>
                {overallStatus === 'requires_aps' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </div>
            <p className="text-[10.5px] mt-1.5 text-slate-500 leading-relaxed">
              ส่งคืนตัวแทนเพื่อขอประวัติการรักษาจากโรงพยาบาลเพิ่มเติม
            </p>
          </button>

          {/* Option 3: ไม่ผ่านเกณฑ์ / มีข้อยกเว้น */}
          <button
            type="button"
            onClick={() => { setOverallStatus('invalid'); setIsSaved(false); }}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              overallStatus === 'invalid'
                ? 'border-rose-500 bg-rose-50/80 ring-2 ring-rose-500/20 text-rose-950 shadow-xs'
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <XCircle className={`w-4 h-4 ${overallStatus === 'invalid' ? 'text-rose-600' : 'text-slate-400'}`} />
                ไม่ผ่านเกณฑ์ / ปฏิเสธ
              </span>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                overallStatus === 'invalid' ? 'border-rose-600 bg-rose-600' : 'border-slate-300 bg-white'
              }`}>
                {overallStatus === 'invalid' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </div>
            <p className="text-[10.5px] mt-1.5 text-slate-500 leading-relaxed">
              มีความเสี่ยงทางการแพทย์สูงเกินเกณฑ์ที่จะรับประกันได้
            </p>
          </button>

        </div>

        {/* Remarks & Notes */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            บันทึกความเห็นของผู้พิจารณา (Underwriter Medical Notes)
          </label>
          <textarea
            rows={3}
            value={underwriterNote}
            onChange={(e) => { setUnderwriterNote(e.target.value); setIsSaved(false); }}
            placeholder="ระบุข้อสังเกตทางการแพทย์ เช่น ผลตรวจสุขภาพ ใบรับรองแพทย์ หรือเงื่อนไขที่ต้องการให้ตรวจสอบเพิ่มเติม..."
            className="w-full p-2.5 bg-slate-50/60 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-[#0072b2] focus:ring-1 focus:ring-[#0072b2]"
          />
        </div>

        {/* Save button and status info */}
        <div className="flex items-center justify-between pt-1">
          <div className="text-[11px] text-slate-500">
            {isSaved ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                บันทึกผลการตรวจสอบหมวดสุขภาพเรียบร้อย
              </span>
            ) : (
              <span>* กรุณากดบันทึกเพื่ออัปเดตผลไปยังหน้าสรุป Step 6</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-[#2e7d32] hover:bg-[#256629] text-white text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center space-x-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>บันทึกผลตรวจหมวดสุขภาพ</span>
          </button>
        </div>

      </div>

    </div>
  );
};

function ClipboardCheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="m9 14 2 2 4-4" />
    </svg>
  );
}
