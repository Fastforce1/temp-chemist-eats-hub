import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Head } from "../components/SEO/Head"; // Corrected path
import SEOMetadata from "../components/SEOMetadata"; // Corrected path
import { Input } from "../components/ui/input"; // Corrected path
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"; // Corrected path
import { Button } from "../components/ui/button"; // Corrected path
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Info, Search, ShoppingCart, X, Plus, Minus } from "lucide-react";
import { useCart } from "../contexts/CartContext"; // Corrected path
import { toast } from "react-toastify";
import { OptimizedImage } from "../components/ui/OptimizedImage"; // Corrected path and named import
import type { Supplement } from '../types'; // Assuming Supplement type is here

// Mock data for supplements
const MOCK_SUPPLEMENTS: Supplement[] = [
  {
    id: "1",
    name: "Vitamin D3 5000 IU",
    brand: "Pure Encapsulations",
    category: "vitamins",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Vitamin D3 (cholecalciferol) is the most bioavailable form of vitamin D, essential for bone health and immune function.",
    rating: 4.8,
    benefits: ["Supports bone health", "Enhances immune function", "Promotes calcium absorption"],
    ingredients: ["Vitamin D3 (cholecalciferol)", "Hypoallergenic plant fiber", "Vegetarian capsule"],
    dosage: "1 capsule daily with a meal",
    usageInstructions: "Take 1 capsule daily with a meal or as directed by a healthcare professional.",
    warnings: ["Consult your doctor if pregnant or nursing", "Keep out of reach of children"],
    tags: ["vitamin d", "immune support", "bone health"]
  },
  {
    id: "2",
    name: "Omega-3 Fish Oil",
    brand: "Nordic Naturals",
    category: "fatty acids",
    price: 29.95,
    image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "High-quality fish oil providing EPA and DHA omega-3 fatty acids for heart, brain, and joint health.",
    rating: 4.7,
    benefits: ["Supports cardiovascular health", "Promotes brain function", "Reduces inflammation"],
    ingredients: ["Fish oil concentrate", "Gelatin", "Glycerin", "Purified water"],
    dosage: "2 soft gels daily with food",
    usageInstructions: "Take 2 soft gels daily with food or as directed by your healthcare professional.",
    warnings: ["Contains fish derivatives", "Consult your doctor if on blood thinners"],
    tags: ["omega-3", "fish oil", "heart health", "brain health"]
  },
  {
    id: "3",
    name: "Magnesium Glycinate",
    brand: "Thorne Research",
    category: "minerals",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Highly absorbable magnesium chelate for optimal muscle and nervous system support.",
    rating: 4.6,
    benefits: ["Supports muscle relaxation", "Promotes sleep quality", "Aids in stress management"],
    ingredients: ["Magnesium (as magnesium glycinate)", "Vegetarian capsule"],
    dosage: "1-3 capsules daily with meals",
    usageInstructions: "Take 1-3 capsules daily with meals or as recommended by your healthcare professional.",
    warnings: ["May cause loose stools at high doses", "Consult your doctor if you have kidney disease"],
    tags: ["magnesium", "sleep support", "muscle relaxation"]
  },
  {
    id: "4",
    name: "Probiotics 50 Billion CFU",
    brand: "Garden of Life",
    category: "digestive health",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "High-potency, multi-strain probiotic formula to support digestive health and immune function.",
    rating: 4.5,
    benefits: ["Supports digestive balance", "Enhances immune function", "Promotes nutrient absorption"],
    ingredients: ["50 billion CFU probiotic blend", "Organic prebiotic fiber", "Vegetarian capsule"],
    dosage: "1 capsule daily",
    usageInstructions: "Take 1 capsule daily with or without food. May be taken on an empty stomach.",
    warnings: ["Keep refrigerated", "Consult your doctor if you have SIBO or immunocompromised"],
    tags: ["probiotics", "gut health", "immune support", "digestive health"]
  },
  {
    id: "5",
    name: "Ashwagandha KSM-66",
    brand: "Jarrow Formulas",
    category: "adaptogens",
    price: 21.95,
    image: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Premium ashwagandha root extract to help the body adapt to stress and support overall wellbeing.",
    rating: 4.7,
    benefits: ["Reduces stress and anxiety", "Supports adrenal function", "Enhances recovery from exercise"],
    ingredients: ["KSM-66 Ashwagandha extract", "Organic rice flour", "Vegetarian capsule"],
    dosage: "1 capsule 1-2 times daily",
    usageInstructions: "Take 1 capsule 1-2 times daily with food or as directed by your healthcare professional.",
    warnings: ["Not recommended during pregnancy", "May interact with thyroid medication", "May cause drowsiness"],
    tags: ["ashwagandha", "stress relief", "adaptogen"]
  },
  {
    id: "6",
    name: "Zinc Picolinate",
    brand: "Thorne Research",
    category: "minerals",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Highly absorbable form of zinc to support immune function, skin health, and testosterone production.",
    rating: 4.6,
    benefits: ["Supports immune system", "Promotes skin health", "Aids in protein synthesis"],
    ingredients: ["Zinc (as zinc picolinate)", "Microcrystalline cellulose", "Vegetarian capsule"],
    dosage: "1 capsule daily with a meal",
    usageInstructions: "Take 1 capsule daily with a meal containing fat for optimal absorption.",
    warnings: ["Long-term use may require copper supplementation", "May interfere with certain antibiotics"],
    tags: ["zinc", "immune support", "skin health"]
  },
  {
    id: "7",
    name: "Curcumin with Bioperine",
    brand: "Doctor's Best",
    category: "antioxidants",
    price: 25.99,
    image: "https://images.unsplash.com/photo-1615485500704-8e990f9027d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Standardized curcumin extract with black pepper for enhanced absorption and anti-inflammatory support.",
    rating: 4.8,
    benefits: ["Reduces inflammation", "Supports joint health", "Provides antioxidant protection"],
    ingredients: ["Curcumin C3 Complex", "BioPerine (black pepper extract)", "Vegetarian capsule"],
    dosage: "1 capsule 2-3 times daily",
    usageInstructions: "Take 1 capsule 2-3 times daily with meals or as recommended by your healthcare professional.",
    warnings: ["May interact with blood thinners", "Discontinue use before surgery", "May cause GI discomfort in sensitive individuals"],
    tags: ["curcumin", "turmeric", "anti-inflammatory", "joint health"]
  },
  {
    id: "8",
    name: "Vitamin B Complex",
    brand: "Pure Encapsulations",
    category: "vitamins",
    price: 27.50,
    image: "https://images.unsplash.com/photo-1577460551100-d94f9ce26a37?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Comprehensive B vitamin formula to support energy production, cognitive function, and nervous system health.",
    rating: 4.7,
    benefits: ["Supports energy metabolism", "Promotes cognitive function", "Maintains nervous system health"],
    ingredients: ["Vitamin B1, B2, B3, B5, B6, B7, B9, B12", "Hypoallergenic plant fiber", "Vegetarian capsule"],
    dosage: "1 capsule daily with a meal",
    usageInstructions: "Take 1 capsule daily with a meal or as directed by your healthcare professional.",
    warnings: ["High doses may cause flushing", "May color urine bright yellow", "Consult your doctor if pregnant"],
    tags: ["b vitamins", "energy", "cognitive function"]
  },
  {
    id: "9",
    name: "L-Theanine 200mg",
    brand: "NOW Foods",
    category: "amino acids",
    price: 18.99,
    image: "https://images.unsplash.com/photo-1564149504298-00c351fd7f16?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Amino acid found in green tea that promotes relaxation without drowsiness and supports cognitive function.",
    rating: 4.6,
    benefits: ["Promotes relaxation", "Enhances focus", "Supports stress management"],
    ingredients: ["L-Theanine", "Cellulose", "Vegetarian capsule"],
    dosage: "1 capsule 1-2 times daily",
    usageInstructions: "Take 1 capsule 1-2 times daily, preferably on an empty stomach or as directed by your healthcare professional.",
    warnings: ["May lower blood pressure", "May enhance effects of caffeine"],
    tags: ["l-theanine", "relaxation", "focus", "stress relief"]
  },
  {
    id: "10",
    name: "Collagen Peptides",
    brand: "Vital Proteins",
    category: "protein",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Grass-fed, pasture-raised bovine collagen peptides to support skin, hair, nails, joints, and gut health.",
    rating: 4.9,
    benefits: ["Supports skin elasticity", "Promotes joint health", "Enhances hair and nail growth"],
    ingredients: ["Bovine collagen peptides"],
    dosage: "1-2 scoops daily",
    usageInstructions: "Mix 1-2 scoops with 8 oz of hot or cold liquid. Can be added to coffee, smoothies, or recipes.",
    warnings: ["Not suitable for vegetarians/vegans", "Contains bovine products"],
    tags: ["collagen", "skin health", "joint support", "hair and nails"]
  },
  {
    id: "11",
    name: "CoQ10 200mg",
    brand: "Qunol",
    category: "antioxidants",
    price: 32.99,
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Water and fat-soluble CoQ10 for enhanced absorption to support heart health and energy production.",
    rating: 4.7,
    benefits: ["Supports heart health", "Enhances cellular energy", "Provides antioxidant protection"],
    ingredients: ["Coenzyme Q10 (ubiquinone)", "Medium chain triglycerides", "Softgel capsule"],
    dosage: "1 softgel daily with food",
    usageInstructions: "Take 1 softgel daily with a meal containing fat for optimal absorption.",
    warnings: ["May interact with blood thinners", "Consult your doctor if you have heart disease or are on medication"],
    tags: ["coq10", "heart health", "energy", "antioxidant"]
  },
  {
    id: "12",
    name: "Iron Bisglycinate",
    brand: "Thorne Research",
    category: "minerals",
    price: 16.99,
    image: "https://images.unsplash.com/photo-1505751171710-1f6d0ace5a85?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Gentle, non-constipating iron supplement to support red blood cell production and energy levels.",
    rating: 4.5,
    benefits: ["Supports red blood cell formation", "Enhances oxygen transport", "Reduces fatigue"],
    ingredients: ["Iron (as iron bisglycinate)", "Hypoallergenic plant fiber", "Vegetarian capsule"],
    dosage: "1 capsule daily with food",
    usageInstructions: "Take 1 capsule daily with food or as recommended by your healthcare professional.",
    warnings: ["Keep out of reach of children", "Accidental overdose of iron-containing products is a leading cause of fatal poisoning in children", "Consult your doctor before use if pregnant"],
    tags: ["iron", "energy", "blood health"]
  }
];

