
// Removed React import as it's not directly used with modern JSX transform
import { Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Elements } from '@stripe/react-stripe-js';
import ReactHelmetAsync from 'react-helmet-async'; // Corrected import
const { HelmetProvider } = ReactHelmetAsync;
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loadStripe } from '@stripe/stripe-js';

// Layouts
import MainLayout from './components/layouts/MainLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Supplements from './pages/Supplements';
import RecipeSearch from './pages/RecipeSearch';
import RecipeDetail from './pages/RecipeDetail';
import Contact from './pages/Contact';
import Learn from './pages/Learn';
import CartPage from './pages/CartPage';
import PaymentSuccessPage from './pages/payment-success';
import PaymentCancelPage from './pages/payment-cancel';

// Dashboard Pages
import Dashboard from './pages/Dashboard';
import MealPlanner from './pages/MealPlanner';
import DailyLog from './pages/DailyLog';
import Progress from './pages/Progress';
import HealthGoals from './pages/HealthGoals';
import SavedRecipes from './pages/SavedRecipes';
import UserProfile from './pages/UserProfile';
import Settings from './pages/Settings';

// Auth
import ProtectedRoute from './components/auth/ProtectedRoute';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Elements stripe={stripePromise}>
            <AnimatePresence mode="wait">
              <Routes>
                {/* Public Routes with MainLayout */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/supplements" element={<Supplements />} />
                  <Route path="/recipes" element={<RecipeSearch />} />
                  <Route path="/recipe/:id" element={<RecipeDetail />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/learn" element={<Learn />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/payment-success" element={<PaymentSuccessPage />} />
                  <Route path="/payment-cancel" element={<PaymentCancelPage />} />
                </Route>

                {/* Protected Dashboard Routes with DashboardLayout */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout><Dashboard /></DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/meals"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout><MealPlanner /></DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/log"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout><DailyLog /></DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/progress"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout><Progress /></DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/goals"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout><HealthGoals /></DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/saved-recipes"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout><SavedRecipes /></DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/profile"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout><UserProfile /></DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/settings"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout><Settings /></DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Fallback for any other route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          </Elements>
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
