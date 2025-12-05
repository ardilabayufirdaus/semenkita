
export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  STOCK_FORECAST = 'STOCK_FORECAST',
  LOGISTICS_PERFORMANCE = 'LOGISTICS_PERFORMANCE',
  PACKER_PERFORMANCE = 'PACKER_PERFORMANCE',
  STOCK_ENTRY = 'ENTRY_DATA',
  ENTRY_SUMMARY = 'ENTRY_SUMMARY',
  MASTER_DATA = 'MASTER_DATA',
  USER_MANAGEMENT = 'USER_MANAGEMENT'
}

export enum StockCategory {
  ELECTRONICS = 'Electronics',
  APPAREL = 'Apparel',
  HOME_GOODS = 'Home Goods',
  RAW_MATERIAL = 'Raw Material'
}

export interface StockItem {
  id: string;
  sku: string;
  name: string;
  category: StockCategory;
  currentStock: number;
  minThreshold: number;
  lastUpdated: string;
}

export interface PackingPlant {
  id: string;
  plantCode: string; // e.g., AMB, BPN
  plantName: string;
  capacity: number; // Ton per hour
  packerCount: number; // Number of packers available in the plant
  siloCount: number; // Number of silo units
  siloCapacity: number; // Capacity per silo in Ton
  deadStockCapacity: number; // Dead stock capacity in Ton
}

export interface CementType {
  id: string;
  code: string; // e.g., OPC-43, PPC
  name: string;
  description: string;
}

export interface PackType {
  id: string;
  code: string; // e.g., 50KG-HDPE
  name: string; // e.g., 50Kg HDPE Bag
  description: string;
}

export interface BagType {
  id: string;
  material: string; // Material Number (String to support formatting like 120-235-282)
  description: string;
  price: number; // Price in Rp
}

export interface BagBrokenType {
  id: string;
  category: string; // e.g., Packer Machine, Transport Belt
  area: string; // e.g., Mulut, Lem, Body Kantong
}

export interface DowntimeType {
  id: string;
  category: string; // e.g., MECHANICAL, ELECTRICAL, OPERATIONAL
  type: string; // e.g., Motor Failure, No Bags
  description: string;
}

export interface PackerMetric {
  id: string;
  unitName: string; // e.g., Packer 01
  operator: string;
  productType: string; // e.g., PCC
  totalBags: number;
  tonnage: number;
  burstRate: number; // percentage of broken bags
  weightAccuracy: number; // avg deviation from target (e.g., 50.1kg)
  status: 'Running' | 'Maintenance' | 'Idle';
  efficiency: number; // %
}

export interface LogisticsMetric {
  date: string;
  dispatchTon: number;
  avgLoadingTime: number; // minutes
  truckCount: number;
  targetTon: number;
}

export type UserRole = 'Admin' | 'Internal' | 'External';
export type AccessLevel = 'View Only' | 'Can Edit';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  accessLevel: AccessLevel; // New field for granular control
  email: string;
  status: 'Active' | 'Inactive';
}

export interface ForecastDataPoint {
  month: string;
  actual: number | null;
  forecast: number;
}

export interface StockMaster {
  id: string;
  plant: string; // Plant Name from PackingPlant
  material: string; // Material Number
  description: string;
  packType: string; // Pack Type Name from PackType
}

// --- NEW INTERFACES FOR SEARCH & NOTIFICATIONS ---

export type SearchCategory = 'MODULE' | 'PLANT' | 'MATERIAL' | 'ACTION';

export interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  category: SearchCategory;
  targetView?: ViewState; // If it navigates to a view
  action?: () => void; // If it triggers an action
}

export type NotificationType = 'CRITICAL' | 'WARNING' | 'INFO' | 'SUCCESS';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: NotificationType;
  read: boolean;
}
