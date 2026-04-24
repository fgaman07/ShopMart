import React, { useEffect, useState } from 'react';
import { Search, User, Heart, ShoppingBag, Menu, MapPin, LogOut, ChevronDown, Tag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from './NotificationBell';

export default function Header() {
   const { cartCount } = useCart();
   const { userInfo, logout } = useAuth();
   const [showUserDropdown, setShowUserDropdown] = useState(false);
   const [userLocation, setUserLocation] = useState(null);
   const [keyword, setKeyword] = useState('');
   const navigate = useNavigate();

   useEffect(() => {
      // Try to get location from local storage first
      const savedLoc = localStorage.getItem('userLocation');
      if (savedLoc) {
         setUserLocation(JSON.parse(savedLoc));
      } else {
         // Ask for location
         if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
               (position) => {
                  const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
                  setUserLocation(loc);
                  localStorage.setItem('userLocation', JSON.stringify(loc));
                  // Trigger a custom event so other components know location was found
                  window.dispatchEvent(new Event('locationUpdated'));
               },
               (error) => {
                  console.error("Error getting location", error);
               }
            );
         }
      }
   }, []);

   return (
      <header className="w-full bg-white border-b border-borderLight shadow-sm pb-1 relative z-50">
         {/* ... (Top banners remain unchanged) ... */}
         <div className="bg-[#634C9F] text-white text-xs py-2 px-4 flex justify-between items-center sm:text-center w-full">
            <div className="hidden md:block w-1/4"></div>
            <div className="flex-grow text-center font-medium">
               FREE delivery & 40% Discount for next 3 orders! Place your 1st order in.
            </div>
            <div className="hidden md:flex w-1/4 justify-end space-x-4 opacity-90 text-[11px]">
               <span>Until the end of the sale: <strong className="font-bold text-sm">47</strong> days <strong className="font-bold text-sm">06</strong> hours <strong className="font-bold text-sm">55</strong> minutes</span>
            </div>
         </div>

         <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex justify-between items-center py-2 text-[11px] text-gray-500 border-b border-gray-100 hidden sm:flex">
            <div className="flex space-x-4">
               <Link to="#" className="hover:text-primary">About Us</Link>
               <Link to="#" className="hover:text-primary">My account</Link>
               <Link to="#" className="hover:text-primary">Wishlist</Link>
               <span>We deliver to you every day from <strong className="text-orange-500 font-semibold">7:00 to 23:00</strong></span>
            </div>
            <div className="flex space-x-4">
               <Link to="#" className="hover:text-primary">English ▾</Link>
               <Link to="#" className="hover:text-primary">USD ▾</Link>
               <Link to="#" className="hover:text-primary">Order Tracking</Link>
            </div>
         </div>

         <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-5 flex items-center justify-between gap-6">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
               <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">S</div>
               <span className="text-xl md:text-2xl font-bold font-inter text-primary tracking-tight">ShopStore</span>
            </Link>

            {/* Location */}
            <div className="hidden xl:flex items-center text-xs opacity-80 flex-shrink-0 cursor-pointer">
               <MapPin size={16} className={userLocation ? "text-primary mr-1" : "text-gray-400 mr-1"} />
               <div className="leading-tight">
                  <span className="block text-gray-500">Deliver to</span>
                  <span className="font-semibold text-black">{userLocation ? 'Current Location' : 'all'}</span>
               </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={(e) => {
               e.preventDefault();
               if (keyword.trim()) {
                  navigate(`/shop?keyword=${keyword}`);
               } else {
                  navigate('/shop');
               }
            }} className="flex-grow max-w-3xl hidden md:flex relative border-2 border-gray-100 bg-gray-50 rounded-md items-center">
               <input
                  type="text"
                  placeholder="Search for food, cuisines or restaurants..."
                  className="w-full bg-transparent px-4 py-3 text-sm focus:outline-none"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
               />
               <button type="submit" className="pr-4 text-gray-500 hover:text-primary"><Search size={20} /></button>
            </form>

            {/* Right Icons */}
            <div className="flex items-center space-x-4 md:space-x-8 flex-shrink-0">
               {userInfo ? (
                  <div className="relative">
                     <button
                        onClick={() => setShowUserDropdown(!showUserDropdown)}
                        className="flex items-center gap-2 hover:text-primary transition group"
                     >
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                           {userInfo.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="hidden lg:block text-left text-xs leading-tight">
                           <span className="text-gray-400 block font-normal">Welcome,</span>
                           <span className="font-bold text-black block flex items-center gap-1">
                              {userInfo.name.split(' ')[0]}
                              <ChevronDown size={12} className={`transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
                           </span>
                        </div>
                     </button>

                     {showUserDropdown && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50">
                           <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary transition" onClick={() => setShowUserDropdown(false)}>
                              <User size={16} /> My Profile
                           </Link>
                           <Link to="/orders" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary transition" onClick={() => setShowUserDropdown(false)}>
                              <ShoppingBag size={16} /> My Orders
                           </Link>
                           {userInfo.isAdmin && (
                              <>
                                 <hr className="my-2 border-gray-100" />
                                 <Link to="/admin/userlist" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary transition" onClick={() => setShowUserDropdown(false)}>
                                    <User size={16} /> Users
                                 </Link>
                                 <Link to="/admin/productlist" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary transition" onClick={() => setShowUserDropdown(false)}>
                                    <ShoppingBag size={16} /> Products
                                 </Link>
                                 <Link to="/admin/coupons" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary transition" onClick={() => setShowUserDropdown(false)}><Tag size={16} /> Coupons</Link>
                                  <Link to="/admin/orderlist" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary transition" onClick={() => setShowUserDropdown(false)}>
                                    <ShoppingBag size={16} /> Orders
                                 </Link>
                              </>
                           )}
                           <hr className="my-2 border-gray-100" />
                           <button
                              onClick={() => { logout(); setShowUserDropdown(false); }}
                              className="flex items-center gap-3 px-4 py-3 text-sm text-danger hover:bg-danger/5 w-full text-left transition"
                           >
                              <LogOut size={16} /> Logout
                           </button>
                        </div>
                     )}
                  </div>
               ) : (
                  <Link to="/login" className="flex items-center gap-2 hover:text-primary transition">
                     <User size={24} strokeWidth={1.5} className="text-gray-700" />
                     <div className="text-xs leading-tight">
                        <span className="text-gray-400 block">Sign In</span>
                        <span className="font-semibold text-black block text-[13px]">Account</span>
                     </div>
                  </Link>
               )}

               <Link to="/wishlist" className="relative group hover:text-primary hidden sm:block">
                  <Heart size={26} strokeWidth={1.5} className="text-gray-700" />
                  <span className="absolute -top-1 -right-2 bg-danger text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">0</span>
               </Link>
               <NotificationBell />
               <Link to="/cart" className="relative group hover:text-primary">
                  <ShoppingBag size={26} strokeWidth={1.5} className="text-gray-700" />
                  <span className="absolute -top-1 -right-2 bg-danger text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">{cartCount}</span>
               </Link>
            </div>
         </div>
      </header>
   );
}
