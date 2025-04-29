import React, { useState } from 'react';
import { Bell, User, Search, LogOut } from 'lucide-react';
import './Header.css';

interface HeaderProps {
  title: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onLogout }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="header">
      <h1 className="header-title">{title}</h1>
      
      <div className="header-search">
        <Search size={18} className="search-icon" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="search-input" 
        />
      </div>
      
      <div className="header-actions">
        <div className="notification-container">
          <button 
            className="action-button" 
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="notification-badge">3</span>
          </button>
          
          {showNotifications && (
            <div className="dropdown-menu notification-menu scale-in">
              <h3 className="dropdown-title">Notifications</h3>
              <div className="notification-item">
                <p className="notification-text">New course added: Advanced Mathematics</p>
                <span className="notification-time">5 minutes ago</span>
              </div>
              <div className="notification-item">
                <p className="notification-text">Mark updates completed for Physics 101</p>
                <span className="notification-time">2 hours ago</span>
              </div>
              <div className="notification-item">
                <p className="notification-text">New event scheduled: End of Semester Meeting</p>
                <span className="notification-time">Yesterday</span>
              </div>
              <a href="#" className="notification-view-all">View all notifications</a>
            </div>
          )}
        </div>
        
        <div className="profile-container">
          <button 
            className="action-button profile-button" 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            aria-label="Profile menu"
          >
            <div className="avatar">
              <User size={18} />
            </div>
            <span className="profile-name">Admin</span>
          </button>
          
          {showProfileMenu && (
            <div className="dropdown-menu profile-menu scale-in">
              <div className="profile-header">
                <div className="avatar avatar-lg">
                  <User size={24} />
                </div>
                <div>
                  <p className="profile-name-lg">Admin User</p>
                  <p className="profile-email">admin@university.edu</p>
                </div>
              </div>
              <div className="menu-items">
                <a href="#" className="menu-item">
                  <User size={16} />
                  <span>My Profile</span>
                </a>
                <button className="menu-item menu-item-logout" onClick={onLogout}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;