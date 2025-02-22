import { useState, useRef, useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion'; // Import Framer Motion

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoginVisible, setIsLoginVisible] = useState(false); // State to control login form visibility
  const [loading, setLoading] = useState(false); // Loading state for forgot password
  const [forgotSuccess, setForgotSuccess] = useState(false); // Success state
  const router = useRouter();
  const { data: session } = useSession(); // Get the session data
  const modalRef = useRef(null); // Reference for the modal div

  // Close modal when clicking outside
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setIsLoginVisible(false);
    }
  };

  // Add event listener for outside click
  useEffect(() => {
    if (isLoginVisible) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isLoginVisible]);

  const ForgetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setForgotSuccess(false); // Reset success state for retry

    try {
      const response = await fetch('/api/forgetpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setForgotSuccess(true); // Show success indicator
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    if (res?.error) {
      setError('Invalid username or password');
    } else {
      router.push('/'); // Redirect to the homepage or dashboard on successful login
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/'); // Redirect to the homepage or logout page
  };

  const toggleLoginForm = () => {
    setIsLoginVisible(!isLoginVisible); // Toggle login form visibility
  };

  if (session) {
    return (
      <div className="bg-black bg-opacity-50 backdrop-blur-lg rounded-lg shadow-lg p-8 w-full sm:max-w-md mx-4 mb-5 space-y-6">
        <h2 className="text-3xl font-semibold text-white text-center mb-4">Welcome, {session.user?.name}</h2>
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className='bg-black bg-opacity-30 p-6 mb-5 rounded-xl'>
      {/* Toggle Login Button */}
      <motion.button
        onClick={toggleLoginForm}
        className="w-full bg-gradient-to-t from-red-600 to-darkred hover:from-red-700 hover:to-darkred text-white font-semibold py-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 mb-5 px-4"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isLoginVisible ? 'Hide Admin Login' : 'Admin Login'}
      </motion.button>

      {/* Admin Only Message */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-red-600">⚠️ Admin Access Only ⚠️</h3>
      </div>

      {/* Login Form */}
      {isLoginVisible && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            ref={modalRef}
            className="bg-black bg-opacity-90 backdrop-blur-lg rounded-lg shadow-lg p-8 w-full sm:max-w-md mx-4 mb-5"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <h2 className="text-3xl font-semibold text-white text-center mb-6">Admin Login</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-white text-sm font-medium">
                  Admin Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="w-full p-3 mt-2 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-red-500 text-white placeholder-gray-400 bg-transparent transition duration-200 ease-in-out"
                  placeholder="Enter your admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-white text-sm font-medium">
                  Admin Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full p-3 mt-2 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-red-500 text-white placeholder-gray-400 bg-transparent transition duration-200 ease-in-out"
                  placeholder="Enter your admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Login as Admin
              </button>
            </form>
            {/* Forgot Password Button */}
            <button
              className={`container text-center p-3 rounded-lg mt-5 mx-auto w-full ${
                loading ? 'bg-gray-500' : 'bg-white bg-opacity-20'
              } text-white font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none`}
              onClick={ForgetPassword}
              disabled={loading || forgotSuccess}
            >
              {loading ? (
                <div className="loader"></div> // Spinner
              ) : forgotSuccess ? (
                '✔️ Please Check Admin Email' // Success state
              ) : (
                'Forgot Admin Password'
              )}
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
