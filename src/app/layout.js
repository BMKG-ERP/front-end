'use client';

import './globals.css';
import Sidebar from '@/components/navigation/Sidebar';
import Footer from '@/components/navigation/Footer';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="overflow-x-hidden w-full">
      <body className="min-h-screen w-full overflow-x-hidden flex flex-col">
        <div className="flex flex-grow w-full">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content Area */}
          <div
            className="flex flex-col flex-grow min-h-screen transition-all duration-300 w-full"
            style={{
              maxWidth: '100vw', // Ensures no overflow
              overflowX: 'hidden', // Prevents horizontal scrolling
            }}
          >
            <div className="flex flex-col flex-grow">{children}</div>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
