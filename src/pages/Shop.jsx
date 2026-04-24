import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SidebarCategories from '../components/layout/SidebarCategories';
import ProductCard from '../components/product/ProductCard';

export default function Shop() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get('keyword') || '';
  const restaurantId = searchParams.get('restaurant') || '';
  const initialCategory = searchParams.get('category') || 'All';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [products, setProducts] = useState([]);
  const [maxPrice, setMaxPrice] = useState(500);
  const [sortOption, setSortOption] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const urlCategory = searchParams.get('category');
    if (urlCategory) {
      setActiveCategory(urlCategory);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = '/api/products';
        const queryParams = new URLSearchParams();
        if (keyword) queryParams.append('keyword', keyword);
        if (restaurantId) queryParams.append('restaurant', restaurantId);
        if (activeCategory && activeCategory !== 'All') queryParams.append('category', activeCategory);
        
        queryParams.append('maxPrice', maxPrice);
        queryParams.append('page', page);
        queryParams.append('limit', 12);
        
        if (sortOption === 'Price: Low to High') queryParams.append('sort', 'price_asc');
        if (sortOption === 'Price: High to Low') queryParams.append('sort', 'price_desc');
        if (sortOption === 'Newest') queryParams.append('sort', 'newest');
        
        if (queryParams.toString()) {
           url += `?${queryParams.toString()}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        setProducts(data.products || data);
        if (data.pages) setTotalPages(data.pages);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [keyword, restaurantId, activeCategory, maxPrice, sortOption, page]);

  // For now, we'll just show all products as the categories in SidebarCategories 
  // don't perfectly match the product objects yet. 
  // In a real app, we'd filter here.
  const filteredProducts = products; 

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="hidden lg:block w-[280px] flex-shrink-0">
          <SidebarCategories 
            activeCategory={activeCategory} 
            onSelectCategory={(cat) => { setActiveCategory(cat); setPage(1); }} 
          />
          
          <div className="mt-8 p-6 bg-[#F3F9FB] rounded-lg border border-[#E5F1F4]">
            <h3 className="font-bold text-lg mb-4">Filter by Price</h3>
            <div className="flex flex-col gap-4">
               <input 
                 type="range" 
                 min="0"
                 max="1000"
                 step="10"
                 value={maxPrice}
                 onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                 className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary" 
               />
               <div className="flex justify-between text-sm text-gray-600">
                  <span>₹0</span>
                  <span className="font-bold text-primary">₹{maxPrice}</span>
               </div>
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
              <select 
                value={sortOption}
                onChange={(e) => { setSortOption(e.target.value); setPage(1); }}
                className="bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-primary"
              >
                <option value="">Featured</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Price: High to Low">Price: High to Low</option>
                <option value="Newest">Newest</option>
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <div className="flex gap-2">
                {[...Array(totalPages).keys()].map((p) => (
                  <button 
                    key={p + 1}
                    onClick={() => { setPage(p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className={`w-10 h-10 flex items-center justify-center rounded-full font-bold transition ${page === p + 1 ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                  >
                    {p + 1}
                  </button>
                ))}
                {page < totalPages && (
                  <button 
                    onClick={() => { setPage(page + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="px-4 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 font-bold text-gray-700 transition"
                  >
                    Next →
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
