
import { useNavigate } from 'react-router-dom';
import { Search, BookMarked, Calendar, LineChart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: <Search className="h-8 w-8 text-emerald-500" />,
      title: 'Find Recipes',
      description: 'Search thousands of recipes with complete nutritional information.',
      action: () => navigate('/search'),
      actionText: 'Search Recipes'
    },
    {
      icon: <BookMarked className="h-8 w-8 text-emerald-500" />,
      title: 'Save Your Favorites',
      description: 'Create collections of recipes you love for quick access.',
      action: () => navigate('/saved'),
      actionText: 'View Collections'
    },
    {
      icon: <Calendar className="h-8 w-8 text-emerald-500" />,
      title: 'Plan Your Meals',
      description: 'Schedule your meals for the week and get automated shopping lists.',
      action: () => navigate('/meal-planner'),
      actionText: 'Plan Meals'
    },
    {
      icon: <LineChart className="h-8 w-8 text-emerald-500" />,
      title: 'Track Nutrition',
      description: 'Monitor your calorie intake and nutritional balance over time.',
      action: () => navigate('/dashboard'),
      actionText: 'View Dashboard'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl overflow-hidden shadow-xl">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 text-white">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Transform Your Diet with Nutritional Intelligence
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8">
              Discover recipes tailored to your dietary needs with detailed nutritional analysis.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => navigate('/search')} 
                className="bg-white text-emerald-600 font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                Find Recipes
              </button>
              {!user && (
                <button 
                  onClick={() => navigate('/login')} 
                  className="bg-transparent border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition-all duration-200"
                >
                  Sign Up Free
                </button>
              )}
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full bg-white/20 backdrop-blur-lg p-4">
              <img 
                src="https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg" 
                alt="Healthy meal" 
                className="w-full h-full object-cover rounded-full shadow-lg transform transition-transform duration-500 hover:scale-105" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Discover Our Features</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nutrition Chemist helps you make informed food choices with powerful tools for recipe discovery and nutritional analysis.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="bg-emerald-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <button 
                onClick={feature.action}
                className="text-emerald-600 font-medium flex items-center hover:text-emerald-700"
              >
                {feature.actionText}
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials/Benefits Section */}
      <section className="bg-gray-50 rounded-2xl p-8 md:p-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Nutrition Chemist?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of users who have transformed their relationship with food through nutritional knowledge.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-3">Accurate Nutrition Data</h3>
            <p className="text-gray-600">
              Powered by FatSecret's comprehensive database, ensuring you get precise nutritional information for every recipe.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-3">Personalized Recommendations</h3>
            <p className="text-gray-600">
              Receive recipe suggestions tailored to your dietary preferences, restrictions, and nutritional goals.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-3">Smart Meal Planning</h3>
            <p className="text-gray-600">
              Plan balanced meals for days or weeks with automatic nutritional balancing and shopping list generation.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Join Nutrition Chemist today and take control of your diet with the power of nutritional knowledge.
        </p>
        <button 
          onClick={() => user ? navigate('/search') : navigate('/login')}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-colors duration-200"
        >
          {user ? 'Explore Recipes' : 'Sign Up Free'}
        </button>
      </section>
    </div>
  );
};

export default Home;
