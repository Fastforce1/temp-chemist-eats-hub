import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import Logo from '../ui/Logo';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Logo size="medium" />
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <Bell className="h-6 w-6 text-gray-500" />
            </button>
            <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
              <User className="h-6 w-6 text-gray-500" />
              <span className="hidden md:block text-sm font-medium text-gray-700">
                Profile
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 