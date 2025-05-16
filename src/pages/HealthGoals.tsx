import { useState } from 'react';
import { Head } from '../components/SEO/Head';
import { OptimizedImage } from '../components/ui/OptimizedImage';
import { generateFAQStructuredData } from '../utils/structuredData';

interface HealthGoal {
  id: string;
  title: string;
  description: string;
  image: string;
  supplements: {
    name: string;
    description: string;
    link: string;
  }[];
}

export default function HealthGoals() {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const healthGoals: HealthGoal[] = [
    {
      id: 'immunity',
      title: 'Immune Support',
      description: 'Strengthen your immune system with our scientifically formulated supplements.',
      image: '/images/health-goals/immunity.jpg',
      supplements: [
        {
          name: 'Vitamin D3 + K2',
          description: 'Essential for immune function and bone health',
          link: '/supplements/vitamin-d3-k2'
        },
        {
          name: 'Zinc Complex',
          description: 'Supports immune system and protein synthesis',
          link: '/supplements/zinc-complex'
        }
      ]
    },
    {
      id: 'energy',
      title: 'Energy & Vitality',
      description: 'Boost your energy levels naturally with our premium supplements.',
      image: '/images/health-goals/energy.jpg',
      supplements: [
        {
          name: 'B-Complex',
          description: 'Essential B vitamins for energy metabolism',
          link: '/supplements/b-complex'
        },
        {
          name: 'Iron Plus',
          description: 'Supports energy production and oxygen transport',
          link: '/supplements/iron-plus'
        }
      ]
    },
    // Add more health goals as needed
  ];

  // Generate FAQ structured data from health goals
  const faqStructuredData = generateFAQStructuredData(
    healthGoals.map(goal => ({
      question: `What supplements are recommended for ${goal.title.toLowerCase()}?`,
      answer: `${goal.description} Recommended supplements include: ${goal.supplements.map(s => s.name).join(', ')}.`
    }))
  );

  return (
    <>
      <Head 
        title="Health Goals & Supplement Solutions"
        description="Find the right supplements for your health goals. Expert-recommended combinations for immunity, energy, sleep, and more. Backed by science, trusted by experts."
        keywords={['health goals', 'supplement recommendations', 'immune support', 'energy supplements', 'sleep support', 'wellness goals']}
        type="website"
        structuredData={faqStructuredData}
      />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Health Goals</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {healthGoals.map(goal => (
            <div 
              key={goal.id}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedGoal(goal.id === selectedGoal ? null : goal.id)}
            >
              <OptimizedImage 
                src={goal.image} 
                alt={goal.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{goal.title}</h2>
                <p className="text-gray-600 mb-4">{goal.description}</p>
                
                {selectedGoal === goal.id && (
                  <div className="mt-4 space-y-4">
                    <h3 className="font-semibold">Recommended Supplements:</h3>
                    {goal.supplements.map(supplement => (
                      <div key={supplement.name} className="border-t pt-4">
                        <a 
                          href={supplement.link}
                          className="text-primary hover:underline font-medium"
                        >
                          {supplement.name}
                        </a>
                        <p className="text-gray-600 text-sm mt-1">
                          {supplement.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
} 