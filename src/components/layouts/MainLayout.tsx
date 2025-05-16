import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ChefHat, 
  Search, 
  BookMarked, 
  Calendar, 
  LineChart, 
  User,
  Menu,
  X,
  LogOut,
  MessageSquare,
  Pill,
  ShoppingCart,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import Logo from '../ui/Logo';

const MainLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Public navigation items
  const publicNavItems = [
    { path: '/', label: 'Home', icon: <ChefHat className="w-5 h-5" /> },
    { path: '/search', label: 'Find Recipes', icon: <Search className="w-5 h-5" /> },
    { path: '/supplements', label: 'Shop Supplements', icon: <Pill className="w-5 h-5" /> },
    { path: '/contact', label: 'Contact Us', icon: <MessageSquare className="w-5 h-5" /> },
  ];

  // Protected navigation items (only shown when logged in)
  const protectedNavItems = [
    { path: '/saved', label: 'Saved Recipes', icon: <BookMarked className="w-5 h-5" /> },
    { path: '/dashboard/meals', label: 'Meal Planner', icon: <Calendar className="w-5 h-5" /> },
    { path: '/dashboard', label: 'Nutrition Dashboard', icon: <LineChart className="w-5 h-5" /> },
    { path: '/dashboard/profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  // Combine navigation items based on authentication status
  const navItems = user ? [...publicNavItems, ...protectedNavItems] : publicNavItems;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <Logo />
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive(item.path)
                      ? 'border-emerald-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <span className="flex items-center">
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </span>
                </Link>
              ))}
              <Link
                to="/cart"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium relative ${
                  isActive('/cart')
                    ? 'border-emerald-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <ShoppingCart className="w-5 h-5 mr-1" />
                Cart
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-emerald-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {itemCount}
                  </span>
                )}
              </Link>
              {!user ? (
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
                >
                  Sign In
                </Link>
              ) : null}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-4">
              <Link
                to="/cart"
                className="relative text-gray-500 hover:text-gray-700"
              >
                <ShoppingCart className="w-6 h-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {itemCount}
                  </span>
                )}
              </Link>
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isMenuOpen ? '' : 'hidden'}`}>
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive(item.path)
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </div>
              </Link>
            ))}
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full text-left block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              >
                <div className="flex items-center">
                  <LogOut className="w-5 h-5" />
                  <span className="ml-2">Logout</span>
                </div>
              </button>
            ) : (
              <Link
                to="/login"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-emerald-600 hover:bg-gray-50 hover:border-emerald-500"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <User className="w-5 h-5" />
                  <span className="ml-2">Sign In</span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start">
              <Logo size="small" />
            </div>
            <div className="mt-6 md:mt-0">
              <p className="text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Nutrition Chemist. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
