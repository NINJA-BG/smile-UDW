import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileSpreadsheet, 
  FolderKanban, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  ShieldCheck, 
  X,
  PlusCircle
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenNewCase: () => void;
  queueCount: number;
  urgentCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  onOpenNewCase,
  queueCount,
  urgentCount,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', thaiLabel: 'แดชบอร์ดคิวงาน', icon: LayoutDashboard, badge: queueCount },
    { id: 'underwriters', label: 'Users', thaiLabel: 'ผู้พิจารณารับประกัน', icon: Users },
    { id: 'products', label: 'Products', thaiLabel: 'ประเภทแผนประกัน', icon: ShieldCheck },
    { id: 'applications', label: 'Orders', thaiLabel: 'รายการขออนุมัติ', icon: FileSpreadsheet },
    { id: 'categories', label: 'Categories', thaiLabel: 'งวดความคุ้มครอง', icon: FolderKanban },
    { id: 'messages', label: 'Messages', thaiLabel: 'ข้อความประสานงาน', icon: MessageSquare, badge: urgentCount > 0 ? urgentCount : undefined, badgeColor: 'bg-rose-500' },
    { id: 'analytics', label: 'Analytics', thaiLabel: 'สถิติและ SLA', icon: BarChart3 },
    { id: 'settings', label: 'Settings', thaiLabel: 'ตั้งค่าระบบ', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#0a66c2] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top Branding */}
        <div>
          <div className="h-16 flex items-center justify-between px-5 border-b border-blue-500/30">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-white text-[#0a66c2] flex items-center justify-center font-bold shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-base leading-tight tracking-tight">SmileUnderwrite</h1>
                <p className="text-[11px] text-blue-100/75">Admin Panel</p>
              </div>
            </div>

            {/* Mobile close button */}
            <button 
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-blue-200 hover:text-white rounded-lg hover:bg-blue-600/50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* New Case Quick Action */}
          <div className="px-4 pt-4 pb-2">
            <button
              onClick={() => {
                onOpenNewCase();
                if (isOpenMobile) onCloseMobile();
              }}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-white text-[#0a66c2] font-bold text-xs shadow-md hover:bg-blue-50 active:bg-blue-100 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-[#0a66c2]" />
              <span>ส่งขออนุมัติใหม่</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-2 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (isOpenMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white/20 text-white font-semibold shadow-inner backdrop-blur-xs'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-200'}`} />
                    <div className="text-left">
                      <span>{item.label}</span>
                      <span className="block text-[10px] text-blue-200/80 font-normal">{item.thaiLabel}</span>
                    </div>
                  </div>

                  {item.badge !== undefined && (
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      item.badgeColor || (isActive ? 'bg-white text-[#0a66c2]' : 'bg-blue-500 text-white')
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile Section (matching bottom left of screenshot) */}
        <div className="p-3 border-t border-blue-500/30 bg-blue-900/20">
          <div className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/5 transition-colors">
            <div className="w-9 h-9 rounded-full bg-blue-300 text-slate-900 flex items-center justify-center font-bold text-sm shadow-inner border border-white/20">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">Admin User</p>
              <p className="text-[10px] text-blue-200 truncate">admin@smileunderwrite.com</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400" title="Online Active"></div>
          </div>
        </div>

      </aside>
    </>
  );
};
