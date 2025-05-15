import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Utensils,
  Activity,
  Calendar,
  BookOpen,
  Settings,
  Pill
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Meal Planner', icon: Utensils, path: '/dashboard/meals' },
  { name: 'Supplements', icon: Pill, path: '/dashboard/supplements' },
  { name: 'Progress', icon: Activity, path: '/dashboard/progress' },
  { name: 'Daily Log', icon: Calendar, path: '/dashboard/log' },
  { name: 'Learn', icon: BookOpen, path: '/dashboard/learn' },
  { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)]">
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar; 