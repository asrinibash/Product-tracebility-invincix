import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './Layouts/DashboardLayout';
import Login from './Pages/Login';

// Import your page components
import Farmer from './Pages/Farmer';
import Manufacturer from './Pages/Manufacturer';
import Distributer from './Pages/Distributer';
import RetailerDashboard from './Pages/Retiler';
import Consumer from './Pages/Consumer';


// Auth Guard Component
const ProtectedRoute = ({ children }) => {
  // Replace this with your actual auth check
  const isAuthenticated = localStorage.getItem('authToken');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Dashboard Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/farmer" replace />} />
          <Route path="farmer" element={<Farmer />} />
          <Route path="manufacturer" element={<Manufacturer />} />
          <Route path="distributer" element={<Distributer />} />
          <Route path="retailer" element={<RetailerDashboard />} />
          <Route path="consumer" element={<Consumer />} />
          <Route path="help" element={<Farmer />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/farmer" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;