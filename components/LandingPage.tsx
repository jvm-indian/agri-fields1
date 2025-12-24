import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useVelocity, useAnimationFrame } from 'framer-motion';
import { Language } from '../types';
import { translations } from '../translations';

interface LandingPageProps {
  onStart: () => void;
  language: Language;
}

// --- COMPONENT: MAGNETIC BUTTON ---
const MagneticButton = ({ children, onClick, className }: any) => {
  const ref = useRef<HTMLButtonElement>(null);
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
    x.set((clientX - centerX) * 0.3);
    y.set((clientY - centerY) * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={`relative overflow-hidden group ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <motion.div 
        className="absolute inset-0 bg-stone-900 dark:bg-white rounded-full -z-0 scale-0 group-hover:scale-150 transition-transform duration-500 ease-out origin-center"
        style={{ position: 'relative' }}
      />
    </motion.button>
  );
};

// --- COMPONENT: PARALLAX TEXT ---
interface ParallaxTextProps {
  children?: React.ReactNode;
  baseVelocity?: number;
}

const ParallaxText = ({ children, baseVelocity = 100 }: ParallaxTextProps) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });

  const x = useTransform(baseX, (v) => `${v}%`); 

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) directionFactor.current = -1;
    else if (velocityFactor.get() > 0) directionFactor.current = 1;
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden whitespace-nowrap flex flex-nowrap">
      <motion.div className="flex whitespace-nowrap flex-nowrap gap-10" style={{ x }}>
        <span className="block text-9xl md:text-[12rem] font-display font-black uppercase text-transparent stroke-text opacity-20">{children}</span>
        <span className="block text-9xl md:text-[12rem] font-display font-black uppercase text-transparent stroke-text opacity-20">{children}</span>
        <span className="block text-9xl md:text-[12rem] font-display font-black uppercase text-transparent stroke-text opacity-20">{children}</span>
        <span className="block text-9xl md:text-[12rem] font-display font-black uppercase text-transparent stroke-text opacity-20">{children}</span>
      </motion.div>
    </div>
  );
};

// --- COMPONENT: SERVICE TILE (New Farmer-Appealing Feature) ---
const ServiceTile = ({ icon, title, desc, action, color, textColor, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    whileHover={{ y: -5 }}
    className={`${color} rounded-[2rem] p-8 flex flex-col justify-between relative overflow-hidden min-h-[320px] group border border-black/5 dark:border-white/10 shadow-xl`}
  >
    {/* Background Icon Watermark */}
    <div className={`absolute -bottom-4 -right-4 text-9xl opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-700 ${textColor}`}>
      <i className={`fa-solid ${icon}`}></i>
    </div>

    <div>
      <div className={`w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl mb-6 shadow-lg ${textColor}`}>
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <h3 className={`text-3xl font-display font-bold mb-3 leading-tight ${textColor}`}>{title}</h3>
      <p className={`text-lg font-medium opacity-90 leading-relaxed ${textColor}`}>{desc}</p>
    </div>

    <div className={`mt-8 flex items-center gap-3 text-sm font-mono uppercase tracking-widest font-bold ${textColor} cursor-pointer`}>
      <span>{action}</span>
      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
         <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
      </div>
    </div>
  </motion.div>
);

// --- COMPONENT: STEP CARD (New Journey Feature) ---
const StepCard = ({ number, title, desc, icon }: any) => (
  <div className="flex flex-col items-center text-center relative z-10 group">
    <div className="w-24 h-24 rounded-[2rem] bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white flex items-center justify-center text-4xl mb-6 shadow-xl relative transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 border border-stone-200 dark:border-stone-700">
       <i className={`fa-solid ${icon} text-green-600`}></i>
       <div className="absolute -top-3 -right-3 w-10 h-10 rounded-xl bg-orange-500 text-white text-lg font-bold flex items-center justify-center border-4 border-[#EAE7DC] dark:border-[#0c0a09] shadow-md">
         {number}
       </div>
    </div>
    <h4 className="text-2xl font-display font-bold text-stone-900 dark:text-white mb-3">{title}</h4>
    <p className="text-base text-stone-600 dark:text-stone-400 max-w-[220px] leading-relaxed font-medium">{desc}</p>
  </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onStart, language }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  const yHero = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  const scaleHero = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  
  const t = translations[language].landing;

  return (
    <div ref={containerRef} className="bg-[#EAE7DC] dark:bg-[#0c0a09] min-h-screen relative overflow-hidden transition-colors duration-700">
      
      {/* 1. HERO SECTION (Retained Existing Style) */}
      <motion.section 
        style={{ y: yHero, scale: scaleHero }}
        className="h-screen flex flex-col justify-between p-8 md:p-16 relative z-10"
      >
        <div className="flex justify-between items-start">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex items-center gap-2"
          >
            <div className="w-3 h-3 bg-orange-600 rounded-full animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-stone-500">AgriFields © 2026</span>
          </motion.div>
          
          <MagneticButton onClick={onStart} className="hidden md:block px-8 py-3 border border-stone-900 dark:border-white rounded-full text-sm font-bold uppercase tracking-wider hover:text-white dark:hover:text-stone-900 transition-colors">
            {t.launch}
          </MagneticButton>
        </div>

        <div className="relative z-10">
          <motion.h1 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="fluid-text font-display font-black text-stone-900 dark:text-white leading-[0.8] tracking-tighter mix-blend-exclusion"
            dangerouslySetInnerHTML={{ __html: t.heroTitle.replace(" ", "<br/>") }}
          />
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-4 flex items-center gap-4 pl-2"
          >
            <div className="h-[2px] w-12 bg-orange-600"></div>
            <p className="font-mono text-sm md:text-xl tracking-[0.4em] text-orange-600 uppercase font-bold">
              {t.heroSub}
            </p>
          </motion.div>
        </div>

        {/* STYLISH IMAGE FRAME */}
        <motion.div 
            initial={{ opacity: 0, x: 100, rotate: 6 }}
            animate={{ opacity: 1, x: 0, rotate: 3 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="hidden lg:block absolute top-[15%] right-[6%] w-[32vw] max-w-[480px] aspect-[4/5] z-0 pointer-events-none"
        >
             <div className="relative w-full h-full rounded-[3rem] overflow-hidden shadow-2xl border-4 border-stone-100 dark:border-stone-800 rotate-[0deg] transition-all duration-700 hover:rotate-0 hover:scale-[1.02]">
                <img 
                  src="https://rupiya.app/wp-content/uploads/2025/03/erasebg-transformed-2.png" 
                  alt="Modern Farmer" 
                  className="w-full h-full object-cover transform scale-110 grayscale-[10%] hover:grayscale-0 transition-all duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                
                {/* Overlay Card */}
                <div className="absolute bottom-8 left-8 right-8">
                   <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-6 rounded-3xl text-white shadow-xl">
                      <div className="flex items-center gap-4 mb-4">
                         <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center text-xl shadow-lg shadow-orange-500/40">
                            <i className="fa-solid fa-wheat-awn"></i>
                         </div>
                         <div>
                            <h4 className="font-display font-bold text-lg leading-none">Smart Farming</h4>
                            <p className="text-xs font-mono opacity-70 uppercase tracking-wide mt-1">Gujarat, India</p>
                         </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center border-t border-white/10 pt-4">
                         <div>
                            <p className="text-[10px] opacity-60 uppercase">Yield</p>
                            <p className="font-mono font-bold text-green-400">+30%</p>
                         </div>
                         <div>
                            <p className="text-[10px] opacity-60 uppercase">Cost</p>
                            <p className="font-mono font-bold">-15%</p>
                         </div>
                         <div>
                            <p className="text-[10px] opacity-60 uppercase">Profit</p>
                            <p className="font-mono font-bold text-yellow-400">High</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
        </motion.div>

        <div className="flex justify-between items-end relative z-10">
          <div className="max-w-md">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-lg md:text-xl font-light text-stone-600 dark:text-stone-400 leading-relaxed"
            >
              {t.heroDesc}
            </motion.p>
          </div>
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-xs font-mono uppercase tracking-widest text-stone-400"
          >
            Scroll to Grow ↓
          </motion.div>
        </div>
      </motion.section>

      {/* 2. SERVICES SECTION (NEW: Icon-Driven Tiles) */}
      <section className="py-24 px-4 md:px-12 relative z-10 bg-white dark:bg-stone-900 rounded-t-[4rem] -mt-20 border-t border-stone-200 dark:border-stone-800">
         <div className="max-w-7xl mx-auto">
            <div className="mb-16 pt-8 flex flex-col md:flex-row justify-between items-end gap-6">
               <h2 className="text-5xl md:text-7xl font-display font-black text-stone-900 dark:text-white max-w-3xl leading-[0.9]" dangerouslySetInnerHTML={{ __html: t.servicesTitle.replace(" ", "<br/>") }}>
               </h2>
               <div className="hidden md:block text-right">
                  <span className="inline-block px-6 py-2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-sm font-bold font-mono uppercase tracking-widest border border-stone-200 dark:border-stone-700">
                    <i className="fa-solid fa-check-double mr-2 text-green-500"></i> Free for farmers
                  </span>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <ServiceTile 
                  title={t.service1} 
                  desc={t.service1Desc}
                  icon="fa-flask" 
                  action="Check Soil"
                  color="bg-green-700" 
                  textColor="text-white"
                  delay={0.1}
               />
               <ServiceTile 
                  title={t.service2} 
                  desc={t.service2Desc}
                  icon="fa-calendar-check" 
                  action="View Plan"
                  color="bg-orange-500" 
                  textColor="text-white"
                  delay={0.2}
               />
               <ServiceTile 
                  title={t.service3} 
                  desc={t.service3Desc}
                  icon="fa-shop" 
                  action="Check Rates"
                  color="bg-stone-900" 
                  textColor="text-white"
                  delay={0.3}
               />
               <ServiceTile 
                  title={t.service4} 
                  desc={t.service4Desc}
                  icon="fa-shield-halved" 
                  action="Get Shield"
                  color="bg-stone-100 dark:bg-stone-800" 
                  textColor="text-stone-900 dark:text-white"
                  delay={0.4}
               />
            </div>
         </div>
      </section>

      {/* 3. JOURNEY SECTION (NEW: Progressive Step Flow) */}
      <section className="py-24 bg-stone-50 dark:bg-black relative overflow-hidden">
         {/* Connector Line */}
         <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-stone-300 dark:via-stone-700 to-transparent -translate-y-6 z-0 border-t border-dashed border-stone-400"></div>
         
         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
               <p className="font-mono text-sm uppercase tracking-widest text-orange-500 font-bold mb-4">How It Works</p>
               <h2 className="text-4xl md:text-6xl font-display font-bold text-stone-900 dark:text-white">{t.journeyTitle}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-4 relative">
               <StepCard 
                 number="01" 
                 icon="fa-camera" 
                 title={t.step1} 
                 desc={t.step1Desc}
               />
               <StepCard 
                 number="02" 
                 icon="fa-clipboard-list" 
                 title={t.step2} 
                 desc={t.step2Desc}
               />
               <StepCard 
                 number="03" 
                 icon="fa-cloud-showers-heavy" 
                 title={t.step3} 
                 desc={t.step3Desc}
               />
               <StepCard 
                 number="04" 
                 icon="fa-sack-dollar" 
                 title={t.step4} 
                 desc={t.step4Desc}
               />
            </div>
            
            <div className="mt-16 text-center">
               <button onClick={onStart} className="px-8 py-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">
                  {t.start}
               </button>
            </div>
         </div>
      </section>

      {/* 4. PICTUREFUL EXPERT SECTION (NEW: Parallax + Expert Module) */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
         {/* Parallax Background Image */}
         <div className="absolute inset-0 z-0">
             <motion.div 
               style={{ y: useTransform(scrollYProgress, [0.4, 1], [0, 150]) }}
               className="w-full h-[130%] -mt-[15%]"
             >
                <img 
                  src="https://bsmedia.business-standard.com/_media/bs/img/article/2024-11/22/full/1732271957-4347.jpg?im=FitAndFill=(826,465)" 
                  alt="Farmer Community" 
                  className="w-full h-full object-cover brightness-[0.6] grayscale-[20%]"
                />
             </motion.div>
             <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
         </div>

         <div className="max-w-7xl mx-auto px-6 relative z-10 w-full flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl text-white">
               <div className="flex items-center gap-3 mb-6">
                  <span className="px-4 py-1.5 rounded-full bg-orange-600 text-white text-xs font-bold uppercase tracking-widest animate-pulse shadow-[0_0_20px_rgba(234,88,12,0.6)]">
                     <i className="fa-solid fa-circle text-[8px] mr-2"></i> Live Now
                  </span>
                  <span className="font-mono text-sm uppercase tracking-wide opacity-80 border-l border-white/30 pl-3">Kisan Call Center</span>
               </div>
               <h2 className="text-5xl md:text-8xl font-display font-black leading-[0.9] mb-8" dangerouslySetInnerHTML={{ __html: t.expertTitle.replace("?", "?<br/>") }}>
               </h2>
               <p className="text-xl md:text-2xl opacity-90 font-light max-w-lg mb-10 leading-relaxed text-stone-300">
                 {t.expertSub}
               </p>
               
               <div className="flex flex-col md:flex-row gap-4">
                  <MagneticButton onClick={onStart} className="px-8 py-5 bg-white text-stone-900 rounded-full font-bold flex items-center justify-center gap-3 hover:bg-stone-200 transition-colors shadow-2xl">
                     <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <i className="fa-solid fa-microphone"></i>
                     </div>
                     <span className="text-lg">{t.tapSpeak}</span>
                  </MagneticButton>
                  <button onClick={onStart} className="px-8 py-5 bg-transparent border border-white/30 backdrop-blur-md rounded-full font-bold text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-3">
                     <i className="fa-solid fa-robot text-2xl text-cyan-400"></i>
                     <span className="text-lg">{t.askAI}</span>
                  </button>
               </div>
            </div>

            {/* Floating Trust Card */}
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-[2.5rem] text-white max-w-sm hidden md:block shadow-2xl hover:scale-105 transition-transform duration-500">
               <div className="flex items-center gap-4 mb-6">
                  <div className="flex -space-x-4">
                     <img src="https://randomuser.me/api/portraits/men/32.jpg" className="w-14 h-14 rounded-full border-2 border-stone-800" alt="Expert" />
                     <img src="https://randomuser.me/api/portraits/women/44.jpg" className="w-14 h-14 rounded-full border-2 border-stone-800" alt="Expert" />
                     <img src="https://randomuser.me/api/portraits/men/86.jpg" className="w-14 h-14 rounded-full border-2 border-stone-800" alt="Expert" />
                  </div>
                  <div>
                     <p className="font-bold text-xl font-display">150+ Experts</p>
                     <p className="text-xs opacity-70 uppercase tracking-wide font-mono text-green-400">Online Now</p>
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="flex items-center gap-3 text-base font-medium">
                     <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs"><i className="fa-solid fa-check"></i></div>
                     <span>24/7 Availability</span>
                  </div>
                  <div className="flex items-center gap-3 text-base font-medium">
                     <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs"><i className="fa-solid fa-check"></i></div>
                     <span>Local Language Support</span>
                  </div>
                  <div className="flex items-center gap-3 text-base font-medium">
                     <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs"><i className="fa-solid fa-check"></i></div>
                     <span>Video Consultation</span>
                  </div>
               </div>
               <div className="mt-8 pt-6 border-t border-white/10 text-center">
                  <p className="text-sm font-mono uppercase tracking-widest opacity-60">Avg Response: 2 mins</p>
               </div>
            </div>
         </div>
      </section>

      {/* 5. INTERACTIVE AI (Retained Existing) */}
      <section className="py-32 bg-stone-900 text-white relative overflow-hidden">
        {/* Animated Background Blob */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-900/30 rounded-full blur-[120px] animate-pulse-slow"></div>

        <div className="max-w-5xl mx-auto px-6 relative z-10">
           <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 rounded-full border border-green-500 text-green-400 text-xs font-mono uppercase tracking-widest mb-4">Gemini Powered</span>
              <h2 className="text-5xl md:text-8xl font-display font-bold">{t.meetGuru}</h2>
           </div>

           {/* Chat Interface */}
           <div className="space-y-8">
              <motion.div 
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ margin: "-100px" }}
                className="flex justify-start"
              >
                 <div className="bg-stone-800 rounded-tr-3xl rounded-tl-3xl rounded-br-3xl p-8 max-w-xl text-2xl md:text-3xl font-light leading-snug">
                   "My tomato leaves are turning yellow with black spots. What should I do?"
                 </div>
              </motion.div>

              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ margin: "-100px" }}
                className="flex justify-end"
              >
                 <div className="bg-green-600 text-white rounded-tr-3xl rounded-tl-3xl rounded-bl-3xl p-8 max-w-xl text-2xl md:text-3xl font-display font-bold shadow-2xl shadow-green-900/50">
                   "It looks like Early Blight. Apply a neem-based organic fungicide today, and avoid overhead watering."
                 </div>
              </motion.div>
           </div>

           <div className="mt-20 flex justify-center">
              <MagneticButton onClick={onStart} className="bg-white text-stone-900 px-12 py-6 rounded-full text-xl font-bold hover:bg-stone-200 transition-colors">
                 {t.demoMode}
              </MagneticButton>
           </div>
        </div>
      </section>

      {/* 6. IMPACT / SPECS (Retained Existing) */}
      <section className="py-32 px-4 border-b border-stone-300 dark:border-stone-800">
         <div className="max-w-7xl mx-auto">
            <h2 className="font-mono text-sm uppercase tracking-widest text-stone-500 mb-12">System Specifications</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-16 gap-x-8">
               <div className="border-l border-stone-300 dark:border-stone-700 pl-6">
                  <h3 className="text-5xl md:text-7xl font-display font-black text-stone-900 dark:text-white mb-2">6</h3>
                  <p className="text-stone-500">Indian Languages</p>
               </div>
               <div className="border-l border-stone-300 dark:border-stone-700 pl-6">
                  <h3 className="text-5xl md:text-7xl font-display font-black text-stone-900 dark:text-white mb-2">0ms</h3>
                  <p className="text-stone-500">Offline Latency</p>
               </div>
               <div className="border-l border-stone-300 dark:border-stone-700 pl-6">
                  <h3 className="text-5xl md:text-7xl font-display font-black text-stone-900 dark:text-white mb-2">24/7</h3>
                  <p className="text-stone-500">Crop Monitoring</p>
               </div>
               <div className="border-l border-stone-300 dark:border-stone-700 pl-6">
                  <h3 className="text-5xl md:text-7xl font-display font-black text-stone-900 dark:text-white mb-2">100%</h3>
                  <p className="text-stone-500">Free for Farmers</p>
               </div>
            </div>
         </div>
      </section>

      {/* 7. FOOTER / MARQUEE (Retained Existing) */}
      <footer className="py-24 overflow-hidden bg-stone-100 dark:bg-stone-950">
         <ParallaxText baseVelocity={-2}>JOIN THE REVOLUTION • </ParallaxText>
         <div className="max-w-7xl mx-auto px-8 mt-24 flex flex-col md:flex-row justify-between items-end">
            <div>
               <h3 className="text-2xl font-bold mb-4 dark:text-white">AgriFields</h3>
               <p className="max-w-sm text-stone-500">
                  Empowering 100M+ farmers with AI.
                  Design inspired by Awwwards winners.
               </p>
            </div>
            <button onClick={onStart} className="text-9xl font-display font-black text-stone-200 dark:text-stone-800 hover:text-green-600 dark:hover:text-green-600 transition-colors cursor-pointer mt-12 md:mt-0">
               START
            </button>
         </div>
      </footer>

      <style>{`
        .stroke-text {
          -webkit-text-stroke: 2px #d6d3d1;
        }
        .dark .stroke-text {
          -webkit-text-stroke: 2px #44403c;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;