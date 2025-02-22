'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Router from 'next/router';
import { useSession } from 'next-auth/react'; // Import useSession
import { FaHome, FaLightbulb, FaUserGraduate, FaLaptopCode, FaAddressCard } from 'react-icons/fa';
import LoadingSpinner from './loadingspinner';

export default function Navbar({ isMenuOpen, onMenuToggle }) {
  const currentPath = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession(); // Access the session data

  useEffect(() => {
    const handleRouteChangeStart = () => setIsLoading(true);
    const handleRouteChangeComplete = () => setIsLoading(false);
    const handleRouteChangeError = () => setIsLoading(false);

    Router.events.on('routeChangeStart', handleRouteChangeStart);
    Router.events.on('routeChangeComplete', handleRouteChangeComplete);
    Router.events.on('routeChangeError', handleRouteChangeError);

    return () => {
      Router.events.off('routeChangeStart', handleRouteChangeStart);
      Router.events.off('routeChangeComplete', handleRouteChangeComplete);
      Router.events.off('routeChangeError', handleRouteChangeError);
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Define the navigation links based on the session status
  const navLinks = session
    ? [  // If logged in
        { href: "/", icon: <FaHome />, label: "Home" },
        { href: "/manageskills", icon: <FaLightbulb />, label: "Manage Skills" },
        { href: "/manageprojects", icon: <FaLaptopCode />, label: "Manage Projects" },
        { href: "/manageeducation", icon: <FaUserGraduate />, label: "Manage Experience" },
        { href: "/aboutme", icon: <FaAddressCard />, label: "About Me" },
      ]
    : [  // If not logged in
        { href: "/", icon: <FaHome />, label: "Home" },
        { href: "/skills", icon: <FaLightbulb />, label: "Skills" },
        { href: "/project", icon: <FaLaptopCode />, label: "Projects" },
        { href: "/education", icon: <FaUserGraduate />, label: "Experience" },
        { href: "/aboutme", icon: <FaAddressCard />, label: "About Me" },
      ];

  return (
    <div
    className="lg:fixed lg:bottom-0 lg:left-0 lg:right-0 shadow-lg sm:relative lg:mb-8 sm:rounded-none lg:rounded-2xl z-50 lg:container w-full lg:mx-auto"
    style={{
      background: 'rgba(0, 0, 0, 0.30)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(5px)',
      WebkitBackdropFilter: 'blur(5px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    }}
  >
  
      <div className="px-4 mx-auto max-w-7xl sm:px-6">
        <div className="relative pt-2 pb-2 sm:pb-4">
          <nav className="relative flex items-center justify-between sm:h-10 md:justify-center" aria-label="Global">
            <div className="flex items-center flex-1 md:absolute md:inset-y-0 md:left-0">
              <div className="flex items-center justify-between w-full md:w-auto">
                <Link prefetch={true} href="/" passHref className="mx-10">
                  <span className="sr-only">Stuart Portfolio</span>
                  <Image src="/logo/logo.png" width={202} height={40} alt="Logo" className="w-auto h-8 sm:h-10" loading="lazy" />
                </Link>
                <div className="flex items-center -mr-2 md:hidden">
                  <button
                    onClick={onMenuToggle}
                    className="md:hidden p-2 text-gray-300 bg-gray-700 rounded-md"
                    aria-expanded={isMenuOpen}
                  >
                    <span className="sr-only">Open main menu</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      aria-hidden="true"
                      className="w-6 h-6 text-white"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="hidden md:flex md:space-x-10 list-none">
              {navLinks.map(({ href, icon, label }, index) => (
                <div className="relative group flex flex-col items-center pt-2" key={index}>
                  <Link
                    href={href}
                    prefetch={true}
                    className={`flex items-center text-gray-300 transition-transform duration-200 group-hover:scale-150 ${
                      currentPath === href ? 'text-white font-bold' : 'hover:text-white'
                    }`}
                  >
                    <span className="text-3xl">{icon}</span>
                  </Link>
                  <span className="text-sm text-gray-300">{label}</span>
                </div>
              ))}
            </div>
          </nav>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="space-y-1 px-2 pt-2 pb-3">
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    prefetch={true}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      currentPath === href ? 'text-white bg-gray-700' : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
