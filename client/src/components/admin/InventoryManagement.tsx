import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  AlertTriangle,
  Plus,
  Search,
  Edit2,
  Trash2,
  TrendingDown,
  TrendingUp,
  Bell,
  Filter,
  ArrowUpDown,
  Check,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  costPerUnit: number;
  supplier: string;
  lastRestocked: string;
  expiryDate?: string;
  isLowStock: boolean;
  trend: 'up' | 'down' | 'stable';
}

const initialInventory: InventoryItem[] = [
  {
    id: 'inv1',
    name: 'Quinoa',
    category: 'Grains',
    currentStock: 25,
    minStock: 20,
    maxStock: 100,
    unit: 'kg',
    costPerUnit: 180,
    supplier: 'Organic Farms Ltd',
    lastRestocked: '2024-12-20',
    expiryDate: '2025-06-20',
    isLowStock: false,
    trend: 'stable',
  },
  {
    id: 'inv2',
    name: 'Chicken Breast',
    category: 'Proteins',
    currentStock: 8,
    minStock: 15,
    maxStock: 50,
    unit: 'kg',
    costPerUnit: 320,
    supplier: 'Fresh Meats Co',
    lastRestocked: '2024-12-22',
    expiryDate: '2024-12-28',
    isLowStock: true,
    trend: 'down',
  },
  {
    id: 'inv3',
    name: 'Salmon Fillet',
    category: 'Proteins',
    currentStock: 5,
    minStock: 10,
    maxStock: 30,
    unit: 'kg',
    costPerUnit: 850,
    supplier: 'Ocean Fresh Seafood',
    lastRestocked: '2024-12-23',
    expiryDate: '2024-12-27',
    isLowStock: true,
    trend: 'down',
  },
  {
    id: 'inv4',
    name: 'Avocado',
    category: 'Vegetables',
    currentStock: 45,
    minStock: 30,
    maxStock: 80,
    unit: 'pcs',
    costPerUnit: 45,
    supplier: 'Green Valley Produce',
    lastRestocked: '2024-12-24',
    expiryDate: '2024-12-30',
    isLowStock: false,
    trend: 'up',
  },
  {
    id: 'inv5',
    name: 'Spinach',
    category: 'Vegetables',
    currentStock: 12,
    minStock: 10,
    maxStock: 40,
    unit: 'kg',
    costPerUnit: 80,
    supplier: 'Green Valley Produce',
    lastRestocked: '2024-12-24',
    expiryDate: '2024-12-26',
    isLowStock: false,
    trend: 'stable',
  },
  {
    id: 'inv6',
    name: 'Greek Yogurt',
    category: 'Dairy',
    currentStock: 3,
    minStock: 15,
    maxStock: 50,
    unit: 'kg',
    costPerUnit: 220,
    supplier: 'Dairy Fresh',
    lastRestocked: '2024-12-21',
    expiryDate: '2025-01-05',
    isLowStock: true,
    trend: 'down',
  },
  {
    id: 'inv7',
    name: 'Olive Oil',
    category: 'Oils',
    currentStock: 18,
    minStock: 10,
    maxStock: 30,
    unit: 'L',
    costPerUnit: 450,
    supplier: 'Mediterranean Imports',
    lastRestocked: '2024-12-15',
    isLowStock: false,
    trend: 'stable',
  },
  {
    id: 'inv8',
    name: 'Brown Rice',
    category: 'Grains',
    currentStock: 40,
    minStock: 25,
    maxStock: 100,
    unit: 'kg',
    costPerUnit: 95,
    supplier: 'Organic Farms Ltd',
    lastRestocked: '2024-12-18',
    isLowStock: false,
    trend: 'up',
  },
];

const categories = ['All', 'Grains', 'Proteins', 'Vegetables', 'Dairy', 'Oils', 'Spices', 'Condiments'];

