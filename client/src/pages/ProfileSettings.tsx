import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  CreditCard, 
  Settings, 
  Bell, 
  Shield,
  ChevronRight,
  Plus,
  Trash2,
  Edit2,
  Check,
  Home,
  Building2,
  Star,
  Phone,
  Mail,
  Camera,
  Lock,
  Eye,
  EyeOff,
  Heart
} from 'lucide-react';
import Layout from '@/components/common/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'upi';
  name: string;
  details: string;
  isDefault: boolean;
}

const ProfileSettings: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      type: 'home',
      name: 'John Doe',
      phone: '+1 832-585-0909',
      street: '8000 Research Forest Dr Suite 340',
      city: 'The Woodlands',
      state: 'TX',
      pincode: '77382',
      isDefault: true,
    },
  ]);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      name: 'Visa ending in 4242',
      details: '**** **** **** 4242',
      isDefault: true,
    },
  ]);

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    healthTips: false,
    weeklyDigest: true,
    sms: false,
    push: true,
  });

  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    type: 'home',
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });

  const [newPayment, setNewPayment] = useState({
    type: 'card' as 'card' | 'upi',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
  });

  const handleSaveAddress = () => {
    if (editingAddress) {
      setAddresses(addresses.map(a => a.id === editingAddress.id ? { ...editingAddress, ...newAddress } as Address : a));
    } else {
      const address: Address = {
        id: Date.now().toString(),
        type: newAddress.type || 'home',
        name: newAddress.name || '',
        phone: newAddress.phone || '',
        street: newAddress.street || '',
        city: newAddress.city || '',
        state: newAddress.state || '',
        pincode: newAddress.pincode || '',
        isDefault: addresses.length === 0,
      };
      setAddresses([...addresses, address]);
    }
    setIsAddressDialogOpen(false);
    setEditingAddress(null);
    setNewAddress({ type: 'home', name: '', phone: '', street: '', city: '', state: '', pincode: '', isDefault: false });
    toast({ title: 'Address saved!', description: 'Your address has been saved successfully.' });
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter(a => a.id !== id));
    toast({ title: 'Address deleted', description: 'The address has been removed.' });
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
    toast({ title: 'Default address updated' });
  };

  const handleSavePayment = () => {
    const method: PaymentMethod = {
      id: Date.now().toString(),
      type: newPayment.type,
      name: newPayment.type === 'card' 
        ? `Card ending in ${newPayment.cardNumber.slice(-4)}` 
        : newPayment.upiId,
      details: newPayment.type === 'card' 
        ? `**** **** **** ${newPayment.cardNumber.slice(-4)}` 
        : newPayment.upiId,
      isDefault: paymentMethods.length === 0,
    };
    setPaymentMethods([...paymentMethods, method]);
    setIsPaymentDialogOpen(false);
    setNewPayment({ type: 'card', cardNumber: '', expiryDate: '', cvv: '', upiId: '' });
    toast({ title: 'Payment method added!', description: 'Your payment method has been saved securely.' });
  };

  const handleDeletePayment = (id: string) => {
    setPaymentMethods(paymentMethods.filter(p => p.id !== id));
    toast({ title: 'Payment method removed' });
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home className="w-5 h-5" />;
      case 'work': return <Building2 className="w-5 h-5" />;
      default: return <MapPin className="w-5 h-5" />;
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <User className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-display font-bold mb-2">Sign in to access settings</h2>
            <p className="text-muted-foreground mb-6">Please login to manage your profile and preferences</p>
            <Button onClick={() => navigate('/login')} className="btn-warm">
              Sign In
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground">
              Profile Settings
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your account, addresses, payments, and preferences
            </p>
          </motion.div>

          {/* Tabs */}
          <Tabs defaultValue="account" className="space-y-6">
            <TabsList className="grid grid-cols-2 lg:grid-cols-5 gap-2 bg-transparent h-auto p-0">
              {[
                { value: 'account', icon: User, label: 'Account' },
                { value: 'addresses', icon: MapPin, label: 'Addresses' },
                { value: 'payments', icon: CreditCard, label: 'Payments' },
                { value: 'notifications', icon: Bell, label: 'Notifications' },
                { value: 'security', icon: Shield, label: 'Security' },
              ].map(tab => (
                <TabsTrigger 
                  key={tab.value}
                  value={tab.value} 
                  className="warm-card data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-3 gap-2"
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Account Tab */}
            <TabsContent value="account">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="warm-card p-6 lg:p-8"
              >
                <h2 className="text-xl font-display font-bold mb-6">Personal Information</h2>
                
                {/* Avatar */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white shadow-lg">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{user?.name || 'User'}</h3>
                    <p className="text-muted-foreground">{user?.email}</p>
                    <Button variant="link" className="text-primary p-0 h-auto mt-1">
                      Change avatar
                    </Button>
                  </div>
                </div>

                {/* Form */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input defaultValue={user?.name} className="bg-input" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" defaultValue={user?.email} className="bg-input" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input type="tel" placeholder="+1 (555) 000-0000" className="bg-input" />
                  </div>
                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input type="date" className="bg-input" />
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <Button className="btn-warm">Save Changes</Button>
                </div>
              </motion.div>

              {/* Health Preferences Link */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="warm-card p-6 mt-6 cursor-pointer hover:border-primary/30 transition-colors"
                onClick={() => navigate('/preferences')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-sage-light flex items-center justify-center">
                      <Heart className="w-6 h-6 text-sage-dark" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Health Preferences</h3>
                      <p className="text-sm text-muted-foreground">Diet type, allergies, nutrition goals</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </motion.div>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-display font-bold">Saved Addresses</h2>
                  <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="btn-warm gap-2">
                        <Plus className="w-4 h-4" />
                        Add Address
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
                        <DialogDescription>
                          {editingAddress ? 'Update your delivery address details' : 'Add a new delivery address'}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label>Address Type</Label>
                          <Select 
                            value={newAddress.type} 
                            onValueChange={(value: 'home' | 'work' | 'other') => setNewAddress({ ...newAddress, type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="home">Home</SelectItem>
                              <SelectItem value="work">Work</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input 
                              value={newAddress.name} 
                              onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })} 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Phone</Label>
                            <Input 
                              value={newAddress.phone} 
                              onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} 
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Street Address</Label>
                          <Input 
                            value={newAddress.street} 
                            onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} 
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>City</Label>
                            <Input 
                              value={newAddress.city} 
                              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>State</Label>
                            <Input 
                              value={newAddress.state} 
                              onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Pincode</Label>
                            <Input 
                              value={newAddress.pincode} 
                              onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} 
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddressDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveAddress} className="btn-warm">Save Address</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {addresses.length === 0 ? (
                  <div className="warm-card p-12 text-center">
                    <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">No addresses saved</h3>
                    <p className="text-muted-foreground mb-4">Add your first delivery address</p>
                  </div>
                ) : (
                  addresses.map((address) => (
                    <motion.div
                      key={address.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`warm-card p-5 ${address.isDefault ? 'ring-2 ring-primary/30' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            address.type === 'home' ? 'bg-primary/10 text-primary' : 
                            address.type === 'work' ? 'bg-sage text-sage-dark' : 'bg-muted text-muted-foreground'
                          }`}>
                            {getAddressIcon(address.type)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold capitalize">{address.type}</h3>
                              {address.isDefault && (
                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Default</span>
                              )}
                            </div>
                            <p className="text-sm text-foreground mt-1">{address.name}</p>
                            <p className="text-sm text-muted-foreground">{address.street}</p>
                            <p className="text-sm text-muted-foreground">{address.city}, {address.state} {address.pincode}</p>
                            <p className="text-sm text-muted-foreground mt-1">{address.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!address.isDefault && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleSetDefaultAddress(address.id)}
                              className="text-xs"
                            >
                              Set Default
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setEditingAddress(address);
                              setNewAddress(address);
                              setIsAddressDialogOpen(true);
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-display font-bold">Payment Methods</h2>
                  <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="btn-warm gap-2">
                        <Plus className="w-4 h-4" />
                        Add Payment
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Add Payment Method</DialogTitle>
                        <DialogDescription>
                          Add a new card or UPI ID
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label>Payment Type</Label>
                          <Select 
                            value={newPayment.type} 
                            onValueChange={(value: 'card' | 'upi') => setNewPayment({ ...newPayment, type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="card">Credit/Debit Card</SelectItem>
                              <SelectItem value="upi">UPI</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {newPayment.type === 'card' ? (
                          <>
                            <div className="space-y-2">
                              <Label>Card Number</Label>
                              <Input 
                                placeholder="1234 5678 9012 3456"
                                value={newPayment.cardNumber} 
                                onChange={(e) => setNewPayment({ ...newPayment, cardNumber: e.target.value })} 
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Expiry Date</Label>
                                <Input 
                                  placeholder="MM/YY"
                                  value={newPayment.expiryDate} 
                                  onChange={(e) => setNewPayment({ ...newPayment, expiryDate: e.target.value })} 
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>CVV</Label>
                                <Input 
                                  type="password"
                                  placeholder="123"
                                  maxLength={4}
                                  value={newPayment.cvv} 
                                  onChange={(e) => setNewPayment({ ...newPayment, cvv: e.target.value })} 
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="space-y-2">
                            <Label>UPI ID</Label>
                            <Input 
                              placeholder="yourname@upi"
                              value={newPayment.upiId} 
                              onChange={(e) => setNewPayment({ ...newPayment, upiId: e.target.value })} 
                            />
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSavePayment} className="btn-warm">Add Payment</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {paymentMethods.length === 0 ? (
                  <div className="warm-card p-12 text-center">
                    <CreditCard className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">No payment methods saved</h3>
                    <p className="text-muted-foreground mb-4">Add your first payment method</p>
                  </div>
                ) : (
                  paymentMethods.map((method) => (
                    <motion.div
                      key={method.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`warm-card p-5 ${method.isDefault ? 'ring-2 ring-primary/30' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            method.type === 'card' ? 'bg-primary/10 text-primary' : 'bg-sage text-sage-dark'
                          }`}>
                            <CreditCard className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{method.name}</h3>
                              {method.isDefault && (
                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Default</span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{method.details}</p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeletePayment(method.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))
                )}

                {/* Security Note */}
                <div className="flex items-center gap-3 p-4 bg-sage-light rounded-xl">
                  <Shield className="w-5 h-5 text-sage-dark" />
                  <p className="text-sm text-muted-foreground">
                    Your payment information is encrypted and stored securely
                  </p>
                </div>
              </motion.div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="warm-card p-6 lg:p-8"
              >
                <h2 className="text-xl font-display font-bold mb-6">Notification Preferences</h2>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Email Notifications</h3>
                    
                    {[
                      { key: 'orderUpdates', label: 'Order Updates', desc: 'Get notified about order status changes' },
                      { key: 'promotions', label: 'Promotions & Offers', desc: 'Receive special deals and discounts' },
                      { key: 'healthTips', label: 'Health Tips', desc: 'Personalized nutrition recommendations' },
                      { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Summary of your eating habits' },
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                        <Switch 
                          checked={notifications[item.key as keyof typeof notifications]} 
                          onCheckedChange={(checked) => setNotifications({ ...notifications, [item.key]: checked })}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Other Channels</h3>
                    
                    {[
                      { key: 'sms', label: 'SMS Notifications', desc: 'Critical order updates via text' },
                      { key: 'push', label: 'Push Notifications', desc: 'Instant updates in your browser' },
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                        <Switch 
                          checked={notifications[item.key as keyof typeof notifications]} 
                          onCheckedChange={(checked) => setNotifications({ ...notifications, [item.key]: checked })}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <Button className="btn-warm">Save Preferences</Button>
                </div>
              </motion.div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="warm-card p-6 lg:p-8">
                  <h2 className="text-xl font-display font-bold mb-6">Change Password</h2>
                  
                  <div className="space-y-4 max-w-md">
                    <div className="space-y-2">
                      <Label>Current Password</Label>
                      <div className="relative">
                        <Input 
                          type={showPassword ? 'text' : 'password'} 
                          placeholder="Enter current password"
                          className="pr-10"
                        />
                        <button 
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>New Password</Label>
                      <Input type="password" placeholder="Enter new password" />
                    </div>
                    <div className="space-y-2">
                      <Label>Confirm New Password</Label>
                      <Input type="password" placeholder="Confirm new password" />
                    </div>
                    <Button className="btn-warm">Update Password</Button>
                  </div>
                </div>

                <div className="warm-card p-6">
                  <h2 className="text-xl font-display font-bold mb-4">Two-Factor Authentication</h2>
                  <p className="text-muted-foreground mb-4">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline" className="gap-2">
                    <Lock className="w-4 h-4" />
                    Enable 2FA
                  </Button>
                </div>

                <div className="warm-card p-6 border-destructive/30">
                  <h2 className="text-xl font-display font-bold mb-4 text-destructive">Danger Zone</h2>
                  <p className="text-muted-foreground mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ProfileSettings;
