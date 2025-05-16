import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
// import SupplementCard from '@/components/supplements/SupplementCard'; // Removed as unused
import { Head } from '@/components/SEO/Head';
import SEOMetadata from '@/components/SEOMetadata'; // Assuming this is the correct path
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Info, Search, ShoppingCart, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext'; // Assuming CartContext exists
import { toast } from 'react-toastify';
import OptimizedImage from '@/components/ui/OptimizedImage'; // Assuming OptimizedImage component exists

interface Supplement {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  description: string;
  ingredients: string[];
  dosage: string;
  image?: string; // Made image optional as per previous context
  rating?: number;
  stock: number;
  tags?: string[];
  benefits?: string[];
  usageInstructions?: string;
  warnings?: string[];
}

const MOCK_SUPPLEMENTS: Supplement[] = [
  {
    id: '1',
    name: 'Ultra Vitamin D3',
    brand: 'NutriBoost',
    category: 'Vitamins',
    price: 12.99,
    description: 'High-potency Vitamin D3 for immune support and bone health.',
    ingredients: ['Vitamin D3 (Cholecalciferol)', 'Microcrystalline Cellulose', 'Magnesium Stearate'],
    dosage: '1 softgel daily',
    image: '/images/supplements/vitamin_d3.jpg',
    rating: 4.8,
    stock: 150,
    tags: ['immune support', 'bone health', 'vitamin d'],
    benefits: ['Supports immune function', 'Promotes calcium absorption', 'Maintains healthy bones and teeth'],
    usageInstructions: 'Take one softgel daily with a meal, or as directed by your healthcare professional.',
    warnings: ['Do not exceed recommended dose.', 'Consult your physician if pregnant or nursing.']
  },
  {
    id: '2',
    name: 'Omega-3 Fish Oil',
    brand: 'OceanPure',
    category: 'Essential Fatty Acids',
    price: 19.99,
    description: 'Premium fish oil providing essential EPA and DHA for heart and brain health.',
    ingredients: ['Fish Oil Concentrate (EPA, DHA)', 'Gelatin', 'Glycerin', 'Purified Water'],
    dosage: '2 softgels daily',
    image: '/images/supplements/omega_3.jpg',
    rating: 4.9,
    stock: 200,
    tags: ['heart health', 'brain function', 'omega 3'],
    benefits: ['Supports cardiovascular health', 'Promotes cognitive function', 'Reduces inflammation'],
    usageInstructions: 'Take two softgels daily with food.',
    warnings: ['Consult your doctor before use if you are on blood thinning medication.']
  },
  {
    id: '3',
    name: 'Probiotic Blend',
    brand: 'GutHarmony',
    category: 'Digestive Health',
    price: 25.50,
    description: 'Multi-strain probiotic for optimal gut flora balance and digestive wellness.',
    ingredients: ['Lactobacillus acidophilus', 'Bifidobacterium lactis', 'Fructooligosaccharides (FOS)'],
    dosage: '1 capsule daily',
    image: '/images/supplements/probiotic.jpg',
    rating: 4.7,
    stock: 120,
    tags: ['digestive health', 'gut flora', 'probiotic'],
    benefits: ['Supports healthy digestion', 'Boosts immune system', 'Improves nutrient absorption'],
    usageInstructions: 'Take one capsule daily before a meal.',
  },
  // Add more mock supplements as needed
];

const fetchSupplements = async (): Promise<Supplement[]> => {
  // In a real app, fetch from an API
  // For now, simulate API call with mock data
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(MOCK_SUPPLEMENTS);
    }, 500);
  });
};


