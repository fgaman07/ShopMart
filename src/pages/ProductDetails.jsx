import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Share2, Star, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductSection from '../components/home/ProductSection';

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const productRes = await fetch(`/api/products/${id}`);
        if(productRes.ok) {
           const productData = await productRes.json();
           setProduct(productData);
        } else {
           setProduct(null);
        }
        
        const allRes = await fetch('/api/products');
        if(allRes.ok) {
           const allProducts = await allRes.json();
           setRelatedProducts(allProducts.filter(p => p.id !== parseInt(id)).slice(0, 5));
        }
      } catch (error) {
         console.error("Error fetching product data:", error);
      }
    };
    
    fetchProductData();
    setQuantity(1);
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Loading / Product not found</h2>
        <Link to="/shop" className="text-primary hover:underline mt-4 inline-block">Back to Shop</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/shop" className="hover:text-primary">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">{product.title}</span>
      </nav>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-10 mb-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column: Product Image */}
          <div className="lg:w-1/2">
            <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center p-12">
              <img 
                src={product.image} 
                alt={product.title} 
                className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-500"
              />
              {product.discount && (
                <div className="absolute top-6 left-6 bg-danger text-white font-bold px-3 py-1 rounded-full text-sm">
                  {product.discount}% OFF
                </div>
              )}
              <button className="absolute top-6 right-6 p-2 bg-white rounded-full shadow-md text-gray-400 hover:text-danger">
                <Heart size={24} />
              </button>
            </div>
          </div>

          {/* Right Column: Product Info */}
          <div className="lg:w-1/2 flex flex-col">
            <div className="mb-2">
              <span className="text-primary font-bold text-sm tracking-widest uppercase">Organic Organic</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.title}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-warning">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill={i < 4 ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-sm text-gray-400 font-medium">(2 Customer Reviews)</span>
            </div>

            <div className="flex items-center gap-3 mb-8">
              <span className="text-4xl font-bold text-danger">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through">₹{product.originalPrice}</span>
              )}
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ac dui sed nunc sagittis maximus. 
              Sed commodo, nisl nec sodales volutpat, ante ante aliquet ex, ac sollicitudin nisi elit nec purus.
            </p>

            <div className="mb-8">
               <span className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Weight: {product.weight}</span>
            </div>

            <div className="flex flex-wrap gap-4 items-center mb-10 pt-6 border-t border-gray-100">
               <div className="flex items-center border border-gray-200 rounded-full bg-gray-50 p-1">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm"
                  >-</button>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm"
                  >+</button>
               </div>
               
               <button 
                onClick={handleAddToCart}
                className="flex-grow md:flex-grow-0 bg-primary text-white px-10 py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition shadow-lg shadow-primary/20"
               >
                 <ShoppingCart size={20} />
                 Add to Cart
               </button>
               
               <button className="p-4 border border-gray-200 rounded-full hover:bg-gray-50 transition">
                  <Share2 size={20} />
               </button>
            </div>

            {/* Features Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="flex items-center gap-3 text-sm text-gray-600">
                  <ShieldCheck className="text-primary" size={24} />
                  <span>100% Genuine Products</span>
               </div>
               <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Truck className="text-primary" size={24} />
                  <span>Free Shipping over ₹500</span>
               </div>
               <div className="flex items-center gap-3 text-sm text-gray-600">
                  <RotateCcw className="text-primary" size={24} />
                  <span>7 Days Return Policy</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mb-16">
         <div className="flex border-b border-gray-100 gap-8 mb-8">
            <button 
               onClick={() => setActiveTab('description')}
               className={`pb-4 font-bold text-lg relative transition-colors ${activeTab === 'description' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
            >
               Description
               {activeTab === 'description' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full" />}
            </button>
            <button 
               onClick={() => setActiveTab('info')}
               className={`pb-4 font-bold text-lg relative transition-colors ${activeTab === 'info' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
            >
               Additional Info
               {activeTab === 'info' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full" />}
            </button>
            <button 
               onClick={() => setActiveTab('reviews')}
               className={`pb-4 font-bold text-lg relative transition-colors ${activeTab === 'reviews' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
            >
               Reviews (2)
               {activeTab === 'reviews' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full" />}
            </button>
         </div>

         <div className="min-h-[200px] text-gray-600 leading-relaxed max-w-4xl">
            {activeTab === 'description' && (
               <div>
                  <p className="mb-4">
                     Our {product.title} is sourced from the finest farms and handpicked to ensure the highest quality. 
                     We take pride in delivering products that are fresh, organic, and full of natural nutrients. 
                     Perfect for a healthy lifestyle, this product is processed under strict hygiene standards.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                     <li>100% Organic and Natural</li>
                     <li>No Artificial Preservatives</li>
                     <li>Rich in Essential Nutrients</li>
                     <li>Handpicked Quality Assurance</li>
                  </ul>
               </div>
            )}
            {activeTab === 'info' && (
               <table className="w-full max-w-md border-collapse">
                  <tbody>
                     <tr className="border-b border-gray-100">
                        <td className="py-3 font-bold text-gray-900 w-1/3">Weight</td>
                        <td className="py-3">{product.weight}</td>
                     </tr>
                     <tr className="border-b border-gray-100">
                        <td className="py-3 font-bold text-gray-900">Shelf Life</td>
                        <td className="py-3">6 Months</td>
                     </tr>
                     <tr className="border-b border-gray-100">
                        <td className="py-3 font-bold text-gray-900">Category</td>
                        <td className="py-3">Groceries</td>
                     </tr>
                  </tbody>
               </table>
            )}
            {activeTab === 'reviews' && (
               <div className="space-y-8">
                  <div className="flex gap-4 p-6 bg-gray-50 rounded-xl">
                     <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">AK</div>
                     <div>
                        <div className="flex items-center gap-2 mb-1">
                           <span className="font-bold text-gray-900">Ankit Kumar</span>
                           <div className="flex text-warning scale-75">
                              <Star size={14} fill="currentColor" />
                              <Star size={14} fill="currentColor" />
                              <Star size={14} fill="currentColor" />
                              <Star size={14} fill="currentColor" />
                              <Star size={14} fill="currentColor" />
                           </div>
                        </div>
                        <p className="text-sm">Great quality and fast delivery. Very happy with the purchase!</p>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </div>

      {/* Related Products */}
      <ProductSection 
         title="Related Products" 
         productsList={relatedProducts} 
      />
    </div>
  );
}
