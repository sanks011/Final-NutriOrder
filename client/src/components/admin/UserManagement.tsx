import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Search,
  Filter,
  MoreVertical,
  Shield,
  ShieldOff,
  Ban,
  CheckCircle,
  TrendingUp,
  Package,
  Heart,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: 'user' | 'admin' | 'delivery';
  status: 'active' | 'inactive' | 'banned';
  joinedAt: string;
  totalOrders: number;
  totalSpent: number;
  healthScore: number;
  address: string;
  dietPreferences: string[];
}

const mockUsers: UserData[] = [
  {
    id: 'u1',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    role: 'user',
    status: 'active',
    joinedAt: '2024-06-15T10:00:00Z',
    totalOrders: 45,
    totalSpent: 12500,
    healthScore: 85,
    address: '123 Health Street, Wellness City',
    dietPreferences: ['Vegetarian', 'Low Sodium'],
  },
  {
    id: 'u2',
    name: 'Priya Patel',
    email: 'priya@example.com',
    phone: '+91 87654 32109',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    role: 'user',
    status: 'active',
    joinedAt: '2024-08-20T14:30:00Z',
    totalOrders: 28,
    totalSpent: 8900,
    healthScore: 92,
    address: '456 Green Avenue, Eco Town',
    dietPreferences: ['Vegan', 'Gluten Free'],
  },
  {
    id: 'u3',
    name: 'Amit Singh',
    email: 'amit@example.com',
    phone: '+91 65432 10987',
    role: 'user',
    status: 'active',
    joinedAt: '2024-09-10T09:15:00Z',
    totalOrders: 15,
    totalSpent: 4500,
    healthScore: 72,
    address: '789 Fitness Lane, Health District',
    dietPreferences: ['Keto', 'High Protein'],
  },
  {
    id: 'u4',
    name: 'Sneha Gupta',
    email: 'sneha@example.com',
    phone: '+91 54321 09876',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    role: 'user',
    status: 'inactive',
    joinedAt: '2024-04-05T16:45:00Z',
    totalOrders: 8,
    totalSpent: 2200,
    healthScore: 68,
    address: '321 Organic Street, Fresh Town',
    dietPreferences: ['Diabetic Safe'],
  },
  {
    id: 'u5',
    name: 'Vijay Kumar',
    email: 'vijay@example.com',
    phone: '+91 76543 21098',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'delivery',
    status: 'active',
    joinedAt: '2024-07-12T11:00:00Z',
    totalOrders: 0,
    totalSpent: 0,
    healthScore: 0,
    address: '555 Driver Road, Logistics City',
    dietPreferences: [],
  },
  {
    id: 'u6',
    name: 'Admin User',
    email: 'admin@fiteats.com',
    phone: '+91 99999 88888',
    role: 'admin',
    status: 'active',
    joinedAt: '2024-01-01T00:00:00Z',
    totalOrders: 0,
    totalSpent: 0,
    healthScore: 0,
    address: 'FitEats HQ',
    dietPreferences: [],
  },
];

