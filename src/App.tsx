import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardLayout from './components/layout/DashboardLayout';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { CartProvider } from './contexts/CartContext';

// Lazy load other routes for better performance
const MealPlanner = React.lazy(() => import('./pages/MealPlanner'));
const Supplements = React.lazy(() => import('./pages/Supplements'));
const Progress = React.lazy(() => import('./pages/Progress'));
const DailyLog = React.lazy(() => import('./pages/DailyLog'));
const Learn = React.lazy(() => import('./pages/Learn'));
const Settings = React.lazy(() => import('./pages/Settings'));
const UserProfile = React.lazy(() => import('./pages/UserProfile'));

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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<div>Signup Page</div>} />
            
            {/* Main Layout */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="search" element={<RecipeSearch />} />
              <Route path="recipe/:id" element={<RecipeDetail />} />
              <Route path="contact" element={<Contact />} />
              <Route path="saved" element={
                <ProtectedRoute>
                  <SavedRecipes />
                </ProtectedRoute>
              } />
              
              {/* Dashboard Routes */}
              <Route path="dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="meals" element={
                  <React.Suspense fallback={<LoadingSpinner />}>
                    <MealPlanner />
                  </React.Suspense>
                } />
                <Route path="supplements" element={
                  <React.Suspense fallback={<LoadingSpinner />}>
                    <Supplements />
                  </React.Suspense>
                } />
                <Route path="progress" element={
                  <React.Suspense fallback={<LoadingSpinner />}>
                    <Progress />
                  </React.Suspense>
                } />
                <Route path="log" element={
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
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          {isClient && <ToastContainer position="bottom-right" />}
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );

  return isClient ? (
    <AnimatePresence mode="wait">{content}</AnimatePresence>
  ) : content;
};

export default App;
