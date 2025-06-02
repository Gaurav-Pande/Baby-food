import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white shadow-md py-3' 
        : 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md py-5'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-3">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="20" fill={isScrolled ? "#0EA5E9" : "white"} fillOpacity={isScrolled ? "1" : "0.2"} />
                <circle cx="20" cy="20" r="16" fill={isScrolled ? "#38BDF8" : "white"} fillOpacity={isScrolled ? "0.8" : "0.4"} />
                <path d="M14,12 C14,8.6862915 16.6862915,6 20,6 C23.3137085,6 26,8.6862915 26,12 C26,15.3137085 23.3137085,18 20,18 C16.6862915,18 14,15.3137085 14,12 Z" fill={isScrolled ? "#0EA5E9" : "white"} />
                <path d="M28,26 C28,26 28,24 20,24 C12,24 12,26 12,26 L12,28 C12,28 12,34 20,34 C28,34 28,28 28,28 L28,26 Z" fill={isScrolled ? "#0EA5E9" : "white"} />
              </svg>
            </div>
            <div>
              <h1 className={`text-3xl font-bold font-display tracking-tight ${isScrolled ? 'text-primary' : 'text-white'}`}>
                NutriTot
              </h1>
              <p className={`text-sm font-medium ${isScrolled ? 'text-gray-500' : 'text-primary-100'}`}>
                Baby Food Analyzer for Ages 1-3
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className={`px-4 py-2 rounded-full backdrop-blur-sm ${
              isScrolled 
                ? 'bg-primary-50 text-primary-dark' 
                : 'bg-white bg-opacity-20 text-white'
            }`}>
              <span className="text-sm font-medium">Healthy choices for growing minds</span>
            </div>
            
            <a href="#features" className={`text-sm font-medium transition-colors ${
              isScrolled ? 'text-gray-600 hover:text-primary' : 'text-white hover:text-primary-100'
            }`}>
              Features
            </a>
            
            <a href="#how-it-works" className={`text-sm font-medium transition-colors ${
              isScrolled ? 'text-gray-600 hover:text-primary' : 'text-white hover:text-primary-100'
            }`}>
              How It Works
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
