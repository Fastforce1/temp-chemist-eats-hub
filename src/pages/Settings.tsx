import React, { useState } from 'react';
import {
  Bell,
  User,
  Lock,
  Globe,
  Activity,
  Database,
  ToggleLeft,
  ChevronRight,
  Smartphone,
  Scale,
} from 'lucide-react';

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: SettingsItem[];
}

interface SettingsItem {
  id: string;
  label: string;
  type: 'toggle' | 'select' | 'link' | 'button';
  value?: boolean | string;
  options?: string[];
  description?: string;
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    notifications: {
      mealReminders: true,
      supplementReminders: true,
      progressUpdates: false,
      newsletterUpdates: true,
    },
    units: {
      weight: 'lbs',
      height: 'ft/in',
      energy: 'calories',
    },
    privacy: {
      shareProgress: false,
      publicProfile: true,
    },
    devices: {
      fitbitConnected: true,
      appleHealthConnected: false,
    },
  });

  const settingsSections: SettingsSection[] = [
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <Bell className="w-5 h-5" />,
      items: [
        {
          id: 'mealReminders',
          label: 'Meal Reminders',
          type: 'toggle',
          value: settings.notifications.mealReminders,
          description: 'Get reminded to log your meals',
        },
        {
          id: 'supplementReminders',
          label: 'Supplement Reminders',
          type: 'toggle',
          value: settings.notifications.supplementReminders,
          description: 'Get reminded to take your supplements',
        },
        {
          id: 'progressUpdates',
          label: 'Progress Updates',
          type: 'toggle',
          value: settings.notifications.progressUpdates,
          description: 'Weekly progress report notifications',
        },
      ],
    },
    {
      id: 'account',
      title: 'Account',
      icon: <User className="w-5 h-5" />,
      items: [
        {
          id: 'profile',
          label: 'Profile Information',
          type: 'link',
          description: 'Update your personal information',
        },
        {
          id: 'password',
          label: 'Password',
          type: 'link',
          description: 'Change your password',
        },
        {
          id: 'email',
          label: 'Email Preferences',
          type: 'link',
          description: 'Manage email notifications',
        },
      ],
    },
    {
      id: 'privacy',
      title: 'Privacy',
      icon: <Lock className="w-5 h-5" />,
      items: [
        {
          id: 'shareProgress',
          label: 'Share Progress',
          type: 'toggle',
          value: settings.privacy.shareProgress,
          description: 'Allow sharing progress with community',
        },
        {
          id: 'publicProfile',
          label: 'Public Profile',
          type: 'toggle',
          value: settings.privacy.publicProfile,
          description: 'Make your profile visible to others',
        },
      ],
    },
    {
      id: 'units',
      title: 'Units & Measurements',
      icon: <Scale className="w-5 h-5" />,
      items: [
        {
          id: 'weight',
          label: 'Weight Unit',
          type: 'select',
          value: settings.units.weight,
          options: ['lbs', 'kg'],
          description: 'Choose your preferred weight unit',
        },
        {
          id: 'energy',
          label: 'Energy Unit',
          type: 'select',
          value: settings.units.energy,
          options: ['calories', 'kilojoules'],
          description: 'Choose your preferred energy unit',
        },
      ],
    },
    {
      id: 'devices',
      title: 'Connected Devices',
      icon: <Smartphone className="w-5 h-5" />,
      items: [
        {
          id: 'fitbit',
          label: 'Fitbit',
          type: 'toggle',
          value: settings.devices.fitbitConnected,
          description: 'Connected to Fitbit account',
        },
        {
          id: 'appleHealth',
          label: 'Apple Health',
          type: 'toggle',
          value: settings.devices.appleHealthConnected,
          description: 'Connected to Apple Health',
        },
      ],
    },
    {
      id: 'data',
      title: 'Data Management',
      icon: <Database className="w-5 h-5" />,
      items: [
        {
          id: 'export',
          label: 'Export Data',
          type: 'button',
          description: 'Download all your data',
        },
        {
          id: 'delete',
          label: 'Delete Account',
          type: 'button',
          description: 'Permanently delete your account',
        },
      ],
    },
  ];

  const handleToggle = (sectionId: string, itemId: string) => {
    setSettings(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId as keyof typeof prev],
        [itemId]: !prev[sectionId as keyof typeof prev][itemId as keyof typeof prev[keyof typeof prev]],
      },
    }));
  };

  const handleSelectChange = (sectionId: string, itemId: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId as keyof typeof prev],
        [itemId]: value,
      },
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="space-y-6">
        {settingsSections.map(section => (
          <div key={section.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-6">
                {section.icon}
                <h2 className="ml-3 text-lg font-medium text-gray-900">{section.title}</h2>
              </div>

              <div className="space-y-4">
                {section.items.map(item => (
                  <div key={item.id} className="flex items-center justify-between py-3">
                    <div className="flex-grow">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">{item.label}</span>
                      </div>
                      {item.description && (
                        <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                      )}
                    </div>

                    <div className="ml-4">
                      {item.type === 'toggle' && (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.value as boolean}
                            onChange={() => handleToggle(section.id, item.id)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      )}

                      {item.type === 'select' && (
                        <select
                          value={item.value as string}
                          onChange={(e) => handleSelectChange(section.id, item.id, e.target.value)}
                          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                          {item.options?.map(option => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      )}

                      {item.type === 'link' && (
                        <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                          Manage
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                      )}

                      {item.type === 'button' && (
                        <button
                          className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            item.id === 'delete'
                              ? 'text-red-600 hover:text-red-700'
                              : 'text-blue-600 hover:text-blue-700'
                          }`}
                        >
                          {item.label}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings; 