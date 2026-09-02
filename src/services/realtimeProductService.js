// FreshMart Supabase Realtime Product Subscription Manager
// File: src/services/realtimeProductService.js

import { supabase } from '../lib/supabaseClient';
import { normalizeProduct } from './productNormalizationService';

class RealtimeProductService {
  constructor() {
    this.channel = null;
    this.subscribers = new Set();
    this.isSubscribed = false;
    this.reconnectTimer = null;
  }

  /**
   * Subscribe to Supabase Realtime updates on the `products` table.
   * Goals #2, #13, #15.
   */
  subscribe(onProductUpdate) {
    if (typeof onProductUpdate === 'function') {
      this.subscribers.add(onProductUpdate);
    }

    if (this.isSubscribed && this.channel) {
      return () => this.unsubscribe(onProductUpdate);
    }

    try {
      this.channel = supabase
        .channel('public:products:realtime_changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'products' },
          (payload) => {
            this.handleRealtimeEvent(payload);
          }
        )
        .subscribe((status, err) => {
          if (status === 'SUBSCRIBED') {
            this.isSubscribed = true;
            if (process.env.NODE_ENV !== 'production') {
              console.log('[Supabase Realtime]: Subscribed to products table changes');
            }
          } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            this.isSubscribed = false;
            if (process.env.NODE_ENV !== 'production') {
              console.warn(`[Supabase Realtime Alert]: Status=${status}. Scheduling auto-reconnect...`, err?.message);
            }
            this.scheduleReconnect();
          }
        });
    } catch (err) {
      console.error('[Supabase Realtime Exception]:', err.message);
    }

    return () => this.unsubscribe(onProductUpdate);
  }

  /**
   * Dispatches normalized realtime events (INSERT, UPDATE, DELETE) to subscribers.
   */
  handleRealtimeEvent(payload) {
    const { eventType, new: newRow, old: oldRow } = payload;
    const normalizedNew = newRow ? normalizeProduct(newRow) : null;
    const normalizedOld = oldRow ? normalizeProduct(oldRow) : null;

    const event = {
      eventType, // 'INSERT' | 'UPDATE' | 'DELETE'
      product: normalizedNew,
      previousProduct: normalizedOld,
      productId: String(newRow?.id || oldRow?.id),
    };

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Supabase Realtime Event]: ${eventType} for product ID=${event.productId}`);
    }

    this.subscribers.forEach((callback) => {
      try {
        callback(event);
      } catch (err) {
        console.error('[Realtime Subscriber Exception]:', err);
      }
    });
  }

  scheduleReconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      if (this.subscribers.size > 0) {
        this.subscribe();
      }
    }, 5000);
  }

  unsubscribe(callback) {
    if (callback) {
      this.subscribers.delete(callback);
    }

    if (this.subscribers.size === 0 && this.channel) {
      try {
        supabase.removeChannel(this.channel);
      } catch (e) {
        // ignore
      }
      this.channel = null;
      this.isSubscribed = false;
      if (process.env.NODE_ENV !== 'production') {
        console.log('[Supabase Realtime]: Channel unsubscribed & cleaned up');
      }
    }
  }
}

export const realtimeProductService = new RealtimeProductService();
