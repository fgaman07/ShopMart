import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  User, ShoppingBag, MapPin, Plus, Trash2, Edit3, Check, X,
  Loader2, Eye, EyeOff, Home, Briefcase, Star, ChevronRight, Package
} from 'lucide-react';

const TABS = ['Account Info', 'My Addresses', 'My Orders'];

export default function Profile() {
  const { userInfo, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  // Account info state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [accountLoading, setAccountLoading] = useState(false);
  const [accountMsg, setAccountMsg] = useState(null);

  // Addresses state
  const [addresses, setAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [addrLoading, setAddrLoading] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: 'Home', address: '', city: '', postalCode: '', country: 'India', isDefault: false });

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userInfo) return;
      try {
        const res = await fetch('/api/users/profile', {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        const data = await res.json();
        setName(data.name || '');
        setEmail(data.email || '');
        setPhone(data.phone || '');
        setAddresses(data.addresses || []);
      } catch (err) { console.error(err); }
    };
    fetchProfile();
  }, [userInfo]);

  // Fetch orders when that tab is active
  useEffect(() => {
    if (activeTab !== 2 || !userInfo) return;
    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const res = await fetch('/api/orders/myorders', {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) { console.error(err); }
      finally { setOrdersLoading(false); }
    };
    fetchOrders();
  }, [activeTab, userInfo]);

  // Save account info
  const handleAccountSave = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      setAccountMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    setAccountLoading(true);
    setAccountMsg(null);
    try {
      const body = { name, email, phone };
      if (password) body.password = password;
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (res.ok) {
        setUser({ ...userInfo, name: data.name, email: data.email, token: data.token });
        setPassword('');
        setConfirmPassword('');
        setAccountMsg({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setAccountMsg({ type: 'error', text: data.message || 'Update failed.' });
      }
    } catch (err) {
      setAccountMsg({ type: 'error', text: 'Server error. Try again.' });
    }
    setAccountLoading(false);
  };

  // Save addresses
  const saveAddresses = async (updatedAddresses) => {
    setAddrLoading(true);
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
        body: JSON.stringify({ addresses: updatedAddresses })
      });
      if (res.ok) setAddresses(updatedAddresses);
    } catch (err) { console.error(err); }
    setAddrLoading(false);
  };

  const handleAddAddress = () => {
    const updated = editIdx !== null
      ? addresses.map((a, i) => i === editIdx ? newAddr : a)
      : [...addresses, newAddr];
    // if new address is default, unset others
    const final = newAddr.isDefault
      ? updated.map((a, i) => ({ ...a, isDefault: (editIdx !== null ? i === editIdx : i === updated.length - 1) }))
      : updated;
    saveAddresses(final);
    setShowAddForm(false);
    setEditIdx(null);
    setNewAddr({ label: 'Home', address: '', city: '', postalCode: '', country: 'India', isDefault: false });
  };

  const handleDeleteAddress = (idx) => {
    const updated = addresses.filter((_, i) => i !== idx);
    saveAddresses(updated);
  };

  const handleSetDefault = (idx) => {
    const updated = addresses.map((a, i) => ({ ...a, isDefault: i === idx }));
    saveAddresses(updated);
  };

  const handleEditAddress = (idx) => {
    setNewAddr({ ...addresses[idx] });
    setEditIdx(idx);
    setShowAddForm(true);
  };

  const statusColor = (status) => {
    const map = {
      Pending: 'bg-yellow-100 text-yellow-700',
      Accepted: 'bg-blue-100 text-blue-700',
      Preparing: 'bg-orange-100 text-orange-700',
      Ready: 'bg-purple-100 text-purple-700',
      PickedUp: 'bg-indigo-100 text-indigo-700',
      Delivered: 'bg-green-100 text-green-700',
    };
    return map[status] || 'bg-gray-100 text-gray-600';
  };

  if (!userInfo) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">Please log in to view your profile.</p>
        <Link to="/login" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition">Login</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Profile Header */}
      <div className="flex items-center gap-5 mb-8 p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl border border-primary/20">
        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold shadow-lg">
          {name.charAt(0).toUpperCase() || 'U'}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
          <p className="text-gray-500 text-sm">{email}</p>
          {phone && <p className="text-gray-400 text-sm mt-0.5">📞 {phone}</p>}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8 gap-1">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-5 py-3 text-sm font-semibold rounded-t-lg transition-all ${
              activeTab === i
                ? 'bg-white border border-b-white border-gray-200 text-primary -mb-px'
                : 'text-gray-500 hover:text-primary hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab 0: Account Info */}
      {activeTab === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 max-w-lg">
          <h2 className="text-lg font-bold mb-6 text-gray-800 flex items-center gap-2"><User className="w-5 h-5 text-primary" /> Account Information</h2>
          {accountMsg && (
            <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${accountMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {accountMsg.text}
            </div>
          )}
          <form onSubmit={handleAccountSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" placeholder="Your name" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" placeholder="your@email.com" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Phone</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" placeholder="+91 99999 00000" />
            </div>
            <hr className="border-gray-100" />
            <p className="text-xs text-gray-400 font-medium">Change Password (leave blank to keep current)</p>
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">New Password</label>
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition pr-10" placeholder="New password" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"><span>{showPass ? <EyeOff size={16}/> : <Eye size={16}/>}</span></button>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" placeholder="Confirm password" />
            </div>
            <button type="submit" disabled={accountLoading} className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition flex items-center justify-center gap-2">
              {accountLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Save Changes
            </button>
          </form>
        </div>
      )}

      {/* Tab 1: My Addresses */}
      {activeTab === 1 && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> Saved Addresses</h2>
            <button
              onClick={() => { setShowAddForm(true); setEditIdx(null); setNewAddr({ label: 'Home', address: '', city: '', postalCode: '', country: 'India', isDefault: false }); }}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 transition shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Address
            </button>
          </div>

          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="bg-white border border-primary/20 rounded-2xl p-6 mb-5 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">{editIdx !== null ? 'Edit Address' : 'New Address'}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Label</label>
                  <select value={newAddr.label} onChange={e => setNewAddr({ ...newAddr, label: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option>Home</option>
                    <option>Work</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Street Address</label>
                  <input value={newAddr.address} onChange={e => setNewAddr({ ...newAddr, address: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Street, Flat no." />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">City</label>
                  <input value={newAddr.city} onChange={e => setNewAddr({ ...newAddr, city: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="City" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Postal Code</label>
                  <input value={newAddr.postalCode} onChange={e => setNewAddr({ ...newAddr, postalCode: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="400001" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Country</label>
                  <input value={newAddr.country} onChange={e => setNewAddr({ ...newAddr, country: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="India" />
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <input type="checkbox" id="isDefault" checked={newAddr.isDefault} onChange={e => setNewAddr({ ...newAddr, isDefault: e.target.checked })} className="w-4 h-4 accent-primary" />
                  <label htmlFor="isDefault" className="text-sm text-gray-600">Set as default address</label>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={handleAddAddress} disabled={addrLoading} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition">
                  {addrLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Save
                </button>
                <button onClick={() => { setShowAddForm(false); setEditIdx(null); }} className="flex items-center gap-2 border border-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>
            </div>
          )}

          {/* Address List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.length === 0 && !showAddForm && (
              <div className="col-span-2 text-center py-16 text-gray-400">
                <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No saved addresses yet.</p>
                <p className="text-sm mt-1">Add your first address to speed up checkout!</p>
              </div>
            )}
            {addresses.map((addr, i) => (
              <div key={i} className={`bg-white border rounded-2xl p-5 relative shadow-sm transition ${addr.isDefault ? 'border-primary/40 ring-1 ring-primary/20' : 'border-gray-100 hover:border-gray-200'}`}>
                {addr.isDefault && (
                  <span className="absolute top-3 right-3 bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-semibold">Default</span>
                )}
                <div className="flex items-center gap-2 mb-2">
                  {addr.label === 'Home' ? <Home className="w-4 h-4 text-primary" /> : <Briefcase className="w-4 h-4 text-primary" />}
                  <span className="font-bold text-gray-800 text-sm">{addr.label}</span>
                </div>
                <p className="text-sm text-gray-600">{addr.address}</p>
                <p className="text-sm text-gray-500">{addr.city}, {addr.postalCode}</p>
                <p className="text-sm text-gray-400">{addr.country}</p>
                <div className="flex items-center gap-3 mt-4">
                  <button onClick={() => handleEditAddress(i)} className="text-xs text-primary hover:underline flex items-center gap-1"><Edit3 className="w-3 h-3" /> Edit</button>
                  <button onClick={() => handleDeleteAddress(i)} className="text-xs text-red-500 hover:underline flex items-center gap-1"><Trash2 className="w-3 h-3" /> Delete</button>
                  {!addr.isDefault && (
                    <button onClick={() => handleSetDefault(i)} className="text-xs text-gray-500 hover:text-primary hover:underline flex items-center gap-1 ml-auto"><Star className="w-3 h-3" /> Set Default</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: My Orders */}
      {activeTab === 2 && (
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-primary" /> My Orders</h2>
          {ordersLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No orders yet.</p>
              <p className="text-sm mt-1">Your order history will appear here.</p>
              <Link to="/shop" className="mt-4 inline-block bg-primary text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 transition">Browse Menu</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map(order => (
                <Link
                  key={order._id}
                  to={`/order/${order._id}`}
                  className="flex items-center justify-between bg-white border border-gray-100 hover:border-primary/30 rounded-2xl p-4 md:p-5 shadow-sm hover:shadow transition group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Order ID</p>
                      <p className="font-mono text-sm font-semibold text-gray-700">#{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`hidden sm:inline text-xs px-3 py-1.5 rounded-full font-semibold ${statusColor(order.orderStatus)}`}>
                      {order.orderStatus || 'Pending'}
                    </span>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">₹{order.totalPrice?.toFixed(2)}</p>
                      <p className="text-xs text-gray-400">{order.orderItems?.length} item{order.orderItems?.length !== 1 ? 's' : ''}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
