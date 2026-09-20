import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileSearch, 
  Scale, 
  Activity, 
  ShieldCheck, 
  Save, 
  Sparkles,
  Info,
  Stethoscope,
  Clock,
  AlertCircle,
  FileWarning,
  Flame,
  UserCheck
} from 'lucide-react';
import { UnderwritingCase, HealthScenarioType } from '../types';
import { HEALTH_SCENARIOS } from '../data/healthScenarios';

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
  activeScenario?: HealthScenarioType;
  onScenarioChange?: (scenario: HealthScenarioType, vitals: { height: string; weight: string; bmi: string; bp: string; pulse: string }) => void;
}

export const HealthDeclarationSection: React.FC<HealthDeclarationSectionProps> = ({
  caseItem,
  height: initialHeight,
  weight: initialWeight,
  bmi: initialBmi,
  onOpenHealthDoc,
  onSaveHealthInspection,
  activeScenario: propScenario,
  onScenarioChange,
}) => {
  // Determine initial scenario from caseItem healthProfile or props
  const initialScenarioKey: HealthScenarioType = 
    propScenario || 
    caseItem.healthProfile?.scenarioType || 
    (caseItem.requiresSpecialInspection && caseItem.specialInspectionType === 'ประวัติสุขภาพ' 
      ? 'abnormal_surgery_cyst' 
      : 'standard_normal');

  const [currentScenarioKey, setCurrentScenarioKey] = useState<HealthScenarioType>(initialScenarioKey);

  // Active scenario definition
  const activeScenario = HEALTH_SCENARIOS[currentScenarioKey] || HEALTH_SCENARIOS.standard_normal;

  // Local vitals state initialized from active scenario
  const [vitals, setVitals] = useState({
    height: activeScenario.vitals.height || initialHeight || '165',
    weight: activeScenario.vitals.weight || initialWeight || '60',
    bmi: activeScenario.vitals.bmi || initialBmi || '22.0',
    bp: activeScenario.vitals.bp || '120/80',
    pulse: activeScenario.vitals.pulse || '72',
    smoking: activeScenario.vitals.smoking || 'ไม่สูบบุหรี่',
    alcohol: activeScenario.vitals.alcohol || 'ดื่มเฉพาะเข้าสังคม'
  });

  // Questions list for the active scenario
  const [questions, setQuestions] = useState<HealthQuestionItem[]>(activeScenario.questions);

  // Underwriter Overall Decision for Health Category
  const [overallStatus, setOverallStatus] = useState<'valid' | 'requires_aps' | 'invalid'>(activeScenario.defaultStatus);
  const [underwriterNote, setUnderwriterNote] = useState<string>(activeScenario.defaultNote);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [filterMode, setFilterMode] = useState<'all' | 'verified' | 'flagged'>('all');

  // Handle Scenario Switch
  const handleSelectScenario = (scenarioKey: HealthScenarioType) => {
    const sc = HEALTH_SCENARIOS[scenarioKey];
    if (!sc) return;

    setCurrentScenarioKey(scenarioKey);
    setVitals({ ...sc.vitals });
    setQuestions([...sc.questions]);
    setOverallStatus(sc.defaultStatus);
    setUnderwriterNote(sc.defaultNote);
    setIsSaved(false);

    if (onScenarioChange) {
      onScenarioChange(scenarioKey, {
        height: sc.vitals.height,
        weight: sc.vitals.weight,
        bmi: sc.vitals.bmi,
        bp: sc.vitals.bp,
        pulse: sc.vitals.pulse
      });
    }
  };

  // Sync if propScenario changes externally
  useEffect(() => {
    if (propScenario && propScenario !== currentScenarioKey) {
      handleSelectScenario(propScenario);
    }
  }, [propScenario]);

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

  const flaggedCount = questions.filter(q => q.verifiedStatus !== 'verified_pass' || q.disclosedAnswer === 'มี' || q.disclosedAnswer === 'เคย').length;

  const filteredQuestions = questions.filter(q => {
    if (filterMode === 'verified') return q.verifiedStatus === 'verified_pass';
    if (filterMode === 'flagged') return q.verifiedStatus !== 'verified_pass' || q.disclosedAnswer === 'มี' || q.disclosedAnswer === 'เคย';
    return true;
  });

  // Calculate BMI indicator position & color
  const numBmi = parseFloat(vitals.bmi) || 22.0;
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
      
      {/* 0. SCENARIO SELECTOR: SWITCH BETWEEN NORMAL & ABNORMAL HEALTH CASES */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0a2540] to-slate-900 rounded-2xl p-4 text-white shadow-sm border border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-400/40 text-orange-400 flex items-center justify-center font-bold text-xs">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                  เครื่องมือจำลองเคสแถลงสุขภาพ (Health Case Scenarios)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white font-medium border border-white/10">
                  4 รูปแบบเคส
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                เลือกรูปแบบเคสเพื่อตรวจสอบการคัดกรองเคสปกติและเคสผิดปกติทางการแพทย์
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <span className="text-[11px] text-slate-400">กำลังตรวจสอบ:</span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${activeScenario.badgeColor}`}>
              {activeScenario.badgeLabel}
            </span>
          </div>
        </div>

        {/* 4 Scenario Tab Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-3">
          
          {/* Tab 1: Standard Normal */}
          <button
            type="button"
            onClick={() => handleSelectScenario('standard_normal')}
            className={`p-2.5 rounded-xl text-left transition-all cursor-pointer border flex flex-col justify-between ${
              currentScenarioKey === 'standard_normal'
                ? 'bg-emerald-500/20 border-emerald-400 text-white ring-2 ring-emerald-400/30'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                เคสปกติ (Standard)
              </span>
              {currentScenarioKey === 'standard_normal' && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </div>
            <p className="text-[10.5px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
              สุขภาพสมบูรณ์ สัญญาณชีพปกติ รับประกันในอัตรามาตรฐาน
            </p>
          </button>

          {/* Tab 2: Surgery & Cyst (Requires APS) */}
          <button
            type="button"
            onClick={() => handleSelectScenario('abnormal_surgery_cyst')}
            className={`p-2.5 rounded-xl text-left transition-all cursor-pointer border flex flex-col justify-between ${
              currentScenarioKey === 'abnormal_surgery_cyst'
                ? 'bg-amber-500/20 border-amber-400 text-white ring-2 ring-amber-400/30'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                เคสผิดปกติ 1: ผ่าตัดซีสต์
              </span>
              {currentScenarioKey === 'abnormal_surgery_cyst' && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </div>
            <p className="text-[10.5px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
              ผ่าตัดถุงน้ำรังไข่ นอน รพ. 3 วัน ต้องการขอประวัติเวชระเบียน (APS)
            </p>
          </button>

          {/* Tab 3: Hypertension & BMI (Increase Premium) */}
          <button
            type="button"
            onClick={() => handleSelectScenario('abnormal_hypertension_bmi')}
            className={`p-2.5 rounded-xl text-left transition-all cursor-pointer border flex flex-col justify-between ${
              currentScenarioKey === 'abnormal_hypertension_bmi'
                ? 'bg-amber-500/20 border-amber-400 text-white ring-2 ring-amber-400/30'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                เคสผิดปกติ 2: ความดัน & BMI
              </span>
              {currentScenarioKey === 'abnormal_hypertension_bmi' && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </div>
            <p className="text-[10.5px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
              BP 148/94, ทานยาความดัน/ไขมัน, BMI 29.8 และสูบบุหรี่ (+25% EM)
            </p>
          </button>

          {/* Tab 4: Suspected Tumor / Pending Biopsy (Postpone) */}
          <button
            type="button"
            onClick={() => handleSelectScenario('abnormal_tumor_pending')}
            className={`p-2.5 rounded-xl text-left transition-all cursor-pointer border flex flex-col justify-between ${
              currentScenarioKey === 'abnormal_tumor_pending'
                ? 'bg-rose-500/25 border-rose-400 text-white ring-2 ring-rose-400/30'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" />
                เคสผิดปกติ 3: รอผลชิ้นเนื้อ
              </span>
              {currentScenarioKey === 'abnormal_tumor_pending' && (
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
              )}
            </div>
            <p className="text-[10.5px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
              ก้อนเนื้อเต้านม BIRADS 4c รอผลตรวจชิ้นเนื้อ (ระงับรับประกัน Postpone)
            </p>
          </button>

        </div>
      </div>

      {/* 1. TOP HIGHLIGHT: HEALTH STATUS & VITAL METRICS CARD */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        
        {/* Header Title with Action */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
          <div className="flex items-center space-x-2.5">
            <div className={`w-9 h-9 rounded-xl text-white flex items-center justify-center shadow-xs ${
              activeScenario.isAbnormal
                ? activeScenario.id === 'abnormal_tumor_pending'
                  ? 'bg-gradient-to-br from-rose-600 to-red-700'
                  : 'bg-gradient-to-br from-amber-500 to-orange-600'
                : 'bg-gradient-to-br from-[#0072b2] to-blue-700'
            }`}>
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  หมวดแถลงสุขภาพ (Health Declaration & Medical Screening)
                </h2>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${activeScenario.badgeColor}`}>
                  {activeScenario.badgeLabel}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeScenario.tagline}
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
              <span>เปิดตรวจเอกสารใบแถลงสุขภาพ</span>
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
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                numBmi >= 25 ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {numBmi >= 25 ? 'น้ำหนักเกิน' : 'ปกติ'}
              </span>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline space-x-1.5">
                <span className={`text-xl font-extrabold font-mono ${
                  numBmi >= 25 ? 'text-amber-700' : 'text-slate-900'
                }`}>{vitals.bmi}</span>
                <span className="text-[11px] text-slate-500 font-medium">kg/m²</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                สูง {vitals.height} ซม. / หนัก {vitals.weight} กก.
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
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                vitals.bp.startsWith('14') || vitals.bp.startsWith('15')
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {vitals.bp.startsWith('14') || vitals.bp.startsWith('15') ? 'Stage 1 HTN (สูง)' : 'Optimal'}
              </span>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline space-x-1.5">
                <span className={`text-xl font-extrabold font-mono ${
                  vitals.bp.startsWith('14') || vitals.bp.startsWith('15') ? 'text-amber-700' : 'text-slate-900'
                }`}>{vitals.bp}</span>
                <span className="text-[11px] text-slate-500 font-medium">mmHg</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                ชีพจร {vitals.pulse} ครั้ง/นาที (สม่ำเสมอ)
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
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                vitals.smoking.includes('สูบ') && !vitals.smoking.includes('ไม่')
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {vitals.smoking.includes('สูบ') && !vitals.smoking.includes('ไม่') ? 'Smoker Rate' : 'Non-Smoker'}
              </span>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline space-x-1.5">
                <span className={`text-xs sm:text-sm font-bold ${
                  vitals.smoking.includes('สูบ') && !vitals.smoking.includes('ไม่') ? 'text-amber-800' : 'text-slate-900'
                }`}>{vitals.smoking}</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {vitals.smoking.includes('สูบ') && !vitals.smoking.includes('ไม่')
                  ? 'มีผลต่อการคิดอัตราเบี้ยประกันภัย'
                  : 'ไม่เคยสูบหรือหยุดมานานกว่า 3 ปี'}
              </p>
            </div>
          </div>

          {/* Metric 4: Alcohol & Risk Behavior */}
          <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                ดื่มสุรา / พฤติกรรม
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-slate-200 text-slate-700">
                {vitals.alcohol}
              </span>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline space-x-1.5">
                <span className="text-xs sm:text-sm font-bold text-slate-900">{vitals.alcohol}</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                ไม่เคยมีประวัติตับแข็งหรือแอลกอฮอล์ลิซึม
              </p>
            </div>
          </div>

        </div>

        {/* Scenario Alert Notification Card (High Contrast Medical Warning) */}
        <div className={`rounded-xl p-3.5 border ${
          activeScenario.alertBox.theme === 'rose'
            ? 'bg-rose-50/80 border-rose-300 text-rose-950'
            : activeScenario.alertBox.theme === 'amber'
              ? 'bg-amber-50/80 border-amber-300 text-amber-950'
              : 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
        }`}>
          <div className="flex items-start space-x-2.5">
            <div className="p-1 rounded-lg shrink-0 mt-0.5">
              {activeScenario.alertBox.theme === 'rose' ? (
                <XCircle className="w-4 h-4 text-rose-600 animate-pulse" />
              ) : activeScenario.alertBox.theme === 'amber' ? (
                <AlertTriangle className="w-4 h-4 text-amber-700" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-bold text-xs text-slate-900">
                  {activeScenario.alertBox.title}
                </h4>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {activeScenario.alertBox.flags.map((flag, idx) => (
                    <span 
                      key={idx} 
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                        activeScenario.alertBox.theme === 'rose'
                          ? 'bg-white text-rose-800 border-rose-200'
                          : activeScenario.alertBox.theme === 'amber'
                            ? 'bg-white text-amber-900 border-amber-200'
                            : 'bg-white text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {flag}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                {activeScenario.alertBox.description}
              </p>
              <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-xs font-semibold">
                <span className="text-slate-500">คำแนะนำการพิจารณา:</span>
                <span className={activeScenario.alertBox.theme === 'rose' ? 'text-rose-700' : activeScenario.alertBox.theme === 'amber' ? 'text-amber-800' : 'text-emerald-700'}>
                  {activeScenario.alertBox.underwritingAdvice}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 2. DETAILED QUESTIONNAIRE CHECKLIST FOR UNDERWRITERS */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        
        {/* Checklist Sub-Header & Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>รายการคำถามแถลงสุขภาพ 7 ข้อ (Underwriting Questionnaire)</span>
              <span className="text-[11px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
                ครบ 7 ข้อ
              </span>
              {flaggedCount > 0 && (
                <span className="text-[11px] bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full font-bold animate-pulse">
                  มีประวัติ {flaggedCount} ข้อ
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              ตรวจทานคำแถลงของผู้เอาประกันภัยเทียบกับเกณฑ์มาตรฐานและประวัติทางการแพทย์
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs shadow-2xs">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  filterMode === 'all' ? 'bg-[#0072b2] text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ทั้งหมด (7)
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('flagged')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                  filterMode === 'flagged' ? 'bg-amber-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>มีประวัติ/ต้องตรวจ</span>
                {flaggedCount > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    filterMode === 'flagged' ? 'bg-white text-amber-800' : 'bg-amber-100 text-amber-800 font-bold'
                  }`}>
                    {flaggedCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('verified')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  filterMode === 'verified' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ผ่านเกณฑ์
              </button>
            </div>

            <button
              type="button"
              onClick={handleMarkAllPass}
              className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 font-medium transition-colors shadow-2xs cursor-pointer"
            >
              ผ่านเกณฑ์ทั้งหมด
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="divide-y divide-slate-100">
          {filteredQuestions.map((q, idx) => {
            const originalIndex = questions.findIndex(orig => orig.id === q.id);
            const isPass = q.verifiedStatus === 'verified_pass';
            const isAbnormalAnswer = q.disclosedAnswer === 'มี' || q.disclosedAnswer === 'เคย';
            const isCritical = q.verifiedStatus === 'verified_fail';

            return (
              <div 
                key={q.id}
                className={`p-4 transition-colors ${
                  isCritical 
                    ? 'bg-rose-50/40 hover:bg-rose-50/70 border-l-4 border-l-rose-500' 
                    : isAbnormalAnswer
                      ? 'bg-amber-50/40 hover:bg-amber-50/70 border-l-4 border-l-amber-500'
                      : 'hover:bg-slate-50/60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  
                  {/* Left Column: Number, Title & Disclosure */}
                  <div className="space-y-1.5 flex-1">
                    
                    <div className="flex items-center space-x-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10.5px] font-bold shrink-0 ${
                        isCritical
                          ? 'bg-rose-100 text-rose-800'
                          : isAbnormalAnswer
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-blue-100 text-[#0072b2]'
                      }`}>
                        {q.number}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                        {q.category}
                      </span>
                      {isCritical ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                          <XCircle className="w-3 h-3 text-rose-600" />
                          แถลงมีประวัติขั้นวิกฤต (Critical)
                        </span>
                      ) : isAbnormalAnswer ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-700" />
                          แถลงมีประวัติ (Abnormal Disclosed)
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ผ่านเกณฑ์มาตรฐาน
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {q.title}
                    </h4>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      {q.description}
                    </p>

                    {/* Disclosed Answer Box */}
                    <div className={`mt-2 p-2.5 rounded-lg border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                      isCritical
                        ? 'bg-rose-50 border-rose-200 text-rose-950'
                        : isAbnormalAnswer
                          ? 'bg-amber-50 border-amber-200 text-amber-950'
                          : 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                    }`}>
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-1.5 font-bold">
                          <span className="text-slate-600 font-medium">คำแถลงของผู้เอาประกัน:</span>
                          <span className={`px-2 py-0.2 rounded font-extrabold text-[11px] ${
                            isCritical
                              ? 'bg-rose-200 text-rose-900'
                              : isAbnormalAnswer
                                ? 'bg-amber-200 text-amber-900'
                                : 'bg-emerald-200 text-emerald-900'
                          }`}>
                            {q.disclosedAnswer}
                          </span>
                        </div>
                        {q.disclosedDetail && (
                          <p className="text-xs text-slate-700 font-medium pt-0.5 leading-relaxed">
                            {q.disclosedDetail}
                          </p>
                        )}
                      </div>

                      <div className="text-[10px] text-slate-500 shrink-0 self-start sm:self-auto bg-white/70 px-2 py-1 rounded border border-slate-200/60">
                        {q.underwritingRule}
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Toggle Button for Underwriter Check */}
                  <div className="shrink-0 pt-1 sm:pt-0">
                    <button
                      type="button"
                      onClick={() => handleToggleQuestionStatus(originalIndex)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shadow-2xs ${
                        isPass
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                          : isCritical
                            ? 'bg-rose-600 text-white border border-rose-700 hover:bg-rose-700'
                            : 'bg-amber-600 text-white border border-amber-700 hover:bg-amber-700'
                      }`}
                    >
                      {isPass ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>ผ่านเกณฑ์ (Pass)</span>
                        </>
                      ) : isCritical ? (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          <span>ไม่ผ่าน (Fail/Decline)</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>ต้องตรวจประวัติ (Flagged)</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* 3. UNDERWRITER OVERALL HEALTH DECISION & REMARKS */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-[#0072b2]/10 text-[#0072b2] flex items-center justify-center font-bold text-xs">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                สรุปผลการพิจารณาหมวดสุขภาพ (Underwriting Health Assessment)
              </h3>
              <p className="text-[11px] text-slate-500">
                กำหนดสถานะความพร้อมของเอกสารแถลงสุขภาพสำหรับการเสนออนุมัติกรมธรรม์
              </p>
            </div>
          </div>

          <span className="text-[11px] text-slate-400">
            ขั้นตอนที่ 5 จาก 6
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
              ขอประวัติการรักษาจาก รพ. เดิม หรือพิจารณาเพิ่มเบี้ย/ข้อยกเว้น
            </p>
          </button>

          {/* Option 3: ไม่ผ่านเกณฑ์ / ปฏิเสธ / Postpone */}
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
                ไม่ผ่านเกณฑ์ / เลื่อนรับประกัน (Postpone)
              </span>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                overallStatus === 'invalid' ? 'border-rose-600 bg-rose-600' : 'border-slate-300 bg-white'
              }`}>
                {overallStatus === 'invalid' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </div>
            <p className="text-[10.5px] mt-1.5 text-slate-500 leading-relaxed">
              มีความเสี่ยงสูงเกินเกณฑ์ หรืออยู่ระหว่างรอผลตรวจชิ้นเนื้อ
            </p>
          </button>

        </div>

        {/* Quick Preset Note Chips */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              ข้อความสำเร็จรูปสำหรับเคสนี้ (Click to apply):
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {activeScenario.presetNotes.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setUnderwriterNote(preset);
                  setIsSaved(false);
                }}
                className="text-[11px] text-slate-600 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-left"
              >
                + {preset}
              </button>
            ))}
          </div>
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
