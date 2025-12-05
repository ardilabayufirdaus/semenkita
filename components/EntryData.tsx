import React, { useState } from "react";
import {
  ClipboardCheck,
  Save,
  Layers,
  Package,
  Clock,
  Activity,
  Timer,
  ShoppingBag,
  AlertTriangle,
  ChevronRight,
  User,
  Hash,
  FileText,
  History,
  Filter,
  Download,
  CalendarDays,
  Lock,
} from "lucide-react";
import {
  CementType,
  PackType,
  BagType,
  DowntimeType,
  PackingPlant,
  BagBrokenType,
  User as UserType,
} from "../types";
import { useLanguage } from "../contexts/LanguageContext";

// Mock Data references mirroring Master Data for Dropdowns
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

const cementTypes: CementType[] = [
  {
    id: "1",
    code: "OPC",
    name: "Ordinary Portland Cement",
    description:
      "Semen Portland biasa (Tipe I), kekuatan awal tinggi, cocok untuk konstruksi umum, bangunan bertingkat, jalan, dan precast.",
  },
  {
    id: "2",
    code: "PCC",
    name: "Portland Composite Cement",
    description:
      "Semen Portland Komposit (SNI 7064:2014), campuran OPC + pozolan + filler (biasanya batu kapur), serbaguna, ramah lingkungan, cocok untuk hampir semua jenis pekerjaan beton (bangunan rumah, gedung, jembatan, dll).",
  },
  {
    id: "3",
    code: "PPC",
    name: "Portland Pozzolana Cement",
    description:
      "Semen Portland Pozolan, campuran OPC + material pozolan (fly ash/abu terbang atau pozolan alam), tahan sulfat, cocok untuk struktur hidrolis (bendungan, pelabuhan, irigasi, fondasi di tanah agresif).",
  },
];

const packTypes: PackType[] = [
  { id: "1", code: "50KG-HDPE", name: "50 Kg HDPE Bag", description: "" },
  { id: "2", code: "50KG-PP", name: "50 Kg PP Woven Bag", description: "" },
  { id: "3", code: "50KG-AD*", name: "50 Kg AD* Paper Bag", description: "" },
  { id: "4", code: "40KG-PP", name: "40 Kg PP Woven Bag", description: "" },
  { id: "5", code: "1T-JUMBO", name: "1 Ton Jumbo Bag", description: "" },
  { id: "6", code: "1.5T-JUMBO", name: "1.5 Ton Jumbo Bag", description: "" },
  { id: "7", code: "BULK", name: "Bulk / Curah", description: "" },
  { id: "8", code: "25KG-PP", name: "25 Kg PP Bag", description: "" },
  {
    id: "9",
    code: "50KG-BIGBAG",
    name: "50 Kg Big Bag (Sling Bag)",
    description: "",
  },
];

const bagTypes: BagType[] = [
  {
    id: "1",
    material: "121-400-0800",
    description: "CEMENT BAG;PST;WV;STD;1P;PCC50KG;ST",
    price: 2757,
  },
  {
    id: "2",
    material: "121-400-0620",
    description: "CEMENT BAG;PST;KRAFT;2P;PCC50KG;ST",
    price: 3621,
  },
  {
    id: "3",
    material: "121-400-6070",
    description: "CEMENT BAG;WOVEN;PASTED;1P;50KG;DYN",
    price: 2774,
  },
  {
    id: "4",
    material: "121-400-0780",
    description: "CEMENT BAG;PST;WV;STD;1P;PCC40KG;ST",
    price: 2194,
  },
  {
    id: "5",
    material: "121-400-0802",
    description: "CEMENT BAG;PST;WV;PRM;1P;PCC50KG;ST",
    price: 2818,
  },
];

