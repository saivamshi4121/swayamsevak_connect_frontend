import React from 'react';
import './App.css';
import './i18n';
import { AuthProvider } from './context/AuthContext';
import { HelmetProvider } from 'react-helmet-async';
import AppRoutes from './routes';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
