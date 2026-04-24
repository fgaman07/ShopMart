import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { MapPin, CreditCard, ShoppingBag, CheckCircle, ArrowRight, ArrowLeft, Loader2, Tag, X } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { userInfo } = useAuth();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponData, setCouponData] = useState(null);
  const [couponError, setCouponError] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const discount = couponData ? couponData.discountAmount : 0;
  const finalTotal = Math.max(0, cartTotal - discount);

  // Form States
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');
  const [paymentMethod, setPaymentMethod] = useState('COD');

  // Load Razorpay SDK
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById('razorpay-script')) { resolve(true); return; }
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    if (!userInfo) navigate('/login?redirect=/checkout');
    if (cartItems.length === 0) navigate('/cart');
  }, [userInfo, cartItems, navigate]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError(null);
    setCouponData(null);
    try {
      const res = await fetch('/api/coupons/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
        body: JSON.stringify({ code: couponCode, orderTotal: cartTotal }),
      });
      const data = await res.json();
      if (!res.ok) { setCouponError(data.message); }
      else { setCouponData(data); }
    } catch (err) { setCouponError('Failed to apply coupon.'); }
    setCouponLoading(false);
  };

  const placeOrderHandler = async () => {
    try {
      setLoading(true);

      if (paymentMethod === 'Razorpay') {
        // Step 1 – load Razorpay SDK
        const loaded = await loadRazorpayScript();
        if (!loaded) { alert('Failed to load Razorpay. Check your internet connection.'); setLoading(false); return; }

        // Step 2 – create order in our backend first
        const orderRes = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
          body: JSON.stringify({
            orderItems: cartItems, shippingAddress: { address, city, postalCode, country },
            paymentMethod, itemsPrice: cartTotal, shippingPrice: 0, taxPrice: 0,
            totalPrice: finalTotal, couponCode: couponData ? couponData.code : null,
          }),
        });
        const orderData = await orderRes.json();
        if (!orderRes.ok) { alert(orderData.message || 'Order creation failed'); setLoading(false); return; }

        // Step 3 – create Razorpay payment order
        const rzpRes = await fetch('/api/payment/razorpay/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
          body: JSON.stringify({ amount: finalTotal }),
        });
        const rzpData = await rzpRes.json();
        if (!rzpRes.ok) { alert(rzpData.message || 'Payment init failed'); setLoading(false); return; }

        // Step 4 – open Razorpay modal
        const options = {
          key: rzpData.key,
          amount: rzpData.amount,
          currency: rzpData.currency,
          name: 'ShopStore',
          description: 'Food Delivery Order',
          order_id: rzpData.id,
          handler: async (response) => {
            // Step 5 – verify payment
            const verifyRes = await fetch('/api/payment/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
              body: JSON.stringify({ ...response, orderId: orderData._id }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              clearCart();
              navigate(`/order/${orderData._id}`);
            } else {
              alert('Payment verified but update failed. Contact support.');
            }
          },
          prefill: { name: userInfo.name, email: userInfo.email },
          theme: { color: '#634C9F' },
          modal: { ondismiss: () => setLoading(false) },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
        return; // loading state handled by modal
      }

      // COD / other methods
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
        body: JSON.stringify({
          orderItems: cartItems, shippingAddress: { address, city, postalCode, country },
          paymentMethod, itemsPrice: cartTotal, shippingPrice: 0, taxPrice: 0,
          totalPrice: finalTotal, couponCode: couponData ? couponData.code : null,
        }),
      });
      const data = await response.json();
      if (response.ok) { clearCart(); navigate(`/order/${data._id}`); }
      else { alert(data.message || 'Order failed'); }
    } catch (err) {
      console.error(err);
      alert('Internal Server Error');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, name: 'Shipping', icon: MapPin },
    { id: 2, name: 'Payment', icon: CreditCard },
    { id: 3, name: 'Review', icon: ShoppingBag },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-10 min-h-[80vh]">
      {/* Checkout Header / Stepper */}
      <div className="mb-12">
        <div className="flex items-center justify-center max-w-2xl mx-auto">
          {steps.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center relative z-10">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  step >= s.id ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' : 'bg-gray-100 text-gray-400'
                }`}>
                  <s.icon size={20} />
                </div>
                <span className={`text-[11px] font-bold uppercase tracking-wider mt-3 ${step >= s.id ? 'text-primary' : 'text-gray-400'}`}>
                   {s.name}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-grow h-1 mx-4 bg-gray-100 relative -top-3">
                  <div className={`h-full bg-primary transition-all duration-500 ease-out`} style={{ width: step > s.id ? '100%' : '0%' }}></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
         <div className="w-full lg:w-2/3 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            {/* Step 1: Shipping */}
            {step === 1 && (
               <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-50 pb-4">Shipping Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Street Address</label>
                        <input 
                           type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                           className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                           placeholder="123 Shopping St."
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                        <input 
                           type="text" value={city} onChange={(e) => setCity(e.target.value)}
                           className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Postal Code</label>
                        <input 
                           type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)}
                           className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                     </div>
                     <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Country</label>
                        <select 
                           value={country} onChange={(e) => setCountry(e.target.value)}
                           className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                        >
                           <option value="India">India</option>
                           <option value="USA">USA</option>
                           <option value="UK">UK</option>
                        </select>
                     </div>
                  </div>
                  <div className="mt-10 flex justify-end">
                     <button 
                        onClick={() => setStep(2)}
                        disabled={!address || !city || !postalCode}
                        className="bg-primary text-white px-10 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-dark transition disabled:opacity-50"
                     >
                        Continue to Payment <ArrowRight size={20}/>
                     </button>
                  </div>
               </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
               <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-50 pb-4">Payment Method</h2>
                  <div className="space-y-4">
                     <label className={`flex items-center gap-4 p-6 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'PayPal' ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                        <input type="radio" className="hidden" name="payment" value="PayPal" checked={paymentMethod === 'PayPal'} onChange={(e) => setPaymentMethod(e.target.value)} />
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'PayPal' ? 'border-primary' : 'border-gray-300'}`}>
                           {paymentMethod === 'PayPal' && <div className="w-3 h-3 bg-primary rounded-full" />}
                        </div>
                        <div className="flex-grow">
                           <span className="block font-bold text-gray-900">PayPal or Credit Card</span>
                           <span className="block text-xs text-gray-500">Fast and secure payment globally</span>
                        </div>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-5" alt="PayPal" />
                     </label>

                     <label className={`flex items-center gap-4 p-6 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                        <input type="radio" className="hidden" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} />
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'COD' ? 'border-primary' : 'border-gray-300'}`}>
                           {paymentMethod === 'COD' && <div className="w-3 h-3 bg-primary rounded-full" />}
                        </div>
                        <div className="flex-grow">
                           <span className="block font-bold text-gray-900">Cash on Delivery</span>
                           <span className="block text-xs text-gray-500">Pay when you receive your items</span>
                        </div>
                     </label>

                     <label className={`flex items-center gap-4 p-6 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'Razorpay' ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                        <input type="radio" className="hidden" name="payment" value="Razorpay" checked={paymentMethod === 'Razorpay'} onChange={(e) => setPaymentMethod(e.target.value)} />
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'Razorpay' ? 'border-primary' : 'border-gray-300'}`}>
                           {paymentMethod === 'Razorpay' && <div className="w-3 h-3 bg-primary rounded-full" />}
                        </div>
                        <div className="flex-grow">
                           <span className="block font-bold text-gray-900">Pay Online (Razorpay)</span>
                           <span className="block text-xs text-gray-500">UPI, Cards, Net Banking & Wallets</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">⚡ Instant</div>
                     </label>
                  </div>
                  <div className="mt-10 flex justify-between">
                     <button onClick={() => setStep(1)} className="text-gray-400 font-bold flex items-center gap-2 hover:text-gray-900 transition">
                        <ArrowLeft size={18}/> Back to Shipping
                     </button>
                     <button onClick={() => setStep(3)} className="bg-primary text-white px-10 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-dark transition">
                        Review Order <ArrowRight size={20}/>
                     </button>
                  </div>
               </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
               <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-50 pb-4">Review Your Order</h2>
                  
                  <div className="space-y-8">
                     <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Shipping To</h3>
                        <p className="font-bold text-gray-900">{address}, {city}</p>
                        <p className="text-gray-500">{postalCode}, {country}</p>
                     </div>

                     <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Payment Via</h3>
                        <p className="font-bold text-gray-900">{paymentMethod === 'PayPal' ? 'PayPal / Credit Card' : 'Cash on Delivery'}</p>
                     </div>

                     <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Order Items</h3>
                        <div className="divide-y divide-gray-50">
                           {cartItems.map(item => (
                              <div key={item.id} className="py-4 flex items-center justify-between">
                                 <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-50 border rounded-lg p-1">
                                       <img src={item.image} className="w-full h-full object-contain" alt={item.title}/>
                                    </div>
                                    <span className="font-bold text-gray-900 text-sm">{item.title} <span className="text-gray-400">×{item.qty}</span></span>
                                 </div>
                                 <span className="font-bold text-gray-900">₹{item.price * item.qty}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="mt-10 flex justify-between border-t border-gray-50 pt-8">
                     <button onClick={() => setStep(2)} className="text-gray-400 font-bold flex items-center gap-2 hover:text-gray-900 transition">
                        <ArrowLeft size={18}/> Back to Payment
                     </button>
                     <button 
                        onClick={placeOrderHandler}
                        disabled={loading}
                        className="bg-primary text-white px-12 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-dark transition shadow-lg shadow-primary/30"
                     >
                        {loading ? <Loader2 className="animate-spin"/> : 'Confirm Purchase'} <CheckCircle size={20}/>
                     </button>
                  </div>
               </div>
            )}
         </div>

         <div className="w-full lg:w-1/3 bg-gray-50 rounded-3xl p-8 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Order Total</h3>

            {/* Coupon Input */}
            <div className="mb-5">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1"><Tag className="w-3 h-3" /> Promo Code</p>
              {couponData ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
                  <div>
                    <p className="text-xs font-bold text-green-700">{couponData.code} applied!</p>
                    <p className="text-xs text-green-600">{couponData.message}</p>
                  </div>
                  <button onClick={() => { setCouponData(null); setCouponCode(''); }} className="text-green-500 hover:text-red-500"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    placeholder="Enter code..."
                    onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                    className="bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition disabled:opacity-50"
                  >
                    {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                  </button>
                </div>
              )}
              {couponError && <p className="text-red-500 text-xs mt-1.5">{couponError}</p>}
            </div>

            <div className="space-y-4 mb-6">
               <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="font-bold text-gray-900">₹{cartTotal}</span>
               </div>
               {discount > 0 && (
                 <div className="flex justify-between text-sm text-green-600">
                   <span>Discount ({couponData.code})</span>
                   <span className="font-bold">- ₹{discount.toFixed(2)}</span>
                 </div>
               )}
               <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping</span>
                  <span className="text-success font-bold">Free</span>
               </div>
               <div className="pt-4 border-t border-gray-200 flex justify-between items-end">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-bold text-primary tracking-tight">₹{finalTotal.toFixed(2)}</span>
               </div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-200 text-xs text-gray-400 flex items-center gap-3">
               <CheckCircle size={20} className="text-success flex-shrink-0" />
               <p>Secure SSL Encrypted Checkout. Your data is safe with us.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
