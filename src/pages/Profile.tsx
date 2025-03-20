import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { User, LogOut, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.displayName || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      setError('Failed to logout. Please try again.');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setIsUpdating(true);
      setError(null);
      
      // Update profile in Firebase Auth
      await updateUserProfile(editedName);

      // Update profile in Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName: editedName
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditedName(user?.displayName || '');
    setIsEditing(false);
    setError(null);
  };

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-600">Please log in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-gray-200">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || user.email || 'User'}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <User className="h-8 w-8 text-gray-500" />
                </div>
              )}
            </div>
            <div>
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-48"
                  />
                  <Button
                    variant="outline"
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="flex items-center space-x-1"
                  >
                    <Save className="h-4 w-4" />
                    <span>{isUpdating ? 'Saving...' : 'Save'}</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isUpdating}
                    className="flex items-center space-x-1"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold">{user.displayName || 'User'}</h1>
                  <Button
                    variant="outline"
                    onClick={handleEdit}
                    className="flex items-center space-x-1"
                  >
                    <Edit2 className="h-4 w-4" />
                    <span>Edit</span>
                  </Button>
                </div>
              )}
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="flex items-center space-x-2"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Account Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Account ID</label>
              <p className="mt-1 text-gray-900">{user.uid}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Created</label>
              <p className="mt-1 text-gray-900">
                {user.metadata.creationTime
                  ? new Date(user.metadata.creationTime).toLocaleDateString()
                  : 'Unknown'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 