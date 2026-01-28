import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store,
  Star,
  Clock,
  MapPin,
  Search,
  Plus,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Phone,
  Mail,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  cuisine: string[];
  distance: string;
  isActive: boolean;
  address: string;
  phone: string;
  email: string;
  totalOrders: number;
  revenue: number;
}

const initialRestaurants: Restaurant[] = [
  {
    id: 'r1',
    name: 'Health Hub Kitchen',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500',
    rating: 4.7,
    reviewCount: 234,
    deliveryTime: '25-35 min',
    cuisine: ['Healthy', 'Salads', 'Bowls'],
    distance: '1.2 km',
    isActive: true,
    address: '123 Health Street, Wellness City',
    phone: '+91 98765 11111',
    email: 'healthhub@example.com',
    totalOrders: 1250,
    revenue: 375000,
  },
  {
    id: 'r2',
    name: 'Green Bites',
    image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=500',
    rating: 4.5,
    reviewCount: 189,
    deliveryTime: '20-30 min',
    cuisine: ['Vegetarian', 'Mediterranean'],
    distance: '0.8 km',
    isActive: true,
    address: '456 Green Avenue, Eco Town',
    phone: '+91 98765 22222',
    email: 'greenbites@example.com',
    totalOrders: 890,
    revenue: 267000,
  },
  {
    id: 'r3',
    name: 'Ocean Fresh',
    image: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=500',
    rating: 4.8,
    reviewCount: 312,
    deliveryTime: '30-40 min',
    cuisine: ['Seafood', 'Japanese', 'Poke'],
    distance: '2.1 km',
    isActive: true,
    address: '789 Coastal Road, Beach District',
    phone: '+91 98765 33333',
    email: 'oceanfresh@example.com',
    totalOrders: 1560,
    revenue: 702000,
  },
  {
    id: 'r4',
    name: 'Plant Power',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500',
    rating: 4.6,
    reviewCount: 156,
    deliveryTime: '25-35 min',
    cuisine: ['Vegan', 'Organic', 'Raw'],
    distance: '1.5 km',
    isActive: true,
    address: '321 Organic Lane, Fresh Town',
    phone: '+91 98765 44444',
    email: 'plantpower@example.com',
    totalOrders: 720,
    revenue: 201600,
  },
  {
    id: 'r5',
    name: 'Thai Spice',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=500',
    rating: 4.4,
    reviewCount: 267,
    deliveryTime: '20-30 min',
    cuisine: ['Thai', 'Asian', 'Spicy'],
    distance: '1.0 km',
    isActive: false,
    address: '555 Spice Road, Flavor City',
    phone: '+91 98765 55555',
    email: 'thaispice@example.com',
    totalOrders: 980,
    revenue: 323400,
  },
  {
    id: 'r6',
    name: 'Protein Bar',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500',
    rating: 4.3,
    reviewCount: 98,
    deliveryTime: '15-25 min',
    cuisine: ['Fitness', 'High Protein'],
    distance: '0.5 km',
    isActive: true,
    address: '777 Fitness Boulevard, Health District',
    phone: '+91 98765 66666',
    email: 'proteinbar@example.com',
    totalOrders: 450,
    revenue: 112500,
  },
];

