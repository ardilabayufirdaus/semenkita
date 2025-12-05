import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import StockForecast from './components/StockForecast';
import LogisticsPerformance from './components/LogisticsPerformance';
import PackerPerformance from './components/PackerPerformance';
import EntryData from './components/EntryData';
import EntrySummary from './components/EntrySummary';
import MasterData from './components/MasterData';
import UserManagement from './components/UserManagement';
import GlobalSearch from './components/GlobalSearch';
import Notifications from './components/Notifications';
import { ViewState, User } from './types';
import { Calendar, ChevronRight, Lock, Activity } from 'lucide-react';
import { clearAllBrowserData } from './utils/browserData';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-slate-600 mb-2">{this.state.error?.message}</p>
            <p className="text-sm text-slate-500">{this.state.error?.stack}</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Industrial Card Component (SEMENKITA THEME)
const StatCard: React.FC<{ 
  title: string; 
  value: string; 
  subValue?: string;
  trend: string; 
  trendType: 'positive' | 'negative' | 'neutral'; 
  accentColor: string; 
}> = ({ title, value, subValue, trend, trendType, accentColor }) => (
  <div className="bg-white p-6 rounded shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-md transition-shadow">
    {/* Industrial Top Accent - Stocktron Style */}
    <div className={`absolute top-0 left-0 w-full h-1 ${accentColor}`}></div>
    
    <div className="flex justify-between items-start">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-1">{title}</p>
        {/* Glowing Dot */}
        <div className={`w-1.5 h-1.5 rounded-full ${accentColor} shadow-[0_0_8px_currentColor] opacity-70`}></div>
    </div>
    
    <div className="mt-3">
        <p className="text-3xl font-black text-slate-800 font-mono tracking-tight">{value}</p>
        {subValue && <p className="text-xs text-slate-400 font-bold mt-0.5">{subValue}</p>}
    </div>
    
    <div className="flex items-center mt-3 border-t border-slate-100 pt-3">
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
        trendType === 'positive' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
        trendType === 'negative' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200'
      }`}>
        {trend}
      </span>
      <span className="text-xs text-slate-400 ml-2 uppercase font-medium">vs Last Month</span>
    </div>
  </div>
);

const Dashboard: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <StatCard 
      title="Cement Release (Dispatch)" 
      value="1,248 T" 
      subValue="~ 24,960 Bags"
      trend="+12.5%" 
      trendType="positive"
      accentColor="bg-cyan-500" // Electric Cyan
    />
    <StatCard 
      title="Plant Availability" 
      value="92.4%" 
      subValue="Run Hrs: 22.1 / 24"
      trend="-1.2%" 
      trendType="negative"
      accentColor="bg-violet-500" // Tech Violet
    />
    <StatCard 
      title="Avg Loading Time" 
      value="28m" 
      subValue="Per 20T Truck"
      trend="-2m" 
      trendType="positive"
      accentColor="bg-orange-500" // Industrial Orange
    />
    <StatCard 
      title="Bag Breakage Rate" 
      value="0.45%" 
      subValue="Total Broken: 112 Pcs"
      trend="+0.1%" 
      trendType="negative"
      accentColor="bg-rose-500" // Alert Rose
    />

    {/* Quick views */}
    <div className="col-span-1 md:col-span-2 lg:col-span-2 mt-2">
      <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2">
        <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest flex items-center">
            <span className="w-2 h-2 bg-slate-400 rounded-sm mr-2"></span>
            Dispatch Volume Overview
        </h3>
        <button className="text-[10px] font-bold text-cyan-600 uppercase hover:text-cyan-800 transition-colors">View Logistics Report &rarr;</button>
      </div>
      <LogisticsPerformance />
    </div>
    <div className="col-span-1 md:col-span-2 lg:col-span-2 mt-2">
      <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2">
        <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest flex items-center">
            <span className="w-2 h-2 bg-slate-400 rounded-sm mr-2"></span>
            Cement Demand Forecast
        </h3>
        <button className="text-[10px] font-bold text-cyan-600 uppercase hover:text-cyan-800 transition-colors">View Stock Forecast &rarr;</button>
      </div>
      <StockForecast />
    </div>
  </div>
);

// Updated Simulation Users with New Roles and Access Levels and Rebranded Emails
const SIMULATED_USERS: User[] = [
    { id: '1', name: 'Super Admin', role: 'Admin', accessLevel: 'Can Edit', email: 'admin@semenkita.com', status: 'Active' },
    { id: '2', name: 'Internal Mgr', role: 'Internal', accessLevel: 'Can Edit', email: 'manager@semenkita.com', status: 'Active' },
    { id: '3', name: 'Internal Staff', role: 'Internal', accessLevel: 'View Only', email: 'staff@semenkita.com', status: 'Active' },
    { id: '4', name: 'External Auditor', role: 'External', accessLevel: 'View Only', email: 'auditor@external.com', status: 'Active' },
    { id: '5', name: 'External Vendor', role: 'External', accessLevel: 'Can Edit', email: 'vendor@logistics.com', status: 'Active' },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');

  // Load auth state from localStorage
  useEffect(() => {
    const savedAuth = localStorage.getItem('semenkita_auth');
    if (savedAuth) {
      try {
        const { email, userIndex } = JSON.parse(savedAuth);
        setLoginEmail(email);
        setCurrentUserIndex(userIndex);
        setIsAuthenticated(true);
      } catch (e) {
        // Invalid saved auth, user needs to login again
        localStorage.removeItem('semenkita_auth');
      }
    }
  }, []);

  // Keyboard shortcut listener for Global Search
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder="Type / to search..."]') as HTMLInputElement;
        searchInput?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated]);

  const currentUser = SIMULATED_USERS[currentUserIndex];

  const handleLogin = (email: string, password: string) => {
    // Demo authentication - accept any email with password123
    if (password === 'password123') {
      // Find user by email or use random user
      let userIndex = SIMULATED_USERS.findIndex(u => u.email === email);
      if (userIndex === -1) {
        // If email doesn't match, use first admin user
        userIndex = 0;
      }

      setLoginEmail(email);
      setCurrentUserIndex(userIndex);
      setIsAuthenticated(true);

      // Save to localStorage
      localStorage.setItem('semenkita_auth', JSON.stringify({ email, userIndex }));
    }
  };

  const handleLogout = async () => {
    setIsAuthenticated(false);
    setLoginEmail('');
    setCurrentView(ViewState.DASHBOARD);
    
    // Clear all browser data
    await clearAllBrowserData();
  };

  const handleSwitchUser = () => {
    setCurrentUserIndex((prev) => (prev + 1) % SIMULATED_USERS.length);
    // Update localStorage with new user
    localStorage.setItem('semenkita_auth', JSON.stringify({ 
      email: loginEmail, 
      userIndex: (currentUserIndex + 1) % SIMULATED_USERS.length 
    }));
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case ViewState.STOCK_FORECAST:
        return <StockForecast />;
      case ViewState.LOGISTICS_PERFORMANCE:
        return <LogisticsPerformance />;
      case ViewState.PACKER_PERFORMANCE:
        return <PackerPerformance />;
      case ViewState.STOCK_ENTRY:
        return <EntryData currentUser={currentUser} />;
      case ViewState.ENTRY_SUMMARY:
        return <EntrySummary />;
      case ViewState.MASTER_DATA:
        return <MasterData />;
      case ViewState.USER_MANAGEMENT:
        if (currentUser.role !== 'Admin') {
            return (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <Lock className="w-16 h-16 mb-4 text-slate-300" />
                    <h2 className="text-xl font-bold text-slate-600">Access Denied</h2>
                    <p className="text-sm">You do not have permission to view User Management.</p>
                    <button 
                        onClick={() => setCurrentView(ViewState.DASHBOARD)}
                        className="mt-6 px-4 py-2 bg-cyan-600 text-white rounded text-xs font-bold uppercase"
                    >
                        Return to Dashboard
                    </button>
                </div>
            );
        }
        return <UserManagement currentUser={currentUser} />;
      case ViewState.DASHBOARD:
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans text-slate-900">
      <Sidebar 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        onLogout={handleLogout}
      />
      
      <main 
        className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-cyan-500/30 flex items-center justify-between px-8 shadow-sm z-40 shrink-0 relative">
          <div className="flex items-center">
            <div className="flex flex-col">
                 <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight leading-none flex items-center">
                  {currentView.replace(/_/g, ' ')}
                </h2>
                <div className="flex items-center mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>SEMENKITA</span>
                    <ChevronRight className="w-3 h-3 mx-1" />
                    <span className="text-cyan-600">Module: {currentView}</span>
                </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-5">
             <div className="flex items-center px-3 py-1 bg-slate-50 border border-slate-200 rounded text-slate-600 text-xs font-medium font-mono">
              <Calendar className="w-3.5 h-3.5 mr-2 text-cyan-500" />
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>

            <div className="h-6 w-px bg-slate-200 mx-2"></div>

            {/* ACTIVATED FEATURES */}
            <GlobalSearch onNavigate={setCurrentView} />
            
            <Notifications />
            
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 flex-1 overflow-y-auto bg-slate-100 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const AppWithBoundary = () => (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

export default AppWithBoundary;
