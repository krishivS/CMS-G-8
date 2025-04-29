import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  GraduationCap, 
  Calendar, 
  Settings, 
  HelpCircle 
} from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'courses', label: 'Courses', icon: <BookOpen size={20} /> },
    { id: 'teachers', label: 'Teachers', icon: <Users size={20} /> },
    { id: 'students', label: 'Student Marks', icon: <GraduationCap size={20} /> },
    { id: 'events', label: 'Events', icon: <Calendar size={20} /> },
  ];

  const bottomMenuItems = [
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
    { id: 'help', label: 'Help & Support', icon: <HelpCircle size={20} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <BookOpen size={24} />
          <h2 className="logo-text">EduAdmin</h2>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.id} className="nav-item">
              <button
                className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => setCurrentPage(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.id === 'events' && <span className="item-badge">3</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <ul className="nav-list">
          {bottomMenuItems.map((item) => (
            <li key={item.id} className="nav-item">
              <button className="nav-link">
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;