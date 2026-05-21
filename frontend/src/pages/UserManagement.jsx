import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Trash2, Shield, User, UserCheck, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    // Form state
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newRole, setNewRole] = useState('operator');

    const host = import.meta.env.VITE_BACK_HOST || 'localhost';
    const backendUrl = host.includes(':') ? `http://${host}` : `http://${host}:8000`;
    const token = localStorage.getItem('token');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${backendUrl}/auth/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAddUser = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await fetch(`${backendUrl}/auth/users?username=${newUsername}&password=${newPassword}&role=${newRole}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || 'Failed to create user');
            }

            toast.success('User created successfully');
            setNewUsername('');
            setNewPassword('');
            fetchUsers();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteUser = async (id, username) => {
        if (username === 'admin') {
            toast.error('Cannot delete the primary admin account');
            return;
        }

        if (!window.confirm(`Are you sure you want to delete user "${username}"?`)) return;

        try {
            const response = await fetch(`${backendUrl}/auth/users/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to delete user');
            
            toast.success('User deleted');
            fetchUsers();
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
                    <Shield className="text-secondary" /> User Management
                </h1>
                <p className="text-on-surface-variant mt-2">Manage system access and permissions</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add User Form */}
                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm h-fit">
                    <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                        <UserPlus size={20} /> Add New User
                    </h2>
                    <form onSubmit={handleAddUser} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Username</label>
                            <input 
                                type="text"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary outline-none transition-all"
                                placeholder="Enter username"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Password</label>
                            <input 
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary outline-none transition-all"
                                placeholder="Enter password"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Role</label>
                            <select 
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary outline-none transition-all"
                            >
                                <option value="admin">Admin</option>
                                <option value="operator">Operator</option>
                                <option value="viewer">Viewer</option>
                            </select>
                        </div>
                        <button 
                            disabled={submitting}
                            className="w-full py-3 bg-primary text-on-primary rounded-xl font-bold hover:bg-primary-container transition-all flex items-center justify-center gap-2 mt-4"
                        >
                            {submitting ? <Loader2 className="animate-spin" size={20} /> : <UserPlus size={20} />}
                            Create User
                        </button>
                    </form>
                </div>

                {/* Users List */}
                <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                            <UserCheck size={20} /> Registered Users
                        </h2>
                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                            {users.length} Total
                        </span>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-surface-container text-on-surface-variant text-xs font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Created At</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant">
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center">
                                            <Loader2 className="animate-spin mx-auto text-primary mb-2" size={32} />
                                            <p className="text-on-surface-variant animate-pulse">Loading users...</p>
                                        </td>
                                    </tr>
                                ) : users.map((u) => (
                                    <tr key={u.id} className="hover:bg-surface-container-low transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold">
                                                    {u.username[0].toUpperCase()}
                                                </div>
                                                <span className="font-semibold text-primary">{u.username}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                u.role === 'admin' ? 'bg-error-container text-on-error-container' : 
                                                u.role === 'operator' ? 'bg-success-container text-on-success-container' : 
                                                'bg-surface-container-high text-on-surface-variant'
                                            }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-on-surface-variant font-medium">
                                            {new Date(u.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {u.username !== 'admin' && (
                                                <button 
                                                    onClick={() => handleDeleteUser(u.id, u.username)}
                                                    className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-all"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
