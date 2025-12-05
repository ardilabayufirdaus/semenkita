import React, { useEffect, useState, useMemo } from "react";
import {
  ComposedChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Brain,
  RefreshCw,
  TrendingUp,
  Factory,
  AlertTriangle,
  Package,
  ArrowRight,
  Database,
  Calendar,
  ChevronRight,
  Zap,
} from "lucide-react";
import { StockItem, PackingPlant } from "../types";
import { getStockForecastAnalysis } from "../services/geminiService";
import { useLanguage } from "../contexts/LanguageContext";

// --- MOCK MASTER DATA (Synced with MasterData.tsx) ---
const mockPlants: PackingPlant[] = [
  {
    id: "1",
    plantCode: "AMB",
    plantName: "Ambon",
    capacity: 120,
    packerCount: 2,
    siloCount: 2,
    siloCapacity: 8000,
    deadStockCapacity: 1470,
  },
  {
    id: "2",
    plantCode: "BPN",
    plantName: "Balikpapan",
    capacity: 120,
    packerCount: 1,
    siloCount: 2,
    siloCapacity: 5000,
    deadStockCapacity: 900,
  },
  {
    id: "3",
    plantCode: "BDJ",
    plantName: "Banjarmasin",
    capacity: 120,
    packerCount: 1,
    siloCount: 2,
    siloCapacity: 6000,
    deadStockCapacity: 195,
  },
  {
    id: "4",
    plantCode: "BIT",
    plantName: "Bitung",
    capacity: 120,
    packerCount: 2,
    siloCount: 2,
    siloCapacity: 12000,
    deadStockCapacity: 750,
  },
  {
    id: "5",
    plantCode: "KDI",
    plantName: "Kendari",
    capacity: 120,
    packerCount: 1,
    siloCount: 2,
    siloCapacity: 12000,
    deadStockCapacity: 1000,
  },
];

// --- DYNAMIC DATA GENERATOR BASED ON PLANT ---
const generateDataForPlant = (plantId: string) => {
  const plant = mockPlants.find((p) => p.id === plantId) || mockPlants[0];
  const isCritical = plantId === "2"; // Simulate Balikpapan having issues

  // 1. Forecast Data
  const baseCapacity = plant.capacity * 24 * 7; // Approx weekly capacity
  const forecastData = [
    {
      month: "Oct W1",
      actual: isCritical ? 1200 : 2100,
      forecast: 2050,
      capacity: baseCapacity,
    },
    {
      month: "Oct W2",
      actual: isCritical ? 1100 : 2350,
      forecast: 2200,
      capacity: baseCapacity,
    },
    {
      month: "Oct W3",
      actual: isCritical ? 1300 : 2150,
      forecast: 2300,
      capacity: baseCapacity,
    },
    {
      month: "Oct W4",
      actual: isCritical ? 900 : 2480,
      forecast: 2400,
      capacity: baseCapacity,
    },
    { month: "Nov W1", actual: null, forecast: 2550, capacity: baseCapacity },
    { month: "Nov W2", actual: null, forecast: 2600, capacity: baseCapacity },
    { month: "Nov W3", actual: null, forecast: 2450, capacity: baseCapacity },
    { month: "Nov W4", actual: null, forecast: 2700, capacity: baseCapacity },
  ];

  // 2. Silo Data
  const siloData = Array.from({ length: plant.siloCount }).map((_, i) => ({
    id: `S${i + 1}`,
    name: `Silo 0${i + 1} (${i === 0 ? "OPC" : "PCC"})`,
    current:
      isCritical && i === 1
        ? 800
        : Math.floor(plant.siloCapacity * (0.4 + Math.random() * 0.5)),
    capacity: plant.siloCapacity,
    status: isCritical && i === 1 ? "Critical" : "Normal",
  }));

  // 3. Packaging Data
  const packagingData = [
    {
      material: "50KG-HDPE",
      stock: isCritical ? 15000 : 125000,
      dailyUsage: 5000,
      reorderPoint: 50000,
      pendingPO: 100000,
    },
    {
      material: "50KG-PP",
      stock: 45000,
      dailyUsage: 8000,
      reorderPoint: 60000,
      pendingPO: 200000,
    },
    {
      material: "40KG-PP",
      stock: 85000,
      dailyUsage: 2500,
      reorderPoint: 20000,
      pendingPO: 0,
    },
    {
      material: "1T-JUMBO",
      stock: 450,
      dailyUsage: 50,
      reorderPoint: 200,
      pendingPO: 500,
    },
  ];

  return { forecastData, siloData, packagingData };
};

