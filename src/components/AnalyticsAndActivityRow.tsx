import React, { useState } from 'react';
import { 
  BarChart3,
  Activity,
  FileCheck2,
  FileText,
  ShieldAlert,
  UserCheck,
  TrendingUp,
  Coins,
  FileSpreadsheet
} from 'lucide-react';
import { UnderwritingCase } from '../types';

interface AnalyticsAndActivityRowProps {
  cases: UnderwritingCase[];
  onSelectCase: (caseItem: UnderwritingCase) => void;
}

export const AnalyticsAndActivityRow: React.FC<AnalyticsAndActivityRowProps> = ({
  cases,
  onSelectCase,
}) => {
  const [activeTab, setActiveTab] = useState<'month' | 'year'>('month');

  // Exact 3 bars from screenshot: January (60%), February (73%), March (80%)
  const revenueBars = [
    { month: 'มกราคม', orders: '842 เคส', percentage: 60, growth: '+12.5%', amount: '฿180K' },
    { month: 'กุมภาพันธ์', orders: '1,024 เคส', percentage: 73, growth: '+22.2%', amount: '฿220K' },
    { month: 'มีนาคม', orders: '1,156 เคส', percentage: 80, growth: '+9.1%', amount: '฿240K' },
  ];

  // Activities styled with formal underwriting events
  const activities = [
    {
      id: 'act-1',
      actor: 'สมศักดิ์ วัฒนา (ตัวแทน)',
      action: 'ยื่นใบคำขอประกันชีวิตสุขภาพใหม่',
      amount: 'เบี้ย ฿45,000',
      time: '2 นาทีที่แล้ว',
      icon: FileText,
      iconBg: 'bg-blue-50 text-blue-600',
      caseItem: cases[0] || null,
    },
    {
      id: 'act-2',
      actor: 'พญ. นภาพร (แพทย์พิจารณา)',
      action: 'อนุมัติผลการตรวจประวัติสุขภาพผ่าน',
      amount: '',
      time: '15 นาทีที่แล้ว',
      icon: FileCheck2,
      iconBg: 'bg-emerald-50 text-emerald-600',
      caseItem: cases[1] || null,
    },
    {
      id: 'act-3',
      actor: 'วิชัย การุณย์ (ผู้ตรวจเอกสาร)',
      action: 'แจ้งจุดตรวจสอบเอกสารสลิปโอนเงิน',
      amount: '',
      time: '32 นาทีที่แล้ว',
      icon: ShieldAlert,
      iconBg: 'bg-amber-50 text-amber-600',
      caseItem: cases[2] || null,
    },
    {
      id: 'act-4',
      actor: 'กนกวรรณ จันทร์เพ็ญ (ผู้พิจารณา)',
      action: 'อนุมัติกรมธรรม์ประกันชีวิตตลอดชีพ',
      amount: 'เบี้ย ฿128,000',
      time: '1 ชั่วโมงที่แล้ว',
      icon: UserCheck,
      iconBg: 'bg-sky-50 text-sky-600',
      caseItem: cases[3] || null,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left Column (2/3): Revenue Analytics */}
      <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
        
        {/* Header with Switcher Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0072b2] flex items-center justify-center border border-blue-100 shrink-0">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                สถิติเบี้ยประกันภัยและการพิจารณา (Underwriting Analytics)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                ตัวชี้วัดประสิทธิภาพรายรับและการอนุมัติรับประกันภัยรายเดือน
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('month')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'month' ? 'bg-[#0072b2] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              เดือนนี้
            </button>
            <button
              onClick={() => setActiveTab('year')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'year' ? 'bg-[#0072b2] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ทั้งปี
            </button>
          </div>
        </div>

        {/* Horizontal Progress Bars */}
        <div className="mt-4 space-y-4">
          {revenueBars.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-slate-800">{item.month}</span>
                  <span className="text-slate-400">· {item.orders}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-emerald-600 font-bold text-[11px]">{item.growth}</span>
                  <span className="font-bold text-slate-900">{item.amount}</span>
                </div>
              </div>

              {/* Progress bar with percentage label inside */}
              <div className="w-full bg-slate-100 rounded-xl h-8 overflow-hidden relative flex items-center">
                <div 
                  className="bg-[#0072b2] h-full rounded-xl transition-all duration-700 flex items-center justify-end pr-3 text-white font-bold text-xs"
                  style={{ width: `${item.percentage}%` }}
                >
                  {item.percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom 4 mini stat blocks with minimal icons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100">
          <div className="bg-slate-50/80 p-3 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">เบี้ยรวม</span>
              <Coins className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-base font-bold text-slate-900 block mt-1">฿640K</span>
            <span className="text-[10px] text-slate-400">Total Premium</span>
          </div>

          <div className="bg-slate-50/80 p-3 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">อัตราเติบโต</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-base font-bold text-slate-900 block mt-1">+18.5%</span>
            <span className="text-[10px] text-slate-400">MoM Growth</span>
          </div>

          <div className="bg-slate-50/80 p-3 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">เฉลี่ย/เดือน</span>
              <BarChart3 className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-base font-bold text-slate-900 block mt-1">฿213K</span>
            <span className="text-[10px] text-slate-400">Avg / Month</span>
          </div>

          <div className="bg-slate-50/80 p-3 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">เคสทั้งหมด</span>
              <FileSpreadsheet className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-base font-bold text-slate-900 block mt-1">3,022</span>
            <span className="text-[10px] text-slate-400">Total Cases</span>
          </div>
        </div>

      </div>

      {/* Right Column (1/3): Live Activity */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
        
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">การเคลื่อนไหวล่าสุด</h3>
                <p className="text-xs text-slate-400">บันทึกเรียลไทม์ (Live Activity)</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live</span>
            </div>
          </div>

          {/* Activity items list */}
          <div className="mt-4 space-y-3.5">
            {activities.map((act) => {
              const Icon = act.icon;

              return (
                <div 
                  key={act.id} 
                  onClick={() => act.caseItem && onSelectCase(act.caseItem)}
                  className="flex items-start space-x-3 p-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border border-slate-100 ${act.iconBg}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-800 leading-snug">
                      <strong className="text-slate-900 group-hover:text-blue-600 transition-colors">{act.actor}</strong> {act.action}
                    </p>
                    {act.amount && (
                      <p className="text-xs font-semibold text-emerald-600 mt-0.5">{act.amount}</p>
                    )}
                    <p className="text-[10px] text-slate-400 mt-0.5">{act.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* View All footer link */}
        <div className="pt-4 border-t border-slate-100 text-center">
          <button 
            onClick={() => {
              if (cases.length > 0) onSelectCase(cases[0]);
            }}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
          >
            ดูประวัติการเคลื่อนไหวทั้งหมด
          </button>
        </div>

      </div>

    </div>
  );
};
