import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function UserEdit() {
  const { id: userId } = useParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setName(data.name);
          setEmail(data.email);
          setIsAdmin(data.isAdmin);
        } else {
          setError(data.message || 'Failed to fetch user');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setUpdateLoading(true);
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ name, email, isAdmin }),
      });
      const data = await res.json();
      if (res.ok) {
        navigate('/admin/userlist');
      } else {
        alert(data.message || 'Failed to update user');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Link to="/admin/userlist" className="inline-flex items-center text-gray-500 hover:text-primary mb-6">
        <ArrowLeft size={16} className="mr-2" /> Go Back
      </Link>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold mb-6">Edit User</h1>
        
        {loading ? (
          <div className="flex justify-center"><Loader2 className="animate-spin text-primary" size={40}/></div>
        ) : error ? (
          <div className="bg-danger/10 text-danger p-4 rounded-xl">{error}</div>
        ) : (
          <form onSubmit={submitHandler} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                required
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAdmin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="h-5 w-5 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="isAdmin" className="ml-3 block text-sm font-medium text-gray-700">
                Is Admin
              </label>
            </div>
            <button
              type="submit"
              disabled={updateLoading}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-primary-dark transition disabled:opacity-50"
            >
              {updateLoading ? <Loader2 className="animate-spin" size={20}/> : 'Update User'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
