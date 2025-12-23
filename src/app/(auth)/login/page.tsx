'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2, Rocket, BarChart3, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthService } from '@/lib/services/auth.service';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('🔑 Login form: Submitting...');
      const result = await AuthService.login(formData);

      console.log('🔑 Login form: Result:', { success: result.success, hasToken: !!result.token });

      if (result.success && result.token) {
        console.log('🔑 Login form: Success! Token received');

        // Verify token is in localStorage before redirecting
        const storedToken = localStorage.getItem('auth_token');
        console.log('🔑 Login form: Token in localStorage:', storedToken ? `EXISTS (${storedToken.substring(0, 20)}...)` : 'MISSING');

        if (storedToken) {
          console.log('🔑 Login form: Token confirmed in storage. Redirecting to dashboard in 500ms...');
          // Use router.replace to prevent back button issues
          setTimeout(() => {
            console.log('🔑 Login form: Navigating now...');
            router.replace('/dashboard');
          }, 500);
        } else {
          console.error('🔑 Login form: Token not stored! Retrying...');
          localStorage.setItem('auth_token', result.token);
          setTimeout(() => {
            const retryCheck = localStorage.getItem('auth_token');
            console.log('🔑 Login form: Retry check:', retryCheck ? 'SUCCESS' : 'FAILED');
            router.replace('/dashboard');
          }, 500);
        }
      } else {
        console.error('🔑 Login form: Failed -', result.message);
        setError(result.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('🔑 Login form: Exception -', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Image
              src="/logo.png"
              alt="Vondera Logo"
              width={120}
              height={120}
              className="mx-auto mb-6"
            />
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your developer dashboard
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-semibold">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="dev@vondera.app"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="rounded-lg h-11 border-2 border-gray-300 bg-white text-gray-900 transition-all duration-300 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-700 font-semibold">
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Forgot?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="rounded-lg h-11 border-2 border-gray-300 bg-white text-gray-900 transition-all duration-300 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                />
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold rounded-lg bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-white border-r-transparent rounded-full animate-spin"></span>
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Link
                  href="/signup"
                  className="text-primary hover:text-primary/80 font-bold transition-colors"
                >
                  Create one
                </Link>
              </p>
            </div>
          </motion.div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500">
            By signing in, you agree to Vondera&apos;s Terms of Service and Privacy Policy
          </p>
        </div>
      </div>

      {/* Right side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-50 via-purple-100 to-indigo-50 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 flex items-center justify-center p-12"
        >
          {/* Animated background shapes */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, -90, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1
            }}
            className="absolute -bottom-8 right-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
          />

          {/* Content */}
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Vondera Developer
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                Build powerful plugins for the Vondera ecosystem
              </p>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 gap-4">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="p-5 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <Rocket className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Easy Integration</h3>
                      <p className="text-sm text-gray-600">Seamlessly integrate with the Vondera platform</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="p-5 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <BarChart3 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Analytics</h3>
                      <p className="text-sm text-gray-600">Track plugin performance and user engagement</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="p-5 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Secure</h3>
                      <p className="text-sm text-gray-600">Enterprise-grade security for your plugins</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
