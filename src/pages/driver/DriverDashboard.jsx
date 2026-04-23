import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2, Car, MapPin, Navigation } from 'lucide-react';

export default function DriverDashboard() {
  const [availableOrders, setAvailableOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo || !userInfo.isDriver) {
      navigate('/');
      return;
    }

    fetchAvailableOrders();
  }, [userInfo, navigate]);

  const fetchAvailableOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/orders/available', {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setAvailableOrders(data);
      } else {
        setError(data.message || 'Failed to fetch available orders');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/accept`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      
      if (res.ok) {
        // Remove from available list or navigate to order details
        setAvailableOrders(prev => prev.filter(order => order._id !== orderId));
        alert('Order accepted successfully!');
        // Could navigate to /order/:id here
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to accept order');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-900">
          <Car className="text-primary" size={32} /> Driver Portal
        </h1>
        <div className="flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full font-bold text-sm">
           <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div> Online & Ready
        </div>
      </div>

      <h2 className="text-xl font-bold mb-6">Available Deliveries Near You</h2>

      {loading ? (
        <div className="flex justify-center my-20"><Loader2 className="animate-spin text-primary" size={40}/></div>
      ) : error ? (
        <div className="bg-danger/10 text-danger p-4 rounded-xl">{error}</div>
      ) : availableOrders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
          <Navigation className="mx-auto text-gray-300 mb-4" size={60} />
          <h2 className="text-2xl font-bold text-gray-700">No Orders Available</h2>
          <p className="text-gray-500 mt-2">Check back in a few minutes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition p-6">
               <div className="flex justify-between items-start mb-4">
                  <div>
                     <span className="text-xs font-bold text-gray-400">ORDER #{order._id.slice(-6).toUpperCase()}</span>
                     <h3 className="font-bold text-lg text-gray-900 mt-1">₹{order.totalPrice} Payout</h3>
                  </div>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
                     Ready
                  </span>
               </div>
               
               <div className="space-y-3 mb-6 relative">
                  <div className="absolute left-2.5 top-3 bottom-3 w-0.5 bg-gray-200"></div>
                  
                  <div className="flex gap-3 relative z-10">
                     <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Store size={10} className="text-white"/>
                     </div>
                     <div>
                        <p className="text-xs font-bold text-gray-500">PICKUP</p>
                        <p className="text-sm font-medium text-gray-900">Restaurant (TBD)</p>
                     </div>
                  </div>
                  
                  <div className="flex gap-3 relative z-10">
                     <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MapPin size={10} className="text-white"/>
                     </div>
                     <div>
                        <p className="text-xs font-bold text-gray-500">DROPOFF</p>
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                     </div>
                  </div>
               </div>

               <button 
                 onClick={() => handleAcceptOrder(order._id)}
                 className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition"
               >
                 Accept Delivery
               </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
