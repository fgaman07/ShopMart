import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2, X, Check } from 'lucide-react';

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      fetchOrders();
    } else {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/orders', {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(data);
      } else {
        setError(data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Orders</h1>

      {loading ? (
        <div className="flex justify-center my-20"><Loader2 className="animate-spin text-primary" size={40}/></div>
      ) : error ? (
        <div className="bg-danger/10 text-danger p-4 rounded-xl">{error}</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Paid</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Delivered</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500">{order._id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{order.user && order.user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{order.createdAt.substring(0, 10)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">₹{order.totalPrice}</td>
                  <td className="px-6 py-4">
                    {order.isPaid ? (
                      <Check className="text-success" size={20} />
                    ) : (
                      <X className="text-danger" size={20} />
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {order.isDelivered ? (
                      <Check className="text-success" size={20} />
                    ) : (
                      <X className="text-danger" size={20} />
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <Link to={`/order/${order._id}`} className="inline-block bg-gray-100 px-3 py-1 text-sm font-bold rounded hover:bg-gray-200 transition">
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
