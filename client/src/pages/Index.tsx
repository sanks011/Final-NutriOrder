import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Search, 
  MapPin, 
  Clock, 
  Phone, 
  ChevronRight,
  Utensils,
  Salad,
  ChefHat,
  Users,
  Building,
  Sparkles,
  Leaf,
  Heart,
  Star,
  Truck,
  Shield,
  Award
} from 'lucide-react';
import Layout from '@/components/common/Layout';
import FoodCard from '@/components/food/FoodCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { foodAPI, Food } from '@/services/api';
import { mockRestaurants } from '@/data/mockData';
import PromoBanner from '@/components/home/PromoBanner';
import RecommendationsSection from '@/components/home/RecommendationsSection';

// Hero food image
const heroFoodImage = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=600&fit=crop";

// Locations data
const locations = [
  { 
    id: 'alden-bridge', 
    name: 'ALDEN BRIDGE', 
    address: '8000 Research Forest Dr Suite 340',
    city: 'The Woodlands, TX 77382',
    hours: { weekday: 'Sun-Thu 11:00am - 9:00pm', weekend: 'Fri-Sat 11:00am - 10:00pm' },
    phone: '832.585.0909'
  },
  { id: 'rayford', name: 'RAYFORD', address: '123 Rayford Rd', city: 'Spring, TX 77386', hours: { weekday: 'Sun-Thu 11:00am - 9:00pm', weekend: 'Fri-Sat 11:00am - 10:00pm' }, phone: '281.555.0101' },
  { id: 'creekside', name: 'CREEKSIDE', address: '456 Creekside Blvd', city: 'The Woodlands, TX 77389', hours: { weekday: 'Sun-Thu 11:00am - 9:00pm', weekend: 'Fri-Sat 11:00am - 10:00pm' }, phone: '281.555.0202' },
  { id: 'woodforest', name: 'WOODFOREST', address: '789 Woodforest Dr', city: 'Montgomery, TX 77316', hours: { weekday: 'Sun-Thu 11:00am - 9:00pm', weekend: 'Fri-Sat 11:00am - 10:00pm' }, phone: '936.555.0303' },
];

// Menu categories
const menuCategories = [
  { id: 'healthy-bowls', name: 'Healthy Bowls', icon: Salad },
  { id: 'build-your-own', name: 'Build Your Own', icon: ChefHat },
  { id: 'starters-salads', name: 'Starters & Salads', icon: Leaf },
  { id: 'mains', name: 'Main Courses', icon: Utensils },
  { id: 'everything-else', name: 'Everything Else', icon: Heart },
];

