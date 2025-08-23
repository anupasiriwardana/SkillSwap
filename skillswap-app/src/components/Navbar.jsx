import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 px-6 py-4 border-b border-gray-700" style={{ backgroundColor: '#1a1625' }}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: '#a855f7' }}
          >
            S
          </div>
          <span className="text-white text-xl font-bold">SkillSwap</span>
        </Link>
        
        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8">
          <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
            About
          </Link>
          <Link to="/how-it-works" className="text-gray-300 hover:text-white transition-colors">
            How it Works
          </Link>
        </div>
        
        {/* Auth Buttons */}
        <div className="flex space-x-4">
          <Link 
            to="/login"
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Login
          </Link>
          <Link 
            to="/signup"
            className="px-6 py-2 rounded-lg text-white font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: '#a855f7' }}
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;