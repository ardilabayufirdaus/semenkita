import React, { useState } from "react";
import {
  Calendar,
  Printer,
  Filter,
  Layers,
  Package,
  Clock,
  Activity,
  Timer,
  ShoppingBag,
  AlertTriangle,
  Factory,
  CalendarDays,
  CalendarRange,
} from "lucide-react";
import { PackingPlant } from "../types";
import { useLanguage } from "../contexts/LanguageContext";

// Mock Plants Source (Simulating Master Data)
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

// DATA SOURCE OF TRUTH (Synced with EntryData.tsx)
const mockHistoryData: any = {
  CEMENT_STOCK: [
    {
      date: "2023-10-25",
      plantId: "1",
      silo: "SILO-01",
      type: "OPC",
      stock: 450.5,
      taker: "John Doe",
    },
    {
      date: "2023-10-25",
      plantId: "1",
      silo: "SILO-02",
      type: "PPC",
      stock: 320.0,
      taker: "Jane Smith",
    },
    {
      date: "2023-10-24",
      plantId: "1",
      silo: "SILO-01",
      type: "OPC",
      stock: 500.2,
      taker: "Mike Ross",
    },
    {
      date: "2023-10-25",
      plantId: "2",
      silo: "SILO-A",
      type: "PCC",
      stock: 600.0,
      taker: "Admin",
    },
  ],
  CEMENT_RELEASE: [
    {
      date: "2023-10-25",
      plantId: "1",
      ro: "RO-23-1001",
      type: "PCC",
      pack: "50KG-HDPE",
      qty: 500,
      unit: "BAGS",
    },
    {
      date: "2023-10-25",
      plantId: "1",
      ro: "RO-23-1002",
      type: "PPC",
      pack: "1T-JUMBO",
      qty: 25.5,
      unit: "TON",
    },
    {
      date: "2023-10-24",
      plantId: "1",
      ro: "RO-23-0998",
      type: "OPC",
      pack: "50KG-PP",
      qty: 1000,
      unit: "BAGS",
    },
    {
      date: "2023-10-25",
      plantId: "2",
      ro: "RO-23-1005",
      type: "OPC",
      pack: "50KG-HDPE",
      qty: 2000,
      unit: "BAGS",
    },
  ],
  WORKING_HOUR: [
    {
      date: "2023-10-25",
      plantId: "1",
      unit: "Packer 01",
      normal: 8.0,
      overtime: 2.0,
    },
    {
      date: "2023-10-25",
      plantId: "1",
      unit: "Packer 02",
      normal: 8.0,
      overtime: 0.0,
    },
    {
      date: "2023-10-24",
      plantId: "1",
      unit: "Packer 01",
      normal: 7.5,
      overtime: 1.5,
    },
    {
      date: "2023-10-25",
      plantId: "2",
      unit: "Packer 01",
      normal: 8.0,
      overtime: 1.0,
    },
  ],
  RUNNING_HOUR: [
    {
      date: "2023-10-25",
      plantId: "1",
      unit: "Packer 01",
      effective: 6.5,
      rest: 1.5,
    },
    {
      date: "2023-10-25",
      plantId: "1",
      unit: "Packer 02",
      effective: 7.0,
      rest: 1.0,
    },
    {
      date: "2023-10-25",
      plantId: "2",
      unit: "Packer 01",
      effective: 7.5,
      rest: 0.5,
    },
  ],
  DOWNTIME: [
    {
      date: "2023-10-25",
      plantId: "1",
      category: "Internal Trouble",
      type: "Mekanikal",
      duration: 45,
      time: "10:30",
      remarks: "Belt realigned",
    },
    {
      date: "2023-10-24",
      plantId: "1",
      category: "External Trouble",
      type: "Truck N/A",
      duration: 15,
      time: "14:15",
      remarks: "Waiting for trucks",
    },
    {
      date: "2023-10-25",
      plantId: "2",
      category: "Other External Trouble",
      type: "PLN",
      duration: 30,
      time: "09:00",
      remarks: "Power outage",
    },
  ],
  BAG_STOCK: [
    {
      date: "2023-10-25",
      plantId: "1",
      material: "121-400-0800",
      in: 5000,
      out: 4200,
      damaged: 12,
      reject: 5,
    },
    {
      date: "2023-10-24",
      plantId: "1",
      material: "121-400-6070",
      in: 0,
      out: 1500,
      damaged: 2,
      reject: 0,
    },
    {
      date: "2023-10-25",
      plantId: "2",
      material: "121-400-0800",
      in: 2000,
      out: 1000,
      damaged: 5,
      reject: 2,
    },
  ],
  BAG_BROKEN: [
    {
      date: "2023-10-25",
      plantId: "1",
      material: "121-400-0800",
      area: "Mulut",
      qty: 12,
    },
    {
      date: "2023-10-25",
      plantId: "1",
      material: "121-400-0620",
      area: "Lem",
      qty: 3,
    },
    {
      date: "2023-10-25",
      plantId: "2",
      material: "121-400-0800",
      area: "Body Kantong",
      qty: 5,
    },
  ],
};

