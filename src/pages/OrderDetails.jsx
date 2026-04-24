import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import { CheckCircle, Package, Truck, CreditCard, ArrowLeft, Loader2, Navigation } from 'lucide-react';

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deliverLoading, setDeliverLoading] = useState(false);
  const { userInfo } = useAuth();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setOrder(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo) {
       fetchOrder();
    }
  }, [id, userInfo]);

  useEffect(() => {
    // Determine backend URL based on environment if needed, here just relative or localhost
    const socket = io(window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/');
    
    if (id) {
      socket.emit('joinOrder', id);
    }

    socket.on('statusUpdate', (updatedOrder) => {
      setOrder(updatedOrder);
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  const getStatusIndex = (status) => {
    const statuses = ['Pending', 'Accepted', 'Preparing', 'Ready', 'PickedUp', 'Delivered'];
    return Math.max(0, statuses.indexOf(status || 'Pending'));
  };

  const deliverHandler = async () => {
    try {
      setDeliverLoading(true);
      const res = await fetch(`/api/orders/${order._id}/deliver`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to update delivery status');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setDeliverLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Order not found</h2>
        <Link to="/" className="text-primary hover:underline mt-4 inline-block">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
         <div>
            <Link to="/" className="text-sm font-bold text-gray-400 flex items-center gap-2 hover:text-primary mb-4 transition">
               <ArrowLeft size={16}/> Back to Shopping
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Order #{order._id.slice(-8).toUpperCase()}</h1>
            <p className="text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
         </div>
         <div className="flex items-center gap-3">
            <span className={`px-4 py-2 rounded-full font-bold text-sm ${order.isPaid ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
               {order.isPaid ? 'Paid' : 'Payment Pending'}
            </span>
            <span className={`px-4 py-2 rounded-full font-bold text-sm ${order.isDelivered ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'}`}>
               {order.isDelivered ? 'Delivered' : 'Processing'}
            </span>
         </div>
      </div>
      
      {/* Live Order Tracker */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm mb-10">
         <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Navigation className="text-primary"/> Live Tracking: {order.orderStatus || 'Pending'}
         </h2>
         <div className="relative pt-4 pb-8">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-100">
               <div style={{ width: `${(getStatusIndex(order.orderStatus) / 5) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"></div>
            </div>
            <div className="flex justify-between text-xs font-bold text-gray-500">
               <span className={getStatusIndex(order.orderStatus) >= 0 ? 'text-primary' : ''}>Pending</span>
               <span className={getStatusIndex(order.orderStatus) >= 1 ? 'text-primary' : ''}>Accepted</span>
               <span className={getStatusIndex(order.orderStatus) >= 2 ? 'text-primary' : ''}>Preparing</span>
               <span className={getStatusIndex(order.orderStatus) >= 3 ? 'text-primary' : ''}>Ready</span>
               <span className={getStatusIndex(order.orderStatus) >= 4 ? 'text-primary' : ''}>Picked Up</span>
               <span className={getStatusIndex(order.orderStatus) >= 5 ? 'text-primary' : ''}>Delivered</span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 space-y-8">
            {/* Order Items */}
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
               <div className="p-6 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                  <Package className="text-gray-400" size={20}/>
                  <h2 className="font-bold text-gray-900">Order Items</h2>
               </div>
               <div className="divide-y divide-gray-50">
                  {order.orderItems.map((item, index) => (
                     <div key={index} className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className="w-16 h-16 bg-gray-50 rounded-xl border p-1 flex-shrink-0">
                              <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                           </div>
                           <div>
                              <h3 className="font-bold text-gray-900 text-sm">{item.title}</h3>
                              <p className="text-xs text-gray-500">₹{item.price} × {item.qty}</p>
                           </div>
                        </div>
                        <span className="font-bold text-gray-900">₹{item.price * item.qty}</span>
                     </div>
                  ))}
               </div>
            </div>

            {/* Shipping & Payment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <Truck size={20}/>
                     </div>
                     <h2 className="font-bold text-gray-900">Shipping Details</h2>
                  </div>
                  <div className="text-sm space-y-1">
                     <p className="font-bold text-gray-900">{order.user.name}</p>
                     <p className="text-gray-500">{order.shippingAddress.address}</p>
                     <p className="text-gray-500">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                     <p className="text-gray-500">{order.shippingAddress.country}</p>
                  </div>
               </div>

               <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <CreditCard size={20}/>
                     </div>
                     <h2 className="font-bold text-gray-900">Payment Method</h2>
                  </div>
                  <p className="text-sm font-bold text-gray-900 mb-2">{order.paymentMethod === 'PayPal' ? 'PayPal / Credit Card' : 'Cash on Delivery'}</p>
                  {order.isPaid ? (
                     <div className="flex items-center gap-2 text-success text-xs font-bold">
                        <CheckCircle size={14}/> Paid on {new Date(order.paidAt).toLocaleDateString()}
                     </div>
                  ) : (
                     <p className="text-xs text-warning font-bold italic">Awaiting payment</p>
                  )}
               </div>
            </div>
         </div>

         {/* Order Summary Summary */}
         <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm sticky top-32">
               <h2 className="text-xl font-bold text-gray-900 mb-6">Price Details</h2>
               <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-500">
                     <span>Items Total</span>
                     <span className="font-bold text-gray-900">₹{order.itemsPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                     <span>Shipping Price</span>
                     <span className="text-success font-bold">Free</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                     <span>Tax (GST)</span>
                     <span className="font-bold text-gray-900">₹{order.taxPrice}</span>
                  </div>
                  <div className="pt-6 border-t border-gray-100 flex justify-between items-end text-primary">
                     <span className="font-bold text-gray-900">Amount Paid</span>
                     <span className="text-3xl font-bold tracking-tight">₹{order.totalPrice}</span>
                  </div>
               </div>

                {/* Success Message if just placed */}
                {!order.isPaid && order.paymentMethod === 'COD' && (
                   <div className="mt-8 p-4 bg-success/5 border border-success/20 rounded-2xl flex items-start gap-4">
                      <CheckCircle className="text-success flex-shrink-0" size={20}/>
                      <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                         Your Cash on Delivery order has been successfully placed. Please keep **₹{order.totalPrice}** ready at the time of delivery.
                      </p>
                   </div>
                )}
                
                {/* Admin Delivery Button */}
                {userInfo && userInfo.isAdmin && !order.isDelivered && (
                   <div className="mt-6">
                      <button 
                         onClick={deliverHandler}
                         disabled={deliverLoading}
                         className="w-full bg-primary text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-primary-dark transition disabled:opacity-50"
                      >
                         {deliverLoading ? <Loader2 className="animate-spin" size={20}/> : 'Mark As Delivered'}
                      </button>
                   </div>
                )}
            </div>
         </div>
      </div>
    </div>
  );
}