const SupplementsPage: React.FC = () => {
  const { data: supplements, isLoading, error } = useQuery({
    queryKey: ['supplements'], 
    queryFn: fetchSupplements
  });
  const { addItem, cart } = useCart ? useCart() : { addItem: () => {}, cart: [] }; // Defensive check for useCart

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');
  const [selectedSupplement, setSelectedSupplement] = useState<Supplement | null>(null);
  const [quantity, setQuantity] = useState(1);

  const categories = useMemo(() => {
    if (!supplements) return ['all'];
    const uniqueCategories = new Set(supplements.map(s => s.category));
    return ['all', ...Array.from(uniqueCategories)];
  }, [supplements]);

  const filteredAndSortedSupplements = useMemo(() => {
    if (!supplements) return [];
    let result = supplements;

    if (searchTerm) {
      result = result.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter(s => s.category === selectedCategory);
    }

    // Sorting
    const [sortKey, sortOrder] = sortBy.split('-');
    result.sort((a, b) => {
      let comparison = 0;
      if (sortKey === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortKey === 'price') {
        comparison = a.price - b.price;
      } else if (sortKey === 'rating' && a.rating && b.rating) {
        comparison = (b.rating || 0) - (a.rating || 0); // Higher rating first
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [supplements, searchTerm, selectedCategory, sortBy]);

  const handleViewDetails = (supplement: Supplement) => {
    setSelectedSupplement(supplement);
    setQuantity(1); // Reset quantity when viewing new details
  };

  const handleCloseModal = () => {
    setSelectedSupplement(null);
  };
  
  const handleAddToCart = () => {
    if (selectedSupplement && addItem) {
      addItem(selectedSupplement, quantity);
      toast.success(`${quantity} x ${selectedSupplement.name} added to cart!`);
      handleCloseModal();
    } else if (!addItem) {
      toast.error("Cart functionality is not available.");
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500"></div>
    </div>
  );

  if (error) return (
    <div className="container mx-auto px-4 py-8 text-red-600">
      <AlertCircle className="inline-block mr-2" />
      Error loading supplements: {(error as Error).message}
    </div>
  );

  const defaultOgImage = '/images/default-og.jpg'; // Define a default image URL

  return (
    <>
      <Head
        title="Supplements Store"
        description="Browse our wide range of high-quality health supplements."
        ogImage={defaultOgImage} // Use a general OG image for the main page
      />
      <SEOMetadata
        title="Supplements | ChemistEats Hub"
        description="Find and compare top-quality health supplements. Vitamins, minerals, probiotics, and more."
        keywords="supplements, vitamins, minerals, health products, nutrition"
        ogImage={defaultOgImage} // Use a general OG image
      />
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Our Supplements</h1>
          <p className="text-lg text-gray-600">Find the best products to support your health and wellness goals.</p>
        </header>

        {/* Filters and Search */}
        <div className="mb-8 p-6 bg-white shadow-lg rounded-lg grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Input
                id="search"
                type="text"
                placeholder="Search by name, brand, or tag..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger id="sort">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                <SelectItem value="rating-desc">Rating (High to Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Supplements Grid */}
        {filteredAndSortedSupplements && filteredAndSortedSupplements.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredAndSortedSupplements.map(supplement => (
              <motion.div
                key={supplement.id}
                className="bg-white shadow-xl rounded-lg overflow-hidden flex flex-col hover:shadow-2xl transition-shadow duration-300"
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {supplement.image && (
                  <div className="w-full h-56 overflow-hidden">
                     <OptimizedImage 
                        src={supplement.image} 
                        alt={supplement.name} 
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                     />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 h-14 overflow-hidden">{supplement.name}</h3>
                  <p className="text-sm text-gray-500 mb-1">{supplement.brand}</p>
                  <p className="text-2xl font-bold text-green-600 mb-3">£{supplement.price.toFixed(2)}</p>
                  <div className="flex items-center mb-3">
                    {supplement.rating && (
                      <>
                        {[...Array(Math.floor(supplement.rating))].map((_, i) => (
                          <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                        ))}
                        {supplement.rating % 1 !== 0 && (
                           <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545zM10 0v12.58L12.939 5.955 19.511 5l-4.756 4.635 1.123 6.545L10 15V0z"/></svg> /* Half star attempt */
                        )}
                        <span className="ml-2 text-sm text-gray-600">{supplement.rating.toFixed(1)}</span>
                      </>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-4 flex-grow h-16 overflow-hidden">{supplement.description.substring(0, 100)}{supplement.description.length > 100 ? '...' : ''}</p>
                  <Button onClick={() => handleViewDetails(supplement)} className="w-full mt-auto bg-green-500 hover:bg-green-600 text-white">
                    <Info className="mr-2 h-5 w-5" /> View Details
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="text-xl text-gray-600">No supplements found matching your criteria.</p>
            <p className="text-gray-500">Try adjusting your search or filters.</p>
          </div>
        )}

        {/* Modal for Supplement Details */}
        <AnimatePresence>
          {selectedSupplement && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
              onClick={handleCloseModal} // Close on backdrop click
            >
               {/* SEO for Modal Content */}
              <Head
                title={`${selectedSupplement.name} - Supplement Details`}
                description={selectedSupplement.description}
                ogImage={selectedSupplement.image || defaultOgImage} // Fallback for ogImage
                canonicalUrl={`https://yourwebsite.com/supplements/${selectedSupplement.id}`} // Example canonical
              />
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-white p-8 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
              >
                <button onClick={handleCloseModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10">
                  <X size={28} />
                </button>
                <div className="flex flex-col md:flex-row gap-6">
                  {selectedSupplement.image && (
                    <div className="md:w-1/3 w-full h-64 md:h-auto rounded-lg overflow-hidden shadow-md">
                       <OptimizedImage src={selectedSupplement.image} alt={selectedSupplement.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="md:w-2/3">
                    <h2 className="text-3xl font-bold text-gray-800 mb-3">{selectedSupplement.name}</h2>
                    <p className="text-md text-gray-500 mb-1">{selectedSupplement.brand} - <span className="text-green-600 font-semibold">{selectedSupplement.category}</span></p>
                    <p className="text-3xl font-extrabold text-green-700 mb-4">£{selectedSupplement.price.toFixed(2)}</p>
                    {selectedSupplement.rating && (
                      <div className="flex items-center mb-4">
                         {[...Array(Math.floor(selectedSupplement.rating))].map((_, i) => (
                          <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">{selectedSupplement.rating.toFixed(1)} ({selectedSupplement.stock > 0 ? `${selectedSupplement.stock} in stock` : 'Out of stock'})</span>
                      </div>
                    )}
                    <p className="text-gray-700 mb-4 leading-relaxed">{selectedSupplement.description}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {selectedSupplement.ingredients && selectedSupplement.ingredients.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-700 mb-1">Ingredients:</h4>
                      <p className="text-sm text-gray-600">{selectedSupplement.ingredients.join(', ')}</p>
                    </div>
                  )}
                  {selectedSupplement.dosage && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-700 mb-1">Dosage:</h4>
                      <p className="text-sm text-gray-600">{selectedSupplement.dosage}</p>
                    </div>
                  )}
                  {selectedSupplement.benefits && selectedSupplement.benefits.length > 0 && (
                     <div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-1">Key Benefits:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                           {selectedSupplement.benefits.map((benefit, i) => <li key={i}>{benefit}</li>)}
                        </ul>
                     </div>
                  )}
                   {selectedSupplement.usageInstructions && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-700 mb-1">How to Use:</h4>
                      <p className="text-sm text-gray-600">{selectedSupplement.usageInstructions}</p>
                    </div>
                  )}
                  {selectedSupplement.warnings && selectedSupplement.warnings.length > 0 && (
                     <div>
                        <h4 className="text-lg font-semibold text-red-600 mb-1">Warnings:</h4>
                        <ul className="list-disc list-inside text-sm text-red-500 space-y-1">
                           {selectedSupplement.warnings.map((warning, i) => <li key={i}>{warning}</li>)}
                        </ul>
                     </div>
                  )}
                </div>

                <div className="mt-8 flex items-center gap-4">
                  <div className="flex items-center border rounded-md">
                    <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg></Button>
                    <Input type="number" value={quantity} readOnly className="w-16 text-center border-l border-r rounded-none focus-visible:ring-0 focus-visible:ring-offset-0" />
                    <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></Button>
                  </div>
                  <Button 
                    onClick={handleAddToCart} 
                    size="lg" 
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    disabled={selectedSupplement.stock === 0}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" /> {selectedSupplement.stock === 0 ? 'Out of Stock' : `Add ${quantity} to Cart`}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default SupplementsPage;
