import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatCard } from '@/components/StatCard';
import { OrdersTable } from '@/components/OrdersTable';
import { OrderStatusChart } from '@/components/OrderStatusChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import type { DashboardStats, Order } from '@/types';
import { Package, Clock, CheckCircle2, Loader2, PackageOpen, ArrowRight } from 'lucide-react';

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

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: '#a30c34' }}>
            Dashboard
          </h1>
          {lastUpdated && (
            <div className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#a30c34' }} />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Orders"
                value={stats.totalOrders}
                icon={Package}
                description="All orders assigned to you"
              />
              <StatCard
                title="Pending Orders"
                value={stats.pendingOrders}
                icon={Clock}
                description="Waiting to be processed"
              />
              <StatCard
                title="In Progress"
                value={stats.inprogressOrders}
                icon={PackageOpen}
                description="Currently being washed"
              />
              <StatCard
                title="Completed Orders"
                value={stats.completeOrders}
                icon={CheckCircle2}
                description="Successfully finished"
              />
            </div>

            {/* Charts and Recent Orders Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Order Status Chart */}
              <Card className="lg:col-span-1">
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

              {/* Recent Orders Section */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle style={{ fontFamily: 'Playfair Display, serif' }}>
                    Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <OrdersTable orders={recentOrders} />
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions Section */}
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Playfair Display, serif' }}>
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => navigate('/orders')}
                    className="flex-1"
                    style={{ backgroundColor: '#a30c34' }}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    View All Orders
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => navigate('/orders?filter=pending')}
                    variant="outline"
                    className="flex-1"
                    style={{ 
                      borderColor: '#a30c34', 
                      color: '#a30c34'
                    }}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    View Pending Orders
                    <ArrowRight className="ml-2 h-4 w-4" />
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
