'use client';

import React, { useEffect, useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import Image from 'next/image';
import {
  IoAnalytics,
  IoMapSharp,
  IoHomeSharp,
  IoSettings,
} from 'react-icons/io5';
import { HiChevronRight, HiChevronLeft } from 'react-icons/hi';
import Link from 'next/link';

const menuItems = [
  { href: '/', icon: <IoHomeSharp size={28} />, label: 'Home' },
  { href: '/work', icon: <IoAnalytics size={28} />, label: 'Work' },
  { href: '/about', icon: <IoMapSharp size={28} />, label: 'About' },
  { href: '/contact', icon: <IoSettings size={28} />, label: 'Contact' },
];

const Sidebar = () => {
  const [nav, setNav] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth < 768;
      if (mobileView) {
        setIsMobile(mobileView);
        setNav(mobileView);
        setExpanded(!mobileView);
      }
    };

    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setNav(!nav)}
          className="fixed top-5 left-5 z-50 p-2 bg-blue-500 rounded-full shadow-md"
        >
          {nav ? (
            <AiOutlineClose size={30} color="white" />
          ) : (
            <AiOutlineMenu size={30} color="white" />
          )}
        </button>
      )}

      {/* Sidebar */}
      <nav
        className={`fixed bg-[#191919] text-white transition-all duration-300 z-50 ${
          isMobile
            ? 'bottom-0 left-0 w-full h-14 flex items-center justify-around shadow-md'
            : `top-0 left-0 h-full ${
                expanded ? 'w-48' : 'w-16'
              } flex flex-col justify-between shadow-lg`
        }`}
      >
        {/* Logo and Expand Button */}
        {!isMobile && (
          <>
            <Image
              className="mt-4 mb-6 mx-auto"
              src="/logo_bmkg_mini.png"
              width={50}
              height={50}
              alt="Sidebar Logo"
            />
            <button
              className="bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-700 mx-auto"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <HiChevronLeft size={24} />
              ) : (
                <HiChevronRight size={24} />
              )}
            </button>
          </>
        )}

        {/* Sidebar Links */}
        <ul className="flex flex-col items-start justify-start gap-y-6 w-full px-4 mt-6">
          {menuItems.map(({ href, icon, label }, index) => (
            <li key={index} className="hover:opacity-100 opacity-70 w-full">
              <Link
                href={href}
                className="flex items-center gap-4 py-2 transition-all duration-300"
              >
                <span className="w-8 flex justify-center">{icon}</span>
                <span
                  className={`text-white transition-all duration-300 ${
                    expanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                  }`}
                  style={{ minWidth: expanded ? 'max-content' : '0px' }}
                >
                  {label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
