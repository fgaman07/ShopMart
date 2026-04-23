import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2, Store, Plus } from 'lucide-react';

export default function VendorDashboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo || !userInfo.isVendor) {
      // In a real app, you might want to show an "Apply to be a Vendor" page instead of just redirecting
      navigate('/');
      return;
    }

    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        // For phase 1, we just fetch all and filter client side. 
        // In real app, we would have /api/restaurants/mine
        const res = await fetch('/api/restaurants');
        const data = await res.json();
        if (res.ok) {
          const myRestaurants = data.filter(r => r.user === userInfo._id);
          setRestaurants(myRestaurants);
        } else {
          setError(data.message || 'Failed to fetch restaurants');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [userInfo, navigate]);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Store className="text-primary" size={32} /> Vendor Dashboard
        </h1>
        <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-dark transition">
          <Plus size={20} /> Add Restaurant
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center my-20"><Loader2 className="animate-spin text-primary" size={40}/></div>
      ) : error ? (
        <div className="bg-danger/10 text-danger p-4 rounded-xl">{error}</div>
      ) : restaurants.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
          <Store className="mx-auto text-gray-300 mb-4" size={60} />
          <h2 className="text-2xl font-bold text-gray-700">No Restaurants Found</h2>
          <p className="text-gray-500 mt-2">You haven't set up any restaurants yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <div key={restaurant._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
              <div className="h-40 bg-gray-200">
                <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">{restaurant.name}</h2>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{restaurant.description}</p>
                <div className="flex gap-2">
                  <button className="flex-1 bg-primary/10 text-primary font-bold py-2 rounded-lg hover:bg-primary/20 transition text-sm">
                    Manage Menu
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 font-bold py-2 rounded-lg hover:bg-gray-200 transition text-sm">
                    View Orders
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
