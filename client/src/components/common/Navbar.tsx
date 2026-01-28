import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, User, LogOut, Settings, Sparkles, ChefHat, Activity, Calendar, Gift, Truck, RefreshCw, Heart, Bell, MapPin, CreditCard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useLoyalty } from '@/context/LoyaltyContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { useWishlist } from '@/context/WishlistContext';
import { useNotifications } from '@/context/NotificationContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/foods', label: 'Menu' },
  { path: '/restaurants', label: 'Restaurants' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
];

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getTotalItems } = useCart();
  const { wishlist } = useWishlist();
  const { points } = useLoyalty();
  const { subscription } = useSubscription();
  const { unreadCount } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartItemCount = getTotalItems();
  const wishlistCount = wishlist.length;

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-4 left-4 right-4 z-50">
      <nav className="container mx-auto">
        {/* Main Pill Navbar */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between h-16 md:h-18 px-4 md:px-6 rounded-full bg-card/90 backdrop-blur-xl border border-border/50 shadow-lg"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 md:gap-3 group">
            <motion.div
              className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChefHat className="w-5 h-5 md:w-5 md:h-5 text-white" />
            </motion.div>
            <div className="hidden xs:flex flex-col">
              <span className="text-lg md:text-xl font-display font-bold text-foreground leading-tight">
                Nutri<span className="text-gradient-warm">Order</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Pill shaped links */}
          <div className="hidden lg:flex items-center gap-1 bg-muted/50 rounded-full p-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  location.pathname === link.path
                    ? 'text-primary-foreground bg-primary shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/80'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* AI Badge - Hidden on small screens */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hidden xl:flex ai-badge"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Powered</span>
            </motion.div>

            {/* Notifications Button - Hidden on mobile */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/notifications')}
              className="hidden sm:flex relative p-2.5 md:p-3 rounded-full bg-muted/50 hover:bg-muted transition-all duration-300"
            >
              <Bell className="w-5 h-5 text-foreground" />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-white text-xs font-bold flex items-center justify-center"
                >
                  {unreadCount}
                </motion.span>
              )}
            </motion.button>

            {/* Wishlist Button - Hidden on mobile */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/wishlist')}
              className="hidden sm:flex relative p-2.5 md:p-3 rounded-full bg-muted/50 hover:bg-muted transition-all duration-300"
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'text-primary fill-primary' : 'text-foreground'}`} />
              {wishlistCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-primary text-white text-xs font-bold flex items-center justify-center shadow-glow"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </motion.button>

            {/* Cart Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/cart')}
              className="relative p-2.5 md:p-3 rounded-full bg-muted/50 hover:bg-muted transition-all duration-300"
            >
              <ShoppingCart className="w-5 h-5 text-foreground" />
              {cartItemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-primary text-white text-xs font-bold flex items-center justify-center shadow-glow"
                >
                  {cartItemCount}
                </motion.span>
              )}
            </motion.button>

            {/* Auth Section - Desktop */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="hidden sm:flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 rounded-full bg-muted/50 hover:bg-muted transition-all duration-300"
                  >
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden md:block text-sm font-medium text-foreground">
                      {user?.name?.split(' ')[0]}
                    </span>
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 glass-card-strong border-0 mt-2">
                  <DropdownMenuItem onClick={() => navigate('/profile-settings')} className="rounded-xl">
                    <User className="w-4 h-4 mr-2 text-primary" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/rewards')} className="rounded-xl">
                    <Gift className="w-4 h-4 mr-2 text-primary" />
                    <span className="flex-1">Rewards</span>
                    <span className="text-xs font-bold text-primary">{points} pts</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/health-dashboard')} className="rounded-xl">
                    <Activity className="w-4 h-4 mr-2" />
                    Health Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/meal-planning')} className="rounded-xl">
                    <Calendar className="w-4 h-4 mr-2" />
                    Meal Planning
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/subscription')} className="rounded-xl">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    <span className="flex-1">Subscription</span>
                    {subscription && (
                      <span className="text-xs font-medium text-primary">{subscription.status}</span>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/orders')} className="rounded-xl">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    My Orders
                  </DropdownMenuItem>
                  {user?.role === 'admin' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/admin')} className="rounded-xl">
                        <Settings className="w-4 h-4 mr-2" />
                        Admin Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/delivery')} className="rounded-xl">
                        <Truck className="w-4 h-4 mr-2" />
                        Delivery Dashboard
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive rounded-xl">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => navigate('/auth/login')}
                className="hidden sm:flex rounded-full px-5 btn-soft"
                size="sm"
              >
                Get Started
              </Button>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-full bg-muted/50 hover:bg-muted transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </motion.div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden mt-3 mx-auto max-w-md"
          >
            <div className="p-4 rounded-3xl bg-card/95 backdrop-blur-xl border border-border/50 shadow-lg space-y-2">
              {/* User Profile Header - Mobile */}
              {isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-primary/10 border border-primary/20 mb-3"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{points} reward points</p>
                  </div>
                </motion.div>
              )}

              {/* Navigation Links */}
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                      location.pathname === link.path
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              
              {/* Mobile Auth Links */}
              {isAuthenticated ? (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                  className="pt-2 border-t border-border/50 space-y-2"
                >
                  <Link
                    to="/profile-settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <User className="w-4 h-4" />
                    Profile Settings
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    My Orders
                  </Link>
                  <Link
                    to="/rewards"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <Gift className="w-4 h-4" />
                    Rewards
                    <span className="ml-auto text-xs font-bold text-primary">{points} pts</span>
                  </Link>
                  <Link
                    to="/notifications"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <Bell className="w-4 h-4" />
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-auto text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{unreadCount}</span>
                    )}
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <Heart className="w-4 h-4" />
                    Wishlist
                    {wishlistCount > 0 && (
                      <span className="ml-auto text-xs font-bold text-primary">{wishlistCount}</span>
                    )}
                  </Link>
                  <Link
                    to="/health-dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <Activity className="w-4 h-4" />
                    Health Dashboard
                  </Link>
                  
                  {/* Admin Links */}
                  {user?.role === 'admin' && (
                    <>
                      <div className="border-t border-border/50 pt-2 mt-2">
                        <Link
                          to="/admin"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <Settings className="w-4 h-4" />
                          Admin Dashboard
                        </Link>
                        <Link
                          to="/delivery"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <Truck className="w-4 h-4" />
                          Delivery Dashboard
                        </Link>
                      </div>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-medium text-destructive hover:bg-destructive/10 mt-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                  className="pt-3 border-t border-border/50 space-y-2"
                >
                  <Button
                    onClick={() => {
                      navigate('/auth/login');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full rounded-2xl btn-soft"
                  >
                    Login
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigate('/auth/register');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full rounded-2xl"
                  >
                    Sign Up
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
