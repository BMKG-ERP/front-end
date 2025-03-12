'use client';

import React, { useEffect, useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import Link from 'next/link';

const Navigation = (props) => {
  const [nav, setNav] = useState(false);
  const [navVisible, setNavVisible] = useState(false);

  const navHandler = () => {
    setNav(!nav);
  };

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    setNav(false);

    const handleScroll = () => {
      const distanceToShowNav = 800;
      const currentScrollY = window.scrollY;

      if (currentScrollY > distanceToShowNav) {
        setNavVisible(true);
      } else if (window.innerWidth <= 768) {
        setNavVisible(true);
      } else {
        setNavVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const iconSize =
    typeof window !== 'undefined' && window.innerWidth >= 640 ? 30 : 15;

  return (
    <div
      className={`transition-all duration-1000 ${
        navVisible ? 'opacity-100' : 'opacity-0 '
      }`}
    >
      <div className="fixed bg-transparent mr-8 top-0 mt-5 right-0 z-50 h-[8vw] w-[8vw] md:w-[4vw] md:h-[4vw] text-white">
        <div className="flex items-center justify-center  bg-blue-500 rounded-full w-full h-full z-20">
          <div
            onClick={navHandler}
            className="bg-blue-500 justify-center rounded-full w-full h-full z-20 flex items-center"
          >
            {nav ? (
              <AiOutlineClose size={iconSize} />
            ) : (
              <AiOutlineMenu size={iconSize} />
            )}
          </div>
        </div>

        <div
          className={` transition-all duration-1000
            ${
              nav
                ? ' fixed  right-0  top-0 md:w-[33%] w-full h-full  border-r ease-in-out transition-all transform duration-1000 z-10 bg-[#191919]'
                : 'fixed right-[-100%] top-0 md:w-[33%] w-full h-full  border-r pointer-events-none z-10 bg-black'
            }`}
        >
          <div className="flex w-full h-[15vh]">
            <div className="border-b-2 flex items-end flex-row w-full mx-10">
              <h2 className="flex-1 text-center mb-10">Navigation</h2>
            </div>
          </div>
          <ul
            className={
              'text-5xl p-4 mt-[10vh] md:ml-10 md:overflow-visible overflow-hidden'
            }
          >
            <li className="p-4 border-b border-gray-dark font-sans opacity-[60%] hover:opacity-[100%]">
              <Link
                href="/"
                onClick={() => {
                  navHandler();
                  scrollToTop();
                }}
              >
                Home
              </Link>
            </li>
            <li className="p-4 border-b border-gray-dark font-sans opacity-[60%] hover:opacity-[100%]">
              <Link
                href="/work"
                onClick={() => {
                  navHandler();
                  scrollToTop();
                }}
              >
                Work
              </Link>
            </li>
            <li className="p-4 border-b border-gray-dark font-sans opacity-[60%] hover:opacity-[100%]">
              <Link
                href="/about"
                onClick={() => {
                  navHandler();
                  scrollToTop();
                }}
              >
                About
              </Link>
            </li>
            <li className="p-4 border-b border-gray-dark font-sans opacity-[60%] hover:opacity-[100%]">
              <Link
                href="/contact"
                onClick={() => {
                  navHandler();
                  scrollToTop();
                }}
              >
                Contact Me
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
