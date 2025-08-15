import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import Jobs from './pages/Jobs.jsx';
import PostJob from './pages/PostJob.jsx';
import Payments from './pages/Payments.jsx';
import AISkills from './pages/AISkills.jsx';
import EditProfile from './pages/EditProfile.jsx';


function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Navbar />
        <div className="max-w-5xl mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} /> 
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/post" element={<PrivateRoute><PostJob /></PrivateRoute>} />
            <Route path="/payments" element={<PrivateRoute><Payments /></PrivateRoute>} />
            <Route path="/ai" element={<AISkills />} />
            
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}
