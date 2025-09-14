import React from 'react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './common/LoadingSpinner';
import Header from './common/Header';
import LoginForm from './auth/LoginForm';
import StudentPage from '../pages/StudentPage';
import TeacherPage from '../pages/TeacherPage';
import ParentPage from '../pages/ParentPage';

const AppContent = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner message="Loading EduAssess AI..." />;
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderPage = () => {
  switch (user.type) {
    case 'student':
      return <StudentPage />;
    case 'teacher':
      return <TeacherPage />;
    case 'parent':
      return <ParentPage />;
    default:
      return <div>Unknown role</div>;
  }
};

return (
  <div className="min-h-screen">
    <Header />
    {renderPage()}
  </div>
);

};

export default AppContent;