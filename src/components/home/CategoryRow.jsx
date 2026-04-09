import React from 'react';
import { categories } from '../../utils/mockData';

export default function CategoryRow() {
  return (
    <div className="mb-14 overflow-hidden">
       <div className="flex gap-4 md:gap-8 overflow-x-auto pb-6 scrollbar-hide snap-x">
          {categories.map((category) => (
            <div key={category.id} className="flex flex-col items-center min-w-[80px] md:min-w-[100px] cursor-pointer group snap-center">
              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-3xl md:text-4xl mb-3 shadow-sm border border-transparent group-hover:border-primary/20 group-hover:shadow-md transition-all duration-300 transform group-hover:-translate-y-2 ${category.bgColor}`}>
                {category.icon}
              </div>
              <span className="text-xs md:text-sm font-semibold text-neutral-700 text-center group-hover:text-primary transition-colors">
                {category.name}
              </span>
            </div>
          ))}
       </div>
    </div>
  );
}
