import React from 'react';
import { Film, LogOut } from 'lucide-react';
import Button from './ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import UserManagement from './admin/UserManagement';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Film className="h-6 w-6 text-purple-600 sm:h-8 sm:w-8" />
            <h1 className="text-xl font-bold sm:text-2xl">Movres Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Welcome, {user?.displayName || user?.email}
            </span>
            <Button
              variant="outline"
              onClick={onLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        <UserManagement />
      </main>
    </div>
  );
}