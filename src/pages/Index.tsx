import React, { useState, useEffect, useRef } from 'react';
import QuestionForm from '@/components/QuestionForm';
import ResultDisplay from '@/components/ResultDisplay';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { config } from '@/utils/config';
import { MoonIcon, SunIcon, PlusIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Link } from 'react-router-dom';
import { getAllQAPairs } from '@/utils/preTrainedAnswers';

const Index = () => {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const resultRef = useRef<HTMLDivElement>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  useEffect(() => {
    if (config.staticApiKey) {
      window.VITE_OPENAI_API_KEY = config.staticApiKey;
    }

    const savedTheme = localStorage.getItem('theme_preference');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    }

    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Check if user is admin
    const isAuthenticated = localStorage.getItem('admin_authenticated');
    setIsAdmin(isAuthenticated === 'true');
    
    try {
      // Load from improved storage system
      const qaPairs = getAllQAPairs();
      console.log(`Loaded ${qaPairs.length} Q&A pairs from storage`);
    } catch (error) {
      console.error('Error loading Q&A pairs:', error);
    }
  }, []);
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('theme_preference', newDarkMode ? 'dark' : 'light');
  };

  const bgGradient = darkMode 
    ? "bg-gradient-to-b from-slate-900 to-indigo-950" 
    : "bg-gradient-to-b from-blue-50 to-indigo-100";

  const cardBg = darkMode 
    ? "bg-slate-800/50 border-slate-700" 
    : "bg-slate-200/90 border-slate-300 shadow-xl rounded-xl transform hover:scale-[1.01] hover:shadow-2xl transition-all duration-300";

  return (

        <main className={`max-w-4xl mx-auto ${cardBg} p-6 md:p-8 backdrop-blur-sm`}>
          <div className="mb-6">
            {loading && (
              <div className="py-4 flex items-center justify-center space-x-2">
                <div className="animate-pulse flex space-x-1">
                  <div className={`h-2 w-2 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-600'}`}></div>
                  <div className={`h-2 w-2 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-600'} animate-delay-150`}></div>
                  <div className={`h-2 w-2 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-600'} animate-delay-300`}></div>
                </div>
                <span className={`text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Processing your question...</span>
              </div>
            )}
          </div>
          
          <QuestionForm setResult={setResult} setLoading={setLoading} resultRef={resultRef} />
          
          <div ref={resultRef} className={`${(result || loading) ? 'mt-8 pt-8 border-t' : ''} ${darkMode ? 'border-slate-700' : 'border-slate-300'}`}>
            {(result || loading) && (
              <ResultDisplay result={result} loading={loading} />
            )}
          </div>
        </main>

  );
};

declare global {
  interface Window {
    VITE_OPENAI_API_KEY?: string;
  }
}

export default Index;
