import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SidebarCategories from '../components/layout/SidebarCategories';
import ProductCard from '../components/product/ProductCard';

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [products, setProducts] = useState([]);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get('keyword') || '';
  const restaurantId = searchParams.get('restaurant') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = '/api/products';
        const queryParams = new URLSearchParams();
        if (keyword) queryParams.append('keyword', keyword);
        if (restaurantId) queryParams.append('restaurant', restaurantId);
        
        if (queryParams.toString()) {
           url += `?${queryParams.toString()}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [keyword, restaurantId]);

  // For now, we'll just show all products as the categories in SidebarCategories 
  // don't perfectly match the product objects yet. 
  // In a real app, we'd filter here.
  const filteredProducts = products; 

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="hidden lg:block w-[280px] flex-shrink-0">
          <SidebarCategories />
          
          <div className="mt-8 p-6 bg-[#F3F9FB] rounded-lg border border-[#E5F1F4]">
            <h3 className="font-bold text-lg mb-4">Filter by Price</h3>
            <div className="flex flex-col gap-4">
               <input type="range" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary" />
               <div className="flex justify-between text-sm text-gray-600">
                  <span>₹0</span>
                  <span>₹500</span>
               </div>
               <button className="bg-primary text-white py-2 rounded-md text-sm font-bold mt-2">Filter</button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-gray-100">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                 {keyword ? `Search Results for "${keyword}"` : restaurantId ? 'Restaurant Menu' : 'Shop All Products'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">Showing {filteredProducts.length} results</p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex items-center gap-4">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select className="bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-primary">
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                weight={product.weight}
                price={product.price}
                originalPrice={product.originalPrice}
                discount={product.discount}
                image={product.image}
                restaurant={product.restaurant}
              />
            ))}
          </div>

          {/* Pagination Mock */}
          <div className="mt-12 flex justify-center">
            <div className="flex gap-2">
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white font-bold">1</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 font-bold">2</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 font-bold">3</button>
              <button className="px-4 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 font-bold">Next →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
