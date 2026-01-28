import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Plus, Trash2, Check, Shield, Smartphone, Building2 } from 'lucide-react';
import Layout from '@/components/common/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'netbanking';
  label: string;
  details: string;
  lastFour?: string;
  expiryDate?: string;
  cardType?: string;
  upiId?: string;
  bankName?: string;
  isDefault: boolean;
}

const PaymentMethods: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      label: 'Personal Card',
      details: '**** **** **** 4532',
      lastFour: '4532',
      expiryDate: '12/26',
      cardType: 'Visa',
      isDefault: true,
    },
    {
      id: '2',
      type: 'upi',
      label: 'Primary UPI',
      details: 'john.doe@paytm',
      upiId: 'john.doe@paytm',
      isDefault: false,
    },
    {
      id: '3',
      type: 'card',
      label: 'Office Card',
      details: '**** **** **** 8921',
      lastFour: '8921',
      expiryDate: '08/25',
      cardType: 'Mastercard',
      isDefault: false,
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'card' | 'upi'>('card');
  const [cardForm, setCardForm] = useState({
    label: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
  });
  const [upiForm, setUpiForm] = useState({
    label: '',
    upiId: '',
  });

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
    } else if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setCardForm(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleAddCard = () => {
    if (!cardForm.cardNumber || !cardForm.expiryDate || !cardForm.cvv || !cardForm.nameOnCard) {
      toast.error('Please fill all card details');
      return;
    }

    const lastFour = cardForm.cardNumber.replace(/\s/g, '').slice(-4);
    const cardType = cardForm.cardNumber.startsWith('4') ? 'Visa' : 'Mastercard';

    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: 'card',
      label: cardForm.label || 'Card',
      details: `**** **** **** ${lastFour}`,
      lastFour,
      expiryDate: cardForm.expiryDate,
      cardType,
      isDefault: paymentMethods.length === 0,
    };

    setPaymentMethods(prev => [...prev, newMethod]);
    setCardForm({ label: '', cardNumber: '', expiryDate: '', cvv: '', nameOnCard: '' });
    setIsDialogOpen(false);
    toast.success('Card added successfully');
  };

  const handleAddUPI = () => {
    if (!upiForm.upiId) {
      toast.error('Please enter UPI ID');
      return;
    }

    if (!upiForm.upiId.includes('@')) {
      toast.error('Invalid UPI ID format');
      return;
    }

    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: 'upi',
      label: upiForm.label || 'UPI',
      details: upiForm.upiId,
      upiId: upiForm.upiId,
      isDefault: paymentMethods.length === 0,
    };

    setPaymentMethods(prev => [...prev, newMethod]);
    setUpiForm({ label: '', upiId: '' });
    setIsDialogOpen(false);
    toast.success('UPI ID added successfully');
  };

  const handleDelete = (id: string) => {
    setPaymentMethods(prev => prev.filter(pm => pm.id !== id));
    toast.success('Payment method removed');
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(prev => prev.map(pm => ({
      ...pm,
      isDefault: pm.id === id,
    })));
    toast.success('Default payment method updated');
  };

  const getCardIcon = (cardType?: string) => {
    return CreditCard;
  };

  return (
    <Layout>
      <div className="min-h-screen py-6 md:py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Payment Methods
              </h1>
              <p className="text-muted-foreground mt-1 text-sm md:text-base">
                Manage your saved payment methods
              </p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-warm gap-2">
                  <Plus className="w-4 h-4" />
                  Add Payment Method
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-display text-xl">Add Payment Method</DialogTitle>
                </DialogHeader>
                
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'card' | 'upi')} className="mt-4">
                  <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="card" className="gap-2">
                      <CreditCard className="w-4 h-4" />
                      Card
                    </TabsTrigger>
                    <TabsTrigger value="upi" className="gap-2">
                      <Smartphone className="w-4 h-4" />
                      UPI
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="card" className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="cardLabel">Card Label (Optional)</Label>
                      <Input
                        id="cardLabel"
                        name="label"
                        value={cardForm.label}
                        onChange={(e) => setCardForm(prev => ({ ...prev, label: e.target.value }))}
                        placeholder="e.g., Personal, Business"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="nameOnCard">Name on Card *</Label>
                      <Input
                        id="nameOnCard"
                        name="nameOnCard"
                        value={cardForm.nameOnCard}
                        onChange={handleCardInputChange}
                        placeholder="John Doe"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardNumber">Card Number *</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        value={cardForm.cardNumber}
                        onChange={handleCardInputChange}
                        placeholder="1234 5678 9012 3456"
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date *</Label>
                        <Input
                          id="expiryDate"
                          name="expiryDate"
                          value={cardForm.expiryDate}
                          onChange={handleCardInputChange}
                          placeholder="MM/YY"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV *</Label>
                        <Input
                          id="cvv"
                          name="cvv"
                          type="password"
                          value={cardForm.cvv}
                          onChange={handleCardInputChange}
                          placeholder="***"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted p-3 rounded-lg">
                      <Shield className="w-4 h-4 text-success" />
                      Your card details are encrypted and securely stored
                    </div>
                    <Button onClick={handleAddCard} className="w-full btn-warm">
                      Add Card
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="upi" className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="upiLabel">UPI Label (Optional)</Label>
                      <Input
                        id="upiLabel"
                        value={upiForm.label}
                        onChange={(e) => setUpiForm(prev => ({ ...prev, label: e.target.value }))}
                        placeholder="e.g., Primary, Business"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="upiId">UPI ID *</Label>
                      <Input
                        id="upiId"
                        value={upiForm.upiId}
                        onChange={(e) => setUpiForm(prev => ({ ...prev, upiId: e.target.value }))}
                        placeholder="yourname@upi"
                        className="mt-1"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted p-3 rounded-lg">
                      <Shield className="w-4 h-4 text-success" />
                      We'll send a verification request to confirm your UPI ID
                    </div>
                    <Button onClick={handleAddUPI} className="w-full btn-warm">
                      Add UPI ID
                    </Button>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>

          {/* Cards Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Cards
            </h2>
            
            <div className="grid gap-4">
              <AnimatePresence>
                {paymentMethods.filter(pm => pm.type === 'card').map((method, index) => {
                  const CardIcon = getCardIcon(method.cardType);
                  return (
                    <motion.div
                      key={method.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 md:p-5 rounded-2xl border-2 transition-all ${
                        method.isDefault 
                          ? 'bg-sage-light border-sage' 
                          : 'bg-card border-border hover:border-primary/30'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            method.isDefault ? 'bg-sage text-sage-dark' : 'bg-muted text-muted-foreground'
                          }`}>
                            <CardIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-foreground">{method.label}</h3>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                {method.cardType}
                              </span>
                              {method.isDefault && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{method.details}</p>
                            <p className="text-xs text-muted-foreground">Expires {method.expiryDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!method.isDefault && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSetDefault(method.id)}
                              className="gap-1 text-primary"
                            >
                              <Check className="w-3 h-3" />
                              Set Default
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(method.id)}
                            className="gap-1 text-destructive hover:bg-destructive hover:text-white rounded-full"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span className="hidden sm:inline">Remove</span>
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              
              {paymentMethods.filter(pm => pm.type === 'card').length === 0 && (
                <div className="text-center py-8 bg-muted/50 rounded-2xl">
                  <CreditCard className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No cards saved yet</p>
                </div>
              )}
            </div>

            {/* UPI Section */}
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mt-8">
              <Smartphone className="w-5 h-5 text-primary" />
              UPI IDs
            </h2>
            
            <div className="grid gap-4">
              <AnimatePresence>
                {paymentMethods.filter(pm => pm.type === 'upi').map((method, index) => (
                  <motion.div
                    key={method.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 md:p-5 rounded-2xl border-2 transition-all ${
                      method.isDefault 
                        ? 'bg-sage-light border-sage' 
                        : 'bg-card border-border hover:border-primary/30'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          method.isDefault ? 'bg-sage text-sage-dark' : 'bg-muted text-muted-foreground'
                        }`}>
                          <Smartphone className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">{method.label}</h3>
                            {method.isDefault && (
                              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{method.upiId}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!method.isDefault && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSetDefault(method.id)}
                            className="gap-1 text-primary"
                          >
                            <Check className="w-3 h-3" />
                            Set Default
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(method.id)}
                          className="gap-1 text-destructive hover:bg-destructive hover:text-white rounded-full"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span className="hidden sm:inline">Remove</span>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {paymentMethods.filter(pm => pm.type === 'upi').length === 0 && (
                <div className="text-center py-8 bg-muted/50 rounded-2xl">
                  <Smartphone className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No UPI IDs saved yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentMethods;