const bagBrokenTypes: BagBrokenType[] = [
  { id: "1", category: "Packer Machine", area: "Mulut" },
  { id: "2", category: "Packer Machine", area: "Lem" },
  { id: "3", category: "Packer Machine", area: "Body Kantong" },
  { id: "4", category: "Dropping dari Packer ke Belt Conveyor", area: "Mulut" },
  { id: "5", category: "Dropping dari Packer ke Belt Conveyor", area: "Lem" },
  {
    id: "6",
    category: "Dropping dari Packer ke Belt Conveyor",
    area: "Body Kantong",
  },
  { id: "7", category: "Transport Belt Conveyor", area: "Mulut" },
  { id: "8", category: "Transport Belt Conveyor", area: "Lem" },
  { id: "9", category: "Transport Belt Conveyor", area: "Body Kantong" },
  { id: "10", category: "Di Truck", area: "Mulut" },
  { id: "11", category: "Di Truck", area: "Lem" },
  { id: "12", category: "Di Truck", area: "Body Kantong" },
];

const downtimeTypes: DowntimeType[] = [
  {
    id: "1",
    category: "Internal Trouble",
    type: "Mekanikal",
    description: "Kerusakan mekanis pada peralatan produksi (conveyor, dll)",
  },
  {
    id: "2",
    category: "Internal Trouble",
    type: "Proses",
    description:
      "Gangguan proses produksi (plugging, build-up, coating jatuh, red river, overheat, dll)",
  },
  {
    id: "3",
    category: "Internal Trouble",
    type: "Elinst.",
    description:
      "Kerusakan elektrik dan instrumentasi (motor trip, PLC fault, sensor/inverter rusak, kabel putus, dll)",
  },
  {
    id: "4",
    category: "External Trouble",
    type: "Truck N/A",
    description: "Tidak ada truk masuk pabrik / kekurangan armada truk",
  },
  {
    id: "5",
    category: "External Trouble",
    type: "SO/BG/DO",
    description:
      "Truk antri menunggu Surat Order, Berita Acara, atau Delivery Order",
  },
  {
    id: "6",
    category: "External Trouble",
    type: "Ship N/A & Idle Ship",
    description:
      "Tidak ada kapal atau kapal idle menunggu jadwal berthing / tide / pilot",
  },
  {
    id: "7",
    category: "External Trouble",
    type: "Idle truck",
    description:
      "Truk idle di area packing plant karena antrian panjang atau menunggu giliran bongkar muat",
  },
  {
    id: "8",
    category: "External Trouble",
    type: "Kepelabuhan",
    description:
      "Gangguan operasional pelabuhan (dermaga rusak, alur pelayaran dangkal, birokrasi, dll)",
  },
  {
    id: "9",
    category: "External Trouble",
    type: "Stok Semen",
    description: "Silo semen penuh sehingga packing plant harus berhenti",
  },
  {
    id: "10",
    category: "Other External Trouble",
    type: "PLN",
    description:
      "Gangguan listrik dari PLN (pemadaman, tegangan turun, gangguan trafo eksternal)",
  },
  {
    id: "11",
    category: "Other External Trouble",
    type: "Kantong",
    description: "Kehabisan stok kantong sak atau kualitas kantong buruk",
  },
  {
    id: "12",
    category: "Other External Trouble",
    type: "Pallete",
    description:
      "Kehabisan palet atau palet rusak sehingga palletizer tidak bisa beroperasi",
  },
  {
    id: "13",
    category: "Other External Trouble",
    type: "Switch 40/50 & SG/ST",
    description:
      "Pergantian jenis kemasan (40 kg <-> 50 kg) atau pergantian tipe semen (misal SG <-> ST)",
  },
  {
    id: "14",
    category: "Other External Trouble",
    type: "Jaringan/SAP",
    description: "Gangguan sistem SAP, jaringan IT, weighing bridge, atau WMS",
  },
  {
    id: "15",
    category: "Other External Trouble",
    type: "Forklift",
    description:
      "Kekurangan atau kerusakan forklift di area packing plant / gudang",
  },
  {
    id: "16",
    category: "Other External Trouble",
    type: "Operator",
    description:
      "Kekurangan tenaga operator atau absence (sakit, cuti, training, dll)",
  },
  {
    id: "17",
    category: "Other External Trouble",
    type: "Cuaca/Alam",
    description:
      "Hujan deras, banjir, angin kencang, abu vulkanik, gempa, atau bencana alam lainnya",
  },
];

