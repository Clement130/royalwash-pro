'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-white backdrop-blur-sm shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">RW</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Royal Wash Pro
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#accueil" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Accueil
            </Link>
            <Link href="#services" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Services
            </Link>
            <Link href="#tarifs" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Tarifs
            </Link>
            <Link href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Contact
            </Link>
            <Link
              href="#contact"
              className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-full hover:shadow-lg hover:scale-105 transition-all font-medium"
            >
              Réserver
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-4">
              <Link href="#accueil" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Accueil
              </Link>
              <Link href="#services" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Services
              </Link>
              <Link href="#tarifs" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Tarifs
              </Link>
              <Link href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Contact
              </Link>
              <Link
                href="#contact"
                className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-full text-center hover:shadow-lg transition-all font-medium"
              >
                Réserver
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
