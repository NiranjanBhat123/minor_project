import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ component: Component }) => {
  const isAuthenticated = !!localStorage.getItem('user');

  return isAuthenticated ? <Component /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
