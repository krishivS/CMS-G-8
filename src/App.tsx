import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Teachers from './pages/Teachers';
import Students from './pages/Students';
import Events from './pages/Events';
import Login from './pages/Login';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleLogin = () => {
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  const renderPage = () => {
    if (!isAuthenticated) {
      return <Login onLogin={handleLogin} />;
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'courses':
        return <Courses />;
      case 'teachers':
        return <Teachers />;
      case 'students':
        return <Students />;
      case 'events':
        return <Events />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <AuthProvider value={{ isAuthenticated, login: handleLogin, logout: handleLogout }}>
        <DataProvider>
          {isAuthenticated ? (
            <Layout 
              currentPage={currentPage} 
              setCurrentPage={setCurrentPage} 
              onLogout={handleLogout}
            >
              {renderPage()}
            </Layout>
          ) : (
            renderPage()
          )}
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;