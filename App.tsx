import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import AITeacher from './components/AITeacher';
import CropDoctor from './components/CropDoctor';
import ProfilePage from './components/ProfilePage';
import { AppView, Language, User } from './types';
import { subscribeToAuthChanges, logoutUser } from './services/authService';

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Handle Dark Mode Side Effects
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handle Firebase Session Persistence
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLanguage(currentUser.language);
        // Don't auto-redirect if we are already on a specific valid view, 
        // but if we are on Landing/Auth, go to dashboard
        if (currentView === AppView.LANDING || currentView === AppView.AUTH) {
           setCurrentView(currentUser.role === 'admin' ? AppView.ADMIN_DASHBOARD : AppView.DASHBOARD);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []); // Run once on mount

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setLanguage(loggedInUser.language);
    if (loggedInUser.role === 'admin') {
      setCurrentView(AppView.ADMIN_DASHBOARD);
    } else {
      setCurrentView(AppView.DASHBOARD);
    }
  };

  // Handle Profile/Language Updates
  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    // Important: Update global language state when user profile changes
    if (updatedUser.language !== language) {
       setLanguage(updatedUser.language);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setCurrentView(AppView.LANDING);
  };

  const renderView = () => {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#EAE7DC] dark:bg-[#0c0a09]">
           <div className="w-12 h-12 rounded-full border-4 border-green-500 border-t-transparent animate-spin"></div>
        </div>
      );
    }

    switch (currentView) {
      case AppView.LANDING:
        return (
          <LandingPage 
            onStart={() => setCurrentView(user ? AppView.DASHBOARD : AppView.AUTH)} 
            language={language}
          />
        );
      case AppView.AUTH:
        return (
          <AuthPage 
            onLoginSuccess={handleLoginSuccess} 
            onCancel={() => setCurrentView(AppView.LANDING)} 
            language={language}
          />
        );
      case AppView.DASHBOARD:
        return (
          <Dashboard 
            user={user} 
            language={language} 
            onLogout={handleLogout} 
            onUpdateUser={handleUpdateUser} 
          />
        );
      case AppView.ADMIN_DASHBOARD:
        return (
          <AdminDashboard 
            user={user} 
            onLogout={handleLogout} 
            onUpdateUser={handleUpdateUser} 
            language={language}
          />
        );
      case AppView.TEACHER:
        return <AITeacher language={language} />;
      case AppView.DOCTOR:
        return <CropDoctor language={language} />;
      case AppView.PROFILE:
        return <ProfilePage user={user} onUpdateUser={handleUpdateUser} onLogout={handleLogout} />;
      case AppView.LESSONS:
        return (
          <div className="p-10 text-center text-stone-500 dark:text-stone-400 min-h-screen flex items-center justify-center">
             <div>
               <i className="fa-solid fa-person-digging text-6xl mb-4 text-green-600"></i>
               <h2 className="text-2xl font-bold">Lessons Module Coming Soon</h2>
               <p>We are building the curriculum.</p>
             </div>
          </div>
        );
      default:
        return (
          <LandingPage 
            onStart={() => setCurrentView(user ? AppView.DASHBOARD : AppView.AUTH)} 
            language={language}
          />
        );
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-stone-900 text-stone-100' : 'bg-stone-50 text-stone-800'}`}>
      <Navigation 
        currentView={currentView} 
        setView={setCurrentView}
        language={language}
        setLanguage={setLanguage}
        user={user}
        darkMode={darkMode}
        toggleTheme={toggleTheme}
      />
      <main className="animate-fade-in">
        {renderView()}
      </main>
    </div>
  );
}

export default App;