import React from 'react';
import { Navigate } from 'react-router-dom';

const HomeProtect = ({ component: Component }) => {
  const notAuthenticated = !localStorage.getItem('user');
  return notAuthenticated ? <Component /> : <Navigate to="/interview" replace />;
};

export default HomeProtect;
