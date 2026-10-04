import { User, RationShop, RationCard, Notification, AuditLog, CustomRole, Bill } from '../types';

const API_BASE = '/api';
const STORAGE_KEYS = {
  USER: 'tnpds_user'
};

const getAuthHeaders = () => {
  const userJson = localStorage.getItem(STORAGE_KEYS.USER);
  if (!userJson) return {};
  const user: User = JSON.parse(userJson);
  return {
    'x-user-role': user.role,
    'x-user-id': user.id
  };
};

export const api = {
  async getShops(): Promise<RationShop[]> {
    const res = await fetch(`${API_BASE}/shops`);
    if (!res.ok) throw new Error('Failed to fetch shops');
    return res.json();
  },

  async getRationCard(cardNumber: string): Promise<RationCard> {
    const res = await fetch(`${API_BASE}/ration-cards/${cardNumber}`);
    if (!res.ok) throw new Error('Ration card not found');
    return res.json();
  },

  async searchRationCards(query: string): Promise<RationCard[]> {
    const res = await fetch(`${API_BASE}/ration-cards/search?q=${encodeURIComponent(query)}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Search failed');
    return res.json();
  },

  async login(payload: any): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Authentication failed');
    }
    return res.json();
  },

  async register(payload: any): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Registration failed');
    }
    return res.json();
  },

  async updateStock(shopId: string, productId: string, stock: number): Promise<RationShop> {
    const res = await fetch(`${API_BASE}/shops/${shopId}/stock`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ productId, stock }),
    });
    if (!res.ok) throw new Error('Failed to update stock');
    return res.json();
  },

  async updateShopTimes(shopId: string, times: { openingTime?: string; closingTime?: string }): Promise<RationShop> {
    const res = await fetch(`${API_BASE}/shops/${shopId}/times`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(times),
    });
    if (!res.ok) throw new Error('Failed to update shop times');
    return res.json();
  },

  async createShop(shop: Partial<RationShop>): Promise<RationShop> {
    const res = await fetch(`${API_BASE}/shops`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(shop),
    });
    if (!res.ok) throw new Error('Failed to create shop');
    return res.json();
  },

  async updateShop(shopId: string, shop: Partial<RationShop>): Promise<RationShop> {
    const res = await fetch(`${API_BASE}/shops/${shopId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(shop),
    });
    if (!res.ok) throw new Error('Failed to update shop');
    return res.json();
  },

  async deleteShop(shopId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/shops/${shopId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete shop');
  },

  async getNotifications(userId?: string): Promise<Notification[]> {
    const url = userId ? `${API_BASE}/notifications?userId=${userId}` : `${API_BASE}/notifications`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  },

  async markNotificationRead(id: string): Promise<Notification> {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to mark notification as read');
    return res.json();
  },

  async createNotification(notification: Partial<Notification>): Promise<Notification> {
    const res = await fetch(`${API_BASE}/notifications`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(notification),
    });
    if (!res.ok) throw new Error('Failed to create notification');
    return res.json();
  },
  
  async getAuditLogs(): Promise<AuditLog[]> {
    const res = await fetch(`${API_BASE}/admin/audit-logs`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    return res.json();
  },

  async getAdminUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  async registerUser(userData: Partial<User>): Promise<User> {
    const res = await fetch(`${API_BASE}/admin/users`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error('Failed to register user');
    return res.json();
  },

  async getAdminRationCards(): Promise<RationCard[]> {
    const res = await fetch(`${API_BASE}/admin/ration-cards`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch ration cards');
    return res.json();
  },

  async addFamilyMember(cardNumber: string, memberData: { name: string; relation: string; age: number }): Promise<RationCard> {
    const res = await fetch(`${API_BASE}/ration-cards/${cardNumber}/members`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(memberData),
    });
    if (!res.ok) throw new Error('Failed to add family member');
    return res.json();
  },

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update user');
    return res.json();
  },

  async approveUser(userId: string): Promise<User> {
    const res = await fetch(`${API_BASE}/admin/users/${userId}/approve`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to approve user');
    return res.json();
  },

  async getAdminRoles(): Promise<CustomRole[]> {
    const res = await fetch(`${API_BASE}/admin/roles`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch roles');
    return res.json();
  },

  async createRole(roleData: Partial<CustomRole>): Promise<CustomRole> {
    const res = await fetch(`${API_BASE}/admin/roles`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(roleData),
    });
    if (!res.ok) throw new Error('Failed to create role');
    return res.json();
  },

  async updateRole(roleId: string, roleData: Partial<CustomRole>): Promise<CustomRole> {
    const res = await fetch(`${API_BASE}/admin/roles/${roleId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(roleData),
    });
    if (!res.ok) throw new Error('Failed to update role');
    return res.json();
  },

  async deleteRole(roleId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/roles/${roleId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete role');
  },

  async assignCustomRole(userId: string, customRoleId: string | null): Promise<User> {
    const res = await fetch(`${API_BASE}/admin/users/${userId}/custom-role`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ customRoleId }),
    });
    if (!res.ok) throw new Error('Failed to assign custom role');
    return res.json();
  },

  async bulkUpdateProducts(shopId: string, updates: { id: string; stock?: number; price?: number }[]): Promise<RationShop> {
    const res = await fetch(`${API_BASE}/shops/${shopId}/products/bulk`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ updates }),
    });
    if (!res.ok) throw new Error('Failed to bulk update products');
    return res.json();
  },

  // =========================================================================
  // GOOGLE SHEETS STORAGE CONNECTORS
  // =========================================================================

  async getGoogleSheetsAuthUrl(redirectUri: string): Promise<{ url: string }> {
    const res = await fetch(`${API_BASE}/auth/google/url?redirectUri=${encodeURIComponent(redirectUri)}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to acquire Google authorization URL');
    }
    return res.json();
  },

  async getGoogleSheetsStatus(): Promise<{
    connected: boolean;
    email: string | null;
    name: string | null;
    spreadsheetId: string | null;
    autoSync: boolean;
    hasCredentials: boolean;
  }> {
    const res = await fetch(`${API_BASE}/auth/google/status`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to check Google Sheets sync status');
    return res.json();
  },

  async disconnectGoogleSheets(): Promise<void> {
    const res = await fetch(`${API_BASE}/auth/google/disconnect`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to disconnect Google account');
  },

  async createGoogleSpreadsheet(title?: string): Promise<{ spreadsheetId: string; spreadsheetUrl?: string }> {
    const res = await fetch(`${API_BASE}/auth/google/create-sheet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ title })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create Google Spreadsheet');
    }
    return res.json();
  },

  async linkGoogleSpreadsheet(spreadsheetId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/auth/google/link-sheet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ spreadsheetId })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to link Google Spreadsheet');
    }
  },

  async toggleGoogleSheetsAutoSync(autoSync: boolean): Promise<void> {
    const res = await fetch(`${API_BASE}/auth/google/toggle-auto-sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ autoSync })
    });
    if (!res.ok) throw new Error('Failed to toggle auto sync');
  },

  async syncExistingAuditLogs(): Promise<{ count: number }> {
    const res = await fetch(`${API_BASE}/auth/google/sync-existing`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to synchronize historical data');
    }
    return res.json();
  },

  async queryMapsGrounding(message: string, lat?: number, lng?: number): Promise<{ text: string; chunks: any[] }> {
    const res = await fetch(`${API_BASE}/gemini/maps`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ message, lat, lng })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Maps grounding query failed');
    }
    return res.json();
  },

  async transcribeAudio(audioData: string, mimeType?: string): Promise<{ text: string }> {
    const res = await fetch(`${API_BASE}/gemini/transcribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ audioData, mimeType })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Speech transcription failed');
    }
    return res.json();
  },

  async getBills(cardNumber?: string, shopId?: string): Promise<Bill[]> {
    let url = `${API_BASE}/bills`;
    const params = new URLSearchParams();
    if (cardNumber) params.append('cardNumber', cardNumber);
    if (shopId) params.append('shopId', shopId);
    if (params.toString()) url += `?${params.toString()}`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch billing receipts');
    return res.json();
  },

  async createBill(billData: Partial<Bill>): Promise<Bill> {
    const res = await fetch(`${API_BASE}/bills`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(billData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to register receipt and complete sale');
    }
    return res.json();
  }
};