const InventoryManagement: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'normal'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [showAlerts, setShowAlerts] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'expiry'>('name');

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    currentStock: '',
    minStock: '',
    maxStock: '',
    unit: '',
    costPerUnit: '',
    supplier: '',
    expiryDate: '',
  });

  const lowStockItems = inventory.filter((item) => item.isLowStock);
  const totalValue = inventory.reduce((sum, item) => sum + item.currentStock * item.costPerUnit, 0);
  const expiringItems = inventory.filter((item) => {
    if (!item.expiryDate) return false;
    const daysUntilExpiry = Math.ceil(
      (new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 5 && daysUntilExpiry > 0;
  });

  const filteredInventory = inventory
    .filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
      const matchesStock = stockFilter === 'all' ||
        (stockFilter === 'low' && item.isLowStock) ||
        (stockFilter === 'normal' && !item.isLowStock);
      return matchesSearch && matchesCategory && matchesStock;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'stock') return (a.currentStock / a.maxStock) - (b.currentStock / b.maxStock);
      if (sortBy === 'expiry') {
        if (!a.expiryDate) return 1;
        if (!b.expiryDate) return -1;
        return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
      }
      return 0;
    });

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      currentStock: '',
      minStock: '',
      maxStock: '',
      unit: '',
      costPerUnit: '',
      supplier: '',
      expiryDate: '',
    });
    setEditingItem(null);
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      currentStock: item.currentStock.toString(),
      minStock: item.minStock.toString(),
      maxStock: item.maxStock.toString(),
      unit: item.unit,
      costPerUnit: item.costPerUnit.toString(),
      supplier: item.supplier,
      expiryDate: item.expiryDate || '',
    });
    setIsAddDialogOpen(true);
  };

  const handleSave = () => {
    const currentStock = Number(formData.currentStock);
    const minStock = Number(formData.minStock);
    const maxStock = Number(formData.maxStock);

    if (editingItem) {
      setInventory((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                ...formData,
                currentStock,
                minStock,
                maxStock,
                costPerUnit: Number(formData.costPerUnit),
                isLowStock: currentStock < minStock,
                trend: currentStock > item.currentStock ? 'up' : currentStock < item.currentStock ? 'down' : 'stable',
              }
            : item
        )
      );
      toast.success('Inventory item updated successfully!');
    } else {
      const newItem: InventoryItem = {
        id: `inv${Date.now()}`,
        name: formData.name,
        category: formData.category,
        currentStock,
        minStock,
        maxStock,
        unit: formData.unit,
        costPerUnit: Number(formData.costPerUnit),
        supplier: formData.supplier,
        lastRestocked: new Date().toISOString().split('T')[0],
        expiryDate: formData.expiryDate || undefined,
        isLowStock: currentStock < minStock,
        trend: 'stable',
      };
      setInventory((prev) => [...prev, newItem]);
      toast.success('Inventory item added successfully!');
    }
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setInventory((prev) => prev.filter((item) => item.id !== id));
    toast.success('Inventory item deleted!');
  };

  const handleRestock = (id: string, amount: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const newStock = Math.min(item.currentStock + amount, item.maxStock);
        return {
          ...item,
          currentStock: newStock,
          isLowStock: newStock < item.minStock,
          lastRestocked: new Date().toISOString().split('T')[0],
          trend: 'up',
        };
      })
    );
    toast.success('Stock updated!');
  };

  const getStockPercentage = (item: InventoryItem) => (item.currentStock / item.maxStock) * 100;

  const getStockColor = (item: InventoryItem) => {
    const percentage = getStockPercentage(item);
    if (percentage <= 20) return 'bg-red-500';
    if (percentage <= 40) return 'bg-orange-500';
    if (percentage <= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getDaysUntilExpiry = (date?: string) => {
    if (!date) return null;
    return Math.ceil((new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{inventory.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={lowStockItems.length > 0 ? 'border-red-500/50' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low Stock Alerts</p>
                <p className="text-2xl font-bold text-red-500">{lowStockItems.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={expiringItems.length > 0 ? 'border-orange-500/50' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
                <p className="text-2xl font-bold text-orange-500">{expiringItems.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Bell className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inventory Value</p>
                <p className="text-2xl font-bold">₹{totalValue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      <AnimatePresence>
        {showAlerts && lowStockItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="border-red-500/30 bg-red-500/5">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <CardTitle className="text-lg text-red-600">Low Stock Alerts</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowAlerts(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <CardDescription>These items need to be restocked soon</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {lowStockItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-background border border-red-500/20"
                    >
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.currentStock} / {item.minStock} {item.unit} (min)
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500/50 text-red-600 hover:bg-red-500/10"
                        onClick={() => handleRestock(item.id, item.maxStock - item.currentStock)}
                      >
                        Restock
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters & Actions */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search ingredients or suppliers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 rounded-xl"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px] h-12 rounded-xl">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={stockFilter} onValueChange={(v: 'all' | 'low' | 'normal') => setStockFilter(v)}>
            <SelectTrigger className="w-[140px] h-12 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stock</SelectItem>
              <SelectItem value="low">Low Stock</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(v: 'name' | 'stock' | 'expiry') => setSortBy(v)}>
            <SelectTrigger className="w-[140px] h-12 rounded-xl">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="stock">Stock Level</SelectItem>
              <SelectItem value="expiry">Expiry Date</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} size="lg" className="h-12">
                <Plus className="w-5 h-5 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Edit Item' : 'Add Inventory Item'}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Item Name</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Quinoa"
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(v) => setFormData({ ...formData, category: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter((c) => c !== 'All').map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Current Stock</Label>
                    <Input
                      type="number"
                      value={formData.currentStock}
                      onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Min Stock</Label>
                    <Input
                      type="number"
                      value={formData.minStock}
                      onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Max Stock</Label>
                    <Input
                      type="number"
                      value={formData.maxStock}
                      onChange={(e) => setFormData({ ...formData, maxStock: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Unit</Label>
                    <Select
                      value={formData.unit}
                      onValueChange={(v) => setFormData({ ...formData, unit: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Kilograms (kg)</SelectItem>
                        <SelectItem value="g">Grams (g)</SelectItem>
                        <SelectItem value="L">Liters (L)</SelectItem>
                        <SelectItem value="ml">Milliliters (ml)</SelectItem>
                        <SelectItem value="pcs">Pieces (pcs)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Cost per Unit (₹)</Label>
                    <Input
                      type="number"
                      value={formData.costPerUnit}
                      onChange={(e) => setFormData({ ...formData, costPerUnit: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Supplier</Label>
                  <Input
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    placeholder="Supplier name"
                  />
                </div>
                <div>
                  <Label>Expiry Date (Optional)</Label>
                  <Input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  />
                </div>
                <Button onClick={handleSave} className="w-full">
                  {editingItem ? 'Update Item' : 'Add Item'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Inventory List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredInventory.map((item, index) => {
            const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
            const stockPercentage = getStockPercentage(item);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`relative overflow-hidden ${item.isLowStock ? 'border-red-500/50' : ''}`}>
                  {item.isLowStock && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-red-500" />
                  )}
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {item.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                        {item.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                        <Badge variant={item.isLowStock ? 'destructive' : 'secondary'}>
                          {item.currentStock} {item.unit}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Stock Level</span>
                        <span>{Math.round(stockPercentage)}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${getStockColor(item)}`}
                          style={{ width: `${stockPercentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Min: {item.minStock}</span>
                        <span>Max: {item.maxStock}</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cost/Unit</span>
                        <span>₹{item.costPerUnit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Supplier</span>
                        <span className="truncate max-w-[120px]">{item.supplier}</span>
                      </div>
                      {daysUntilExpiry !== null && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Expires</span>
                          <span className={daysUntilExpiry <= 5 ? 'text-orange-500 font-medium' : ''}>
                            {daysUntilExpiry <= 0 ? 'Expired!' : `${daysUntilExpiry} days`}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleRestock(item.id, 10)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        +10
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredInventory.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium">No inventory items found</p>
          <p className="text-muted-foreground">Try adjusting your filters or add new items</p>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
