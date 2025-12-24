import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Language } from '../types';
import { translations } from '../translations';
import ProfileEditor from './ProfileEditor';

interface AdminDashboardProps {
  user: User | null;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
  language: Language;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout, onUpdateUser, language }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  if (!user || user.role !== 'admin') return <div className="p-10 text-center font-mono">ACCESS DENIED</div>;

  const t = translations[language].admin;
  const navT = translations[language].nav;

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-[#0c0a09] p-6 md:p-12 transition-colors duration-500 pt-28">
      
      {/* Profile Modal */}
      <ProfileEditor 
        user={user} 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        onUpdate={onUpdateUser}
      />

      <div className="max-w-[1600px] mx-auto">
        
        {/* HEADER */}
        <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-stone-300 dark:border-stone-800 pb-8 gap-6">
           <div>
             <h1 className="text-4xl md:text-6xl font-display font-black text-stone-900 dark:text-white tracking-tighter uppercase mb-2">
               {t.title}<span className="text-stone-400">Center</span>
             </h1>
             <p className="font-mono text-sm text-stone-500 dark:text-stone-400 uppercase tracking-widest">
               v2.4.0 • {t.subtitle}: <span className="text-green-500">{t.status}</span>
             </p>
           </div>
           
           <div className="flex items-center gap-4 mt-6 md:mt-0">
             <div className="bg-stone-900 text-white px-6 py-3 rounded-full font-bold text-sm shadow-xl flex items-center gap-3">
               <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
               SUPER ADMIN
             </div>

             {/* Profile Button */}
             <motion.button 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => setIsProfileOpen(true)}
               className="group flex items-center gap-3 px-6 py-3 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-full text-stone-900 dark:text-white shadow-lg hover:shadow-xl hover:bg-stone-50 dark:hover:bg-stone-700 transition-all"
             >
                <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">
                  {user.name.charAt(0)}
                </div>
                <span className="font-display font-bold text-sm tracking-wide">{navT.profile}</span>
             </motion.button>

             {/* Logout */}
             <motion.button 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={onLogout}
               className="group flex items-center gap-3 px-6 py-3 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-full text-stone-900 dark:text-white shadow-lg hover:shadow-xl hover:bg-stone-50 dark:hover:bg-stone-700 transition-all"
             >
                <div className="w-6 h-6 rounded-full bg-stone-200 dark:bg-stone-600 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
                  <i className="fa-solid fa-power-off text-xs"></i>
                </div>
                <span className="font-display font-bold text-sm tracking-wide">{navT.logout}</span>
             </motion.button>
           </div>
        </header>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <StatCard label={t.farmers} value="1,240" trend="+12%" />
          <StatCard label={t.queries} value="85" trend="Live" color="text-green-500" />
          <StatCard label={t.alerts} value="03" trend="Attention" color="text-red-500" />
        </div>

        {/* TABLE */}
        <div className="bg-white dark:bg-stone-900 rounded-[2rem] p-8 shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-display font-bold text-2xl text-stone-800 dark:text-white">{t.signals}</h3>
            <button className="text-sm font-mono uppercase border-b border-stone-400 pb-1">View All</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                 <tr>
                   <Th>User</Th>
                   <Th>ID</Th>
                   <Th>Role</Th>
                   <Th>Status</Th>
                   <Th>Action</Th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                 <Row name="Farmer Ram" id="883-29" role="Farmer" status="Active" />
                 <Row name="Farmer Sita" id="883-30" role="Farmer" status="Active" />
                 <Row name="Gopal K." id="883-31" role="Pending" status="Review" />
                 <Row name="Anita R." id="883-32" role="Farmer" status="Active" />
               </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SUBCOMPONENTS ---

const StatCard = ({ label, value, trend, color }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white dark:bg-stone-900 p-8 rounded-[2rem] border border-stone-200 dark:border-stone-800 shadow-sm relative group overflow-hidden"
  >
    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
      <i className="fa-solid fa-arrow-right -rotate-45 text-2xl"></i>
    </div>
    <p className="font-mono text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-4">{label}</p>
    <div className="flex items-baseline gap-4">
      <h2 className="text-7xl font-display font-black text-stone-900 dark:text-white tracking-tighter">{value}</h2>
      <span className={`font-mono text-sm font-bold ${color || 'text-stone-400'}`}>{trend}</span>
    </div>
  </motion.div>
);

const Th = ({ children }: { children?: React.ReactNode }) => (
  <th className="py-6 px-4 font-mono text-xs uppercase tracking-widest text-stone-400 border-b border-stone-200 dark:border-stone-800 font-normal">
    {children}
  </th>
);

const Row = ({ name, id, role, status }: any) => (
  <motion.tr 
    whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
    className="group cursor-pointer transition-colors"
  >
    <td className="py-6 px-4 font-display font-bold text-xl text-stone-900 dark:text-white">{name}</td>
    <td className="py-6 px-4 font-mono text-stone-500">{id}</td>
    <td className="py-6 px-4 text-stone-600 dark:text-stone-300">{role}</td>
    <td className="py-6 px-4">
      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
        status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
      }`}>
        {status}
      </span>
    </td>
    <td className="py-6 px-4">
       <button className="w-10 h-10 rounded-full border border-stone-200 dark:border-stone-700 flex items-center justify-center hover:bg-stone-900 hover:text-white transition-colors">
         <i className="fa-solid fa-ellipsis"></i>
       </button>
    </td>
  </motion.tr>
);

export default AdminDashboard;