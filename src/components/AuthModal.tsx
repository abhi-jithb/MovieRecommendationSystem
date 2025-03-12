import { useState } from 'react';
import Button from './ui/Button';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-md rounded-xl bg-white p-4 shadow-xl sm:p-6"
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 sm:right-4 sm:top-4"
        >
          <X className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        <h2 className="mb-4 text-center text-xl font-bold sm:mb-6 sm:text-2xl">
          {isLogin ? 'Welcome Back!' : 'Create Account'}
        </h2>

        <form className="space-y-3 sm:space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                className="mt-1 w-full rounded-lg border p-2 text-sm sm:text-base"
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded-lg border p-2 text-sm sm:text-base"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 w-full rounded-lg border p-2 text-sm sm:text-base"
              placeholder="••••••••"
            />
          </div>

          <Button className="w-full">{isLogin ? 'Sign In' : 'Sign Up'}</Button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-600 sm:text-sm">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-1 text-purple-600 hover:underline"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}