const StockForecast: React.FC = () => {
  const { t } = useLanguage();
  const [selectedPlant, setSelectedPlant] = useState<string>(mockPlants[0].id);
  const [insight, setInsight] = useState<string>(t("initializing_ai"));
  const [loading, setLoading] = useState<boolean>(true);
  const [period, setPeriod] = useState<string>("Weekly");

  // Derived Data based on selection
  const currentPlant =
    mockPlants.find((p) => p.id === selectedPlant) || mockPlants[0];
  const { forecastData, siloData, packagingData } = useMemo(
    () => generateDataForPlant(selectedPlant),
    [selectedPlant]
  );

  // Combine for AI Prompt
  const combinedStockData: StockItem[] = useMemo(
    () => [
      ...siloData.map((s) => ({
        id: s.id,
        sku: s.name,
        name: s.name,
        category: "Cement" as any,
        currentStock: s.current,
        minThreshold: s.capacity * 0.2, // 20% safety stock
        lastUpdated: new Date().toISOString(),
      })),
      ...packagingData.map((p) => ({
        id: p.material,
        sku: p.material,
        name: `Bag ${p.material}`,
        category: "Packaging" as any,
        currentStock: p.stock,
        minThreshold: p.reorderPoint,
        lastUpdated: new Date().toISOString(),
      })),
    ],
    [siloData, packagingData]
  );

  const fetchInsight = async () => {
    setLoading(true);
    // Simulate slight delay for UX
    await new Promise((r) => setTimeout(r, 500));
    const result = await getStockForecastAnalysis(combinedStockData);
    setInsight(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchInsight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlant]);

  const calculateDaysCover = (stock: number, usage: number) => {
    return (stock / usage).toFixed(1);
  };

  const getSiloFillPercentage = (current: number, capacity: number) => {
    return Math.round((current / capacity) * 100);
  };

  // Calculate Totals for Cards
  const totalCementStock = siloData.reduce(
    (acc, curr) => acc + curr.current,
    0
  );
  const criticalBags = packagingData.filter(
    (p) => p.stock < p.reorderPoint
  ).length;

  return (
    <div className="space-y-6 pb-12">
      {/* 0. FILTER BAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center sticky top-0 z-10">
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="p-2 bg-cyan-100 rounded-lg text-cyan-700">
            <Factory className="w-6 h-6" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
              {t("packing_plant_location")}
            </label>
            <div className="relative">
              <select
                value={selectedPlant}
                onChange={(e) => setSelectedPlant(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-300 text-slate-900 text-sm font-bold rounded py-2 pl-3 pr-10 leading-tight focus:outline-none focus:ring-2 focus:ring-cyan-500 hover:border-cyan-400 transition-colors w-full md:w-64 cursor-pointer"
              >
                {mockPlants.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.plantCode} - {p.plantName}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-600">
                <ChevronRight className="w-4 h-4 rotate-90" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 md:mt-0 flex items-center space-x-2 text-sm text-slate-500">
          <Calendar className="w-4 h-4" />
          <span className="font-mono font-medium">{t("planning_horizon")}</span>
        </div>
      </div>

      {/* 1. TOP KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Database className="w-16 h-16 text-cyan-600" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {t("total_cement_stock")} ({currentPlant.plantCode})
          </p>
          <div className="flex items-baseline mt-2">
            <h3 className="text-3xl font-black text-slate-800">
              {totalCementStock.toLocaleString()}
            </h3>
            <span className="text-sm font-bold text-slate-500 ml-1">
              {t("ton_unit")}
            </span>
          </div>
          <div className="mt-4 flex items-center text-xs font-medium text-cyan-700 bg-cyan-50 w-fit px-2 py-1 rounded border border-cyan-100">
            <TrendingUp className="w-3 h-3 mr-1" />
            {t("capacity_utilization")}:{" "}
            {Math.round(
              (totalCementStock /
                (currentPlant.siloCapacity * currentPlant.siloCount)) *
                100
            )}
            %
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Package className="w-16 h-16 text-amber-600" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {t("bag_critical_alert")}
          </p>
          <div className="flex items-baseline mt-2">
            <h3
              className={`text-3xl font-black ${
                criticalBags > 0 ? "text-red-600" : "text-slate-800"
              }`}
            >
              {criticalBags}
            </h3>
            <span className="text-sm font-bold text-slate-500 ml-1">
              {t("materials")}
            </span>
          </div>
          <div
            className={`mt-4 flex items-center text-xs font-medium w-fit px-2 py-1 rounded border ${
              criticalBags > 0
                ? "text-red-600 bg-red-50 border-red-100"
                : "text-emerald-600 bg-emerald-50 border-emerald-100"
            }`}
          >
            {criticalBags > 0 ? (
              <AlertTriangle className="w-3 h-3 mr-1" />
            ) : (
              <Package className="w-3 h-3 mr-1" />
            )}
            {criticalBags > 0
              ? t("below_reorder_point")
              : t("stock_levels_healthy")}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Factory className="w-16 h-16 text-indigo-600" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {t("forecast_accuracy")}
          </p>
          <div className="flex items-baseline mt-2">
            <h3 className="text-3xl font-black text-slate-800">94.2%</h3>
            <span className="text-sm font-bold text-slate-500 ml-1">
              {t("last_month")}
            </span>
          </div>
          <div className="mt-4 flex items-center text-xs font-medium text-slate-600 bg-slate-100 w-fit px-2 py-1 rounded border border-slate-200">
            <Calendar className="w-3 h-3 mr-1" />
            {t("mape_label")}: 5.8% (Excellent)
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2. DEMAND FORECAST CHART */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center">
                {t("cement_demand_forecast_title")}
                <div className="ml-2 px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-600 text-[10px] font-bold border border-cyan-100">
                  AI MODEL V2.1
                </div>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {t("comparing_actual_vs_ai")} ({currentPlant.plantName})
              </p>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              {["Weekly", "Monthly"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    period === p
                      ? "bg-white shadow-sm text-cyan-700"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {p === "Weekly" ? t("weekly") : t("monthly")}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={forecastData}>
                <defs>
                  <linearGradient
                    id="colorCapacity"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#e2e8f0" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#e2e8f0" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  labelStyle={{ fontWeight: "bold", color: "#0e7490" }}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                />

                <Area
                  type="monotone"
                  dataKey="capacity"
                  name={t("plant_capacity")}
                  stroke="none"
                  fill="url(#colorCapacity)"
                />
                <Bar
                  dataKey="actual"
                  name={t("actual_dispatch")}
                  barSize={30}
                  fill="url(#colorActual)"
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  name={t("ai_forecast")}
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  strokeDasharray="5 5"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. SILO MONITORING (Visual) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <Database className="w-5 h-5 mr-2 text-slate-400" />
            {t("silo_levels_title")} ({currentPlant.plantCode})
          </h3>

          <div className="flex-1 flex justify-center items-end space-x-8 px-4">
            {siloData.map((silo) => {
              const pct = getSiloFillPercentage(silo.current, silo.capacity);
              const isCritical = pct < 25 || pct > 90;
              const colorClass = isCritical
                ? "bg-rose-500"
                : pct < 40
                ? "bg-amber-400"
                : "bg-slate-500";
              const glowClass = isCritical
                ? "shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                : "shadow-[0_0_15px_rgba(100,116,139,0.2)]";

              return (
                <div
                  key={silo.id}
                  className="flex flex-col items-center group w-24"
                >
                  {/* Hover Details */}
                  <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity text-center absolute -mt-16 bg-slate-900 text-cyan-50 text-[10px] p-2 rounded shadow-lg z-10 w-32 -ml-4 border border-slate-700">
                    <p className="font-bold text-cyan-400">
                      {silo.current.toLocaleString()} Ton
                    </p>
                    <p className="text-slate-400">
                      Cap: {silo.capacity.toLocaleString()}
                    </p>
                  </div>

                  {/* The Silo Visual */}
                  <div
                    className={`relative w-full h-48 bg-slate-100 rounded-lg border-2 border-slate-300 overflow-hidden flex flex-col justify-end ${glowClass} transition-shadow duration-500`}
                  >
                    {/* Fill Level */}
                    <div
                      className={`w-full transition-all duration-1000 ease-out ${colorClass} opacity-90`}
                      style={{ height: `${pct}%` }}
                    >
                      <div className="w-full h-full bg-gradient-to-r from-black/20 to-transparent"></div>
                    </div>
                    {/* Measurement Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-full border-t border-slate-400/30 h-0"
                        ></div>
                      ))}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-black text-slate-800 mix-blend-overlay drop-shadow-md">
                        {pct}%
                      </span>
                    </div>
                  </div>

                  {/* Base */}
                  <div className="w-28 h-4 bg-slate-300 rounded-full -mt-2 z-0"></div>

                  {/* Label */}
                  <div className="mt-3 text-center">
                    <p className="text-xs font-bold text-slate-700">
                      {silo.name}
                    </p>
                    <p
                      className={`text-[10px] font-bold ${
                        isCritical
                          ? "text-red-600 animate-pulse"
                          : "text-emerald-600"
                      }`}
                    >
                      {isCritical ? t("attention") : t("optimal")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. PACKAGING MATERIAL PLANNING */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <Package className="w-5 h-5 mr-2 text-slate-400" />
              Packaging Material Planning
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                <tr>
                  <th className="p-3">{t("material")}</th>
                  <th className="p-3 text-right">{t("stock")}</th>
                  <th className="p-3 text-right">{t("daily_usage")}</th>
                  <th className="p-3 text-center">{t("days_label")}</th>
                  <th className="p-3">{t("status")}</th>
                  <th className="p-3 text-right">{t("pending_po")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {packagingData.map((item, idx) => {
                  const doc = parseFloat(
                    calculateDaysCover(item.stock, item.dailyUsage)
                  );
                  const statusColor =
                    doc < 7
                      ? "bg-red-100 text-red-700 border-red-200"
                      : doc < 14
                      ? "bg-amber-100 text-amber-700 border-amber-200"
                      : "bg-emerald-100 text-emerald-700 border-emerald-200";

                  return (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-700">
                        {item.material}
                      </td>
                      <td className="p-3 text-right font-mono">
                        {item.stock.toLocaleString()}
                      </td>
                      <td className="p-3 text-right font-mono text-slate-500">
                        {item.dailyUsage.toLocaleString()}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-black text-slate-800">
                            {doc} {t("days_label")}
                          </span>
                          <div className="w-16 h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
                            <div
                              className={`h-full ${
                                doc < 7 ? "bg-red-500" : "bg-emerald-500"
                              }`}
                              style={{ width: `${Math.min(doc * 3, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-[10px] font-bold border uppercase ${statusColor}`}
                        >
                          {doc < 7
                            ? t("status_critical")
                            : doc < 14
                            ? t("status_reorder")
                            : t("status_safe")}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono text-cyan-600 font-bold">
                        {item.pendingPO > 0
                          ? `+${item.pendingPO.toLocaleString()}`
                          : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. AI INTELLIGENCE */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-xl shadow-lg border border-cyan-900/30 text-slate-100 flex flex-col relative overflow-hidden">
          {/* Tech Decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl"></div>

          <div className="flex justify-between items-start mb-4 relative z-10">
            <h3 className="text-lg font-bold text-white flex items-center">
              <Zap className="w-5 h-5 mr-2 text-cyan-400 fill-cyan-400" />
              SemenKita AI Analysis
            </h3>
            <button
              onClick={fetchInsight}
              disabled={loading}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
            >
              <RefreshCw
                className={`w-4 h-4 text-cyan-400 ${
                  loading ? "animate-spin" : ""
                }`}
              />
            </button>
          </div>

          <div className="flex-1 bg-slate-800/40 rounded-lg p-4 border border-cyan-900/30 overflow-y-auto max-h-[300px] scrollbar-thin scrollbar-thumb-slate-700 relative z-10 shadow-inner">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full space-y-3 opacity-70">
                <RefreshCw className="w-8 h-8 animate-spin text-cyan-500" />
                <span className="text-xs font-mono text-cyan-200">
                  {t("processing_supply_chain")}
                </span>
              </div>
            ) : (
              <div className="prose prose-invert prose-sm max-w-none">
                <p className="text-xs font-mono leading-relaxed whitespace-pre-line text-cyan-50/90 font-medium">
                  {insight}
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 relative z-10">
            <button className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-bold uppercase tracking-wide transition-colors flex items-center justify-center shadow-[0_0_10px_rgba(8,145,178,0.3)]">
              {t("create_requisition")}
              <ArrowRight className="w-3 h-3 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockForecast;
