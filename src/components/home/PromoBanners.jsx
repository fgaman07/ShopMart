import React from 'react';

export default function PromoBanners() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      
      {/* Banner 1 */}
      <div className="bg-[#FAF2EE] rounded-lg p-8 flex flex-col justify-center relative overflow-hidden h-[180px] group shadow-sm border border-[#F4E3D7]">
        <div className="relative z-10 max-w-[60%]">
          <span className="text-orange-500 text-[10px] uppercase font-bold tracking-wider mb-2 block">Only This Week</span>
          <h3 className="text-xl font-bold leading-tight mb-2 text-gray-900">Quality eggs at an affordable price</h3>
          <p className="text-gray-500 text-xs mb-4">Eat one every day</p>
          <button className="bg-white px-4 py-1.5 text-xs font-semibold rounded-full shadow-sm hover:shadow text-gray-800">
            Shop Now →
          </button>
        </div>
      </div>

      {/* Banner 2 */}
      <div className="bg-[#F2F6F0] rounded-lg p-8 flex flex-col justify-center relative overflow-hidden h-[180px] group shadow-sm border border-[#E3EFE0]">
        <div className="relative z-10 max-w-[65%]">
          <span className="text-orange-500 text-[10px] uppercase font-bold tracking-wider mb-2 block">Only This Week</span>
          <h3 className="text-xl font-bold leading-tight mb-2 text-gray-900">Snacks that nourishes our mind and body</h3>
          <p className="text-gray-500 text-xs mb-4">Shine the morning...</p>
          <button className="bg-white px-4 py-1.5 text-xs font-semibold rounded-full shadow-sm hover:shadow text-gray-800">
            Shop Now →
          </button>
        </div>
      </div>

      {/* Banner 3 */}
      <div className="bg-[#F5F0EC] rounded-lg p-8 flex flex-col justify-center relative overflow-hidden h-[180px] group shadow-sm border border-[#EBE1D8]">
        <div className="relative z-10 max-w-[65%]">
          <span className="text-orange-500 text-[10px] uppercase font-bold tracking-wider mb-2 block">Only This Week</span>
          <h3 className="text-xl font-bold leading-tight mb-2 text-gray-900">Unbeatable quality, unbeatable prices.</h3>
          <p className="text-gray-500 text-xs mb-4">Only this week, Don't miss...</p>
          <button className="bg-white px-4 py-1.5 text-xs font-semibold rounded-full shadow-sm hover:shadow text-gray-800">
            Shop Now →
          </button>
        </div>
      </div>

    </div>
  );
}
