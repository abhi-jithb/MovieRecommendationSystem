import { Link } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Button from './ui/Button';

interface User {
  name: string;
  email: string;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // TODO: Replace with actual user data from your auth system
    const mockUser = {
      name: 'John Doe',
      email: 'john@example.com',
    };
    setUser(mockUser);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitial = () => {
    if (!user) return '?';
    return (user.name || user.email).charAt(0).toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="text-xl font-bold text-blue-600">
          MovieRes
        </Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
              >
                {getInitial()}
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border bg-white py-1 shadow-lg">
                  <div className="border-b px-4 py-2">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    className="flex w-full items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      // TODO: Implement logout logic
                      setIsDropdownOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
} 