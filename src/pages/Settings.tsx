import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  Moon, 
  Sun, 
  Bell, 
  Mail,
  Globe,
  Calendar,
  GraduationCap,
  Save,
  RefreshCw
} from 'lucide-react';
import * as Switch from '@radix-ui/react-switch';
import * as Select from '@radix-ui/react-select';
import * as Tabs from '@radix-ui/react-tabs';
import '../styles/Settings.css';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: true,
    language: 'en',
    academicYear: '2023-2024',
    semester: 'Spring',
    gradeScale: {
      A: 90,
      B: 80,
      C: 70,
      D: 60,
      F: 0
    }
  });
  
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate saving settings
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="settings-container fade-in">
      <div className="page-header">
        <h1>Settings</h1>
        <button 
          className="btn btn-primary"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save size={16} />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      <Tabs.Root defaultValue="general" className="settings-tabs">
        <Tabs.List className="tabs-list">
          <Tabs.Trigger value="general" className="tab-trigger">
            General
          </Tabs.Trigger>
          <Tabs.Trigger value="academic" className="tab-trigger">
            Academic
          </Tabs.Trigger>
          <Tabs.Trigger value="notifications" className="tab-trigger">
            Notifications
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="general" className="tab-content">
          <div className="settings-section">
            <h2>Appearance</h2>
            <div className="setting-item">
              <div className="setting-label">
                <div className="setting-icon">
                  {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                </div>
                <div>
                  <h3>Theme</h3>
                  <p>Switch between light and dark mode</p>
                </div>
              </div>
              <Switch.Root
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
                className="switch-root"
              >
                <Switch.Thumb className="switch-thumb" />
              </Switch.Root>
            </div>

            <div className="setting-item">
              <div className="setting-label">
                <div className="setting-icon">
                  <Globe size={18} />
                </div>
                <div>
                  <h3>Language</h3>
                  <p>Select your preferred language</p>
                </div>
              </div>
              <Select.Root
                value={settings.language}
                onValueChange={(value) => 
                  setSettings(prev => ({ ...prev, language: value }))
                }
              >
                <Select.Trigger className="select-trigger">
                  <Select.Value />
                </Select.Trigger>
                <Select.Content className="select-content">
                  <Select.Item value="en" className="select-item">English</Select.Item>
                  <Select.Item value="es" className="select-item">Spanish</Select.Item>
                  <Select.Item value="fr" className="select-item">French</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value="academic" className="tab-content">
          <div className="settings-section">
            <h2>Academic Settings</h2>
            <div className="setting-item">
              <div className="setting-label">
                <div className="setting-icon">
                  <Calendar size={18} />
                </div>
                <div>
                  <h3>Academic Year</h3>
                  <p>Current academic year</p>
                </div>
              </div>
              <Select.Root
                value={settings.academicYear}
                onValueChange={(value) => 
                  setSettings(prev => ({ ...prev, academicYear: value }))
                }
              >
                <Select.Trigger className="select-trigger">
                  <Select.Value />
                </Select.Trigger>
                <Select.Content className="select-content">
                  <Select.Item value="2023-2024" className="select-item">2023-2024</Select.Item>
                  <Select.Item value="2024-2025" className="select-item">2024-2025</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>

            <div className="setting-item">
              <div className="setting-label">
                <div className="setting-icon">
                  <GraduationCap size={18} />
                </div>
                <div>
                  <h3>Current Semester</h3>
                  <p>Active semester period</p>
                </div>
              </div>
              <Select.Root
                value={settings.semester}
                onValueChange={(value) => 
                  setSettings(prev => ({ ...prev, semester: value }))
                }
              >
                <Select.Trigger className="select-trigger">
                  <Select.Value />
                </Select.Trigger>
                <Select.Content className="select-content">
                  <Select.Item value="Fall" className="select-item">Fall</Select.Item>
                  <Select.Item value="Spring" className="select-item">Spring</Select.Item>
                  <Select.Item value="Summer" className="select-item">Summer</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>

            <div className="grade-scale-section">
              <h3>Grade Scale</h3>
              <div className="grade-scale-grid">
                {Object.entries(settings.gradeScale).map(([grade, threshold]) => (
                  <div key={grade} className="grade-item">
                    <label htmlFor={`grade-${grade}`}>{grade} Grade</label>
                    <div className="grade-input">
                      <input
                        type="number"
                        id={`grade-${grade}`}
                        value={threshold}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value) && value >= 0 && value <= 100) {
                            setSettings(prev => ({
                              ...prev,
                              gradeScale: {
                                ...prev.gradeScale,
                                [grade]: value
                              }
                            }));
                          }
                        }}
                        min="0"
                        max="100"
                      />
                      <span className="percentage">%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value="notifications" className="tab-content">
          <div className="settings-section">
            <h2>Notification Preferences</h2>
            <div className="setting-item">
              <div className="setting-label">
                <div className="setting-icon">
                  <Bell size={18} />
                </div>
                <div>
                  <h3>Push Notifications</h3>
                  <p>Receive notifications for important updates</p>
                </div>
              </div>
              <Switch.Root
                checked={settings.notifications}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, notifications: checked }))
                }
                className="switch-root"
              >
                <Switch.Thumb className="switch-thumb" />
              </Switch.Root>
            </div>

            <div className="setting-item">
              <div className="setting-label">
                <div className="setting-icon">
                  <Mail size={18} />
                </div>
                <div>
                  <h3>Email Notifications</h3>
                  <p>Receive email updates and summaries</p>
                </div>
              </div>
              <Switch.Root
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, emailNotifications: checked }))
                }
                className="switch-root"
              >
                <Switch.Thumb className="switch-thumb" />
              </Switch.Root>
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};

export default Settings;