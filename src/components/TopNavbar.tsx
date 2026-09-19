import React from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  Plus, 
  ChevronDown
} from 'lucide-react';

interface TopNavbarProps {
  onToggleMobileSidebar: () => void;
  onOpenNewCase: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  urgentCount: number;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onToggleMobileSidebar,
  onOpenNewCase,
  searchQuery,
  onSearchChange,
  urgentCount,
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

      {/* Right: Search, Notifications, Avatar (matching screenshot header) */}
      <div className="flex items-center space-x-3">
        
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