type ReportMode = "DAILY" | "WEEKLY" | "MONTHLY";

const EntrySummary: React.FC = () => {
  const { t } = useLanguage();
  const [reportMode, setReportMode] = useState<ReportMode>("MONTHLY");
  const [selectedPlant, setSelectedPlant] = useState<string>(mockPlants[0].id);

  // Filters
  const [filterDate, setFilterDate] = useState<string>("2023-10-25");
  const [filterWeek, setFilterWeek] = useState<string>("2023-W43");
  const [filterMonth, setFilterMonth] = useState<string>("October");
  const [filterYear, setFilterYear] = useState<string>("2023");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const years = ["2023", "2024", "2025"];

  // Helper to get ISO Week number from date
  const getWeekNumber = (d: Date) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(
      ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
    );
    return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
  };

  const getFilteredData = (category: string) => {
    const data = mockHistoryData[category] || [];
    return data.filter((item: any) => {
      if (item.plantId !== selectedPlant) return false;

      const itemDateObj = new Date(item.date);

      if (reportMode === "DAILY") {
        return item.date === filterDate;
      } else if (reportMode === "WEEKLY") {
        const itemWeek = getWeekNumber(itemDateObj);
        return itemWeek === filterWeek;
      } else {
        // MONTHLY
        const itemMonth = itemDateObj.toLocaleString("en-US", {
          month: "long",
        });
        const itemYear = itemDateObj.getFullYear().toString();
        return itemMonth === filterMonth && itemYear === filterYear;
      }
    });
  };

  const getCategoryBadgeStyle = (category: string) => {
    switch (category) {
      case "Internal Trouble":
        return "bg-red-100 text-red-800 border-red-200";
      case "External Trouble":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Other External Trouble":
        return "bg-slate-100 text-slate-800 border-slate-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  const SectionHeader: React.FC<{
    title: string;
    icon: React.ElementType;
    color: string;
  }> = ({ title, icon: Icon, color }) => (
    <div
      className={`flex items-center space-x-2 py-3 border-b-2 ${color} mb-4 mt-8 first:mt-0`}
    >
      <div
        className={`p-1.5 rounded-md ${color
          .replace("border-", "bg-")
          .replace("600", "100")}`}
      >
        <Icon className={`w-5 h-5 ${color.replace("border-", "text-")}`} />
      </div>
      <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
        {title}
      </h3>
    </div>
  );

  const EmptyState = ({ colSpan }: { colSpan: number }) => (
    <tr>
      <td
        colSpan={colSpan}
        className="p-8 text-center text-slate-400 text-xs italic bg-slate-50/50"
      >
        No records found for the selected {reportMode.toLowerCase()} period.
      </td>
    </tr>
  );

  const currentPlantName =
    mockPlants.find((p) => p.id === selectedPlant)?.plantName ||
    "Unknown Plant";

  const getReportPeriodLabel = () => {
    if (reportMode === "DAILY")
      return new Date(filterDate).toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    if (reportMode === "WEEKLY")
      return `WEEK ${filterWeek.split("-W")[1]}, ${filterWeek.split("-W")[0]}`;
    return `${filterMonth.toUpperCase()} ${filterYear}`;
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Control Panel */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex flex-col xl:flex-row justify-between items-start xl:items-center sticky top-0 z-10 backdrop-blur-md bg-white/90">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full xl:w-auto">
          {/* Report Type Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-md border border-slate-200">
            <button
              onClick={() => setReportMode("DAILY")}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase transition-all ${
                reportMode === "DAILY"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t("daily")}
            </button>
            <button
              onClick={() => setReportMode("WEEKLY")}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase transition-all ${
                reportMode === "WEEKLY"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t("weekly")}
            </button>
            <button
              onClick={() => setReportMode("MONTHLY")}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase transition-all ${
                reportMode === "MONTHLY"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t("monthly")}
            </button>
          </div>

          {/* Plant Filter */}
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-300 rounded px-3 py-1.5 min-w-[200px]">
            <Factory className="w-4 h-4 text-slate-500" />
            <div className="flex-1">
              <h2 className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-0.5">
                {t("plant")}
              </h2>
              <select
                value={selectedPlant}
                onChange={(e) => setSelectedPlant(e.target.value)}
                className="text-xs font-bold text-slate-700 bg-transparent outline-none cursor-pointer w-full hover:text-blue-600 transition-colors"
              >
                {mockPlants.map((plant) => (
                  <option key={plant.id} value={plant.id}>
                    {plant.plantName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Filters based on Mode */}
        <div className="flex space-x-3 mt-4 xl:mt-0 w-full xl:w-auto justify-between xl:justify-end items-center">
          {/* DATE PICKERS */}
          <div className="flex items-center bg-slate-50 border border-slate-300 rounded shadow-sm px-3 py-2">
            {reportMode === "DAILY" && (
              <div className="flex items-center">
                <CalendarDays className="w-4 h-4 text-slate-400 mr-2" />
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-700 outline-none uppercase font-mono"
                />
              </div>
            )}

            {reportMode === "WEEKLY" && (
              <div className="flex items-center">
                <CalendarRange className="w-4 h-4 text-slate-400 mr-2" />
                <input
                  type="week"
                  value={filterWeek}
                  onChange={(e) => setFilterWeek(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-700 outline-none uppercase font-mono"
                />
              </div>
            )}

            {reportMode === "MONTHLY" && (
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-slate-400 mr-2" />
                <select
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  className="text-xs font-bold text-slate-700 bg-transparent outline-none cursor-pointer hover:text-blue-600"
                >
                  {months.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <div className="w-px h-4 bg-slate-300 mx-2"></div>
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="text-xs font-bold text-slate-700 bg-transparent outline-none cursor-pointer hover:text-blue-600"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <button className="flex items-center px-4 py-2 bg-slate-800 text-white rounded text-xs font-bold uppercase tracking-wide hover:bg-slate-700 shadow-sm transition-colors">
            <Printer className="w-4 h-4 mr-2" />
            {t("print")}
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-8 min-h-screen">
        <div className="text-center mb-8 pb-8 border-b border-slate-100">
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
            {t("operational_report")} - {reportMode}
          </h1>
          <div className="flex justify-center items-center space-x-4 mt-2 text-sm font-mono text-slate-500">
            <span>
              {t("period_label")}:{" "}
              <span className="text-slate-800 font-bold">
                {getReportPeriodLabel().toUpperCase()}
              </span>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-blue-600 font-bold">
              {t("plant")}: {currentPlantName.toUpperCase()}
            </span>
            <span className="text-slate-300">|</span>
            <span>{t("generated_by")}: SYSTEM_ADMIN</span>
          </div>
        </div>

        {/* SECTION 1: CEMENT LOGISTICS */}
        <SectionHeader
          title="Cement Logistics"
          icon={Layers}
          color="border-blue-600"
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cement Stock Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Cement Stock Log
            </h4>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 font-bold text-slate-600 uppercase">
                  <tr>
                    <th className="p-3 border-b border-slate-200">
                      {t("date")}
                    </th>
                    <th className="p-3 border-b border-slate-200">
                      {t("silo")}
                    </th>
                    <th className="p-3 border-b border-slate-200">
                      {t("type")}
                    </th>
                    <th className="p-3 border-b border-slate-200 text-right">
                      {t("stock_ton")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {getFilteredData("CEMENT_STOCK").length > 0 ? (
                    getFilteredData("CEMENT_STOCK").map(
                      (item: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-3 font-mono text-slate-600">
                            {item.date}
                          </td>
                          <td className="p-3 font-bold text-slate-700">
                            {item.silo}
                          </td>
                          <td className="p-3">{item.type}</td>
                          <td className="p-3 text-right font-mono font-bold text-slate-800">
                            {item.stock.toFixed(2)}
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <EmptyState colSpan={4} />
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cement Release Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Cement Release Log
            </h4>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 font-bold text-slate-600 uppercase">
                  <tr>
                    <th className="p-3 border-b border-slate-200">
                      {t("date")}
                    </th>
                    <th className="p-3 border-b border-slate-200">
                      {t("ro_no")}
                    </th>
                    <th className="p-3 border-b border-slate-200">
                      {t("pack")}
                    </th>
                    <th className="p-3 border-b border-slate-200 text-right">
                      {t("qty")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {getFilteredData("CEMENT_RELEASE").length > 0 ? (
                    getFilteredData("CEMENT_RELEASE").map(
                      (item: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-3 font-mono text-slate-600">
                            {item.date}
                          </td>
                          <td className="p-3 font-mono font-bold text-slate-700">
                            {item.ro}
                          </td>
                          <td className="p-3">{item.pack}</td>
                          <td className="p-3 text-right font-mono font-bold text-blue-700">
                            {item.qty.toLocaleString()}{" "}
                            <span className="text-[9px] text-slate-400 ml-1">
                              {item.unit}
                            </span>
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <EmptyState colSpan={4} />
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SECTION 2: PLANT PERFORMANCE */}
        <SectionHeader
          title="Plant Performance"
          icon={Activity}
          color="border-emerald-600"
        />
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Working Hours */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center">
                <Clock className="w-3.5 h-3.5 mr-2 text-emerald-600" />
                Working Hours
              </h4>
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 font-bold text-slate-600 uppercase">
                    <tr>
                      <th className="p-3 border-b border-slate-200">
                        {t("date")}
                      </th>
                      <th className="p-3 border-b border-slate-200">
                        {t("unit_label")}
                      </th>
                      <th className="p-3 border-b border-slate-200 text-right">
                        {t("normal_hrs")}
                      </th>
                      <th className="p-3 border-b border-slate-200 text-right">
                        {t("overtime_hrs")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {getFilteredData("WORKING_HOUR").length > 0 ? (
                      getFilteredData("WORKING_HOUR").map(
                        (item: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-3 font-mono text-slate-600">
                              {item.date}
                            </td>
                            <td className="p-3 font-bold text-slate-700">
                              {item.unit}
                            </td>
                            <td className="p-3 text-right font-mono">
                              {item.normal}
                            </td>
                            <td className="p-3 text-right font-mono font-bold text-amber-600">
                              {item.overtime}
                            </td>
                          </tr>
                        )
                      )
                    ) : (
                      <EmptyState colSpan={4} />
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Running Hours */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center">
                <Activity className="w-3.5 h-3.5 mr-2 text-emerald-600" />
                Running Hours
              </h4>
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 font-bold text-slate-600 uppercase">
                    <tr>
                      <th className="p-3 border-b border-slate-200">
                        {t("date")}
                      </th>
                      <th className="p-3 border-b border-slate-200">
                        {t("unit_label")}
                      </th>
                      <th className="p-3 border-b border-slate-200 text-right">
                        {t("effective_hrs")}
                      </th>
                      <th className="p-3 border-b border-slate-200 text-right">
                        {t("rest_idle_hrs")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {getFilteredData("RUNNING_HOUR").length > 0 ? (
                      getFilteredData("RUNNING_HOUR").map(
                        (item: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-3 font-mono text-slate-600">
                              {item.date}
                            </td>
                            <td className="p-3 font-bold text-slate-700">
                              {item.unit}
                            </td>
                            <td className="p-3 text-right font-mono font-bold text-emerald-600">
                              {item.effective}
                            </td>
                            <td className="p-3 text-right font-mono">
                              {item.rest}
                            </td>
                          </tr>
                        )
                      )
                    ) : (
                      <EmptyState colSpan={4} />
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Downtime - Full Width */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center">
              <Timer className="w-3.5 h-3.5 mr-2 text-red-600" />
              Downtime Record
            </h4>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 font-bold text-slate-600 uppercase">
                  <tr>
                    <th className="p-3 border-b border-slate-200">
                      {t("date")}
                    </th>
                    <th className="p-3 border-b border-slate-200">
                      {t("time")}
                    </th>
                    <th className="p-3 border-b border-slate-200">
                      {t("category")}
                    </th>
                    <th className="p-3 border-b border-slate-200">
                      {t("issue")}
                    </th>
                    <th className="p-3 border-b border-slate-200 text-right">
                      {t("duration_minutes")}
                    </th>
                    <th className="p-3 border-b border-slate-200">
                      {t("remarks_label")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {getFilteredData("DOWNTIME").length > 0 ? (
                    getFilteredData("DOWNTIME").map(
                      (item: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-3 font-mono text-slate-600">
                            {item.date}
                          </td>
                          <td className="p-3 font-mono text-slate-600">
                            {item.time}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getCategoryBadgeStyle(
                                item.category
                              )}`}
                            >
                              {item.category}
                            </span>
                          </td>
                          <td className="p-3 font-medium text-slate-700">
                            {item.type}
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-red-600">
                            {item.duration}m
                          </td>
                          <td className="p-3 text-slate-500 italic">
                            {item.remarks}
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <EmptyState colSpan={6} />
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SECTION 3: PACKAGING INVENTORY */}
        <SectionHeader
          title="Packaging Inventory"
          icon={ShoppingBag}
          color="border-amber-600"
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bag Stock */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center">
              <ShoppingBag className="w-3.5 h-3.5 mr-2 text-amber-600" />
              Bag Stock Flow
            </h4>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 font-bold text-slate-600 uppercase">
                  <tr>
                    <th className="p-3 border-b border-slate-200">
                      {t("date")}
                    </th>
                    <th className="p-3 border-b border-slate-200">
                      {t("material")}
                    </th>
                    <th className="p-3 border-b border-slate-200 text-right">
                      {t("in_label")}
                    </th>
                    <th className="p-3 border-b border-slate-200 text-right">
                      {t("out_label")}
                    </th>
                    <th className="p-3 border-b border-slate-200 text-right">
                      {t("reject_label")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {getFilteredData("BAG_STOCK").length > 0 ? (
                    getFilteredData("BAG_STOCK").map(
                      (item: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-3 font-mono text-slate-600">
                            {item.date}
                          </td>
                          <td className="p-3 font-mono font-bold text-slate-700">
                            {item.material}
                          </td>
                          <td className="p-3 text-right font-mono text-blue-600">
                            {item.in}
                          </td>
                          <td className="p-3 text-right font-mono text-orange-600">
                            {item.out}
                          </td>
                          <td className="p-3 text-right font-mono text-red-600 font-bold">
                            {item.reject + item.damaged}
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <EmptyState colSpan={5} />
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bag Broken */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center">
              <AlertTriangle className="w-3.5 h-3.5 mr-2 text-red-600" />
              Bag Broken Detail
            </h4>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 font-bold text-slate-600 uppercase">
                  <tr>
                    <th className="p-3 border-b border-slate-200">
                      {t("date")}
                    </th>
                    <th className="p-3 border-b border-slate-200">
                      {t("material")}
                    </th>
                    <th className="p-3 border-b border-slate-200">
                      {t("area_label")}
                    </th>
                    <th className="p-3 border-b border-slate-200 text-right">
                      {t("qty")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {getFilteredData("BAG_BROKEN").length > 0 ? (
                    getFilteredData("BAG_BROKEN").map(
                      (item: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-3 font-mono text-slate-600">
                            {item.date}
                          </td>
                          <td className="p-3 font-mono font-bold text-slate-700">
                            {item.material}
                          </td>
                          <td className="p-3 text-[10px] font-bold uppercase">
                            {item.area}
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-rose-600">
                            {item.qty}
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <EmptyState colSpan={4} />
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntrySummary;
