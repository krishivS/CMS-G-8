import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentPage, 
  setCurrentPage, 
  onLogout 
}) => {
  return (
    <div className="layout">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="layout-content">
        <Header title={getPageTitle(currentPage)} onLogout={onLogout} />
        <main className="main-content fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

const getPageTitle = (page: string): string => {
  switch (page) {
    case 'dashboard':
      return 'Dashboard';
    case 'courses':
      return 'Course Management';
    case 'teachers':
      return 'Teacher Management';
    case 'students':
      return 'Student Marks';
    case 'events':
      return 'Upcoming Events';
    default:
      return 'Dashboard';
  }
};

export default Layout;