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
  const [expanded, setExpanded] = useState(false);
  const [nav, setNav] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize(); // Check initially

    window.addEventListener('resize', checkScreenSize); // Listen for resizing
    return () => window.removeEventListener('resize', checkScreenSize); // Cleanup
  }, []);

  return (
    <>
      {/* ✅ Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => {
            setNav(!nav), setExpanded(!nav);
          }}
          className="fixed top-5 left-5 z-[100] p-2 bg-gray-800 rounded-full shadow-md"
        >
          {nav ? (
            <AiOutlineClose size={30} color="white" />
          ) : (
            <AiOutlineMenu size={30} color="white" />
          )}
        </button>
      )}

      {/* ✅ Sidebar */}
      <nav
        className={`fixed bg-[#191919] text-white transition-all duration-300 z-50 ${
          isMobile
            ? nav
              ? 'left-0 w-48 h-full'
              : '-left-full w-48 h-full'
            : `left-0 h-full ${expanded ? 'w-48' : 'w-16'}`
        } shadow-lg`}
      >
        <div className="flex flex-col items-center mt-4 z-50">
          <Image
            src="/logo_bmkg_mini.png"
            width={50}
            height={50}
            alt="Sidebar Logo"
          />
          {!isMobile && (
            <button
              className="bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-700 mt-4"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <HiChevronLeft size={24} />
              ) : (
                <HiChevronRight size={24} />
              )}
            </button>
          )}
        </div>

        {/* ✅ Sidebar Links */}
        <ul className="flex flex-col items-start gap-y-6 px-4 mt-6">
          {menuItems.map(({ href, icon, label }, index) => (
            <li key={index} className="hover:opacity-100 opacity-70 w-full">
              <Link
                href={href}
                className="flex items-center gap-4 py-2 transition-all duration-300"
              >
                <span className="w-8 flex justify-center">{icon}</span>
                <span
                  className={`text-white transition-all duration-300 ${
                    expanded ? 'opacity-100' : 'opacity-0'
                  }`}
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
