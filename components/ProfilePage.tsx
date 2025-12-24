import React, { useState, useEffect } from 'react';
import { User, Language } from '../types';

interface ProfilePageProps {
  user: User | null;
  onUpdateUser: (user: User) => void;
  onLogout: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateUser, onLogout }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState<Language>('en');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone);
      setLanguage(user.language);
    }
  }, [user]);

  const handleSave = () => {
    if (!name.trim()) {
      setMessage("Name cannot be empty.");
      return;
    }
    // Simple phone check
    if (!/^[0-9]{10}$/.test(phone)) {
        setMessage("Invalid Phone Format");
        return;
    }

    if (user) {
      const updatedUser: User = {
        ...user,
        name,
        phone,
        language
      };
      onUpdateUser(updatedUser);
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 p-4 md:p-8 pb-24 transition-colors duration-300">
      <div className="max-w-2xl mx-auto bg-white dark:bg-stone-800 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700 p-8">
        
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
             {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-100">{user.name}</h1>
            <p className="text-stone-500 dark:text-stone-400 capitalize">{user.role}</p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-200 border-b border-stone-100 dark:border-stone-700 pb-2">Edit Profile</h2>
          
          {message && (
             <div className={`p-3 rounded-lg text-sm font-medium ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
               {message}
             </div>
          )}

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none dark:bg-stone-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Phone Number</label>
             <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-stone-500 sm:text-sm">+91</span>
                </div>
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-12 px-4 py-2 border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none dark:bg-stone-700 dark:text-white"
                />
             </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Language</label>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="w-full px-4 py-2 border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none dark:bg-stone-700 dark:text-white"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="te">Telugu</option>
              <option value="ta">Tamil</option>
              <option value="kn">Kannada</option>
              <option value="mr">Marathi</option>
            </select>
          </div>

          <div className="pt-6 flex space-x-4">
            <button 
              onClick={handleSave}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-md transition-colors"
            >
              Save Changes
            </button>
            <button 
              onClick={onLogout}
              className="flex-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 font-bold py-3 rounded-xl transition-colors border border-red-200 dark:border-red-800"
            >
              Logout
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;