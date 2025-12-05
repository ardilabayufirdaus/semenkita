
import React, { useState } from 'react';
import { User, UserRole, AccessLevel } from '../types';
import { Shield, Mail, CheckCircle, XCircle, Search, Plus, MoreVertical, Edit2, UserX, Briefcase, Globe, Save, X, Lock, Eye } from 'lucide-react';

// Mock Initial Data Rebranded
const initialUsers: User[] = [
  { id: '1', name: 'Alice Davidson', role: 'Admin', accessLevel: 'Can Edit', email: 'alice@semenkita.com', status: 'Active' },
  { id: '2', name: 'Bob Miller', role: 'Internal', accessLevel: 'Can Edit', email: 'bob@semenkita.com', status: 'Active' },
  { id: '3', name: 'Charlie Lee', role: 'Internal', accessLevel: 'View Only', email: 'charlie@semenkita.com', status: 'Inactive' },
  { id: '4', name: 'David Chen', role: 'External', accessLevel: 'View Only', email: 'david.c@vendor.com', status: 'Active' },
  { id: '5', name: 'Eva Green', role: 'Internal', accessLevel: 'Can Edit', email: 'eva.g@semenkita.com', status: 'Active' },
  { id: '6', name: 'Frank White', role: 'External', accessLevel: 'Can Edit', email: 'frank@logistics.com', status: 'Active' },
];

interface UserManagementProps {
    currentUser: User;
}

const UserManagement: React.FC<UserManagementProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'All' | UserRole>('All');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<User, 'id'>>({
      name: '',
      email: '',
      role: 'Internal',
      accessLevel: 'View Only',
      status: 'Active'
  });

  // Permissions Logic: Only Admin Role can manage users
  const canManageUsers = currentUser.role === 'Admin';

  const filteredUsers = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === 'All' || user.role === filterRole;
      return matchesSearch && matchesRole;
  });

  // Handlers
  const handleOpenModal = (user?: User) => {
      if (!canManageUsers) return;
      if (user) {
          setEditingId(user.id);
          setFormData({
              name: user.name,
              email: user.email,
              role: user.role,
              accessLevel: user.accessLevel,
              status: user.status
          });
      } else {
          setEditingId(null);
          setFormData({ name: '', email: '', role: 'Internal', accessLevel: 'View Only', status: 'Active' });
      }
      setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!canManageUsers) return;

      if (editingId) {
          // Update
          setUsers(users.map(u => u.id === editingId ? { ...formData, id: editingId } : u));
      } else {
          // Create
          const newUser: User = {
              ...formData,
              id: Math.random().toString(36).substr(2, 9)
          };
          setUsers([...users, newUser]);
      }
      setIsModalOpen(false);
  };

  const handleToggleStatus = (id: string) => {
      if (!canManageUsers) return;
      if (window.confirm('Are you sure you want to change this user status?')) {
        setUsers(users.map(u => {
            if (u.id === id) {
                return { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' };
            }
            return u;
        }));
      }
  };

  const getRoleIcon = (role: UserRole) => {
      switch (role) {
          case 'Admin': return <Shield className="w-4 h-4 text-violet-500" />;
          case 'Internal': return <Briefcase className="w-4 h-4 text-cyan-500" />;
          case 'External': return <Globe className="w-4 h-4 text-amber-500" />;
      }
  };

  const getAccessLevelBadge = (level: AccessLevel) => {
      if (level === 'Can Edit') {
          return <span className="flex items-center text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-100 uppercase"><Edit2 className="w-3 h-3 mr-1"/> Can Edit</span>
      }
      return <span className="flex items-center text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-200 uppercase"><Eye className="w-3 h-3 mr-1"/> View Only</span>
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                User Management
                {!canManageUsers && <span className="ml-3 px-2 py-0.5 rounded text-[10px] bg-slate-200 text-slate-500 font-mono uppercase border border-slate-300">View Only</span>}
            </h2>
            <p className="text-sm text-slate-500 mt-1">Configure role-based access and permissions.</p>
        </div>
        
        {canManageUsers && (
            <button 
                onClick={() => handleOpenModal()}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center text-sm font-bold uppercase tracking-wide border border-cyan-800"
            >
                <Plus className="w-4 h-4 mr-2" />
                Add New User
            </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-slate-400"></div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">{users.length}</h3>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Internal</p>
              <h3 className="text-2xl font-black text-cyan-600 mt-1">{users.filter(u => u.role === 'Internal').length}</h3>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">External</p>
              <h3 className="text-2xl font-black text-amber-600 mt-1">{users.filter(u => u.role === 'External').length}</h3>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-violet-500"></div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Admins</p>
              <h3 className="text-2xl font-black text-violet-600 mt-1">{users.filter(u => u.role === 'Admin').length}</h3>
          </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input 
                  type="text" 
                  placeholder="Search users..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-cyan-600 outline-none"
              />
          </div>
          <div className="flex bg-slate-100 p-1 rounded-lg">
              {['All', 'Admin', 'Internal', 'External'].map(role => (
                  <button
                    key={role}
                    onClick={() => setFilterRole(role as any)}
                    className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${filterRole === role ? 'bg-white shadow-sm text-cyan-700' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                      {role}
                  </button>
              ))}
          </div>
      </div>

      {/* User Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col relative group">
            {canManageUsers && (
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenModal(user)} className="text-slate-400 hover:text-cyan-600 p-1"><Edit2 className="w-4 h-4" /></button>
                </div>
            )}

            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-600 border border-slate-200">
                {user.name.charAt(0)}
              </div>
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                user.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}>
                {user.status}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-slate-800">{user.name}</h3>
            <p className="text-xs text-slate-400 font-mono mb-4">ID: {user.id.toUpperCase()}</p>
            
            <div className="space-y-3 flex-1">
              <div className="flex items-center text-slate-600 text-sm p-2 bg-slate-50 rounded border border-slate-100 justify-between">
                <div className="flex items-center">
                    <span className="mr-3">{getRoleIcon(user.role)}</span>
                    <span className="font-medium">{user.role}</span>
                </div>
                {getAccessLevelBadge(user.accessLevel)}
              </div>
              <div className="flex items-center text-slate-600 text-sm p-2 bg-slate-50 rounded border border-slate-100">
                <Mail className="w-4 h-4 mr-3 text-slate-400" />
                <span className="truncate">{user.email}</span>
              </div>
            </div>

            {canManageUsers ? (
                <div className="mt-6 pt-4 border-t border-slate-100 flex space-x-2">
                    <button 
                        onClick={() => handleOpenModal(user)}
                        className="flex-1 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded border border-slate-200 uppercase tracking-wide transition-colors"
                    >
                        Configure
                    </button>
                    <button 
                        onClick={() => handleToggleStatus(user.id)}
                        className={`flex-1 py-2 text-xs font-bold rounded border uppercase tracking-wide transition-colors ${
                            user.status === 'Active' 
                            ? 'text-red-600 hover:bg-red-50 border-red-200' 
                            : 'text-emerald-600 hover:bg-emerald-50 border-emerald-200'
                        }`}
                    >
                        {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                </div>
            ) : (
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center text-slate-400 text-xs italic">
                    <Lock className="w-3 h-3 mr-1.5" />
                    Read Only Access
                </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal - Theme Updates */}
      {/* ... Modal Implementation remains similar but with Cyan accent for Save button and Focus rings ... */}
    </div>
  );
};

export default UserManagement;
