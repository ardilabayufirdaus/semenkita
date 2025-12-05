
import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Truck, 
  Package, 
  ClipboardList, 
  Database, 
  Users,
  Box,
  Settings,
  ChevronRight,
  FileText,
  ChevronLeft,
  LogOut,
  RefreshCcw,
  Shield,
  Briefcase,
  Globe,
  Zap // Added Zap icon for the logo
} from 'lucide-react';
import { ViewState, User, UserRole } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  isCollapsed: boolean;
  onToggle: () => void;
  currentUser: User;
  onSwitchUser: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, isCollapsed, onToggle, currentUser, onSwitchUser, onLogout }) => {
  // Define all possible menu items
  const allMenuItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: ViewState.STOCK_FORECAST, label: 'Stock Forecast', icon: TrendingUp },
    { id: ViewState.LOGISTICS_PERFORMANCE, label: 'Logistics Perf.', icon: Truck },
    { id: ViewState.PACKER_PERFORMANCE, label: 'Packer Perf.', icon: Package },
    { id: ViewState.STOCK_ENTRY, label: 'Entry Data', icon: ClipboardList },
    { id: ViewState.ENTRY_SUMMARY, label: 'Monthly Report', icon: FileText },
    { id: ViewState.MASTER_DATA, label: 'Master Data', icon: Database },
    { id: ViewState.USER_MANAGEMENT, label: 'User Mgmt', icon: Users },
  ];

  // Filter menu items based on Role
  const menuItems = allMenuItems.filter(item => {
    // Only 'Admin' can see User Management
    if (item.id === ViewState.USER_MANAGEMENT) {
        return currentUser.role === 'Admin';
    }
    return true;
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getRoleBadgeStyle = (role: UserRole) => {
    switch(role) {
        case 'Admin': return {
            style: 'text-fuchsia-400 border-fuchsia-900 bg-fuchsia-900/20',
            icon: Shield
        };
        case 'Internal': return {
            style: 'text-cyan-400 border-cyan-900 bg-cyan-900/20',
            icon: Briefcase
        };
        case 'External': return {
            style: 'text-amber-400 border-amber-900 bg-amber-900/20',
            icon: Globe
        };
        default: return {
            style: 'text-slate-400 border-slate-700 bg-slate-800',
            icon: Briefcase
        };
    }
  };

  const roleMeta = getRoleBadgeStyle(currentUser.role);
  const RoleIcon = roleMeta.icon;

  return (
    <aside 
      className={`bg-slate-950 text-slate-300 h-screen flex flex-col fixed left-0 top-0 z-50 shadow-2xl font-sans border-r border-slate-800 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Toggle Button */}
      <button 
        onClick={onToggle}
        className="absolute -right-3 top-20 bg-cyan-600 hover:bg-cyan-500 text-white p-1 rounded-sm shadow-[0_0_15px_rgba(8,145,178,0.5)] border border-slate-900 z-50 transition-colors"
      >
        {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Header */}
      <div className={`h-16 flex items-center bg-slate-950 border-b border-slate-800 shadow-sm transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'px-5'}`}>
        <div className={`w-8 h-8 bg-cyan-600 rounded-sm flex items-center justify-center shadow-lg shadow-cyan-900/50 transition-all duration-300 ${isCollapsed ? '' : 'mr-3'}`}>
          <Zap className="w-5 h-5 text-white fill-white" />
        </div>
        <div className={`overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
          <h1 className="text-lg font-black text-white tracking-widest uppercase leading-none whitespace-nowrap font-mono">SEMENKITA</h1>
          <p className="text-[9px] font-bold text-cyan-500 tracking-wide mt-1 whitespace-nowrap">INTELLIGENT LOGISTICS</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1.5 scrollbar-hide">
        {!isCollapsed && (
          <p className="px-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-3 transition-opacity duration-300">
            System Modules
          </p>
        )}
        
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={isCollapsed ? item.label : ''}
              className={`w-full flex items-center py-2.5 rounded-sm text-sm font-medium transition-all duration-200 group relative
                ${isActive 
                  ? 'bg-slate-900 text-cyan-400 shadow-[inset_2px_0_0_0_#22d3ee]' 
                  : 'hover:bg-slate-900 hover:text-white text-slate-400'
                }
                ${isCollapsed ? 'justify-center px-0' : 'justify-between px-3'}
              `}
            >
              <div className={`flex items-center ${isCollapsed ? 'space-x-0' : 'space-x-3'}`}>
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
                  isActive ? 'font-bold tracking-wide' : 'tracking-wide'
                } ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                  {item.label}
                </span>
              </div>
              
              {isActive && !isCollapsed && <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_8px_#22d3ee]"></div>}
            </button>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className={`bg-slate-950 border-t border-slate-800 transition-all duration-300 ${isCollapsed ? 'p-3' : 'p-4'}`}>
        <div className={`flex items-center transition-all duration-300 ${isCollapsed ? 'justify-center mb-0' : 'space-x-3 mb-4'}`}>
          <div className="w-9 h-9 rounded bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-bold text-cyan-200 font-mono shadow-inner shrink-0 relative group-hover:border-cyan-500 transition-colors">
            {getInitials(currentUser.name)}
            <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${currentUser.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-slate-500'}`}></div>
          </div>
          <div className={`overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>
            <p className="text-sm font-bold text-slate-200 truncate">{currentUser.name}</p>
            <div className="flex items-center mt-1 space-x-1">
                <RoleIcon className={`w-3 h-3 ${roleMeta.style.split(' ')[0]}`} />
                <div className={`text-[9px] px-1.5 py-0.5 rounded border w-fit font-mono uppercase tracking-tight ${roleMeta.style}`}>
                    {currentUser.role}
                </div>
            </div>
          </div>
        </div>
        
        {/* Switch User Button (Simulation) */}
         <button 
            onClick={onSwitchUser}
            className={`w-full flex items-center justify-center rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-900 text-xs text-cyan-500 transition-all font-medium uppercase tracking-wider mb-2 ${isCollapsed ? 'h-0 opacity-0 overflow-hidden border-0 py-0 mb-0' : 'py-2 space-x-2'}`}
            title="Simulate Role Switch"
         >
          <RefreshCcw className="w-3 h-3" />
          <span className="whitespace-nowrap">Switch Role</span>
        </button>

        <button 
          onClick={onLogout}
          className={`w-full flex items-center justify-center rounded bg-slate-900 hover:bg-red-900/20 border border-slate-700 hover:border-red-600 text-xs text-slate-400 hover:text-red-400 transition-all font-medium uppercase tracking-wider ${isCollapsed ? 'h-0 opacity-0 overflow-hidden border-0' : 'py-2 space-x-2'}`}
          title="Sign out from application"
        >
          <LogOut className="w-3 h-3" />
          <span className="whitespace-nowrap">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
