import { useState, useCallback } from 'react';
import { apiService } from '@/services/apiService';

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  items: OrderItem[];
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  delivery_address: string;
  agent_id?: string;
  catalog_id?: string;
  store_id: string;
  notes?: string;
  tracking_number?: string;
  shipped_at?: string;
  delivered_at?: string;
  cancelled_at?: string;
  cancelled_reason?: string;
  created_at: string;
  updated_at: string;
  store_name?: string;
  catalog_name?: string;
  agent_name?: string;
}

export interface OrderStatistics {
  total_orders: number;
  pending_orders: number;
  processing_orders: number;
  shipped_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  total_revenue: number;
  average_order_value: number;
}

export interface OrdersParams {
  limit?: number;
  offset?: number;
  status?: string;
  search?: string;
  start_date?: string;
  end_date?: string;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statistics, setStatistics] = useState<OrderStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  const fetchOrders = useCallback(async (params?: OrdersParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getOrders(params);
      
      if (response.status === 'success' && response.data) {
        const ordersData = response.data as { 
          orders: Order[];
          pagination?: {
            current_page: number;
            total_pages: number;
            total_items: number;
            items_per_page: number;
          };
        };
        
        setOrders(ordersData.orders || []);
        
        // Update pagination info if available
        if (ordersData.pagination) {
          setPagination({
            currentPage: ordersData.pagination.current_page,
            totalPages: ordersData.pagination.total_pages,
            totalItems: ordersData.pagination.total_items,
            itemsPerPage: ordersData.pagination.items_per_page,
          });
        } else {
          // Fallback pagination calculation - use statistics for total items if available
          const itemsPerPage = params?.limit || 10;
          const totalItems = statistics?.total_orders || ordersData.orders?.length || 0;
          setPagination({
            currentPage: 1,
            totalPages: Math.ceil(totalItems / itemsPerPage),
            totalItems,
            itemsPerPage,
          });
        }
      } else {
        setError(response.message || 'Failed to fetch orders');
        setOrders([]);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 10,
        });
      }
    } catch (err) {
      setError('Failed to fetch orders');
      setOrders([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStatistics = useCallback(async () => {
    try {
      const response = await apiService.getOrderStatistics();
      
      if (response.status === 'success' && response.data) {
        const statsData = response.data as { statistics: OrderStatistics };
        setStatistics(statsData.statistics);
      } else {
        setStatistics(null);
      }
    } catch (err) {
      setStatistics(null);
    }
  }, []);

  const fetchOrderById = useCallback(async (orderId: string): Promise<Order | null> => {
    try {
      const response = await apiService.getOrderById(orderId);
      
      if (response.status === 'success' && response.data) {
        const orderData = response.data as { order: Order };
        return orderData.order;
      }
      return null;
    } catch (err) {
      return null;
    }
  }, []);

  const createOrder = useCallback(async (orderData: {
    customer_name: string;
    customer_email: string;
    customer_phone?: string;
    delivery_address: string;
    items: OrderItem[];
    total_amount: number;
    store_id: string;
    catalog_id?: string;
    agent_id?: string;
    notes?: string;
  }): Promise<Order | null> => {
    try {
      const response = await apiService.createOrder(orderData);
      
      if (response.status === 'success' && response.data) {
        const orderData = response.data as { order: Order };
        // Refresh orders list
        await fetchOrders();
        return orderData.order;
      }
      return null;
    } catch (err) {
      return null;
    }
  }, [fetchOrders]);

  const updateOrder = useCallback(async (orderId: string, orderData: Partial<{
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    delivery_address: string;
    items: OrderItem[];
    total_amount: number;
    notes: string;
    tracking_number: string;
  }>): Promise<Order | null> => {
    try {
      const response = await apiService.updateOrder(orderId, orderData);
      
      if (response.status === 'success' && response.data) {
        const orderData = response.data as { order: Order };
        // Refresh orders list
        await fetchOrders();
        return orderData.order;
      }
      return null;
    } catch (err) {
      return null;
    }
  }, [fetchOrders]);

  const updateOrderStatus = useCallback(async (orderId: string, statusData: {
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    tracking_number?: string;
    notes?: string;
    cancelled_reason?: string;
  }): Promise<Order | null> => {
    try {
      const response = await apiService.updateOrderStatus(orderId, statusData);
      
      if (response.status === 'success' && response.data) {
        const orderData = response.data as { order: Order };
        // Refresh orders list
        await fetchOrders();
        return orderData.order;
      }
      return null;
    } catch (err) {
      return null;
    }
  }, [fetchOrders]);

  const deleteOrder = useCallback(async (orderId: string): Promise<boolean> => {
    try {
      const response = await apiService.deleteOrder(orderId);
      
      if (response.status === 'success') {
        // Refresh orders list
        await fetchOrders();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }, [fetchOrders]);

  const fetchOrdersByStore = useCallback(async (storeId: string, params?: {
    limit?: number;
    offset?: number;
  }): Promise<Order[]> => {
    try {
      const response = await apiService.getOrdersByStore(storeId, params);
      
      if (response.status === 'success' && response.data) {
        const ordersData = response.data as { orders: Order[] };
        return ordersData.orders || [];
      }
      return [];
    } catch (err) {
      return [];
    }
  }, []);

  // Pagination handlers
  const goToPage = useCallback((page: number) => {
    const offset = (page - 1) * pagination.itemsPerPage;
    fetchOrders({
      limit: pagination.itemsPerPage,
      offset,
    });
  }, [fetchOrders, pagination.itemsPerPage]);

  const changeItemsPerPage = useCallback((newItemsPerPage: number) => {
    setPagination(prev => ({
      ...prev,
      itemsPerPage: newItemsPerPage,
      currentPage: 1,
    }));
    fetchOrders({
      limit: newItemsPerPage,
      offset: 0,
    });
  }, [fetchOrders]);

  return {
    orders,
    statistics,
    loading,
    error,
    pagination,
    fetchOrders,
    fetchStatistics,
    fetchOrderById,
    createOrder,
    updateOrder,
    updateOrderStatus,
    deleteOrder,
    fetchOrdersByStore,
    goToPage,
    changeItemsPerPage,
  };
};
