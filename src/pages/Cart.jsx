import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  const checkoutHandler = () => {
    navigate('/login?redirect=/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
           <ShoppingBag size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-lg">Looks like you haven't added anything to your cart yet.</p>
        <Link 
          to="/shop" 
          className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition shadow-lg shadow-primary/20"
        >
          <ArrowLeft size={18} />
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-10">
         <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Shopping Cart</h1>
         <span className="bg-gray-100 text-gray-500 text-sm font-bold px-3 py-1 rounded-full">{cartCount} items</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Cart Items List */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="hidden md:grid grid-cols-6 gap-4 p-6 bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
               <div className="col-span-3">Product</div>
               <div className="text-center">Price</div>
               <div className="text-center">Quantity</div>
               <div className="text-right">Total</div>
            </div>

            <div className="divide-y divide-gray-50">
              {cartItems.map((item) => (
                <div key={item.id} className="p-6 grid grid-cols-1 md:grid-cols-6 gap-6 items-center hover:bg-gray-50/30 transition">
                  {/* Product Info */}
                  <div className="col-span-1 md:col-span-3 flex items-center gap-4">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-50 rounded-xl border border-gray-100 p-2 flex-shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 leading-tight mb-1 hover:text-primary transition">
                         <Link to={`/product/${item.id}`}>{item.title}</Link>
                      </h3>
                      <p className="text-sm text-gray-400 font-medium">Weight: {item.weight}</p>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="mt-2 text-danger text-xs font-bold flex items-center gap-1 hover:underline"
                      >
                         <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-center font-bold text-gray-900">
                     ₹{item.price}
                  </div>

                  {/* Quantity */}
                  <div className="flex justify-center">
                    <div className="flex items-center border border-gray-200 rounded-full bg-gray-50 p-1 scale-90">
                      <button 
                         onClick={() => updateQuantity(item.id, item.quantity - 1)}
                         className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                      <button 
                         onClick={() => updateQuantity(item.id, item.quantity + 1)}
                         className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="text-right font-bold text-primary">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
             <Link to="/shop" className="text-primary font-bold flex items-center gap-2 hover:underline">
                <ArrowLeft size={18} />
                Continue Shopping
             </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-2xl border border-gray-100 p-8 sticky top-32 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-8">
               <div className="flex justify-between text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span className="text-gray-900">₹{cartTotal}</span>
               </div>
               <div className="flex justify-between text-gray-500 font-medium">
                  <span>Shipping Estimate</span>
                  <span className="text-success">Free</span>
               </div>
               <div className="flex justify-between text-gray-500 font-medium">
                  <span>Tax Estimate</span>
                  <span className="text-gray-900">₹0.00</span>
               </div>
               <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                  <span className="text-lg font-bold text-gray-900">Order Total</span>
                  <span className="text-2xl font-bold text-primary">₹{cartTotal}</span>
               </div>
            </div>

            <button 
              onClick={checkoutHandler}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-dark transition shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
               Proceed to Checkout
            </button>
            
            <div className="mt-6 flex items-center justify-center gap-4 text-gray-400 opacity-60">
               <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" alt="PayPal" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4" alt="Mastercard" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
