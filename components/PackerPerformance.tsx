
import React, { useEffect, useState } from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Settings, Scale, AlertOctagon, Activity, Zap, Package } from 'lucide-react';
import { PackerMetric } from '../types';
import { getPackerAnalysis } from '../services/geminiService';

const mockPackerData: PackerMetric[] = [
  { id: '1', unitName: 'Packer 01 (8-Spout)', operator: 'Shift A - Team', productType: 'PCC 50kg', totalBags: 12500, tonnage: 625, burstRate: 0.15, weightAccuracy: 50.12, status: 'Running', efficiency: 94 },
  { id: '2', unitName: 'Packer 02 (8-Spout)', operator: 'Shift A - Team', productType: 'OPC 50kg', totalBags: 11000, tonnage: 550, burstRate: 0.85, weightAccuracy: 50.35, status: 'Running', efficiency: 88 },
  { id: '3', unitName: 'Packer 03 (Jumbo)', operator: 'Shift A - Team', productType: 'PCC 1 Ton', totalBags: 450, tonnage: 450, burstRate: 0.05, weightAccuracy: 1002.5, status: 'Maintenance', efficiency: 65 },
  { id: '4', unitName: 'Packer 04 (8-Spout)', operator: 'Shift B - Team', productType: 'PCC 40kg', totalBags: 14000, tonnage: 560, burstRate: 0.22, weightAccuracy: 40.05, status: 'Running', efficiency: 97 },
];

const PackerPerformance: React.FC = () => {
  const [analysis, setAnalysis] = useState<string>('Analyzing machine telemetry...');

  useEffect(() => {
    getPackerAnalysis(mockPackerData).then(setAnalysis);
  }, []);

  return (
    <div className="space-y-6">
      {/* KPI Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-cyan-300 transition-colors">
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Output</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">2,185 <span className="text-sm font-normal text-slate-500">Ton</span></h3>
           </div>
           <div className="p-2 bg-cyan-50 text-cyan-600 rounded-lg group-hover:bg-cyan-600 group-hover:text-white transition-colors">
              <Package className="w-5 h-5" />
           </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-violet-300 transition-colors">
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg Weight Dev</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">+0.12 <span className="text-sm font-normal text-slate-500">kg</span></h3>
           </div>
           <div className="p-2 bg-violet-50 text-violet-600 rounded-lg group-hover:bg-violet-600 group-hover:text-white transition-colors">
              <Scale className="w-5 h-5" />
           </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-emerald-300 transition-colors">
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Efficiency</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">91.5 <span className="text-sm font-normal text-slate-500">%</span></h3>
           </div>
           <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Zap className="w-5 h-5" />
           </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-rose-300 transition-colors">
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Burst Rate</p>
              <h3 className="text-2xl font-black text-rose-600 mt-1">0.31 <span className="text-sm font-normal text-slate-500">%</span></h3>
           </div>
           <div className="p-2 bg-rose-50 text-rose-600 rounded-lg group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <AlertOctagon className="w-5 h-5" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-violet-500"></div>
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center">
                 <Activity className="w-5 h-5 mr-2 text-cyan-500" />
                 Production vs Burst Rate
              </h3>
              <div className="flex space-x-2">
                 <span className="flex items-center text-xs text-slate-500"><div className="w-2 h-2 bg-cyan-500 mr-1"></div> Output (Ton)</span>
                 <span className="flex items-center text-xs text-slate-500"><div className="w-2 h-2 bg-rose-500 mr-1"></div> Burst (%)</span>
              </div>
           </div>
           <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <ComposedChart data={mockPackerData}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                 <XAxis dataKey="unitName" tick={{fontSize: 10}} interval={0} />
                 <YAxis yAxisId="left" orientation="left" stroke="#64748b" />
                 <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" domain={[0, 1]} />
                 <Tooltip 
                   contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                 />
                 <Bar yAxisId="left" dataKey="tonnage" fill="#06b6d4" barSize={40} radius={[4, 4, 0, 0]} name="Output (Ton)" />
                 <Line yAxisId="right" type="monotone" dataKey="burstRate" stroke="#f43f5e" strokeWidth={2} name="Burst Rate (%)" />
               </ComposedChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* AI Analysis - Stocktron Dark Theme */}
        <div className="bg-slate-900 text-slate-100 rounded-xl shadow-lg p-6 border border-slate-700 relative overflow-hidden">
           <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl"></div>
           <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-4 flex items-center relative z-10">
              <Settings className="w-4 h-4 mr-2" />
              SemenKita Maintenance Insight
           </h3>
           <div className="prose prose-invert prose-sm relative z-10">
              <div className="whitespace-pre-line text-xs font-mono leading-relaxed text-slate-300">
                 {analysis}
              </div>
           </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-sm font-bold text-slate-700 uppercase">Unit Status & Metrics</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-xs">
              <tr>
                <th className="p-4">Machine Unit</th>
                <th className="p-4">Product</th>
                <th className="p-4 text-right">Output (Bags)</th>
                <th className="p-4 text-right">Weight (Avg)</th>
                <th className="p-4 text-right">Efficiency</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockPackerData.map((packer) => (
                <tr key={packer.id} className="hover:bg-cyan-50/30 transition-colors">
                  <td className="p-4">
                     <div className="font-bold text-slate-800">{packer.unitName}</div>
                     <div className="text-xs text-slate-500">{packer.operator}</div>
                  </td>
                  <td className="p-4">
                     <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold border border-slate-200 font-mono">
                        {packer.productType}
                     </span>
                  </td>
                  <td className="p-4 text-right font-mono text-slate-700">
                     {packer.totalBags.toLocaleString()}
                  </td>
                  <td className="p-4 text-right font-mono">
                     <span className={`${
                        Math.abs(packer.weightAccuracy - (packer.productType.includes('40') ? 40 : packer.productType.includes('1 Ton') ? 1000 : 50)) > 0.2 
                        ? 'text-rose-600 font-bold' 
                        : 'text-emerald-600 font-bold'
                     }`}>
                        {packer.weightAccuracy.toFixed(2)}
                     </span>
                     <span className="text-[10px] text-slate-400 ml-1">kg</span>
                  </td>
                  <td className="p-4 text-right">
                     <div className="flex items-center justify-end">
                        <span className="text-xs font-bold mr-2 text-slate-600">{packer.efficiency}%</span>
                        <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                           <div className={`h-full rounded-full ${packer.efficiency > 90 ? 'bg-cyan-500' : 'bg-amber-500'}`} style={{width: `${packer.efficiency}%`}}></div>
                        </div>
                     </div>
                  </td>
                  <td className="p-4 text-center">
                     <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                        packer.status === 'Running' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        packer.status === 'Maintenance' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                     }`}>
                        {packer.status}
                     </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PackerPerformance;
