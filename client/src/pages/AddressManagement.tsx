import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Edit2, Trash2, Home, Building, Briefcase, Check, X } from 'lucide-react';
import Layout from '@/components/common/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

interface Address {
  id: string;
  label: string;
  type: 'home' | 'work' | 'other';
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

const AddressManagement: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      label: 'Home',
      type: 'home',
      fullName: 'John Doe',
      phone: '+91 98765 43210',
      addressLine1: '123 Main Street, Apartment 4B',
      addressLine2: 'Near Central Park',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      isDefault: true,
    },
    {
      id: '2',
      label: 'Office',
      type: 'work',
      fullName: 'John Doe',
      phone: '+91 98765 43210',
      addressLine1: 'Tech Park, Building A, Floor 5',
      addressLine2: 'IT Corridor',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      isDefault: false,
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<Partial<Address>>({
    label: '',
    type: 'home',
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveAddress = () => {
    if (!formData.fullName || !formData.phone || !formData.addressLine1 || !formData.city || !formData.pincode) {
      toast.error('Please fill all required fields');
      return;
    }

    if (editingAddress) {
      setAddresses(prev => prev.map(addr => 
        addr.id === editingAddress.id ? { ...addr, ...formData } as Address : addr
      ));
      toast.success('Address updated successfully');
    } else {
      const newAddress: Address = {
        id: Date.now().toString(),
        ...formData as Address,
      };
      setAddresses(prev => [...prev, newAddress]);
      toast.success('Address added successfully');
    }

    resetForm();
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
    toast.success('Address deleted');
  };

  const handleSetDefault = (id: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    })));
    toast.success('Default address updated');
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setFormData(address);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingAddress(null);
    setFormData({
      label: '',
      type: 'home',
      fullName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false,
    });
    setIsDialogOpen(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'home': return Home;
      case 'work': return Building;
      default: return Briefcase;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen py-6 md:py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Saved Addresses
              </h1>
              <p className="text-muted-foreground mt-1 text-sm md:text-base">
                Manage your delivery addresses
              </p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-warm gap-2" onClick={() => resetForm()}>
                  <Plus className="w-4 h-4" />
                  Add New Address
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-display text-xl">
                    {editingAddress ? 'Edit Address' : 'Add New Address'}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4 mt-4">
                  {/* Address Type */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Address Type</Label>
                    <RadioGroup 
                      value={formData.type} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as Address['type'] }))}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="home" id="home" />
                        <Label htmlFor="home" className="flex items-center gap-1 cursor-pointer">
                          <Home className="w-4 h-4" /> Home
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="work" id="work" />
                        <Label htmlFor="work" className="flex items-center gap-1 cursor-pointer">
                          <Building className="w-4 h-4" /> Work
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other" className="flex items-center gap-1 cursor-pointer">
                          <Briefcase className="w-4 h-4" /> Other
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Label */}
                  <div>
                    <Label htmlFor="label">Address Label</Label>
                    <Input
                      id="label"
                      name="label"
                      value={formData.label}
                      onChange={handleInputChange}
                      placeholder="e.g., Home, Mom's Place"
                      className="mt-1"
                    />
                  </div>

                  {/* Full Name */}
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                      className="mt-1"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="mt-1"
                    />
                  </div>

                  {/* Address Line 1 */}
                  <div>
                    <Label htmlFor="addressLine1">Address Line 1 *</Label>
                    <Input
                      id="addressLine1"
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleInputChange}
                      placeholder="House/Flat No., Building Name"
                      className="mt-1"
                    />
                  </div>

                  {/* Address Line 2 */}
                  <div>
                    <Label htmlFor="addressLine2">Address Line 2</Label>
                    <Input
                      id="addressLine2"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleInputChange}
                      placeholder="Street, Landmark"
                      className="mt-1"
                    />
                  </div>

                  {/* City & State */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="State"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Pincode */}
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="6-digit pincode"
                      className="mt-1"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" onClick={resetForm} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleSaveAddress} className="flex-1 btn-warm">
                      {editingAddress ? 'Update Address' : 'Save Address'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Addresses List */}
          <div className="space-y-4">
            <AnimatePresence>
              {addresses.map((address, index) => {
                const TypeIcon = getTypeIcon(address.type);
                return (
                  <motion.div
                    key={address.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 md:p-6 rounded-2xl border-2 transition-all ${
                      address.isDefault 
                        ? 'bg-sage-light border-sage' 
                        : 'bg-card border-border hover:border-primary/30'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex gap-3 md:gap-4">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          address.isDefault ? 'bg-sage text-sage-dark' : 'bg-muted text-muted-foreground'
                        }`}>
                          <TypeIcon className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-foreground">
                              {address.label || address.type.charAt(0).toUpperCase() + address.type.slice(1)}
                            </h3>
                            {address.isDefault && (
                              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-foreground mt-1">{address.fullName}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {address.addressLine1}
                            {address.addressLine2 && `, ${address.addressLine2}`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">{address.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditAddress(address)}
                            className="gap-1 rounded-full"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAddress(address.id)}
                            className="gap-1 rounded-full text-destructive hover:bg-destructive hover:text-white"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span className="hidden sm:inline">Delete</span>
                          </Button>
                        </div>
                        {!address.isDefault && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSetDefault(address.id)}
                            className="gap-1 text-primary hover:text-primary"
                          >
                            <Check className="w-3 h-3" />
                            Set as Default
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {addresses.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 bg-card rounded-2xl border border-border"
              >
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No addresses saved</h3>
                <p className="text-muted-foreground mb-4">Add your first delivery address</p>
                <Button onClick={() => setIsDialogOpen(true)} className="btn-warm gap-2">
                  <Plus className="w-4 h-4" />
                  Add Address
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddressManagement;
