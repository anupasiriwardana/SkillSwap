// components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="px-6 py-12 border-t border-gray-700" style={{ backgroundColor: '#1a1625' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: '#a855f7' }}
            >
              S
            </div>
            <span className="text-white text-xl font-bold">SkillSwap</span>
          </div>
          
          {/* Footer Links */}
          <div className="flex space-x-8">
            <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
              About
            </Link>
            <Link to="/how-it-works" className="text-gray-300 hover:text-white transition-colors">
              How it Works
            </Link>
            <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">
              Terms
            </Link>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; 2025 SkillSwap. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;