import React, { useRef, useState } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { User, Language } from '../types';
import { translations } from '../translations';
import ProfileEditor from './ProfileEditor';

const data = [
  { name: 'M', rain: 20 },
  { name: 'T', rain: 45 },
  { name: 'W', rain: 10 },
  { name: 'T', rain: 0 },
  { name: 'F', rain: 5 },
  { name: 'S', rain: 60 },
  { name: 'S', rain: 30 },
];

interface DashboardProps {
  user: User | null;
  language: Language;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
}

// --- MAGNETIC COMPONENT ---
const MagneticWrapper = ({ children, className }: { children?: React.ReactNode, className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) * 0.2);
    y.set((clientY - centerY) * 0.2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// --- SERVICE TILE (Dashboard Version) ---
const DashboardTile = ({ icon, title, desc, color, textColor, delay }: any) => (
  <motion.button 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className={`w-full h-full min-h-[220px] rounded-[2.5rem] p-6 flex flex-col items-start justify-between text-left ${color} relative overflow-hidden group hover:shadow-2xl transition-shadow`}
  >
    <div className={`absolute -right-4 -bottom-4 text-8xl opacity-10 group-hover:scale-110 transition-transform duration-500 ${textColor}`}>
      <i className={`fa-solid ${icon}`}></i>
    </div>
    
    <div className={`w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shadow-lg ${textColor}`}>
      <i className={`fa-solid ${icon}`}></i>
    </div>
    
    <div className="relative z-10">
      <h3 className={`font-display font-bold text-2xl mb-2 leading-none ${textColor}`}>{title}</h3>
      <p className={`text-sm font-medium opacity-80 leading-snug max-w-[80%] ${textColor}`}>{desc}</p>
    </div>

    <div className={`flex items-center gap-2 text-xs font-mono uppercase tracking-widest font-bold ${textColor}`}>
      <span>Open</span>
      <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
    </div>
  </motion.button>
);

const Dashboard: React.FC<DashboardProps> = ({ user, language, onLogout, onUpdateUser }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const t = translations[language].dashboard;
  const navT = translations[language].nav;

  return (
    <div className="min-h-screen p-4 pt-28 md:p-8 md:pt-32 pb-24 relative overflow-hidden bg-[#EAE7DC] dark:bg-[#0c0a09] transition-colors duration-700">
      
      {/* Profile Modal */}
      {user && (
        <ProfileEditor 
          user={user} 
          isOpen={isProfileOpen} 
          onClose={() => setIsProfileOpen(false)} 
          onUpdate={onUpdateUser}
        />
      )}

      {/* Dynamic Background Blob */}
      <div className="fixed top-0 left-0 w-full h-full -z-50 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-emerald-400/5 dark:bg-emerald-500/10 rounded-full blur-[120px]" 
        />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <header className="mb-12 md:mb-20 flex flex-col md:flex-row md:items-end justify-between relative z-10 gap-6">
          <div>
            <motion.h1 
              key={language}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-black text-5xl md:text-8xl text-stone-900 dark:text-white mb-2 tracking-tighter leading-[0.85]"
            >
              {t.greeting}<span className="text-orange-600">.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="text-stone-500 dark:text-stone-400 text-lg font-mono uppercase tracking-widest mt-4"
            >
              {user?.name.split(' ')[0] || 'Farmer'} • <span className="text-green-600 dark:text-green-400">{t.subtitle}</span>
            </motion.p>
          </div>
          
          {/* Action Row */}
          <div className="flex items-center gap-4">
             {/* Sync Badge */}
             <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-stone-300 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50 backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-bold text-stone-600 dark:text-stone-300 uppercase tracking-widest">{t.liveFeed}</span>
             </div>

             {/* Profile Button */}
             <motion.button 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => setIsProfileOpen(true)}
               className="group flex items-center gap-3 px-6 py-3 bg-white dark:bg-stone-800 rounded-full text-stone-900 dark:text-white shadow-lg hover:shadow-xl transition-all border border-stone-200 dark:border-stone-700"
             >
                <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">
                  {user?.name?.charAt(0)}
                </div>
                <span className="font-display font-bold text-sm tracking-wide hidden md:inline">{navT.profile}</span>
             </motion.button>

             {/* Stylish Logout Button */}
             <motion.button 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={onLogout}
               className="group flex items-center gap-3 px-6 py-3 bg-stone-900 dark:bg-white rounded-full text-white dark:text-stone-900 shadow-xl hover:shadow-2xl hover:shadow-red-500/20 transition-all"
             >
                <div className="w-6 h-6 rounded-full bg-stone-700 dark:bg-stone-200 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
                  <i className="fa-solid fa-power-off text-xs"></i>
                </div>
                <span className="font-display font-bold text-sm tracking-wide">{navT.logout}</span>
             </motion.button>
          </div>
        </header>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          
          {/* 1. DAILY INTELLIGENCE */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="md:col-span-8 relative overflow-hidden rounded-[3rem] bg-stone-900 text-white shadow-2xl shadow-emerald-900/20 group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-stone-800 via-stone-900 to-black opacity-90"></div>
            <div className="absolute top-[-50%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[80px]"></div>

            <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-between min-h-[400px]">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-widest text-emerald-300 mb-8">
                  <i className="fa-solid fa-sparkles"></i> {t.aiBadge}
                </div>
                <h3 
                  className="font-display font-light text-3xl md:text-5xl leading-[1.1] mb-8"
                  dangerouslySetInnerHTML={{ __html: `"${t.aiText}"` }} 
                />
              </div>
              
              <div className="flex items-center gap-6">
                 <div className="w-12 h-12 rounded-full bg-white text-stone-900 flex items-center justify-center text-xl cursor-pointer hover:scale-110 transition-transform">
                    <i className="fa-solid fa-microphone"></i>
                 </div>
                 <span className="font-mono text-sm text-stone-400 uppercase tracking-wider">{t.listen}</span>
              </div>
            </div>
          </motion.div>

          {/* 2. WEATHER */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-4 bg-orange-500 rounded-[3rem] p-8 md:p-10 flex flex-col justify-between relative overflow-hidden text-white"
          >
             <div className="absolute top-0 right-0 p-8 opacity-20 text-9xl transform translate-x-4 -translate-y-4">
                <i className="fa-solid fa-sun text-yellow-300"></i>
             </div>
             
             <div>
                <p className="font-mono text-xs uppercase tracking-widest text-orange-200 mb-2">{t.weather}</p>
                <h2 className="font-display font-black text-8xl tracking-tighter">28°</h2>
             </div>

             <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center border-b border-white/20 pb-2">
                   <span className="font-medium opacity-80">{t.humidity}</span>
                   <span className="font-bold font-mono">42%</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/20 pb-2">
                   <span className="font-medium opacity-80">{t.wind}</span>
                   <span className="font-bold font-mono">12km/h</span>
                </div>
             </div>
          </motion.div>

          {/* 3. CHART */}
          <div className="md:col-span-6 bg-white dark:bg-stone-800 rounded-[3rem] p-8 md:p-12 relative overflow-hidden border border-stone-100 dark:border-stone-700">
            <div className="flex justify-between items-end mb-8">
               <h2 className="font-display font-bold text-3xl text-stone-900 dark:text-white">{t.rainfall}<br/><span className="text-stone-400 font-light">{t.forecast}</span></h2>
               <div className="text-right">
                  <p className="text-5xl font-mono font-bold text-stone-900 dark:text-white">60<span className="text-lg text-stone-400">mm</span></p>
               </div>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    cursor={false}
                    contentStyle={{backgroundColor: '#1c1917', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px', fontFamily: 'Space Grotesk'}} 
                  />
                  <Area type="monotone" dataKey="rain" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorRain)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* 4. EXPANDED SERVICE TILES (Upgraded from Quick Actions) */}
          <div className="md:col-span-6 grid grid-cols-2 gap-4">
             <MagneticWrapper>
                <DashboardTile 
                  icon="fa-camera" 
                  title={t.scan} 
                  desc={t.scanDesc} 
                  color="bg-stone-900 dark:bg-white" 
                  textColor="text-white dark:text-stone-900" 
                  delay={0.2}
                />
             </MagneticWrapper>
             <MagneticWrapper>
                <DashboardTile 
                  icon="fa-flask" 
                  title={t.soil} 
                  desc={t.soilDesc} 
                  color="bg-stone-200 dark:bg-stone-800" 
                  textColor="text-stone-900 dark:text-white" 
                  delay={0.3}
                />
             </MagneticWrapper>
             <MagneticWrapper>
                <DashboardTile 
                  icon="fa-book-open" 
                  title={t.academy} 
                  desc={t.academyDesc} 
                  color="bg-stone-200 dark:bg-stone-800" 
                  textColor="text-stone-900 dark:text-white" 
                  delay={0.4}
                />
             </MagneticWrapper>
             <MagneticWrapper>
                <DashboardTile 
                  icon="fa-users" 
                  title={t.community} 
                  desc={t.communityDesc} 
                  color="bg-stone-200 dark:bg-stone-800" 
                  textColor="text-stone-900 dark:text-white" 
                  delay={0.5}
                />
             </MagneticWrapper>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;