import React from 'react';

export default function HeroBanner() {
  return (
    <div className="w-full bg-[#f4f2ef] rounded-lg h-[400px] flex items-center relative overflow-hidden group shadow-sm">
      
      {/* Content */}
      <div className="relative z-10 p-8 md:p-12 max-w-xl h-full flex flex-col justify-center">
        <div className="inline-block bg-[#E5F5ED] text-[#22A05B] rounded-sm px-2 py-0.5 mb-6 text-[11px] font-bold tracking-wide w-fit border border-[#BCE1CC]">
          Weekend Discount
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#2B2B2D] mb-4 leading-[1.1]">
          Get the best quality products at the lowest prices
        </h1>
        
        <p className="text-[#6D6D71] text-[15px] mb-8 max-w-sm">
          We have prepared special discounts for you on grocery products. Don't miss these opportunities...
        </p>
        
        <div className="flex items-center gap-4">
          <button className="bg-primary text-white px-6 py-3 rounded-md font-semibold hover:bg-opacity-90 transition shadow-sm text-sm">
            Shop Now →
          </button>
          
          <div className="flex items-baseline gap-2">
            <span className="text-danger font-bold text-2xl">$27.99</span>
            <span className="text-gray-400 line-through text-sm font-medium">$56.67</span>
            <span className="text-xs text-gray-500 ml-1 block w-min leading-tight">Don't miss this limited time offer.</span>
          </div>
        </div>
      </div>

      {/* Mock Image Representation for the Saffron Road Product */}
      <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/2">
        <div className="w-full h-full bg-[#ebe7e2] right-0 absolute" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }}>
          {/* Using a placeholder unsplash image representing packaged foods */}
          <img 
            src="https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&q=80&w=800" 
            alt="Saffron Road products" 
            className="w-full h-full object-cover opacity-80 mix-blend-multiply"
          />
        </div>
      </div>
      
    </div>
  );
}
