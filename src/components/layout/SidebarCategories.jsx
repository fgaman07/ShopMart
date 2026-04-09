import React from 'react';
import { Grid, ChevronRight } from 'lucide-react';

const categories = [
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

export default function SidebarCategories() {
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
          <div key={index} className="flex justify-between items-center group cursor-pointer px-4 py-3 hover:bg-gray-50 transition">
            <div className="flex items-center text-sm font-medium text-gray-600 group-hover:text-primary">
              <span className="w-6 text-center mr-2">{cat.icon}</span>
              {cat.name}
            </div>
            <ChevronRight size={14} className="text-gray-400 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </div>
  );
}
