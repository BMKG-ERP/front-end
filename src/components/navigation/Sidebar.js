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

const Sidebar = () => {
  const [nav, setNav] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth < 768;
      setIsMobile(mobileView);
      setNav(!mobileView); // Open on desktop, closed on mobile
      setExpanded(!mobileView); // Expanded on desktop, collapsed on mobile
    };

    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const navHandler = () => {
    if (isMobile) setNav(!nav);
  };

  return (
    <div className="z-50">
      {/* Mobile Menu Button */}
      {isMobile && (
        <div className="fixed top-5 left-5 z-50">
          <button
            onClick={navHandler}
            className="p-2 bg-blue-500 rounded-full shadow-md"
          >
            {nav ? (
              <AiOutlineClose size={30} color="white" />
            ) : (
              <AiOutlineMenu size={30} color="white" />
            )}
          </button>
        </div>
      )}

      {/* Sidebar Sidebar */}
      <div
        className={`fixed bg-[#191919] text-white transition-all duration-300 z-50 ${
          isMobile
            ? `bottom-0 left-0 w-full h-14 flex items-center justify-around shadow-md`
            : `top-0 left-0 h-full ${
                expanded ? 'w-48' : 'w-16'
              } flex flex-col justify-between shadow-lg`
        }`}
      >
        {/* Sidebar Content */}
        <div className="flex flex-col items-center w-full h-full pt-6">
          {/* Logo (Top) */}
          <Image
            className="mt-4 mb-6"
            src="/logo_bmkg_mini.png"
            width={50}
            height={50}
            alt="Sidebar Logo"
          />

          {/* Expand/Collapse Button (Below Logo) */}
          {!isMobile && (
            <button
              className="mb-6 justify-right items-end bg-gray-800 p-2 rounded-full shadow-md mt-10 hover:bg-gray-700"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <HiChevronLeft size={24} />
              ) : (
                <HiChevronRight size={24} />
              )}
            </button>
          )}

          {/* Sidebar Links (Centered Vertically) */}
          <ul className="flex mt-20 top-0 flex-col items-center justify-top flex-grow gap-y-6 w-full">
            {[
              { href: '/', icon: <IoHomeSharp size={28} />, label: 'Home' },
              { href: '/work', icon: <IoAnalytics size={28} />, label: 'Work' },
              {
                href: '/about',
                icon: <IoMapSharp size={28} />,
                label: 'About',
              },
              {
                href: '/contact',
                icon: <IoSettings size={28} />,
                label: 'Contact',
              },
            ].map((item, index) => (
              <li key={index} className="hover:opacity-100 opacity-70 w-full">
                <Link
                  href={item.href}
                  className="flex items-center gap-4 px-4 py-2"
                >
                  {item.icon}
                  {expanded && <span className="text-white">{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
