import React from 'react';
import { AppView, Language, User } from '../types';
import { translations } from '../translations';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  user: User | null;
  darkMode: boolean;
  toggleTheme: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  currentView, setView, language, setLanguage, user, darkMode, toggleTheme
}) => {
  const t = translations[language].nav;

  return (
    <>
      {/* Desktop Floating Navigation */}
      <nav className="fixed top-6 left-0 right-0 z-50 hidden md:flex justify-center px-4 pointer-events-none">
        <div className="glass rounded-full px-6 py-3 flex items-center justify-between gap-8 pointer-events-auto shadow-2xl shadow-green-900/10 dark:shadow-black/40 ring-1 ring-black/5 dark:ring-white/10 max-w-5xl w-full transition-all duration-300 transform hover:scale-[1.005]">
          
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer group" 
            onClick={() => setView(AppView.LANDING)}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-700 rounded-xl flex items-center justify-center text-white mr-3 shadow-lg shadow-green-500/30 group-hover:rotate-6 transition-transform">
              <i className="fa-solid fa-leaf text-lg"></i>
            </div>
            <span className="font-display font-bold text-xl text-stone-800 dark:text-white tracking-tight">Agri<span className="text-green-600 dark:text-green-400">Fields</span></span>
          </div>

          {/* Center Links */}
          {user && user.role === 'farmer' && (
            <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800/50 rounded-full p-1.5 border border-stone-200 dark:border-white/5">
              <NavBtn active={currentView === AppView.DASHBOARD} onClick={() => setView(AppView.DASHBOARD)} icon="fa-home" label={t.home} />
              <NavBtn active={currentView === AppView.TEACHER} onClick={() => setView(AppView.TEACHER)} icon="fa-chalkboard-user" label={t.guru} />
              <NavBtn active={currentView === AppView.DOCTOR} onClick={() => setView(AppView.DOCTOR)} icon="fa-stethoscope" label={t.doctor} />
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full bg-transparent hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-all flex items-center justify-center"
            >
              <i className={`fa-solid ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>

            <div className="relative group">
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="appearance-none bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm font-semibold rounded-full pl-4 pr-8 py-2 focus:ring-2 focus:ring-green-500 outline-none text-stone-700 dark:text-stone-300 cursor-pointer hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="te">తెలుగు</option>
                <option value="ta">தமிழ்</option>
                <option value="kn">ಕನ್ನಡ</option>
                <option value="mr">मराठी</option>
              </select>
              <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 pointer-events-none"></i>
            </div>

            {!user ? (
              <button 
                onClick={() => setView(AppView.AUTH)}
                className="bg-stone-900 dark:bg-white hover:bg-stone-800 dark:hover:bg-stone-200 text-white dark:text-stone-900 text-sm font-bold py-2.5 px-6 rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                {t.login}
              </button>
            ) : (
              <button 
                onClick={() => setView(AppView.PROFILE)}
                className="flex items-center gap-3 pl-1 pr-4 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-white dark:hover:bg-stone-700 rounded-full border border-stone-200 dark:border-stone-700 transition-all"
              >
                <div className="w-8 h-8 bg-gradient-to-tr from-green-500 to-emerald-400 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-stone-700 dark:text-stone-200 max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Header (Sticky) */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 glass border-b-0">
        <div className="px-4 h-16 flex items-center justify-between">
           <div 
            className="flex items-center gap-2" 
            onClick={() => setView(AppView.LANDING)}
          >
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white">
              <i className="fa-solid fa-leaf text-sm"></i>
            </div>
            <span className="font-display font-bold text-lg text-stone-800 dark:text-white">Agri<span className="text-green-600">Fields</span></span>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={toggleTheme} className="text-stone-500 dark:text-stone-400">
               <i className={`fa-solid ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
             </button>
             {!user ? (
               <button onClick={() => setView(AppView.AUTH)} className="text-sm font-bold text-green-700 dark:text-green-400">{t.login}</button>
             ) : (
               <div onClick={() => setView(AppView.PROFILE)} className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
               </div>
             )}
          </div>
        </div>
      </nav>
      
      {/* Mobile Bottom Bar */}
      {user && user.role === 'farmer' && (
        <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
          <div className="glass rounded-2xl flex justify-around py-3 px-2 shadow-2xl shadow-black/20 border border-white/20 dark:border-white/10">
             <MobileNavBtn active={currentView === AppView.DASHBOARD} onClick={() => setView(AppView.DASHBOARD)} icon="fa-home" />
             <MobileNavBtn active={currentView === AppView.TEACHER} onClick={() => setView(AppView.TEACHER)} icon="fa-chalkboard-user" />
             <div className="w-12 h-12 -mt-8 bg-green-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-600/40 transform rotate-45 border-4 border-stone-50 dark:border-stone-900" onClick={() => setView(AppView.DOCTOR)}>
               <i className="fa-solid fa-camera transform -rotate-45 text-xl"></i>
             </div>
             <MobileNavBtn active={currentView === AppView.DOCTOR} onClick={() => setView(AppView.DOCTOR)} icon="fa-stethoscope" />
             <MobileNavBtn active={currentView === AppView.LESSONS} onClick={() => setView(AppView.LESSONS)} icon="fa-book-open" />
          </div>
        </div>
      )}
    </>
  );
};

const NavBtn = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
      active 
        ? 'bg-white dark:bg-stone-700 text-green-700 dark:text-green-400 shadow-sm font-bold' 
        : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 font-medium'
    }`}
  >
    <i className={`fa-solid ${icon}`}></i>
    <span>{label}</span>
  </button>
);

const MobileNavBtn = ({ active, onClick, icon }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-10 h-10 rounded-xl transition-all ${
      active ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'text-stone-400 dark:text-stone-500'
    }`}
  >
    <i className={`fa-solid ${icon} text-lg`}></i>
  </button>
);

export default Navigation;