import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Package,
  Users,
  TrendingUp,
  DollarSign,
  Save,
  X,
  Leaf,
  Check,
  AlertTriangle,
  Upload,
  Link,
  Image,
  Store,
  BarChart3,
  Download,
  Boxes,
} from 'lucide-react';
import Layout from '@/components/common/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockFoods, mockOrders, mockRestaurants } from '@/data/mockData';
import { toast } from 'sonner';
import OrderManagement from '@/components/admin/OrderManagement';
import UserManagement from '@/components/admin/UserManagement';
import RestaurantManagement from '@/components/admin/RestaurantManagement';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import OrderExport from '@/components/admin/OrderExport';
import InventoryManagement from '@/components/admin/InventoryManagement';

const statsCards = [
  {
    title: 'Total Orders',
    value: '1,234',
    change: '+12.5%',
    icon: Package,
    color: 'text-primary',
  },
  {
    title: 'Active Users',
    value: '856',
    change: '+8.2%',
    icon: Users,
    color: 'text-success',
  },
  {
    title: 'Revenue',
    value: '₹2.4L',
    change: '+15.3%',
    icon: DollarSign,
    color: 'text-coral',
  },
  {
    title: 'Avg Health Score',
    value: '78',
    change: '+5.1%',
    icon: TrendingUp,
    color: 'text-purple',
  },
];

type SpiceLevel = 'mild' | 'medium' | 'hot' | 'extra-hot';

interface FoodItem {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  restaurant: { id: string; name: string };
  category: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
    cholesterol: number;
  };
  tags: string[];
  isDiabeticSafe: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isKeto: boolean;
  isHeartHealthy?: boolean;
  isLowSodium?: boolean;
  spiceLevel: SpiceLevel;
  ingredients: string[];
  rating: number;
  reviewCount: number;
  recipe?: {
    prepTime: string;
    cookTime: string;
    servings: number;
    instructions: string[];
  };
}

