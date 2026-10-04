/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  CUSTOMER = 'customer',
  STAFF = 'staff',
  ADMIN = 'admin',
}

export interface FamilyMember {
  id: string;
  name: string;
  age: number;
  relation: string;
}

export interface CommodityAllocation {
  productId: string;
  quantity: number;
  consumed: number;
}

export interface RationCard {
  cardNumber: string;
  cardType: 'PHH' | 'NPHH' | 'AYY';
  headOfFamily: string;
  members: FamilyMember[];
  address: string;
  allocations: CommodityAllocation[];
}

export enum Permission {
  MANAGE_INFRASTRUCTURE = 'manage_infrastructure',
  VIEW_AUDIT_LOGS = 'view_audit_logs',
  MANAGE_USER_APPROVALS = 'manage_user_approvals',
  MANAGE_RATION_CARDS = 'manage_ration_cards',
  BROADCAST_SYSTEM_ALERTS = 'broadcast_system_alerts',
  MANAGE_ROLES_PERMISSIONS = 'manage_roles_permissions',
  VIEW_REGIONAL_REPORTS = 'view_regional_reports'
}

export interface CustomRole {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  customRoleId?: string; // ID of the custom defined role
  shopId?: string; // For staff, which shop they belong to
  rationCardNumber?: string; // For customers
  isApproved?: boolean; // New: Access approval status
}

export interface Product {
  id: string;
  name: string;
  tamilName: string;
  price: number;
  unit: string;
  stock: number;
  category: 'Rice' | 'Sugar' | 'Oil' | 'Dhal' | 'Other';
}

export interface RationShop {
  id: string;
  name: string;
  code: string;
  address: string;
  pincode: string;
  phone: string;
  openingTime: string; // HH:mm
  closingTime: string; // HH:mm
  lunchStart: string; // HH:mm
  lunchEnd: string; // HH:mm
  latitude: number;
  longitude: number;
  products: Product[];
}

export interface AppState {
  shops: RationShop[];
  currentUser: User | null;
}

export interface Notification {
  id: string;
  userId?: string; // If empty, it's system-wide
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  timestamp: string;
  read: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
  targetId?: string;
  targetType?: 'shop' | 'user' | 'product';
}

export interface BillItem {
  productId: string;
  name: string;
  tamilName: string;
  quantity: number;
  price: number;
  unit: string;
  total: number;
}

export interface Bill {
  id: string;
  billNumber: string;
  shopId: string;
  shopName: string;
  cardNumber: string;
  headOfFamily: string;
  items: BillItem[];
  totalAmount: number;
  timestamp: string;
  operatorId: string;
  operatorName: string;
  paymentMode: 'Cash' | 'UPI' | 'Card';
}