// Function to fetch supplements (mock implementation)
const fetchSupplements = async (): Promise<Supplement[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_SUPPLEMENTS);
    }, 500);
  });
};

const SupplementsPage: React.FC = () => {
  const { data: supplements, isLoading, error } = useQuery<Supplement[], Error>({
    queryKey: ["supplements"],
    queryFn: fetchSupplements,
  });
  const { addToCart } = useCart(); // Changed addItem to addToCart
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc");
  const [selectedSupplement, setSelectedSupplement] = useState<Supplement | null>(null);
  const [quantity, setQuantity] = useState(1);

  const categories = useMemo(() => {
    if (!supplements) return ["all"];
    const uniqueCategories = new Set(supplements.map((s) => s.category));
    return ["all", ...Array.from(uniqueCategories)];
  }, [supplements]);

  const filteredAndSortedSupplements = useMemo(() => {
    if (!supplements) return [];
    let result = [...supplements]; // Create a new array to avoid mutating the original
    if (searchTerm) {
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (selectedCategory !== "all") {
      result = result.filter((s) => s.category === selectedCategory);
    }
    const [sortKey, sortOrder] = sortBy.split("-");
    result.sort((a, b) => {
      let comparison = 0;
      if (sortKey === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortKey === "price") {
        comparison = a.price - b.price;
      } else if (sortKey === "rating") {
        comparison = (b.rating ?? 0) - (a.rating ?? 0);
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
    return result;
  }, [supplements, searchTerm, selectedCategory, sortBy]);

  const handleViewDetails = (supplement: Supplement) => {
    setSelectedSupplement(supplement);
    setQuantity(1);
  };

  const handleCloseModal = () => {
    setSelectedSupplement(null);
  };

  const handleAddToCart = () => {
    if (selectedSupplement) {
      addToCart(selectedSupplement, quantity); // Use addToCart
      toast.success(`${quantity} x ${selectedSupplement.name} added to cart!`);
      handleCloseModal();
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-500"></div></div>;
  
  if (error) return (
    <div className="container mx-auto px-4 py-8 text-red-600">
      <AlertCircle className="inline-block mr-2" />
      Error loading supplements: {error.message}
    </div>
  );

  const defaultOgImage = "/images/nutrition-chemist-logo.svg"; // Using existing logo

  return (
    <>
      <Head
        title="Supplements Store - Nutrition Chemist"
        description="Browse our wide range of high-quality health supplements."
        ogImage={defaultOgImage}
        url={window.location.href}
      />
      <SEOMetadata
        title="Supplements | Nutrition Chemist Hub"
        description="Find and compare top-quality health supplements. Vitamins, minerals, probiotics, and more."
        keywords="supplements, vitamins, minerals, health products, nutrition, chemist"
        ogImage={defaultOgImage}
        article={false}
      />

      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Our Supplements</h1>
          <p className="text-lg text-gray-600">Find the best products to support your health and wellness goals.</p>
        </header>

        {/* Filters Section */}
        <div className="mb-8 p-6 bg-white shadow-lg rounded-lg grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Input
                id="search"
                type="text"
                placeholder="Search by name, brand, or tag..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger id="sort" className="w-full">
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
        <AnimatePresence>
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredAndSortedSupplements && filteredAndSortedSupplements.length > 0 ? (
              filteredAndSortedSupplements.map((supplement) => (
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
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate" title={supplement.name}>{supplement.name}</h3>
                    <p className="text-sm text-gray-500 mb-1">{supplement.brand}</p>
                    <p className="text-lg font-bold text-emerald-600 mb-3">£{supplement.price.toFixed(2)}</p>
                    {supplement.rating && (
                      <div className="flex items-center mb-3">
                        {[...Array(Math.floor(supplement.rating))].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                        ))}
                        {supplement.rating % 1 !== 0 && (
                           <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z M10 0v12.5l-4.472 2.35L6.65 9.12.489 6.91l4.98-.72L10 0z"/></svg>
                        )}
                         <span className="ml-1 text-xs text-gray-500">({supplement.rating.toFixed(1)})</span>
                      </div>
                    )}
                    <p className="text-xs text-gray-600 mb-4 flex-grow line-clamp-3">{supplement.description}</p>
                    <Button
                      onClick={() => handleViewDetails(supplement)}
                      className="w-full mt-auto bg-emerald-500 hover:bg-emerald-600 text-white"
                      aria-label={`View details for ${supplement.name}`}
                    >
                      View Details
                    </Button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div layout className="col-span-full text-center py-12">
                <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-xl text-gray-500">No supplements found matching your criteria.</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Details Modal */}
        <AnimatePresence>
          {selectedSupplement && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
              onClick={handleCloseModal} // Close on backdrop click
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
              >
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-3xl font-bold text-gray-800">{selectedSupplement.name}</h2>
                  <Button onClick={handleCloseModal} variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                    <X className="h-6 w-6" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {selectedSupplement.image && (
                    <OptimizedImage src={selectedSupplement.image} alt={selectedSupplement.name} className="w-full h-auto rounded-lg shadow-md object-contain max-h-80" />
                  )}
                  <div className={!selectedSupplement.image ? "md:col-span-2" : ""}>
                    <p className="text-gray-500 text-sm mb-1">Brand: {selectedSupplement.brand}</p>
                    <p className="text-gray-500 text-sm mb-3">Category: {selectedSupplement.category}</p>
                    <p className="text-2xl font-bold text-emerald-600 mb-4">£{selectedSupplement.price.toFixed(2)}</p>
                    
                    <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Quantity:</h4>
                        <div className="flex items-center space-x-3">
                            <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                disabled={quantity <= 1}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="text-lg font-medium w-10 text-center">{quantity}</span>
                            <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={() => setQuantity(q => q + 1)}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <Button 
                        onClick={handleAddToCart} 
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-lg py-3"
                        aria-label={`Add ${selectedSupplement.name} to cart`}
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart (£{(selectedSupplement.price * quantity).toFixed(2)})
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4 text-sm text-gray-700">
                    {selectedSupplement.description && <p>{selectedSupplement.description}</p>}
                    
                    {selectedSupplement.benefits && selectedSupplement.benefits.length > 0 && (
                        <div>
                            <h4 className="font-semibold mb-1">Key Benefits:</h4>
                            <ul className="list-disc list-inside space-y-0.5">
                                {selectedSupplement.benefits.map((benefit, i) => <li key={i}>{benefit}</li>)}
                            </ul>
                        </div>
                    )}

                    {selectedSupplement.ingredients && selectedSupplement.ingredients.length > 0 && (
                        <div>
                            <h4 className="font-semibold mb-1">Ingredients:</h4>
                            <p className="text-xs text-gray-600">{selectedSupplement.ingredients.join(', ')}</p>
                        </div>
                    )}

                    {selectedSupplement.dosage && (
                        <div>
                            <h4 className="font-semibold mb-1">Dosage:</h4>
                            <p>{selectedSupplement.dosage}</p>
                        </div>
                    )}
                    
                    {selectedSupplement.usageInstructions && (
                        <div>
                            <h4 className="font-semibold mb-1">Usage Instructions:</h4>
                            <p>{selectedSupplement.usageInstructions}</p>
                        </div>
                    )}

                    {selectedSupplement.warnings && selectedSupplement.warnings.length > 0 && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                            <div className="flex items-start">
                                <Info className="h-5 w-5 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-yellow-700 mb-0.5">Warnings:</h4>
                                    <ul className="list-disc list-inside space-y-0.5 text-yellow-600 text-xs">
                                        {selectedSupplement.warnings.map((warning, i) => <li key={i}>{warning}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
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
