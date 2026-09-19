import React from 'react';
import { 
  FilePlus2, 
  ShieldCheck, 
  BarChart3, 
  Settings2,
  Sliders,
  Award
} from 'lucide-react';

interface QuickActionsAndTopAgentsProps {
  onOpenNewCase: () => void;
  onFilterUrgent: () => void;
  onOpenAnalytics: () => void;
  onExportReports: () => void;
}

export const QuickActionsAndTopAgents: React.FC<QuickActionsAndTopAgentsProps> = ({
  onOpenNewCase,
  onFilterUrgent,
  onOpenAnalytics,
  onExportReports,
}) => {
  // Top Agents matching insurance context
  const topSellers = [
    { rank: 1, code: 'WB', name: 'สาขาบางนา (ตัวแทนหลัก)', orders: '1,245 เคส', growth: '+24.5%', revenue: '฿245K', badgeBg: 'bg-[#0072b2] text-white' },
    { rank: 2, code: 'BK', name: 'ศูนย์พิจารณากรุงเทพกลาง', orders: '876 เคส', growth: '+18.2%', revenue: '฿198K', badgeBg: 'bg-slate-700 text-white' },
    { rank: 3, code: 'SB', name: 'สไมล์ โบรคเกอร์ กรุ๊ป', orders: '654 เคส', growth: '+15.7%', revenue: '฿167K', badgeBg: 'bg-emerald-600 text-white' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left (2/3): Quick Actions */}
      <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0072b2] flex items-center justify-center border border-blue-100 shrink-0">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">การดำเนินการด่วน (Quick Actions)</h3>
            <p className="text-xs text-slate-400 mt-0.5">ฟังก์ชันที่ใช้งานบ่อยสำหรับทีมพิจารณารับประกันภัย</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4">
          
          {/* Button 1: Add New Application */}
          <button
            onClick={onOpenNewCase}
            className="p-5 rounded-2xl bg-gradient-to-r from-[#005a92] to-[#0072b2] text-white flex items-center space-x-4 text-left hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <FilePlus2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-sm">สร้างใบคำขอใหม่</div>
              <div className="text-[11px] text-blue-100">บันทึกข้อมูลและนำเข้าคิวงาน</div>
            </div>
          </button>

          {/* Button 2: Urgent / Special Inspection */}
          <button
            onClick={onFilterUrgent}
            className="p-5 rounded-2xl bg-gradient-to-r from-[#059669] to-[#10b981] text-white flex items-center space-x-4 text-left hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-sm">ตรวจเคสเร่งด่วน / พิเศษ</div>
              <div className="text-[11px] text-emerald-100">กรองงานด่วนและเคสมีจุดตรวจสอบ</div>
            </div>
          </button>

          {/* Button 3: View Reports */}
          <button
            onClick={onExportReports}
            className="p-5 rounded-2xl bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white flex items-center space-x-4 text-left hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-sm">รายงานการรับประกันภัย</div>
              <div className="text-[11px] text-orange-100">ส่งออกข้อมูลและสถิติภาพรวม</div>
            </div>
          </button>

          {/* Button 4: Settings */}
          <button
            onClick={onOpenAnalytics}
            className="p-5 rounded-2xl bg-gradient-to-r from-[#6d28d9] to-[#7c3aed] text-white flex items-center space-x-4 text-left hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Settings2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-sm">เกณฑ์และพารามิเตอร์ระบบ</div>
              <div className="text-[11px] text-purple-100">ปรับแต่งกฎและเงื่อนไขการตรวจ</div>
            </div>
          </button>

        </div>
      </div>

      {/* Right (1/3): Top Performance */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200 shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">ตัวแทนและสาขายอดเยี่ยม</h3>
                <p className="text-xs text-slate-400">ผลงานสูงสุดประจำเดือนนี้</p>
              </div>
            </div>
            <button 
              onClick={onExportReports}
              className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              ดูทั้งหมด &gt;
            </button>
          </div>

          <div className="mt-4 space-y-3.5">
            {topSellers.map((seller) => (
              <div key={seller.rank} className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-xl ${seller.badgeBg} font-bold text-xs flex items-center justify-center shadow-xs`}>
                    {seller.code}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{seller.name}</h4>
                    <p className="text-[10px] text-slate-400">
                      {seller.orders} · <span className="text-emerald-600 font-semibold">{seller.growth}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900">{seller.revenue}</div>
                  <div className="text-[10px] text-slate-400">เบี้ยรวม</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support note */}
        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-400">
          คำนวณจากยอดเบี้ยประกันภัยที่ได้รับการอนุมัติเรียบร้อย
        </div>

      </div>

    </div>
  );
};
