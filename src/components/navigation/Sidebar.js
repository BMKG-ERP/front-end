'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AiOutlineClose,
  AiOutlineMenu,
  AiOutlineFund,
  AiOutlineCluster,
} from 'react-icons/ai';
import { FaGear } from 'react-icons/fa6';
import Image from 'next/image';
import {
  IoAnalytics,
  IoMapSharp,
  IoHomeSharp,
  IoSettings,
} from 'react-icons/io5';
import { HiChevronRight, HiChevronLeft, HiLibrary } from 'react-icons/hi';
import Link from 'next/link';

// 🟢 Create Context for Sidebar State
const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [expanded, setExpanded] = useState(false);
  const [nav, setNav] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize(); // Initial check
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <SidebarContext.Provider
      value={{ isMobile, expanded, setExpanded, nav, setNav }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

// 🟢 Hook to use Sidebar Context in other components
export const useSidebarContext = () => useContext(SidebarContext);

const menuItems = [
  { href: '/', icon: <IoHomeSharp size={28} />, label: 'Home' },
  {
    href: '/stations',
    icon: <AiOutlineCluster size={28} />,
    label: 'Stations',
  },
  { href: '/equipment', icon: <FaGear size={28} />, label: 'Equipment' },
  {
    href: '/diagnostic',
    icon: <AiOutlineFund size={28} />,
    label: 'Diagnostic',
  },
  // { href: '/contact', icon: <IoSettings size={28} />, label: 'Contact' },
];

const Sidebar = () => {
  const { isMobile, expanded, setExpanded, nav, setNav } = useSidebarContext();

  return (
    <>
      {/* ✅ Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => {
            setNav(!nav);
            setExpanded(!nav);
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
                className="group flex items-center gap-4 py-2 transition-all duration-300 relative"
              >
                {/* Icon */}
                <span className="w-8 flex justify-center relative">
                  {icon}

                  {/* Tooltip */}
                  {!expanded && (
                    <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {label}
                    </span>
                  )}
                </span>

                {/* Label when expanded */}
                {expanded && (
                  <span className="text-white transition-all duration-300">
                    {label}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
