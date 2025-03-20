import React, { useState, useEffect } from 'react';
import { Film, LogOut, Users, Trash2, Ban } from 'lucide-react';
import Button from './ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: string;
  isBanned: boolean;
  createdAt: string;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log('Fetching users...');
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        console.log('Users snapshot:', usersSnapshot.docs.length);
        
        const usersData = usersSnapshot.docs.map(doc => ({
          uid: doc.id,
          ...doc.data()
        })) as User[];
        
        console.log('Users data:', usersData);
        setUsers(usersData);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch users');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(users.filter(user => user.uid !== userId));
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  const handleToggleBan = async (userId: string, currentBanStatus: boolean) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        isBanned: !currentBanStatus
      });
      setUsers(users.map(user => 
        user.uid === userId 
          ? { ...user, isBanned: !currentBanStatus }
          : user
      ));
    } catch (err) {
      console.error('Error toggling ban:', err);
      setError(err instanceof Error ? err.message : 'Failed to update user ban status');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Film className="h-6 w-6 text-purple-600 sm:h-8 sm:w-8" />
            <h1 className="text-xl font-bold sm:text-2xl">Movres Admin Dashboard</h1>
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
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">User Management</h2>
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="h-5 w-5" />
            <span>{users.length} Users</span>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {users.map((user) => (
                <tr key={user.uid}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {user.photoURL ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={user.photoURL}
                            alt=""
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                            {user.displayName?.[0] || user.email[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.displayName || 'No Name'}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex rounded-full bg-purple-100 px-2 text-xs font-semibold leading-5 text-purple-800">
                      {user.role}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        user.isBanned
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {user.isBanned ? 'Banned' : 'Active'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleToggleBan(user.uid, user.isBanned)}
                        className={user.isBanned ? 'text-green-600 hover:text-green-700' : 'text-red-600 hover:text-red-700'}
                      >
                        <Ban className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDeleteUser(user.uid)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}