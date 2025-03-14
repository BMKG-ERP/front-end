'use client';

import './globals.css';
import Navigation from '@/components/navigation/Sidebar';
import Footer from '@/components/navigation/Footer';
import { useState, useEffect } from 'react';

export default function RootLayout({ children }) {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(80); // Default sidebar width

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
        setSidebarWidth(0); // Hide sidebar on mobile
      } else {
        setIsMobile(false);
        setSidebarWidth(80); // Default expanded sidebar width
      }
    };

    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col overflow-x-hidden">
          <div className="flex flex-grow">
            {/* Sidebar */}
            <div
              className="fixed top-0 left-0 h-full bg-[#191919] transition-all duration-300"
              style={{
                width: isMobile ? 0 : sidebarWidth, // Dynamically set width
                overflow: isMobile ? 'hidden' : 'visible',
                pointerEvents: isMobile ? 'none' : 'auto', // Prevent click issues
              }}
            >
              {!isMobile && <Navigation />}
            </div>

            {/* Main Content */}
            <div
              className="flex flex-col flex-grow transition-all duration-300"
              style={{
                paddingLeft: isMobile ? 0 : sidebarWidth, // Ensure alignment
              }}
            >
              {children}
              <Footer />
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
