"use client";

import { useState, useEffect, useMemo } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DataTable, Column, SortConfig } from "@/components/ui/DataTable";
import {
  Package,
  Search,
  Plus,
  Calendar,
  DollarSign,
  MapPin,
  Eye,
  Edit,
  MoreVertical,
  Loader2,
  X,
} from "lucide-react";
import { useOrders, Order } from "@/hooks/useOrders";

const statusColors = {
  pending: "warning",
  processing: "info",
  shipped: "success",
  delivered: "success",
  cancelled: "error",
} as const;

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const {
    orders,
    statistics,
    loading,
    error,
    pagination,
    fetchOrders,
    fetchStatistics,
    goToPage,
    changeItemsPerPage,
  } = useOrders();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch orders with pagination and filters
  useEffect(() => {
    const params = {
      limit: pagination.itemsPerPage,
      offset: (pagination.currentPage - 1) * pagination.itemsPerPage,
      search: debouncedSearchTerm || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
      sort_by: sortConfig?.key ? String(sortConfig.key) : undefined,
      sort_direction: sortConfig?.direction,
    };

    fetchOrders(params);
  }, [fetchOrders, pagination.currentPage, pagination.itemsPerPage, debouncedSearchTerm, statusFilter, sortConfig]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  // Reset to first page when filters change
  useEffect(() => {
    if (pagination.currentPage !== 1) {
      goToPage(1);
    }
  }, [debouncedSearchTerm, statusFilter, sortConfig, goToPage, pagination.currentPage]);

  const totalRevenue =
    statistics?.total_revenue ||
    orders.reduce((sum, order) => sum + order.total_amount, 0);

  const averageOrderValue =
    statistics?.average_order_value ||
    Math.round(totalRevenue / Math.max(orders.length, 1));

  const handlePageChange = (page: number) => {
    goToPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    changeItemsPerPage(newItemsPerPage);
  };

  const handleSort = (newSortConfig: SortConfig) => {
    setSortConfig(newSortConfig);
  };

  const handleRowClick = (order: Order) => {
    window.location.href = `/orders/${order.id}`;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSortConfig(null);
  };

  const hasActiveFilters = searchTerm || statusFilter !== "all" || sortConfig;

  // Define table columns
  const columns: Column<Order>[] = useMemo(() => [
    {
      key: "order_number",
      title: "Order Number",
      sortable: true,
      render: (order) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Package className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{order.order_number}</div>
            <div className="text-xs text-gray-500">{order.customer_email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "customer_name",
      title: "Customer",
      sortable: true,
      render: (order) => (
        <div>
          <div className="font-medium text-gray-900">{order.customer_name}</div>
          {order.customer_phone && (
            <div className="text-xs text-gray-500">{order.customer_phone}</div>
          )}
        </div>
      ),
    },
    {
      key: "status",
      title: "Status",
      sortable: true,
      render: (order) => (
        <Badge variant={statusColors[order.status]} size="sm">
          {order.status}
        </Badge>
      ),
    },
    {
      key: "total_amount",
      title: "Amount",
      sortable: true,
      align: "right",
      render: (order) => (
        <div className="text-right">
          <div className="font-medium text-gray-900">
            ₦{order.total_amount.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">{order.items.length} items</div>
        </div>
      ),
    },
    {
      key: "delivery_address",
      title: "Delivery Address",
      render: (order) => (
        <div className="max-w-xs">
          <div className="flex items-start gap-1">
            <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0 text-gray-400" />
            <span className="text-sm text-gray-600 truncate">
              {order.delivery_address}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "created_at",
      title: "Date",
      sortable: true,
      render: (order) => (
        <div>
          <div className="text-sm text-gray-900">
            {new Date(order.created_at).toLocaleDateString()}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(order.created_at).toLocaleTimeString()}
          </div>
        </div>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      align: "center",
      width: "120px",
      render: (order) => (
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `/orders/${order.id}`;
            }}
            className="p-1.5 rounded hover:bg-gray-200 transition-colors"
            title="View order details"
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle edit action
            }}
            className="p-1.5 rounded hover:bg-gray-200 transition-colors"
            title="Edit order"
          >
            <Edit className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle more options
            }}
            className="p-1.5 rounded hover:bg-gray-200 transition-colors"
            title="More options"
          >
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      ),
    },
  ], []);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-voca-cyan" />
            <span className="ml-2 text-sm sm:text-base text-gray-600">
              Loading orders...
            </span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm sm:text-base">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-red-800">Error loading orders</h3>
                <p className="mt-1 text-red-700">{error}</p>
                <button
                  onClick={() => fetchOrders()}
                  className="mt-3 bg-red-100 text-red-800 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-red-200"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        {!loading && !error && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
                Order Management
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">
                Track and manage customer orders from your catalogs
              </p>
            </div>
            <button
              onClick={() => (window.location.href = "/catalogs/create")}
              className="flex items-center justify-center gap-1 sm:gap-2 bg-voca-cyan text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-voca-dark transition-colors text-xs sm:text-sm"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Create Catalogue</span>
            </button>
          </div>
        )}

        {/* Filters */}
        {!loading && !error && (
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search orders by customer name, email, or order number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-voca-cyan text-xs sm:text-sm"
                    />
                  </div>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-voca-cyan text-xs sm:text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Clear
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        {!loading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {[
              {
                label: "Total Orders",
                value: statistics?.total_orders || 0,
                icon: Package,
                bg: "bg-voca-light",
                color: "text-voca-cyan",
              },
              {
                label: "Total Revenue",
                value: `₦${totalRevenue.toLocaleString()}`,
                icon: DollarSign,
                bg: "bg-green-100",
                color: "text-green-400",
              },
              {
                label: "Avg Order Value",
                value: `₦${averageOrderValue.toLocaleString()}`,
                icon: Package,
                bg: "bg-voca-light",
                color: "text-voca-cyan",
              },
              {
                label: "Pending Orders",
                value:
                  statistics?.pending_orders ||
                  orders.filter((o) => o.status === "pending").length,
                icon: Calendar,
                bg: "bg-yellow-100",
                color: "text-yellow-600",
              },
            ].map((stat, i) => (
              <Card key={i}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">
                        {stat.label}
                      </p>
                      <p className="text-lg sm:text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.bg} rounded-lg flex items-center justify-center`}
                    >
                      <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Orders Table */}
        {!loading && !error && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                All Orders ({statistics?.total_orders || 0})
              </h3>
              <span className="text-sm text-gray-500">
                {statistics?.pending_orders || 0} pending
              </span>
            </div>
            
            <DataTable
              data={orders}
              columns={columns}
              loading={loading}
              error={error}
              pagination={pagination}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              onSort={handleSort}
              sortConfig={sortConfig || undefined}
              onRowClick={handleRowClick}
              emptyMessage={
                hasActiveFilters 
                  ? "No orders match your filters" 
                  : "No orders found. Start by creating a catalog to receive orders."
              }
              emptyIcon={Package}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
}