const RestaurantManagement: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(initialRestaurants);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    deliveryTime: '',
    cuisine: '',
    distance: '',
    address: '',
    phone: '',
    email: '',
  });

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.cuisine.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const resetForm = () => {
    setFormData({
      name: '',
      image: '',
      deliveryTime: '',
      cuisine: '',
      distance: '',
      address: '',
      phone: '',
      email: '',
    });
    setEditingRestaurant(null);
  };

  const handleEdit = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setFormData({
      name: restaurant.name,
      image: restaurant.image,
      deliveryTime: restaurant.deliveryTime,
      cuisine: restaurant.cuisine.join(', '),
      distance: restaurant.distance,
      address: restaurant.address,
      phone: restaurant.phone,
      email: restaurant.email,
    });
    setIsAddDialogOpen(true);
  };

  const handleSave = () => {
    if (editingRestaurant) {
      setRestaurants((prev) =>
        prev.map((r) =>
          r.id === editingRestaurant.id
            ? {
                ...r,
                name: formData.name,
                image: formData.image || r.image,
                deliveryTime: formData.deliveryTime,
                cuisine: formData.cuisine.split(',').map((c) => c.trim()),
                distance: formData.distance,
                address: formData.address,
                phone: formData.phone,
                email: formData.email,
              }
            : r
        )
      );
      toast.success('Restaurant updated successfully!');
    } else {
      const newRestaurant: Restaurant = {
        id: `r${Date.now()}`,
        name: formData.name,
        image: formData.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500',
        rating: 0,
        reviewCount: 0,
        deliveryTime: formData.deliveryTime,
        cuisine: formData.cuisine.split(',').map((c) => c.trim()),
        distance: formData.distance,
        isActive: true,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        totalOrders: 0,
        revenue: 0,
      };
      setRestaurants((prev) => [...prev, newRestaurant]);
      toast.success('Restaurant added successfully!');
    }
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setRestaurants((prev) => prev.filter((r) => r.id !== id));
    toast.success('Restaurant deleted successfully!');
  };

  const toggleActive = (id: string) => {
    setRestaurants((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
    const restaurant = restaurants.find((r) => r.id === id);
    toast.success(`${restaurant?.name} is now ${restaurant?.isActive ? 'inactive' : 'active'}`);
  };

  const totalStats = {
    restaurants: restaurants.length,
    active: restaurants.filter((r) => r.isActive).length,
    totalOrders: restaurants.reduce((sum, r) => sum + r.totalOrders, 0),
    totalRevenue: restaurants.reduce((sum, r) => sum + r.revenue, 0),
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Store className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Total</span>
          </div>
          <p className="text-2xl font-bold">{totalStats.restaurants}</p>
        </div>
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
          <div className="flex items-center gap-2 mb-2">
            <ToggleRight className="w-5 h-5 text-green-500" />
            <span className="text-sm text-green-600">Active</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{totalStats.active}</p>
        </div>
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-blue-600">Total Orders</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{totalStats.totalOrders.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-purple-500" />
            <span className="text-sm text-purple-600">Revenue</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">₹{(totalStats.totalRevenue / 1000).toFixed(0)}K</p>
        </div>
      </div>

      {/* Search & Add */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search restaurants or cuisine..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 rounded-xl"
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} size="lg" className="h-12">
              <Plus className="w-5 h-5 mr-2" />
              Add Restaurant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingRestaurant ? 'Edit Restaurant' : 'Add New Restaurant'}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="name">Restaurant Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Restaurant name"
                />
              </div>

              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deliveryTime">Delivery Time</Label>
                  <Input
                    id="deliveryTime"
                    value={formData.deliveryTime}
                    onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                    placeholder="25-35 min"
                  />
                </div>
                <div>
                  <Label htmlFor="distance">Distance</Label>
                  <Input
                    id="distance"
                    value={formData.distance}
                    onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                    placeholder="1.5 km"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cuisine">Cuisine (comma separated)</Label>
                <Input
                  id="cuisine"
                  value={formData.cuisine}
                  onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                  placeholder="Healthy, Salads, Bowls"
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Full address"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="restaurant@example.com"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {editingRestaurant ? 'Update' : 'Add'} Restaurant
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Restaurants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredRestaurants.map((restaurant) => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`rounded-xl border overflow-hidden ${
                restaurant.isActive ? 'border-border bg-card' : 'border-muted bg-muted/50 opacity-75'
              }`}
            >
              <div className="relative">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <Badge className={restaurant.isActive ? 'bg-green-500' : 'bg-muted-foreground'}>
                    {restaurant.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-sm">{restaurant.rating}</span>
                  <span className="text-xs text-muted-foreground">({restaurant.reviewCount})</span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{restaurant.name}</h3>

                <div className="flex flex-wrap gap-1 mb-3">
                  {restaurant.cuisine.map((c) => (
                    <Badge key={c} variant="outline" className="text-xs">
                      {c}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {restaurant.deliveryTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {restaurant.distance}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4 p-2 rounded-lg bg-muted">
                  <div className="text-center">
                    <p className="text-lg font-bold text-primary">{restaurant.totalOrders}</p>
                    <p className="text-xs text-muted-foreground">Orders</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">₹{(restaurant.revenue / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={restaurant.isActive}
                      onCheckedChange={() => toggleActive(restaurant.id)}
                    />
                    <span className="text-sm text-muted-foreground">
                      {restaurant.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(restaurant)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleDelete(restaurant.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredRestaurants.length === 0 && (
        <div className="text-center py-12">
          <Store className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No restaurants found</p>
        </div>
      )}
    </div>
  );
};

export default RestaurantManagement;
