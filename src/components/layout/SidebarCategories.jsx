import React from 'react';
import { Grid, ChevronRight } from 'lucide-react';

const categories = [
  { name: "All", icon: "📋" },
  { name: "Fruits & Vegetables", icon: "🍎" },
  { name: "Meats & Seafood", icon: "🥩" },
  { name: "Breakfast & Dairy", icon: "🥚" },
  { name: "Breads & Bakery", icon: "🥖" },
  { name: "Beverages", icon: "🥤" },
  { name: "Frozen Foods", icon: "❄️" },
  { name: "Biscuits & Snacks", icon: "🍪" },
  { name: "Grocery & Staples", icon: "🌾" },
  { name: "Household Needs", icon: "🧼" },
  { name: "Healthcare", icon: "💊" },
  { name: "Baby & Pregnancy", icon: "🍼" },
];

export default function SidebarCategories({ activeCategory = 'All', onSelectCategory = () => {} }) {
  return (
    <div className="w-full flex flex-col border border-gray-100 rounded-b-lg overflow-hidden bg-white">
      {/* Sidebar Header */}
      <div className="bg-gray-50 flex items-center p-4 border-b border-gray-100 font-bold text-gray-800">
        <Grid size={18} className="mr-3 opacity-70" />
        All Categories
      </div>
      
      {/* Category List */}
      <div className="flex flex-col py-2">
        {categories.map((cat, index) => (
          <div 
            key={index} 
            onClick={() => onSelectCategory(cat.name)}
            className={`flex justify-between items-center group cursor-pointer px-4 py-3 hover:bg-gray-50 transition ${activeCategory === cat.name ? 'bg-primary/5 border-r-4 border-primary' : ''}`}
          >
            <div className={`flex items-center text-sm font-medium group-hover:text-primary ${activeCategory === cat.name ? 'text-primary font-bold' : 'text-gray-600'}`}>
              <span className="w-6 text-center mr-2">{cat.icon}</span>
              {cat.name}
            </div>
            <ChevronRight size={14} className={`group-hover:text-primary transition-opacity ${activeCategory === cat.name ? 'text-primary opacity-100' : 'text-gray-400 opacity-0'}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
