import { useState } from 'react';
import Button from './ui/Button';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
<<<<<<< HEAD
=======
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase'; // Import Firestore
import { setDoc, doc } from 'firebase/firestore';
>>>>>>> 6e836e1 (admin dashboard ui added)

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
<<<<<<< HEAD
=======
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        const userCredential = await signUp(email, password);
        const user = userCredential.user;

        // Save user details in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: name || "N/A",
          createdAt: new Date(),
        });
      }
      onClose();
    } catch (err) {
      setError('Failed to authenticate. Please check your credentials.');
    }
  };
>>>>>>> 6e836e1 (admin dashboard ui added)

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

<<<<<<< HEAD
        <form className="space-y-3 sm:space-y-4">
=======
        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
>>>>>>> 6e836e1 (admin dashboard ui added)
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
<<<<<<< HEAD
                className="mt-1 w-full rounded-lg border p-2 text-sm sm:text-base"
                placeholder="John Doe"
=======
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border p-2 text-sm sm:text-base"
                placeholder="John Doe"
                required
>>>>>>> 6e836e1 (admin dashboard ui added)
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
<<<<<<< HEAD
              className="mt-1 w-full rounded-lg border p-2 text-sm sm:text-base"
              placeholder="you@example.com"
=======
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border p-2 text-sm sm:text-base"
              placeholder="you@example.com"
              required
>>>>>>> 6e836e1 (admin dashboard ui added)
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
<<<<<<< HEAD
              className="mt-1 w-full rounded-lg border p-2 text-sm sm:text-base"
              placeholder="••••••••"
            />
          </div>

          <Button className="w-full">{isLogin ? 'Sign In' : 'Sign Up'}</Button>
=======
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border p-2 text-sm sm:text-base"
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </Button>
>>>>>>> 6e836e1 (admin dashboard ui added)
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
<<<<<<< HEAD
}
=======
}
>>>>>>> 6e836e1 (admin dashboard ui added)
