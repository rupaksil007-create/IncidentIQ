import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import IncidentInvestigationPage from './pages/IncidentInvestigationPage';
import AuthPage from './pages/AuthPage';
import { ToastProvider } from './components/ui/Toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ui/ErrorBoundary';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <ErrorBoundary>
            <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/incident/:id" 
                    element={
                      <ProtectedRoute>
                        <IncidentInvestigationPage />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
            </div>
          </ErrorBoundary>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
