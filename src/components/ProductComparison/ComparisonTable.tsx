import React from 'react';
import { generateProductStructuredData } from '../../utils/structuredData';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  sku: string;
  features: string[];
  rating: number;
  reviewCount: number;
  pros: string[];
  cons: string[];
}

interface ComparisonTableProps {
  products: Product[];
  comparisonCriteria: string[];
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ products, comparisonCriteria }) => {
  return (
    <div className="w-full overflow-x-auto">
      {/* Structured Data */}
      {products.map(product => (
        <script
          key={product.id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              generateProductStructuredData({
                name: product.name,
                description: product.description,
                image: product.image,
                price: product.price,
                currency: product.currency,
                sku: product.sku
              })
            )
          }}
        />
      ))}

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="p-4 border-b">Features</th>
            {products.map(product => (
              <th key={product.id} className="p-4 border-b">
                <div className="flex flex-col items-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-24 h-24 object-contain mb-2"
                  />
                  <h3 className="font-bold text-lg">{product.name}</h3>
                  <div className="text-xl font-semibold text-green-600">
                    {product.currency}{product.price}
                  </div>
                  <div className="flex items-center mt-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
                            i < product.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      ({product.reviewCount} reviews)
                    </span>
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparisonCriteria.map((criterion, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="p-4 border-b font-medium">{criterion}</td>
              {products.map(product => (
                <td key={product.id} className="p-4 border-b text-center">
                  {product.features[index] || '—'}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td className="p-4 border-b font-medium">Pros</td>
            {products.map(product => (
              <td key={product.id} className="p-4 border-b">
                <ul className="list-disc list-inside text-left">
                  {product.pros.map((pro, index) => (
                    <li key={index} className="text-green-600">{pro}</li>
                  ))}
                </ul>
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-4 border-b font-medium">Cons</td>
            {products.map(product => (
              <td key={product.id} className="p-4 border-b">
                <ul className="list-disc list-inside text-left">
                  {product.cons.map((con, index) => (
                    <li key={index} className="text-red-600">{con}</li>
                  ))}
                </ul>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}; 