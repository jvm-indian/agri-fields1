import React, { useState, useRef, useEffect } from 'react';
import { chatWithTeacher } from '../services/geminiService';
import { Language, Message } from '../types';
import { translations } from '../translations';

interface AITeacherProps {
  language: Language;
}

const AITeacher: React.FC<AITeacherProps> = ({ language }) => {
  const t = translations[language].teacher;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: t.intro,
      sender: 'ai',
      timestamp: Date.now()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update initial message when language changes if it's the only message
  useEffect(() => {
    if (messages.length === 1 && messages[0].sender === 'ai') {
        setMessages([{
            id: '1',
            text: t.intro,
            sender: 'ai',
            timestamp: Date.now()
        }]);
    }
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    // Simulated network delay for realism if offline, otherwise instant
    const history = messages.map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const responseText = await chatWithTeacher(userMsg.text, language, history);

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: responseText,
      sender: 'ai',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] relative overflow-hidden">
      
      {/* Sentient Orb Background - The "Brain" of the app */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[80px] animate-blob"></div>
      </div>

      {/* Header Area with "Living" Status */}
      <div className="relative z-10 px-6 py-4 flex flex-col items-center justify-center shrink-0">
         {/* The Orb */}
         <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all duration-700 ${isLoading ? 'bg-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.6)] scale-110' : 'bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]'}`}>
            {isLoading ? (
               <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-6 bg-white rounded-full animate-[bounce_1s_infinite]"></div>
                  <div className="w-1.5 h-10 bg-white rounded-full animate-[bounce_1s_infinite_0.2s]"></div>
                  <div className="w-1.5 h-5 bg-white rounded-full animate-[bounce_1s_infinite_0.4s]"></div>
               </div>
            ) : (
               <i className="fa-solid fa-infinity text-white text-3xl animate-pulse"></i>
            )}
         </div>
         <h2 className="font-display font-bold text-2xl text-stone-900 dark:text-white tracking-tight">{t.title}</h2>
         <p className="text-stone-500 dark:text-stone-400 text-sm font-medium">
            {isLoading ? <span className="text-emerald-500 animate-pulse">{t.thinking}</span> : t.listening}
         </p>
      </div>

      {/* Chat Canvas */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6 relative z-10 scroll-smooth">
        {messages.map((msg, idx) => (
          <div 
            key={msg.id} 
            className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className={`max-w-[85%] md:max-w-[70%] p-5 backdrop-blur-md shadow-lg transition-all hover:scale-[1.01] ${
              msg.sender === 'user' 
                ? 'bg-stone-900 dark:bg-emerald-600 text-white rounded-[2rem] rounded-tr-sm' 
                : 'bg-white/70 dark:bg-stone-800/70 border border-white/40 dark:border-stone-700 text-stone-800 dark:text-stone-100 rounded-[2rem] rounded-tl-sm'
            }`}>
              <p className="text-base md:text-lg leading-relaxed">{msg.text}</p>
              <p className={`text-[10px] mt-2 font-bold uppercase tracking-wider opacity-50 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.sender === 'user' ? t.you : t.ai}
              </p>
            </div>
          </div>
        ))}
        
        {/* Loading Skeleton */}
        {isLoading && (
           <div className="flex w-full justify-start animate-fade-in-up">
              <div className="bg-white/50 dark:bg-stone-800/50 backdrop-blur-md border border-white/20 rounded-[2rem] rounded-tl-sm p-4 flex items-center space-x-2">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-100"></div>
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-200"></div>
              </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Futuristic Input Bar */}
      <div className="p-4 relative z-20 pb-safe">
        <div className="glass rounded-[2.5rem] p-2 flex items-center shadow-2xl shadow-emerald-900/10 border border-white/30 dark:border-white/10">
          <button className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors flex items-center justify-center group">
             <i className="fa-solid fa-microphone text-xl group-hover:scale-110 transition-transform"></i>
          </button>
          
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t.placeholder}
            className="flex-1 bg-transparent border-none px-4 py-3 focus:ring-0 text-stone-800 dark:text-white placeholder-stone-400 text-lg font-medium"
          />

          <button 
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 transform ${
              !inputText.trim() ? 'bg-stone-300 dark:bg-stone-700 scale-90' : 'bg-emerald-600 hover:bg-emerald-500 scale-100 rotate-0 hover:rotate-12'
            }`}
          >
            <i className="fa-solid fa-arrow-up text-lg"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AITeacher;