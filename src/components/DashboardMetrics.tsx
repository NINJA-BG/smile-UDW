import React from 'react';
import { QueueStatus } from '../types';
import { 
  Inbox, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileEdit,
  Flame,
  Layers
} from 'lucide-react';

interface DashboardMetricsProps {
  statusCounts: Record<QueueStatus, number>;
  totalCount: number;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  urgentCount: number;
  dueTodayCount: number;
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  statusCounts,
  totalCount,
  selectedStatus,
  onSelectStatus,
  urgentCount,
  dueTodayCount,
}) => {
  const cards: {
    status: QueueStatus;
    title: string;
    englishTitle: string;
    count: number;
    icon: React.ReactNode;
    color: string;
    borderActive: string;
    bgHover: string;
    badgeBg: string;
    description: string;
  }[] = [
    {
      status: 'เข้ามาใหม่',
      title: 'เข้ามาใหม่',
      englishTitle: 'New Inflow',
      count: statusCounts['เข้ามาใหม่'] || 0,
      icon: <Inbox className="w-5 h-5 text-blue-600" />,
      color: 'text-blue-700 bg-blue-50 border-blue-200',
      borderActive: 'ring-2 ring-blue-500 border-blue-500 bg-blue-50/40',
      bgHover: 'hover:border-blue-300 hover:shadow-sm',
      badgeBg: 'bg-blue-100 text-blue-800',
      description: 'คิวงานใหม่รอจัดสรรและเริ่มตรวจ'
    },
    {
      status: 'รอดำเนินการ',
      title: 'รอดำเนินการ',
      englishTitle: 'In Progress',
      count: statusCounts['รอดำเนินการ'] || 0,
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      color: 'text-amber-700 bg-amber-50 border-amber-200',
      borderActive: 'ring-2 ring-amber-500 border-amber-500 bg-amber-50/40',
      bgHover: 'hover:border-amber-300 hover:shadow-sm',
      badgeBg: 'bg-amber-100 text-amber-800',
      description: 'อยู่ระหว่างพิจารณา/ตรวจผลการแพทย์'
    },
    {
      status: 'เสร็จสิ้น',
      title: 'เสร็จสิ้น',
      englishTitle: 'Completed',
      count: statusCounts['เสร็จสิ้น'] || 0,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      borderActive: 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/40',
      bgHover: 'hover:border-emerald-300 hover:shadow-sm',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      description: 'อนุมัติ/ปฏิเสธ/ออกเล่มเสร็จสิ้น'
    },
    {
      status: 'ใหม่(แก้ไข)',
      title: 'ใหม่ (แก้ไข)',
      englishTitle: 'Revised - New',
      count: statusCounts['ใหม่(แก้ไข)'] || 0,
      icon: <AlertCircle className="w-5 h-5 text-purple-600" />,
      color: 'text-purple-700 bg-purple-50 border-purple-200',
      borderActive: 'ring-2 ring-purple-500 border-purple-500 bg-purple-50/40',
      bgHover: 'hover:border-purple-300 hover:shadow-sm',
      badgeBg: 'bg-purple-100 text-purple-800',
      description: 'ตัวแทนส่งเอกสารแก้ไขรอบใหม่เข้ามา'
    },
    {
      status: 'รอดำเนินการ(แก้ไข)',
      title: 'รอดำเนินการ (แก้ไข)',
      englishTitle: 'Revised - Pending',
      count: statusCounts['รอดำเนินการ(แก้ไข)'] || 0,
      icon: <FileEdit className="w-5 h-5 text-rose-600" />,
      color: 'text-rose-700 bg-rose-50 border-rose-200',
      borderActive: 'ring-2 ring-rose-500 border-rose-500 bg-rose-50/40',
      bgHover: 'hover:border-rose-300 hover:shadow-sm',
      badgeBg: 'bg-rose-100 text-rose-800',
      description: 'อยู่ระหว่างตรวจทานเอกสารแก้ไขเพิ่มเติม'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Overview Status Bar with Quick Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            แดชบอร์ดมอนิเตอร์สถานะคิวงานแบบเรียลไทม์
          </h2>
          <p className="text-xs text-slate-500">
            คลิกที่การ์ดเพื่อกรองคิวงานในตารางตามสถานะทันที (คลิกซ้ำเพื่อดูทั้งหมด)
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Total Queues button */}
          <button
            onClick={() => onSelectStatus('ทั้งหมด')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
              selectedStatus === 'ทั้งหมด' || selectedStatus === ''
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            คิวทั้งหมด: <span className="font-bold ml-1">{totalCount}</span> รายการ
          </button>

          {/* Urgent count pill */}
          {urgentCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              <Flame className="w-3.5 h-3.5 text-rose-600" />
              <span>ด่วนพิเศษ: <strong>{urgentCount}</strong></span>
            </div>
          )}

          {/* Due Today pill */}
          {dueTodayCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>ครบกำหนดวันนี้: <strong>{dueTodayCount}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* 5 Core Status Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {cards.map((card) => {
          const isSelected = selectedStatus === card.status;
          const percentage = totalCount > 0 ? Math.round((card.count / totalCount) * 100) : 0;

          return (
            <div
              key={card.status}
              onClick={() => {
                if (isSelected) {
                  onSelectStatus('ทั้งหมด');
                } else {
                  onSelectStatus(card.status);
                }
              }}
              className={`relative bg-white p-4 rounded-xl border transition-all cursor-pointer select-none ${
                isSelected 
                  ? card.borderActive 
                  : `border-slate-200 ${card.bgHover}`
              }`}
            >
              {/* Top Row: Icon and Percentage badge */}
              <div className="flex items-center justify-between mb-2">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.color}`}>
                  {card.icon}
                </div>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${card.badgeBg}`}>
                  {percentage}%
                </span>
              </div>

              {/* Status Title & Count */}
              <div>
                <div className="text-xs font-medium text-slate-500 truncate">
                  {card.title}
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-2xl font-bold tracking-tight text-slate-900">
                    {card.count}
                  </span>
                  <span className="text-[11px] text-slate-400">รายการ</span>
                </div>
              </div>

              {/* Description & Mini Progress Bar */}
              <div className="mt-3 pt-2.5 border-t border-slate-100">
                <p className="text-[11px] text-slate-500 truncate" title={card.description}>
                  {card.description}
                </p>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      card.status === 'เสร็จสิ้น' 
                        ? 'bg-emerald-500' 
                        : card.status === 'เข้ามาใหม่' 
                          ? 'bg-blue-500' 
                          : card.status === 'รอดำเนินการ'
                            ? 'bg-amber-500'
                            : card.status === 'ใหม่(แก้ไข)'
                              ? 'bg-purple-500'
                              : 'bg-rose-500'
                    }`} 
                    style={{ width: `${Math.max(percentage, 5)}%` }}
                  ></div>
                </div>
              </div>

              {/* Selected indicator checkmark */}
              {isSelected && (
                <div className="absolute top-2 right-2 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
