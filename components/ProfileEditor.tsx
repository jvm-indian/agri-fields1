import React, { useState } from 'react';
import { User, Language } from '../types';
import { translations } from '../translations';
import { updateUserProfile } from '../services/userService';
import { auth } from '../services/firebase';

interface ProfileEditorProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (user: User) => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ user, isOpen, onClose, onUpdate }) => {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [language, setLanguage] = useState<Language>(user.language);
  const [saving, setSaving] = useState(false);

  // Use selected language for labels, or current user language
  const t = translations[language].profile;

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!auth.currentUser) return;
    
    setSaving(true);
    const updatedUser = { ...user, name, phone, language };
    
    try {
        await updateUserProfile(auth.currentUser.uid, { name, phone, language });
        onUpdate(updatedUser);
        onClose();
    } catch (e) {
        console.error("Failed to update profile", e);
        // Optional: Add error handling UI here
    } finally {
        setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="bg-[#EAE7DC] dark:bg-[#1c1917] rounded-[2rem] p-8 w-full max-w-md relative z-10 shadow-2xl border-2 border-stone-200 dark:border-stone-800 animate-fade-in-up">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-3xl font-display font-bold text-stone-900 dark:text-white">{t.title}</h2>
           <button onClick={onClose} className="w-10 h-10 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition-colors">
             <i className="fa-solid fa-xmark"></i>
           </button>
        </div>
        
        <div className="space-y-6">
          <div className="group">
            <label className="block text-xs font-mono uppercase tracking-widest text-stone-500 mb-2 group-focus-within:text-green-600 transition-colors">{t.yourName}</label>
            <input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="w-full bg-white dark:bg-stone-900 p-4 rounded-xl outline-none font-bold text-lg text-stone-900 dark:text-white border-2 border-transparent focus:border-green-600 transition-all shadow-sm"
              placeholder="Enter name"
            />
          </div>

          <div className="group">
             <label className="block text-xs font-mono uppercase tracking-widest text-stone-500 mb-2 group-focus-within:text-green-600 transition-colors">{t.prefLang}</label>
             <div className="relative">
               <select 
                 value={language} 
                 onChange={e => setLanguage(e.target.value as Language)}
                 className="w-full bg-white dark:bg-stone-900 p-4 rounded-xl outline-none font-bold text-lg text-stone-900 dark:text-white border-2 border-transparent focus:border-green-600 transition-all shadow-sm appearance-none"
               >
                  <option value="en">English</option>
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="te">తెలుగు (Telugu)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                  <option value="kn">ಕನ್ನಡ (Kannada)</option>
                  <option value="mr">मराठी (Marathi)</option>
               </select>
               <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"></i>
             </div>
          </div>

          <div className="group">
            <label className="block text-xs font-mono uppercase tracking-widest text-stone-500 mb-2 group-focus-within:text-green-600 transition-colors">{t.phone}</label>
            <input 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              className="w-full bg-white dark:bg-stone-900 p-4 rounded-xl outline-none font-bold text-lg text-stone-900 dark:text-white border-2 border-transparent focus:border-green-600 transition-all shadow-sm"
              placeholder="9876543210"
            />
          </div>
        </div>

        <div className="flex gap-4 mt-10">
          <button 
            onClick={onClose} 
            className="flex-1 py-4 font-bold text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-stone-800 rounded-xl transition-colors"
          >
            {t.cancel}
          </button>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className={`flex-[2] py-4 bg-stone-900 dark:bg-white hover:bg-green-700 dark:hover:bg-green-400 text-white dark:text-stone-900 font-bold rounded-xl shadow-xl shadow-green-900/10 transition-all hover:scale-[1.02] ${saving ? 'opacity-70' : ''}`}
          >
            {saving ? 'Saving...' : t.update}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;