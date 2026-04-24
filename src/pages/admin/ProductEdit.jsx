import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function ProductEdit() {
  const { id: productId } = useParams();
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  
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

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        if (res.ok) {
          setName(data.name);
          setPrice(data.price);
          setImage(data.image);
          setBrand(data.brand);
          setCategory(data.category);
          setCountInStock(data.countInStock);
          setDescription(data.description);
        } else {
          setError(data.message || 'Failed to fetch product');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setUpdateLoading(true);
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ name, price, image, brand, category, countInStock, description }),
      });
      const data = await res.json();
      if (res.ok) {
        navigate('/admin/productlist');
      } else {
        alert(data.message || 'Failed to update product');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Link to="/admin/productlist" className="inline-flex items-center text-gray-500 hover:text-primary mb-6">
        <ArrowLeft size={16} className="mr-2" /> Go Back
      </Link>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
        
        {loading ? (
          <div className="flex justify-center"><Loader2 className="animate-spin text-primary" size={40}/></div>
        ) : error ? (
          <div className="bg-danger/10 text-danger p-4 rounded-xl">{error}</div>
        ) : (
          <form onSubmit={submitHandler} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition" required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Price (₹)</label>
              <input
                type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition" required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Image URL</label>
              <input
                type="text" value={image} onChange={(e) => setImage(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition" required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Brand</label>
              <input
                type="text" value={brand} onChange={(e) => setBrand(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition" required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <input
                type="text" value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition" required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Count In Stock</label>
              <input
                type="number" value={countInStock} onChange={(e) => setCountInStock(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition" required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <textarea
                value={description} onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition min-h-[100px]" required
              />
            </div>

            <button
              type="submit" disabled={updateLoading}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-primary-dark transition disabled:opacity-50"
            >
              {updateLoading ? <Loader2 className="animate-spin" size={20}/> : 'Update Product'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
