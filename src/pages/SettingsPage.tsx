import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSettings, FiMoon, FiSun, FiBell, FiUser, FiLock, FiGlobe, FiEdit } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

interface SettingOption {
  value: string;
  label: string;
}

interface ToggleSetting {
  name: string;
  description: string;
  type: 'toggle';
  value: boolean;
  onChange: () => void;
}

interface SelectSetting {
  name: string;
  description: string;
  type: 'select';
  value: string;
  options: SettingOption[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

interface LinkSetting {
  name: string;
  description: string;
  type: 'link';
  onClick: () => void;
}

type Setting = ToggleSetting | SelectSetting | LinkSetting;

interface SettingsSection {
  title: string;
  icon: React.ReactNode;
  settings: Setting[];
}

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [notifications, setNotifications] = useState(() => {
    const savedNotifications = localStorage.getItem('notifications');
    return savedNotifications ? JSON.parse(savedNotifications) : true;
  });
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Save notification preference
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
    // Here you would typically also update the notification settings in your backend
  }, [notifications]);

  // Save language preference
  useEffect(() => {
    localStorage.setItem('language', language);
    // Here you would typically also update the language settings in your backend
  }, [language]);

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const settingsSections: SettingsSection[] = [
    {
      title: 'Account',
      icon: <FiUser className="w-5 h-5" />,
      settings: [
        {
          name: 'Edit Profile',
          description: 'Update your profile information and preferences',
          type: 'link',
          onClick: handleEditProfile,
        },
      ],
    },
    {
      title: 'Appearance',
      icon: <FiSun className="w-5 h-5" />,
      settings: [
        {
          name: 'Dark Mode',
          description: 'Toggle dark mode for the application',
          type: 'toggle',
          value: darkMode,
          onChange: () => setDarkMode(!darkMode),
        },
      ],
    },
    {
      title: 'Notifications',
      icon: <FiBell className="w-5 h-5" />,
      settings: [
        {
          name: 'Push Notifications',
          description: 'Receive notifications for new messages and updates',
          type: 'toggle',
          value: notifications,
          onChange: () => setNotifications(!notifications),
        },
      ],
    },
    {
      title: 'Language',
      icon: <FiGlobe className="w-5 h-5" />,
      settings: [
        {
          name: 'Interface Language',
          description: 'Choose your preferred language',
          type: 'select',
          value: language,
          options: [
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Spanish' },
            { value: 'fr', label: 'French' },
          ],
          onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setLanguage(e.target.value),
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center space-x-3 mb-8">
          <FiSettings className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        </div>

        <div className="space-y-6">
          {settingsSections.map((section) => (
            <div
              key={section.title}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                {section.icon}
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {section.title}
                </h2>
              </div>

              <div className="space-y-4">
                {section.settings.map((setting) => (
                  <div
                    key={setting.name}
                    className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0"
                  >
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {setting.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {setting.description}
                      </p>
                    </div>

                    {setting.type === 'toggle' && (
                      <button
                        onClick={setting.onChange}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          setting.value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            setting.value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    )}

                    {setting.type === 'select' && (
                      <select
                        value={setting.value}
                        onChange={setting.onChange}
                        className="block w-40 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        {setting.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}

                    {setting.type === 'link' && (
                      <button
                        onClick={setting.onClick}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <FiEdit className="w-4 h-4 mr-2" />
                        Edit
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
