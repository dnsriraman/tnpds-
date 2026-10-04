
import { api } from './api';

export interface SyncEntry {
  id: string;
  type: 'STOCK_UPDATE' | 'SHOP_UPDATE' | 'SHOP_TIMES_UPDATE';
  shopId: string;
  data: any;
  timestamp: number;
}

const SYNC_QUEUE_KEY = 'tnpds_sync_queue';

export const syncManager = {
  getQueue(): SyncEntry[] {
    const queueJson = localStorage.getItem(SYNC_QUEUE_KEY);
    return queueJson ? JSON.parse(queueJson) : [];
  },

  saveQueue(queue: SyncEntry[]) {
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  },

  addToQueue(type: SyncEntry['type'], shopId: string, data: any) {
    const queue = this.getQueue();
    // For stock updates, if there's already a pending update for the same product in the same shop, 
    // we should ideally merge it (take the latest value) to reduce requests.
    if (type === 'STOCK_UPDATE') {
      const existingIndex = queue.findIndex(e => e.type === 'STOCK_UPDATE' && e.shopId === shopId && e.data.productId === data.productId);
      if (existingIndex !== -1) {
        queue[existingIndex] = {
          ...queue[existingIndex],
          data,
          timestamp: Date.now()
        };
        this.saveQueue(queue);
        return;
      }
    }

    queue.push({
      id: Math.random().toString(36).substring(2, 9),
      type,
      shopId,
      data,
      timestamp: Date.now()
    });
    this.saveQueue(queue);
  },

  async processQueue(onProgress?: (processed: number, total: number) => void): Promise<void> {
    const queue = this.getQueue();
    if (queue.length === 0) return;

    const total = queue.length;
    let processed = 0;

    // Sort by timestamp to ensure chronological order
    const sortedQueue = [...queue].sort((a, b) => a.timestamp - b.timestamp);
    const remainingQueue: SyncEntry[] = [];

    for (const entry of sortedQueue) {
      try {
        if (entry.type === 'STOCK_UPDATE') {
          await api.updateStock(entry.shopId, entry.data.productId, entry.data.stock);
        } else if (entry.type === 'SHOP_TIMES_UPDATE') {
          await api.updateShopTimes(entry.shopId, entry.data);
        } else if (entry.type === 'SHOP_UPDATE') {
          await api.updateShop(entry.shopId, entry.data);
        }
        processed++;
        if (onProgress) onProgress(processed, total);
      } catch (error) {
        console.error('Failed to sync entry:', entry, error);
        remainingQueue.push(entry);
      }
    }

    this.saveQueue(remainingQueue);
  }
};
