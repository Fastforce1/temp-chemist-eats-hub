import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import MainLayout from './components/layouts/MainLayout';

// Pages
import Home from './pages/Home';
import RecipeSearch from './pages/RecipeSearch';
import RecipeDetail from './pages/RecipeDetail';
import Dashboard from './pages/Dashboard';
import SavedRecipes from './pages/SavedRecipes';
import MealPlanner from './pages/MealPlanner';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import Contact from './pages/Contact';

// Auth
import ProtectedRoute from './components/auth/ProtectedRoute';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="search" element={<RecipeSearch />} />
              <Route path="recipe/:id" element={<RecipeDetail />} />
              <Route path="login" element={<Login />} />
              <Route path="contact" element={<Contact />} />
              
              {/* Protected Routes */}
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="saved"
                element={
                  <ProtectedRoute>
                    <SavedRecipes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="meal-planner"
                element={
                  <ProtectedRoute>
                    <MealPlanner />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
        <ToastContainer position="bottom-right" />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
