import React from 'react';
import { QueueStatus } from '../types';
import { 
  UserCheck, 
  Clock, 
  ShieldCheck, 
  TrendingUp,
  FileCheck
} from 'lucide-react';

interface StatusCardsRowProps {
  statusCounts: Record<QueueStatus, number>;
  totalCount: number;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
}

export const StatusCardsRow: React.FC<StatusCardsRowProps> = ({
  statusCounts,
  totalCount,
  selectedStatus,
  onSelectStatus,
}) => {
  const cards: {
    status: QueueStatus;
    title: string;
    subTitle: string;
    countStr: string;
    icon: React.ReactNode;
    trend: string;
    progress: number;
    progressBg: string;
    iconBg: string;
    iconColor: string;
    vsMonth: string;
  }[] = [
    {
      status: 'เข้ามาใหม่',
      title: 'ผู้เอาประกันทั้งหมด',
      subTitle: 'ผู้เอาประกันสะสม (เข้ามาใหม่)',
      countStr: (12543 + (statusCounts['เข้ามาใหม่'] || 0)).toLocaleString(),
      icon: <UserCheck className="w-5 h-5" />,
      trend: '+12.5%',
      progress: 75,
      progressBg: 'bg-[#0a66c2]',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      vsMonth: '11,156',
    },
    {
      status: 'รอดำเนินการ',
      title: 'คิวงานรอดำเนินการ',
      subTitle: 'อยู่ระหว่างตรวจ (รอดำเนินการ)',
      countStr: (3842 + (statusCounts['รอดำเนินการ'] || 0)).toLocaleString(),
      icon: <Clock className="w-5 h-5" />,
      trend: '+8.2%',
      progress: 62,
      progressBg: 'bg-emerald-600',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      vsMonth: '3,551',
    },
    {
      status: 'เสร็จสิ้น',
      title: 'พิจารณาเสร็จสิ้น',
      subTitle: 'อนุมัติเรียบร้อย (เสร็จสิ้น)',
      countStr: (9238 + (statusCounts['เสร็จสิ้น'] || 0)).toLocaleString(),
      icon: <ShieldCheck className="w-5 h-5" />,
      trend: '+15.3%',
      progress: 85,
      progressBg: 'bg-amber-600',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      vsMonth: '8,012',
    },
    {
      status: 'ใหม่(แก้ไข)',
      title: 'เบี้ยประกันภัยรวม',
      subTitle: 'พอร์ตเบี้ยรวม (แก้ไข/ทบทวน)',
      countStr: '฿2.4M',
      icon: <TrendingUp className="w-5 h-5" />,
      trend: '+23.1%',
      progress: 90,
      progressBg: 'bg-purple-600',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      vsMonth: '฿1.95M',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const isSelected = selectedStatus === card.status;

        return (
          <div
            key={card.status}
            onClick={() => onSelectStatus(isSelected ? 'ทั้งหมด' : card.status)}
            className={`bg-white rounded-2xl p-5 border transition-all cursor-pointer shadow-2xs hover:shadow-md ${
              isSelected
                ? 'ring-2 ring-[#0a66c2] border-[#0a66c2] bg-blue-50/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            {/* Top row: Icon & Trend Pill (matching image) */}
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.iconBg} ${card.iconColor}`}>
                {card.icon}
              </div>

              <div className="flex items-center space-x-1 text-[11px] font-semibold text-emerald-600">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{card.trend}</span>
              </div>
            </div>

            {/* Middle: Count & Labels */}
            <div className="mt-4">
              <div className="text-2xl font-bold tracking-tight text-slate-900">
                {card.countStr}
              </div>
              <div className="text-xs font-semibold text-slate-700 mt-1">
                {card.title}
              </div>
              <div className="text-[11px] text-slate-400">
                {card.subTitle}
              </div>
            </div>

            {/* Bottom: Progress Bar & vs last month (matching image) */}
            <div className="mt-5 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5 font-medium">
                <span>Progress</span>
                <span className="font-bold text-slate-800">{card.progress}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-1.5 rounded-full ${card.progressBg} transition-all duration-500`}
                  style={{ width: `${card.progress}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2.5">
                <span>vs last month:</span>
                <span className="font-medium text-slate-600">{card.vsMonth}</span>
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
};
