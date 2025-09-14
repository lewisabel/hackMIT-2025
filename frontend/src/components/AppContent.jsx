import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './common/LoadingSpinner';
import Header from './common/Header';
import LoginForm from './auth/LoginForm';
import RegisterPage from './auth/RegisterForm';
import StudentPage from '../pages/StudentPage';
import TeacherPage from '../pages/TeacherPage';
import ParentPage from '../pages/ParentPage';

const AppContent = () => {
  const { user, isLoading } = useAuth();

  console.log('AppContent - User:', user); // Debug log

  if (isLoading) {
    return <LoadingSpinner message="Loading EduAssess AI..." />;
  }

  // If user is not logged in, only show login/register routes
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Get user role - check both .role and .type for compatibility
  const userRole = user.role || user.type;
  console.log('User role:', userRole); // Debug log

  return (
    <div className="min-h-screen">
      <Header />
      <Routes>
        <Route path="/student/dashboard" element={<StudentPage />} />
        <Route path="/teacher/dashboard" element={<TeacherPage />} />
        <Route path="/parent/dashboard" element={<ParentPage />} />
        
        {/* Redirect /dashboard to role-specific dashboard */}
        <Route 
          path="/dashboard" 
          element={
            <Navigate 
              to={getRoleBasedRoute(userRole)} 
              replace 
            />
          } 
        />
        
        {/* Default redirect for any other path */}
        <Route 
          path="*" 
          element={
            <Navigate 
              to={getRoleBasedRoute(userRole)} 
              replace 
            />
          } 
        />
      </Routes>
    </div>
  );
};

// Helper function to get the correct route based on user role
const getRoleBasedRoute = (role) => {
  console.log('Getting route for role:', role); // Debug log
  
  switch (role?.toLowerCase()) {
    case 'student':
    case 'STUDENT':
      return '/student/dashboard';
    case 'teacher':
    case 'TEACHER':
      return '/teacher/dashboard';
    case 'parent':
    case 'PARENT':
      return '/parent/dashboard';
    default:
      console.warn('Unknown role:', role, 'defaulting to student dashboard');
      return '/student/dashboard';
  }
};

export default AppContent;