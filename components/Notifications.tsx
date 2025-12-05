
import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2, AlertTriangle, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { NotificationItem, NotificationType } from '../types';

const initialNotifications: NotificationItem[] = [
  { 
    id: '1', 
    title: 'Silo Critical Low', 
    message: 'Silo 02 (PPC) at Plant AMB is below 20% capacity.', 
    timestamp: '2 mins ago', 
    type: 'CRITICAL', 
    read: false 
  },
  { 
    id: '2', 
    title: 'Packer Maintenance', 
    message: 'Packer 03 requires scheduled maintenance check.', 
    timestamp: '1 hour ago', 
    type: 'WARNING', 
    read: false 
  },
  { 
    id: '3', 
    title: 'Dispatch Report Ready', 
    message: 'Daily logistics report for 25 Oct 2023 has been generated.', 
    timestamp: '3 hours ago', 
    type: 'SUCCESS', 
    read: true 
  },
  { 
    id: '4', 
    title: 'System Update', 
    message: 'Master data sync completed successfully.', 
    timestamp: 'Yesterday', 
    type: 'INFO', 
    read: true 
  },
];

const Notifications: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>(initialNotifications);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = items.filter(i => !i.read).length;

  const handleMarkAsRead = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, read: true } : i));
  };

  const handleMarkAllRead = () => {
    setItems(items.map(i => ({ ...i, read: true })));
  };

  const handleClear = () => {
    setItems([]);
  };

  const getTypeIcon = (type: NotificationType) => {
    switch(type) {
      case 'CRITICAL': return <AlertCircle className="w-4 h-4 text-white" />;
      case 'WARNING': return <AlertTriangle className="w-4 h-4 text-white" />;
      case 'SUCCESS': return <CheckCircle2 className="w-4 h-4 text-white" />;
      default: return <Info className="w-4 h-4 text-white" />;
    }
  };

  const getTypeStyle = (type: NotificationType) => {
    switch(type) {
      case 'CRITICAL': return 'bg-rose-500 shadow-rose-200';
      case 'WARNING': return 'bg-amber-500 shadow-amber-200';
      case 'SUCCESS': return 'bg-emerald-500 shadow-emerald-200';
      default: return 'bg-cyan-500 shadow-cyan-200';
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 transition-colors border border-transparent hover:bg-slate-50 hover:border-slate-200 rounded-md ${isOpen ? 'bg-slate-50 border-slate-200 text-cyan-600' : 'text-slate-500 hover:text-cyan-600'}`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse"></span>
        )}
      </button>

      {/* DROPDOWN PANEL */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
          <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 backdrop-blur-sm">
             <div className="flex items-center space-x-2">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Notifications</h3>
                {unreadCount > 0 && (
                    <span className="bg-cyan-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount} New</span>
                )}
             </div>
             {items.length > 0 && (
                 <div className="flex space-x-1">
                     {unreadCount > 0 && (
                         <button onClick={handleMarkAllRead} className="text-[10px] font-bold text-cyan-600 hover:bg-cyan-50 px-2 py-1 rounded transition-colors uppercase">
                             Mark Read
                         </button>
                     )}
                     <button onClick={handleClear} className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors" title="Clear All">
                         <Trash2 className="w-3.5 h-3.5" />
                     </button>
                 </div>
             )}
          </div>

          <div className="max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
            {items.length > 0 ? (
                <div className="divide-y divide-slate-50">
                    {items.map((item) => (
                        <div 
                            key={item.id} 
                            onClick={() => handleMarkAsRead(item.id)}
                            className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer group relative ${!item.read ? 'bg-cyan-50/30' : ''}`}
                        >
                            <div className="flex items-start space-x-3">
                                <div className={`p-1.5 rounded-full shadow-lg ${getTypeStyle(item.type)} mt-1 shrink-0`}>
                                    {getTypeIcon(item.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h4 className={`text-xs font-bold ${!item.read ? 'text-slate-800' : 'text-slate-600'}`}>
                                            {item.title}
                                        </h4>
                                        <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">{item.timestamp}</span>
                                    </div>
                                    <p className={`text-xs mt-0.5 leading-relaxed ${!item.read ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                                        {item.message}
                                    </p>
                                </div>
                                {!item.read && (
                                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-2 shrink-0"></div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-8 text-center flex flex-col items-center justify-center text-slate-400">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                        <Bell className="w-5 h-5 text-slate-300" />
                    </div>
                    <p className="text-sm font-bold text-slate-500">All caught up!</p>
                    <p className="text-xs">No new notifications.</p>
                </div>
            )}
          </div>
          
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-center">
             <button className="text-[10px] font-bold text-cyan-600 hover:text-cyan-800 uppercase tracking-wide">View All History</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