// --- MOCK HISTORY DATA WITH PLANT ID ---
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

type EntryFormType =
  | "CEMENT_STOCK"
  | "CEMENT_RELEASE"
  | "WORKING_HOUR"
  | "RUNNING_HOUR"
  | "DOWNTIME"
  | "BAG_STOCK"
  | "BAG_BROKEN";

type ViewMode = "ENTRY" | "HISTORY";

interface EntryDataProps {
  currentUser: UserType;
}

const EntryData: React.FC<EntryDataProps> = ({ currentUser }) => {
  const { t } = useLanguage();
  const [activeForm, setActiveForm] = useState<EntryFormType>("CEMENT_STOCK");
  const [viewMode, setViewMode] = useState<ViewMode>("ENTRY");
  const [submitted, setSubmitted] = useState(false);

  // Main Filter State
  const [selectedPlant, setSelectedPlant] = useState<string>(mockPlants[0].id);

  // State for Unit Selection in Cement Release
  const [releaseUnit, setReleaseUnit] = useState<"BAGS" | "TON">("BAGS");

  // State for History Filter
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

  const canEdit = currentUser.accessLevel === "Can Edit";

  // Common Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    console.log(`Submitted Form: ${activeForm} for Plant: ${selectedPlant}`);
  };

  const menuItems = [
    {
      id: "CEMENT_STOCK",
      label: t("cement_stock") || "Cement Stock",
      icon: Layers,
      desc: "Silo levels by Cement Type",
    },
    {
      id: "CEMENT_RELEASE",
      label: t("cement_release") || "Cement Release",
      icon: Package,
      desc: "Outbound by Pack Type",
    },
    {
      id: "WORKING_HOUR",
      label: t("working_hours") || "Working Hours",
      icon: Clock,
      desc: "Normal & Overtime logs",
    },
    {
      id: "RUNNING_HOUR",
      label: t("running_hours") || "Running Hours",
      icon: Activity,
      desc: "Effective vs Rest time",
    },
    {
      id: "DOWNTIME",
      label: t("downtime_entry") || "Downtime Entry",
      icon: Timer,
      desc: "Stoppage categorization",
    },
    {
      id: "BAG_STOCK",
      label: t("bag_stock_control") || "Bag Stock Control",
      icon: ShoppingBag,
      desc: "In/Out/Reject flows",
    },
    {
      id: "BAG_BROKEN",
      label: t("bag_broken_detail") || "Bag Broken Detail",
      icon: AlertTriangle,
      desc: "Waste & damage report",
    },
  ];

  const getFilteredHistory = () => {
    const rawData = mockHistoryData[activeForm] || [];
    return rawData.filter((item: any) => {
      const itemDate = new Date(item.date);
      const itemMonth = itemDate.toLocaleString("en-US", { month: "long" });
      const itemYear = itemDate.getFullYear().toString();

      // Strict filtering: Plant AND Month AND Year
      return (
        item.plantId === selectedPlant &&
        itemMonth === filterMonth &&
        itemYear === filterYear
      );
    });
  };

  const renderHistoryTable = () => {
    const data = getFilteredHistory();
    if (data.length === 0)
      return (
        <div className="p-8 text-center text-slate-500 italic bg-slate-50/50">
          {t("no_records_found")}
        </div>
      );
    return (
      <div className="overflow-auto border border-slate-200 rounded">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
            <tr>
              <th className="p-3">{t("date")}</th>
              <th className="p-3">{t("details")}</th>
              <th className="p-3 text-right">{t("value")}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item: any, i: number) => (
              <tr
                key={i}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
              >
                <td className="p-3 font-mono">{item.date}</td>
                <td className="p-3">
                  {activeForm === "CEMENT_STOCK" &&
                    `${item.silo} - ${item.type}`}
                  {activeForm === "CEMENT_RELEASE" &&
                    `${item.ro} - ${item.pack}`}
                  {activeForm === "WORKING_HOUR" && `${item.unit}`}
                  {activeForm === "RUNNING_HOUR" && `${item.unit}`}
                  {activeForm === "DOWNTIME" &&
                    `${item.time} - ${item.category} (${item.type})`}
                  {activeForm === "BAG_STOCK" && `${item.material}`}
                  {activeForm === "BAG_BROKEN" &&
                    `${item.material} - ${item.area}`}
                </td>
                <td className="p-3 text-right font-mono font-bold">
                  {activeForm === "CEMENT_STOCK" &&
                    `${item.stock.toFixed(2)} T`}
                  {activeForm === "CEMENT_RELEASE" &&
                    `${item.qty} ${item.unit}`}
                  {activeForm === "WORKING_HOUR" &&
                    `${item.normal + item.overtime} H`}
                  {activeForm === "RUNNING_HOUR" && `${item.effective} H`}
                  {activeForm === "DOWNTIME" && `${item.duration}m`}
                  {activeForm === "BAG_STOCK" &&
                    `In:${item.in}/Out:${item.out}`}
                  {activeForm === "BAG_BROKEN" && `${item.qty}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderFormContent = () => {
    // STOCKTRON THEME: Input Style classes
    const inputStyle =
      "w-full px-3 py-2.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-sm text-slate-900 font-bold shadow-sm transition-all";
    const labelStyle = "block text-xs font-bold text-slate-500 uppercase mb-1";

    switch (activeForm) {
      case "CEMENT_STOCK":
        const currentPlantSiloCount =
          mockPlants.find((p) => p.id === selectedPlant)?.siloCount || 0;
        const siloOptions = Array.from(
          { length: currentPlantSiloCount },
          (_, i) => `SILO-${String(i + 1).padStart(2, "0")}`
        );
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelStyle}>{t("cement_type")}</label>
                <select className={inputStyle}>
                  {cementTypes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelStyle}>{t("stock_level_ton")}</label>
                <input
                  type="number"
                  step="0.01"
                  className={`${inputStyle} font-mono`}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className={labelStyle}>{t("silo_unit")}</label>
                <select className={inputStyle}>
                  {siloOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelStyle}>{t("stock_taker")}</label>
                <input
                  type="text"
                  className={inputStyle}
                  placeholder="Operator Name"
                />
              </div>
            </div>
          </div>
        );
      case "CEMENT_RELEASE":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelStyle}>{t("ro_number_do")}</label>
                <input
                  type="text"
                  className={`${inputStyle} font-mono uppercase`}
                  placeholder="RO-23-XXXX"
                />
              </div>
              <div>
                <label className={labelStyle}>{t("pack_type")}</label>
                <select className={inputStyle}>
                  {packTypes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code} - {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelStyle}>{t("quantity")}</label>
                <div className="flex">
                  <input
                    type="number"
                    className="flex-1 px-3 py-2.5 bg-white border border-slate-300 rounded-l focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-sm text-slate-900 font-bold shadow-sm font-mono"
                    placeholder="0"
                  />
                  <select
                    value={releaseUnit}
                    onChange={(e) => setReleaseUnit(e.target.value as any)}
                    className="w-24 px-2 py-2.5 bg-slate-50 border border-l-0 border-slate-300 rounded-r text-xs font-bold text-slate-600 outline-none"
                  >
                    <option value="BAGS">BAGS</option>
                    <option value="TON">TON</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelStyle}>{t("cement_type")}</label>
                <select className={inputStyle}>
                  {cementTypes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );
      case "WORKING_HOUR":
        const packerCount =
          mockPlants.find((p) => p.id === selectedPlant)?.packerCount || 0;
        const packerOptions = Array.from(
          { length: packerCount },
          (_, i) => `Packer ${String(i + 1).padStart(2, "0")}`
        );
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelStyle}>{t("packer_unit")}</label>
                <select className={inputStyle}>
                  {packerOptions.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelStyle}>{t("normal_hrs")}</label>
                  <input
                    type="number"
                    className={`${inputStyle} font-mono`}
                    placeholder="8.0"
                  />
                </div>
                <div>
                  <label className={labelStyle}>{t("overtime_hrs")}</label>
                  <input
                    type="number"
                    className={`${inputStyle} font-mono`}
                    placeholder="0.0"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case "RUNNING_HOUR":
        const packerRunCount =
          mockPlants.find((p) => p.id === selectedPlant)?.packerCount || 0;
        const packerRunOptions = Array.from(
          { length: packerRunCount },
          (_, i) => `Packer ${String(i + 1).padStart(2, "0")}`
        );
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelStyle}>{t("packer_unit")}</label>
                <select className={inputStyle}>
                  {packerRunOptions.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelStyle}>{t("effective_hrs")}</label>
                  <input
                    type="number"
                    className={`${inputStyle} font-mono`}
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <label className={labelStyle}>{t("rest_idle_hrs")}</label>
                  <input
                    type="number"
                    className={`${inputStyle} font-mono`}
                    placeholder="0.0"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case "DOWNTIME":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-1">
                <label className={labelStyle}>{t("downtime_type_label")}</label>
                <select className={inputStyle}>
                  <option value="">Select Type...</option>
                  {downtimeTypes.map((d) => (
                    <option key={d.id} value={d.type}>
                      [{d.category}] {d.type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelStyle}>{t("duration_minutes")}</label>
                <input
                  type="number"
                  className={`${inputStyle} font-mono`}
                  placeholder="0"
                />
              </div>
              <div className="col-span-2">
                <label className={labelStyle}>{t("remarks_label")}</label>
                <input
                  type="text"
                  className={inputStyle}
                  placeholder="Details..."
                />
              </div>
            </div>
          </div>
        );
      case "BAG_STOCK":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelStyle}>{t("material_number")}</label>
                <select className={`${inputStyle} font-mono`}>
                  {bagTypes.map((b) => (
                    <option key={b.id} value={b.material}>
                      {b.material} - {b.description.substring(0, 20)}...
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-cyan-600 uppercase mb-1">
                    {t("stock_in")}
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2.5 bg-white border border-cyan-200 rounded focus:ring-1 focus:ring-cyan-600 outline-none text-sm text-slate-900 font-bold shadow-sm font-mono"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-orange-600 uppercase mb-1">
                    {t("stock_out")}
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2.5 bg-white border border-orange-200 rounded focus:ring-1 focus:ring-orange-600 outline-none text-sm text-slate-900 font-bold shadow-sm font-mono"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-rose-600 uppercase mb-1">
                    {t("damaged_label")}
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2.5 bg-white border border-rose-200 rounded focus:ring-1 focus:ring-rose-600 outline-none text-sm text-slate-900 font-bold shadow-sm font-mono"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-rose-600 uppercase mb-1">
                    {t("reject_label")}
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2.5 bg-white border border-rose-200 rounded focus:ring-1 focus:ring-rose-600 outline-none text-sm text-slate-900 font-bold shadow-sm font-mono"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case "BAG_BROKEN":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelStyle}>{t("material_number")}</label>
                <select className={`${inputStyle} font-mono`}>
                  {bagTypes.map((b) => (
                    <option key={b.id} value={b.material}>
                      {b.material} - {b.description.substring(0, 20)}...
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelStyle}>{t("broken_area")}</label>
                <select className={inputStyle}>
                  <option value="">Select Area...</option>
                  {bagBrokenTypes.map((b) => (
                    <option key={b.id} value={b.area}>
                      [{b.category}] {b.area}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelStyle}>{t("quantity_pcs")}</label>
                <input
                  type="number"
                  className={`${inputStyle} font-mono`}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
      {/* Sidebar for Forms */}
      <div className="col-span-3 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        {/* Plant Selector */}
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">
            Select Packing Plant
          </label>
          <div className="relative">
            <select
              value={selectedPlant}
              onChange={(e) => setSelectedPlant(e.target.value)}
              className="w-full appearance-none bg-white border border-slate-300 text-slate-800 text-sm font-bold rounded py-2 pl-3 pr-8 leading-tight focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            >
              {mockPlants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.plantCode} - {p.plantName}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
              <ChevronRight className="w-4 h-4 rotate-90" />
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveForm(item.id as EntryFormType)}
                className={`w-full text-left px-4 py-3 flex items-start space-x-3 transition-colors ${
                  activeForm === item.id
                    ? "bg-cyan-50 border-r-4 border-cyan-500"
                    : "hover:bg-slate-50 border-r-4 border-transparent"
                }`}
              >
                <Icon
                  className={`w-5 h-5 mt-0.5 ${
                    activeForm === item.id ? "text-cyan-600" : "text-slate-400"
                  }`}
                />
                <div>
                  <h4
                    className={`text-sm font-bold ${
                      activeForm === item.id
                        ? "text-cyan-900"
                        : "text-slate-700"
                    }`}
                  >
                    {item.label}
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="col-span-9 flex flex-col space-y-6 overflow-hidden">
        {/* Top Bar with View Switcher */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-cyan-100 rounded text-cyan-700">
              {React.createElement(
                menuItems.find((m) => m.id === activeForm)?.icon || Layers,
                { className: "w-5 h-5" }
              )}
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight leading-none">
                {menuItems.find((m) => m.id === activeForm)?.label}
              </h2>
              <p className="text-xs text-slate-500 font-mono mt-1">
                {t("entry_mode")}: {viewMode} | {t("plant")}:{" "}
                {mockPlants.find((p) => p.id === selectedPlant)?.plantCode}
              </p>
            </div>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode("ENTRY")}
              className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${
                viewMode === "ENTRY"
                  ? "bg-white text-cyan-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t("data_entry")}
            </button>
            <button
              onClick={() => setViewMode("HISTORY")}
              className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${
                viewMode === "HISTORY"
                  ? "bg-white text-cyan-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t("history_log")}
            </button>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200 overflow-y-auto relative">
          {viewMode === "ENTRY" ? (
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              {!canEdit && (
                <div className="absolute inset-x-6 top-6 z-10 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center shadow-sm">
                  <Lock className="w-4 h-4 text-amber-600 mr-2" />
                  <p className="text-xs font-bold text-amber-800 uppercase">
                    {t("view_only_mode")}
                  </p>
                </div>
              )}

              <div
                className={`flex-1 ${
                  !canEdit
                    ? "mt-14 opacity-60 pointer-events-none select-none grayscale-[0.5]"
                    : ""
                }`}
              >
                <div className="mb-6 pb-4 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-700 uppercase flex items-center">
                    <ClipboardCheck className="w-4 h-4 mr-2 text-slate-400" />
                    {t("input_form")}
                  </h3>
                  <div className="text-xs text-slate-400 font-mono">
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
                <fieldset disabled={!canEdit} className="contents">
                  {renderFormContent()}
                </fieldset>
              </div>

              {canEdit && (
                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-end space-x-4">
                  {submitted && (
                    <span className="text-sm font-bold text-emerald-600 animate-pulse">
                      {t("data_saved_successfully")}
                    </span>
                  )}
                  <button
                    type="button"
                    className="px-6 py-2.5 rounded border border-slate-300 text-slate-600 text-xs font-bold uppercase hover:bg-slate-50 transition-colors"
                  >
                    {t("reset")}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded bg-cyan-600 text-white text-xs font-bold uppercase hover:bg-cyan-700 shadow-lg shadow-cyan-200 transition-colors flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {t("submit_entry")}
                  </button>
                </div>
              )}
            </form>
          ) : (
            renderHistoryTable()
          )}
        </div>
      </div>
    </div>
  );
};

export default EntryData;
