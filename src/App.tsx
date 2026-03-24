import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import LandingPage from './components/LandingPage';
import SignupPage from './components/SignupPage';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import AnalyticsPage from './components/AnalyticsPage';
import LearnPage from './components/LearnPage';
import SettingsPage from './components/SettingsPage';
import Chatbot from './components/Chatbot';
import { AnalysisResult } from './types';

export type ViewState = 'landing' | 'signup' | 'home' | 'dashboard' | 'analytics' | 'learn' | 'settings';

export default function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [userName, setUserName] = useState('');
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [cursorEmoji, setCursorEmoji] = useState<string>('');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (cursorEmoji) {
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' style='font-size: 24px'><text y='24'>${cursorEmoji}</text></svg>`;
      const url = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}") 16 16, auto`;
      document.body.style.cursor = url;
      
      // Apply to all interactive elements as well to override their default cursors
      const style = document.createElement('style');
      style.id = 'custom-cursor-style';
      style.innerHTML = `* { cursor: ${url} !important; }`;
      document.head.appendChild(style);
      
      return () => {
        const existingStyle = document.getElementById('custom-cursor-style');
        if (existingStyle) existingStyle.remove();
      };
    } else {
      document.body.style.cursor = 'auto';
      const existingStyle = document.getElementById('custom-cursor-style');
      if (existingStyle) existingStyle.remove();
    }
  }, [cursorEmoji]);

  return (
    <div className="min-h-screen dark:bg-[#0a0a0a] bg-gray-50 dark:text-white text-gray-900 font-sans selection:bg-black/20 dark:selection:bg-white/20 transition-colors duration-300">
      <Toaster position="top-center" theme={theme} />
      {view === 'landing' && <LandingPage onStart={() => setView('signup')} />}
      {view === 'signup' && <SignupPage onComplete={(name) => { setUserName(name); setView('home'); }} />}
      {view === 'home' && <HomePage userName={userName} currentView={view} onViewChange={setView} />}
      {view === 'dashboard' && <Dashboard userName={userName} currentView={view} onViewChange={setView} history={history} setHistory={setHistory} />}
      {view === 'analytics' && <AnalyticsPage userName={userName} currentView={view} onViewChange={setView} history={history} />}
      {view === 'learn' && <LearnPage userName={userName} currentView={view} onViewChange={setView} completedModules={completedModules} setCompletedModules={setCompletedModules} />}
      {view === 'settings' && <SettingsPage userName={userName} setUserName={setUserName} currentView={view} onViewChange={setView} setHistory={setHistory} theme={theme} setTheme={setTheme} cursorEmoji={cursorEmoji} setCursorEmoji={setCursorEmoji} />}
      
      {view !== 'landing' && view !== 'signup' && <Chatbot />}
    </div>
  );
}

