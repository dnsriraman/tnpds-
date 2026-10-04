/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic, 
  MicOff, 
  HelpCircle, 
  Compass,
  FileSpreadsheet,
  Cloud,
  Database,
  RefreshCw,
  ExternalLink,
  Lock,
  Settings,
  Store, 
  Clock, 
  MapPin, 
  Phone, 
  ChevronRight, 
  Search, 
  User as UserIcon, 
  LogOut,
  Package,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  AlertCircle,
  CreditCard,
  Users,
  Info,
  Bell,
  Cpu,
  RotateCcw,
  QrCode,
  Printer,
  Download,
  TrendingUp,
  Calendar,
  Navigation,
  Layers,
  Building2
} from 'lucide-react';
import { signInWithGoogle, logoutUser, db } from './services/firebase';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { RationShop, User, UserRole, Product, RationCard, Notification, AuditLog, Permission, CustomRole, Bill, BillItem } from './types';
import { STORAGE_KEYS, INITIAL_PRODUCTS } from './constants';
import { cn, calculateDistance, isShopOpen } from './lib/utils';
import { api } from './services/api';
import { syncManager } from './services/syncManager';
import QRScannerModal from './components/QRScannerModal';
import RationShopMap from './components/RationShopMap';
import OfficialGeoDirectory from './components/OfficialGeoDirectory';
import { getAllRationShops, TN_DISTRICTS, TOTAL_SHOPS_COUNT } from './services/shopsData';

// --- Components ---

const Sidebar = ({ user, onLogout, onTabChange, activeTab, notificationCount, onToggleNotifications }: { user: User | null; onLogout: () => void; onTabChange: (tab: string) => void; activeTab: string; notificationCount: number; onToggleNotifications: () => void }) => (
  <aside className="w-72 bg-emerald-900 text-white hidden md:flex flex-col h-screen sticky top-0 shrink-0">
    <div className="p-8 flex items-center gap-4 border-b border-emerald-800/50">
      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
        <Store className="text-emerald-900 w-7 h-7" />
      </div>
      <div>
        <h1 className="font-black text-xl leading-tight tracking-tight">TN-PDS</h1>
        <p className="text-[10px] font-bold opacity-50 uppercase tracking-[0.2em]">Consumer Portal</p>
      </div>
    </div>
    
    <nav className="flex-1 py-10 px-6 space-y-3" role="navigation" aria-label="Main Navigation">
      <button 
        onClick={() => onTabChange('home')}
        aria-current={activeTab === 'home' ? 'page' : undefined}
        className={cn(
          "w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold text-sm group",
          activeTab === 'home' 
            ? "bg-emerald-800 shadow-lg shadow-emerald-950/20 text-white" 
            : "text-emerald-300/70 hover:bg-emerald-800/40 hover:text-white"
        )}
      >
        <MapPin className={cn("w-5 h-5", activeTab === 'home' ? "text-emerald-200" : "text-emerald-500")} aria-hidden="true" />
        <span>Nearby Shops</span>
      </button>

      <button 
        onClick={() => onTabChange('directory')}
        aria-current={activeTab === 'directory' ? 'page' : undefined}
        className={cn(
          "w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold text-sm group",
          activeTab === 'directory' 
            ? "bg-emerald-800 shadow-lg shadow-emerald-950/20 text-white" 
            : "text-emerald-300/70 hover:bg-emerald-800/40 hover:text-white"
        )}
      >
        <Building2 className={cn("w-5 h-5", activeTab === 'directory' ? "text-emerald-200" : "text-emerald-500")} aria-hidden="true" />
        <span>TNCSC Geo Directory</span>
      </button>

      <button 
        onClick={onToggleNotifications}
        aria-label={`Show alerts${notificationCount > 0 ? `, ${notificationCount} unread` : ''}`}
        className="w-full flex items-center justify-between p-4 rounded-2xl transition-all font-bold text-sm text-emerald-300/70 hover:bg-emerald-800/40 hover:text-white"
      >
        <div className="flex items-center gap-4">
          <Bell className={cn("w-5 h-5", notificationCount > 0 ? "text-emerald-400 animate-bounce" : "text-emerald-500")} aria-hidden="true" />
          <span>Alerts</span>
        </div>
        {notificationCount > 0 && (
          <span className="bg-emerald-500 text-emerald-950 text-[10px] px-2 py-0.5 rounded-full font-black" aria-hidden="true">
            {notificationCount}
          </span>
        )}
      </button>

      {user?.role === UserRole.CUSTOMER && (
        <button 
          onClick={() => onTabChange('mycard')}
          aria-current={activeTab === 'mycard' ? 'page' : undefined}
          className={cn(
            "w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold text-sm group",
            activeTab === 'mycard' 
              ? "bg-emerald-800 shadow-lg shadow-emerald-950/20 text-white" 
              : "text-emerald-300/70 hover:bg-emerald-800/40 hover:text-white"
          )}
        >
          <CreditCard className={cn("w-5 h-5", activeTab === 'mycard' ? "text-emerald-200" : "text-emerald-500")} aria-hidden="true" />
          <span>My Ration Card</span>
        </button>
      )}
      
      {user?.role === UserRole.ADMIN && (
        <button 
          onClick={() => onTabChange('admin')}
          aria-current={activeTab === 'admin' ? 'page' : undefined}
          className={cn(
            "w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold text-sm",
            activeTab === 'admin' 
              ? "bg-emerald-800 shadow-lg shadow-emerald-950/20 text-white" 
              : "text-emerald-300/70 hover:bg-emerald-800/40 hover:text-white"
          )}
        >
          <Edit2 className="w-5 h-5 text-emerald-500" aria-hidden="true" />
          <span>Admin Board</span>
        </button>
      )}

      {user?.role === UserRole.STAFF && (
        <button 
          onClick={() => onTabChange('staff')}
          aria-current={activeTab === 'staff' ? 'page' : undefined}
          className={cn(
            "w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold text-sm",
            activeTab === 'staff' 
              ? "bg-emerald-800 shadow-lg shadow-emerald-950/20 text-white" 
              : "text-emerald-300/70 hover:bg-emerald-800/40 hover:text-white"
          )}
        >
          <Package className="w-5 h-5 text-emerald-500" aria-hidden="true" />
          <span>Staff Portal</span>
        </button>
      )}
    </nav>

    <div className="p-8 border-t border-emerald-800/50 space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
        <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">Offline Capacity Ready</span>
      </div>
      
      {user ? (
        <div className="flex items-center gap-4 bg-emerald-800/30 p-3 rounded-2xl border border-emerald-700/30">
          <div className="w-10 h-10 bg-emerald-700 rounded-xl flex items-center justify-center font-bold text-lg">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black truncate">{user.name}</p>
            <p className="text-[9px] opacity-50 uppercase tracking-tighter">{user.role}</p>
          </div>
          <button 
            onClick={onLogout}
            aria-label="Logout"
            className="p-1.5 hover:bg-emerald-800 rounded-lg text-emerald-400 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <button 
          onClick={() => onTabChange('auth')}
          className="w-full py-4 bg-white text-emerald-900 rounded-2xl font-black text-sm shadow-xl shadow-emerald-950/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          Sign In
        </button>
      )}
    </div>
  </aside>
);

const BottomNav = ({ user, onLogout, onTabChange, activeTab, notificationCount, onToggleNotifications }: { user: User | null; onLogout: () => void; onTabChange: (tab: string) => void; activeTab: string; notificationCount: number; onToggleNotifications: () => void }) => (
  <nav className="md:hidden fixed bottom-6 left-6 right-6 z-[100] bg-emerald-900 text-white p-2 rounded-[2rem] shadow-2xl flex items-center justify-around border border-emerald-800/50 backdrop-blur-md" role="navigation" aria-label="Mobile Navigation">
    <button 
      onClick={() => onTabChange('home')}
      aria-label="Nearby Shops"
      aria-current={activeTab === 'home' ? 'page' : undefined}
      className={cn(
        "flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all",
        activeTab === 'home' ? "bg-emerald-800 text-white shadow-lg" : "text-emerald-400/70"
      )}
    >
      <MapPin className="w-5 h-5" aria-hidden="true" />
      <span className="text-[8px] font-black uppercase tracking-widest">Nearby</span>
    </button>

    <button 
      onClick={() => onTabChange('directory')}
      aria-label="Official Directory"
      aria-current={activeTab === 'directory' ? 'page' : undefined}
      className={cn(
        "flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all",
        activeTab === 'directory' ? "bg-emerald-800 text-white shadow-lg" : "text-emerald-400/70"
      )}
    >
      <Building2 className="w-5 h-5" aria-hidden="true" />
      <span className="text-[8px] font-black uppercase tracking-widest">Directory</span>
    </button>

    <button 
      onClick={onToggleNotifications}
      aria-label={`Show alerts${notificationCount > 0 ? `, ${notificationCount} unread` : ''}`}
      className={cn(
        "flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all relative",
        "text-emerald-400/70"
      )}
    >
      <div className="relative">
        <Bell className={cn("w-5 h-5", notificationCount > 0 && "text-emerald-400")} aria-hidden="true" />
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-emerald-900" aria-hidden="true" />
        )}
      </div>
      <span className="text-[8px] font-black uppercase tracking-widest">Alerts</span>
    </button>

    {(user?.role === UserRole.CUSTOMER || !user) && (
      <button 
        onClick={() => onTabChange(user ? 'mycard' : 'auth')}
        aria-label={user ? 'My Ration Card' : 'Login'}
        aria-current={(activeTab === 'mycard' || activeTab === 'auth') ? 'page' : undefined}
        className={cn(
          "flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all",
          (activeTab === 'mycard' || activeTab === 'auth') ? "bg-emerald-800 text-white shadow-lg" : "text-emerald-400/70"
        )}
      >
        {user ? <CreditCard className="w-5 h-5" aria-hidden="true" /> : <UserIcon className="w-5 h-5" aria-hidden="true" />}
        <span className="text-[8px] font-black uppercase tracking-widest">{user ? 'My Card' : 'Login'}</span>
      </button>
    )}

    {user?.role === UserRole.STAFF && (
      <button 
        onClick={() => onTabChange('staff')}
        aria-label="Staff Portal"
        aria-current={activeTab === 'staff' ? 'page' : undefined}
        className={cn(
          "flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all",
          activeTab === 'staff' ? "bg-emerald-800 text-white shadow-lg" : "text-emerald-400/70"
        )}
      >
        <Package className="w-5 h-5" aria-hidden="true" />
        <span className="text-[8px] font-black uppercase tracking-widest">Portal</span>
      </button>
    )}

    {user?.role === UserRole.ADMIN && (
      <button 
        onClick={() => onTabChange('admin')}
        aria-label="Admin Board"
        aria-current={activeTab === 'admin' ? 'page' : undefined}
        className={cn(
          "flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all",
          activeTab === 'admin' ? "bg-emerald-800 text-white shadow-lg" : "text-emerald-400/70"
        )}
      >
        <Edit2 className="w-5 h-5" aria-hidden="true" />
        <span className="text-[8px] font-black uppercase tracking-widest">Admin</span>
      </button>
    )}

    {user && (
      <button 
        onClick={onLogout}
        aria-label="Sign Out"
        className="flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all text-red-400 hover:text-red-300 active:scale-95"
      >
        <LogOut className="w-5 h-5" aria-hidden="true" />
        <span className="text-[8px] font-black uppercase tracking-widest">Out</span>
      </button>
    )}
  </nav>
);

const ShopDetails = ({ shop, user, onAction }: { shop: RationShop; user: User | null; onAction: (tab: string) => void }) => {
  const isAssignedStaff = user?.role === UserRole.STAFF && user.shopId === shop.id;
  const isAdmin = user?.role === UserRole.ADMIN;

  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-2xl max-w-3xl w-full flex flex-col md:flex-row">
      <div className="md:w-72 bg-emerald-900 p-8 md:p-10 text-white flex flex-col justify-between">
        <div>
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
            <Store className="text-emerald-400 w-6 h-6" />
          </div>
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-[0.2em] mb-4">Operations</h3>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-xs opacity-60">Status</span>
              <span className="text-xs font-black text-green-400">OPEN</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-xs opacity-60">Opens</span>
              <span className="text-xs font-black font-mono">{shop.openingTime}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-xs opacity-60">Closes</span>
              <span className="text-xs font-black font-mono">{shop.closingTime}</span>
            </div>
          </div>

          {(isAdmin || isAssignedStaff) && (
            <div className="mt-10 space-y-3 animate-in fade-in slide-in-from-top-2">
              <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Internal Actions</h3>
              {isAdmin && (
                <button 
                  onClick={() => onAction('admin')}
                  className="w-full py-3 bg-white/10 border border-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-3 h-3" /> Edit Node Config
                </button>
              )}
              {isAssignedStaff && (
                <button 
                  onClick={() => onAction('staff')}
                  className="w-full py-3 bg-emerald-500 text-emerald-950 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
                >
                  <Package className="w-3 h-3" /> Manage Inventory
                </button>
              )}
            </div>
          )}
        </div>
        <div className="mt-8 pt-8 border-t border-white/10 hidden md:block">
          <p className="text-[10px] opacity-40 italic leading-relaxed">
            * Real-time stock data provided by TNPDS Digital Ledger.
          </p>
        </div>
      </div>
      
      <div className="flex-1 p-8 md:p-10 space-y-8 md:space-y-10">
        <header>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Shop Code: {shop.code}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">{shop.name}</h2>
          <p className="text-sm text-gray-500 font-medium mt-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 opacity-50 shrink-0" /> {shop.address}
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          <section>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Contact Gateway</h3>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <Phone className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="font-mono font-bold text-gray-700 text-sm">{shop.phone}</p>
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Stock Ledger</h3>
            <div className="space-y-2">
              {shop.products.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50">
                  <div>
                    <p className="text-sm font-bold text-gray-800">{p.name}</p>
                    <p className="text-[10px] text-gray-400 font-tamil">{p.tamilName}</p>
                  </div>
                  <div className="text-right">
                    <span className={cn(
                      "text-xs font-black px-2 py-1 rounded",
                      p.stock > 10 ? "text-emerald-600 bg-emerald-50" : "text-amber-600 bg-amber-50"
                    )}>
                      {p.stock} <span className="text-[10px] opacity-60 uppercase">{p.unit}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Shop Geolocation & Map */}
        <section className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              Geolocation & Shop Map
            </h3>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${shop.latitude},${shop.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-black uppercase tracking-wider text-emerald-700 hover:text-emerald-900 flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-all"
            >
              <Navigation className="w-3 h-3 text-emerald-600" />
              Get Directions
            </a>
          </div>
          <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-md">
            <RationShopMap 
              shops={[shop]} 
              selectedShop={shop} 
              onSelectShop={() => {}} 
              height="200px" 
            />
          </div>
        </section>
      </div>
    </div>
  );
};

