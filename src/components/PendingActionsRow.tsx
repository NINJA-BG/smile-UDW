import React from 'react';
import { 
  Users, 
  Package, 
  XCircle, 
  ChevronRight
} from 'lucide-react';
import { QueueStatus } from '../types';

interface PendingActionsRowProps {
  urgentCount: number;
  revisedCount: number;
  dueTodayCount: number;
  onFilterStatus: (status: QueueStatus | 'ด่วน') => void;
}

export const PendingActionsRow: React.FC<PendingActionsRowProps> = ({
  urgentCount,
  revisedCount,
  dueTodayCount,
  onFilterStatus,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
      
      {/* Header with Total Pending Pill (matching screenshot: 25 Pending) */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-base text-slate-900">Pending Actions</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Items requiring your immediate attention
          </p>
        </div>

        <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200">
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          <span>{12 + 8 + 5} Pending</span>
        </span>
      </div>

      {/* 3 Color-Tinted Cards (matching exact screenshot bottom row: Seller Verifications, Product Approvals, Reported Issues) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        
        {/* Card 1: Seller Verifications (Orange tint + 12 badge) */}
        <div className="bg-[#fff7ed] border border-orange-200/80 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <span className="w-7 h-7 rounded-full bg-orange-500 text-white font-bold text-xs flex items-center justify-center">
              12
            </span>
          </div>

          <div className="my-4">
            <h4 className="font-bold text-sm text-slate-900">Seller Verifications</h4>
            <p className="text-xs text-slate-600 mt-1 leading-snug">
              New sellers awaiting approval and verification
            </p>
          </div>

          <button
            onClick={() => onFilterStatus('ด่วน')}
            className="w-full py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <span>Review Now</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 2: Product Approvals (Blue tint + 8 badge) */}
        <div className="bg-[#eff6ff] border border-blue-200/80 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#0a66c2] text-white flex items-center justify-center shadow-xs">
              <Package className="w-5 h-5" />
            </div>
            <span className="w-7 h-7 rounded-full bg-[#0a66c2] text-white font-bold text-xs flex items-center justify-center">
              8
            </span>
          </div>

          <div className="my-4">
            <h4 className="font-bold text-sm text-slate-900">Product Approvals</h4>
            <p className="text-xs text-slate-600 mt-1 leading-snug">
              New product listings pending review
            </p>
          </div>

          <button
            onClick={() => onFilterStatus('ใหม่(แก้ไข)')}
            className="w-full py-2.5 px-4 rounded-xl bg-[#0a66c2] hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <span>Review Now</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 3: Reported Issues (Red tint + 5 badge) */}
        <div className="bg-[#fef2f2] border border-rose-200/80 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs">
              <XCircle className="w-5 h-5" />
            </div>
            <span className="w-7 h-7 rounded-full bg-rose-500 text-white font-bold text-xs flex items-center justify-center">
              5
            </span>
          </div>

          <div className="my-4">
            <h4 className="font-bold text-sm text-slate-900">Reported Issues</h4>
            <p className="text-xs text-slate-600 mt-1 leading-snug">
              Urgent disputes and flagged content
            </p>
          </div>

          <button
            onClick={() => onFilterStatus('รอดำเนินการ')}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <span>View Issues</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
