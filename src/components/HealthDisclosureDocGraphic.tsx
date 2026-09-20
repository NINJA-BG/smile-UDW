import React from 'react';
import { HeartPulse, Check, ShieldCheck, Stethoscope } from 'lucide-react';

interface HealthDisclosureDocGraphicProps {
  insuredName: string;
  insuredIdCard: string;
  dob: string;
  age: number | string;
  height: string;
  weight: string;
  bmi: string;
  bp?: string;
  pulse?: string;
  isFullScreen?: boolean;
}

export const HealthDisclosureDocGraphic: React.FC<HealthDisclosureDocGraphicProps> = ({
  insuredName,
  insuredIdCard,
  dob,
  age,
  height,
  weight,
  bmi,
  bp = '120/80',
  pulse = '72',
  isFullScreen = false,
}) => {
  return (
    <div className={`w-full ${isFullScreen ? 'max-w-2xl' : 'max-w-[440px]'} bg-white text-slate-800 rounded-xl p-4 sm:p-5 border-2 border-slate-300 shadow-md font-sans select-none flex flex-col justify-between space-y-3`}>
      
      {/* Header with SiamSmile emblem */}
      <div className="border-b-2 border-blue-900 pb-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-[#0072b2] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              SS
            </div>
            <div>
              <div className="text-[11px] sm:text-xs font-extrabold text-blue-950 uppercase tracking-tight">
                บมจ. สยามสไมล์ประกันภัย
              </div>
              <div className="text-[8.5px] text-slate-500 font-medium">
                SiamSmile Insurance Public Company Limited
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[9px] font-mono font-bold bg-blue-50 text-[#0072b2] px-2 py-0.5 rounded border border-blue-200">
              PHDOC67090000715
            </span>
            <div className="text-[8px] text-slate-400 mt-0.5">แบบฟอร์ม มฐ.69/2</div>
          </div>
        </div>

        <div className="text-center mt-1.5 pt-1.5 border-t border-slate-100">
          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
            ใบแถลงสุขภาพและผลตรวจคัดกรองทางการแพทย์
          </h4>
          <p className="text-[9px] text-slate-500">
            (Medical Health Disclosure & Physical Screening Certificate)
          </p>
        </div>
      </div>

      {/* Insured Basic & Physical Info Grid */}
      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[10px] space-y-1.5">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-slate-500">ผู้ขอเอาประกัน:</span>{' '}
            <strong className="text-slate-900 font-semibold">{insuredName}</strong>
          </div>
          <div>
            <span className="text-slate-500">เลขประจำตัว:</span>{' '}
            <strong className="text-slate-900 font-mono">{insuredIdCard}</strong>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-slate-500">วันเกิด / อายุ:</span>{' '}
            <span className="text-slate-800">{dob} ({age} ปี)</span>
          </div>
          <div>
            <span className="text-slate-500">เพศ:</span>{' '}
            <span className="text-slate-800">หญิง</span>
          </div>
        </div>

        {/* Vitals Strip */}
        <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between text-[9.5px] text-slate-700 bg-white/70 p-1.5 rounded">
          <div>
            ส่วนสูง: <strong className="text-slate-900">{height}</strong> ซม.
          </div>
          <div>
            น้ำหนัก: <strong className="text-slate-900">{weight}</strong> กก.
          </div>
          <div>
            BMI: <strong className="text-[#0072b2] font-mono font-bold">{bmi}</strong> (ปกติ)
          </div>
          <div>
            ความดัน: <strong className="text-slate-900 font-mono">{bp}</strong>
          </div>
          <div>
            ชีพจร: <strong className="text-slate-900 font-mono">{pulse}</strong> bpm
          </div>
        </div>
      </div>

      {/* Questionnaire Quick Table */}
      <div className="text-[9px] sm:text-[9.5px] space-y-1 border border-slate-200 rounded-lg p-2 bg-white">
        <div className="font-bold text-slate-700 pb-1 border-b border-slate-100 flex items-center justify-between">
          <span>ข้อคำถามแถลงสุขภาพ (Medical Disclosures)</span>
          <span className="text-emerald-700 font-semibold text-[8.5px]">แถลงปฏิเสธ (ไม่มี)</span>
        </div>

        <div className="space-y-1 pt-1 text-slate-600">
          <div className="flex items-center justify-between">
            <span className="truncate pr-2">1. เจ็บป่วยหรือนอนพักรักษาในโรงพยาบาลใน 5 ปี</span>
            <span className="text-emerald-700 font-bold shrink-0 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              [✓] ไม่มี
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="truncate pr-2">2. โรคร้ายแรง หัวใจ เบาหวาน มะเร็ง ไต ตับ</span>
            <span className="text-emerald-700 font-bold shrink-0 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              [✓] ไม่มี
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="truncate pr-2">3. มีนัดหมายผ่าตัด หรือรอผลชิ้นเนื้อ/วินิจฉัย</span>
            <span className="text-emerald-700 font-bold shrink-0 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              [✓] ไม่มี
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="truncate pr-2">4. ประวัติครอบครัวสายตรงโรคร้ายแรงก่อนอายุ 60</span>
            <span className="text-emerald-700 font-bold shrink-0 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              [✓] ไม่มี
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="truncate pr-2">5. ประวัติสูบบุหรี่ ดื่มสุราเสี่ยง หรือสารเสพติด</span>
            <span className="text-emerald-700 font-bold shrink-0 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              [✓] ไม่เสี่ยง
            </span>
          </div>
        </div>
      </div>

      {/* Footer: Medical Endorsement & Stamp */}
      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[8px] sm:text-[9px] text-slate-500">
        <div className="flex items-center space-x-1.5">
          <div className="w-8 h-8 rounded-full border-2 border-dashed border-[#0072b2] text-[#0072b2] flex items-center justify-center font-bold text-[7px] leading-tight text-center">
            SS<br/>MED
          </div>
          <div>
            <div className="font-semibold text-slate-700">พญ. กนกพร สิริเวชพงษ์</div>
            <div>ว.44192 • เวชปฏิบัติทั่วไป</div>
          </div>
        </div>

        <div className="text-right">
          <div className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>ผ่านเกณฑ์มาตรฐาน Standard</span>
          </div>
          <div className="text-[7.5px] text-slate-400 mt-0.5">
            ตรวจรับรองเมื่อ: 16-07-2569
          </div>
        </div>
      </div>

    </div>
  );
};
