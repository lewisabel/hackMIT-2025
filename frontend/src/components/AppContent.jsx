import React from 'react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './common/LoadingSpinner';
import Header from './common/Header';
import LoginForm from './auth/LoginForm';
import StudentPage from '../pages/StudentPage';
import TeacherPage from '../pages/TeacherPage';

const AppContent = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner message="Loading EduAssess AI..." />;
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen">
      <Header />
      {user.type === 'student' ? <StudentPage /> : <TeacherPage />}
    </div>
  );
};

export default AppContent;