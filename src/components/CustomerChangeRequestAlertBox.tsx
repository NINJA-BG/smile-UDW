import React from 'react';
import { 
  UserCheck, 
  Headphones, 
  Calendar, 
  Clock, 
  FileText,
  AlertCircle,
  User,
  BellRing
} from 'lucide-react';
import { CustomerChangeRequest } from '../types';

interface CustomerChangeRequestAlertBoxProps {
  changeRequest?: CustomerChangeRequest;
  onApplyChanges?: () => void;
  onSwitchSource?: (source: 'customer' | 'provider' | 'hide') => void;
}

export const CustomerChangeRequestAlertBox: React.FC<CustomerChangeRequestAlertBoxProps> = ({
  changeRequest,
  onSwitchSource
}) => {
  if (!changeRequest || !changeRequest.hasRequest) {
    return null;
  }

  const isCustomer = changeRequest.source.includes('ลูกค้า');
  const noteDetails = changeRequest.details || changeRequest.reason;

  return (
    <div className="bg-white rounded-xl border border-orange-200 p-4 sm:p-5 shadow-2xs space-y-4 mb-4">
      {/* 1. Header: สไตล์เดียวกับกล่องผลการตรวจสอบ (ธีมสีส้ม) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-orange-100 pb-3">
        <div>
          <div className="flex items-center space-x-1.5">
            <BellRing className="w-4 h-4 text-orange-600 shrink-0" />
            <h3 className="text-sm font-bold text-slate-900">
              รายการแจ้งขอแก้ไขข้อมูล
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            แจ้งเตือนก่อนกล่องผลการตรวจสอบ (Customer Change Request)
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Pill Badge เหมือนกล่องผลการตรวจสอบ */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border bg-orange-50 text-orange-800 border-orange-200 whitespace-nowrap">
            <AlertCircle className="w-3.5 h-3.5 text-orange-600 shrink-0" />
            <span>มีรายการขอแก้ไข</span>
          </span>

          {/* ปุ่มสลับตัวอย่างแบบกะทัดรัด ไม่เบียดข้อความ */}
          {onSwitchSource && (
            <div className="flex items-center space-x-1 bg-orange-50/80 p-0.5 rounded-lg border border-orange-100 text-[11px]">
              <button
                type="button"
                onClick={() => onSwitchSource('customer')}
                className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  isCustomer ? 'bg-white text-orange-950 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="ดูตัวอย่างคำขอที่แจ้งโดยลูกค้า"
              >
                ลูกค้าแจ้ง
              </button>
              <button
                type="button"
                onClick={() => onSwitchSource('provider')}
                className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  !isCustomer ? 'bg-white text-orange-950 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="ดูตัวอย่างคำขอที่แจ้งโดยผู้ให้บริการ"
              >
                ผู้ให้บริการแจ้ง
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Main Content Layout: จัดวางแบบ 2 คอลัมน์กว้างขวาง ป้องกันตัวหนังสือเบียดหรือทับซ้อนกัน */}
      <div className="space-y-3">
        {/* ข้อมูล 4 ส่วน จัดเป็น 2 แถว x 2 คอลัมน์ (ไม่อัด 4 คอลัมน์ในที่แคบ) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          
          {/* ช่องที่ 1: ประเภทผู้แจ้ง */}
          <div className="border border-orange-100 rounded-xl p-3 bg-orange-50/40 flex flex-col justify-between">
            <span className="text-[11px] font-medium text-slate-500 block mb-1.5">
              ประเภทผู้แจ้ง
            </span>
            <div className="flex items-center">
              {isCustomer ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-orange-100/90 text-orange-900 border border-orange-200">
                  <UserCheck className="w-3.5 h-3.5 text-orange-700 shrink-0" />
                  <span>ลูกค้า (Customer)</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-900 border border-blue-200">
                  <Headphones className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                  <span>ผู้ให้บริการ (Service Provider)</span>
                </span>
              )}
            </div>
          </div>

          {/* ช่องที่ 2: ชื่อผู้แจ้ง */}
          <div className="border border-orange-100 rounded-xl p-3 bg-orange-50/40 flex flex-col justify-between">
            <span className="text-[11px] font-medium text-slate-500 block mb-1.5">
              ชื่อผู้แจ้ง
            </span>
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-900 font-bold">
                <User className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                <span className="break-words">{changeRequest.requesterName}</span>
              </div>
              {changeRequest.requesterRole && (
                <span className="text-[11px] text-slate-500 block mt-0.5 break-words font-normal">
                  ({changeRequest.requesterRole})
                </span>
              )}
            </div>
          </div>

          {/* ช่องที่ 3: วันที่แจ้ง */}
          <div className="border border-orange-100 rounded-xl p-3 bg-orange-50/40 flex flex-col justify-between">
            <span className="text-[11px] font-medium text-slate-500 block mb-1.5">
              วันที่แจ้ง
            </span>
            <div className="flex items-center gap-2 text-xs text-slate-900 font-bold font-mono">
              <Calendar className="w-4 h-4 text-orange-600 shrink-0" />
              <span>{changeRequest.requestDate}</span>
            </div>
          </div>

          {/* ช่องที่ 4: เวลาที่แจ้ง */}
          <div className="border border-orange-100 rounded-xl p-3 bg-orange-50/40 flex flex-col justify-between">
            <span className="text-[11px] font-medium text-slate-500 block mb-1.5">
              เวลาที่แจ้ง
            </span>
            <div className="flex items-center gap-2 text-xs text-slate-900 font-bold font-mono">
              <Clock className="w-4 h-4 text-orange-600 shrink-0" />
              <span>{changeRequest.requestTime}</span>
            </div>
          </div>

        </div>

        {/* 3. รายละเอียดหมายเหตุที่ขอแจ้ง: เต็มความกว้างด้านล่าง มีระยะห่างที่สบายตา */}
        <div className="border border-orange-100 rounded-xl p-3.5 bg-orange-50/30 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <FileText className="w-4 h-4 text-orange-600 shrink-0" />
            <span>รายละเอียดหมายเหตุที่ขอแจ้ง:</span>
          </div>
          <div className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-orange-200/80 break-words">
            {noteDetails || 'ไม่มีรายละเอียดเพิ่มเติม'}
          </div>
        </div>
      </div>
    </div>
  );
};


