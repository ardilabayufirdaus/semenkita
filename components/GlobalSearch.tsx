
import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronRight, LayoutDashboard, Factory, Package, Command, X } from 'lucide-react';
import { ViewState, SearchResult } from '../types';

interface GlobalSearchProps {
  onNavigate: (view: ViewState) => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ onNavigate }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // --- 1. SEARCH INDEX GENERATION ---
  // In a real app, this might fetch from an API or use a search library like Fuse.js
  const generateIndex = (): SearchResult[] => {
    return [
      // Modules
      { id: 'nav-1', title: 'Dashboard', subtitle: 'Main Overview', category: 'MODULE', targetView: ViewState.DASHBOARD },
      { id: 'nav-2', title: 'Stock Forecast', subtitle: 'Inventory Planning', category: 'MODULE', targetView: ViewState.STOCK_FORECAST },
      { id: 'nav-3', title: 'Logistics Performance', subtitle: 'Truck & Dispatch', category: 'MODULE', targetView: ViewState.LOGISTICS_PERFORMANCE },
      { id: 'nav-4', title: 'Packer Performance', subtitle: 'Machine Efficiency', category: 'MODULE', targetView: ViewState.PACKER_PERFORMANCE },
      { id: 'nav-5', title: 'Entry Data', subtitle: 'Input Daily Logs', category: 'MODULE', targetView: ViewState.STOCK_ENTRY },
      { id: 'nav-6', title: 'Master Data', subtitle: 'System Configuration', category: 'MODULE', targetView: ViewState.MASTER_DATA },
      { id: 'nav-7', title: 'User Management', subtitle: 'Access Control', category: 'MODULE', targetView: ViewState.USER_MANAGEMENT },
      
      // Simulated Plants (Shortcuts to Forecast View)
      { id: 'plant-1', title: 'Ambon (AMB)', subtitle: 'Plant Unit', category: 'PLANT', targetView: ViewState.STOCK_FORECAST },
      { id: 'plant-2', title: 'Balikpapan (BPN)', subtitle: 'Plant Unit', category: 'PLANT', targetView: ViewState.STOCK_FORECAST },
      { id: 'plant-3', title: 'Banjarmasin (BDJ)', subtitle: 'Plant Unit', category: 'PLANT', targetView: ViewState.STOCK_FORECAST },
      { id: 'plant-4', title: 'Makassar (MKS)', subtitle: 'Plant Unit', category: 'PLANT', targetView: ViewState.STOCK_FORECAST },
      
      // Simulated Materials (Shortcuts to Master Data)
      { id: 'mat-1', title: 'OPC Cement', subtitle: 'Ordinary Portland', category: 'MATERIAL', targetView: ViewState.MASTER_DATA },
      { id: 'mat-2', title: 'PCC Cement', subtitle: 'Composite', category: 'MATERIAL', targetView: ViewState.MASTER_DATA },
      { id: 'mat-3', title: '50KG-HDPE', subtitle: 'Bag Type', category: 'MATERIAL', targetView: ViewState.MASTER_DATA },
    ];
  };

  const searchIndex = generateIndex();

  // --- 2. SEARCH LOGIC ---
  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = searchIndex.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) || 
      (item.subtitle && item.subtitle.toLowerCase().includes(lowerQuery))
    );
    
    setResults(filtered.slice(0, 8)); // Limit to 8 results
    setSelectedIndex(0);
  }, [query]);

  // --- 3. EVENT HANDLERS ---
  const handleSelect = (result: SearchResult) => {
    if (result.targetView) {
      onNavigate(result.targetView);
    }
    setIsOpen(false);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

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

  const getCategoryIcon = (cat: string) => {
    switch(cat) {
      case 'MODULE': return <LayoutDashboard className="w-3 h-3" />;
      case 'PLANT': return <Factory className="w-3 h-3" />;
      case 'MATERIAL': return <Package className="w-3 h-3" />;
      default: return <Search className="w-3 h-3" />;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case 'MODULE': return 'bg-cyan-100 text-cyan-700';
      case 'PLANT': return 'bg-violet-100 text-violet-700';
      case 'MATERIAL': return 'bg-amber-100 text-amber-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="relative group z-50" ref={wrapperRef}>
      <div className="relative">
        <input 
          ref={inputRef}
          type="text" 
          placeholder="Type / to search..." 
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="pl-9 pr-10 py-1.5 rounded border border-slate-300 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none w-56 transition-all placeholder:text-slate-400 font-medium"
        />
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2 group-focus-within:text-cyan-500 transition-colors" />
        
        {/* Keyboard Shortcut Indicator or Clear Button */}
        <div className="absolute right-2 top-1.5">
           {query ? (
             <button onClick={() => { setQuery(''); inputRef.current?.focus(); }} className="p-0.5 hover:bg-slate-200 rounded text-slate-500">
               <X className="w-3 h-3" />
             </button>
           ) : (
             <div className="flex items-center space-x-0.5 text-[10px] text-slate-400 border border-slate-200 rounded px-1.5 bg-slate-50">
               <span className="text-xs">/</span>
             </div>
           )}
        </div>
      </div>

      {/* DROPDOWN RESULTS */}
      {isOpen && query && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="py-2">
            {results.length > 0 ? (
              <>
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Top Results</div>
                {results.map((result, index) => (
                  <button
                    key={result.id}
                    onClick={() => handleSelect(result)}
                    className={`w-full text-left px-4 py-2.5 flex items-center justify-between group transition-colors ${
                      index === selectedIndex ? 'bg-cyan-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3 overflow-hidden">
                       <div className={`p-1.5 rounded-md ${getCategoryColor(result.category)}`}>
                          {getCategoryIcon(result.category)}
                       </div>
                       <div className="truncate">
                          <h4 className={`text-sm font-bold truncate ${index === selectedIndex ? 'text-cyan-800' : 'text-slate-700'}`}>{result.title}</h4>
                          <p className="text-[10px] text-slate-400">{result.subtitle}</p>
                       </div>
                    </div>
                    {index === selectedIndex && <ChevronRight className="w-4 h-4 text-cyan-500" />}
                  </button>
                ))}
              </>
            ) : (
              <div className="p-6 text-center text-slate-500">
                <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-xs">No results found for "<span className="font-bold">{query}</span>"</p>
              </div>
            )}
          </div>
          <div className="bg-slate-50 px-3 py-2 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400">
             <span><span className="font-bold text-slate-600">↑↓</span> to navigate</span>
             <span><span className="font-bold text-slate-600">Enter</span> to select</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
