import React from 'react';
import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#F7F7F8] border-t border-gray-200 mt-16 pt-16">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        
        {/* Newsletter Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-12 mb-12">
          <div className="mb-6 md:mb-0 max-w-lg">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Join our newsletter for £10 offs</h2>
            <p className="text-gray-500 text-xs leading-relaxed">
              Register now to get latest updates on promotions & coupons. Don't worry, we not spam!
            </p>
          </div>
          <div className="w-full md:w-[450px]">
            <div className="flex w-full items-center bg-white border border-gray-200 rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-primary/50 transition">
              <div className="pl-4 text-gray-400">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="w-full px-3 py-3 text-sm focus:outline-none placeholder-gray-400 text-gray-700"
              />
              <button onClick={() => alert('Thanks for subscribing to our newsletter!')} className="bg-[#634C9F] text-white px-6 py-3 text-sm font-semibold hover:bg-opacity-90 transition">
                SEND
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-3 font-medium">
              By subscribing you agree to our <Link to="/" className="text-primary hover:underline">Terms & Conditions and Privacy & Cookies Policy</Link>.
            </p>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Column 1 */}
          <div className="col-span-1">
            <h3 className="font-bold text-gray-900 mb-6 text-sm">Do You Need Help ?</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Autoselligen syr. Nek diarak flobomba. Nör antipol kynoda nynat. Pressa tårmoska.
            </p>
            <div className="flex items-start gap-3 mb-4">
              <div className="text-gray-400 mt-1">📞</div>
              <div>
                <span className="block text-xs text-gray-500 mb-1">Monday-Friday: 08am-9pm</span>
                <span className="block text-lg font-bold text-gray-900">0 800 300-353</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-gray-400 mt-1">✉️</div>
              <div>
                <span className="block text-xs text-gray-500 mb-1">Need help with your order?</span>
                <span className="block text-sm font-bold text-gray-900">info@example.com</span>
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6 text-sm">Make Money with Us</h3>
            <ul className="space-y-3">
              <li><Link to="/shop" className="text-[13px] text-gray-500 hover:text-primary transition">Sell on ShopStore</Link></li>
              <li><Link to="/shop" className="text-[13px] text-gray-500 hover:text-primary transition">Sell Your Services</Link></li>
              <li><Link to="/shop" className="text-[13px] text-gray-500 hover:text-primary transition">Sell on ShopStore Business</Link></li>
              <li><Link to="/" className="text-[13px] text-gray-500 hover:text-primary transition">Become an Affiliate</Link></li>
              <li><Link to="/" className="text-[13px] text-gray-500 hover:text-primary transition">Advertise Your Products</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6 text-sm">Let Us Help You</h3>
            <ul className="space-y-3">
              <li><Link to="/orders" className="text-[13px] text-gray-500 hover:text-primary transition">Your Orders</Link></li>
              <li><Link to="/orders" className="text-[13px] text-gray-500 hover:text-primary transition">Returns & Replacements</Link></li>
              <li><Link to="/" className="text-[13px] text-gray-500 hover:text-primary transition">Shipping Rates & Policies</Link></li>
              <li><Link to="/" className="text-[13px] text-gray-500 hover:text-primary transition">Refund and Returns Policy</Link></li>
              <li><Link to="/" className="text-[13px] text-gray-500 hover:text-primary transition">Privacy Policy</Link></li>
              <li><Link to="/" className="text-[13px] text-gray-500 hover:text-primary transition">Terms and Conditions</Link></li>
              <li><Link to="/" className="text-[13px] text-gray-500 hover:text-primary transition">Help Center</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6 text-sm">Get to Know Us</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-[13px] text-gray-500 hover:text-primary transition">Careers</Link></li>
              <li><Link to="/" className="text-[13px] text-gray-500 hover:text-primary transition">About ShopStore</Link></li>
              <li><Link to="/" className="text-[13px] text-gray-500 hover:text-primary transition">Customer reviews</Link></li>
              <li><Link to="/" className="text-[13px] text-gray-500 hover:text-primary transition">Store Locations</Link></li>
            </ul>
          </div>

          {/* Column 5 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6 text-sm">Download our app</h3>
            <div className="space-y-4 mb-8">
              <Link to="/shop" className="flex flex-col border border-gray-200 bg-white rounded-md p-2 w-32 hover:border-gray-300 transition">
                <span className="text-[9px] text-gray-500 px-1">Download App Get</span>
                <span className="text-[10px] font-bold px-1 text-gray-700">-10% Discount</span>
              </Link>
              <Link to="/shop" className="flex flex-col border border-gray-200 bg-white rounded-md p-2 w-32 hover:border-gray-300 transition">
                <span className="text-[9px] text-gray-500 px-1">Download App Get</span>
                <span className="text-[10px] font-bold px-1 text-gray-700">-20% Discount</span>
              </Link>
            </div>
            <div>
              <p className="text-[11px] text-gray-500 mb-3">Follow us on social media:</p>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary cursor-pointer transition">f</div>
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary cursor-pointer transition">𝕏</div>
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary cursor-pointer transition">in</div>
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary cursor-pointer transition">ig</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 py-6 flex flex-col md:flex-row justify-between items-center text-[11px] text-gray-500">
          <p>Copyright 2026 © ShopStore Theme. All right reserved.</p>
          <div className="flex gap-4 font-medium mt-4 md:mt-0">
            <Link to="/" className="hover:text-primary hover:underline">Terms and Conditions</Link>
            <Link to="/" className="hover:text-primary hover:underline">Privacy Policy</Link>
            <Link to="/orders" className="hover:text-primary hover:underline">Order Tracking</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
