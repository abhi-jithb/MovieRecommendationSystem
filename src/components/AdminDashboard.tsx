import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Ban, UserCheck, Trash2 } from 'lucide-react';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';

// Firebase instances
const auth = getAuth(app);
const db = getFirestore(app);

// Predefined Admin Credentials
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'admin123';

// User type definition
interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  lastLogin: string | null;
  status: 'active' | 'suspended' | 'banned';
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);

  // Handle Admin Authentication
  useEffect(() => {
    signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD)
      .then((userCredential) => {
        console.log('Admin Logged In:', userCredential.user.email);
        setAdminAuthenticated(true);
      })
      .catch((error) => {
        console.error('Admin Login Failed:', error.message);
      });
  }, []);

  // Fetch Users from Firestore
  useEffect(() => {
    if (!adminAuthenticated) return;

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersCollection = collection(db, 'users');
        const userSnapshot = await getDocs(usersCollection);
        const userList = userSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            uid: doc.id,
            email: data.email || null,
            displayName: data.displayName || null,
            photoURL: data.photoURL || null,
            lastLogin: data.lastLogin || null,
            status: data.status || 'active'
          } as User;
        });
        setUsers(userList);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [adminAuthenticated]);

  // Filter Users Based on Search Input
  const filteredUsers = users.filter(user =>
    (user.displayName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleAction = async (action: string, userId: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      
      switch (action) {
        case 'activate':
          await updateDoc(userRef, { status: 'active' });
          setUsers(users.map(user => 
            user.uid === userId ? { ...user, status: 'active' } : user
          ));
          console.log('User activated:', userId);
          break;
        case 'suspend':
          await updateDoc(userRef, { status: 'suspended' });
          setUsers(users.map(user => 
            user.uid === userId ? { ...user, status: 'suspended' } : user
          ));
          console.log('User suspended:', userId);
          break;
        case 'ban':
          await updateDoc(userRef, { status: 'banned' });
          setUsers(users.map(user => 
            user.uid === userId ? { ...user, status: 'banned' } : user
          ));
          console.log('User banned:', userId);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error performing ${action} on user ${userId}:`, error);
    }
    
    setSelectedUser(null); // Close the dropdown after action
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">User Management</h1>
        <p className="mt-2 text-gray-600">Manage and monitor user accounts</p>
      </div>
      
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white 
                      placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-4">Loading users...</div>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Last Login</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.uid} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {user.photoURL ? (
                          <img 
                            src={user.photoURL} 
                            alt={user.displayName || 'User'} 
                            className="h-8 w-8 rounded-full mr-3"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <span className="text-gray-500 text-sm">
                              {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                            </span>
                          </div>
                        )}
                        <div className="font-medium text-gray-900">{user.displayName || 'No Name'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.status === 'active' ? 'bg-green-100 text-green-800' : 
                          user.status === 'suspended' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{user.lastLogin || 'Never'}</td>
                    <td className="px-6 py-4 text-right relative">
                      <button
                        onClick={() => setSelectedUser(selectedUser === user.uid ? null : user.uid)}
                        className="rounded p-1 hover:bg-gray-100"
                      >
                        <MoreVertical className="h-5 w-5 text-gray-500" />
                      </button>
                      {selectedUser === user.uid && (
                        <div className="absolute right-0 top-full z-10 mt-1 w-48 rounded-lg border bg-white py-1 shadow-lg">
                          <button
                            onClick={() => handleAction('activate', user.uid)}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            Activate User
                          </button>
                          <button
                            onClick={() => handleAction('suspend', user.uid)}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            Suspend User
                          </button>
                          <button
                            onClick={() => handleAction('ban', user.uid)}
                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Ban User
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}