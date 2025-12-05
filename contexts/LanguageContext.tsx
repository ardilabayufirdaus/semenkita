import React, { createContext, useContext, useState, useEffect } from "react";

type Lang = "en" | "id";

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const translations: Record<Lang, Record<string, string>> = {
  en: {
    semenkita: "SEMENKITA",
    intelligent_logistics: "INTELLIGENT LOGISTICS",
    return_to_dashboard: "Return to Dashboard",
    view_logistics_report: "View Logistics Report →",
    view_stock_forecast: "View Stock Forecast →",
    cement_release: "Cement Release",
    plant_availability: "Plant Availability",
    avg_loading_time: "Avg Loading Time",
    bag_breakage_rate: "Bag Breakage Rate",
    dispatch_volume_overview: "Dispatch Volume Overview",
    cement_demand_forecast: "Cement Demand Forecast",
    cement_stock: "Cement Stock",
    working_hours: "Working Hours",
    running_hours: "Running Hours",
    downtime_entry: "Downtime Entry",
    bag_stock_control: "Bag Stock Control",
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    period_label: "Period",
    plant_performance: "Plant Performance",
    packaging_inventory: "Packaging Inventory",
    material: "Material",
    in_label: "In",
    out_label: "Out",
    area_label: "Area",
    time: "Time",
    category: "Category",
    issue: "Issue",
    unit_label: "Unit",
    data_entry: "Data Entry",
    history_log: "History Log",
    view_only_mode: "View Only Mode: You do not have permission to edit data.",
    input_form: "Input Form",
    date: "Date",
    silo: "Silo",
    type: "Type",
    stock_ton: "Stock (Ton)",
    pack: "Pack",
    qty: "Qty",
    select_packing_plant: "Select Packing Plant",
    no_records_found: "No records found.",
    reset: "Reset",
    submit_entry: "Submit Entry",
    data_saved_successfully: "Data Saved Successfully!",
    entry_mode: "ENTRY_MODE",
    plant: "PLANT",
    cement_type: "Cement Type",
    stock_level_ton: "Stock Level (Ton)",
    silo_unit: "Silo Unit",
    pack_type: "Pack Type",
    quantity: "Quantity",
    packer_unit: "Packer Unit",
    normal_hrs: "Normal (Hrs)",
    overtime_hrs: "Overtime (Hrs)",
    effective_hrs: "Effective (Hrs)",
    rest_idle_hrs: "Rest/Idle (Hrs)",
    downtime_type_label: "Downtime Type",
    duration_minutes: "Duration (Minutes)",
    remarks_label: "Remarks",
    material_number: "Material Number",
    stock_in: "Stock In (+)",
    stock_out: "Stock Out (-)",
    damaged_label: "Damaged",
    reject_label: "Reject",
    broken_area: "Broken Area",
    quantity_pcs: "Quantity (Pcs)",
    details: "Details",
    value: "Value",
    dashboard: "Dashboard",
    stock_forecast: "Stock Forecast",
    logistics_perf: "Logistics Perf.",
    packer_perf: "Packer Perf.",
    entry_data: "Entry Data",
    master_data: "Master Data",
    master_data_management: "Master Data Management",
    mode_label: "Mode",
    records_label: "Records",
    plants: "Plants",
    plant_singular: "Plant",
    cement: "Cement",
    packs: "Packs",
    pack_type_singular: "Pack Type",
    bags: "Bags",
    bag_type: "Bag Type",
    bag_type_singular: "Bag Type",
    broken: "Broken",
    bag_broken_type: "Bag Broken Type",
    bag_broken_type_singular: "Broken Bag",
    downtime: "Downtime",
    downtime_type_singular: "Downtime Type",
    search: "Search",
    add_record: "Add Record",
    actions: "Actions",
    plant_name_label: "Packing Plant Name",
    plant_code_label: "Plant Code",
    capacity_ton_hr: "Capacity (Ton/Hr)",
    packer_units: "Packer Units (Qty)",
    silo_units: "Silo Units (Qty)",
    silo_capacity_ton: "Silo Capacity (Ton)",
    dead_stock_ton: "Dead Stock (Ton)",
    code_label: "Code",
    cement_name: "Cement Name",
    description_label: "Description",
    pack_code: "Pack Code",
    pack_name: "Pack Name",
    specification: "Specification",
    material_no: "Material No.",
    price_rp: "Price (Rp)",
    category_label: "Category",
    no_data_found: "No data found.",
    create: "Create",
    edit: "Edit",
    form_loaded_for: "Form loaded for",
    save_record: "Save Record",
    confirm_delete: "Are you sure you want to delete this {entity}?",
    user_mgmt: "User Mgmt",
    system_modules: "System Modules",
    switch_role: "Switch Role",
    sign_out: "Sign Out",
    sign_in: "Sign In",
    email: "Email Address",
    password: "Password",
    demo_credentials: 'Demo: Use any email with password "password123"',
    signing_in: "Signing in...",
    welcome_back: "Welcome Back",
    cancel: "Cancel",
    module: "Module",
    analyzing_dispatch: "Analyzing plant dispatch patterns...",
    daily_dispatch_volume: "Daily Dispatch Volume (Ton)",
    actual_ton: "Actual (Ton)",
    target_ton: "Target (Ton)",
    avg_loading_time_efficiency: "Avg Loading Time (Efficiency)",
    logistics_ai_title: "SemenKita Logistics AI",
    initializing_ai: "Initializing SemenKita AI Analysis...",
  },
  id: {
    semenkita: "SEMENKITA",
    intelligent_logistics: "LOGISTIK CERDAS",
    return_to_dashboard: "Kembali ke Dasbor",
    view_logistics_report: "Lihat Laporan Logistik →",
    view_stock_forecast: "Lihat Perkiraan Stok →",
    cement_release: "Pengeluaran Semen",
    plant_availability: "Ketersediaan Pabrik",
    avg_loading_time: "Rata-rata Waktu Muat",
    bag_breakage_rate: "Tingkat Kerusakan Kantong",
    dispatch_volume_overview: "Ringkasan Volume Pengiriman",
    cement_demand_forecast: "Perkiraan Permintaan Semen",
    cement_stock: "Stok Semen",
    working_hours: "Jam Kerja",
    running_hours: "Jam Berjalan",
    downtime_entry: "Entri Downtime",
    bag_stock_control: "Kontrol Stok Kantong",
    daily: "Harian",
    weekly: "Mingguan",
    monthly: "Bulanan",
    period_label: "Periode",
    plant_performance: "Kinerja Pabrik",
    packaging_inventory: "Inventaris Kemasan",
    material: "Material",
    in_label: "Masuk",
    out_label: "Keluar",
    area_label: "Area",
    time: "Waktu",
    category: "Kategori",
    issue: "Masalah",
    unit_label: "Unit",
    data_entry: "Entri Data",
    history_log: "Riwayat",
    view_only_mode:
      "Mode Hanya Lihat: Anda tidak memiliki izin untuk mengubah data.",
    input_form: "Form Input",
    date: "Tanggal",
    silo: "Silo",
    type: "Tipe",
    stock_ton: "Stok (Ton)",
    pack: "Kemasan",
    qty: "Qty",
    select_packing_plant: "Pilih Packing Plant",
    no_records_found: "Tidak ada data.",
    reset: "Reset",
    submit_entry: "Kirim Entri",
    data_saved_successfully: "Data Berhasil Disimpan!",
    plant: "PABRIK",
    cement_type: "Tipe Semen",
    stock_level_ton: "Tingkat Stok (Ton)",
    pack_type: "Tipe Kemasan",
    quantity: "Kuantitas",
    packer_unit: "Unit Packer",
    normal_hrs: "Normal (Jam)",
    overtime_hrs: "Lembur (Jam)",
    downtime_type_label: "Tipe Downtime",
    duration_minutes: "Durasi (Menit)",
    remarks_label: "Keterangan",
    material_number: "Nomor Material",
    stock_in: "Stok Masuk (+)",
    stock_out: "Stok Keluar (-)",
    damaged_label: "Rusak",
    broken_area: "Area Rusak",
    quantity_pcs: "Kuantitas (Pcs)",
    details: "Detail",
    value: "Nilai",
    dashboard: "Dasbor",
    stock_forecast: "Perkiraan Stok",
    logistics_perf: "Kinerja Logistik",
    packer_perf: "Kinerja Packer",
    entry_data: "Entri Data",
    master_data: "Master Data",
    user_mgmt: "Manajemen Pengguna",
    sign_out: "Keluar",
    sign_in: "Masuk",
    email: "Alamat Email",
    password: "Kata Sandi",
    demo_credentials:
      'Demo: Gunakan email apapun dengan kata sandi "password123"',
    signing_in: "Sedang masuk...",
    welcome_back: "Selamat Datang Kembali",
    cancel: "Batal",
    module: "Modul",
    analyzing_dispatch: "Menganalisis pola pengiriman pabrik...",
    daily_dispatch_volume: "Volume Pengiriman Harian (Ton)",
    actual_ton: "Aktual (Ton)",
    target_ton: "Target (Ton)",
    avg_loading_time_efficiency: "Rata-rata Waktu Muat (Efisiensi)",
    logistics_ai_title: "AI Logistik SemenKita",
    initializing_ai: "Inisialisasi Analisis AI SemenKita...",
  },
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem("semenkita_lang");
      if (saved === "en" || saved === "id") return saved as Lang;
    } catch (e) {}
    return "en";
  });

  useEffect(() => {
    try {
      localStorage.setItem("semenkita_lang", lang);
    } catch (e) {}
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);

  const t = (key: string) => {
    return translations[lang][key] ?? translations["en"][key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};

export default LanguageContext;
