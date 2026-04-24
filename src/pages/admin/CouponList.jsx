import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Plus, Trash2, Loader2, Tag, ToggleLeft, ToggleRight, X, Check } from 'lucide-react';

export default function CouponList() {
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState({
    code: '', discountType: 'percent', discountValue: '', minOrderValue: '0',
    maxUses: '100', expiresAt: '', isActive: true,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userInfo?.isAdmin) { navigate('/'); return; }
    fetchCoupons();
  }, [userInfo]);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/coupons', { headers: { Authorization: `Bearer ${userInfo.token}` } });
      const data = await res.json();
      setCoupons(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
        body: JSON.stringify({ ...form, discountValue: Number(form.discountValue), minOrderValue: Number(form.minOrderValue), maxUses: Number(form.maxUses) }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message); }
      else {
        setCoupons(prev => [data, ...prev]);
        setShowForm(false);
        setForm({ code: '', discountType: 'percent', discountValue: '', minOrderValue: '0', maxUses: '100', expiresAt: '', isActive: true });
      }
    } catch (err) { setError('Server error.'); }
    setFormLoading(false);
  };

  const handleToggle = async (coupon) => {
    try {
      const res = await fetch(`/api/coupons/${coupon._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
        body: JSON.stringify({ isActive: !coupon.isActive }),
      });
      if (res.ok) setCoupons(prev => prev.map(c => c._id === coupon._id ? { ...c, isActive: !c.isActive } : c));
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await fetch(`/api/coupons/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${userInfo.token}` } });
      setCoupons(prev => prev.filter(c => c._id !== id));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Tag className="text-primary w-6 h-6" /> Coupon Management</h1>
          <p className="text-sm text-gray-400 mt-0.5">Create and manage promo codes for your customers.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Coupon
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white border border-primary/20 rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-5 text-base flex items-center justify-between">
            Create New Coupon
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
          </h2>
          <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Code</label>
              <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} required placeholder="WELCOME20" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono uppercase" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Type</label>
              <select value={form.discountType} onChange={e => setForm({ ...form, discountType: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="percent">Percentage (%)</option>
                <option value="flat">Flat Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                Discount {form.discountType === 'percent' ? '(%)' : '(₹)'}
              </label>
              <input type="number" value={form.discountValue} onChange={e => setForm({ ...form, discountValue: e.target.value })} required min="1" placeholder={form.discountType === 'percent' ? '20' : '50'} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Min Order Value (₹)</label>
              <input type="number" value={form.minOrderValue} onChange={e => setForm({ ...form, minOrderValue: e.target.value })} min="0" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Max Uses</label>
              <input type="number" value={form.maxUses} onChange={e => setForm({ ...form, maxUses: e.target.value })} min="1" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Expires At</label>
              <input type="date" value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })} required className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            {error && <p className="col-span-2 text-red-500 text-sm">{error}</p>}
            <div className="col-span-2 flex gap-3 mt-2">
              <button type="submit" disabled={formLoading} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition">
                {formLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Create Coupon
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="border border-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Coupon Table */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Tag className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No coupons yet. Create your first one!</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Code', 'Discount', 'Min Order', 'Used / Max', 'Expires', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {coupons.map(c => (
                <tr key={c._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-mono font-bold text-primary">{c.code}</td>
                  <td className="px-4 py-3 font-semibold">
                    {c.discountType === 'percent' ? `${c.discountValue}%` : `₹${c.discountValue}`}
                  </td>
                  <td className="px-4 py-3 text-gray-600">₹{c.minOrderValue}</td>
                  <td className="px-4 py-3 text-gray-600">{c.usedCount} / {c.maxUses}</td>
                  <td className="px-4 py-3 text-gray-600">{new Date(c.expiresAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggle(c)} className="flex items-center gap-1.5 text-sm">
                      {c.isActive
                        ? <><ToggleRight className="w-5 h-5 text-green-500" /><span className="text-green-600 font-semibold">Active</span></>
                        : <><ToggleLeft className="w-5 h-5 text-gray-400" /><span className="text-gray-400 font-semibold">Inactive</span></>}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(c._id)} className="text-red-400 hover:text-red-600 transition p-1 rounded-lg hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6">
        <Link to="/admin/userlist" className="text-sm text-primary hover:underline">← Back to Admin</Link>
      </div>
    </div>
  );
}
