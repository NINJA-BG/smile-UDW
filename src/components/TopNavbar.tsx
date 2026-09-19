import React from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  Plus, 
  ChevronDown,
  Cloud,
  CheckCircle2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface TopNavbarProps {
  onToggleMobileSidebar: () => void;
  onOpenNewCase: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  urgentCount: number;
  firebaseStatus?: 'synced' | 'syncing' | 'error';
  onSyncNow?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onToggleMobileSidebar,
  onOpenNewCase,
  searchQuery,
  onSearchChange,
  urgentCount,
  firebaseStatus = 'synced',
  onSyncNow
}) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
      
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
          title="เปิดเมนู"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
            Dashboard
          </h1>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            Manage your dashboard here
          </p>
        </div>
      </div>

      {/* Right: Search, Firebase sync indicator, Notifications, Avatar */}
      <div className="flex items-center space-x-3">
        
        {/* Firebase Cloud Sync Status Badge */}
        <button
          type="button"
          onClick={onSyncNow}
          title="สถานะการเชื่อมต่อฐานข้อมูล Firebase Firestore (smileUDW)"
          className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
        >
          <Cloud className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-bold text-blue-700">smileUDW</span>
          {firebaseStatus === 'syncing' ? (
            <span className="flex items-center space-x-1 text-amber-600">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>กำลังซิงค์</span>
            </span>
          ) : firebaseStatus === 'error' ? (
            <span className="flex items-center space-x-1 text-rose-600">
              <AlertCircle className="w-3 h-3" />
              <span>ออฟไลน์</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1 text-emerald-600">
              <CheckCircle2 className="w-3 h-3" />
              <span>Firestore คลาวด์</span>
            </span>
          )}
        </button>

        {/* Search input with pill styling as in screenshot */}
        <div className="relative hidden md:block w-72 lg:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-100/90 border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
          />
        </div>

        {/* Notifications Bell with badge */}
        <div className="relative">
          <button 
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors relative cursor-pointer"
            title="การแจ้งเตือนงานเร่งด่วน"
          >
            <Bell className="w-4 h-4" />
            {urgentCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
            )}
          </button>
        </div>

        {/* Quick Add Case Button */}
        <button
          onClick={onOpenNewCase}
          className="hidden sm:inline-flex items-center space-x-1 px-3 py-1.5 rounded-full bg-[#0a66c2] hover:bg-[#095196] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>ส่งขออนุมัติ</span>
        </button>

        {/* User Profile Avatar with dropdown indicator (as in screenshot) */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-[#0a66c2] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            A
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
        </div>

      </div>

    </header>
  );
};
