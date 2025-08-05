import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import theme from './styles/theme';
import { AuthProvider } from './contexts/AuthContext';
import { MenuProvider } from './contexts/MenuContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MenuManagement from './pages/MenuManagement';
import MenuManagementDemo from './pages/MenuManagementDemo';
import Onboarding from './pages/Onboarding';
import MenuEditor from './pages/MenuEditor';
import MenuPreview from './pages/MenuPreview';
import PublicMenu from './pages/PublicMenu';
import QRGenerator from './pages/QRGenerator';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AuthProvider>
        <MenuProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/menu/:shortUrl" element={<PublicMenu />} />
                
                {/* Protected routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Dashboard />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/menu-management" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <MenuManagement />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/demo" element={
                  <AppLayout>
                    <MenuManagementDemo />
                  </AppLayout>
                } />
                
                <Route path="/onboarding" element={
                  <ProtectedRoute>
                    <Onboarding />
                  </ProtectedRoute>
                } />
                
                <Route path="/menu-editor/:menuId?" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <MenuEditor />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/menu-preview/:menuId" element={
                  <ProtectedRoute>
                    <MenuPreview />
                  </ProtectedRoute>
                } />
                
                <Route path="/qr-generator/:menuId?" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <QRGenerator />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Settings />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                {/* Redirect old routes */}
                <Route path="/app" element={<Navigate to="/dashboard" replace />} />
                
                {/* 404 page */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </Router>
        </MenuProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
