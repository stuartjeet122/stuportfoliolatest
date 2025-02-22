import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 pb-36 border-t border-gray-600">
      <div className="container mx-auto flex flex-col items-center">
        <div className="flex space-x-8 mb-6">
          {[
            { icon: <FaGithub />, href: "https://github.com/stuartjeet122" },
            { icon: <FaLinkedin />, href: "https://www.linkedin.com/in/stuart-jeetoo" },
          ].map((social, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.2, rotate: 360 }}
              transition={{ type: "spring", duration: 2 , stiffness: 300 }}
            >
              <a href={social.href} target="_blank" rel="noopener noreferrer">
                <span className="text-4xl transition duration-200 hover:text-green-400">
                  {social.icon}
                </span>
              </a>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-sm">
          &copy; {new Date().getFullYear()} Stuart Jeetoo. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
