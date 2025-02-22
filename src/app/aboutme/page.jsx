"use client";
import { motion } from 'framer-motion';
import Image from 'next/image';
import ParticlesComponent from '../components/particlebg';
import {ContactButton} from '../components/contactmeform';
import { useState } from 'react';
import LoginForm from '../components/loginadmin';

const Portfolio = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="min-h-screen flex flex-col items-center font-sans">
      <ParticlesComponent />
      <header className="py-12 text-center shadow-2xl transition duration-300 transform hover:scale-105">
        <motion.h1 
          className="text-6xl font-extrabold text-white transition-all duration-300 hover:text-cyan-300"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Stuart Jeetoo
        </motion.h1>
        <h2 className="text-4xl mt-2 text-cyan-300">Web Developer</h2>
        <p className="mt-4 text-lg text-gray-200 italic">&quot;Newly Graduated, Eager to Innovate!&quot;</p>
      </header>

      <section id="about-me" className="py-10 max-w-3xl px-6 mx-auto">
        <motion.div 
          className="bg-black/30 backdrop-blur-md rounded-2xl shadow-2xl p-8 transition duration-300 hover:scale-105 transform hover:shadow-xl"
          initial={{ scale: 0.9 }}
          whileHover={{ scale: 0.92 }}
        >
          <h2 className="text-5xl font-semibold mb-4 text-white text-center md:text-left">About Me</h2>
          <div className="flex flex-col md:flex-row items-center">
            <div className="relative w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 overflow-hidden rounded-full m-10">
              <Image 
                src="/heroimg.jpg" // Update with your image path
                alt="Stuart Jeetoo"
                layout="fill" // Use fill layout to cover the parent div
                className="object-cover transition-transform duration-300 transform hover:scale-150"
              />
            </div>
            <div className="flex-1">
              <p className="text-lg text-white">
                I&apos;m a recent software engineering graduate from the University of Technology Mauritius, set to receive my degree in April 2025. With a passion for creating innovative solutions, I have experience in full-stack development and am eager to contribute to exciting projects.
              </p>
              <p className="mt-4 text-lg text-white">
                I enjoy learning new technologies and applying them to real-world problems. My interests lie in web development, where I can combine creativity with functionality to build engaging user experiences.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="contact" className="py-10 max-w-3xl px-6 mx-auto">
        <motion.div 
          className="bg-black/30 backdrop-blur-md rounded-2xl shadow-2xl p-8 transition duration-300 hover:scale-105 transform hover:shadow-xl"
          initial={{ scale: 0.9 }}
          whileHover={{ scale: 0.92 }}
        >
          <h2 className="text-5xl font-semibold mb-4 text-white">Contact Me</h2>
          <p className="text-lg text-white mb-4">I would love to hear from you! Feel free to reach out for collaboration or job opportunities.</p>
      <ContactButton isOpen={isModalOpen} toggleModal={toggleModal} />
        </motion.div>
      </section>
<LoginForm />
    </div>
  );
};

export default Portfolio;
