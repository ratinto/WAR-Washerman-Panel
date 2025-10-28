import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { MobileHeader } from '@/components/MobileHeader';
import { OrdersTable } from '@/components/OrdersTable';
import { OrderStatusChart } from '@/components/OrderStatusChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import type { DashboardStats, Order } from '@/types';
import { Loader2, ArrowRight, Package2, Clock, Truck, CheckCircle, Home, RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    fetchDashboardData();

    // Set up auto-refresh every 60 seconds
    const intervalId = setInterval(() => {
      fetchDashboardData();
    }, 60000); // 60 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch dashboard stats and recent orders
      const [statsData, ordersData] = await Promise.all([
        api.getDashboardStats(),
        api.getAllOrders()
      ]);
      
      setStats(statsData);
      // Get only the last 10 orders
      setRecentOrders(ordersData.slice(0, 10));
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      fetchDashboardData(); // Refresh dashboard data after status update
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update order status');
      console.error('Error updating order status:', err);
    }
  };

  return (
    <DashboardLayout>
      <MobileHeader title="My Work" subtitle="Welcome back!" />
      <div className="p-4 md:p-8">
        <div className="hidden md:flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <Home className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl page-title">
                My Work
              </h1>
              <p className="text-sm text-gray-600">Welcome back!</p>
            </div>
          </div>
          {lastUpdated && (
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              Updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
            <span className="ml-3 text-gray-600">Loading dashboard data...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-medium">Error: {error}</p>
            <button
              onClick={fetchDashboardData}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Statistics Grid */}
        {stats && !loading && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-3 md:p-4 text-center">
                  <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 rounded-full bg-blue-100">
                    <Package2 className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-lg md:text-xl font-bold text-blue-900 mb-1">{stats.totalOrders}</div>
                  <div className="text-xs md:text-sm font-medium text-blue-800">All Bags</div>
                  <div className="text-xs text-blue-600 mt-1">Total work</div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-3 md:p-4 text-center">
                  <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 rounded-full bg-amber-100">
                    <Clock className="h-4 w-4 text-amber-600" />
                  </div>
                  <div className="text-lg md:text-xl font-bold text-amber-900 mb-1">{stats.pendingOrders}</div>
                  <div className="text-xs md:text-sm font-medium text-amber-800">To Start</div>
                  <div className="text-xs text-amber-600 mt-1">Ready</div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-3 md:p-4 text-center">
                  <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 rounded-full bg-blue-100">
                    <Truck className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-lg md:text-xl font-bold text-blue-900 mb-1">{stats.inprogressOrders}</div>
                  <div className="text-xs md:text-sm font-medium text-blue-800">Washing</div>
                  <div className="text-xs text-blue-600 mt-1">Working</div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-3 md:p-4 text-center">
                  <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 rounded-full bg-green-100">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="text-lg md:text-xl font-bold text-green-900 mb-1">{stats.completeOrders}</div>
                  <div className="text-xs md:text-sm font-medium text-green-800">Finished</div>
                  <div className="text-xs text-green-600 mt-1">Done</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders - Mobile First */}
            <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
              {/* Recent Orders Section */}
              <Card className="border-2 border-maroon/20">
                <CardHeader className="pb-2 md:pb-4">
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg card-title">
                    <Package2 className="h-4 w-4 text-primary" />
                    Recent Work
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <OrdersTable orders={recentOrders} onStatusUpdate={handleStatusUpdate} />
                  {recentOrders.length >= 10 && (
                    <div className="mt-4 text-center">
                      <Button
                        onClick={() => navigate('/orders')}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Package2 className="h-4 w-4" />
                        View All Bags
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Status Chart - Hidden on mobile */}
              <Card className="hidden lg:block">
                <CardHeader>
                  <CardTitle style={{ fontFamily: 'Playfair Display, serif' }}>
                    Order Status Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <OrderStatusChart
                    totalOrders={stats.totalOrders}
                    pendingOrders={stats.pendingOrders}
                    inProgressOrders={stats.inprogressOrders}
                    completedOrders={stats.completeOrders}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions Section */}
            <Card className="border-2 border-maroon/20">
              <CardHeader>
                                <CardTitle style={{ fontFamily: 'Playfair Display, serif' }} className="flex items-center gap-2 md:gap-3 text-lg md:text-xl">
                  <RefreshCw className="h-5 w-5 text-primary" />
                  What to do?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3 md:flex-row md:gap-4">
                  <Button
                    onClick={() => navigate('/orders')}
                    className="flex-1 h-14 md:h-16 text-base md:text-lg font-bold rounded-xl"
                    style={{ backgroundColor: '#a30c34' }}
                  >
                    <Package2 className="h-5 w-5" />
                    See All Work
                    <ArrowRight className="ml-2 md:ml-3 h-4 w-4 md:h-5 md:w-5" />
                  </Button>
                  <Button
                    onClick={() => navigate('/orders?filter=pending')}
                    variant="outline"
                    className="flex-1 h-14 md:h-16 text-base md:text-lg font-bold rounded-xl border-2"
                    style={{ 
                      borderColor: '#a30c34', 
                      color: '#a30c34'
                    }}
                  >
                    <Clock className="h-5 w-5" />
                    See New Work
                    <ArrowRight className="ml-2 md:ml-3 h-4 w-4 md:h-5 md:w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
