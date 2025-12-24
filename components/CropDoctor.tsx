import React, { useState, useRef } from 'react';
import { analyzeCropImage } from '../services/geminiService';
import { Language } from '../types';
import { translations } from '../translations';
import { auth, storage } from '../services/firebase';
import { ref, uploadBytes } from 'firebase/storage';

interface CropDoctorProps {
  language: Language;
}

const CropDoctor: React.FC<CropDoctorProps> = ({ language }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const t = translations[language].doctor;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file); // Keep the file object for upload
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setAnalysis(null);
        setScanning(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToStorage = async () => {
    if (!auth.currentUser || !selectedFile) return;
    
    try {
      // Create a unique path: users/{uid}/scans/{timestamp}.jpg
      const storageRef = ref(storage, `users/${auth.currentUser.uid}/scans/${Date.now()}.jpg`);
      await uploadBytes(storageRef, selectedFile);
      console.log("Image saved to Firebase Storage");
    } catch (e) {
      console.error("Error uploading image:", e);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    setScanning(true);
    setLoading(true);
    
    // 1. Upload to Firebase Storage (Fire and forget, don't block analysis)
    uploadImageToStorage();

    // 2. Artificial delay for "Scanning" effect
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // 3. AI Analysis
    const result = await analyzeCropImage(selectedImage, language);
    setAnalysis(result);
    setLoading(false);
    setScanning(false);
  };

  return (
    <div className="min-h-screen p-4 pb-24 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-stone-50 dark:bg-stone-950 -z-20"></div>
      <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-[-20%] left-[-20%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -z-10"></div>

      <div className="max-w-3xl mx-auto space-y-8 pt-6">
        
        {/* Holographic Header */}
        <div className="flex items-center justify-between">
           <div>
             <h2 className="font-display font-bold text-3xl text-stone-900 dark:text-white">{t.title}</h2>
             <div className="flex items-center space-x-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-xs font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400">{t.ready}</span>
             </div>
           </div>
           <div className="w-12 h-12 bg-white dark:bg-stone-800 rounded-2xl flex items-center justify-center shadow-lg border border-stone-100 dark:border-stone-700">
             <i className="fa-solid fa-dna text-red-500"></i>
           </div>
        </div>

        {/* The Scanner Frame */}
        <div className="relative group perspective-1000">
          <div className={`holo-card rounded-[2rem] p-4 text-center relative overflow-hidden transition-all duration-500 ${selectedImage ? 'h-[400px]' : 'h-[300px]'}`}>
            
            {!selectedImage ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="h-full w-full border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors"
              >
                <div className="w-20 h-20 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-6 shadow-inner">
                   <i className="fa-solid fa-camera text-3xl text-stone-400"></i>
                </div>
                <p className="font-display font-bold text-lg text-stone-600 dark:text-stone-300">{t.tapScan}</p>
                <p className="text-xs font-mono text-stone-400 mt-2 uppercase tracking-wide">{t.support}</p>
              </div>
            ) : (
              <div className="relative h-full w-full rounded-3xl overflow-hidden shadow-2xl">
                <img src={selectedImage} alt="Crop" className="w-full h-full object-cover" />
                
                {/* SCANNER OVERLAY - THE WOW FACTOR */}
                {scanning && (
                  <div className="absolute inset-0 z-20">
                    <div className="absolute top-0 left-0 w-full h-1 bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)] animate-scan"></div>
                    <div className="absolute inset-0 bg-red-500/10"></div>
                    <div className="absolute top-4 left-4 text-red-500 font-mono text-xs animate-pulse">{t.analyzing}</div>
                    <div className="absolute bottom-4 right-4 text-red-500 font-mono text-xs">{t.confidence}</div>
                    
                    {/* Corner Reticles */}
                    <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-red-500"></div>
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-red-500"></div>
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-red-500"></div>
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-red-500"></div>
                  </div>
                )}

                <button 
                  onClick={() => {
                    setSelectedImage(null);
                    setSelectedFile(null);
                  }}
                  className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/80 z-30 transition-colors"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        {/* Action Button - Only show if not analyzing */}
        {selectedImage && !analysis && !scanning && (
          <button 
            onClick={handleAnalyze}
            className="w-full relative overflow-hidden group bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-500 to-pink-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <span className="relative z-10 flex items-center justify-center gap-3 text-lg font-display tracking-wide">
              <i className="fa-solid fa-microscope"></i> {t.start}
            </span>
          </button>
        )}

        {/* Diagnosis Report - Futuristic HUD Style */}
        {analysis && (
          <div className="holo-card rounded-[2.5rem] p-8 animate-fade-in-up border-l-4 border-l-green-500">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-2xl text-stone-900 dark:text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
                  <i className="fa-solid fa-check"></i>
                </span>
                {t.complete}
              </h3>
              <span className="px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-xs font-mono text-stone-500">ID: #8392-A</span>
            </div>
            
            <div className="prose prose-lg prose-stone dark:prose-invert leading-relaxed">
              <p className="text-stone-600 dark:text-stone-300">{analysis}</p>
            </div>
            
            <div className="mt-8 grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-4 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 font-bold hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors">
                <i className="fa-solid fa-volume-high"></i> {t.read}
              </button>
              <button className="flex items-center justify-center gap-2 py-4 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 shadow-lg shadow-green-500/30 transition-colors">
                <i className="fa-solid fa-share-nodes"></i> {t.share}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropDoctor;