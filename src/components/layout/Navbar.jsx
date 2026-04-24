import { Link } from 'react-router-dom';
import { Search, MapPin, ShoppingCart, User } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-primary text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold font-inter tracking-wide">
              FreshCart
            </Link>
          </div>

          {/* Location Dropdown - Hidden on Mobile */}
          <div className="hidden md:flex items-center text-sm ml-6 hover:text-primaryLight cursor-pointer transition">
            <MapPin size={18} className="mr-1" />
            <div className="flex flex-col text-xs leading-tight">
              <span className="text-gray-200">Deliver to:</span>
              <span className="font-semibold">24, MG Road, Bangalore 560001</span>
            </div>
          </div>

          {/* Search Bar - Flex Grow */}
          <div className="flex-grow max-w-2xl px-8 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for groceries, snacks..."
                className="w-full bg-white text-neutral-800 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-primaryLight placeholder-gray-400"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition">
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-6">
            <Link to="/profile" className="hidden md:flex items-center hover:text-primaryLight transition">
              <User size={20} className="mr-1" />
              <span className="text-sm font-medium">Sign In</span>
            </Link>
            
            <Link to="/orders" className="hidden md:block text-sm font-medium hover:text-primaryLight transition">
              Orders
            </Link>

            {/* Cart Button */}
            <Link to="/cart" className="relative group">
              <div className="flex items-center p-2 bg-primaryDark rounded-lg hover:bg-opacity-80 transition cursor-pointer">
                <ShoppingCart size={24} />
                {/* Badge */}
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-xs font-bold text-white shadow-sm ring-2 ring-primary">
                  3
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Mobile Search - Visible only on small screens */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-white text-neutral-800 rounded-lg pl-4 pr-10 py-2 focus:outline-none"
            />
            <Search size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>
    </nav>
  );
}
