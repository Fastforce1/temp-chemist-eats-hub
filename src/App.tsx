import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Elements } from '@stripe/react-stripe-js';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardLayout from './components/layout/DashboardLayout';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { CartProvider } from './contexts/CartContext';
import { stripePromise } from './utils/stripe';

// Lazy load other routes for better performance
const MealPlanner = React.lazy(() => import('./pages/MealPlanner'));
const Supplements = React.lazy(() => import('./pages/Supplements'));
const HealthGoals = React.lazy(() => import('./pages/HealthGoals'));
const Progress = React.lazy(() => import('./pages/Progress'));
const DailyLog = React.lazy(() => import('./pages/DailyLog'));
const Learn = React.lazy(() => import('./pages/Learn'));
const Settings = React.lazy(() => import('./pages/Settings'));
const UserProfile = React.lazy(() => import('./pages/UserProfile'));
const PaymentSuccess = React.lazy(() => import('./pages/payment-success'));
const PaymentCancel = React.lazy(() => import('./pages/payment-cancel'));
const CartPage = React.lazy(() => import('./pages/CartPage'));

// Layouts
import MainLayout from './components/layouts/MainLayout';

// Pages
import Home from './pages/Home';
import RecipeSearch from './pages/RecipeSearch';
import RecipeDetail from './pages/RecipeDetail';
import Dashboard from './pages/Dashboard';
import SavedRecipes from './pages/SavedRecipes';
import Login from './pages/Login';
import Contact from './pages/Contact';

// Auth
import ProtectedRoute from './components/auth/ProtectedRoute';

// Create a client
const queryClient = new QueryClient();

const App: React.FC = () => {
  const isClient = typeof window !== 'undefined';

  const content = (
    <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
            <Elements stripe={stripePromise}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<div>Signup Page</div>} />
                <Route path="/payment-success" element={
                  <React.Suspense fallback={<LoadingSpinner />}>
                    <PaymentSuccess />
                  </React.Suspense>
                } />
                <Route path="/payment-cancel" element={
                  <React.Suspense fallback={<LoadingSpinner />}>
                    <PaymentCancel />
                  </React.Suspense>
                } />
            
            {/* Main Layout */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/search" element={<RecipeSearch />} />
                  <Route path="/recipe/:id" element={<RecipeDetail />} />
                  <Route path="/supplements" element={
                    <React.Suspense fallback={<LoadingSpinner />}>
                      <Supplements />
                    </React.Suspense>
                  } />
                  <Route path="/cart" element={
                    <React.Suspense fallback={<LoadingSpinner />}>
                      <CartPage />
                    </React.Suspense>
                  } />
                  <Route path="/contact" element={<Contact />} />
              
                  {/* Protected routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="meals" element={
                  <React.Suspense fallback={<LoadingSpinner />}>
                    <MealPlanner />
                  </React.Suspense>
                } />
                      <Route path="goals" element={
                  <React.Suspense fallback={<LoadingSpinner />}>
                          <HealthGoals />
                  </React.Suspense>
                } />
                <Route path="progress" element={
                  <React.Suspense fallback={<LoadingSpinner />}>
                    <Progress />
                  </React.Suspense>
                } />
                      <Route path="daily-log" element={
                  <React.Suspense fallback={<LoadingSpinner />}>
                    <DailyLog />
                  </React.Suspense>
                } />
                <Route path="learn" element={
                  <React.Suspense fallback={<LoadingSpinner />}>
                    <Learn />
                  </React.Suspense>
                } />
                <Route path="settings" element={
                  <React.Suspense fallback={<LoadingSpinner />}>
                    <Settings />
                  </React.Suspense>
                } />
                <Route path="profile" element={
                  <React.Suspense fallback={<LoadingSpinner />}>
                    <UserProfile />
                  </React.Suspense>
                } />
                    </Route>
                    <Route path="/saved" element={<SavedRecipes />} />
              </Route>
            </Route>

                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          {isClient && <ToastContainer position="bottom-right" />}
            </Elements>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
    </HelmetProvider>
  );

  return isClient ? (
    <AnimatePresence mode="wait">{content}</AnimatePresence>
  ) : content;
};

export default App;
