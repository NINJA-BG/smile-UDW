import React from 'react';
import { 
  Download, 
  RefreshCw, 
  ClipboardList, 
  UserCheck, 
  CreditCard, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface HeroWelcomeBannerProps {
  totalCount: number;
  newCount: number;
  totalPremium: number;
  slaRate: number;
  onRefresh: () => void;
  onExport: () => void;
  isRealtimeActive: boolean;
  onToggleRealtime: () => void;
}

export const HeroWelcomeBanner: React.FC<HeroWelcomeBannerProps> = ({
  totalCount,
  newCount,
  totalPremium,
  slaRate,
  onRefresh,
  onExport,
  isRealtimeActive,
  onToggleRealtime,
}) => {
  return (
    <div className="w-full bg-[#0c4d8c] text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-blue-900/40">
      
      {/* Top Welcome Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
            <div className="w-8 h-8 rounded-lg bg-white/15 text-white flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-5 h-5 text-sky-200" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Executive Underwrite Dashboard
            </h2>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-blue-100 border border-white/20">
              พิจารณารับประกันภัยเรียลไทม์
            </span>
          </div>
          <p className="text-xs sm:text-sm text-blue-100/80 mt-1">
            ภาพรวมผลการดำเนินงาน ปริมาณคิวงาน และสถิติการอนุมัติรับประกันภัย
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          
          {/* Live indicator button */}
          <button
            onClick={onToggleRealtime}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
              isRealtimeActive 
                ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200' 
                : 'bg-white/10 border-white/15 text-blue-200 hover:bg-white/20'
            }`}
          >
            <span className="relative flex h-2 w-2">
              {isRealtimeActive && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isRealtimeActive ? 'bg-emerald-400' : 'bg-slate-400'}`}></span>
            </span>
            <span>{isRealtimeActive ? 'Live Monitor' : 'Paused'}</span>
          </button>

          {/* Export button */}
          <button
            onClick={onExport}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 active:bg-white/30 text-white text-xs font-semibold border border-white/20 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          {/* Refresh button */}
          <button
            onClick={onRefresh}
            className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 active:bg-white/30 text-white border border-white/20 transition-colors cursor-pointer"
            title="รีเฟรชข้อมูล"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Embedded 4 Stat Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
        
        {/* Card 1: Today's Applications */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 sm:p-4 border border-white/15 hover:bg-white/15 transition-all">
          <div className="flex items-center space-x-2 text-blue-100 text-xs font-medium">
            <ClipboardList className="w-4 h-4 text-sky-200" />
            <span>ใบคำขอวันนี้ (Applications)</span>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {totalCount}
            </div>
            <div className="text-[11px] font-medium text-blue-200 mt-1">
              +12% จากเมื่อวาน
            </div>
          </div>
        </div>

        {/* Card 2: New Policyholders */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 sm:p-4 border border-white/15 hover:bg-white/15 transition-all">
          <div className="flex items-center space-x-2 text-blue-100 text-xs font-medium">
            <UserCheck className="w-4 h-4 text-sky-200" />
            <span>ผู้เอาประกันใหม่ (Policyholders)</span>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {newCount}
            </div>
            <div className="text-[11px] font-medium text-blue-200 mt-1">
              +8% จากเมื่อวาน
            </div>
          </div>
        </div>

        {/* Card 3: Premium Volume */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 sm:p-4 border border-white/15 hover:bg-white/15 transition-all">
          <div className="flex items-center space-x-2 text-blue-100 text-xs font-medium">
            <CreditCard className="w-4 h-4 text-sky-200" />
            <span>เบี้ยประกันภัยวันนี้ (Premium)</span>
          </div>
          <div className="mt-2.5">
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              ฿{(totalPremium / 1000).toFixed(0)}K
            </div>
            <div className="text-[11px] font-medium text-blue-200 mt-1">
              +18% จากเมื่อวาน
            </div>
          </div>
        </div>

        {/* Card 4: SLA & Approval Rate */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 sm:p-4 border border-white/15 hover:bg-white/15 transition-all">
          <div className="flex items-center space-x-2 text-blue-100 text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 text-sky-200" />
            <span>อัตราอนุมัติตาม SLA (Rate)</span>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {slaRate}%
            </div>
            <div className="text-[11px] font-medium text-blue-200 mt-1">
              +0.4% จากเป้าหมาย
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
