import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Music, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Link } from '../components/ui/Link';

const AuthPage: React.FC = () => {
  const { mode } = useParams<{ mode: string }>();
  const navigate = useNavigate();
  const isSignUp = mode === 'signup';
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (isSignUp && !formData.username) {
      newErrors.username = 'Username is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Proceed with authentication
    console.log('Form submitted:', formData);
    // In a real app, would call authentication services here
    
    // Navigate to home after "successful" login
    navigate('/');
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center">
            <Music className="h-10 w-10 text-purple-500" />
          </div>
          <h2 className="mt-2 text-3xl font-bold text-white">
            {isSignUp ? 'Create your account' : 'Sign in to ProdHub'}
          </h2>
          <p className="mt-2 text-gray-400">
            {isSignUp 
              ? 'Start collaborating on FL Studio projects' 
              : 'Welcome back! Please enter your details.'}
          </p>
        </div>
        
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    className={`bg-gray-700 text-white w-full pl-10 pr-3 py-2.5 rounded-md focus:outline-none focus:ring-2 ${
                      errors.username ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-purple-500'
                    }`}
                    placeholder="producer123"
                  />
                </div>
                {errors.username && (
                  <p className="mt-1 text-sm text-red-500">{errors.username}</p>
                )}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`bg-gray-700 text-white w-full pl-10 pr-3 py-2.5 rounded-md focus:outline-none focus:ring-2 ${
                    errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-purple-500'
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={`bg-gray-700 text-white w-full pl-10 pr-10 py-2.5 rounded-md focus:outline-none focus:ring-2 ${
                    errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-purple-500'
                  }`}
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>
            
            {!isSignUp && (
              <div className="flex items-center justify-end">
                <Link href="/auth/reset-password" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
            )}
            
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-medium py-2.5 px-4 rounded-md transition-all shadow-lg hover:shadow-purple-500/20"
            >
              <span>{isSignUp ? 'Create account' : 'Sign in'}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-400">
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <Link href="/auth/signin" className="text-purple-400 font-medium hover:text-purple-300">
                  Sign in
                </Link>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <Link href="/auth/signup" className="text-purple-400 font-medium hover:text-purple-300">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;