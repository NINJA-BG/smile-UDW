import React, { useState } from 'react';
import { UnderwritingCase, InsuranceType, CoverageTerm, QueueStatus } from '../types';
import { X, Plus, Shield, CheckCircle } from 'lucide-react';
import { INSURANCE_TYPES, COVERAGE_TERMS } from '../data/mockData';

interface NewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newCase: Omit<UnderwritingCase, 'id'>) => void;
}

export const NewCaseModal: React.FC<NewCaseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const randomRef = `UW-2568-${Math.floor(10000 + Math.random() * 90000)}`;
  const randomPol = `POL-6803${Math.floor(1000 + Math.random() * 9000)}`;

  const [refNo, setRefNo] = useState(randomRef);
  const [policyNo, setPolicyNo] = useState(randomPol);
  const [insuranceType, setInsuranceType] = useState<InsuranceType>('ประกันสุขภาพ (Health)');
  const [coverageTerm, setCoverageTerm] = useState<CoverageTerm>('รายปี (Annual)');
  const [insuredName, setInsuredName] = useState('');
  const [insuredAge, setInsuredAge] = useState(35);
  const [insuredGender, setInsuredGender] = useState<'ชาย' | 'หญิง'>('ชาย');
  const [insuredOccupation, setInsuredOccupation] = useState('พนักงานบริษัท (ระดับ 1)');
  const [insuredIdCard, setInsuredIdCard] = useState('1-1002-99812-44-1');
  const [payerName, setPayerName] = useState('');
  const [payerRelation, setPayerRelation] = useState('ตนเอง (Self)');
  const [agentName, setAgentName] = useState('นายสมเกียรติ ยิ่งยืนยง');
  const [agentCode, setAgentCode] = useState('AG-88210');
  const [agentBranch, setAgentBranch] = useState('สาขาอโศก-สุขุมวิท');
  const [agentPhone, setAgentPhone] = useState('089-123-4567');
  const [sumAssured, setSumAssured] = useState(1500000);
  const [premium, setPremium] = useState(38000);
  const [dueDate, setDueDate] = useState('2026-09-20');
  const [status, setStatus] = useState<QueueStatus>('เข้ามาใหม่');
  const [remarks, setRemarks] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!insuredName.trim()) {
      alert('กรุณากรอกชื่อผู้เอาประกันภัย');
      return;
    }

    const finalPayerName = payerName.trim() ? payerName.trim() : insuredName.trim();

    onSubmit({
      refNo,
      policyNo,
      insuranceType,
      coverageTerm,
      insuredName: insuredName.trim(),
      insuredAge: Number(insuredAge),
      insuredGender,
      insuredOccupation,
      insuredIdCard,
      payerName: finalPayerName,
      payerRelation,
      agentName,
      agentCode,
      agentBranch,
      agentPhone,
      dueDate,
      submittedDate: '2026-09-18 11:30',
      status,
      sumAssured: Number(sumAssured),
      premium: Number(premium),
      riskLevel: 'ต่ำ (Standard)',
      underwriterAssigned: 'ภานุวัฒน์ สินเจริญ (UW-02)',
      healthConditions: ['ไม่มีประวัติการรักษาร้ายแรง'],
      documents: [
        { id: 'd-1', name: 'ใบคำขอเอาประกันภัยฉบับสมบูรณ์', type: 'PDF', status: 'ครบถ้วน', uploadDate: '2026-09-18 11:30' },
        { id: 'd-2', name: 'สำเนาบัตรประชาชนผู้เอาประกัน', type: 'PDF', status: 'ครบถ้วน', uploadDate: '2026-09-18 11:30' },
      ],
      history: [
        {
          id: `h-${Date.now()}`,
          timestamp: '2026-09-18 11:30',
          actor: `${agentName} (${agentCode})`,
          role: 'ตัวแทน',
          action: 'ส่งขออนุมัติพิจารณา',
          note: remarks || 'ยื่นคำขอใหม่ผ่านระบบ SmileUnderwrite Portal'
        }
      ],
      remarks,
      isUrgent,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                สร้างรายการส่งขออนุมัติพิจารณาใหม่
              </h3>
              <p className="text-xs text-slate-500">
                เพิ่มคิวงานพิจารณารับประกันภัยเข้าสู่ระบบ SmileUnderwrite
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                เลขอ้างอิง (Ref No.)
              </label>
              <input
                type="text"
                value={refNo}
                onChange={(e) => setRefNo(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 font-mono text-slate-800"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                เลขกรมธรรม์ (Policy No.)
              </label>
              <input
                type="text"
                value={policyNo}
                onChange={(e) => setPolicyNo(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 font-mono text-slate-800"
                required
              />
            </div>
          </div>

          {/* Insurance Type & Coverage Term */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ประเภทประกัน *
              </label>
              <select
                value={insuranceType}
                onChange={(e) => setInsuranceType(e.target.value as InsuranceType)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-800 cursor-pointer"
              >
                {INSURANCE_TYPES.filter(t => t !== 'ทั้งหมด').map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                งวดความคุ้มครอง *
              </label>
              <select
                value={coverageTerm}
                onChange={(e) => setCoverageTerm(e.target.value as CoverageTerm)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-800 cursor-pointer"
              >
                {COVERAGE_TERMS.filter(t => t !== 'ทั้งหมด').map((term) => (
                  <option key={term} value={term}>
                    {term}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Insured Details */}
          <div className="border-t border-slate-100 pt-3">
            <h4 className="text-xs font-bold text-slate-900 mb-2">ข้อมูลผู้เอาประกันภัยและผู้ชำระเบี้ย</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ชื่อ-นามสกุล ผู้เอาประกันภัย *
                </label>
                <input
                  type="text"
                  placeholder="เช่น นายธนวัฒน์ เจริญผล"
                  value={insuredName}
                  onChange={(e) => setInsuredName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ชื่อผู้ชำระเบี้ย (ถ้าคนละคน)
                </label>
                <input
                  type="text"
                  placeholder="เว้นว่างไว้หากเป็นตนเอง"
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  อายุ (ปี)
                </label>
                <input
                  type="number"
                  value={insuredAge}
                  onChange={(e) => setInsuredAge(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ความสัมพันธ์ผู้ชำระเบี้ย
                </label>
                <input
                  type="text"
                  value={payerRelation}
                  onChange={(e) => setPayerRelation(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Sum Assured, Premium & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ทุนประกันภัย (บาท)
              </label>
              <input
                type="number"
                value={sumAssured}
                onChange={(e) => setSumAssured(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                เบี้ยประกันภัย (บาท)
              </label>
              <input
                type="number"
                value={premium}
                onChange={(e) => setPremium(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                วันที่ครบกำหนด (Due Date)
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-800 cursor-pointer"
              />
            </div>
          </div>

          {/* Initial Status & Urgent checkbox */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center border-t border-slate-100 pt-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                สถานะแรกเข้า
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as QueueStatus)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-800 cursor-pointer"
              >
                <option value="เข้ามาใหม่">เข้ามาใหม่</option>
                <option value="รอดำเนินการ">รอดำเนินการ</option>
                <option value="ใหม่(แก้ไข)">ใหม่(แก้ไข)</option>
                <option value="รอดำเนินการ(แก้ไข)">รอดำเนินการ(แก้ไข)</option>
                <option value="เสร็จสิ้น">เสร็จสิ้น</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 pt-4">
              <input
                type="checkbox"
                id="urgent-check"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
              />
              <label htmlFor="urgent-check" className="text-xs font-medium text-slate-800 cursor-pointer">
                เป็นรายการเร่งด่วนพิเศษ (Urgent SLA)
              </label>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              หมายเหตุเพิ่มเติม
            </label>
            <textarea
              rows={2}
              placeholder="ระบุข้อความหรือเงื่อนไขสำคัญ..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-800"
            ></textarea>
          </div>

          {/* Footer actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
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
              <CheckCircle className="w-4 h-4" />
              <span>บันทึกส่งเข้าคิวงาน</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
