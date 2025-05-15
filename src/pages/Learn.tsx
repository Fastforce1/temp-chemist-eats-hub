import React, { useState } from 'react';
import { Search, BookOpen, Play, Clock, ChevronRight, Star } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  image: string;
  featured?: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
  lessons: number;
  duration: string;
  progress: number;
  image: string;
}

const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Understanding Macronutrients: A Complete Guide',
    description: 'Learn about proteins, carbohydrates, and fats - the building blocks of nutrition.',
    category: 'Nutrition Basics',
    readTime: '8 min read',
    image: '/images/macronutrients.jpg',
    featured: true,
  },
  {
    id: '2',
    title: 'The Science Behind Supplement Timing',
    description: 'Maximize the effectiveness of your supplements with proper timing.',
    category: 'Supplements',
    readTime: '6 min read',
    image: '/images/supplements.jpg',
  },
  {
    id: '3',
    title: 'Meal Prep Strategies for Busy Professionals',
    description: 'Efficient meal planning and preparation techniques for a healthy lifestyle.',
    category: 'Meal Planning',
    readTime: '10 min read',
    image: '/images/meal-prep.jpg',
  },
];

const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'Nutrition Fundamentals',
    description: 'Master the basics of nutrition and build a foundation for healthy eating.',
    lessons: 12,
    duration: '4 hours',
    progress: 25,
    image: '/images/nutrition-course.jpg',
  },
  {
    id: '2',
    title: 'Supplement Science',
    description: 'Learn how to choose and use supplements effectively.',
    lessons: 8,
    duration: '2.5 hours',
    progress: 0,
    image: '/images/supplements-course.jpg',
  },
];

const Learn: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'nutrition basics', 'supplements', 'meal planning', 'wellness'];

  const filteredArticles = MOCK_ARTICLES.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-gray-900">Learn & Grow</h1>
        <p className="text-gray-600">Expand your knowledge about nutrition, supplements, and healthy living.</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search articles and courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Article */}
      {MOCK_ARTICLES.find(article => article.featured) && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-600">Featured Article</span>
            </div>
            <h2 className="text-xl font-semibold">{MOCK_ARTICLES[0].title}</h2>
            <p className="text-gray-600">{MOCK_ARTICLES[0].description}</p>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {MOCK_ARTICLES[0].readTime}
              </span>
              <button className="text-blue-600 font-medium flex items-center hover:text-blue-700">
                Read More <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Courses Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          Learning Paths
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_COURSES.map(course => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{course.title}</h3>
                <p className="text-gray-600">{course.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{course.lessons} lessons</span>
                  <span>{course.duration}</span>
                </div>
                {course.progress > 0 ? (
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{course.progress}% complete</span>
                  </div>
                ) : (
                  <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Play className="w-4 h-4 mr-2" />
                    Start Course
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Articles Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Latest Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArticles.map(article => (
            <div key={article.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="space-y-4">
                <span className="text-sm font-medium text-blue-600">{article.category}</span>
                <h3 className="text-lg font-medium">{article.title}</h3>
                <p className="text-gray-600">{article.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {article.readTime}
                  </span>
                  <button className="text-blue-600 font-medium flex items-center hover:text-blue-700">
                    Read More <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Learn; 