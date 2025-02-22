'use client';
import Link from 'next/link';
import Image from 'next/image'; // Import Image from next/image
import Background from './components/particlebg';

const Custom404 = () => {
  return (
    <>
        <Background />
      <div className="flex flex-col items-center justify-center min-h-screen relative">
        
        <div className="flex flex-col items-center justify-center max-w-lg w-full mx-auto text-center relative z-10 bg-gray-900 bg-opacity-70 shadow-2xl rounded-lg p-10 m-4 transform transition-all duration-300 hover:scale-105">
          <div className="flex justify-center mb-6">
            {/* Centered Logo using Next.js Image component */}
            <Image
            loading='lazy'
              src="/logo/logo.png" // Replace with your local image path
              alt="Logo"
              width={150} // Specify the width
              height={150} // Specify the height
              className="w-1/2 h-auto sm:w-1/3 md:w-1/4" // Optional responsive classes
            />
          </div>
          <h1 className="text-8xl font-bold text-red-400 animate-bounce sm:text-6xl md:text-7xl">404</h1>
          <p className="mt-4 text-lg text-white font-semibold sm:text-base md:text-lg">Oops! Page Not Found</p>
          <p className="mt-2 text-gray-400 sm:text-sm md:text-base">The page you are looking for does not exist.</p>
          
          {/* Using Next.js Link component */}
          <Link prefetch={true} href="/" className="mt-8 inline-block px-8 py-4 text-white bg-gradient-to-r from-green-500 to-blue-600 rounded-lg shadow-md hover:shadow-xl transition duration-200 transform hover:scale-105" passHref>
              Go Back to Home
          </Link>
        </div>
      </div>
    </>
  );
};

export default Custom404;
