import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, ShoppingBag, Package, TrendingUp, Loader2, ArrowUpRight,
  AlertTriangle, Star, Award
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { userInfo } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/orders/stats', {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    if (userInfo && userInfo.isAdmin) {
      fetchStats();
    }
  }, [userInfo]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!stats) return null;

  const StatCard = ({ title, value, icon: Icon, color, bg }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg} ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5">Overview of your store's performance.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Revenue" 
          value={`₹${stats.totalSales.toFixed(2)}`} 
          icon={TrendingUp} 
          color="text-green-600" 
          bg="bg-green-100" 
        />
        <StatCard 
          title="Total Orders" 
          value={stats.totalOrders} 
          icon={ShoppingBag} 
          color="text-primary" 
          bg="bg-primary/10" 
        />
        <StatCard 
          title="Active Users" 
          value={stats.totalUsers} 
          icon={Users} 
          color="text-blue-600" 
          bg="bg-blue-100" 
        />
        <StatCard 
          title="Products" 
          value={stats.totalProducts} 
          icon={Package} 
          color="text-purple-600" 
          bg="bg-purple-100" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Revenue (Last 7 Days)</h2>
          <div className="h-72 w-full">
            {stats.salesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.salesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="_id" 
                    tick={{ fontSize: 12, fill: '#94a3b8' }} 
                    axisLine={false} 
                    tickLine={false} 
                    tickFormatter={(val) => {
                      const d = new Date(val);
                      return d.toLocaleDateString('en-US', { weekday: 'short' });
                    }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#94a3b8' }} 
                    axisLine={false} 
                    tickLine={false}
                    tickFormatter={(val) => `₹${val}`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => [`₹${value.toFixed(2)}`, 'Revenue']}
                    labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#634C9F" 
                    strokeWidth={4} 
                    dot={{ fill: '#634C9F', strokeWidth: 2, r: 4 }} 
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <p>No sales data for the last 7 days.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <Link to="/admin/orderlist" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
              View All <ArrowUpRight size={16} />
            </Link>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {stats.recentOrders.length > 0 ? (
              <div className="space-y-4">
                {stats.recentOrders.map(order => (
                  <div key={order._id} className="flex items-center justify-between pb-4 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{order.user?.name || 'Guest User'}</p>
                      <p className="text-xs text-gray-400 mt-0.5">#{order._id.substring(0, 8).toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">₹{order.totalPrice.toFixed(2)}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide
                        ${order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' : 
                          order.orderStatus === 'Accepted' ? 'bg-blue-100 text-blue-700' : 
                          'bg-yellow-100 text-yellow-700'}
                      `}>
                        {order.orderStatus || 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <p>No recent orders.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Features Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
              <AlertTriangle size={18} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Low Stock Alerts</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {stats.lowStockProducts?.length > 0 ? (
              <div className="space-y-4">
                {stats.lowStockProducts.map(product => (
                  <div key={product._id} className="flex items-center gap-4 pb-4 border-b border-gray-50 last:border-0">
                    <img src={product.image} alt={product.title} className="w-12 h-12 rounded-lg object-cover border border-gray-100" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900 line-clamp-1">{product.title}</p>
                      <p className="text-xs text-orange-600 font-semibold mt-1">Only {product.countInStock} left</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <p>Inventory levels are healthy.</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
              <Award size={18} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Top Sellers</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {stats.topProducts?.length > 0 ? (
              <div className="space-y-4">
                {stats.topProducts.map((product, idx) => (
                  <div key={product._id} className="flex items-center gap-4 pb-4 border-b border-gray-50 last:border-0">
                    <div className="w-6 text-center font-bold text-gray-300">#{idx + 1}</div>
                    <img src={product.image} alt={product.title} className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900 line-clamp-1">{product.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{product.totalSold} sold • ₹{product.revenue.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <p>No sales data yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center">
              <Star size={18} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Recent Reviews</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {stats.recentReviews?.length > 0 ? (
              <div className="space-y-4">
                {stats.recentReviews.map(review => (
                  <div key={review._id} className="pb-4 border-b border-gray-50 last:border-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-bold text-gray-900">{review.user?.name || 'User'}</p>
                      <div className="flex items-center text-yellow-400">
                        <Star size={12} className="fill-current" />
                        <span className="text-xs font-bold ml-1 text-gray-700">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">On {review.restaurant?.name || 'Restaurant'}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <p>No reviews yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
