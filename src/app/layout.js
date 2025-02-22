'use client';

import './globals.css';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './components/navbar';
import Footer from './components/footer';
import { SessionProvider } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copyAlert, setCopyAlert] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]); 

  useEffect(() => {
    const handleContextMenu = (event) => {
      event.preventDefault();
    };

    const handleCopy = (event) => {
      event.preventDefault();
      setCopyAlert(true);
      setTimeout(() => setCopyAlert(false), 2000);
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
    };
  }, []);

  useEffect(() => {
    const gtagScript = document.createElement('script');
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-9N2ZFLH1LE';
    gtagScript.async = true;
    document.head.appendChild(gtagScript);

    const gtagInlineScript = document.createElement('script');
    gtagInlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-9N2ZFLH1LE');
    `;
    document.head.appendChild(gtagInlineScript);
  }, []);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <html lang='en'>
      <body className="flex flex-col min-h-screen w-screen overflow-x-hidden">
        <SessionProvider>
          <Navbar isMenuOpen={isMenuOpen} onMenuToggle={toggleMenu} />
          <main className="flex-1">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
          <Footer />
          {copyAlert && (
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow-lg">
              You are not allowed to copy!
            </div>
          )}
        </SessionProvider>
      </body>
    </html>
  );
}
