import React from 'react';
import { Shield, Sparkles } from 'lucide-react';

interface ThaiIdCardGraphicProps {
  idNumber?: string;
  nameThai?: string;
  nameEng?: string;
  dobThai?: string;
  dobEng?: string;
  address?: string;
  issueDate?: string;
  expiryDate?: string;
  photoUrl?: string;
}

export const ThaiIdCardGraphic: React.FC<ThaiIdCardGraphicProps> = ({
  idNumber = '1 2345 67890 12 3',
  nameThai = 'นาย ตัวอย่าง รักไทย',
  nameEng = 'Mr. Tuayang Rakthai',
  dobThai = '1 ม.ค. 2525',
  dobEng = '1 Jan. 1982',
  address = '123/45 หมู่ที่ 3 ต.คลองสอง อ.คลองหลวง จ.ปทุมธานี',
  issueDate = '1 ม.ค. 2565',
  expiryDate = '31 ธ.ค. 2573',
  photoUrl,
}) => {
  return (
    <div className="relative w-full max-w-[480px] aspect-[1.586] rounded-xl overflow-hidden shadow-md border border-slate-300 bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 text-slate-800 select-none font-sans">
      
      {/* Background Microprint & Watermark Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.14] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#0072b2 1px, transparent 1px), radial-gradient(#0a4f82 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
          backgroundPosition: '0 0, 8px 8px'
        }}
      />

      {/* Thai Flag Stripe top banner */}
      <div className="h-1.5 w-full flex">
        <div className="h-full w-1/5 bg-red-600"></div>
        <div className="h-full w-1/5 bg-white"></div>
        <div className="h-full w-1/5 bg-blue-800"></div>
        <div className="h-full w-1/5 bg-white"></div>
        <div className="h-full w-1/5 bg-red-600"></div>
      </div>

      <div className="p-3 sm:p-4 h-[calc(100%-6px)] flex flex-col justify-between relative z-10">
        
        {/* Top Header: Garuda + Title */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {/* Garuda Emblem placeholder */}
            <div className="w-8 h-8 rounded-full bg-red-700 text-amber-300 flex items-center justify-center font-bold text-[11px] shadow-2xs border border-red-800">
              <Shield className="w-4 h-4 fill-amber-300" />
            </div>
            <div>
              <div className="text-[11px] sm:text-xs font-bold text-blue-900 tracking-wide">
                บัตรประจำตัวประชาชน Thai National ID Card
              </div>
              <div className="text-[8px] sm:text-[9px] text-slate-500 font-medium">
                กรมการปกครอง กระทรวงมหาดไทย
              </div>
            </div>
          </div>

          {/* Micro chip hologram label */}
          <div className="flex items-center space-x-1 text-[8px] sm:text-[9px] font-semibold text-blue-800 bg-white/70 px-1.5 py-0.5 rounded border border-blue-200">
            <Sparkles className="w-2.5 h-2.5 text-amber-500" />
            <span>Smart Card</span>
          </div>
        </div>

        {/* Card Body: Chip + ID Number + Details + Photo */}
        <div className="grid grid-cols-12 gap-2 mt-1 items-start">
          
          {/* Left Column (Smart Chip + Barcode) */}
          <div className="col-span-3 flex flex-col items-center justify-center pt-1">
            {/* Gold Smart Chip */}
            <div className="w-11 h-9 rounded bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-500 shadow-inner relative flex flex-col justify-around p-1">
              <div className="w-full h-0.5 bg-amber-700/60 rounded"></div>
              <div className="w-full h-0.5 bg-amber-700/60 rounded"></div>
              <div className="w-full h-0.5 bg-amber-700/60 rounded"></div>
            </div>
            
            {/* Laser hologram circle */}
            <div className="w-7 h-7 rounded-full mt-2 bg-gradient-to-tr from-cyan-300 via-pink-300 to-amber-200 opacity-60 border border-white flex items-center justify-center text-[7px] text-slate-700 font-bold">
              BORA
            </div>
          </div>

          {/* Center Details Column */}
          <div className="col-span-6 space-y-1 text-left">
            {/* ID Number */}
            <div>
              <div className="text-[8px] text-slate-500 uppercase font-semibold tracking-wider">
                เลขประจำตัวประชาชน Identification Number
              </div>
              <div className="text-xs sm:text-sm font-extrabold tracking-wider text-slate-900 font-mono">
                {idNumber}
              </div>
            </div>

            {/* Name Thai & Eng */}
            <div className="pt-0.5">
              <div className="text-[8px] text-slate-500">
                ชื่อตัวและชื่อสกุล Name - Last name
              </div>
              <div className="text-[11px] sm:text-xs font-bold text-blue-950">
                {nameThai}
              </div>
              <div className="text-[9px] sm:text-[10px] text-slate-600 font-medium font-mono">
                {nameEng}
              </div>
            </div>

            {/* Date of birth */}
            <div className="flex items-center space-x-2 text-[8px] sm:text-[9px] pt-0.5">
              <div>
                <span className="text-slate-500">เกิดวันที่: </span>
                <span className="font-bold text-slate-900">{dobThai}</span>
              </div>
              <div>
                <span className="text-slate-500">DOB: </span>
                <span className="font-semibold text-slate-800">{dobEng}</span>
              </div>
            </div>

            {/* Address */}
            <div className="text-[8px] sm:text-[9px] text-slate-700 leading-tight pt-0.5">
              <span className="text-slate-500">ที่อยู่: </span>
              <span className="font-medium">{address}</span>
            </div>
          </div>

          {/* Right Column: Citizen Photo */}
          <div className="col-span-3 flex flex-col items-center">
            <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-md border-2 border-white shadow-sm overflow-hidden bg-gradient-to-b from-sky-200 to-blue-300 relative flex items-end justify-center">
              {photoUrl ? (
                <img 
                  src={photoUrl} 
                  alt="Citizen" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-end pb-1 text-center bg-blue-100">
                  <div className="w-8 h-8 rounded-full bg-slate-300 mb-1 border border-slate-400"></div>
                  <div className="w-12 h-8 rounded-t-xl bg-slate-400"></div>
                </div>
              )}
              {/* Embossed stamp indicator */}
              <div className="absolute top-1 right-1 w-4 h-4 rounded-full border border-red-500/50 flex items-center justify-center text-[6px] text-red-600 font-bold">
                ✓
              </div>
            </div>
            <div className="text-[7px] text-slate-400 mt-1 font-mono">
              BORA-7729-DOPA
            </div>
          </div>

        </div>

        {/* Footer: Issue and Expiry dates */}
        <div className="flex items-center justify-between pt-1 border-t border-blue-200/60 text-[7px] sm:text-[8px] text-slate-600">
          <div>
            <span>วันออกบัตร: </span>
            <span className="font-semibold text-slate-800">{issueDate}</span>
          </div>
          <div className="font-mono text-[7px] tracking-widest text-slate-400">
            |||| || | |||| ||| || ||||
          </div>
          <div>
            <span>บัตรหมดอายุ: </span>
            <span className="font-semibold text-slate-800">{expiryDate}</span>
          </div>
        </div>

      </div>

    </div>
  );
};
