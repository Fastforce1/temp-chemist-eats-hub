import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { User, Save } from 'lucide-react';

interface UserProfileData {
  name: string;
  email: string;
  dietaryPreferences: string[];
  allergies: string[];
  weightKg: number;
  heightCm: number;
  activityLevel: string;
  calorieGoal: number;
}

const UserProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [profileData, setProfileData] = useState<UserProfileData>({
    name: user?.name || '',
    email: user?.email || '',
    dietaryPreferences: [],
    allergies: [],
    weightKg: 0,
    heightCm: 0,
    activityLevel: 'moderate',
    calorieGoal: 2000,
  });

  useEffect(() => {
    // In a real app, fetch user profile data from API
    const fetchProfileData = async () => {
      try {
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        // For now, we'll use mock data
        setProfileData(prev => ({
          ...prev,
          name: user?.name || '',
          email: user?.email || '',
        }));
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
      }
    };

    fetchProfileData();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMultiSelect = (category: 'dietaryPreferences' | 'allergies', value: string) => {
    setProfileData(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const dietaryOptions = [
    'Vegetarian',
    'Vegan',
    'Pescatarian',
    'Gluten-Free',
    'Dairy-Free',
    'Keto',
    'Paleo'
  ];

  const allergyOptions = [
    'Peanuts',
    'Tree Nuts',
    'Milk',
    'Eggs',
    'Soy',
    'Fish',
    'Shellfish',
    'Wheat'
  ];

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
    { value: 'light', label: 'Light (exercise 1-3 times/week)' },
    { value: 'moderate', label: 'Moderate (exercise 3-5 times/week)' },
    { value: 'active', label: 'Active (exercise 6-7 times/week)' },
    { value: 'very_active', label: 'Very Active (intense exercise daily)' }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          disabled={isSaving}
          className={`flex items-center px-4 py-2 rounded-lg ${
            isEditing
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          {isEditing ? (
            <>
              <Save className="w-5 h-5 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </>
          ) : (
            'Edit Profile'
          )}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex items-center mb-8">
            <div className="bg-emerald-100 rounded-full p-4">
              <User className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900">{profileData.name}</h2>
              <p className="text-gray-500">{profileData.email}</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Basic Information */}
            <section>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>
            </section>

            {/* Physical Information */}
            <section>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Physical Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="weightKg"
                    value={profileData.weightKg}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    name="heightCm"
                    value={profileData.heightCm}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Daily Calorie Goal
                  </label>
                  <input
                    type="number"
                    name="calorieGoal"
                    value={profileData.calorieGoal}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>
            </section>

            {/* Activity Level */}
            <section>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Level</h3>
              <select
                name="activityLevel"
                value={profileData.activityLevel}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
              >
                {activityLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </section>

            {/* Dietary Preferences */}
            <section>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Dietary Preferences</h3>
              <div className="flex flex-wrap gap-2">
                {dietaryOptions.map(option => (
                  <button
                    key={option}
                    onClick={() => isEditing && handleMultiSelect('dietaryPreferences', option)}
                    disabled={!isEditing}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      profileData.dietaryPreferences.includes(option)
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-700'
                    } ${isEditing ? 'hover:bg-emerald-50' : ''} disabled:opacity-50`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </section>

            {/* Allergies */}
            <section>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Allergies</h3>
              <div className="flex flex-wrap gap-2">
                {allergyOptions.map(option => (
                  <button
                    key={option}
                    onClick={() => isEditing && handleMultiSelect('allergies', option)}
                    disabled={!isEditing}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      profileData.allergies.includes(option)
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-700'
                    } ${isEditing ? 'hover:bg-red-50' : ''} disabled:opacity-50`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
