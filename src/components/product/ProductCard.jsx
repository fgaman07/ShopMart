import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ id, title, weight, price, originalPrice, image, discount }) {
  const { addToCart } = useCart();

  const product = { id, title, weight, price, originalPrice, image, discount };

  return (
    <div className="bg-white border border-gray-100 hover:border-primary/40 hover:shadow-card transition duration-200 rounded-lg overflow-hidden group w-full flex flex-col relative h-[380px] p-4 p-x-5">
      
      {/* Top action row: Discount Badges and Heart */}
      <div className="flex justify-between items-start z-10 relative mb-2">
         <div className="flex flex-col gap-1">
            {discount && (
              <div className="bg-danger text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
                {discount}%
              </div>
            )}
            <div className="bg-[#E5F5EF] text-[#22A05B] text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
              Organic
            </div>
         </div>
         
         <button className="text-gray-400 hover:text-danger hover:fill-danger transition-colors bg-white rounded-full p-1 shadow-sm opacity-50 group-hover:opacity-100">
            <Heart size={18} />
         </button>
      </div>

      {/* Product Image */}
      <Link to={`/product/${id}`} className="block relative w-full h-[140px] flex items-center justify-center bg-white overflow-hidden mb-4">
        <img 
          src={image || "https://images.unsplash.com/photo-1542223189-67a03fa0f0bd?auto=format&fit=crop&q=80&w=300&h=300"} 
          alt={title}
          className="max-h-[120px] object-contain transition-transform duration-300 group-hover:scale-110"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-grow relative z-10 w-full mt-auto">
        <Link to={`/product/${id}`} className="text-[#2B2B2D] font-medium text-sm leading-tight line-clamp-2 hover:text-primary transition-colors mb-1">
            {title || "Product Title"}
        </Link>
        
        {/* Rating Stars mock */}
        <div className="flex text-warning text-xs mb-3">
           ★★★★<span className="text-gray-300">★</span> <span className="text-gray-400 text-[10px] ml-1">2</span>
        </div>
        
        {/* Price and Add button section stacked */}
        <div className="mt-auto flex flex-col gap-3">
          <div className="flex items-end gap-2">
            <span className="text-danger font-bold text-lg leading-none">₹{price}</span>
            {originalPrice && (
              <span className="text-gray-400 text-[13px] line-through leading-none font-medium">₹{originalPrice}</span>
            )}
          </div>
          
          <button 
            onClick={() => addToCart(product)}
            className="flex text-xs font-semibold items-center justify-center py-2 border border-primary/20 bg-white text-primary rounded-full transition-colors w-full group-hover:bg-primary group-hover:text-white"
          >
            Add to cart <span className="ml-1 opacity-60 font-normal">+</span>
          </button>
        </div>
      </div>

      {/* Stock meter line visual */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gray-100">
         <div className="h-full bg-warning w-[45%]" />
      </div>
    </div>
  );
}
