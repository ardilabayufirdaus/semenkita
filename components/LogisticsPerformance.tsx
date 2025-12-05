import React, { useEffect, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Truck, AlertTriangle, Zap } from "lucide-react";
import { LogisticsMetric } from "../types";
import { getLogisticsRecommendations } from "../services/geminiService";

// Mocking Dispatch Data (Tons) and Loading Times
const mockLogisticsData: any[] = [
  {
    date: "Mon",
    dispatchTon: 1200,
    avgLoadingTime: 25,
    truckCount: 60,
    targetTon: 1000,
  },
  {
    date: "Tue",
    dispatchTon: 1150,
    avgLoadingTime: 28,
    truckCount: 58,
    targetTon: 1000,
  },
  {
    date: "Wed",
    dispatchTon: 1400,
    avgLoadingTime: 22,
    truckCount: 70,
    targetTon: 1200,
  },
  {
    date: "Thu",
    dispatchTon: 950,
    avgLoadingTime: 35,
    truckCount: 48,
    targetTon: 1000,
  },
  {
    date: "Fri",
    dispatchTon: 1300,
    avgLoadingTime: 24,
    truckCount: 65,
    targetTon: 1200,
  },
  {
    date: "Sat",
    dispatchTon: 900,
    avgLoadingTime: 20,
    truckCount: 45,
    targetTon: 800,
  },
  {
    date: "Sun",
    dispatchTon: 850,
    avgLoadingTime: 18,
    truckCount: 42,
    targetTon: 800,
  },
];

const LogisticsPerformance: React.FC = () => {
  const { t } = useLanguage();
  const [recommendations, setRecommendations] = useState<string>(
    t("analyzing_dispatch")
  );

  useEffect(() => {
    // Passing the cement specific data structure to the service
    getLogisticsRecommendations(mockLogisticsData as LogisticsMetric[]).then(
      setRecommendations
    );
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dispatch Volume */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <Truck className="w-5 h-5 mr-2 text-cyan-500" />
            {t("daily_dispatch_volume")}
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockLogisticsData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  cursor={{ fill: "#ecfeff" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #06b6d4",
                  }}
                />
                <Legend iconType="circle" />
                {/* Stocktron Cyan Theme */}
                <Bar
                  dataKey="dispatchTon"
                  name={t("actual_ton")}
                  fill="#06b6d4"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="targetTon"
                  name={t("target_ton")}
                  fill="#94a3b8"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Loading Efficiency */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-orange-500" />
            {t("avg_loading_time_efficiency")}
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockLogisticsData}>
                <defs>
                  <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #f97316",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="avgLoadingTime"
                  name={t("loading_time_min")}
                  stroke="#f97316"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorTime)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Recommendations - Stocktron Dark Terminal Style */}
      <div className="bg-slate-900 text-slate-100 p-6 rounded-xl border border-slate-700 shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <h3 className="text-lg font-bold text-cyan-400 flex items-center mb-3 relative z-10">
          <Zap className="w-5 h-5 mr-2 text-cyan-400 fill-cyan-400" />
          {t("logistics_ai_title")}
        </h3>
        <div className="prose prose-invert prose-sm max-w-none relative z-10">
          <div className="whitespace-pre-line font-mono text-xs leading-relaxed text-cyan-50/80">
            {recommendations}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogisticsPerformance;
