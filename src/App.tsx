import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Login from '@/components/Login';
import Signup from '@/components/Signup';
import Home from '@/pages/Home';
import Profile from '@/pages/Profile';
import MovieDetails from './pages/MovieDetails';
import LoadingScreen from './components/LoadingScreen';
import AdminDashboard from '@/components/AdminDashboard';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <LoadingScreen />;
  }
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <LoadingScreen />;
  }
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
}

function App() {
  const { user, logout } = useAuth();

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/movie/:id"
            element={
              <PrivateRoute>
                <MovieDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard onLogout={logout} />
              </AdminRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
