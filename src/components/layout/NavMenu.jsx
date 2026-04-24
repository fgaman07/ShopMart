import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NavMenu() {
  return (
    <div className="w-full flex items-center justify-between py-4 bg-white border-b border-gray-100 mb-6">
      
      {/* Primary Links */}
      <div className="flex space-x-6 lg:space-x-8 text-[13px] md:text-sm font-semibold text-gray-700">
        <Link to="/" className="text-primary flex items-center">
          Home <ChevronDown size={14} className="ml-1 opacity-60" />
        </Link>
        <Link to="/shop" className="hover:text-primary flex items-center transition">
          Shop <ChevronDown size={14} className="ml-1 opacity-60" />
        </Link>
        <Link to={`/shop?category=${encodeURIComponent('Fruits & Vegetables')}`} className="hover:text-primary transition">Fruits & Vegetables</Link>
        <Link to={`/shop?category=Beverages`} className="hover:text-primary transition">Beverages</Link>
        <Link to="/" className="hover:text-primary transition">Blog</Link>
        <Link to="/" className="hover:text-primary transition">Contact</Link>
      </div>

      {/* Right side links */}
      <div className="hidden lg:flex space-x-6 text-sm font-bold text-gray-800">
         <Link to="/shop?sort=newest" className="flex items-center hover:text-primary transition">
           Trending Products <ChevronDown size={14} className="ml-1" />
         </Link>
         <Link to="/shop?maxPrice=200" className="flex items-center text-danger hover:text-red-700 transition">
           Almost Finished <span className="ml-2 bg-danger text-white text-[10px] px-1.5 py-0.5 rounded-sm">SALE</span> <ChevronDown size={14} className="ml-1 text-gray-400" />
         </Link>
      </div>

    </div>
  );
}
