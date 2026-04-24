import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Edit, Trash2, Check, X, Loader2 } from 'lucide-react';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      fetchUsers();
    } else {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/users', {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      } else {
        setError(data.message || 'Failed to fetch users');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const res = await fetch(`/api/users/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        if (res.ok) {
          fetchUsers();
        } else {
          const data = await res.json();
          alert(data.message || 'Failed to delete');
        }
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Users</h1>
      {loading ? (
        <div className="flex justify-center my-20"><Loader2 className="animate-spin text-primary" size={40}/></div>
      ) : error ? (
        <div className="bg-danger/10 text-danger p-4 rounded-xl">{error}</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Admin</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500">{user._id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <a href={`mailto:${user.email}`} className="hover:text-primary">{user.email}</a>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {user.isAdmin ? (
                      <Check className="text-success mx-auto" size={20} />
                    ) : (
                      <X className="text-danger mx-auto" size={20} />
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <Link to={`/admin/user/${user._id}/edit`} className="inline-block bg-gray-100 p-2 rounded hover:bg-gray-200 transition">
                      <Edit size={16} className="text-gray-600" />
                    </Link>
                    <button onClick={() => deleteHandler(user._id)} className="bg-danger/10 p-2 rounded hover:bg-danger/20 transition">
                      <Trash2 size={16} className="text-danger" />
                    </button>
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
