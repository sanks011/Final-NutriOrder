import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { HealthProvider } from "@/context/HealthContext";
import { LoyaltyProvider } from "@/context/LoyaltyContext";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { ReviewProvider } from "@/context/ReviewContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Preferences from "./pages/Preferences";
import ProfileWizard from "./pages/ProfileWizard";
import FoodList from "./pages/FoodList";
import FoodDetails from "./pages/FoodDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import OrderTracking from "./pages/OrderTracking";
import Invoice from "./pages/Invoice";
import Rewards from "./pages/Rewards";
import DeliveryDashboard from "./pages/DeliveryDashboard";
import AdminDashboard from "./pages/Admin/Dashboard";
import Restaurants from "./pages/Restaurants";
import RestaurantDetails from "./pages/RestaurantDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/common/ScrollToTop";
import MealPlanning from "./pages/MealPlanning";
import HealthDashboard from "./pages/HealthDashboard";
import MealSubscription from "./pages/MealSubscription";
import Wishlist from "./pages/Wishlist";
import Notifications from "./pages/Notifications";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import RefundPolicy from "./pages/RefundPolicy";
import AddressManagement from "./pages/AddressManagement";
import PaymentMethods from "./pages/PaymentMethods";
import ProfileSettings from "./pages/ProfileSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <HealthProvider>
        <CartProvider>
          <WishlistProvider>
            <LoyaltyProvider>
              <SubscriptionProvider>
                <NotificationProvider>
                  <ReviewProvider>
                    <TooltipProvider>
                      <Toaster />
                      <Sonner />
                      <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
                        <ScrollToTop />
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/auth/login" element={<Login />} />
                          <Route path="/auth/register" element={<Register />} />
                          <Route path="/foods" element={<FoodList />} />
                          <Route path="/foods/:id" element={<FoodDetails />} />
                          <Route path="/restaurants" element={<Restaurants />} />
                          <Route path="/restaurants/:id" element={<RestaurantDetails />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/terms" element={<Terms />} />
                          <Route path="/privacy" element={<Privacy />} />
                          <Route path="/refund-policy" element={<RefundPolicy />} />
                          
                          {/* Protected Routes */}
                          <Route path="/preferences" element={<ProtectedRoute><Preferences /></ProtectedRoute>} />
                          <Route path="/profile-setup" element={<ProtectedRoute><ProfileWizard /></ProtectedRoute>} />
                          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                          <Route path="/orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
                          <Route path="/orders/:id/track" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />
                          <Route path="/orders/:orderId/invoice" element={<ProtectedRoute><Invoice /></ProtectedRoute>} />
                          <Route path="/rewards" element={<ProtectedRoute><Rewards /></ProtectedRoute>} />
                          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                          <Route path="/addresses" element={<ProtectedRoute><AddressManagement /></ProtectedRoute>} />
                          <Route path="/payment-methods" element={<ProtectedRoute><PaymentMethods /></ProtectedRoute>} />
                          <Route path="/profile-settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
                          <Route path="/delivery" element={<ProtectedRoute><DeliveryDashboard /></ProtectedRoute>} />
                          <Route path="/subscription" element={<ProtectedRoute><MealSubscription /></ProtectedRoute>} />
                          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                          <Route path="/meal-planning" element={<ProtectedRoute><MealPlanning /></ProtectedRoute>} />
                          <Route path="/health-dashboard" element={<ProtectedRoute><HealthDashboard /></ProtectedRoute>} />
                          
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </BrowserRouter>
                    </TooltipProvider>
                  </ReviewProvider>
                </NotificationProvider>
              </SubscriptionProvider>
            </LoyaltyProvider>
          </WishlistProvider>
        </CartProvider>
      </HealthProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
