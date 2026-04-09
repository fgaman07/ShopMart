import React, { useState, useEffect } from 'react';
import SidebarCategories from '../components/layout/SidebarCategories';
import NavMenu from '../components/layout/NavMenu';
import HeroBanner from '../components/home/HeroBanner';
import FeaturesStrip from '../components/home/FeaturesStrip';
import PromoBanners from '../components/home/PromoBanners';
import ProductSection from '../components/home/ProductSection';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const newArrivals = products.slice(0, 5);
  const featured = products.slice(3, 8);

  return (
    <div className="w-full">
      {/* 
        ShopStore Layout requires the top horizontal NavMenu to span the right side, 
        and the Sidebar Categories to cover the left column.
      */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8 mt-4">
         
         {/* Left Column: Sidebar usually 25% width */}
         <div className="hidden lg:block w-[260px] flex-shrink-0">
            <SidebarCategories />
         </div>

         {/* Right Column: Main Content 75% width */}
         <div className="flex-grow flex flex-col overflow-hidden">
            {/* Top Navigation Row */}
            <div className="hidden lg:block">
              <NavMenu />
            </div>
            
            {/* Mobile NavMenu (if needed) */}
            <div className="block lg:hidden mb-4">
              <NavMenu />
            </div>

            {/* Hero Section Banner */}
            <HeroBanner />
         </div>
      </div>

      {/* Full Width Sections */}
      <div className="w-full">
         <FeaturesStrip />
         
         <PromoBanners />

         <ProductSection 
           title="New Arrivals" 
           productsList={newArrivals} 
           viewAllLink="/shop"
         />

         {/* 4 Block Big Category Cards layout - mocked briefly */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-16">
            <div className="bg-[#F8F1EB] rounded-lg p-8 cursor-pointer shadow-sm hover:shadow transition border border-[#EFDFD3]">
               <h3 className="text-xl font-bold mb-2 w-1/2 text-[#2B2B2D]">Provides you experienced quality products</h3>
               <p className="text-xs text-gray-500 mb-6">Feed your family the best</p>
               <button className="bg-white px-4 py-1.5 text-xs font-semibold rounded-full text-[#2B2B2D]">Shop Now →</button>
            </div>
            <div className="bg-[#E6F3F5] rounded-lg p-8 cursor-pointer shadow-sm hover:shadow transition border border-[#D5EAEF]">
               <h3 className="text-xl font-bold mb-2 w-1/2 text-[#2B2B2D]">Shopping with us for better quality</h3>
               <p className="text-xs text-gray-500 mb-6">Only this week, Don't miss...</p>
               <button className="bg-white px-4 py-1.5 text-xs font-semibold rounded-full text-[#2B2B2D]">Shop Now →</button>
            </div>
         </div>

         <ProductSection 
           title="Featured Products" 
           productsList={featured} 
           viewAllLink="/shop"
         />

      </div>
    </div>
  );
}
