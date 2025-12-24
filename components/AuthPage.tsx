import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Language } from '../types';
import { translations } from '../translations';
import { loginUser, registerUser } from '../services/authService';

interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
  onCancel: () => void;
  language: Language;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess, onCancel, language: initialLanguage }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState(''); 
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [error, setError] = useState<string | null>(null);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const t = translations[language].auth;

  // We keep the Super Admin credentials for special access, 
  // but we will still route them through Firebase loginUser logic if they exist there,
  // or handle the registration if it's the first time.
  const ADMIN_EMAIL = "jagannatha.vm@gmail.com";

  const validatePhone = (p: string) => /^[0-9]{10}$/.test(p);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
        if (isAdminLogin) {
            // Admin Login Flow
            if (isRegistering) {
                 // Registering a new Admin
                 const user = await registerUser(name || "Admin", email, password, language, 'admin');
                 onLoginSuccess(user);
            } else {
                 // Login Admin
                 // Note: Our auth service treats email as phone for simplicity in standard flow,
                 // but for admin using actual email, we pass it directly.
                 const user = await loginUser(email, password);
                 if (user.role !== 'admin') {
                     throw new Error("Access Denied: Not an admin account.");
                 }
                 onLoginSuccess(user);
            }
        } else {
            // Farmer Flow
            if (!validatePhone(phone)) {
                throw new Error(t.errorPhone);
            }
            if (!password || password.length < 6) {
                throw new Error(t.errorPass || "Password must be at least 6 characters.");
            }

            if (isRegistering) {
                if (!name.trim()) throw new Error(t.errorName);
                const user = await registerUser(name, phone, password, language, 'farmer');
                onLoginSuccess(user);
            } else {
                const user = await loginUser(phone, password);
                onLoginSuccess(user);
            }
        }
    } catch (err: any) {
        let msg = err.message;
        if (msg.includes("auth/invalid-email")) msg = "Invalid Phone/Email format.";
        if (msg.includes("auth/user-not-found")) msg = "User not found. Please register.";
        if (msg.includes("auth/wrong-password")) msg = "Incorrect password.";
        if (msg.includes("auth/email-already-in-use")) msg = "User already exists. Please login.";
        setError(msg);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#EAE7DC] dark:bg-[#0c0a09] overflow-hidden">
      
      {/* LEFT: Immersive Story (Ref: lecoucou.com) */}
      <motion.div 
        initial={{ width: "100%" }}
        animate={{ width: "50%" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:block relative h-screen overflow-hidden"
      >
        <motion.img 
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?q=80&w=1600&auto=format&fit=crop" 
          alt="Agriculture" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-stone-900/30"></div>
        
        <div className="absolute bottom-20 left-20 text-white max-w-lg">
           <h2 className="font-display font-bold text-6xl leading-[0.9] mb-6">
             The Soil <br/> Knows.
           </h2>
           <p className="font-mono text-sm uppercase tracking-widest opacity-80">
             AgriFields © 2026 • Intelligent Farming
           </p>
        </div>
      </motion.div>

      {/* RIGHT: Luxury Form (Ref: white-coffee.com) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 relative">
        <button onClick={onCancel} className="absolute top-10 right-10 w-12 h-12 rounded-full border border-stone-300 flex items-center justify-center hover:bg-stone-200 transition-colors z-50">
           <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="max-w-md w-full">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.5 }}
           >
             <h3 className="font-display font-bold text-4xl text-stone-900 dark:text-white mb-2">
               {isAdminLogin ? t.admin : (isRegistering ? t.join : t.welcome)}
             </h3>
             <p className="text-stone-500 mb-12">
               {isAdminLogin ? t.adminDesc : (isRegistering ? t.joinDesc : t.loginDesc)}
             </p>

             <form className="space-y-8" onSubmit={handleAuth}>
                {error && (
                  <div className="text-red-600 font-mono text-xs uppercase tracking-widest border-l-2 border-red-500 pl-3">
                    {error}
                  </div>
                )}

                {isAdminLogin ? (
                   <div className="space-y-6">
                     {isRegistering && (
                       <MinimalInput label="Name" type="text" value={name} onChange={setName} placeholder="Admin Name" />
                     )}
                     <MinimalInput label="Email" type="email" value={email} onChange={setEmail} placeholder="admin@agrifields.com" />
                     <MinimalInput label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
                   </div>
                ) : (
                  <div className="space-y-6">
                    {isRegistering && (
                      <MinimalInput label={t.name} type="text" value={name} onChange={setName} placeholder="Ram Kumar" />
                    )}
                    
                    <div className="group">
                       <label className="block text-xs font-mono uppercase tracking-widest text-stone-400 mb-2 group-focus-within:text-green-600 transition-colors">{t.phone}</label>
                       <div className="relative">
                          <span className="absolute left-0 bottom-3 text-lg font-bold text-stone-400">+91</span>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="9876543210"
                            className="block w-full pl-10 pr-0 py-3 bg-transparent border-b-2 border-stone-200 focus:border-green-600 text-2xl font-display font-bold text-stone-900 dark:text-white placeholder-stone-300 focus:outline-none transition-colors"
                          />
                       </div>
                    </div>

                    <MinimalInput 
                      label={t.password} 
                      type="password" 
                      value={password} 
                      onChange={setPassword} 
                      placeholder="••••••••" 
                    />

                    {isRegistering && (
                       <div className="group">
                         <label className="block text-xs font-mono uppercase tracking-widest text-stone-400 mb-2">{t.lang}</label>
                         <select
                           value={language}
                           onChange={(e) => setLanguage(e.target.value as Language)}
                           className="block w-full py-3 bg-transparent border-b-2 border-stone-200 focus:border-green-600 text-xl font-bold text-stone-900 dark:text-white focus:outline-none appearance-none rounded-none"
                         >
                           <option value="en">English</option>
                           <option value="hi">Hindi</option>
                           <option value="te">Telugu</option>
                           <option value="ta">Tamil</option>
                           <option value="kn">Kannada</option>
                           <option value="mr">Marathi</option>
                         </select>
                       </div>
                    )}
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className={`w-full py-6 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-2xl font-bold text-lg tracking-wide hover:shadow-2xl transition-all mt-8 ${loading ? 'opacity-70 cursor-wait' : ''}`}
                >
                  {loading ? 'Processing...' : (isAdminLogin ? t.auth : (isRegistering ? t.start : t.enter))}
                </motion.button>
             </form>

             <div className="mt-12 flex justify-between items-center text-sm font-medium">
                <button 
                   onClick={() => {
                     setIsRegistering(!isRegistering);
                     setError(null);
                     setPassword('');
                   }}
                   className="text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors"
                >
                   {isRegistering ? t.existing : t.newUser}
                </button>
                
                <button 
                  onClick={() => {
                    setIsAdminLogin(!isAdminLogin);
                    setError(null);
                    setPassword('');
                  }}
                  className="px-4 py-2 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors text-xs font-bold uppercase tracking-widest"
                >
                  {isAdminLogin ? `← ${t.farmerAccess}` : `${t.adminAccess} →`}
                </button>
             </div>
           </motion.div>
        </div>
      </div>
    </div>
  );
};

const MinimalInput = ({ label, type, value, onChange, placeholder }: any) => (
  <div className="group">
    <label className="block text-xs font-mono uppercase tracking-widest text-stone-400 mb-2 group-focus-within:text-green-600 transition-colors">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="block w-full px-0 py-3 bg-transparent border-b-2 border-stone-200 focus:border-green-600 text-xl font-display font-bold text-stone-900 dark:text-white placeholder-stone-300 focus:outline-none transition-colors rounded-none"
    />
  </div>
);

export default AuthPage;