const roleConfig = {
  user: { label: 'Customer', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  admin: { label: 'Admin', color: 'text-purple-500', bg: 'bg-purple-500/10' },
  delivery: { label: 'Delivery', color: 'text-orange-500', bg: 'bg-orange-500/10' },
};

const statusConfig = {
  active: { label: 'Active', color: 'text-green-500', bg: 'bg-green-500/10' },
  inactive: { label: 'Inactive', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  banned: { label: 'Banned', color: 'text-red-500', bg: 'bg-red-500/10' },
};

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const updateUserStatus = (userId: string, newStatus: UserData['status']) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, status: newStatus } : user))
    );
    toast.success(`User status updated to ${statusConfig[newStatus].label}`);
  };

  const updateUserRole = (userId: string, newRole: UserData['role']) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, role: newRole } : user))
    );
    toast.success(`User role updated to ${roleConfig[newRole].label}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const userStats = {
    total: users.length,
    active: users.filter((u) => u.status === 'active').length,
    customers: users.filter((u) => u.role === 'user').length,
    delivery: users.filter((u) => u.role === 'delivery').length,
  };

  return (
    <div className="space-y-6">
      {/* User Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Total Users</span>
          </div>
          <p className="text-2xl font-bold">{userStats.total}</p>
        </div>
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm text-green-600">Active</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{userStats.active}</p>
        </div>
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-blue-600">Customers</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{userStats.customers}</p>
        </div>
        <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-5 h-5 text-orange-500" />
            <span className="text-sm text-orange-600">Delivery Partners</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">{userStats.delivery}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 rounded-xl"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[150px] h-12 rounded-xl">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="user">Customers</SelectItem>
            <SelectItem value="delivery">Delivery</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px] h-12 rounded-xl">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="banned">Banned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">User</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Contact</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Role</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Orders</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Health Score</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <AnimatePresence>
                {filteredUsers.map((user) => {
                  const role = roleConfig[user.role];
                  const status = statusConfig[user.status];

                  return (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-muted/50"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{user.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Joined {formatDate(user.joinedAt)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <p className="text-sm flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {user.phone}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={`${role.bg} ${role.color} border-0`}>
                          {role.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={`${status.bg} ${status.color} border-0`}>
                          {status.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {user.role === 'user' ? (
                          <div>
                            <p className="font-medium">{user.totalOrders}</p>
                            <p className="text-xs text-muted-foreground">₹{user.totalSpent.toLocaleString()}</p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {user.role === 'user' && user.healthScore > 0 ? (
                          <div className="flex items-center gap-2">
                            <TrendingUp className={`w-4 h-4 ${user.healthScore >= 80 ? 'text-green-500' : user.healthScore >= 60 ? 'text-yellow-500' : 'text-red-500'}`} />
                            <span className="font-medium">{user.healthScore}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.status === 'active' ? (
                              <DropdownMenuItem onClick={() => updateUserStatus(user.id, 'inactive')}>
                                <ShieldOff className="w-4 h-4 mr-2" />
                                Deactivate
                              </DropdownMenuItem>
                            ) : user.status === 'inactive' ? (
                              <DropdownMenuItem onClick={() => updateUserStatus(user.id, 'active')}>
                                <Shield className="w-4 h-4 mr-2" />
                                Activate
                              </DropdownMenuItem>
                            ) : null}
                            {user.status !== 'banned' && user.role !== 'admin' && (
                              <DropdownMenuItem
                                onClick={() => updateUserStatus(user.id, 'banned')}
                                className="text-destructive"
                              >
                                <Ban className="w-4 h-4 mr-2" />
                                Ban User
                              </DropdownMenuItem>
                            )}
                            {user.status === 'banned' && (
                              <DropdownMenuItem onClick={() => updateUserStatus(user.id, 'active')}>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Unban User
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <User className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No users found</p>
        </div>
      )}

      {/* User Details Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={selectedUser.avatar} />
                  <AvatarFallback className="text-xl">{selectedUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`${roleConfig[selectedUser.role].bg} ${roleConfig[selectedUser.role].color} border-0`}>
                      {roleConfig[selectedUser.role].label}
                    </Badge>
                    <Badge className={`${statusConfig[selectedUser.status].bg} ${statusConfig[selectedUser.status].color} border-0`}>
                      {statusConfig[selectedUser.status].label}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground mb-1">Email</p>
                  <p className="text-sm font-medium">{selectedUser.email}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground mb-1">Phone</p>
                  <p className="text-sm font-medium">{selectedUser.phone}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground mb-1">Joined</p>
                  <p className="text-sm font-medium">{formatDate(selectedUser.joinedAt)}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground mb-1">Address</p>
                  <p className="text-sm font-medium">{selectedUser.address}</p>
                </div>
              </div>

              {selectedUser.role === 'user' && (
                <>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-center">
                      <p className="text-2xl font-bold text-primary">{selectedUser.totalOrders}</p>
                      <p className="text-xs text-muted-foreground">Orders</p>
                    </div>
                    <div className="p-3 rounded-lg bg-green-500/10 text-center">
                      <p className="text-2xl font-bold text-green-600">₹{selectedUser.totalSpent.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Total Spent</p>
                    </div>
                    <div className="p-3 rounded-lg bg-orange-500/10 text-center">
                      <p className="text-2xl font-bold text-orange-600">{selectedUser.healthScore}</p>
                      <p className="text-xs text-muted-foreground">Health Score</p>
                    </div>
                  </div>

                  {selectedUser.dietPreferences.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Diet Preferences</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedUser.dietPreferences.map((pref) => (
                          <Badge key={pref} variant="outline">{pref}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
