import React from 'react';
import { 
  ShieldCheck, 
  Clock, 
  Bell, 
  Plus, 
  RefreshCw, 
  UserCheck, 
  FileText
} from 'lucide-react';

interface HeaderProps {
  onOpenNewCase: () => void;
  onRefresh: () => void;
  isRealtimeActive: boolean;
  onToggleRealtime: () => void;
  lastUpdatedTime: string;
  totalQueueCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewCase,
  onRefresh,
  isRealtimeActive,
  onToggleRealtime,
  lastUpdatedTime,
  totalQueueCount,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#0072b2] text-white flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">SmileUnderwrite</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-[#0072b2] border border-sky-200">
                  ระบบติดตามคิวงาน
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                ระบบตรวจสอบรายการส่งขออนุมัติและมอนิเตอร์คิวงานพิจารณารับประกันภัยแบบเรียลไทม์
              </p>
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-3">
            
            {/* Realtime Live Pulse Switch */}
            <button
              onClick={onToggleRealtime}
              title={isRealtimeActive ? "ปิดระบบอัปเดตอัตโนมัติ" : "เปิดระบบอัปเดตอัตโนมัติ"}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                isRealtimeActive 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="relative flex h-2.5 w-2.5">
                {isRealtimeActive && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isRealtimeActive ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
              </span>
              <span className="hidden md:inline">
                {isRealtimeActive ? 'มอนิเตอร์เรียลไทม์ (Live)' : 'หยุดมอนิเตอร์'}
              </span>
            </button>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="รีเฟรชข้อมูลคิวงาน"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors relative cursor-pointer"
                title="การแจ้งเตือนงานเร่งด่วน"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
              </button>
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            {/* Underwriter badge */}
            <div className="hidden lg:flex items-center space-x-2 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <div>
                <span className="font-semibold text-slate-800">ภานุวัฒน์ (UW-02)</span>
                <span className="text-slate-400 ml-1">· เวรพิจารณาวันนี้</span>
              </div>
            </div>

            {/* New Application Submission Button */}
            <button
              onClick={onOpenNewCase}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline">ส่งขออนุมัติใหม่</span>
              <span className="xs:hidden">เพิ่ม</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
