import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { MobileHeader } from '@/components/MobileHeader';
import { OrdersTable } from '@/components/OrdersTable';
import { OrderDetailModal } from '@/components/OrderDetailModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/services/api';
import type { Order } from '@/types';
import { Search, Loader2, RefreshCw, Package2, Clock, Truck, CheckCircle, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

type FilterStatus = 'all' | 'pending' | 'inprogress' | 'complete';

export default function Orders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // 10 orders per page

  useEffect(() => {
    // Check for filter parameter in URL
    const filterParam = searchParams.get('filter');
    if (filterParam === 'pending' || filterParam === 'inprogress' || filterParam === 'complete') {
      setActiveFilter(filterParam);
    }
    fetchOrders();
  }, [searchParams]);

  // Debounce search query to improve performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    // Apply filters and search
    let filtered = [...orders];

    // Apply status filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(order => 
        order.status.toLowerCase() === activeFilter.toLowerCase()
      );
    }

    // Apply search query - Washerman friendly
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase().trim();
      filtered = filtered.filter(order => {
        // Search in bag number - most important for washermen
        const bagNo = order.bagNo.toLowerCase();
        const bagNoMatch = bagNo.includes(query);
        
        // Search in student name - partial match
        const studentName = order.studentName?.toLowerCase() || '';
        const studentNameMatch = studentName.includes(query);
        
        // Only match exact order ID to avoid confusion (minimum 3 characters)
        const orderIdMatch = query.length >= 3 && order.id.toString() === query;
        
        return bagNoMatch || studentNameMatch || orderIdMatch;
      });
    }

    setFilteredOrders(filtered);
    
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [orders, activeFilter, debouncedSearchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAllOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filter: FilterStatus) => {
    setActiveFilter(filter);
    setCurrentPage(1); // Reset to first page when changing filter
    // Update URL if needed
    if (filter !== 'all') {
      setSearchParams({ filter });
    } else {
      setSearchParams({});
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Scroll to top on mobile for better UX
    if (window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getFilterCount = (status: FilterStatus): number => {
    if (status === 'all') return orders.length;
    return orders.filter(order => 
      order.status.toLowerCase() === status.toLowerCase()
    ).length;
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleStatusUpdateFromCard = async (orderId: number, newStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      fetchOrders(); // Refresh orders after status update
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update order status');
      console.error('Error updating order status:', err);
    }
  };

  const handleStatusUpdate = () => {
    fetchOrders(); // Refresh orders after status update from modal
  };

  return (
    <DashboardLayout>
      <MobileHeader title="My Work" subtitle="All clothes to wash and clean" />
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="hidden md:flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl page-title mb-1">
              My Work
            </h1>
            <p className="text-sm md:text-base text-gray-600">All clothes to wash and clean</p>
          </div>
          <Button
            onClick={fetchOrders}
            variant="outline"
            size="sm"
            disabled={loading}
            className="px-4 py-2 text-sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Update
          </Button>
        </div>

        {/* Filter Buttons - Fixed Layout with Better Spacing */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Button
            onClick={() => handleFilterChange('all')}
            variant={activeFilter === 'all' ? 'default' : 'outline'}
            style={{ minHeight: '100px', padding: '20px' }}
            className={`flex flex-col items-center justify-center text-sm md:text-base font-medium transition-all duration-200 hover:scale-105 shadow-sm ${
              activeFilter === 'all' 
                ? 'bg-primary text-primary-foreground shadow-lg border-primary' 
                : 'border-2 hover:bg-accent hover:shadow-md'
            }`}
          >
            <Package2 className="h-6 w-6 mb-4" />
            <span className="font-semibold leading-relaxed">All Work</span>
            <span className="text-xs font-normal opacity-90 mt-3">({getFilterCount('all')})</span>
          </Button>

          <Button
            onClick={() => handleFilterChange('pending')}
            variant={activeFilter === 'pending' ? 'default' : 'outline'}
            style={{ minHeight: '100px', padding: '20px' }}
            className={`flex flex-col items-center justify-center text-sm md:text-base font-medium transition-all duration-200 hover:scale-105 shadow-sm ${
              activeFilter === 'pending' 
                ? 'bg-primary text-primary-foreground shadow-lg border-primary' 
                : 'border-2 hover:bg-accent hover:shadow-md'
            }`}
          >
            <Clock className="h-6 w-6 mb-4" />
            <span className="font-semibold leading-relaxed">Pending</span>
            <span className="text-xs font-normal opacity-90 mt-3">({getFilterCount('pending')})</span>
          </Button>

          <Button
            onClick={() => handleFilterChange('inprogress')}
            variant={activeFilter === 'inprogress' ? 'default' : 'outline'}
            style={{ minHeight: '100px', padding: '20px' }}
            className={`flex flex-col items-center justify-center text-sm md:text-base font-medium transition-all duration-200 hover:scale-105 shadow-sm ${
              activeFilter === 'inprogress' 
                ? 'bg-primary text-primary-foreground shadow-lg border-primary' 
                : 'border-2 hover:bg-accent hover:shadow-md'
            }`}
          >
            <Truck className="h-6 w-6 mb-4" />
            <span className="font-semibold leading-relaxed">In Progress</span>
            <span className="text-xs font-normal opacity-90 mt-3">({getFilterCount('inprogress')})</span>
          </Button>

          <Button
            onClick={() => handleFilterChange('complete')}
            variant={activeFilter === 'complete' ? 'default' : 'outline'}
            style={{ minHeight: '100px', padding: '20px' }}
            className={`flex flex-col items-center justify-center text-sm md:text-base font-medium transition-all duration-200 hover:scale-105 shadow-sm ${
              activeFilter === 'complete' 
                ? 'bg-primary text-primary-foreground shadow-lg border-primary' 
                : 'border-2 hover:bg-accent hover:shadow-md'
            }`}
          >
            <CheckCircle className="h-6 w-6 mb-4" />
            <span className="font-semibold leading-relaxed">Completed</span>
            <span className="text-xs font-normal opacity-90 mt-3">({getFilterCount('complete')})</span>
          </Button>
        </div>

        {/* Search Bar - Mobile Friendly */}
        <div className="mb-6 md:mb-8">
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search bag number or student name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 md:py-4 text-sm md:text-base rounded-xl border-2 border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 bg-white shadow-sm transition-all duration-200"
            />
          </div>
        </div>        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
            <span className="ml-3 text-gray-600">Loading orders...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-medium">Error: {error}</p>
            <button
              onClick={fetchOrders}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Orders Table */}
        {!loading && !error && (
          <Card className="border-2 border-gray-100">
            <CardHeader className="pb-4">
              <CardTitle className="card-title flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Package2 className="h-5 w-5 text-brand-primary" />
                  <span className="text-lg md:text-xl font-bold">
                    {activeFilter === 'all' 
                      ? `All Orders (${filteredOrders.length})` 
                      : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Orders (${filteredOrders.length})`
                    }
                  </span>
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredOrders.length === 0 && debouncedSearchQuery.trim() ? (
                <div className="text-center py-12">
                  <Search className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No bags found</h3>
                  <p className="text-gray-600 mb-4">
                    No bags match "{debouncedSearchQuery}"
                  </p>
                  <Button
                    onClick={() => setSearchQuery('')}
                    className="px-6 py-3"
                  >
                    Clear Search
                  </Button>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Package2 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No bags yet</h3>
                  <p className="text-gray-600">No work assigned yet. Check back later!</p>
                </div>
              ) : (
                <>
                  <OrdersTable 
                    orders={currentOrders} 
                    onViewDetails={handleViewDetails}
                    onStatusUpdate={handleStatusUpdateFromCard}
                  />
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-4">
                      {/* Mobile Pagination - Simple */}
                      <div className="flex md:hidden items-center justify-between">
                        <Button
                          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1 px-3 py-2 text-sm font-medium"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        
                        <div className="text-center">
                          <div className="text-sm font-semibold text-maroon">
                            {currentPage} of {totalPages}
                          </div>
                          <div className="text-xs text-gray-600">
                            {filteredOrders.length} bags total
                          </div>
                        </div>
                        
                        <Button
                          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1 px-3 py-2 text-sm font-medium"
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Desktop Pagination - Detailed */}
                      <div className="hidden md:flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Showing {startIndex + 1}-{Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length} bags
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <ArrowLeft className="h-4 w-4" />
                            Previous
                          </Button>
                          
                          <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                              let pageNum;
                              if (totalPages <= 5) {
                                pageNum = i + 1;
                              } else if (currentPage <= 3) {
                                pageNum = i + 1;
                              } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                              } else {
                                pageNum = currentPage - 2 + i;
                              }
                              
                              return (
                                <Button
                                  key={pageNum}
                                  onClick={() => handlePageChange(pageNum)}
                                  variant={currentPage === pageNum ? 'default' : 'ghost'}
                                  size="sm"
                                  className="w-10 h-10 p-0"
                                >
                                  {pageNum}
                                </Button>
                              );
                            })}
                          </div>
                          
                          <Button
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            Next
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Order Detail Modal */}
        <OrderDetailModal
          order={selectedOrder}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>
    </DashboardLayout>
  );
}