// Features
const features = [
  { icon: Truck, title: 'Fast Delivery', desc: '30 min or less' },
  { icon: Shield, title: 'Safe & Fresh', desc: 'Quality guaranteed' },
  { icon: Award, title: 'Top Rated', desc: '4.9★ average' },
];

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('alden-bridge');
  const [selectedMenuCategory, setSelectedMenuCategory] = useState('healthy-bowls');
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        const response = await foodAPI.getAll();
        setFoods(response.data);
      } catch (error) {
        console.error('Failed to fetch foods:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  const currentLocation = locations.find(l => l.id === selectedLocation) || locations[0];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Layout>
      {/* Hero Section - Warm Earthy Theme */}
      <section className="relative min-h-screen bg-background overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Soft gradient circles */}
          <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] rounded-full bg-sage/20 blur-3xl" />
          <div className="absolute bottom-[-150px] right-[-100px] w-[400px] h-[400px] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-peach/30 blur-3xl" />
        </div>

        {/* Floating Food Images */}
        <motion.div 
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-24 left-[8%] w-16 h-16 md:w-20 md:h-20 hidden md:block"
        >
          <img 
            src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop" 
            alt="" 
            className="w-full h-full object-cover rounded-full shadow-xl ring-4 ring-white/50" 
          />
        </motion.div>
        <motion.div 
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-40 left-[5%] w-14 h-14 md:w-16 md:h-16 hidden md:block"
        >
          <img 
            src="https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=100&h=100&fit=crop" 
            alt="" 
            className="w-full h-full object-cover rounded-full shadow-xl ring-4 ring-white/50" 
          />
        </motion.div>
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-32 right-[8%] w-12 h-12 md:w-16 md:h-16 hidden md:block"
        >
          <img 
            src="https://images.unsplash.com/photo-1551782450-17144efb9c50?w=100&h=100&fit=crop" 
            alt="" 
            className="w-full h-full object-cover rounded-full shadow-xl ring-4 ring-white/50" 
          />
        </motion.div>
        <motion.div 
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          className="absolute bottom-48 right-[10%] w-16 h-16 md:w-20 md:h-20 hidden lg:block"
        >
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=100&fit=crop" 
            alt="" 
            className="w-full h-full object-cover rounded-full shadow-xl ring-4 ring-white/50" 
          />
        </motion.div>

        <div className="container mx-auto px-4 pt-20 pb-24 relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-6rem)]">
          {/* Hero Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span className="badge-hero">
              <Sparkles className="w-4 h-4" />
              AI-Powered Nutrition
            </span>
          </motion.div>

          {/* Hero Headline */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-10"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-display font-bold text-foreground mb-6 leading-tight">
              Fresh & <span className="text-gradient-warm">Healthy</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Delicious meals crafted for your wellness journey, delivered fresh to your door
            </p>
          </motion.div>

          {/* Circular Hero Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative w-[280px] sm:w-[340px] md:w-[400px] lg:w-[460px] h-[280px] sm:h-[340px] md:h-[400px] lg:h-[460px] mx-auto"
          >
            {/* Glow Ring */}
            <div className="absolute inset-[-12px] rounded-full bg-gradient-to-br from-primary/20 via-sage/20 to-transparent blur-xl" />
            
            {/* Decorative Ring */}
            <div className="absolute inset-[-6px] rounded-full border-2 border-dashed border-sage/40 animate-[spin_40s_linear_infinite]" />
            
            {/* Main Food Image */}
            <div className="absolute inset-0 rounded-full overflow-hidden shadow-2xl bg-sage-light ring-4 ring-white">
              <img
                src={heroFoodImage}
                alt="Delicious Healthy Food"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Order Now Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute bottom-[18%] left-1/2 -translate-x-1/2"
            >
              <Button 
                onClick={() => navigate('/foods')}
                className="btn-soft px-10 py-6 text-lg rounded-full shadow-xl"
              >
                ORDER NOW
              </Button>
            </motion.div>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-12"
          >
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 px-5 py-3 rounded-full bg-white shadow-md border border-border"
              >
                <div className="w-10 h-10 rounded-full bg-sage-light flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-sage-dark" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Search Bar Section - Warm Primary */}
      <section className="bg-primary py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-3 text-primary-foreground">
              <Utensils className="w-6 h-6" />
              <span className="font-display font-bold text-lg">NUTRIORDER</span>
            </div>
            
            <div className="flex-1 flex items-center gap-2 bg-white rounded-full px-5 py-3 max-w-md mx-auto sm:mx-4 shadow-md">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="City, State or Zip"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <Button 
              onClick={() => navigate('/foods')}
              className="bg-foreground hover:bg-foreground/90 text-background font-semibold px-6 rounded-full"
            >
              ORDER ONLINE
            </Button>
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <PromoBanner />

      {/* Locations Section */}
      <section className="py-16 lg:py-24 section-sage">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl lg:text-3xl font-display font-bold text-center text-foreground mb-12"
          >
            VISIT ANY OF OUR LOCATIONS
          </motion.h2>

          {/* Location Tabs */}
          <div className="flex justify-center gap-2 mb-8 overflow-x-auto pb-4">
            {locations.map((location) => (
              <button
                key={location.id}
                onClick={() => setSelectedLocation(location.id)}
                className={`location-tab ${selectedLocation === location.id ? 'active' : ''}`}
              >
                {location.name}
              </button>
            ))}
            <button 
              onClick={() => navigate('/restaurants')}
              className="p-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Location Details */}
          <motion.div
            key={selectedLocation}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {/* Location Image */}
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop"
                alt={currentLocation.name}
                className="w-full h-64 object-cover"
              />
            </div>

            {/* Location Info */}
            <div className="warm-card p-6 space-y-4">
              <h3 className="text-xl font-display font-bold text-foreground">
                {currentLocation.name}
              </h3>
              
              <div className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 mt-0.5 text-primary" />
                <div>
                  <p>{currentLocation.address}</p>
                  <p>{currentLocation.city}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-muted-foreground">
                <Clock className="w-5 h-5 mt-0.5 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">HOURS OF OPERATION</p>
                  <p>{currentLocation.hours.weekday}</p>
                  <p>{currentLocation.hours.weekend}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <a href={`tel:${currentLocation.phone}`} className="text-primary font-semibold hover:underline">
                  {currentLocation.phone}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl lg:text-3xl font-display font-bold text-center text-foreground mb-12"
          >
            OUR MENU
          </motion.h2>

          {/* Menu Category Tabs */}
          <div className="flex justify-center gap-2 mb-12 overflow-x-auto pb-4 border-b border-border">
            {menuCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedMenuCategory(category.id)}
                  className={`menu-tab ${selectedMenuCategory === category.id ? 'active' : ''}`}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>

          {/* Menu Items Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {foods.slice(0, 4).map((food, index) => (
              <motion.div
                key={food._id || food.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <FoodCard food={food} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button 
              onClick={() => navigate('/foods')}
              variant="outline"
              className="px-8 rounded-full border-2 hover:bg-sage-light"
            >
              View Full Menu
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="py-16 lg:py-24 section-cream">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl lg:text-3xl font-display font-bold text-foreground"
              >
                Featured Items
              </motion.h2>
              <p className="text-muted-foreground mt-2">Chef's special picks for you</p>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/foods')}
              className="text-primary hover:text-primary hover:bg-primary/10"
            >
              See All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {foods.slice(0, 3).map((food, index) => (
              <motion.div
                key={food._id || food.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <FoodCard food={food} variant="featured" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Recommendations Section */}
      <RecommendationsSection />

      {/* About/Story Section */}
      <section className="py-16 lg:py-24 section-sage">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Images */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Delivery Illustration Area */}
              <div className="warm-card p-8 mb-6">
                <div className="flex items-center justify-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Truck className="w-10 h-10 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-display font-bold text-primary">30 min</p>
                    <p className="text-muted-foreground">Fast Delivery</p>
                  </div>
                </div>
              </div>

              {/* Restaurant Images */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop"
                    alt="Restaurant"
                    className="w-full h-40 lg:h-48 object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop"
                    alt="Restaurant Interior"
                    className="w-full h-40 lg:h-48 object-cover"
                  />
                </div>
              </div>
            </motion.div>

            {/* Right Side - Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-foreground">
                OUR STORY
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Born from a passion for wholesome food and mindful eating, we've been crafting 
                nutritious meals that don't compromise on taste since 2015.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Every dish is prepared with locally sourced ingredients, carefully measured 
                for your health goals. Whether you're managing diabetes, following keto, 
                or simply eating better — we've got you covered.
              </p>
              
              <div className="grid grid-cols-3 gap-4 pt-6">
                <div className="text-center">
                  <p className="text-3xl font-display font-bold text-primary">500+</p>
                  <p className="text-sm text-muted-foreground">Healthy Recipes</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-display font-bold text-primary">50K+</p>
                  <p className="text-sm text-muted-foreground">Happy Customers</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-display font-bold text-primary">4.9★</p>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                </div>
              </div>

              <Button 
                onClick={() => navigate('/about')}
                className="btn-warm mt-4"
              >
                Learn More About Us
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl lg:text-3xl font-display font-bold text-center text-foreground mb-12"
          >
            BEYOND THE MENU
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                icon: Users, 
                title: 'CATERING', 
                desc: 'Perfect for events of any size. Custom menus tailored to your dietary needs.',
                action: 'Plan Your Event'
              },
              { 
                icon: Building, 
                title: 'FRANCHISE', 
                desc: 'Join our growing family of healthy food pioneers. Be part of the movement.',
                action: 'Learn More'
              },
              { 
                icon: Heart, 
                title: 'CAREERS', 
                desc: 'Work with passionate people who care about health and great food.',
                action: 'Join Our Team'
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="feature-card group cursor-pointer"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-sage-light flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                  <feature.icon className="w-8 h-8 text-sage-dark group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-lg font-display font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{feature.desc}</p>
                <Button variant="link" className="text-primary p-0 h-auto">
                  {feature.action}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-16 lg:py-24 section-cream">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-center"
            >
              <Sparkles className="w-12 h-12 text-primary mx-auto mb-6" />
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-foreground mb-4">
                Get Personalized Recommendations
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Sign up now to receive AI-powered meal suggestions based on your health profile and dietary preferences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/register')}
                  className="btn-warm text-lg px-8 py-6"
                >
                  Create Free Account
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/login')}
                  className="text-lg px-8 py-6 rounded-full border-2"
                >
                  Sign In
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default Index;