const AdminDashboard: React.FC = () => {
  const [foods, setFoods] = useState<FoodItem[]>(mockFoods as FoodItem[]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);
  const [imageUploadType, setImageUploadType] = useState<'url' | 'file'>('url');
  const [previewImage, setPreviewImage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    restaurantId: '',
    imageUrl: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
    sugar: '',
    sodium: '',
    cholesterol: '',
    isDiabeticSafe: false,
    isVegan: false,
    isGlutenFree: false,
    isKeto: false,
    isHeartHealthy: false,
    isLowSodium: false,
    spiceLevel: 'mild' as SpiceLevel,
    ingredients: '',
    tags: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    instructions: '',
  });

  const filteredFoods = foods.filter(
    (food) =>
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      restaurantId: '',
      imageUrl: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      fiber: '',
      sugar: '',
      sodium: '',
      cholesterol: '',
      isDiabeticSafe: false,
      isVegan: false,
      isGlutenFree: false,
      isKeto: false,
      isHeartHealthy: false,
      isLowSodium: false,
      spiceLevel: 'mild',
      ingredients: '',
      tags: '',
      prepTime: '',
      cookTime: '',
      servings: '',
      instructions: '',
    });
    setEditingFood(null);
    setPreviewImage('');
    setImageUploadType('url');
  };

  const handleEdit = (food: FoodItem) => {
    setEditingFood(food);
    setFormData({
      name: food.name,
      description: food.description,
      price: food.price.toString(),
      category: food.category,
      restaurantId: food.restaurant.id,
      imageUrl: food.image,
      calories: food.nutrition.calories.toString(),
      protein: food.nutrition.protein.toString(),
      carbs: food.nutrition.carbs.toString(),
      fat: food.nutrition.fat.toString(),
      fiber: food.nutrition.fiber.toString(),
      sugar: food.nutrition.sugar.toString(),
      sodium: food.nutrition.sodium.toString(),
      cholesterol: food.nutrition.cholesterol.toString(),
      isDiabeticSafe: food.isDiabeticSafe,
      isVegan: food.isVegan,
      isGlutenFree: food.isGlutenFree,
      isKeto: food.isKeto,
      isHeartHealthy: food.isHeartHealthy || false,
      isLowSodium: food.isLowSodium || false,
      spiceLevel: food.spiceLevel,
      ingredients: food.ingredients.join(', '),
      tags: food.tags.join(', '),
      prepTime: food.recipe?.prepTime || '',
      cookTime: food.recipe?.cookTime || '',
      servings: food.recipe?.servings.toString() || '',
      instructions: food.recipe?.instructions.join('\n') || '',
    });
    setPreviewImage(food.image);
    setIsAddDialogOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreviewImage(base64);
        setFormData({ ...formData, imageUrl: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (url: string) => {
    setFormData({ ...formData, imageUrl: url });
    setPreviewImage(url);
  };

  const handleSave = () => {
    const restaurant = mockRestaurants.find(r => r.id === formData.restaurantId) || { id: 'r1', name: 'Health Hub Kitchen' };
    
    if (editingFood) {
      setFoods((prev) =>
        prev.map((f) =>
          f.id === editingFood.id
            ? {
                ...f,
                name: formData.name,
                description: formData.description,
                image: formData.imageUrl || f.image,
                price: Number(formData.price),
                category: formData.category,
                restaurant: { id: restaurant.id, name: restaurant.name },
                nutrition: {
                  calories: Number(formData.calories),
                  protein: Number(formData.protein),
                  carbs: Number(formData.carbs),
                  fat: Number(formData.fat),
                  fiber: Number(formData.fiber) || f.nutrition.fiber,
                  sugar: Number(formData.sugar),
                  sodium: Number(formData.sodium),
                  cholesterol: Number(formData.cholesterol) || f.nutrition.cholesterol,
                },
                isDiabeticSafe: formData.isDiabeticSafe,
                isVegan: formData.isVegan,
                isGlutenFree: formData.isGlutenFree,
                isKeto: formData.isKeto,
                isHeartHealthy: formData.isHeartHealthy,
                isLowSodium: formData.isLowSodium,
                spiceLevel: formData.spiceLevel,
                ingredients: formData.ingredients.split(',').map(i => i.trim()).filter(Boolean),
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
                recipe: {
                  prepTime: formData.prepTime || '15 mins',
                  cookTime: formData.cookTime || '20 mins',
                  servings: Number(formData.servings) || 2,
                  instructions: formData.instructions.split('\n').filter(Boolean),
                },
              }
            : f
        )
      );
      toast.success('Food item updated successfully!');
    } else {
      const newFood: FoodItem = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        image: formData.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500',
        price: Number(formData.price),
        restaurant: { id: restaurant.id, name: restaurant.name },
        category: formData.category,
        nutrition: {
          calories: Number(formData.calories),
          protein: Number(formData.protein),
          carbs: Number(formData.carbs),
          fat: Number(formData.fat),
          fiber: Number(formData.fiber) || 5,
          sugar: Number(formData.sugar),
          sodium: Number(formData.sodium),
          cholesterol: Number(formData.cholesterol) || 50,
        },
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        isDiabeticSafe: formData.isDiabeticSafe,
        isVegan: formData.isVegan,
        isGlutenFree: formData.isGlutenFree,
        isKeto: formData.isKeto,
        isHeartHealthy: formData.isHeartHealthy,
        isLowSodium: formData.isLowSodium,
        spiceLevel: formData.spiceLevel,
        ingredients: formData.ingredients.split(',').map(i => i.trim()).filter(Boolean),
        rating: 4.5,
        reviewCount: 0,
        recipe: {
          prepTime: formData.prepTime || '15 mins',
          cookTime: formData.cookTime || '20 mins',
          servings: Number(formData.servings) || 2,
          instructions: formData.instructions.split('\n').filter(Boolean).length > 0 
            ? formData.instructions.split('\n').filter(Boolean) 
            : ['Recipe coming soon...'],
        },
      };
      setFoods((prev) => [...prev, newFood]);
      toast.success('Food item added successfully!');
    }
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setFoods((prev) => prev.filter((f) => f.id !== id));
    toast.success('Food item deleted successfully!');
  };

  return (
    <Layout>
      <div className="min-h-screen py-6">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your food items and orders
              </p>
            </div>
            <Badge variant="secondary" className="text-sm">
              Admin Access
            </Badge>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statsCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-border"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl ${stat.color.replace(
                      'text-',
                      'bg-'
                    )}/10 flex items-center justify-center`}
                  >
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <span className="text-sm text-success">{stat.change}</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </motion.div>
            ))}
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="foods" className="w-full">
            <TabsList className="w-full max-w-5xl grid grid-cols-7 h-12 rounded-xl bg-muted mb-6">
              <TabsTrigger value="foods" className="rounded-lg text-xs sm:text-sm">
                Food Items
              </TabsTrigger>
              <TabsTrigger value="orders" className="rounded-lg text-xs sm:text-sm">
                Orders
              </TabsTrigger>
              <TabsTrigger value="users" className="rounded-lg text-xs sm:text-sm">
                Users
              </TabsTrigger>
              <TabsTrigger value="restaurants" className="rounded-lg text-xs sm:text-sm">
                Restaurants
              </TabsTrigger>
              <TabsTrigger value="inventory" className="rounded-lg text-xs sm:text-sm">
                <Boxes className="w-4 h-4 mr-1 hidden sm:inline" />
                Inventory
              </TabsTrigger>
              <TabsTrigger value="analytics" className="rounded-lg text-xs sm:text-sm">
                <BarChart3 className="w-4 h-4 mr-1 hidden sm:inline" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="export" className="rounded-lg text-xs sm:text-sm">
                <Download className="w-4 h-4 mr-1 hidden sm:inline" />
                Export
              </TabsTrigger>
            </TabsList>

            <TabsContent value="foods">
              {/* Search & Add */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search food items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 rounded-xl"
                  />
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetForm} size="lg" className="h-12">
                      <Plus className="w-5 h-5 mr-2" />
                      Add Food Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingFood ? 'Edit Food Item' : 'Add New Food Item'}
                      </DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                      {/* Image Upload Section */}
                      <div className="space-y-3">
                        <Label className="text-base font-semibold">Food Image</Label>
                        <div className="flex gap-2 mb-3">
                          <Button
                            type="button"
                            variant={imageUploadType === 'url' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setImageUploadType('url')}
                          >
                            <Link className="w-4 h-4 mr-1" /> URL
                          </Button>
                          <Button
                            type="button"
                            variant={imageUploadType === 'file' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setImageUploadType('file')}
                          >
                            <Upload className="w-4 h-4 mr-1" /> Upload
                          </Button>
                        </div>
                        
                        {imageUploadType === 'url' ? (
                          <Input
                            placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                            value={formData.imageUrl}
                            onChange={(e) => handleUrlChange(e.target.value)}
                          />
                        ) : (
                          <div className="flex items-center gap-3">
                            <input
                              type="file"
                              ref={fileInputRef}
                              accept="image/*"
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <Image className="w-4 h-4 mr-2" />
                              Choose File
                            </Button>
                            <span className="text-sm text-muted-foreground">
                              {previewImage && imageUploadType === 'file' ? 'Image selected' : 'No file chosen'}
                            </span>
                          </div>
                        )}
                        
                        {previewImage && (
                          <div className="mt-3">
                            <img
                              src={previewImage}
                              alt="Preview"
                              className="w-32 h-32 object-cover rounded-lg border"
                              onError={() => setPreviewImage('')}
                            />
                          </div>
                        )}
                      </div>

                      {/* Basic Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            placeholder="Food name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="price">Price (₹)</Label>
                          <Input
                            id="price"
                            type="number"
                            value={formData.price}
                            onChange={(e) =>
                              setFormData({ ...formData, price: e.target.value })
                            }
                            placeholder="299"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                          }
                          placeholder="Describe the food item..."
                          rows={2}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) =>
                              setFormData({ ...formData, category: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Bowls">Bowls</SelectItem>
                              <SelectItem value="Salads">Salads</SelectItem>
                              <SelectItem value="Wraps">Wraps</SelectItem>
                              <SelectItem value="Asian">Asian</SelectItem>
                              <SelectItem value="Smoothies">Smoothies</SelectItem>
                              <SelectItem value="Pizza">Pizza</SelectItem>
                              <SelectItem value="Breakfast">Breakfast</SelectItem>
                              <SelectItem value="Soups">Soups</SelectItem>
                              <SelectItem value="Mexican">Mexican</SelectItem>
                              <SelectItem value="Italian">Italian</SelectItem>
                              <SelectItem value="Indian">Indian</SelectItem>
                              <SelectItem value="Seafood">Seafood</SelectItem>
                              <SelectItem value="Desserts">Desserts</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="restaurant">Restaurant</Label>
                          <Select
                            value={formData.restaurantId}
                            onValueChange={(value) =>
                              setFormData({ ...formData, restaurantId: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select restaurant" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockRestaurants.map((restaurant) => (
                                <SelectItem key={restaurant.id} value={restaurant.id}>
                                  {restaurant.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="spiceLevel">Spice Level</Label>
                          <Select
                            value={formData.spiceLevel}
                            onValueChange={(value: string) =>
                              setFormData({ ...formData, spiceLevel: value as SpiceLevel })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select spice level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mild">🌶️ Mild</SelectItem>
                              <SelectItem value="medium">🌶️🌶️ Medium</SelectItem>
                              <SelectItem value="hot">🌶️🌶️🌶️ Hot</SelectItem>
                              <SelectItem value="extra-hot">🔥 Extra Hot</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Ingredients & Tags */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="ingredients">Ingredients (comma separated)</Label>
                          <Input
                            id="ingredients"
                            value={formData.ingredients}
                            onChange={(e) =>
                              setFormData({ ...formData, ingredients: e.target.value })
                            }
                            placeholder="chicken, quinoa, vegetables..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="tags">Tags (comma separated)</Label>
                          <Input
                            id="tags"
                            value={formData.tags}
                            onChange={(e) =>
                              setFormData({ ...formData, tags: e.target.value })
                            }
                            placeholder="High Protein, Low Carb..."
                          />
                        </div>
                      </div>

                      {/* Nutrition */}
                      <div>
                        <Label className="text-base font-semibold mb-2 block">
                          Nutrition Information
                        </Label>
                        <div className="grid grid-cols-4 gap-3">
                          <div>
                            <Label htmlFor="calories" className="text-xs">Calories</Label>
                            <Input
                              id="calories"
                              type="number"
                              value={formData.calories}
                              onChange={(e) =>
                                setFormData({ ...formData, calories: e.target.value })
                              }
                              placeholder="420"
                            />
                          </div>
                          <div>
                            <Label htmlFor="protein" className="text-xs">Protein (g)</Label>
                            <Input
                              id="protein"
                              type="number"
                              value={formData.protein}
                              onChange={(e) =>
                                setFormData({ ...formData, protein: e.target.value })
                              }
                              placeholder="25"
                            />
                          </div>
                          <div>
                            <Label htmlFor="carbs" className="text-xs">Carbs (g)</Label>
                            <Input
                              id="carbs"
                              type="number"
                              value={formData.carbs}
                              onChange={(e) =>
                                setFormData({ ...formData, carbs: e.target.value })
                              }
                              placeholder="35"
                            />
                          </div>
                          <div>
                            <Label htmlFor="fat" className="text-xs">Fat (g)</Label>
                            <Input
                              id="fat"
                              type="number"
                              value={formData.fat}
                              onChange={(e) =>
                                setFormData({ ...formData, fat: e.target.value })
                              }
                              placeholder="12"
                            />
                          </div>
                          <div>
                            <Label htmlFor="fiber" className="text-xs">Fiber (g)</Label>
                            <Input
                              id="fiber"
                              type="number"
                              value={formData.fiber}
                              onChange={(e) =>
                                setFormData({ ...formData, fiber: e.target.value })
                              }
                              placeholder="6"
                            />
                          </div>
                          <div>
                            <Label htmlFor="sugar" className="text-xs">Sugar (g)</Label>
                            <Input
                              id="sugar"
                              type="number"
                              value={formData.sugar}
                              onChange={(e) =>
                                setFormData({ ...formData, sugar: e.target.value })
                              }
                              placeholder="5"
                            />
                          </div>
                          <div>
                            <Label htmlFor="sodium" className="text-xs">Sodium (mg)</Label>
                            <Input
                              id="sodium"
                              type="number"
                              value={formData.sodium}
                              onChange={(e) =>
                                setFormData({ ...formData, sodium: e.target.value })
                              }
                              placeholder="380"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cholesterol" className="text-xs">Cholesterol (mg)</Label>
                            <Input
                              id="cholesterol"
                              type="number"
                              value={formData.cholesterol}
                              onChange={(e) =>
                                setFormData({ ...formData, cholesterol: e.target.value })
                              }
                              placeholder="75"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Diet Tags */}
                      <div>
                        <Label className="text-base font-semibold mb-3 block">
                          Dietary Information
                        </Label>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="isDiabeticSafe"
                              checked={formData.isDiabeticSafe}
                              onCheckedChange={(checked) =>
                                setFormData({ ...formData, isDiabeticSafe: !!checked })
                              }
                            />
                            <Label htmlFor="isDiabeticSafe" className="text-sm">Diabetic Safe</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="isVegan"
                              checked={formData.isVegan}
                              onCheckedChange={(checked) =>
                                setFormData({ ...formData, isVegan: !!checked })
                              }
                            />
                            <Label htmlFor="isVegan" className="text-sm">Vegan</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="isGlutenFree"
                              checked={formData.isGlutenFree}
                              onCheckedChange={(checked) =>
                                setFormData({ ...formData, isGlutenFree: !!checked })
                              }
                            />
                            <Label htmlFor="isGlutenFree" className="text-sm">Gluten Free</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="isKeto"
                              checked={formData.isKeto}
                              onCheckedChange={(checked) =>
                                setFormData({ ...formData, isKeto: !!checked })
                              }
                            />
                            <Label htmlFor="isKeto" className="text-sm">Keto Friendly</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="isHeartHealthy"
                              checked={formData.isHeartHealthy}
                              onCheckedChange={(checked) =>
                                setFormData({ ...formData, isHeartHealthy: !!checked })
                              }
                            />
                            <Label htmlFor="isHeartHealthy" className="text-sm">Heart Healthy</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="isLowSodium"
                              checked={formData.isLowSodium}
                              onCheckedChange={(checked) =>
                                setFormData({ ...formData, isLowSodium: !!checked })
                              }
                            />
                            <Label htmlFor="isLowSodium" className="text-sm">Low Sodium</Label>
                          </div>
                        </div>
                      </div>

                      {/* Recipe */}
                      <div>
                        <Label className="text-base font-semibold mb-3 block">
                          Recipe Information
                        </Label>
                        <div className="grid grid-cols-3 gap-3 mb-3">
                          <div>
                            <Label htmlFor="prepTime" className="text-xs">Prep Time</Label>
                            <Input
                              id="prepTime"
                              value={formData.prepTime}
                              onChange={(e) =>
                                setFormData({ ...formData, prepTime: e.target.value })
                              }
                              placeholder="15 mins"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cookTime" className="text-xs">Cook Time</Label>
                            <Input
                              id="cookTime"
                              value={formData.cookTime}
                              onChange={(e) =>
                                setFormData({ ...formData, cookTime: e.target.value })
                              }
                              placeholder="25 mins"
                            />
                          </div>
                          <div>
                            <Label htmlFor="servings" className="text-xs">Servings</Label>
                            <Input
                              id="servings"
                              type="number"
                              value={formData.servings}
                              onChange={(e) =>
                                setFormData({ ...formData, servings: e.target.value })
                              }
                              placeholder="2"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="instructions" className="text-xs">Instructions (one per line)</Label>
                          <Textarea
                            id="instructions"
                            value={formData.instructions}
                            onChange={(e) =>
                              setFormData({ ...formData, instructions: e.target.value })
                            }
                            placeholder="Step 1: Prepare ingredients...&#10;Step 2: Cook the main dish...&#10;Step 3: Serve and enjoy..."
                            rows={4}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSave}>
                          <Save className="w-4 h-4 mr-2" />
                          {editingFood ? 'Update' : 'Add'} Food Item
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Food Items Table */}
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Item</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Category</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Price</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Calories</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Tags</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredFoods.map((food) => (
                      <tr key={food.id} className="hover:bg-muted/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={food.image}
                              alt={food.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium text-foreground">{food.name}</p>
                              <p className="text-xs text-muted-foreground">{food.restaurant.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{food.category}</td>
                        <td className="px-4 py-3 text-sm font-medium text-foreground">₹{food.price}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{food.nutrition.calories}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1 flex-wrap">
                            {food.isDiabeticSafe && (
                              <Badge variant="outline" className="text-xs">Diabetic Safe</Badge>
                            )}
                            {food.isVegan && (
                              <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/30">Vegan</Badge>
                            )}
                            {food.isKeto && (
                              <Badge variant="outline" className="text-xs">Keto</Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(food)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                              onClick={() => handleDelete(food.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="orders">
              <OrderManagement />
            </TabsContent>

            <TabsContent value="users">
              <UserManagement />
            </TabsContent>

            <TabsContent value="restaurants">
              <RestaurantManagement />
            </TabsContent>

            <TabsContent value="inventory">
              <InventoryManagement />
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsDashboard />
            </TabsContent>

            <TabsContent value="export">
              <OrderExport />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