const NotificationCenter = ({ 
  notifications, 
  onClose, 
  onMarkRead 
}: { 
  notifications: Notification[]; 
  onClose: () => void;
  onMarkRead: (id: string) => void;
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    className="fixed bottom-24 right-6 md:right-12 md:bottom-12 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 z-[1000] overflow-hidden flex flex-col max-h-[70vh]"
  >
    <header className="p-8 bg-emerald-900 text-white flex justify-between items-center shrink-0">
      <div>
        <h3 className="text-xl font-black">Notifications</h3>
        <p className="text-[10px] uppercase font-black text-emerald-400 tracking-widest mt-1">Communications Hub</p>
      </div>
      <button 
        onClick={onClose} 
        aria-label="Close notifications"
        className="p-2 hover:bg-white/10 rounded-xl transition-colors"
      >
        <X className="w-5 h-5" aria-hidden="true" />
      </button>
    </header>
    
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {notifications.length === 0 ? (
        <div className="py-20 text-center">
          <Bell className="w-12 h-12 text-gray-100 mx-auto mb-4" />
          <p className="text-gray-400 font-medium">No new signals detected.</p>
        </div>
      ) : (
        notifications.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((n) => (
          <div 
            key={n.id} 
            className={cn(
              "p-5 rounded-3xl transition-all border",
              n.read ? "bg-gray-50 border-transparent opacity-60" : "bg-white border-emerald-100 shadow-sm hover:border-emerald-200"
            )}
          >
            <div className="flex justify-between items-start mb-2">
              <span className={cn(
                "text-[8px] font-black uppercase px-2 py-0.5 rounded-full",
                n.type === 'alert' ? "bg-red-100 text-red-600" :
                n.type === 'warning' ? "bg-amber-100 text-amber-600" :
                n.type === 'success' ? "bg-emerald-100 text-emerald-600" :
                "bg-blue-100 text-blue-600"
              )}>
                {n.type}
              </span>
              <span className="text-[10px] text-gray-300 font-mono">
                {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <h4 className="font-black text-gray-900 leading-tight">{n.title}</h4>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">{n.message}</p>
            {!n.read && (
              <button 
                onClick={() => onMarkRead(n.id)}
                className="mt-4 text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline"
              >
                Mark as read
              </button>
            )}
          </div>
        ))
      )}
    </div>
  </motion.div>
);

const RationCardView = ({ card, isAdmin, onAddMember, onScanClick, bills, onViewBill }: { card: RationCard; isAdmin?: boolean; onAddMember?: (card: RationCard) => void; onScanClick?: () => void; bills?: Bill[]; onViewBill?: (bill: Bill) => void }) => (
  <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <header className="flex justify-between items-start flex-wrap gap-6">
      <div className="space-y-2">
        <h2 className="text-4xl font-black text-gray-900 tracking-tight">Smart Ration Card</h2>
        <p className="text-gray-500 font-medium max-w-md">Digital copy of your Tamil Nadu PDS entitlement.</p>
      </div>
      <div className="flex gap-4 items-center flex-wrap">
        {onScanClick && (
          <button
            onClick={onScanClick}
            className="flex items-center gap-3 bg-white hover:bg-emerald-50 border border-emerald-800 text-emerald-900 px-6 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-900/5 transition-all active:scale-95"
            id="scan-card-btn"
          >
            <QrCode className="w-4 h-4 text-emerald-600" />
            <span>Verify Physical QR</span>
          </button>
        )}
        <div className="bg-emerald-900 text-white px-8 py-4 rounded-3xl shadow-xl flex items-center gap-6 border-b-4 border-emerald-950">
          <div>
            <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest leading-none mb-1">Card Number</p>
            <p className="text-xl font-mono font-black">{card.cardNumber}</p>
          </div>
          <div className="w-px h-8 bg-emerald-800" />
          <div className="text-center">
            <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest leading-none mb-1">Type</p>
            <span className="bg-emerald-400 text-emerald-950 px-2 py-0.5 rounded-lg text-xs font-black">{card.cardType}</span>
          </div>
        </div>
      </div>
    </header>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* Family Members */}
      <section className="lg:col-span-1 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-gray-800 flex items-center gap-3">
            <Users className="text-emerald-600 w-5 h-5" aria-hidden="true" />
            Family Unit
          </h3>
          {isAdmin && (
            <button 
              onClick={() => onAddMember?.(card)}
              aria-label="Add family member"
              className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden divide-y divide-gray-50">
          {card.members.map((member, idx) => (
            <div key={member.id} className="p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center font-black text-emerald-700">
                {idx + 1}
              </div>
              <div>
                <p className="font-black text-gray-900 leading-none mb-1">{member.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{member.relation}</span>
                  <div className="w-1 h-1 rounded-full bg-gray-200" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{member.age} Years</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Commodity Ledger */}
      <section className="lg:col-span-2 space-y-6">
        <h3 className="text-xl font-black text-gray-800 flex items-center gap-3">
          <Package className="text-emerald-600 w-5 h-5" />
          Quota & Allocation
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {card.allocations.map((alloc) => {
            const product = INITIAL_PRODUCTS.find(p => p.id === alloc.productId);
            const remaining = Math.max(0, alloc.quantity - alloc.consumed);
            const percentage = (alloc.consumed / alloc.quantity) * 100;

            return (
              <div key={alloc.productId} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Package className="w-20 h-20 text-emerald-900" />
                </div>
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-lg font-black text-gray-900 leading-tight">{product?.name || 'Commodity'}</h4>
                    <p className="text-xs text-gray-400 font-tamil">{product?.tamilName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-emerald-600">{remaining} {product?.unit} Left</p>
                    <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Available</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <span>Usage Progress</span>
                    <span>{percentage.toFixed(0)}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      className={cn(
                        "h-full rounded-full",
                        percentage > 80 ? "bg-red-500" : "bg-emerald-500"
                      )}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mt-2">
                    <span className="text-gray-300">Total: {alloc.quantity} {product?.unit}</span>
                    <span className="bg-gray-50 text-gray-500 px-2 py-0.5 rounded-lg border border-gray-100">
                      Entitlement Level {card.cardType}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex items-start gap-4">
          <div className="w-10 h-10 bg-amber-400 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-200">
             <Info className="text-white w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-black text-amber-900 uppercase tracking-widest mb-1">Administrative Note</h4>
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              Allocations are refreshed on the 1st of every month. Unused quantities do not carry over to the next month. Visit your designated shop to uplift commodities.
            </p>
          </div>
        </div>
      </section>
    </div>

    {/* Bill Receipts History Section */}
    <section className="space-y-6 pt-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl font-black text-gray-800 flex items-center gap-3">
          <FileSpreadsheet className="text-emerald-600 w-5 h-5" />
          Transaction Ledger & Receipts
        </h3>
        {bills && bills.length > 0 && (
          <button
            onClick={() => {
              const headers = ["Invoice Number", "Uplift Date", "Shop Location", "Commodities Outflow", "Total Price (INR)", "Payment Mode"];
              const rows = bills.map(b => [
                b.billNumber,
                new Date(b.timestamp).toISOString(),
                b.shopName || "Local Cooperative FPS",
                b.items.map(item => `${item.name} (${item.quantity} ${item.unit})`).join('; '),
                b.totalAmount.toString(),
                b.paymentMode || "Cash"
              ]);

              const csvContent = [
                headers.join(','),
                ...rows.map(r => r.map(val => `"${val.replace(/"/g, '""')}"`).join(','))
              ].join('\n');

              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.setAttribute("href", url);
              link.setAttribute("download", `tnpds_transaction_ledger_${new Date().toISOString().split('T')[0]}.csv`);
              link.style.visibility = 'hidden';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export Ledger (CSV)
          </button>
        )}
      </div>
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden p-8 space-y-6">
        {bills && bills.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-black uppercase text-gray-400 tracking-wider">
                  <th className="py-4 px-2">Invoice Number</th>
                  <th className="py-4 px-2">Uplift Date</th>
                  <th className="py-4 px-2">Shop Location</th>
                  <th className="py-4 px-2">Commodities Outflow</th>
                  <th className="py-4 px-2 text-right">Total Price</th>
                  <th className="py-4 px-2 text-center text-emerald-850">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bills.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-2 font-mono text-xs font-black text-emerald-700">{b.billNumber}</td>
                    <td className="py-4 px-2 text-xs font-bold text-gray-500">
                      {new Date(b.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-4 px-2 text-xs font-semibold text-gray-500">{b.shopName || "Local Cooperative FPS"}</td>
                    <td className="py-4 px-2 text-xs font-medium text-gray-400 max-w-sm truncate">
                      {b.items.map(item => `${item.name} (${item.quantity} ${item.unit})`).join(', ')}
                    </td>
                    <td className="py-4 px-2 text-xs font-black text-right text-gray-900">₹{b.totalAmount}</td>
                    <td className="py-4 px-2 text-center">
                      <button
                        onClick={() => onViewBill?.(b)}
                        className="px-4 py-2 bg-emerald-50 text-emerald-900 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-900 hover:text-white transition-all shadow-sm"
                      >
                        Print/Preview
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center space-y-3">
            <p className="text-gray-400 font-bold text-sm">No recent commodity transactions found.</p>
            <p className="text-xs text-gray-300">Transaction records appear here once cooperative commodity allocations are distributed and logged at your local shop counter.</p>
          </div>
        )}
      </div>
    </section>
  </div>
);

// --- Main Application ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [shops, setShops] = useState<RationShop[]>(() => getAllRationShops());
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [visibleCardCount, setVisibleCardCount] = useState<number>(24);
  const [rationCards, setRationCards] = useState<RationCard[]>([]);
  const [activeTab, setActiveTab] = useState('home');
  // Billing & Printing States
  const [bills, setBills] = useState<Bill[]>([]);
  const [activeBillSelection, setActiveBillSelection] = useState<Bill | null>(null);
  const [billingQuantities, setBillingQuantities] = useState<{ [productId: string]: string }>({});
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'Card'>('Cash');
  const [staffSubMode, setStaffSubMode] = useState<'members' | 'billing'>('billing');
  const [isSubmittingBill, setIsSubmittingBill] = useState(false);
  const [billError, setBillError] = useState<string | null>(null);
  const [billSearchQuery, setBillSearchQuery] = useState('');
  const [selectedShop, setSelectedShop] = useState<RationShop | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [mapViewMode, setMapViewMode] = useState<'both' | 'map' | 'cards'>('both');
  const [mapFocusedShop, setMapFocusedShop] = useState<RationShop | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [name, setName] = useState('');
  
  // Ration Card Login State
  const [loginMethod, setLoginMethod] = useState<'email' | 'ration'>('ration');
  const [rationCardNumber, setRationCardNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState({ current: 0, total: 0 });

  // Notifications State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [auditSearchTerm, setAuditSearchTerm] = useState('');
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [adminCards, setAdminCards] = useState<RationCard[]>([]);
  const [adminRoles, setAdminRoles] = useState<CustomRole[]>([]);
  const [isAdminView, setIsAdminView] = useState<'infrastructure' | 'audit' | 'users' | 'cards' | 'alerts' | 'approval' | 'roles' | 'sheets'>('infrastructure');
  
  // Google Sheets integration local state
  const [googleSheetsStatus, setGoogleSheetsStatus] = useState<{
    connected: boolean;
    email: string | null;
    name: string | null;
    spreadsheetId: string | null;
    autoSync: boolean;
    hasCredentials: boolean;
  } | null>(null);
  const [sheetsSyncing, setSheetsSyncing] = useState(false);
  const [tempSpreadsheetId, setTempSpreadsheetId] = useState('');
  const [sheetTitle, setSheetTitle] = useState('TNPDS Login Log');
  const [sheetsMessage, setSheetsMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // AI Grounding & Voice State
  const [aiMapQuery, setAiMapQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiGroundingLinks, setAiGroundingLinks] = useState<{ url: string; title: string }[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Data = (reader.result as string).split(',')[1];
          try {
            setIsAiLoading(true);
            const res = await api.transcribeAudio(base64Data, 'audio/webm');
            if (res.text) {
              setAiMapQuery((prev) => prev ? prev + ' ' + res.text.trim() : res.text.trim());
            }
          } catch (e: any) {
            console.error(e);
            alert("Audio transcription failed: " + e.message);
          } finally {
            setIsAiLoading(false);
          }
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err: any) {
      alert("Microphone connection failed or permission denied: " + err.message);
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleAiMapQuerySubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiMapQuery.trim()) return;

    setIsAiLoading(true);
    setAiResponse('');
    setAiGroundingLinks([]);

    try {
      let lat: number | undefined;
      let lng: number | undefined;
      
      try {
        const coords = await new Promise<GeolocationCoordinates>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve(pos.coords),
            (err) => reject(err),
            { timeout: 4000 }
          );
        });
        lat = coords.latitude;
        lng = coords.longitude;
      } catch (locErr) {
        console.warn("Location permission withheld or failed, triggering standard query.");
      }

      const res = await api.queryMapsGrounding(aiMapQuery, lat, lng);
      setAiResponse(res.text);

      const links: { url: string; title: string }[] = [];
      if (res.chunks) {
        res.chunks.forEach((chunk: any) => {
          if (chunk.maps?.uri) {
            links.push({
              url: chunk.maps.uri,
              title: chunk.maps.title || "View on Google Maps"
            });
          } else if (chunk.web?.uri) {
            links.push({
              url: chunk.web.uri,
              title: chunk.web.title || "Reference Source"
            });
          }
        });
      }
      setAiGroundingLinks(links);
    } catch (err: any) {
      setAiResponse("Search query failed: " + err.message);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Load Google Sheets status helper
  const fetchSheetsStatus = async () => {
    try {
      const status = await api.getGoogleSheetsStatus();
      setGoogleSheetsStatus(status);
      if (status.spreadsheetId) {
        setTempSpreadsheetId(status.spreadsheetId);
      }
    } catch (e) {
      console.error("Failed to fetch Google Sheets connection status", e);
    }
  };

  // Google Sheets OAuth, Sync, and linkage handlers
  const handleConnectSheets = async () => {
    setSheetsMessage(null);
    try {
      const redirectUri = `${window.location.origin}/auth/callback`;
      const { url } = await api.getGoogleSheetsAuthUrl(redirectUri);

      const popup = window.open(
        url,
        'google_sheets_oauth_popup',
        'width=600,height=700,status=no,resizable=yes'
      );

      if (!popup) {
        setSheetsMessage({ 
          type: 'error', 
          text: 'Popup was blocked by your browser. Please allow popups to connect Google Sheets.' 
        });
      }
    } catch (err: any) {
      setSheetsMessage({ type: 'error', text: err.message || 'Failed to initialize Google OAuth connection.' });
    }
  };

  const handleCreateSheet = async () => {
    setSheetsMessage(null);
    setSheetsSyncing(true);
    try {
      const res = await api.createGoogleSpreadsheet(sheetTitle);
      if (res.spreadsheetId) {
        setSheetsMessage({ type: 'success', text: `Spreadsheet "${sheetTitle}" created and linked successfully!` });
        await fetchSheetsStatus();
      }
    } catch (err: any) {
      setSheetsMessage({ type: 'error', text: err.message || 'Failed to create spreadsheet.' });
    } finally {
      setSheetsSyncing(false);
    }
  };

  const handleLinkSheet = async () => {
    setSheetsMessage(null);
    if (!tempSpreadsheetId.trim()) {
      setSheetsMessage({ type: 'error', text: 'Please enter a valid Google Spreadsheet ID.' });
      return;
    }
    setSheetsSyncing(true);
    try {
      await api.linkGoogleSpreadsheet(tempSpreadsheetId);
      setSheetsMessage({ type: 'success', text: 'Spreadsheet linked successfully!' });
      await fetchSheetsStatus();
    } catch (err: any) {
      setSheetsMessage({ type: 'error', text: err.message || 'Failed to link spreadsheet.' });
    } finally {
      setSheetsSyncing(false);
    }
  };

  const handleToggleAutoSync = async (checked: boolean) => {
    try {
      await api.toggleGoogleSheetsAutoSync(checked);
      setGoogleSheetsStatus(prev => prev ? { ...prev, autoSync: checked } : null);
    } catch (e: any) {
      setSheetsMessage({ type: 'error', text: 'Failed to update auto sync setting.' });
    }
  };

  const handleSyncExisting = async () => {
    setSheetsMessage(null);
    setSheetsSyncing(true);
    try {
      const res = await api.syncExistingAuditLogs();
      setSheetsMessage({ type: 'success', text: `Sync complete! Successfully appended ${res.count} rows of historical records to your sheet.` });
    } catch (err: any) {
      setSheetsMessage({ type: 'error', text: err.message || 'Failed to sync historical logs.' });
    } finally {
      setSheetsSyncing(false);
    }
  };

  const handleDisconnectSheets = async () => {
    setSheetsMessage(null);
    try {
      await api.disconnectGoogleSheets();
      setGoogleSheetsStatus(prev => prev ? { ...prev, connected: false, email: null, name: null, spreadsheetId: null } : null);
      setTempSpreadsheetId('');
      setSheetsMessage({ type: 'info', text: 'Google Sheets integration disconnected.' });
    } catch (err: any) {
      setSheetsMessage({ type: 'error', text: err.message || 'Failed to disconnect.' });
    }
  };

  useEffect(() => {
    if (activeTab === 'admin' && user?.role === UserRole.ADMIN) {
      fetchSheetsStatus();
    }
  }, [activeTab, isAdminView, user]);

  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
        return;
      }
      
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        setSheetsMessage({ type: 'success', text: 'Google account linked successfully!' });
        fetchSheetsStatus();
      } else if (event.data?.type === 'OAUTH_AUTH_FAILURE') {
        setSheetsMessage({ type: 'error', text: event.data.error || 'Failed to complete Google authentication.' });
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, []);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastType, setBroadcastType] = useState<'info' | 'warning' | 'alert'>('info');

  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);

  // Admin/Staff Edit State
  const [editingShop, setEditingShop] = useState<RationShop | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingRole, setEditingRole] = useState<CustomRole | null>(null);
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [selectedBulkProductIds, setSelectedBulkProductIds] = useState<string[]>([]);
  const [bulkUpdateValues, setBulkUpdateValues] = useState<{ stock?: string; price?: string }>({ stock: '', price: '' });
  const [decommissioningShop, setDecommissioningShop] = useState<RationShop | null>(null);
  const [isRegisteringShop, setIsRegisteringShop] = useState(false);
  const [isRegisteringUser, setIsRegisteringUser] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState<string | null>(null); // cardNumber
  const [inspectingCard, setInspectingCard] = useState<RationCard | null>(null);
  const [lastStockUpdate, setLastStockUpdate] = useState<{
    shopId: string;
    productId: string;
    prevStock: number;
    newStock: number;
    productName: string;
    timestamp: number;
  } | null>(null);

  const [newUserData, setNewUserData] = useState<Partial<User>>({
    name: '',
    email: '',
    role: UserRole.CUSTOMER
  });

  const [newMemberData, setNewMemberData] = useState({
    name: '',
    relation: 'Member',
    age: 0
  });

  const [newShopData, setNewShopData] = useState<Partial<RationShop>>({
    name: '',
    address: '',
    phone: '',
    openingTime: '09:00',
    closingTime: '18:00',
    code: '',
    latitude: 13.0418,
    longitude: 80.2341,
    lunchStart: '13:00',
    lunchEnd: '14:00',
    products: JSON.parse(JSON.stringify(INITIAL_PRODUCTS))
  });

  useEffect(() => {
    if (lastStockUpdate) {
      const timer = setTimeout(() => {
        setLastStockUpdate(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [lastStockUpdate]);

  useEffect(() => {
    // Check if browser is offline
    const handleStatus = () => setIsOffline(!navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    
    // Initial status
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  // Helper to merge any server updates while ALWAYS preserving the entire 34,935 shop network
  const mergeWithMasterShops = (incomingShops: RationShop[]): RationShop[] => {
    const masterShops = getAllRationShops();
    if (!incomingShops || incomingShops.length === 0) return masterShops;
    const overrideMap = new Map<string, RationShop>();
    incomingShops.forEach(s => overrideMap.set(s.id, s));
    
    const merged = masterShops.map(s => overrideMap.get(s.id) || s);
    const masterIds = new Set(masterShops.map(s => s.id));
    incomingShops.forEach(s => {
      if (!masterIds.has(s.id)) {
        merged.push(s);
      }
    });
    return merged;
  };

  const handleSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      await syncManager.processQueue((current, total) => {
        setSyncProgress({ current, total });
      });
      // Refresh shops after sync while keeping full 34,935 network
      const updatedShops = await api.getShops();
      setShops(mergeWithMasterShops(updatedShops));
    } catch (err) {
      console.error('Sync failed', err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (!isOffline) {
      handleSync();
    }
  }, [isOffline]);

  useEffect(() => {
    // Initial Load from Server
    const loadData = async () => {
      try {
        const shopsData = await api.getShops();
        setShops(mergeWithMasterShops(shopsData));
      } catch (err) {
        console.error('Failed to load shops from server, keeping master network', err);
      }
    };

    const loadNotifications = async (userId?: string) => {
      try {
        const data = await api.getNotifications(userId);
        setNotifications(data);
      } catch (err) {
        console.error('Failed to load notifications', err);
      }
    };
    
    loadData();
    loadNotifications();

    if ((activeTab === 'admin' && user?.role === UserRole.ADMIN) || (activeTab === 'staff' && user?.role === UserRole.STAFF)) {
      if (user?.role === UserRole.ADMIN) {
        api.getAuditLogs().then(setAuditLogs).catch(console.error);
        api.getAdminUsers().then(setAdminUsers).catch(console.error);
        api.getAdminRoles().then(setAdminRoles).catch(console.error);
      }
      api.getAdminRationCards().then(setAdminCards).catch(console.error);
    }

    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      loadNotifications(parsedUser.id);
    }

    // Geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        (err) => console.log('Location denied', err),
        { enableHighAccuracy: true }
      );
    }
  }, [activeTab, user?.role]);

  // Google Maps quota listener
  useEffect(() => {
    const handleQuotaExceeded = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  const requestUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
          const mapEl = document.getElementById('shops-map-section');
          if (mapEl) mapEl.scrollIntoView({ behavior: 'smooth' });
        },
        (err) => {
          console.warn('Geolocation failed:', err.message);
          alert('Unable to retrieve location. Please check browser permissions: ' + err.message);
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const fetchBills = async () => {
    try {
      if (!user) return;
      let data: Bill[] = [];
      if (user.role === UserRole.CUSTOMER && user.rationCardNumber) {
        data = await api.getBills(user.rationCardNumber);
      } else if (user.role === UserRole.STAFF) {
        data = await api.getBills(undefined, user.shopId || 's1');
      } else if (user.role === UserRole.ADMIN) {
        data = await api.getBills();
      }
      setBills(data);
    } catch (err) {
      console.error("Failed to load bills:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBills();
    }
  }, [user]);

  const handleQRScanSuccess = async (scannedCardNumber: string) => {
    setIsVerifying(true);
    try {
      if (user?.role === UserRole.STAFF) {
        setIsQRScannerOpen(false);
        const results = await api.searchRationCards(scannedCardNumber);
        if (results.length === 0) {
          alert(`Smart Ration Card ${scannedCardNumber} not found in PDS registry.`);
        } else {
          setAdminCards(prev => {
            const newCards = results.filter(r => !prev.some(p => p.cardNumber === r.cardNumber));
            return [...prev, ...newCards];
          });
          setIsAddingMember(results[0].cardNumber);
          setStaffSubMode('billing');
          
          await api.createNotification({
            userId: user.id,
            title: 'QR Smart Card Scanned',
            message: `Loaded ration card No. ${scannedCardNumber} for family of ${results[0].headOfFamily}.`,
            type: 'info'
          });
          const updated = await api.getNotifications(user.id);
          setNotifications(updated);
        }
        return;
      }

      const { user: authUser } = await api.login({
        loginMethod: 'ration_qr',
        cardNumber: scannedCardNumber
      });

      setUser(authUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authUser));
      setActiveTab('mycard');

      // Refresh notifications for the logged in user
      const userNotifications = await api.getNotifications(authUser.id);
      setNotifications(userNotifications);

      // Trigger a "Welcome" notification
      await api.createNotification({
        userId: authUser.id,
        title: `Instant QR Decoded: Welcome ${authUser.name}`,
        message: `Clearance established via secure physical card scanning (No. ${scannedCardNumber}).`,
        type: 'success'
      });
      
      const refreshed = await api.getNotifications(authUser.id);
      setNotifications(refreshed);
      
      const card = await api.getRationCard(scannedCardNumber);
      setRationCards([card]);
    } catch (err: any) {
      alert(err.message || 'QR Authentication failed. Please verify that the physical card is valid.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleUserUpdate = async (userId: string, updates: Partial<User>) => {
    try {
      const updatedUser = await api.updateUser(userId, updates);
      setAdminUsers(adminUsers.map(u => u.id === userId ? updatedUser : u));
      if (user?.id === userId) {
        setUser(updatedUser);
        localStorage.setItem('tnpds_user', JSON.stringify(updatedUser));
      }
      setEditingUser(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (authMode === 'register') {
      if (!name.trim()) return alert("Full Name is required");
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert("Valid Email ID is required");
      if (!password.trim()) return alert("Access Keyphrase is required");
    } else {
      if (loginMethod === 'ration') {
        if (!rationCardNumber.trim()) return alert("Ration Card Number is required");
        if (showOtpField && !otp.trim()) return alert("Verification OTP is required");
      } else {
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert("Valid Email ID is required");
        if (!password.trim()) return alert("Access Keyphrase is required");
      }
    }

    setIsVerifying(true);

    try {
      let authUser: User;

      if (authMode === 'register') {
        const payload = { name, email, password, role };
        const response = await api.register(payload);
        alert("Registration successful! Your access request has been submitted for administrator approval. You will be able to log in once an administrator approves your account.");
        setAuthMode('login');
        setIsVerifying(false);
        return;
      } else {
        const payload = loginMethod === 'ration' 
          ? { loginMethod, cardNumber: rationCardNumber, otp }
          : { loginMethod: 'email', email, password };

        if (loginMethod === 'ration' && !showOtpField) {
          // Just checking if card exists first
          await api.getRationCard(rationCardNumber);
          setShowOtpField(true);
          setIsVerifying(false);
          return;
        }

        const response = await api.login(payload);
        authUser = response.user;
      }

      setUser(authUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authUser));
      setActiveTab('home');

      // Refresh notifications for the logged in user
      const userNotifications = await api.getNotifications(authUser.id);
      setNotifications(userNotifications);

      // Trigger a "Welcome" notification
      await api.createNotification({
        userId: authUser.id,
        title: `Authorization Success: ${authUser.role.toUpperCase()}`,
        message: `Welcome, ${authUser.name}. Your security clearance level [${authUser.role}] has been established.`,
        type: 'success'
      });
      
      const refreshed = await api.getNotifications(authUser.id);
      setNotifications(refreshed);
      
      if (authUser.role === UserRole.CUSTOMER && authUser.rationCardNumber) {
        const card = await api.getRationCard(authUser.rationCardNumber);
        setRationCards([card]);
      }
    } catch (err: any) {
      alert(err.message || 'Authentication failed. Check your credentials.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsVerifying(true);
    try {
      const fbUser = await signInWithGoogle();
      if (!fbUser) throw new Error("Google login canceled or failed.");

      // Fetch user profile from Firestore
      const userRef = doc(db, 'users', fbUser.uid);
      const userSnap = await getDoc(userRef);

      let authUser: User;
      if (userSnap.exists()) {
        authUser = userSnap.data() as User;
      } else {
        // Create profiles on the fly with a valid mock card
        authUser = {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'TNPDS User',
          email: fbUser.email || '',
          role: UserRole.CUSTOMER,
          isApproved: true,
          rationCardNumber: '33A0000001' // Pre-populated standard card ID
        };
        await setDoc(userRef, authUser);
      }

      setUser(authUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authUser));
      setActiveTab('home');

      const userNotifications = await api.getNotifications(authUser.id);
      setNotifications(userNotifications);

      await api.createNotification({
        userId: authUser.id,
        title: `Google Authentication`,
        message: `Welcome, ${authUser.name}. Your session has been verified using Firebase Auth & Google Sign-In.`,
        type: 'success'
      });

      const refreshed = await api.getNotifications(authUser.id);
      setNotifications(refreshed);

    } catch (err: any) {
      alert(err.message || 'Google Authentication failed.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.error("Firebase logout error", e);
    }
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
    setNotifications([]);
    setActiveTab('home');
    setShowNotifications(false);
  };

  const updateShopStock = async (shopId: string, productId: string, newStock: number) => {
    // Optimistic Update
    const currentShop = shops.find(s => s.id === shopId);
    let prevStockValue = 0;
    let prodName = '';
    
    if (currentShop) {
      const product = currentShop.products.find(p => p.id === productId);
      prevStockValue = product?.stock || 0;
      prodName = product?.name || '';
      
      const updatedProducts = currentShop.products.map(p => 
        p.id === productId ? { ...p, stock: newStock } : p
      );
      setShops(shops.map(s => s.id === shopId ? { ...currentShop, products: updatedProducts } : s));
    }

    setLastStockUpdate({
      shopId,
      productId,
      prevStock: prevStockValue,
      newStock,
      productName: prodName,
      timestamp: Date.now()
    });

    if (isOffline) {
      syncManager.addToQueue('STOCK_UPDATE', shopId, { productId, stock: newStock });
      return;
    }

    try {
      const updatedShop = await api.updateStock(shopId, productId, newStock);
      setShops(shops.map(s => s.id === shopId ? updatedShop : s));
      
      if (user) {
        const product = updatedShop.products.find(p => p.id === productId);
        await api.createNotification({
          userId: user.id,
          title: 'Inventory Adjustment Logged',
          message: `Stock level for "${product?.name}" updated to ${newStock} ${product?.unit}.`,
          type: 'info'
        });
        const updated = await api.getNotifications(user.id);
        setNotifications(updated);
      }
    } catch (err) {
      // If server call fails, fallback to queue
      syncManager.addToQueue('STOCK_UPDATE', shopId, { productId, stock: newStock });
      setIsOffline(true);
    }
  };

  const undoStockUpdate = async () => {
    if (!lastStockUpdate) return;
    const { shopId, productId, prevStock } = lastStockUpdate;
    setLastStockUpdate(null);
    await updateShopStock(shopId, productId, prevStock);
  };

  const sortedShops = useMemo(() => {
    if (!userLocation) return shops;
    return [...shops].sort((a, b) => {
      const distA = calculateDistance(userLocation.lat, userLocation.lon, a.latitude, a.longitude);
      const distB = calculateDistance(userLocation.lat, userLocation.lon, b.latitude, b.longitude);
      return distA - distB;
    });
  }, [shops, userLocation]);

  const filteredShops = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return sortedShops.filter(s => {
      const matchesDistrict = selectedDistrict === 'all' || s.address.includes(selectedDistrict) || s.code.startsWith(selectedDistrict);
      const matchesSearch = !term || 
        s.name.toLowerCase().includes(term) || 
        s.address.toLowerCase().includes(term) ||
        s.code.toLowerCase().includes(term);
      
      const matchesCategory = !selectedCategory || s.products.some(p => p.category === selectedCategory && p.stock > 0);
      
      return matchesDistrict && matchesSearch && matchesCategory;
    });
  }, [sortedShops, selectedDistrict, searchTerm, selectedCategory]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen flex flex-col selection:bg-emerald-100 selection:text-emerald-900 font-sans text-gray-900 pb-32 md:pb-0">
      {/* Google Maps Platform Quota Exceeded In-App Defense Banner */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm w-full">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      <div className="flex-1 flex flex-col md:flex-row min-w-0">
        <Sidebar 
          user={user} 
          onLogout={handleLogout} 
          onTabChange={setActiveTab} 
          activeTab={activeTab} 
          notificationCount={unreadCount}
          onToggleNotifications={() => setShowNotifications(!showNotifications)}
        />
      <BottomNav 
        user={user} 
        onLogout={handleLogout}
        onTabChange={setActiveTab} 
        activeTab={activeTab} 
        notificationCount={unreadCount}
        onToggleNotifications={() => setShowNotifications(!showNotifications)}
      />

      <AnimatePresence>
        {showNotifications && (
          <NotificationCenter 
            notifications={notifications} 
            onClose={() => setShowNotifications(false)}
            onMarkRead={async (id) => {
              try {
                await api.markNotificationRead(id);
                setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
              } catch (err) {
                console.error(err);
              }
            }}
          />
        )}
      </AnimatePresence>

      <QRScannerModal 
        isOpen={isQRScannerOpen} 
        onClose={() => setIsQRScannerOpen(false)} 
        onScanSuccess={handleQRScanSuccess} 
      />

      {/* Printable Receipt Preview Modal */}
      {activeBillSelection && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 overflow-y-auto" id="bill-receipt-modal">
          <div 
            className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl w-full max-w-2xl relative overflow-hidden flex flex-col my-8"
            id="printable-receipt-modal"
          >
            {/* Modal Actions Header - hidden from print */}
            <div className="p-6 bg-gray-50 border-b flex justify-between items-center print:hidden">
              <span className="text-[10px] font-black uppercase text-gray-450 tracking-widest bg-gray-250 px-3 py-1 rounded-lg font-mono">Official Distributary Invoice</span>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-2 bg-emerald-900 border-b-2 border-emerald-950 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-black transition-all active:scale-95 shadow-md shadow-emerald-900/10"
                >
                  <Printer className="w-4 h-4" />
                  Print / அச்சிடு
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveBillSelection(null);
                    if (user?.role === UserRole.STAFF) {
                      setIsAddingMember(null);
                      setActiveTab('staff');
                    }
                  }}
                  className="bg-white border hover:bg-gray-100 border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                >
                  {user?.role === UserRole.STAFF ? "Complete & Return to Dashboard" : "Dismiss Preview"}
                </button>
              </div>
            </div>

            {/* Invoice Contents */}
            <div className="p-10 md:p-12 space-y-8 text-xs font-sans text-gray-800 leading-relaxed max-h-[80vh] overflow-y-auto print:max-h-none print:overflow-visible">
              
              {/* Header Govt Emblem Emblem Details */}
              <div className="text-center space-y-3 pb-6 border-b-2 border-dashed border-gray-200">
                <div className="flex justify-center mb-1 print:hidden">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-900 font-extrabold text-[10px]">TN</div>
                </div>
                <h2 className="text-sm font-black uppercase tracking-wider text-gray-950 leading-tight">Tamil Nadu Civil Supplies Corporation</h2>
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">Civil Supplies & Consumer Protection Department</h3>
                <h4 className="text-[11px] font-bold text-emerald-800 uppercase font-tamil mt-1">தமிழ்நாடு நுகர்பொருள் வாணிபக் கழகம்</h4>
              </div>

              {/* Grid Metadata */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-[11px]">
                <div>
                  <span className="block text-[8px] font-black uppercase text-gray-400 tracking-widest mb-1 font-mono">Receipt Invoice # / ரசீது எண்</span>
                  <span className="font-mono font-black text-gray-900">{activeBillSelection.billNumber}</span>
                </div>
                <div className="text-right">
                  <span className="block text-[8px] font-black uppercase text-gray-400 tracking-widest mb-1 font-mono">Date & Time / தேதி</span>
                  <span className="font-bold text-gray-900">{new Date(activeBillSelection.createdAt).toLocaleDateString()} {new Date(activeBillSelection.createdAt).toLocaleTimeString()}</span>
                </div>

                <div className="border-t pt-4">
                  <span className="block text-[8px] font-black uppercase text-gray-400 tracking-widest mb-1 font-mono">FPS Shop Identifier / கடை குறியீடு</span>
                  <span className="font-bold text-gray-900 uppercase">SHOP-{activeBillSelection.shopId}</span>
                </div>
                <div className="text-right border-t pt-4">
                  <span className="block text-[8px] font-black uppercase text-gray-400 tracking-widest mb-1 font-mono">Payment Protocol / செலுத்துகை</span>
                  <span className="font-black text-emerald-850 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase">{activeBillSelection.paymentMode}</span>
                </div>

                <div className="border-t pt-4">
                  <span className="block text-[8px] font-black uppercase text-gray-400 tracking-widest mb-1 font-mono">Smart Ration Card # / குடும்ப அட்டை</span>
                  <span className="font-mono font-bold text-gray-900">{activeBillSelection.cardNumber}</span>
                </div>
                <div className="text-right border-t pt-4">
                  <span className="block text-[8px] font-black uppercase text-gray-400 tracking-widest mb-1 font-mono">Head of Household / குடும்ப தலைவர்</span>
                  <span className="font-black text-gray-900">
                    {(() => {
                      const billedCard = rationCards.find(c => c.cardNumber === activeBillSelection.cardNumber) || adminCards.find(c => c.cardNumber === activeBillSelection.cardNumber);
                      return billedCard?.headOfFamily || "N/A";
                    })()}
                  </span>
                </div>
              </div>

              {/* Commodity items Distributed Table */}
              <div className="space-y-3 pt-4">
                <span className="block text-[8px] font-black uppercase text-gray-400 tracking-widest font-mono">Distributed Commodities / வழங்கப்பட்ட பொருட்கள்</span>
                <div className="border-y-2 border-gray-150 divide-y divide-gray-100/80">
                  {activeBillSelection.items.map((item, index) => {
                    const prodObj = INITIAL_PRODUCTS.find(p => p.id === item.productId);
                    return (
                      <div key={item.productId || index} className="py-4 flex justify-between items-center">
                        <div className="space-y-0.5">
                          <span className="font-black text-gray-900">{prodObj?.name || item.productId}</span>
                          <span className="block text-[9px] text-gray-450 font-tamil">{prodObj?.tamilName}</span>
                        </div>
                        <div className="flex gap-12 items-center text-[11px]">
                          <div>
                            <span className="text-gray-450 font-medium">Qty:</span> <span className="font-bold font-mono text-gray-900">{item.quantity} {prodObj?.unit}</span>
                          </div>
                          <div className="w-16 text-right">
                            <span className="text-gray-450 font-medium whitespace-nowrap">Rate:</span> <span className="font-bold font-mono text-gray-900">₹{prodObj?.price || 0}</span>
                          </div>
                          <div className="w-20 text-right font-black font-mono text-gray-900">
                            {((item.total ?? item.totalPrice) ?? 0) === 0 ? "FREE" : `₹${((item.total ?? item.totalPrice) ?? 0).toFixed(2)}`}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Summary pricing Total */}
              <div className="flex justify-between items-start pt-2">
                <div>
                  <span className="text-[10px] font-black uppercase text-gray-800 tracking-wide block font-mono">Transaction Status</span>
                  <span className="text-[9px] font-black uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded tracking-widest inline-block mt-1 border border-emerald-100">✔ Sync & Approved by PDS System</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest mr-1 block font-mono">Grand Total / மொத்தம்</span>
                  <h3 className="text-3xl font-black text-gray-950 mt-1">₹{(activeBillSelection.totalAmount ?? 0).toFixed(2)}</h3>
                </div>
              </div>

              {/* Authenticity Barcode Generator */}
              <div className="pt-8 border-t border-dashed space-y-4 text-center">
                <div className="flex flex-col items-center justify-center space-y-1.5 font-mono">
                  <div className="text-lg tracking-[0.25em] font-light text-gray-900">
                    ||||| | |||| ||| ||| || | ||| |||| |
                  </div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{activeBillSelection.billNumber} • VERIFIED IDSEC</span>
                </div>
                <div className="text-[9px] text-gray-400 leading-relaxed font-medium italic">
                  This is a computer-generated transactional receipt under Public Distribution System (PDS). 
                  SMS confirmation has been dispatched. For queries, register grievances at tnpds.gov.in.
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
      
      <main className="flex-1 overflow-x-hidden p-6 md:p-8 lg:p-12 min-w-0">
        <AnimatePresence mode="wait">
          {/* Auth View */}
          {activeTab === 'auth' && (
            <motion.div 
              key="auth"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex justify-center items-center h-full"
            >
              <div className="bg-white p-12 rounded-[2.5rem] border border-gray-100 shadow-2xl w-full max-w-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <Store className="w-32 h-32 text-emerald-900" />
                </div>
                
                  <div className="mb-12">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-2 block">Secure Gateway</span>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">
                      {authMode === 'login' ? 'System Access' : 'Create Profile'}
                    </h2>
                    <p className="text-gray-400 font-medium mt-2">Enter your credentials to access the TNPDS network.</p>
                  </div>

                  {authMode === 'login' && (
                    <div className="flex p-1.5 bg-gray-100 rounded-2xl mb-8">
                       <button 
                        type="button"
                        onClick={() => { setLoginMethod('ration'); setShowOtpField(false); }}
                        className={cn(
                          "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                          loginMethod === 'ration' ? "bg-white text-emerald-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                        )}
                      >
                        Ration Card
                      </button>
                      <button 
                        type="button"
                        onClick={() => { setLoginMethod('email'); setShowOtpField(false); }}
                        className={cn(
                          "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                          loginMethod === 'email' ? "bg-white text-emerald-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                        )}
                      >
                        Email ID
                      </button>
                    </div>
                  )}
                  
                  <form onSubmit={handleAuth} className="space-y-8">
                    {authMode === 'login' && loginMethod === 'ration' ? (
                      <>
                        <div className="space-y-2">
                          <label htmlFor="auth-ration-card" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ration Card Number / Scan Physical QR</label>
                          <div className="flex gap-3">
                            <input 
                              id="auth-ration-card"
                              type="text" required
                              disabled={showOtpField || isVerifying}
                              value={rationCardNumber} onChange={e => setRationCardNumber(e.target.value)}
                              className="flex-1 px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold disabled:opacity-50"
                              placeholder="10 Digits (e.g. 3290884512)"
                            />
                            {!showOtpField && (
                              <button
                                type="button"
                                onClick={() => setIsQRScannerOpen(true)}
                                className="px-6 bg-emerald-50 text-emerald-900 border border-emerald-100 rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-100 hover:border-emerald-200 active:scale-95 transition-all text-[11px] font-black shadow-sm shrink-0"
                                id="login-qr-scan-btn"
                                title="Scan physical QR code for digital login"
                              >
                                <QrCode className="w-4 h-4 text-emerald-600 animate-pulse" />
                                <span>SCAN QR</span>
                              </button>
                            )}
                          </div>
                        </div>
                        {showOtpField && (
                          <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                            <div className="flex justify-between items-center ml-1">
                               <label htmlFor="auth-otp" className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Verification Code</label>
                               <span className="text-[10px] font-bold text-emerald-600">OTP Sent to Linked Mobile</span>
                            </div>
                            <input 
                              id="auth-otp"
                              type="text" required
                              maxLength={10}
                              value={otp} onChange={e => setOtp(e.target.value)}
                              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold tracking-[0.2em] text-center"
                              placeholder="8807196505"
                            />
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {authMode === 'register' && (
                          <div className="space-y-2">
                            <label htmlFor="register-name" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                            <input 
                              id="register-name"
                              type="text" required
                              value={name} onChange={e => setName(e.target.value)}
                              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold"
                              placeholder="e.g. Arumugam Swaminathan"
                            />
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <label htmlFor="auth-email" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Network Identity (Email)</label>
                          <input 
                            id="auth-email"
                            type="email" required
                            value={email} onChange={e => setEmail(e.target.value)}
                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold"
                            placeholder="identity@tnpds.gov.in"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="auth-password" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Secure Keyphrase</label>
                          <input 
                            id="auth-password"
                            type="password" required
                            value={password} onChange={e => setPassword(e.target.value)}
                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold"
                            placeholder="••••••••"
                          />
                        </div>
                      </>
                    )}

                  {authMode === 'register' && (
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Account Classification</label>
                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          type="button"
                          onClick={() => setRole(UserRole.CUSTOMER)}
                          className={cn(
                            "py-4 rounded-2xl border-2 transition-all font-black text-xs uppercase tracking-widest", 
                            role === UserRole.CUSTOMER 
                              ? "border-emerald-600 bg-emerald-50 text-emerald-900" 
                              : "border-gray-100 text-gray-300 hover:border-gray-200"
                          )}
                        >
                          Customer
                        </button>
                        <button 
                          type="button"
                          onClick={() => setRole(UserRole.STAFF)}
                          className={cn(
                            "py-4 rounded-2xl border-2 transition-all font-black text-xs uppercase tracking-widest", 
                            role === UserRole.STAFF 
                              ? "border-emerald-600 bg-emerald-50 text-emerald-900" 
                              : "border-gray-100 text-gray-300 hover:border-gray-200"
                          )}
                        >
                          Staff
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <button 
                    type="submit"
                    disabled={isVerifying}
                    className={cn(
                      "w-full py-5 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3",
                      isVerifying ? "bg-emerald-900/50 cursor-not-allowed" : "bg-emerald-900 hover:bg-black shadow-emerald-900/20"
                    )}
                  >
                    {isVerifying ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Transmitting...
                      </>
                    ) : (
                      <>{authMode === 'login' ? (showOtpField ? 'Verify & Access' : loginMethod === 'ration' ? 'Request OTP' : 'Initialize session') : 'Register protocol'}</>
                    )}
                  </button>
                </form>

                {authMode === 'login' && (
                  <div className="mt-6 space-y-4">
                    <div className="relative flex py-2 items-center">
                      <div className="flex-grow border-t border-gray-100"></div>
                      <span className="flex-shrink mx-4 text-gray-400 text-[10px] uppercase tracking-widest font-black">OR SECURED ID</span>
                      <div className="flex-grow border-t border-gray-100"></div>
                    </div>
                    
                    <button 
                      type="button" 
                      onClick={handleGoogleLogin}
                      disabled={isVerifying}
                      className="w-full py-4 px-6 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-2xl shadow-sm hover:shadow transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.564-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.529-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.245-3.125C18.29 1.765 15.34 1 12.24 1c-6.075 0-11 4.925-11 11s4.925 11 11 11c6.34 0 10.564-4.435 10.564-10.74 0-.726-.075-1.285-.175-1.975H12.24z"/>
                      </svg>
                      <span>Continue with Google</span>
                    </button>
                  </div>
                )}
                
                <div className="mt-12 text-center pt-8 border-t border-gray-50">
                  <p className="text-gray-400 text-sm font-medium">
                    {authMode === 'login' ? "New to the system?" : "Credentialed user?"}
                    <button 
                      onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                      className="ml-2 font-black text-emerald-600 hover:underline underline-offset-4"
                    >
                      {authMode === 'login' ? 'Apply for access' : 'Return to login'}
                    </button>
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Ration Card View */}
          {activeTab === 'mycard' && user?.role === UserRole.CUSTOMER && (
            <motion.div 
               key="mycard"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
            >
               {rationCards.find(c => c.cardNumber === user.rationCardNumber) && (
                 <RationCardView 
                   card={rationCards.find(c => c.cardNumber === user.rationCardNumber)!} 
                   onScanClick={() => setIsQRScannerOpen(true)}
                   bills={bills}
                   onViewBill={(b) => setActiveBillSelection(b)}
                 />
               )}
            </motion.div>
          )}

          {/* Official TNCSC Geo-Location Directory View */}
          {activeTab === 'directory' && (
            <motion.div
              key="directory"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <OfficialGeoDirectory
                onSelectShopForMap={(targetShop) => {
                  setActiveTab('home');
                  setMapViewMode(prev => prev === 'cards' ? 'both' : prev);
                  setMapFocusedShop({
                    id: targetShop.code || 'focused',
                    name: targetShop.name,
                    code: targetShop.code || '',
                    address: targetShop.address || '',
                    pincode: '600001',
                    phone: '',
                    openingTime: '08:30',
                    closingTime: '17:30',
                    lunchStart: '13:00',
                    lunchEnd: '14:00',
                    latitude: targetShop.latitude,
                    longitude: targetShop.longitude,
                    products: [...INITIAL_PRODUCTS]
                  });
                  setTimeout(() => {
                    const el = document.getElementById('shops-map-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 150);
                }}
              />
            </motion.div>
          )}

          {/* Home View */}
          {activeTab === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              {/* Geometric Header Section */}
              <header className="flex justify-between items-start mb-8 flex-wrap gap-6">
                <div className="space-y-2">
                  <h2 className="text-4xl font-black text-gray-900 tracking-tight">Fair Price Network</h2>
                  <p className="text-gray-500 font-medium max-w-md">Access commodity availability and shop schedules for the Tamil Nadu Public Distribution System.</p>
                </div>
                <div className="flex gap-4 items-center">
                  <button
                    onClick={() => setActiveTab('directory')}
                    className="bg-blue-900 hover:bg-blue-950 text-white px-4 py-2.5 rounded-2xl shadow-md text-xs font-bold flex items-center gap-2 transition-all active:scale-95 border border-blue-800"
                    title="View Official TNCSC HTML Geo Directory with 1,560 Fair Price Shops"
                  >
                    <Building2 className="w-4 h-4 text-amber-300" />
                    <span>TNCSC Geo Directory</span>
                  </button>
                  <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Network Status</span>
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-black tracking-tight flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      SYSTEM ACTIVE
                    </span>
                  </div>
                </div>
              </header>

              {/* Search Bar Section */}
              <section className="relative">
                <div className="absolute inset-0 bg-emerald-600 transform -rotate-1 rounded-[2.5rem] opacity-5 -z-10" />
                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-emerald-900/5 border border-emerald-50 flex items-center gap-6">
                  <div className="bg-emerald-50 p-4 rounded-2xl hidden sm:block">
                    <Search className="text-emerald-600 w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="inventory-search" className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-1 block">Live Inventory Search</label>
                    <input 
                      id="inventory-search"
                      type="text" 
                      placeholder="Enter area, shop code, or pincode..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-transparent text-xl font-bold placeholder:text-gray-300 outline-none"
                    />
                  </div>
                  <button 
                    aria-label="Filter results on map"
                    onClick={() => {
                      const el = document.getElementById('shops-map-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-emerald-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-black shadow-lg shadow-emerald-200 transition-all active:scale-95"
                  >
                    FILTER MAP
                  </button>
                </div>

                <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 -mb-2">
                  {['Rice', 'Sugar', 'Oil', 'Dhal'].map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                      className={cn(
                        "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border flex items-center gap-2",
                        selectedCategory === category 
                          ? "bg-emerald-900 text-white border-emerald-900 shadow-xl shadow-emerald-900/20 active:scale-95" 
                          : "bg-white text-gray-400 border-gray-100 hover:border-emerald-200"
                      )}
                    >
                      <Package className={cn("w-3 h-3", selectedCategory === category ? "text-emerald-400" : "text-gray-300")} />
                      {category}
                    </button>
                  ))}
                  {selectedCategory && (
                    <button 
                      onClick={() => setSelectedCategory(null)}
                      className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </section>

              {/* AI Assistant Section */}
              <section className="bg-gradient-to-br from-emerald-950 to-neutral-900 text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                  <Compass className="w-64 h-64 text-white" />
                </div>
                
                <div className="max-w-3xl space-y-6 relative">
                  <div>
                    <span className="bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase border border-emerald-500/20">
                      Google Maps Grounding & Voice AI
                    </span>
                    <h3 className="text-3xl font-black tracking-tight mt-3 text-gray-100">Smart TNPDS Assistant</h3>
                    <p className="text-gray-400 text-xs font-semibold leading-relaxed mt-1">
                      Query real-time geographic locations, local Fair Price shop openings, and address coordinates instantly powered by Gemini 3.5 Flash with live Google Maps data grounding.
                    </p>
                  </div>

                  <form onSubmit={handleAiMapQuerySubmit} className="flex gap-3 bg-white/5 border border-white/10 p-2.5 rounded-2xl relative">
                    <input 
                      type="text"
                      className="flex-1 bg-transparent text-white font-semibold text-sm placeholder:text-gray-500 px-4 outline-none min-w-0"
                      placeholder="Ask eg: 'nearest ration shop to Dr. Ambedkar Nagar' or 'ration shops in Adyar'..."
                      value={aiMapQuery}
                      onChange={(e) => setAiMapQuery(e.target.value)}
                    />
                    
                    {/* Microphone input button */}
                    <button
                      type="button"
                      onClick={isRecording ? stopAudioRecording : startAudioRecording}
                      className={cn(
                        "p-4 rounded-xl flex items-center justify-center transition-all active:scale-95 text-white/90 focus:outline-none",
                        isRecording 
                          ? "bg-red-500 hover:bg-red-600 animate-pulse text-white font-bold"
                          : "bg-emerald-800/80 hover:bg-emerald-800 text-emerald-300"
                      )}
                      title={isRecording ? "Stop recording and transcribe" : "Record audio for transcription"}
                    >
                      {isRecording ? <MicOff className="w-4 h-4 animate-bounce" /> : <Mic className="w-4 h-4" />}
                    </button>

                    <button
                      type="submit"
                      disabled={isAiLoading || !aiMapQuery.trim()}
                      className="px-6 bg-emerald-500 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-emerald-400 shadow-xl shadow-emerald-500/10 disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                      {isAiLoading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin font-bold" />
                          <span>GROUNDING...</span>
                        </>
                      ) : (
                        <span>ASK AI</span>
                      )}
                    </button>
                  </form>

                  {/* AI Response Display */}
                  {(aiResponse || isAiLoading) && (
                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl animate-in fade-in duration-300 space-y-4">
                      {isAiLoading && !aiResponse ? (
                        <div className="flex items-center gap-3 py-4 text-emerald-400 font-semibold text-xs">
                          <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                          <span>Inquiring Google Maps platform and grounding context... Please wait.</span>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-2">
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider block">Grounded Analysis</span>
                            <p className="text-gray-200 text-sm font-semibold leading-relaxed whitespace-pre-wrap">{aiResponse}</p>
                          </div>

                          {aiGroundingLinks.length > 0 && (
                            <div className="pt-4 border-t border-white/5 space-y-2">
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Verified Location Coordinates (Live Links)</span>
                              <div className="flex flex-wrap gap-2.5">
                                {aiGroundingLinks.map((link, idx) => (
                                  <a 
                                    key={idx}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-emerald-950/80 border border-emerald-500/20 rounded-xl text-xs font-semibold text-emerald-300 hover:bg-emerald-900/60 hover:text-white transition-all flex items-center gap-2 cursor-pointer shadow-sm animate-in zoom-in-50 duration-250"
                                  >
                                    <MapPin className="w-3 h-3 text-emerald-400" />
                                    <span>{link.title}</span>
                                    <ExternalLink className="w-3 h-3 text-emerald-500" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </section>

              {/* Shops Section: Interactive Map & Grid */}
              <section className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black text-gray-800 flex items-center gap-3">
                      <div className="w-1 h-8 bg-emerald-600 rounded-full" />
                      Fair Price Shop Locator (Tamil Nadu)
                    </h3>
                    <p className="text-xs text-gray-500 font-medium mt-1">
                      Showing {Math.min(visibleCardCount, filteredShops.length).toLocaleString()} of {filteredShops.length.toLocaleString()} Fair Price Shops in Network
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* District Selector */}
                    <div className="relative">
                      <select
                        value={selectedDistrict}
                        onChange={(e) => {
                          setSelectedDistrict(e.target.value);
                          setVisibleCardCount(24);
                        }}
                        className="bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs py-2 px-3 rounded-xl border border-gray-200 outline-none cursor-pointer shadow-sm pr-7 appearance-none"
                      >
                        <option value="all">📍 All Districts ({TOTAL_SHOPS_COUNT.toLocaleString()})</option>
                        {TN_DISTRICTS.map(d => (
                          <option key={d.code} value={d.name}>
                            {d.name} ({d.count.toLocaleString()} Shops)
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]">
                        ▼
                      </div>
                    </div>

                    {/* View Mode Switcher */}
                    <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200 text-xs font-bold">
                      <button
                        onClick={() => setMapViewMode('both')}
                        className={cn(
                          "px-3 py-1.5 rounded-xl transition-all",
                          mapViewMode === 'both' ? "bg-white text-emerald-950 shadow-sm" : "text-gray-500 hover:text-gray-900"
                        )}
                      >
                        Map & Grid
                      </button>
                      <button
                        onClick={() => setMapViewMode('map')}
                        className={cn(
                          "px-3 py-1.5 rounded-xl transition-all flex items-center gap-1",
                          mapViewMode === 'map' ? "bg-white text-emerald-950 shadow-sm" : "text-gray-500 hover:text-gray-900"
                        )}
                      >
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        Map Only
                      </button>
                      <button
                        onClick={() => setMapViewMode('cards')}
                        className={cn(
                          "px-3 py-1.5 rounded-xl transition-all",
                          mapViewMode === 'cards' ? "bg-white text-emerald-950 shadow-sm" : "text-gray-500 hover:text-gray-900"
                        )}
                      >
                        Cards Only
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={requestUserLocation}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-black text-emerald-700 hover:bg-emerald-50 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        NEARBY
                      </button>
                      <button 
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory(null);
                          setSelectedDistrict('all');
                          setMapFocusedShop(null);
                          setVisibleCardCount(24);
                        }}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-black text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                      >
                        ALL SHOPS
                      </button>
                    </div>
                  </div>
                </div>

                {/* Google Maps View */}
                {(mapViewMode === 'both' || mapViewMode === 'map') && (
                  <div id="shops-map-section" className="space-y-3">
                    <RationShopMap
                      shops={shops}
                      selectedShop={mapFocusedShop || selectedShop}
                      onSelectShop={(shop) => {
                        setSelectedShop(shop);
                      }}
                      userLocation={userLocation}
                      onRequestUserLocation={requestUserLocation}
                      selectedDistrict={selectedDistrict}
                      onSelectDistrict={(dist) => {
                        setSelectedDistrict(dist);
                        setVisibleCardCount(24);
                      }}
                      height={mapViewMode === 'map' ? '640px' : '480px'}
                    />
                  </div>
                )}

                {/* Cards Grid */}
                {(mapViewMode === 'both' || mapViewMode === 'cards') && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                      {filteredShops.slice(0, visibleCardCount).map(shop => {
                      const isOpen = isShopOpen(shop.openingTime, shop.closingTime, shop.lunchStart, shop.lunchEnd);
                      const distance = userLocation ? calculateDistance(userLocation.lat, userLocation.lon, shop.latitude, shop.longitude) : null;
                      const isAssigned = user?.role === UserRole.STAFF && user.shopId === shop.id;
                      
                      return (
                        <motion.div 
                          key={shop.id}
                          whileHover={{ y: -4, scale: 1.01 }}
                          onClick={() => setSelectedShop(shop)}
                          className={cn(
                            "bg-white rounded-[2rem] p-8 shadow-sm border transition-all cursor-pointer flex flex-col h-full relative",
                            isAssigned ? "border-emerald-500 ring-4 ring-emerald-500/5 shadow-emerald-900/10" : "border-gray-100 hover:shadow-2xl hover:shadow-emerald-900/10"
                          )}
                        >
                          {isAssigned && (
                            <div className="absolute -top-4 left-8 bg-emerald-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-900/20 flex items-center gap-2">
                              <Package className="w-3 h-3" />
                              Your Assignation
                            </div>
                          )}
                          <div className="flex justify-between items-start mb-8">
                            <div className={cn("px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase", isOpen ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600")}>
                              {isOpen ? 'Open Now' : 'Closed'}
                            </div>
                            {distance && (
                              <span className="font-mono text-[10px] font-bold text-gray-300">
                                {distance.toFixed(1)} KM
                              </span>
                            )}
                          </div>
                        
                        <div className="space-y-4 flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="text-2xl font-black text-gray-900 leading-tight line-clamp-2">{shop.name}</h4>
                            <div 
                              className={cn("w-2 h-2 rounded-full shrink-0", isOpen ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-red-500")} 
                              aria-hidden="true" 
                            />
                          </div>
                          <div className="flex items-start gap-2 text-gray-500">
                            <MapPin className="w-4 h-4 shrink-0 mt-1 opacity-50" />
                            <p className="text-sm font-medium leading-relaxed line-clamp-2">{shop.address}</p>
                          </div>
                        </div>

                        {/* Quick Map & Direction Links */}
                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMapFocusedShop(shop);
                              setMapViewMode(prev => prev === 'cards' ? 'both' : prev);
                              const el = document.getElementById('shops-map-section');
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
                            title="Locate this shop on the Google Map"
                          >
                            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Show on Map</span>
                          </button>

                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${shop.latitude},${shop.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[11px] font-bold text-gray-500 hover:text-emerald-800 bg-gray-50 hover:bg-gray-100 px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1 shadow-sm"
                            title="Get Directions"
                          >
                            <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Directions</span>
                          </a>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                              <Clock className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-gray-300 uppercase leading-none mb-1">Hours</p>
                              <p className="text-xs font-bold text-gray-600">{shop.openingTime} - {shop.closingTime}</p>
                            </div>
                          </div>
                          <div 
                            className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-emerald-600 group-hover:text-white transition-all"
                            aria-label="View shop details"
                          >
                            <ChevronRight aria-hidden="true" />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Pagination / Load More */}
                {visibleCardCount < filteredShops.length && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100">
                    <p className="text-xs text-gray-500 font-medium">
                      Showing <span className="font-bold text-gray-800">{Math.min(visibleCardCount, filteredShops.length).toLocaleString()}</span> of <span className="font-bold text-gray-800">{filteredShops.length.toLocaleString()}</span> shops in this view
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setVisibleCardCount(prev => Math.min(prev + 24, filteredShops.length))}
                        className="px-6 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-emerald-900 transition-all shadow-md active:scale-95"
                      >
                        Load Next 24 Shops
                      </button>
                      <button
                        onClick={() => setVisibleCardCount(prev => Math.min(prev + 120, filteredShops.length))}
                        className="px-6 py-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                      >
                        Load 120 More
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

              {/* Admin/Staff Stats Section (If logged in) */}
              {user && (user.role === UserRole.ADMIN || user.role === UserRole.STAFF) && (
                <section className="relative mt-20">
                  <div className="absolute inset-0 bg-emerald-900 rounded-[3rem] -rotate-1 scale-105 shadow-2xl opacity-10" />
                  <div className="relative bg-emerald-900 rounded-[3rem] p-12 text-white overflow-hidden shadow-3xl shadow-emerald-950/40 border border-emerald-800">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-800 rounded-full blur-3xl opacity-50 -mr-48 -mt-48" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                      <div className="space-y-4">
                        <h3 className="text-4xl font-black">Management Dashboard</h3>
                        <p className="text-emerald-100/70 text-lg max-w-lg">
                          As {user.role === UserRole.ADMIN ? 'an Administrator' : 'Staff'}, you can manage stock levels, update operational timings, and view analytics.
                        </p>
                        <button 
                          onClick={() => setActiveTab(user.role === UserRole.ADMIN ? 'admin' : 'staff')}
                          className="bg-white text-emerald-900 px-8 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-lg shadow-emerald-950/20"
                        >
                          Enter {user.role === UserRole.ADMIN ? 'Admin Panel' : 'Staff Portal'}
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-emerald-800/50 p-6 rounded-2xl backdrop-blur-sm border border-emerald-700/50">
                          <p className="text-3xl font-black">100%</p>
                          <p className="text-xs uppercase tracking-widest text-emerald-200">Uptime</p>
                        </div>
                        <div className="bg-emerald-800/50 p-6 rounded-2xl backdrop-blur-sm border border-emerald-700/50">
                          <p className="text-3xl font-black">Offline</p>
                          <p className="text-xs uppercase tracking-widest text-emerald-200">Sync Ready</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </motion.div>
          )}

          {/* Admin Table View */}
          {activeTab === 'admin' && user?.role === UserRole.ADMIN && (
            <motion.div 
               key="admin"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="space-y-8"
            >
              <header className="flex items-center justify-between">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                    {isAdminView === 'infrastructure' ? 'System Infrastructure' : 
                     isAdminView === 'alerts' ? 'Network Integrity & Broadcast' :
                     isAdminView === 'approval' ? 'Pending Authorizations' :
                     isAdminView === 'sheets' ? 'Google Sheets Sync Settings' :
                     'Digital Audit Trail'}
                  </h2>
                  <p className="text-gray-400 font-medium">
                    {isAdminView === 'infrastructure' 
                      ? 'Manage network shops and commodity distribution nodes.' 
                      : isAdminView === 'alerts'
                      ? 'Real-time inventory monitoring and global notification center.'
                      : isAdminView === 'approval'
                      ? 'Review and approve access requests for new personnel.'
                      : isAdminView === 'sheets'
                      ? 'Log and synchronize personnel login events automatically to Google Sheets.'
                      : 'Verifiable chronological record of system administrative actions.'}
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="flex p-1.5 bg-gray-100 rounded-2xl overflow-x-auto no-scrollbar">
                    <button 
                      onClick={() => setIsAdminView('infrastructure')}
                      className={cn(
                        "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                        isAdminView === 'infrastructure' ? "bg-white text-emerald-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                      )}
                    >
                      Nodes
                    </button>
                    <button 
                      onClick={() => {
                        setIsAdminView('users');
                        api.getAdminUsers().then(setAdminUsers).catch(console.error);
                      }}
                      className={cn(
                        "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                        isAdminView === 'users' ? "bg-white text-emerald-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                      )}
                    >
                      Personnel
                    </button>
                    <button 
                      onClick={() => {
                        setIsAdminView('approval');
                        api.getAdminUsers().then(users => setAdminUsers(users)).catch(console.error);
                      }}
                      className={cn(
                        "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                        isAdminView === 'approval' ? "bg-white text-emerald-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                      )}
                    >
                      Approvals
                    </button>
                    <button 
                      onClick={() => {
                        setIsAdminView('cards');
                        api.getAdminRationCards().then(setAdminCards).catch(console.error);
                      }}
                      className={cn(
                        "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                        isAdminView === 'cards' ? "bg-white text-emerald-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                      )}
                    >
                      Ration Ledger
                    </button>
                    <button 
                      onClick={() => {
                        setIsAdminView('audit');
                        api.getAuditLogs().then(setAuditLogs).catch(console.error);
                      }}
                      className={cn(
                        "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                        isAdminView === 'audit' ? "bg-white text-emerald-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                      )}
                    >
                      Audit
                    </button>
                    <button 
                      onClick={() => {
                        setIsAdminView('roles');
                        api.getAdminRoles().then(setAdminRoles).catch(console.error);
                      }}
                      className={cn(
                        "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                        isAdminView === 'roles' ? "bg-white text-emerald-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                      )}
                    >
                      Roles
                    </button>
                    <button 
                      onClick={() => setIsAdminView('alerts')}
                      className={cn(
                        "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                        isAdminView === 'alerts' ? "bg-white text-emerald-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                      )}
                    >
                      Alerts
                    </button>
                    <button 
                      onClick={() => setIsAdminView('sheets')}
                      className={cn(
                        "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                        isAdminView === 'sheets' ? "bg-white text-emerald-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                      )}
                    >
                      Sync Sheets
                    </button>
                  </div>
                  {isAdminView === 'users' ? (
                    <button 
                      onClick={() => setIsRegisteringUser(true)}
                      className="flex items-center gap-2 bg-emerald-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-emerald-900/10 active:scale-95"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Add Personnel</span>
                    </button>
                  ) : isAdminView === 'roles' ? (
                    <button 
                      onClick={() => setIsCreatingRole(true)}
                      className="flex items-center gap-2 bg-emerald-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-emerald-900/10 active:scale-95"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Define Role</span>
                    </button>
                  ) : (
                    <button 
                      onClick={() => setIsRegisteringShop(true)}
                      className="flex items-center gap-2 bg-emerald-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-emerald-900/10 active:scale-95"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Register Node</span>
                    </button>
                  )}
                </div>
              </header>

              {isAdminView === 'approval' ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-[#F9FAFB] border-b border-gray-100 font-mono">
                        <tr>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-emerald-900/40">Name</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-emerald-900/40">Email</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-emerald-900/40">Requested Role</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-emerald-900/40 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {adminUsers.filter(u => u.isApproved === false).length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-8 py-20 text-center">
                              <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center">
                                  <Check className="w-8 h-8 text-emerald-400" />
                                </div>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No pending authorizations found.</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          adminUsers.filter(u => u.isApproved === false).map(u => (
                            <tr key={u.id} className="hover:bg-emerald-50/20 transition-colors">
                              <td className="px-8 py-6">
                                <p className="text-sm font-black text-gray-900">{u.name}</p>
                              </td>
                              <td className="px-8 py-6">
                                <p className="text-xs font-mono text-gray-500">{u.email}</p>
                              </td>
                              <td className="px-8 py-6">
                                <span className={cn(
                                  "px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest",
                                  u.role === UserRole.ADMIN ? "bg-purple-50 text-purple-600" :
                                  u.role === UserRole.STAFF ? "bg-amber-50 text-amber-600" :
                                  "bg-emerald-50 text-emerald-600"
                                )}>
                                  {u.role}
                                </span>
                              </td>
                              <td className="px-8 py-6 text-right">
                                <button 
                                  onClick={async () => {
                                    try {
                                      await api.approveUser(u.id);
                                      const updatedUsers = await api.getAdminUsers();
                                      setAdminUsers(updatedUsers);
                                      alert(`Authorization granted for ${u.name}.`);
                                    } catch (err) {
                                      alert('Failed to authorize user.');
                                    }
                                  }}
                                  className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/10 active:scale-95"
                                >
                                  Approve Access
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : isAdminView === 'roles' ? (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-[#F9FAFB] border-b border-gray-100 font-mono">
                        <tr>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-emerald-900/40">Role Name</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-emerald-900/40">Description</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-emerald-900/40">Permissions</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-emerald-900/40 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {adminRoles.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-8 py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                              No custom roles defined.
                            </td>
                          </tr>
                        ) : (
                          adminRoles.map(role => (
                            <tr key={role.id} className="hover:bg-emerald-50/20 transition-colors group">
                              <td className="px-8 py-6">
                                <p className="text-sm font-black text-gray-900">{role.name}</p>
                              </td>
                              <td className="px-8 py-6">
                                <p className="text-xs text-gray-500 max-w-xs">{role.description}</p>
                              </td>
                              <td className="px-8 py-6">
                                <div className="flex flex-wrap gap-2">
                                  {role.permissions.map(p => (
                                    <span key={p} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[9px] font-bold uppercase tracking-tighter">
                                      {p.replace(/_/g, ' ')}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="px-8 py-6 text-right">
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={() => setEditingRole(role)}
                                    className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={async () => {
                                      if (confirm(`Are you sure you want to delete the '${role.name}' role? This will unassign it from all users.`)) {
                                        try {
                                          await api.deleteRole(role.id);
                                          setAdminRoles(adminRoles.filter(r => r.id !== role.id));
                                          // Refresh users too
                                          const users = await api.getAdminUsers();
                                          setAdminUsers(users);
                                        } catch (err) {
                                          alert('Failed to delete role.');
                                        }
                                      }
                                    }}
                                    className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : isAdminView === 'audit' ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" aria-hidden="true" />
                      <input 
                        aria-label="Search audit logs by personnel name or action type"
                        className="w-full pl-16 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl font-bold focus:bg-white focus:border-emerald-500 transition-all outline-none"
                        placeholder="Search by Personnel name or Action Type (e.g. LOGIN, UPDATE)..."
                        value={auditSearchTerm}
                        onChange={(e) => setAuditSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 border-l hidden md:block">
                      {auditLogs.filter(log => 
                        log.userName.toLowerCase().includes(auditSearchTerm.toLowerCase()) ||
                        log.action.toLowerCase().includes(auditSearchTerm.toLowerCase()) ||
                        log.details.toLowerCase().includes(auditSearchTerm.toLowerCase()) ||
                        (log.targetType && log.targetType.toLowerCase().includes(auditSearchTerm.toLowerCase())) ||
                        (log.targetId && log.targetId.toLowerCase().includes(auditSearchTerm.toLowerCase()))
                      ).length} Records Filtered
                    </div>
                  </div>

                  <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-[#F9FAFB] border-b border-gray-100 font-mono">
                        <tr>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-emerald-900/40">Timestamp</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-emerald-900/40">User</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-emerald-900/40">Action</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-emerald-900/40">Target</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-emerald-900/40">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {auditLogs
                          .filter(log => 
                            log.userName.toLowerCase().includes(auditSearchTerm.toLowerCase()) ||
                            log.action.toLowerCase().includes(auditSearchTerm.toLowerCase()) ||
                            log.details.toLowerCase().includes(auditSearchTerm.toLowerCase()) ||
                            (log.targetType && log.targetType.toLowerCase().includes(auditSearchTerm.toLowerCase())) ||
                            (log.targetId && log.targetId.toLowerCase().includes(auditSearchTerm.toLowerCase()))
                          )
                          .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                          .map(log => (
                            <tr key={log.id} className="hover:bg-emerald-50/20 transition-colors">
                          <td className="px-8 py-6 font-mono text-[10px] text-gray-500">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="px-8 py-6">
                            <p className="text-xs font-black text-gray-900">{log.userName}</p>
                            <p className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter">ID: {log.userId}</p>
                          </td>
                          <td className="px-8 py-6">
                            <span className={cn(
                              "px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest",
                              log.action.includes('DELETE') ? "bg-red-50 text-red-600" :
                              log.action.includes('REGISTER') ? "bg-emerald-50 text-emerald-600" :
                              log.action.includes('LOGIN') ? "bg-blue-50 text-blue-600" :
                              "bg-gray-50 text-gray-600"
                            )}>
                              {log.action}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            {log.targetType ? (
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  {log.targetType === 'shop' && <Store className="w-3 h-3 text-emerald-600" />}
                                  {log.targetType === 'user' && <UserIcon className="w-3 h-3 text-blue-600" />}
                                  {log.targetType === 'product' && <Package className="w-3 h-3 text-amber-600" />}
                                  <span className={cn(
                                    "text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter",
                                    log.targetType === 'shop' ? "bg-emerald-50 text-emerald-600" :
                                    log.targetType === 'user' ? "bg-blue-50 text-blue-600" :
                                    "bg-amber-50 text-amber-600"
                                  )}>
                                    {log.targetType}
                                  </span>
                                </div>
                                <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded inline-block w-fit">
                                  {log.targetId}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Cpu className="w-3 h-3 text-gray-400" />
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">System</span>
                              </div>
                            )}
                          </td>
                          <td className="px-8 py-6">
                            <p className="text-xs font-medium text-gray-600 leading-relaxed">{log.details}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : isAdminView === 'alerts' ? (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {/* Broadcast Center */}
                  <div className="bg-emerald-900 text-white rounded-[3rem] p-12 shadow-2xl shadow-emerald-950/40 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full blur-3xl opacity-20 -mr-32 -mt-32" />
                    <div className="relative z-10 space-y-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                          <Bell className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black">Broadcast Center</h3>
                          <p className="text-emerald-100/60 text-sm">Issue system-wide alerts to all digital ration cards.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-emerald-300 uppercase tracking-widest block ml-1">Alert Priority</label>
                          <div className="flex gap-4">
                            {(['info', 'warning', 'alert'] as const).map(t => (
                              <button
                                key={t}
                                onClick={() => setBroadcastType(t)}
                                className={cn(
                                  "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                  broadcastType === t 
                                    ? "bg-white text-emerald-900 border-white shadow-lg" 
                                    : "bg-white/5 border-white/10 text-emerald-100 hover:bg-white/10"
                                )}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-emerald-300 uppercase tracking-widest block ml-1">Message Subject</label>
                          <input
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm font-bold focus:bg-white focus:text-emerald-900 transition-all outline-none"
                            placeholder="e.g. System Maintenance Notice"
                            value={broadcastTitle}
                            onChange={e => setBroadcastTitle(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-emerald-300 uppercase tracking-widest block ml-1">Detailed Message Body</label>
                        <textarea
                          rows={3}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm font-bold focus:bg-white focus:text-emerald-900 transition-all outline-none resize-none"
                          placeholder="Detailed explanation for all citizens..."
                          value={broadcastMessage}
                          onChange={e => setBroadcastMessage(e.target.value)}
                        />
                      </div>

                      <button
                        onClick={async () => {
                          if (!broadcastTitle || !broadcastMessage) return;
                          try {
                            await api.createNotification({
                              title: broadcastTitle,
                              message: broadcastMessage,
                              type: broadcastType
                            });
                            setBroadcastTitle('');
                            setBroadcastMessage('');
                            alert('Broadcasting operation successful.');
                          } catch (err) {
                            alert('Failed to transmit broadcast message.');
                          }
                        }}
                        className="w-full bg-emerald-400 text-emerald-950 py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-black/20 hover:bg-white hover:scale-[1.02] active:scale-95 transition-all"
                      >
                        Transmit Global Alert
                      </button>
                    </div>
                  </div>

                  {/* System Health / Low Stock Monitoring */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                      <Package className="w-6 h-6 text-emerald-600" />
                      Inventory Critical Alerts
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {shops.flatMap(s => 
                        s.products
                          .filter(p => p.stock < 100)
                          .map(p => (
                            <div key={`${s.id}-${p.id}`} className="bg-white p-6 rounded-[2rem] border border-red-100 shadow-xl relative overflow-hidden group hover:border-red-500 transition-all">
                              <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-full blur-2xl opacity-50 -mr-12 -mt-12 group-hover:opacity-100 transition-opacity" />
                              <div className="relative z-10 space-y-4">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-black text-red-600 bg-red-50 px-3 py-1 rounded-full uppercase tracking-widest">
                                    Low Stock: {p.stock} {p.unit}
                                  </span>
                                  <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                                </div>
                                <div>
                                  <h4 className="font-black text-gray-900 uppercase tracking-tight">{p.name}</h4>
                                  <p className="text-[10px] font-mono text-gray-400">{s.name} ({s.code})</p>
                                </div>
                              </div>
                            </div>
                          ))
                      )}
                      {shops.every(s => s.products.every(p => p.stock >= 100)) && (
                        <div className="col-span-full py-12 text-center space-y-4">
                          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                            <Check className="w-10 h-10 text-emerald-500" />
                          </div>
                          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">All network nodes reporting healthy stock levels.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
            ) : isAdminView === 'users' ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {isRegisteringUser && (
                    <div className="bg-white p-10 rounded-[2.5rem] border border-emerald-500 shadow-2xl space-y-10 mb-10 overflow-hidden relative">
                      <div className="absolute top-0 right-0 p-10 opacity-5">
                        <Users className="w-32 h-32 text-emerald-900" />
                      </div>
                      <div className="flex items-center justify-between border-b pb-6">
                        <div>
                          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-1">Personnel Management</span>
                          <h3 className="text-2xl font-black text-gray-900">Add New Official or Customer</h3>
                        </div>
                        <button 
                          onClick={() => setIsRegisteringUser(false)} 
                          aria-label="Close user registration"
                          className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors"
                        >
                          <X aria-hidden="true" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <label htmlFor="user-reg-name" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                          <input 
                            id="user-reg-name"
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:bg-white focus:border-emerald-500 transition-all outline-none"
                            placeholder="Arumugam Swaminathan"
                            value={newUserData.name}
                            onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-4">
                          <label htmlFor="user-reg-email" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Interface</label>
                          <input 
                            id="user-reg-email"
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:bg-white focus:border-emerald-500 transition-all outline-none"
                            placeholder="arumugam@tnpds.in"
                            value={newUserData.email}
                            onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                          />
                        </div>
                        <div className="space-y-4">
                          <label htmlFor="user-reg-role" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Assigned Role</label>
                          <select 
                            id="user-reg-role"
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:bg-white focus:border-emerald-500 transition-all outline-none appearance-none"
                            value={newUserData.role}
                            onChange={(e) => setNewUserData({...newUserData, role: e.target.value as UserRole})}
                          >
                            <option value={UserRole.CUSTOMER}>Customer / Household Head</option>
                            <option value={UserRole.STAFF}>Shop Staff / Operator</option>
                            <option value={UserRole.ADMIN}>Regional Administrator</option>
                          </select>
                        </div>
                        {newUserData.role === UserRole.STAFF && (
                          <div className="space-y-4">
                            <label htmlFor="user-reg-node" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Node Assignment</label>
                            <select 
                              id="user-reg-node"
                              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:bg-white focus:border-emerald-500 transition-all outline-none appearance-none"
                              value={newUserData.shopId || ''}
                              onChange={(e) => setNewUserData({...newUserData, shopId: e.target.value})}
                            >
                              <option value="">Unassigned</option>
                              {shops.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                            </select>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end pt-8 border-t border-gray-50">
                        <button 
                          onClick={async () => {
                            if (!newUserData.name?.trim()) return alert("Name is required");
                            if (!newUserData.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUserData.email)) return alert("Valid email is required");
                            if (!newUserData.role) return alert("Role selection is required");

                            try {
                              const user = await api.registerUser(newUserData);
                              setAdminUsers([...adminUsers, user]);
                              setIsRegisteringUser(false);
                              setNewUserData({ name: '', email: '', role: UserRole.CUSTOMER });
                            } catch (err: any) {
                              alert(err.message);
                            }
                          }}
                          className="px-10 py-4 bg-emerald-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-950/20 hover:bg-black transition-all"
                        >
                          Authorize Personnel
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-[#F9FAFB] border-b border-gray-100 font-mono">
                        <tr>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-emerald-900/40">Full Legal Name</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-emerald-900/40">Role</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-emerald-900/40">Assignment</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-emerald-900/40 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {adminUsers.map(u => (
                          <tr key={u.id} className="hover:bg-emerald-50/20 transition-colors group">
                            <td className="px-8 py-6">
                              <p className="text-sm font-black text-gray-900">{u.name}</p>
                              <p className="text-[10px] text-gray-400 font-mono">{u.email}</p>
                            </td>
                            <td className="px-8 py-6">
                              <span className={cn(
                                "px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest",
                                u.role === UserRole.ADMIN ? "bg-purple-50 text-purple-600" :
                                u.role === UserRole.STAFF ? "bg-amber-50 text-amber-600" :
                                "bg-emerald-50 text-emerald-600"
                              )}>
                                {u.role}
                              </span>
                            </td>
                            <td className="px-8 py-6">
                              {u.shopId ? (
                                <p className="text-xs font-bold text-gray-600">{shops.find(s => s.id === u.shopId)?.name || 'Loading...'}</p>
                              ) : (
                                <p className="text-xs font-medium text-gray-300 italic">None</p>
                              )}
                            </td>
                            <td className="px-8 py-6 text-right">
                              <button 
                                onClick={() => setEditingUser(u)}
                                aria-label={`Edit ${u.name}`}
                                className="w-10 h-10 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm opacity-0 group-hover:opacity-100"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <AnimatePresence>
                    {editingUser && (
                      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
                        <motion.div 
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.9, opacity: 0 }}
                          className="bg-white max-w-2xl w-full p-10 rounded-[2.5rem] border border-emerald-100 shadow-2xl space-y-8"
                        >
                          <div className="flex items-center justify-between border-b pb-6">
                            <div>
                              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-1">Editing Personnel</span>
                              <h3 className="text-2xl font-black text-gray-900">{editingUser.name}</h3>
                            </div>
                            <button 
                              onClick={() => setEditingUser(null)} 
                              aria-label="Close user edit"
                              className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors"
                            >
                              <X aria-hidden="true" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                              <label htmlFor="edit-user-role" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Update Role</label>
                              <select 
                                id="edit-user-role"
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:bg-white focus:border-emerald-500 transition-all outline-none appearance-none"
                                value={editingUser.role}
                                onChange={(e) => setEditingUser({...editingUser, role: e.target.value as UserRole})}
                              >
                                <option value={UserRole.CUSTOMER}>Customer / Household Head</option>
                                <option value={UserRole.STAFF}>Shop Staff / Operator</option>
                                <option value={UserRole.ADMIN}>Regional Administrator</option>
                              </select>
                            </div>
                            {editingUser.role === UserRole.STAFF && (
                              <div className="space-y-4">
                                <label htmlFor="edit-user-node" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Update Node Assignment</label>
                                <select 
                                  id="edit-user-node"
                                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:bg-white focus:border-emerald-500 transition-all outline-none appearance-none"
                                  value={editingUser.shopId || ''}
                                  onChange={(e) => setEditingUser({...editingUser, shopId: e.target.value})}
                                >
                                  <option value="">Unassigned</option>
                                  {shops.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                                </select>
                              </div>
                            )}
                            <div className="space-y-4">
                              <label htmlFor="edit-user-custom-role" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Assign Custom Designation</label>
                              <select 
                                id="edit-user-custom-role"
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:bg-white focus:border-emerald-500 transition-all outline-none appearance-none"
                                value={editingUser.customRoleId || ''}
                                onChange={(e) => setEditingUser({...editingUser, customRoleId: e.target.value})}
                              >
                                <option value="">No Designation</option>
                                {adminRoles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                              </select>
                            </div>
                          </div>

                          <div className="flex justify-end pt-8 border-t border-gray-50">
                            <button 
                              onClick={() => handleUserUpdate(editingUser.id, { 
                                role: editingUser.role, 
                                shopId: editingUser.shopId,
                                customRoleId: editingUser.customRoleId || undefined
                              })}
                              className="px-10 py-4 bg-emerald-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-950/20 hover:bg-black transition-all"
                            >
                              Commit Changes
                            </button>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              ) : isAdminView === 'cards' ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" aria-hidden="true" />
                      <input 
                        aria-label="Search ration cards by number or head of household"
                        className="w-full pl-16 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl font-bold focus:bg-white focus:border-emerald-500 transition-all outline-none"
                        placeholder="Search by Card Number or Head of Household..."
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val.length > 2) {
                            api.searchRationCards(val).then(setAdminCards).catch(console.error);
                          } else if (val.length === 0) {
                            api.getAdminRationCards().then(setAdminCards).catch(console.error);
                          }
                        }}
                      />
                    </div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 border-l hidden md:block">
                      {adminCards.length} Records Found
                    </div>
                  </div>

                  <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-[#F9FAFB] border-b border-gray-100 font-mono">
                        <tr>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-emerald-900/40">Card ID</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-emerald-900/40">Head of Household</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-emerald-900/40">Family Unit</th>
                          <th className="px-8 py-5 text-[10px) font-black uppercase tracking-widest text-emerald-900/40 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {adminCards.map(card => (
                          <React.Fragment key={card.cardNumber}>
                            <tr className="hover:bg-emerald-50/20 transition-colors">
                              <td className="px-8 py-6">
                                <p className="text-sm font-black text-gray-900 font-mono">{card.cardNumber}</p>
                                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">{card.cardType}</span>
                              </td>
                              <td className="px-8 py-6">
                                <p className="text-sm font-black text-gray-900">{card.headOfFamily}</p>
                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">{card.district}</p>
                              </td>
                              <td className="px-8 py-6">
                                <div className="flex -space-x-2">
                                  {card.members.map((m, idx) => (
                                    <div key={m.id} className="w-8 h-8 rounded-full bg-emerald-900 text-white border-2 border-white flex items-center justify-center text-[10px] font-black shadow-sm" title={m.name}>
                                      {m.name.charAt(0)}
                                    </div>
                                  ))}
                                  <button 
                                    onClick={() => setIsAddingMember(isAddingMember === card.cardNumber ? null : card.cardNumber)}
                                    aria-label={`Add family member to card ${card.cardNumber}`}
                                    className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 border-2 border-white flex items-center justify-center text-xs font-black hover:bg-emerald-100 hover:text-emerald-900 transition-all shadow-sm"
                                  >
                                    <Plus className="w-3 h-3" aria-hidden="true" />
                                  </button>
                                </div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase mt-2">{card.members.length} Members Registered</p>
                              </td>
                          <td className="px-8 py-6 text-right">
                                <div className="flex justify-end gap-2">
                                  <button 
                                    onClick={() => setInspectingCard(card)}
                                    className="p-2 hover:bg-emerald-50 rounded-xl text-emerald-600 transition-all font-black text-[10px] uppercase tracking-widest"
                                  >
                                    Inspect
                                  </button>
                                  <button 
                                    onClick={() => setIsAddingMember(isAddingMember === card.cardNumber ? null : card.cardNumber)}
                                    className="p-2 hover:bg-emerald-50 rounded-xl text-emerald-600 transition-all font-black text-[10px] uppercase tracking-widest"
                                  >
                                    Add Member
                                  </button>
                                </div>
                              </td>
                            </tr>
                            <AnimatePresence>
                              {isAddingMember === card.cardNumber && (
                                <tr>
                                  <td colSpan={4} className="bg-emerald-50/10 px-8 py-8 border-b border-emerald-50">
                                    <motion.div 
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="bg-white p-8 rounded-[2rem] border border-emerald-100 shadow-xl max-w-2xl ml-auto">
                                        <div className="flex items-center gap-4 mb-8">
                                          <div className="w-10 h-10 bg-emerald-900 text-white rounded-xl flex items-center justify-center">
                                            <Users className="w-5 h-5" />
                                          </div>
                                          <div>
                                            <h4 className="text-lg font-black text-gray-900">Register New Family Member</h4>
                                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Household: {card.cardNumber}</p>
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                                          <div className="sm:col-span-1 space-y-2">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Relation</label>
                                            <select 
                                              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-xs focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all appearance-none"
                                              value={newMemberData.relation}
                                              onChange={(e) => setNewMemberData({...newMemberData, relation: e.target.value})}
                                            >
                                              <option>Spouse</option>
                                              <option>Son</option>
                                              <option>Daughter</option>
                                              <option>Father</option>
                                              <option>Mother</option>
                                              <option>Step-Child</option>
                                              <option>Guardian</option>
                                              <option>Member</option>
                                            </select>
                                          </div>
                                          <div className="sm:col-span-2 space-y-2">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                            <input 
                                              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                                              placeholder="Member Name"
                                              value={newMemberData.name}
                                              onChange={(e) => setNewMemberData({...newMemberData, name: e.target.value})}
                                            />
                                          </div>
                                          <div className="sm:col-span-1 space-y-2">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Age</label>
                                            <input 
                                              type="number"
                                              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-mono font-bold text-sm focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                                              placeholder="Age"
                                              value={newMemberData.age || ''}
                                              onChange={(e) => setNewMemberData({...newMemberData, age: Number(e.target.value)})}
                                            />
                                          </div>
                                        </div>

                                        <div className="flex justify-end gap-3">
                                          <button 
                                            onClick={() => setIsAddingMember(null)}
                                            className="px-6 py-3 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors"
                                          >
                                            Abort
                                          </button>
                                          <button 
                                            onClick={async () => {
                                              if (!newMemberData.name?.trim()) return alert("Entity name is required");
                                              if (!newMemberData.relation) return alert("Relation is required");
                                              if (newMemberData.age < 0 || newMemberData.age > 120) return alert("Invalid age provided (0-120)");

                                              try {
                                                const updated = await api.addFamilyMember(card.cardNumber, newMemberData);
                                                setAdminCards(adminCards.map(c => c.cardNumber === card.cardNumber ? updated : c));
                                                setIsAddingMember(null);
                                                setNewMemberData({ name: '', relation: 'Member', age: 0 });
                                              } catch (err: any) {
                                                alert(err.message);
                                              }
                                            }}
                                            className="px-8 py-3 bg-emerald-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-900/20 hover:bg-black transition-all"
                                          >
                                            Commit & Save
                                          </button>
                                        </div>
                                      </div>
                                    </motion.div>
                                  </td>
                                </tr>
                              )}
                            </AnimatePresence>
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <AnimatePresence>
                    {inspectingCard && (
                      <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                        <motion.div 
                          initial={{ scale: 0.9, opacity: 0, y: 40 }}
                          animate={{ scale: 1, opacity: 1, y: 0 }}
                          exit={{ scale: 0.9, opacity: 0, y: 40 }}
                          className="bg-white max-w-4xl w-full max-h-[90vh] overflow-hidden rounded-[3rem] border border-emerald-100 shadow-2xl flex flex-col"
                        >
                          {/* Modal Header */}
                          <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                            <div className="flex items-center gap-6">
                              <div className="w-16 h-16 bg-emerald-900 text-white rounded-2xl flex items-center justify-center shadow-emerald-900/20 shadow-xl">
                                <CreditCard className="w-8 h-8" />
                              </div>
                              <div>
                                <div className="flex items-center gap-3 mb-1">
                                  <h3 className="text-3xl font-black text-gray-900 tracking-tight">{inspectingCard.cardNumber}</h3>
                                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    {inspectingCard.cardType}
                                  </span>
                                </div>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                  <MapPin className="w-3 h-3" />
                                  {inspectingCard.district} Region
                                </p>
                              </div>
                            </div>
                            <button 
                              onClick={() => setInspectingCard(null)} 
                              className="w-12 h-12 bg-white hover:bg-red-50 hover:text-red-600 border border-gray-100 rounded-2xl flex items-center justify-center transition-all shadow-sm"
                            >
                              <X className="w-6 h-6" />
                            </button>
                          </div>

                          {/* Modal Content */}
                          <div className="flex-1 overflow-y-auto p-10 space-y-12">
                            {/* Family Details */}
                            <section className="space-y-6">
                              <div className="flex items-center justify-between">
                                <h4 className="text-xl font-black text-gray-900 flex items-center gap-3">
                                  <Users className="w-6 h-6 text-emerald-600" />
                                  Household Composition
                                </h4>
                                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full uppercase tracking-widest">
                                  {inspectingCard.members.length} Registered Members
                                </span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {inspectingCard.members.map((member) => (
                                  <div key={member.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4 hover:border-emerald-200 transition-all group">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-900 text-white flex items-center justify-center font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
                                      {member.name.charAt(0)}
                                    </div>
                                    <div>
                                      <p className="font-black text-gray-900">{member.name}</p>
                                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        <span>{member.relation}</span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                        <span>{member.age} Years</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </section>

                            {/* Entitlements */}
                            <section className="space-y-6">
                              <h4 className="text-xl font-black text-gray-900 flex items-center gap-3">
                                <Package className="w-6 h-6 text-emerald-600" />
                                Monthly Entitlements
                              </h4>
                              <div className="bg-emerald-900 p-8 rounded-[2rem] border border-emerald-800 shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full blur-3xl opacity-20 -mr-32 -mt-32" />
                                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                  <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
                                    <p className="text-[10px] font-black text-emerald-300 uppercase tracking-widest mb-1">Rice</p>
                                    <p className="text-2xl font-black text-white">{inspectingCard.cardType === 'PHH' ? '20' : '15'} KG</p>
                                    <p className="text-[10px] text-emerald-100/40 font-mono mt-1">₹0.00 / UNIT</p>
                                  </div>
                                  <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
                                    <p className="text-[10px] font-black text-emerald-300 uppercase tracking-widest mb-1">Sugar</p>
                                    <p className="text-2xl font-black text-white">{inspectingCard.cardType === 'PHH' ? '2' : '1'} KG</p>
                                    <p className="text-[10px] text-emerald-100/40 font-mono mt-1">₹25.00 / UNIT</p>
                                  </div>
                                  <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
                                    <p className="text-[10px] font-black text-emerald-300 uppercase tracking-widest mb-1">Dhal</p>
                                    <p className="text-2xl font-black text-white">1 KG</p>
                                    <p className="text-[10px] text-emerald-100/40 font-mono mt-1">₹30.00 / UNIT</p>
                                  </div>
                                  <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
                                    <p className="text-[10px] font-black text-emerald-300 uppercase tracking-widest mb-1">Oil</p>
                                    <p className="text-2xl font-black text-white">1 LTR</p>
                                    <p className="text-[10px] text-emerald-100/40 font-mono mt-1">₹25.00 / UNIT</p>
                                  </div>
                                </div>
                              </div>
                            </section>
                          </div>

                          {/* Modal Footer */}
                          <div className="p-8 border-t border-gray-50 flex justify-end bg-gray-50/30">
                            <button 
                              onClick={() => setInspectingCard(null)} 
                              className="px-12 py-4 bg-emerald-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-950/20 hover:bg-black transition-all"
                            >
                              Dismiss Record
                            </button>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              ) : isAdminView === 'sheets' ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {/* Quick Explanation Header */}
                  <div className="bg-emerald-50 rounded-[2.5rem] border border-emerald-100 p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2.5">
                        <span className="p-2 bg-emerald-800 text-white rounded-xl">
                          <FileSpreadsheet className="w-5 h-5" />
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800">Operational Module Ready</span>
                      </div>
                      <h3 className="text-xl font-black text-emerald-950">Active Audit Synchronization</h3>
                      <p className="text-sm font-medium text-emerald-800/80 max-w-2xl leading-relaxed">
                        Authorize this secure platform to automatically synchronize staff portal and customer login logs to a central Google Sheet. This handles secure personnel tracking compliance automatically.
                      </p>
                    </div>

                    {!googleSheetsStatus?.hasCredentials && (
                      <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex gap-3 text-xs text-orange-800 max-w-sm">
                        <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold mb-1">Configuration Needed</p>
                          <p className="opacity-90 leading-relaxed">Please ensure Google OAuth client credentials are configured in your environment variables to link the account.</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {sheetsMessage && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "p-6 rounded-[2rem] border flex items-start gap-4",
                        sheetsMessage.type === 'success' && "bg-green-50 border-green-100 text-green-900",
                        sheetsMessage.type === 'error' && "bg-red-50 border-red-100 text-red-900",
                        sheetsMessage.type === 'info' && "bg-gray-50 border-gray-100 text-gray-900"
                      )}
                    >
                      {sheetsMessage.type === 'success' ? (
                        <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      ) : sheetsMessage.type === 'error' ? (
                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      ) : (
                        <Info className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 text-sm font-semibold">
                        {sheetsMessage.text}
                      </div>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Column 1: Connection Card */}
                    <div className="lg:col-span-1 space-y-6">
                      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-8 flex flex-col justify-between min-h-[360px]">
                        <div className="space-y-4">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Account Association</span>
                          <h4 className="text-lg font-black text-gray-900">Google Workspace Link</h4>
                          <p className="text-xs text-gray-400 font-medium leading-relaxed">
                            Logins are pushed using Google's Google Sheets API with secure offline refresh tokens.
                          </p>

                          {googleSheetsStatus?.connected ? (
                            <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-3">
                              <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">Connected</span>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs font-black text-emerald-950 truncate">{googleSheetsStatus.name || 'Staff Administrator'}</p>
                                <p className="text-[10px] font-mono text-emerald-800">{googleSheetsStatus.email}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="p-5 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col items-center justify-center py-8 text-center text-gray-400 space-y-2">
                              <Cloud className="w-8 h-8 text-gray-300" />
                              <p className="text-xs font-bold text-gray-500">Not Synced to Google</p>
                              <p className="text-[10px] max-w-[180px] leading-relaxed">Connect your Google account to enable storage syncing.</p>
                            </div>
                          )}
                        </div>

                        <div>
                          {googleSheetsStatus?.connected ? (
                            <button 
                              onClick={handleDisconnectSheets}
                              className="w-full py-4 border border-rose-100 hover:border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                              Disconnect Account
                            </button>
                          ) : (
                            <button 
                              onClick={handleConnectSheets}
                              disabled={!googleSheetsStatus?.hasCredentials}
                              className="w-full py-4 bg-emerald-900 hover:bg-emerald-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-40 disabled:hover:bg-emerald-900"
                            >
                              Authorize Google Account
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Column 2 & 3: Sheets Management */}
                    <div className="lg:col-span-2 space-y-8">
                      {googleSheetsStatus?.connected ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Create New Sheet */}
                          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-6 flex flex-col justify-between min-h-[360px]">
                            <div className="space-y-4">
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Provision Storage</span>
                              <h4 className="text-lg font-black text-gray-900">Create New Ledger</h4>
                              <p className="text-xs text-gray-400 font-medium leading-relaxed">
                                Automatically set up a perfectly indexed spreadsheet log containing audit metrics.
                              </p>

                              <div className="space-y-2 pt-2">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1" htmlFor="sheet-title-input">Spreadsheet Title</label>
                                <input 
                                  id="sheet-title-input"
                                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm focus:bg-white focus:border-emerald-500 transition-all outline-none"
                                  value={sheetTitle}
                                  onChange={(e) => setSheetTitle(e.target.value)}
                                  placeholder="E.g. TNPDS Login Log"
                                />
                              </div>
                            </div>

                            <button 
                              onClick={handleCreateSheet}
                              disabled={sheetsSyncing}
                              className="w-full py-4 bg-emerald-900 hover:bg-emerald-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                            >
                              {sheetsSyncing ? (
                                <span className="flex items-center justify-center gap-2">
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                  Creating...
                                </span>
                              ) : (
                                "Create & Bind Sheet"
                              )}
                            </button>
                          </div>

                          {/* Link Existing Sheet */}
                          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-6 flex flex-col justify-between min-h-[360px]">
                            <div className="space-y-4">
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Existing Storage</span>
                              <h4 className="text-lg font-black text-gray-900">Link Existing Spreadsheet</h4>
                              <p className="text-xs text-gray-400 font-medium leading-relaxed">
                                Paste the Google Spreadsheet ID below to write your data to an existing sheet.
                              </p>

                              <div className="space-y-2 pt-2">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1" htmlFor="sheet-id-input">Spreadsheet ID</label>
                                <input 
                                  id="sheet-id-input"
                                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-mono text-xs focus:bg-white focus:border-emerald-500 transition-all outline-none"
                                  value={tempSpreadsheetId}
                                  onChange={(e) => setTempSpreadsheetId(e.target.value)}
                                  placeholder="E.g. 1a2b3c4d5e... (from spreadsheet URL)"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              {googleSheetsStatus.spreadsheetId && (
                                <a 
                                  href={`https://docs.google.com/spreadsheets/d/${googleSheetsStatus.spreadsheetId}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] font-bold text-emerald-800 hover:underline flex items-center justify-center gap-1.5 mb-2 bg-emerald-50 py-2 rounded-xl"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  Open Current bound Sheet
                                </a>
                              )}
                              <button 
                                onClick={handleLinkSheet}
                                disabled={sheetsSyncing || !tempSpreadsheetId.trim()}
                                className="w-full py-4 border border-emerald-900 hover:bg-emerald-50 text-emerald-900 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 disabled:hover:bg-white"
                              >
                                {sheetsSyncing ? (
                                  <span className="flex items-center justify-center gap-2">
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    Linking...
                                  </span>
                                ) : (
                                  "Link Spreadsheet Identity"
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 border border-gray-200/60 p-12 rounded-[2.5rem] flex flex-col items-center justify-center text-center text-gray-400 space-y-4 min-h-[360px]">
                          <Lock className="w-10 h-10 text-gray-300" />
                          <h4 className="text-lg font-black text-gray-900">Integration Locked</h4>
                          <p className="text-xs text-gray-400 font-medium max-w-sm leading-relaxed">
                            Please authorize your Google account first. Once authorized, options to create new ledgers or link existing logs will become active.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sync Settings & Historical Sync */}
                  {googleSheetsStatus?.connected && googleSheetsStatus.spreadsheetId && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                      {/* Live Sync Toggle Card */}
                      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl flex items-center gap-6 justify-between">
                        <div className="space-y-1">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Live Distribution</span>
                          <h4 className="text-lg font-black text-gray-900">Real-time Auto-Sync</h4>
                          <p className="text-xs text-gray-400 font-medium">
                            If enabled, login requests instantly record rows to the sheet.
                          </p>
                        </div>
                        <div>
                          <button
                            onClick={() => handleToggleAutoSync(!googleSheetsStatus.autoSync)}
                            className={cn(
                              "w-16 h-8 rounded-full p-1 transition-all",
                              googleSheetsStatus.autoSync ? "bg-emerald-800 flex justify-end" : "bg-gray-200 flex justify-start"
                            )}
                          >
                            <motion.span 
                              layout 
                              className="w-6 h-6 rounded-full bg-white shadow-sm inline-block"
                            />
                          </button>
                        </div>
                      </div>

                      {/* Manual Full Dump */}
                      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl flex items-center justify-between gap-6">
                        <div className="space-y-1">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Historical Records</span>
                          <h4 className="text-lg font-black text-gray-900">Dump Existing Audit Trail</h4>
                          <p className="text-xs text-gray-400 font-medium">
                            Synchronize historical logins/actions that haven't been pushed.
                          </p>
                        </div>
                        <button 
                          onClick={handleSyncExisting}
                          disabled={sheetsSyncing}
                          className="px-6 py-4 bg-emerald-800 hover:bg-emerald-900 absolute md:relative right-0 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                        >
                          {sheetsSyncing ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            "Sync Now"
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : isRegisteringShop ? (
                <div className="bg-white p-10 rounded-[2.5rem] border border-emerald-500 shadow-2xl space-y-10 animate-in fade-in zoom-in duration-300">
                  <div className="flex items-center justify-between border-b pb-6">
                    <div>
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-1">New Node Registration</span>
                      <h3 className="text-2xl font-black text-gray-900">Provision New Facility</h3>
                    </div>
                    <button 
                      onClick={() => setIsRegisteringShop(false)} 
                      aria-label="Close node registration"
                      className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors"
                    >
                      <X aria-hidden="true" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <label htmlFor="node-reg-name" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Node Identity</label>
                        <input 
                          id="node-reg-name"
                          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:bg-white focus:border-emerald-500 transition-all outline-none"
                          placeholder="Shop Name (e.g. T. Nagar North Fair Price)"
                          value={newShopData.name}
                          onChange={(e) => setNewShopData({...newShopData, name: e.target.value})}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <input 
                            aria-label="Node Code"
                            className="p-4 bg-gray-50 border border-gray-100 rounded-2xl font-mono font-bold focus:bg-white focus:border-emerald-500 transition-all outline-none"
                            placeholder="Node Code (e.g. 102)"
                            value={newShopData.code}
                            onChange={(e) => setNewShopData({...newShopData, code: e.target.value})}
                          />
                          <input 
                            aria-label="Phone Interface"
                            className="p-4 bg-gray-50 border border-gray-100 rounded-2xl font-mono font-bold focus:bg-white focus:border-emerald-500 transition-all outline-none"
                            placeholder="Phone Interface"
                            value={newShopData.phone}
                            onChange={(e) => setNewShopData({...newShopData, phone: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label htmlFor="node-reg-address" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Geospatial Data</label>
                        <textarea 
                          id="node-reg-address"
                          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-medium focus:bg-white focus:border-emerald-500 transition-all outline-none resize-none h-24"
                          placeholder="Full Operational Address"
                          value={newShopData.address}
                          onChange={(e) => setNewShopData({...newShopData, address: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Operational Protocol</label>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Opening</label>
                            <input 
                              type="time" 
                              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-mono font-bold focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                              value={newShopData.openingTime}
                              onChange={(e) => setNewShopData({...newShopData, openingTime: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Closing</label>
                            <input 
                              type="time" 
                              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-mono font-bold focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                              value={newShopData.closingTime}
                              onChange={(e) => setNewShopData({...newShopData, closingTime: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-6">
                          <Package className="text-emerald-600 w-5 h-5" />
                          <h4 className="text-[10px] font-black text-emerald-900 uppercase tracking-widest">Initial Ledger & Stock Allocation</h4>
                        </div>
                        <div className="flex-1 space-y-4 overflow-y-auto pr-2 max-h-[300px]">
                          {newShopData.products?.map((prod: Product, idx: number) => (
                            <div key={prod.id} className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <input 
                                  className="text-xs font-black text-gray-900 bg-transparent border-b border-transparent focus:border-emerald-500 outline-none"
                                  value={prod.name}
                                  onChange={(e) => {
                                    const updatedProds = [...(newShopData.products || [])];
                                    updatedProds[idx] = { ...prod, name: e.target.value };
                                    setNewShopData({ ...newShopData, products: updatedProds });
                                  }}
                                  placeholder="Commodity Name"
                                />
                                <div className="flex gap-2 justify-end">
                                  <input 
                                    className="w-16 text-[10px] font-bold text-emerald-600 bg-transparent border-b border-transparent focus:border-emerald-500 outline-none text-right"
                                    type="number"
                                    value={prod.price}
                                    onChange={(e) => {
                                      const updatedProds = [...(newShopData.products || [])];
                                      updatedProds[idx] = { ...prod, price: Number(e.target.value) };
                                      setNewShopData({ ...newShopData, products: updatedProds });
                                    }}
                                    placeholder="Price"
                                  />
                                  <input 
                                    className="w-10 text-[10px] font-bold text-gray-400 bg-transparent border-b border-transparent focus:border-emerald-500 outline-none text-right uppercase"
                                    value={prod.unit}
                                    onChange={(e) => {
                                      const updatedProds = [...(newShopData.products || [])];
                                      updatedProds[idx] = { ...prod, unit: e.target.value };
                                      setNewShopData({ ...newShopData, products: updatedProds });
                                    }}
                                    placeholder="Unit"
                                  />
                                </div>
                                <input 
                                  className="text-[10px] text-gray-400 font-tamil bg-transparent border-b border-transparent focus:border-emerald-500 outline-none"
                                  value={prod.tamilName}
                                  onChange={(e) => {
                                    const updatedProds = [...(newShopData.products || [])];
                                    updatedProds[idx] = { ...prod, tamilName: e.target.value };
                                    setNewShopData({ ...newShopData, products: updatedProds });
                                  }}
                                  placeholder="மாவட்டம்/பெயர்"
                                />
                                <select 
                                  className="text-[10px] font-black text-emerald-600 bg-transparent border-b border-transparent focus:border-emerald-500 outline-none text-right appearance-none"
                                  value={prod.category}
                                  onChange={(e) => {
                                    const updatedProds = [...(newShopData.products || [])];
                                    updatedProds[idx] = { ...prod, category: e.target.value as any };
                                    setNewShopData({ ...newShopData, products: updatedProds });
                                  }}
                                >
                                  {['Rice', 'Sugar', 'Oil', 'Dhal', 'Other'].map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                  ))}
                                </select>
                                <button 
                                  onClick={() => {
                                    const updatedProds = (newShopData.products || []).filter((_, i) => i !== idx);
                                    setNewShopData({ ...newShopData, products: updatedProds });
                                  }}
                                  className="text-red-400 hover:text-red-600 text-[8px] font-black uppercase text-left col-span-2"
                                >
                                  Remove Commodity
                                </button>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min((prod.stock / 1000) * 100, 100)}%` }}
                                    className="h-full bg-emerald-500"
                                  />
                                </div>
                                <input 
                                  type="number"
                                  className="w-20 p-2 bg-gray-50 border border-gray-100 rounded-xl text-right font-mono font-bold text-xs focus:ring-2 focus:ring-emerald-500/20 outline-none"
                                  value={prod.stock}
                                  onChange={(e) => {
                                    const updatedProds = [...(newShopData.products || [])];
                                    updatedProds[idx] = { ...prod, stock: Number(e.target.value) };
                                    setNewShopData({ ...newShopData, products: updatedProds });
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                          <button 
                            onClick={() => {
                              const newProd: Product = {
                                id: `p-${Math.random().toString(36).substr(2, 5)}`,
                                name: '',
                                tamilName: '',
                                stock: 0,
                                unit: 'KG',
                                price: 0,
                                category: 'Other'
                              };
                              setNewShopData({ ...newShopData, products: [...(newShopData.products || []), newProd] });
                            }}
                            className="w-full py-3 border-2 border-dashed border-emerald-200 rounded-2xl text-emerald-600 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
                          >
                            <Plus className="w-3 h-3" /> Add Commodity
                          </button>
                        </div>
                        <p className="text-[10px] text-emerald-700/60 leading-relaxed font-medium mt-6 italic">
                          * These values represent the physical opening balance allocated to this node during system synchronization.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-8 border-t border-gray-50">
                    <button 
                      onClick={() => setIsRegisteringShop(false)}
                      className="px-8 py-3 text-gray-400 font-black text-xs uppercase tracking-widest hover:text-gray-900 transition-colors"
                    >
                      Cancel Registration
                    </button>
                    <button 
                      onClick={async () => {
                        if (!newShopData.name?.trim()) return alert('Node name designation mandatory.');
                        if (!newShopData.code?.trim()) return alert('X-Ident Node Code mandatory.');
                        if (!newShopData.address?.trim()) return alert('Physical address required for sync.');
                        if (!newShopData.phone?.trim()) return alert('Phone interface required.');
                        
                        try {
                          const createdShop = await api.createShop(newShopData);
                          setShops([...shops, createdShop]);
                          setIsRegisteringShop(false);
                          setNewShopData({
                            name: '',
                            address: '',
                            phone: '',
                            openingTime: '09:00',
                            closingTime: '18:00',
                            code: '',
                            latitude: 13.0418,
                            longitude: 80.2341,
                            lunchStart: '13:00',
                            lunchEnd: '14:00',
                            products: JSON.parse(JSON.stringify(INITIAL_PRODUCTS))
                          });
                          
                          // Trigger system-wide notification
                          await api.createNotification({
                            title: 'New Infrastructure Node Online',
                            message: `Facility "${createdShop.name}" [Code: ${createdShop.code}] has been provisioned and added to the network.`,
                            type: 'info'
                          });
                          // Refresh notifications for admin
                          if (user) {
                             const updated = await api.getNotifications(user.id);
                             setNotifications(updated);
                          }
                        } catch (err) {
                          alert('System fault during node provisioning.');
                        }
                      }}
                      className="px-10 py-4 bg-emerald-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-950/20 hover:bg-black transition-all"
                    >
                      Authorize Node Registration
                    </button>
                  </div>
                </div>
              ) : editingShop ? (
                <div className="bg-white p-10 rounded-[2.5rem] border border-emerald-100 shadow-2xl space-y-10 animate-in fade-in zoom-in duration-300">
                  <div className="flex items-center justify-between border-b pb-6">
                    <div>
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-1">Editing Mode</span>
                      <h3 className="text-2xl font-black">{editingShop.name}</h3>
                    </div>
                    <button 
                      onClick={() => setEditingShop(null)} 
                      aria-label="Close edit mode"
                      className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors"
                    >
                      <X aria-hidden="true" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <p className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Protocol Timings</p>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="edit-shop-open" className="text-[10px] font-bold text-emerald-700 uppercase ml-1">Open</label>
                          <input 
                            id="edit-shop-open"
                            type="time" 
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-mono font-bold focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                            value={editingShop.openingTime || ''}
                            onChange={(e) => setEditingShop({...editingShop, openingTime: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="edit-shop-close" className="text-[10px] font-bold text-emerald-700 uppercase ml-1">Close</label>
                          <input 
                            id="edit-shop-close"
                            type="time" 
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-mono font-bold focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                            value={editingShop.closingTime || ''}
                            onChange={(e) => setEditingShop({...editingShop, closingTime: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <p className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Identification</p>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label htmlFor="edit-shop-name" className="text-[10px] font-bold text-emerald-700 uppercase ml-1">Node Designation</label>
                          <input 
                            id="edit-shop-name"
                            className="w-full p-4 bg-gray-100 border border-transparent rounded-2xl font-bold focus:bg-white focus:border-emerald-500 transition-all"
                            placeholder="Node Designation"
                            value={editingShop.name || ''}
                            onChange={(e) => setEditingShop({...editingShop, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="edit-shop-phone" className="text-[10px] font-bold text-emerald-700 uppercase ml-1">Contact Interface</label>
                          <input 
                            id="edit-shop-phone"
                            className="w-full p-4 bg-gray-100 border border-transparent rounded-2xl font-mono font-bold focus:bg-white focus:border-emerald-500 transition-all"
                            placeholder="Contact Interface"
                            value={editingShop.phone || ''}
                            onChange={(e) => setEditingShop({...editingShop, phone: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <p className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Commodity Ledger</p>
                      {selectedBulkProductIds.length > 0 && (
                        <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
                          <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">
                            {selectedBulkProductIds.length} SELECTED
                          </span>
                          <input 
                            type="number"
                            placeholder="New Stock"
                            className="w-24 p-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                            value={bulkUpdateValues.stock}
                            onChange={(e) => setBulkUpdateValues({...bulkUpdateValues, stock: e.target.value})}
                          />
                          <input 
                            type="number"
                            placeholder="New Price"
                            className="w-24 p-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                            value={bulkUpdateValues.price}
                            onChange={(e) => setBulkUpdateValues({...bulkUpdateValues, price: e.target.value})}
                          />
                          <button 
                            onClick={async () => {
                              if (!editingShop) return;
                              const updates = selectedBulkProductIds.map(id => ({
                                id,
                                stock: bulkUpdateValues.stock !== '' ? Number(bulkUpdateValues.stock) : undefined,
                                price: bulkUpdateValues.price !== '' ? Number(bulkUpdateValues.price) : undefined
                              }));
                              try {
                                const updatedShop = await api.bulkUpdateProducts(editingShop.id, updates);
                                setShops(shops.map(s => s.id === editingShop.id ? updatedShop : s));
                                setEditingShop(updatedShop);
                                setSelectedBulkProductIds([]);
                                setBulkUpdateValues({ stock: '', price: '' });
                              } catch (err) {
                                alert('Bulk update failed');
                              }
                            }}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
                          >
                            Apply Bulk Changes
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {editingShop.products.map(product => {
                        const isSelected = selectedBulkProductIds.includes(product.id);
                        return (
                          <div 
                            key={product.id}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedBulkProductIds(selectedBulkProductIds.filter(id => id !== product.id));
                              } else {
                                setSelectedBulkProductIds([...selectedBulkProductIds, product.id]);
                              }
                            }}
                            className={cn(
                              "p-4 rounded-2xl border transition-all cursor-pointer group relative",
                              isSelected ? "bg-emerald-50 border-emerald-500 shadow-md" : "bg-gray-50 border-gray-100 hover:border-emerald-300"
                            )}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="text-sm font-black text-gray-900">{product.name}</h5>
                              {isSelected && <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
                            </div>
                            <div className="flex justify-between items-end">
                              <div className="space-y-1">
                                <p className="text-[10px] font-mono text-gray-400">STOCK: <span className="text-gray-900 font-bold">{product.stock} {product.unit}</span></p>
                                <p className="text-[10px] font-mono text-gray-400">PRICE: <span className="text-emerald-700 font-bold">₹{product.price}</span></p>
                              </div>
                              <span className="text-[8px] font-black text-gray-300 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                                Click to select
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-8 border-t border-gray-50">
                    <button 
                      onClick={() => {
                        setEditingShop(null);
                        setSelectedBulkProductIds([]);
                      }}
                      className="px-8 py-3 text-gray-400 font-black text-xs uppercase tracking-widest hover:text-gray-900 transition-colors"
                    >
                      Abort
                    </button>
                    <button 
                      onClick={async () => {
                        try {
                          const updatedShop = await api.updateShop(editingShop.id, editingShop);
                          setShops(shops.map(s => s.id === editingShop.id ? updatedShop : s));
                          setEditingShop(null);
                          setSelectedBulkProductIds([]);
                        } catch (err) {
                          alert('Failed to sync changes with server');
                        }
                      }}
                      className="px-10 py-4 bg-emerald-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-950/20 hover:bg-black transition-all"
                    >
                      Sync Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-[#F9FAFB] border-b border-gray-100 font-mono">
                      <tr>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-emerald-900/40">Network Node</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-emerald-900/40">X-Ident</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-emerald-900/40">Uptime</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-emerald-900/40">Reserve Status</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-emerald-900/40 text-right">Operations</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {shops.map(shop => (
                        <tr key={shop.id} className="hover:bg-emerald-50/20 transition-colors group">
                          <td className="px-8 py-8">
                            <p className="font-black text-gray-900 leading-tight group-hover:text-emerald-700 transition-colors">{shop.name}</p>
                            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter mt-1">{shop.address}</p>
                          </td>
                          <td className="px-8 py-8 font-mono text-xs font-bold text-emerald-600">{shop.code}</td>
                          <td className="px-8 py-8">
                            <div className="flex items-center gap-2 text-xs font-black text-gray-600">
                              <span className="font-mono">{shop.openingTime}</span>
                              <span className="opacity-20">—</span>
                              <span className="font-mono">{shop.closingTime}</span>
                            </div>
                          </td>
                          <td className="px-8 py-8">
                            <div className="flex gap-1.5">
                              {shop.products.map(p => (
                                 <div key={p.id} className={cn("w-2 h-2 rounded-full", p.stock > 10 ? "bg-emerald-500" : p.stock > 0 ? "bg-amber-500" : "bg-red-500")} title={`${p.name}: ${p.stock}`} />
                              ))}
                            </div>
                          </td>
                          <td className="px-8 py-8 text-right">
                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => setEditingShop(shop)}
                                aria-label={`Edit ${shop.name}`}
                                className="w-10 h-10 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                              >
                                <Edit2 className="w-4 h-4" aria-hidden="true" />
                              </button>
                              <button 
                                onClick={() => setDecommissioningShop(shop)}
                                aria-label={`Delete ${shop.name}`}
                                className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-300 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                              >
                                <Trash2 className="w-4 h-4" aria-hidden="true" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <AnimatePresence>
                {decommissioningShop && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="bg-white max-w-md w-full p-10 rounded-[2.5rem] border border-red-100 shadow-2xl space-y-8"
                    >
                      <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto">
                        <Trash2 className="w-10 h-10" />
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">Decommission Node?</h3>
                        <p className="text-gray-400 font-medium leading-relaxed">
                          You are about to permanently decommission <span className="text-gray-900 font-bold">{decommissioningShop.name}</span>. 
                          This action will remove the node <span className="font-mono text-[10px] bg-red-50 text-red-600 px-1 rounded">#{decommissioningShop.code}</span> from the network registry.
                        </p>
                      </div>
                      <div className="flex flex-col gap-3 pt-4">
                        <button 
                          onClick={async () => {
                            try {
                              await api.deleteShop(decommissioningShop.id);
                              setShops(shops.filter(s => s.id !== decommissioningShop.id));
                              setDecommissioningShop(null);
                            } catch (err: any) {
                              alert(err.message);
                            }
                          }}
                          className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-red-200 active:scale-95"
                        >
                          Confirm Decommission
                        </button>
                        <button 
                          onClick={() => setDecommissioningShop(null)}
                          className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all font-mono"
                        >
                          Abort Protocol
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}


          {activeTab === 'staff' && user?.role === UserRole.STAFF && (() => {
            const myShop = shops.find(s => s.id === (user.shopId || 's1'));
            
            // Calculate daily generated bill sales for the current week (Sunday - Saturday)
            const getWeekSales = () => {
              const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
              const dayAcronyms = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
              const tamilDays = ['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி'];
              
              const now = new Date();
              const currentDay = now.getDay(); // 0 is Sunday, ..., 6 is Saturday
              
              const weekDates = Array.from({ length: 7 }, (_, i) => {
                const d = new Date(now);
                d.setDate(now.getDate() - currentDay + i);
                d.setHours(0, 0, 0, 0);
                return d;
              });

              return weekDates.map((date, idx) => {
                const dateStr = date.toDateString();
                const dayTotal = bills
                  .filter(bill => {
                    const billDate = new Date(bill.timestamp);
                    return billDate.toDateString() === dateStr && bill.shopId === (user.shopId || 's1');
                  })
                  .reduce((sum, bill) => sum + (bill.totalAmount || 0), 0);

                return {
                  day: dayAcronyms[idx],
                  fullDay: daysOfWeek[idx],
                  tamilDay: tamilDays[idx],
                  sales: Number(dayTotal.toFixed(2)),
                  formattedSales: `₹${dayTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                };
              });
            };

            const weekSalesData = getWeekSales();
            const totalWeeklySales = weekSalesData.reduce((sum, item) => sum + item.sales, 0);
            const averageDailySales = totalWeeklySales / 7;
            const highestEarningItem = [...weekSalesData].sort((a, b) => b.sales - a.sales)[0];
            const highestEarningDay = highestEarningItem && highestEarningItem.sales > 0 
              ? `${highestEarningItem.fullDay} / ${highestEarningItem.tamilDay}` 
              : 'No Sales / விற்பனை இல்லை';
            const highestEarningAmount = highestEarningItem ? highestEarningItem.sales : 0;

            return (
              <motion.div 
                 key="staff"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="space-y-10"
              >
                <div className="bg-emerald-900 p-10 rounded-[2.5rem] border border-emerald-800 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="absolute top-0 right-0 p-10 opacity-10">
                    <Package className="w-48 h-48" />
                  </div>
                  <div className="relative z-10">
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] block mb-2">Authenticated Interface</span>
                    <h2 className="text-3xl font-black tracking-tight">{myShop?.name || 'Staff Portal'}</h2>
                    <p className="text-emerald-100/60 mt-2">Managing inventory for <span className="text-white font-bold underline underline-offset-4 decoration-emerald-500">TNPDS #102 - T. Nagar</span></p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 relative z-10">
                    <div className={cn(
                      "px-6 py-3 rounded-2xl border transition-all flex flex-col min-w-[140px]",
                      isSyncing ? "bg-blue-900/50 border-blue-700/50 text-blue-100" :
                      isOffline ? "bg-amber-900/50 border-amber-700/50 text-amber-100" : 
                      "bg-emerald-800/50 border-emerald-700/50 text-green-400"
                    )}>
                      <p className="text-[10px] font-black uppercase opacity-60 tracking-widest mb-1">
                        {isSyncing ? 'Synchronizing' : 'Network Status'}
                      </p>
                      <div className="flex items-center gap-2 font-mono font-bold">
                        <div className={cn(
                          "w-2 h-2 rounded-full animate-pulse", 
                          isSyncing ? "bg-blue-400" :
                          isOffline ? "bg-amber-400" : 
                          "bg-green-400"
                        )} />
                        {isSyncing ? `${syncProgress.current}/${syncProgress.total} OPS` :
                         isOffline ? 'OFFLINE_MODE' : 'LIVE_SYNC'}
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsOffline(!isOffline)}
                      className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-2xl border border-white/10 font-bold text-xs uppercase tracking-widest transition-all"
                    >
                      Toggle {isOffline ? 'Online' : 'Offline'}
                    </button>
                  </div>
                </div>

                {/* Shop Settings Section */}
                <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-8">
                  <div className="flex items-center gap-3">
                    <Clock className="text-emerald-600 w-5 h-5" />
                    <h3 className="text-xl font-black text-gray-800">Operational Protocol</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <label htmlFor="staff-open-time" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Daily Opening Time</label>
                      <input 
                        id="staff-open-time"
                        type="time" 
                        value={myShop?.openingTime || '09:00'}
                        onChange={async (e) => {
                          const val = e.target.value;
                          // Optimistic
                          setShops(shops.map(s => s.id === (user.shopId || 's1') ? { ...s, openingTime: val } : s));
                          
                          if (isOffline) {
                            syncManager.addToQueue('SHOP_TIMES_UPDATE', user.shopId || 's1', { openingTime: val });
                            return;
                          }

                          try {
                            const updatedShop = await api.updateShopTimes(user.shopId || 's1', { openingTime: val });
                            setShops(shops.map(s => s.id === (user.shopId || 's1') ? updatedShop : s));
                            await api.createNotification({
                              userId: user.id,
                              title: 'Operational Schedule Modified',
                              message: `Opening time for your assigned node has been successfully updated to ${val}.`,
                              type: 'success'
                            });
                            const updated = await api.getNotifications(user.id);
                            setNotifications(updated);
                          } catch (err) {
                            syncManager.addToQueue('SHOP_TIMES_UPDATE', user.shopId || 's1', { openingTime: val });
                            setIsOffline(true);
                          }
                        }}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-mono font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                       <label htmlFor="staff-close-time" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cease Operations Time</label>
                       <input 
                        id="staff-close-time"
                        type="time" 
                        value={myShop?.closingTime || '18:00'}
                        onChange={async (e) => {
                          const val = e.target.value;
                          // Optimistic
                          setShops(shops.map(s => s.id === (user.shopId || 's1') ? { ...s, closingTime: val } : s));

                          if (isOffline) {
                            syncManager.addToQueue('SHOP_TIMES_UPDATE', user.shopId || 's1', { closingTime: val });
                            return;
                          }

                          try {
                            const updatedShop = await api.updateShopTimes(user.shopId || 's1', { closingTime: val });
                            setShops(shops.map(s => s.id === (user.shopId || 's1') ? updatedShop : s));
                            await api.createNotification({
                              userId: user.id,
                              title: 'Operational Schedule Modified',
                              message: `Closing time for your assigned node has been successfully updated to ${val}.`,
                              type: 'success'
                            });
                            const updated = await api.getNotifications(user.id);
                            setNotifications(updated);
                          } catch (err) {
                            syncManager.addToQueue('SHOP_TIMES_UPDATE', user.shopId || 's1', { closingTime: val });
                            setIsOffline(true);
                          }
                        }}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-mono font-bold"
                      />
                    </div>
                    <div className="flex flex-col justify-end">
                      <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                           <Check className="w-4 h-4" />
                         </div>
                         <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-tight">Time settings synced to network</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Weekly Sales & Analytics Summary */}
                <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-center text-emerald-600">
                        <FileSpreadsheet className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-gray-800">Weekly Performance / வாராந்திர விற்பனை</h3>
                        <p className="text-xs text-gray-400 mt-0.5 font-medium">Daily generated bill sales for the current week</p>
                      </div>
                    </div>
                    <div className="bg-emerald-50/60 px-6 py-3 rounded-2xl border border-emerald-100 flex flex-col items-end">
                      <span className="text-[9px] font-black text-emerald-800 uppercase tracking-wider block">Weekly Gross Revenue</span>
                      <span className="text-lg font-black text-emerald-950 font-mono">₹{totalWeeklySales.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  {/* Summary KPI Cards Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    {/* Total Sales Card */}
                    <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 p-6 rounded-3xl border border-emerald-800 text-white shadow-md flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-wider block">Total Sales for Week / வாரத்தின் மொத்த விற்பனை</span>
                        <h4 className="text-2xl font-black font-mono">₹{totalWeeklySales.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
                        <p className="text-[10px] text-emerald-200/60 font-medium">Accumulated gross revenue</p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-emerald-800/50 border border-emerald-700/50 flex items-center justify-center text-emerald-300 shrink-0">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Average Daily Sales Card */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm flex items-center justify-between hover:border-emerald-200 transition-all">
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Average Daily Sales / சராசரி தினசரி விற்பனை</span>
                        <h4 className="text-2xl font-black text-gray-800 font-mono">₹{averageDailySales.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
                        <p className="text-[10px] text-gray-400 font-medium">Daily average across 7 operational days</p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                        <FileSpreadsheet className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Highest Earning Day Card */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm flex items-center justify-between hover:border-emerald-200 transition-all">
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Highest Earning Day / அதிக விற்பனை செய்த நாள்</span>
                        <h4 className="text-lg font-black text-gray-800 leading-tight truncate max-w-[200px] sm:max-w-none">
                          {highestEarningDay}
                        </h4>
                        <p className="text-xs font-bold text-emerald-600 font-mono mt-1">
                          {highestEarningAmount > 0 ? `₹${highestEarningAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A'}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                        <Calendar className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  {/* Recharts Bar Chart Visualizer */}
                  <div className="w-full bg-gray-50/30 p-6 rounded-3xl border border-gray-100">
                    <div className="h-[260px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weekSalesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                          <XAxis 
                            dataKey="day" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: '700' }} 
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: '700' }} 
                            tickFormatter={(value) => `₹${value}`}
                          />
                          <Tooltip 
                            cursor={{ fill: 'rgba(16, 185, 129, 0.04)', radius: 12 }}
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-150 animate-in fade-in zoom-in-95 duration-150">
                                    <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">{data.fullDay} / {data.tamilDay}</p>
                                    <p className="text-base font-black text-gray-900 mt-1 font-mono">{data.formattedSales}</p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar 
                            dataKey="sales" 
                            fill="#065f46" 
                            radius={[8, 8, 0, 0]} 
                            maxBarSize={48}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Micro-insights grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
                    {weekSalesData.map((data, idx) => {
                      const isToday = new Date().getDay() === idx;
                      return (
                        <div 
                          key={data.day} 
                          className={cn(
                            "p-4 rounded-2xl border text-center transition-all",
                            isToday 
                              ? "bg-emerald-900/5 border-emerald-200 shadow-sm" 
                              : "bg-gray-55 border-gray-150 hover:bg-gray-50"
                          )}
                        >
                          <span className={cn(
                            "text-[10px] font-black uppercase tracking-wider block",
                            isToday ? "text-emerald-700" : "text-gray-400"
                          )}>
                            {data.day}
                          </span>
                          <span className="text-[8px] font-semibold text-gray-400 block -mt-0.5 italic">{data.tamilDay}</span>
                          <span className="text-xs font-black text-gray-900 font-mono block mt-2">
                            ₹{data.sales.toFixed(0)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-black text-gray-800 flex items-center gap-3">
                    <Users className="text-emerald-600 w-5 h-5" />
                    Household Management
                  </h3>
                  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-8">
                    <div className="flex flex-col xl:flex-row gap-6 items-end">
                      <div className="flex-1 w-full space-y-2">
                        <label htmlFor="staff-search-card" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Household Ration Card or Head Name</label>
                        <div className="relative">
                          <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" aria-hidden="true" />
                          <input 
                            id="staff-search-card"
                            className="w-full pl-16 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-3xl font-mono font-black text-lg focus:bg-white focus:border-emerald-500 transition-all outline-none"
                            placeholder="32XXXXXXXXXX or Name"
                          />
                        </div>
                      </div>
                      <div className="flex w-full xl:w-auto gap-4">
                        <button 
                          onClick={() => {
                            const input = document.getElementById('staff-search-card') as HTMLInputElement;
                            if (input.value) {
                               api.searchRationCards(input.value)
                                .then(results => {
                                  if (results.length === 0) {
                                    alert("Household not found in registry.");
                                  } else {
                                    setAdminCards(prev => {
                                      const newCards = results.filter(r => !prev.some(p => p.cardNumber === r.cardNumber));
                                      return [...prev, ...newCards];
                                    });
                                    setIsAddingMember(results[0].cardNumber);
                                    setStaffSubMode('billing');
                                  }
                                })
                                .catch(() => alert("Search service error."));
                            }
                          }}
                          className="flex-1 xl:flex-none px-8 py-5 bg-emerald-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-95 h-[68px] flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/10 border-b-2 border-emerald-950"
                        >
                          Search Record
                        </button>
                        <button 
                          onClick={() => {
                            setIsQRScannerOpen(true);
                          }}
                          className="flex-1 xl:flex-none px-8 py-5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-3xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 h-[68px] flex items-center justify-center gap-2 shadow-sm"
                        >
                          <QrCode className="w-5 h-5 text-emerald-600" />
                          Scan QR Card
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 font-medium leading-relaxed italic border-l-2 border-emerald-500 pl-4 py-2">
                      Authorized Personnel only. Addition of members requires verification of Aadhaar and original documents. 
                      Digital signatures are logged for audit purposes.
                    </p>

                    {/* Quick Access Registry Directory */}
                    {!isAddingMember && adminCards && adminCards.length > 0 && (
                      <div className="border-t pt-8 space-y-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          Quick Access Shop Registry / விரைவுத் தேர்வு
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {adminCards.map(card => (
                            <div key={card.cardNumber} className="bg-gray-50 hover:bg-emerald-50/20 p-6 rounded-[2rem] border border-gray-150 transition-all hover:border-emerald-200 hover:shadow-md flex flex-col justify-between space-y-4">
                              <div>
                                <div className="flex justify-between items-center">
                                  <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">{card.cardNumber}</span>
                                  <span className={cn(
                                    "px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-wider",
                                    card.cardType === 'AYY' ? "bg-amber-100 text-amber-800 border border-amber-200" :
                                    card.cardType === 'PHH' ? "bg-emerald-100 text-emerald-800 border border-emerald-200" :
                                    "bg-blue-100 text-blue-800 border border-blue-200"
                                  )}>
                                    {card.cardType}
                                  </span>
                                </div>
                                <h5 className="text-base font-black text-gray-900 mt-2 leading-tight">{card.headOfFamily}</h5>
                                <p className="text-[10px] text-gray-450 mt-1 truncate">{card.members.length} Members • {card.address}</p>
                              </div>
                              <div className="flex gap-2 pt-2 border-t border-dashed border-gray-200">
                                <button
                                  onClick={() => {
                                    setIsAddingMember(card.cardNumber);
                                    setStaffSubMode('billing');
                                  }}
                                  className="flex-1 py-2.5 bg-emerald-950 text-white rounded-xl text-[9px] font-extrabold uppercase tracking-wide transition-all shadow-sm active:scale-95 text-center block hover:bg-black"
                                >
                                  💳 Issue Bill
                                </button>
                                <button
                                  onClick={() => {
                                    setIsAddingMember(card.cardNumber);
                                    setStaffSubMode('members');
                                  }}
                                  className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 rounded-xl text-[9px] font-extrabold uppercase tracking-wide transition-all active:scale-95 text-center block"
                                >
                                  👥 Members
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {adminCards.filter(c => isAddingMember === c.cardNumber).map(card => (
                    <div key={card.cardNumber} className="animate-in fade-in slide-in-from-top-4 duration-500">
                      <div className="bg-white p-10 rounded-[2.5rem] border border-emerald-500 shadow-2xl space-y-10 overflow-hidden relative">
                        {/* Go Back / Close Button */}
                        <button
                          type="button"
                          onClick={() => setIsAddingMember(null)}
                          className="absolute top-8 right-8 w-11 h-11 rounded-2xl bg-gray-50 border border-gray-150 flex items-center justify-center text-gray-500 hover:text-red-700 hover:bg-red-50 hover:border-red-100 transition-all active:scale-95 shadow-sm"
                          title="Exit Household Session"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-6 border-b pb-8">
                          <div className="w-16 h-16 bg-emerald-900 text-white rounded-3xl flex items-center justify-center font-mono font-black text-xl">
                            {card.cardNumber.slice(-2)}
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-2">Authenticated Household</p>
                            <h3 className="text-2xl font-black text-gray-900">{card.headOfFamily}</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter mt-1">{card.district} • {card.cardType}</p>
                          </div>
                        </div>

                        {/* Sub Mode Tab Bar */}
                        <div className="flex flex-wrap gap-4 border-b border-gray-100 pb-6">
                          <button
                            type="button"
                            onClick={() => {
                              setStaffSubMode('billing');
                              setBillError(null);
                            }}
                            className={cn(
                              "px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all",
                              staffSubMode === 'billing' 
                                ? "bg-emerald-900 text-white shadow-lg shadow-emerald-900/25" 
                                : "bg-gray-50 text-gray-400 hover:bg-gray-150"
                            )}
                          >
                            💳 Issue Commodity Bill / ரசீது
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setStaffSubMode('members');
                              setBillError(null);
                            }}
                            className={cn(
                              "px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all",
                              staffSubMode === 'members' 
                                ? "bg-emerald-900 text-white shadow-lg shadow-emerald-900/25" 
                                : "bg-gray-50 text-gray-400 hover:bg-gray-150"
                            )}
                          >
                            👥 Manage Family Registry / உறுப்பினர்கள்
                          </button>
                        </div>

                        {staffSubMode === 'billing' ? (
                          <div className="space-y-8 animate-in fade-in duration-300">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100/50 gap-4">
                              <div className="space-y-1">
                                <span className="text-[9px] font-black uppercase text-emerald-700 tracking-widest bg-emerald-100/60 px-2 py-0.5 rounded-md">Operator Session</span>
                                <h4 className="text-sm font-black text-emerald-950">{user?.name || "FPS Staff Officer"} (Shop: {user?.shopId || "s1"})</h4>
                              </div>
                              <div className="text-left w-full sm:w-auto">
                                <label htmlFor="bill-receiver-select" className="block text-[9px] font-black uppercase text-gray-400 tracking-widest mb-1.5 ml-1">Receiving Family Entity</label>
                                <select 
                                  id="bill-receiver-select"
                                  className="w-full sm:w-auto p-3 pr-8 bg-white border border-gray-200 rounded-2xl text-xs font-black text-gray-700 outline-none appearance-none cursor-pointer"
                                >
                                  {card.members.map(m => (
                                    <option key={m.id} value={m.name}>{m.name} ({m.relation})</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {billError && (
                              <div className="bg-red-50 text-red-700 p-6 rounded-3xl border border-red-100/80 text-xs font-bold leading-relaxed">
                                ⚠️ {billError}
                              </div>
                            )}

                            <div className="space-y-4">
                              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Sale Distribution Registry</h4>
                              <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                  <table className="w-full text-left border-collapse">
                                    <thead>
                                      <tr className="bg-gray-50 border-b text-[10px] font-black uppercase text-gray-450 tracking-widest">
                                        <th className="p-5">Commodity Details</th>
                                        <th className="p-5 text-right">Shop Stock</th>
                                        <th className="p-5 text-right">Unit Price</th>
                                        <th className="p-5 text-center">Month Quota</th>
                                        <th className="p-5 text-center">Consumed</th>
                                        <th className="p-5 text-center bg-gray-50">Uplift Qty</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y text-xs">
                                      {card.allocations.map(alloc => {
                                        const shopProduct = shops.find(s => s.id === (user?.shopId || 's1'))?.products?.find(p => p.id === alloc.productId) || INITIAL_PRODUCTS.find(p => p.id === alloc.productId);
                                        const remainingAlloc = Math.max(0, alloc.quantity - (alloc.consumed || 0));
                                        const qtyVal = billingQuantities[alloc.productId] !== undefined ? billingQuantities[alloc.productId] : "";
                                        
                                        return (
                                          <tr key={alloc.productId} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="p-5">
                                              <p className="font-black text-gray-900">{shopProduct?.name}</p>
                                              <p className="text-[10px] text-gray-450 font-tamil mt-0.5">{shopProduct?.tamilName}</p>
                                            </td>
                                            <td className="p-5 text-right font-mono font-bold text-gray-500">
                                              {shopProduct ? `${shopProduct.stock} ${shopProduct.unit}` : "N/A"}
                                            </td>
                                            <td className="p-5 text-right font-bold text-gray-700">
                                              {shopProduct?.price === 0 ? (
                                                <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-100 uppercase tracking-wider font-extrabold text-[9px]">Free</span>
                                              ) : `₹${shopProduct?.price}`}
                                            </td>
                                            <td className="p-5 text-center font-bold text-gray-500">
                                              {alloc.quantity} {shopProduct?.unit}
                                            </td>
                                            <td className="p-5 text-center font-bold text-gray-400">
                                              {alloc.consumed || 0} {shopProduct?.unit}
                                            </td>
                                            <td className="p-5 text-center bg-emerald-50/10 w-48">
                                              <div className="flex items-center gap-2 justify-center">
                                                <input
                                                  type="number"
                                                  step="any"
                                                  min="0"
                                                  placeholder="0.0"
                                                  value={qtyVal}
                                                  onChange={(e) => {
                                                    const val = e.target.value;
                                                    setBillingQuantities(prev => ({
                                                      ...prev,
                                                      [alloc.productId]: val
                                                    }));
                                                  }}
                                                  className="w-24 p-3 border rounded-xl font-bold font-mono text-center outline-none focus:ring-4 focus:ring-emerald-500/10 text-xs text-gray-850 bg-white"
                                                />
                                                <span className="text-[10px] font-bold text-gray-400 uppercase">{shopProduct?.unit}</span>
                                              </div>
                                              {qtyVal !== "" && parseFloat(qtyVal) > remainingAlloc && (
                                                <p className="text-[8px] font-black text-red-500 mt-1 uppercase tracking-tight">Limit Exceeded (Max: {remainingAlloc})</p>
                                              )}
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>

                            {/* Summary Footer */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-t border-gray-100 pt-8">
                              <div className="space-y-1.5 w-full md:w-auto">
                                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest">Payment Mechanism</label>
                                <div className="flex gap-2">
                                  {(['Cash', 'UPI', 'Card'] as const).map(mode => (
                                    <button
                                      key={mode}
                                      type="button"
                                      onClick={() => setPaymentMode(mode)}
                                      className={cn(
                                        "px-5 py-3 rounded-xl text-xs font-bold transition-all",
                                        paymentMode === mode 
                                          ? "bg-emerald-900 text-white shadow-md shadow-emerald-900/10" 
                                          : "bg-gray-50 border text-gray-400 hover:bg-gray-100"
                                      )}
                                    >
                                      {mode}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="text-right space-y-4 w-full md:w-auto">
                                <div>
                                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mr-1">Grand Subtotal</p>
                                  <h3 className="text-4xl font-extrabold text-gray-900 mt-1">
                                    ₹{
                                      Object.entries(billingQuantities).reduce((acc, [pid, qty]) => {
                                        const qnt = parseFloat(qty as string) || 0;
                                        const productObj = shops.find(s => s.id === (user?.shopId || 's1'))?.products?.find(p => p.id === pid) || INITIAL_PRODUCTS.find(p => p.id === pid);
                                        return acc + (qnt * (productObj?.price || 0));
                                      }, 0).toFixed(2)
                                    }
                                  </h3>
                                </div>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    setBillError(null);
                                    setIsSubmittingBill(true);
                                    try {
                                      // Compile items to buy
                                      const itemsToSub = Object.entries(billingQuantities)
                                        .filter(([_, qty]) => {
                                          const num = parseFloat(qty as string);
                                          return !isNaN(num) && num > 0;
                                        })
                                        .map(([pid, qty]) => ({
                                          productId: pid,
                                          quantity: parseFloat(qty as string)
                                        }));

                                      if (itemsToSub.length === 0) {
                                        throw new Error("You must select at least one commodity quantity to distribute.");
                                      }

                                      // Validate no inputs exceeded limit
                                      for (const targetItem of itemsToSub) {
                                        const targetAlloc = card.allocations.find(a => a.productId === targetItem.productId);
                                        if (targetAlloc) {
                                          const maxVal = targetAlloc.quantity - (targetAlloc.consumed || 0);
                                          if (targetItem.quantity > maxVal) {
                                            const pName = INITIAL_PRODUCTS.find(p => p.id === targetItem.productId)?.name || "Item";
                                            throw new Error(`Uplift for ${pName} exceeds remaining monthly allocation limit (Max allowed: ${maxVal}).`);
                                          }
                                        }
                                      }

                                      const createdB = await api.createBill({
                                        cardNumber: card.cardNumber,
                                        shopId: user?.shopId || 's1',
                                        items: itemsToSub as any,
                                        paymentMode: paymentMode
                                      });

                                      // Successful submission!
                                      setBillingQuantities({});
                                      await fetchBills();
                                      const freshShops = await api.getShops();
                                      setShops(mergeWithMasterShops(freshShops));
                                      
                                      setAdminCards(prev => prev.map(c => {
                                        if (c.cardNumber === card.cardNumber) {
                                          const updatedAllocations = c.allocations.map(a => {
                                            const billItm = createdB.items.find(i => i.productId === a.productId);
                                            if (billItm) {
                                              return { ...a, consumed: (a.consumed || 0) + billItm.quantity };
                                            }
                                            return a;
                                          });
                                          return { ...c, allocations: updatedAllocations };
                                        }
                                        return c;
                                      }));

                                      setActiveBillSelection(createdB);
                                      
                                      await api.createNotification({
                                        userId: user?.id,
                                        title: 'Billing Invoice Issued',
                                        message: `Issued bill invoice ${createdB.billNumber} to ${card.headOfFamily} for ₹${createdB.totalAmount}.`,
                                        type: 'success'
                                      });
                                    } catch (err: any) {
                                      setBillError(err.message || "Failed to finalize transaction. Verify stocks and allocations.");
                                    } finally {
                                      setIsSubmittingBill(false);
                                    }
                                  }}
                                  disabled={isSubmittingBill}
                                  className="w-full md:w-auto px-10 py-5 bg-emerald-900 border-b-4 border-emerald-950 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:bg-emerald-950 transition-all active:scale-95 disabled:opacity-50"
                                >
                                  {isSubmittingBill ? (
                                    <>
                                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                      <span>Registering Sale Ledger...</span>
                                    </>
                                  ) : (
                                    <>
                                      <QrCode className="w-4 h-4" />
                                      <span>Sell Commodities & Print Receipt</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in duration-300">
                            <div className="space-y-6">
                              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Registry ({card.members.length} People)</h4>
                              <div className="space-y-3">
                                {card.members.map(m => (
                                  <div key={m.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div>
                                      <p className="text-sm font-black text-gray-900">{m.name}</p>
                                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{m.relation}</p>
                                    </div>
                                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{m.age}Y</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-6">
                              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Register Addendum</h4>
                              <div className="bg-emerald-50/50 p-8 rounded-3xl border border-emerald-100 space-y-6">
                                <div className="space-y-2">
                                  <label htmlFor="add-member-name" className="text-[10px] font-black text-gray-400 uppercase ml-1">Full Entity Name</label>
                                  <input 
                                    id="add-member-name"
                                    className="w-full p-4 bg-white border border-emerald-100 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                                    placeholder="Legal Name"
                                    value={newMemberData.name}
                                    onChange={(e) => setNewMemberData({...newMemberData, name: e.target.value})}
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <label htmlFor="add-member-relation" className="text-[10px] font-black text-gray-400 uppercase ml-1">Relation</label>
                                    <select 
                                      id="add-member-relation"
                                      className="w-full p-4 bg-white border border-emerald-100 rounded-2xl font-bold text-xs outline-none appearance-none cursor-pointer"
                                      value={newMemberData.relation}
                                      onChange={(e) => setNewMemberData({...newMemberData, relation: e.target.value})}
                                    >
                                      <option>Spouse</option>
                                      <option>Son</option>
                                      <option>Daughter</option>
                                      <option>Father</option>
                                      <option>Mother</option>
                                      <option>Step-Child</option>
                                      <option>Member</option>
                                    </select>
                                  </div>
                                  <div className="space-y-2">
                                    <label htmlFor="add-member-age" className="text-[10px] font-black text-gray-400 uppercase ml-1">Age</label>
                                    <input 
                                      id="add-member-age"
                                      type="number"
                                      className="w-full p-4 bg-white border border-emerald-100 rounded-2xl font-bold text-sm outline-none"
                                      placeholder="Age"
                                      value={newMemberData.age || ''}
                                      onChange={(e) => setNewMemberData({...newMemberData, age: Number(e.target.value)})}
                                    />
                                  </div>
                                </div>
                                <button 
                                  onClick={async () => {
                                    if (!newMemberData.name?.trim()) return alert("Entity name is required");
                                    if (!newMemberData.relation) return alert("Relation is required");
                                    if (newMemberData.age < 0 || newMemberData.age > 120) return alert("Invalid age provided (0-120)");

                                    try {
                                      const updated = await api.addFamilyMember(card.cardNumber, newMemberData);
                                      setAdminCards(adminCards.map(c => c.cardNumber === card.cardNumber ? updated : c));
                                      setNewMemberData({ name: '', relation: 'Member', age: 0 });
                                    } catch (err: any) {
                                      alert(err.message);
                                    }
                                  }}
                                  className="w-full py-4 bg-emerald-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-900/20 hover:bg-black transition-all"
                                >
                                  Commit to Registry
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-black text-gray-800 flex items-center gap-3">
                    <Package className="text-emerald-600 w-5 h-5" />
                    Inventory Matrix
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {(myShop?.products || []).map(product => (
                      <div key={product.id} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl group hover:border-emerald-200 transition-all flex flex-col">
                        <div className="flex justify-between items-start mb-10">
                          <div>
                            <h4 className="text-xl font-black text-gray-900 leading-tight">{product.name}</h4>
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1 font-tamil">{product.tamilName}</p>
                          </div>
                          <div className="bg-gray-50 px-3 py-1.5 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            UNIT: {product.unit}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6 mt-auto">
                          <button 
                            onClick={() => updateShopStock(user.shopId || 's1', product.id, Math.max(0, product.stock - 10))}
                            aria-label={`Decrease ${product.name} stock`}
                            className="w-14 h-14 flex items-center justify-center bg-gray-50 hover:bg-gray-900 hover:text-white rounded-2xl font-black text-2xl transition-all border border-transparent hover:border-black active:scale-90"
                          >
                            -
                          </button>
                          <div className="flex-1 text-center bg-gray-50/50 p-4 rounded-3xl border border-gray-50 relative overflow-hidden">
                            <p className="text-4xl font-black text-gray-900 font-mono">{product.stock}</p>
                            <AnimatePresence mode="popLayout">
                              {lastStockUpdate && lastStockUpdate.productId === product.id && (
                                <motion.div
                                  key={lastStockUpdate.timestamp}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.5 }}
                                  className={cn(
                                    "absolute top-2 right-2 text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-sm",
                                    lastStockUpdate.newStock > lastStockUpdate.prevStock ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                                  )}
                                >
                                  {lastStockUpdate.newStock > lastStockUpdate.prevStock ? '+' : ''}{lastStockUpdate.newStock - lastStockUpdate.prevStock}
                                </motion.div>
                              )}
                            </AnimatePresence>
                            <p className="text-[10px] uppercase font-black text-gray-300 tracking-widest mt-1">Reserve</p>
                          </div>
                          <button 
                             onClick={() => updateShopStock(user.shopId || 's1', product.id, product.stock + 10)}
                            aria-label={`Increase ${product.name} stock`}
                            className="w-14 h-14 flex items-center justify-center bg-emerald-600 hover:bg-black text-white rounded-2xl font-black text-2xl transition-all shadow-lg shadow-emerald-200 active:scale-90"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <AnimatePresence>
                  {lastStockUpdate && (
                    <motion.div
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 100, opacity: 0 }}
                      className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 text-white px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-6 border border-white/10 backdrop-blur-xl"
                    >
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Stock Adjusted</p>
                        <p className="text-sm font-bold">{lastStockUpdate.productName}: {lastStockUpdate.prevStock} → {lastStockUpdate.newStock}</p>
                      </div>
                      <button 
                        onClick={undoStockUpdate}
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-white hover:text-emerald-900 text-white px-5 py-2.5 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Undo Adjustment
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })()}
          {/* Unauthorized Fallback */}
          {((activeTab === 'admin' && user?.role !== UserRole.ADMIN) || 
            (activeTab === 'staff' && user?.role !== UserRole.STAFF) ||
            (activeTab === 'mycard' && user?.role !== UserRole.CUSTOMER)) && (
            <motion.div 
              key="unauthorized"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-[60vh]"
            >
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto">
                  <AlertCircle className="w-10 h-10 text-red-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-gray-900">Access Restricted</h3>
                  <p className="text-gray-400 font-medium">Your current credentials do not grant access to this sector.</p>
                </div>
                <button 
                  onClick={() => setActiveTab('home')}
                  className="px-8 py-3 bg-gray-900 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-gray-200"
                >
                  Return to Network
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      </div>

      {/* Modal - Shop Details */}
      <AnimatePresence>
        {selectedShop && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 sm:p-24">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setSelectedShop(null)}
               className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative z-10 w-full flex justify-center"
            >
              <div className="relative">
                <button 
                  onClick={() => setSelectedShop(null)}
                  aria-label="Close details"
                  className="absolute -top-3 -right-3 z-20 w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center border border-gray-100 hover:scale-110 active:scale-95 transition-all text-gray-400 hover:text-gray-900"
                >
                  <X aria-hidden="true" />
                </button>
                <ShopDetails 
                  shop={selectedShop} 
                  user={user} 
                  onAction={(tab) => {
                    setActiveTab(tab);
                    setSelectedShop(null);
                  }} 
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

<footer className="mt-20 border-t border-gray-200 pt-10 text-center">
  <div className="flex items-center justify-center gap-6 mb-6">
    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest opacity-50">Authorized Portal</span>
    <div className="w-1 h-1 rounded-full bg-gray-300" />
    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest opacity-50">Security Encrypted</span>
  </div>
  <p className="text-[11px] text-gray-400 font-medium tracking-tight">
    © 2026 Tamil Nadu Public Distribution System. Digital Governance Initiative.
  </p>
</footer>
</div>
);
}
