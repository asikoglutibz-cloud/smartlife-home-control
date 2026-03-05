import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import RoomsPage from './pages/RoomsPage';
import DevicesPage from './pages/DevicesPage';
import ScenesPage from './pages/ScenesPage';
import EnergyPage from './pages/EnergyPage';
import SecurityPage from './pages/SecurityPage';
import SettingsPage from './pages/SettingsPage';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/rooms" element={
                <ProtectedRoute>
                  <RoomsPage />
                </ProtectedRoute>
              } />
              <Route path="/devices" element={
                <ProtectedRoute>
                  <DevicesPage />
                </ProtectedRoute>
              } />
              <Route path="/scenes" element={
                <ProtectedRoute>
                  <ScenesPage />
                </ProtectedRoute>
              } />
              <Route path="/energy" element={
                <ProtectedRoute>
                  <EnergyPage />
                </ProtectedRoute>
              } />
              <Route path="/security" element={
                <ProtectedRoute>
                  <SecurityPage />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
