import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Music, ArrowRight, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from '../components/ui/Link';
import { useAuth } from '../contexts/AuthContext';
import { createUserProfile } from '../firebase/users';

const AuthPage: React.FC = () => {
  const { mode } = useParams<{ mode: string }>();
  const navigate = useNavigate();
  const isSignUp = mode === 'signup';
  const isResetPassword = mode === 'reset-password';
  const { signup, login, resetPassword, error: authError, authLoading, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (authError) {
      clearError();
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isResetPassword) {
      if (!formData.email) {
        setErrors({ email: 'Email is required' });
        return;
      }
      
      try {
        await resetPassword(formData.email);
        setResetSuccess(true);
        setTimeout(() => {
          navigate('/auth/signin');
        }, 3000);
        return;
      } catch (error) {
        console.error('Reset password error:', error);
        return;
      }
    }
    
    // Regular signup/signin validation
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (isSignUp && !formData.username) newErrors.username = 'Username is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      if (isSignUp) {
        const userCredential = await signup(formData.email, formData.password);
        if (userCredential.user) {
          await createUserProfile(userCredential.user.uid, {
            username: formData.username,
            email: formData.email,
          });
        }
        navigate('/home');
      } else {
        await login(formData.email, formData.password);
        navigate('/home');
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getTitle = () => {
    if (isResetPassword) return 'Reset your password';
    return isSignUp ? 'Create your account' : 'Sign in to ProdHub';
  };

  const getSubtitle = () => {
    if (isResetPassword) return 'Enter your email address and we\'ll send you a link to reset your password';
    return isSignUp 
      ? 'Start collaborating on FL Studio projects'
      : 'Welcome back! Please enter your details.';
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
            {getTitle()}
          </h2>
          <p className="mt-2 text-gray-400">
            {getSubtitle()}
          </p>
        </div>
        
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-700">
          {isResetPassword && resetSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-green-400 font-medium">Password reset link has been sent to your email</p>
              <p className="text-gray-400 mt-2">Redirecting to login page...</p>
            </motion.div>
          ) : (
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
              
              {!isResetPassword && (
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
              )}
              
              {!isSignUp && !isResetPassword && (
                <div className="flex items-center justify-end">
                  <Link href="/auth/reset-password" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                    Forgot password?
                  </Link>
                </div>
              )}

              {authError && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-md p-3">
                  <p className="text-sm text-red-500">{authError}</p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={authLoading}
                className={`w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-medium py-2.5 px-4 rounded-md transition-all shadow-lg hover:shadow-purple-500/20 ${
                  authLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {authLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>
                      {isResetPassword ? 'Send reset link' : (isSignUp ? 'Create account' : 'Sign in')}
                    </span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          )}
          
          <div className="mt-6 flex items-center justify-center space-x-2 text-sm">
            {isResetPassword ? (
              <button
                onClick={() => navigate('/auth/signin')}
                className="text-gray-400 hover:text-white transition-colors flex items-center space-x-1"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to login</span>
              </button>
            ) : (
              <div className="text-gray-400">
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
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;