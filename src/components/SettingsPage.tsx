import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Palette, Bell, Trash2, AlertTriangle, CheckCircle2, Moon, Sun, MousePointer2 } from 'lucide-react';
import Header from './Header';
import { ViewState } from '../App';
import { AnalysisResult } from '../types';

const ANIMAL_EMOJIS = [
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', 
  '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺', 
  '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷', 
  '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', 
  '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', 
  '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', 
  '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐈‍⬛', '🪶', 
  '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊', '🐇', '🦝', '🦨', '🦡', '🦦', 
  '🦥', '🐁', '🐀', '🐿', '🦔'
];

export default function SettingsPage({ 
  userName, 
  setUserName, 
  currentView, 
  onViewChange, 
  setHistory,
  theme,
  setTheme,
  cursorEmoji,
  setCursorEmoji
}: { 
  userName: string, 
  setUserName: (name: string) => void, 
  currentView: ViewState, 
  onViewChange: (view: ViewState) => void,
  setHistory: React.Dispatch<React.SetStateAction<AnalysisResult[]>>,
  theme: 'dark' | 'light',
  setTheme: (theme: 'dark' | 'light') => void,
  cursorEmoji: string,
  setCursorEmoji: (emoji: string) => void
}) {
  const [nameInput, setNameInput] = useState(userName);
  const [saved, setSaved] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'data'>('profile');

  const handleSave = () => {
    setUserName(nameInput);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all analysis history? This action cannot be undone.")) {
      setHistory([]);
      setCleared(true);
      setTimeout(() => setCleared(false), 3000);
    }
  };

  return (
    <div className="min-h-screen dark:bg-[#0a0a0a] bg-gray-50 dark:text-white text-gray-900 font-sans selection:bg-black/20 dark:selection:bg-white/20 relative overflow-hidden flex flex-col transition-colors duration-300">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <Header userName={userName} currentView={currentView} onViewChange={onViewChange} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-semibold mb-2">Settings</h1>
            <p className="dark:text-white/50 text-gray-500">Manage your account preferences and application data.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Sidebar Navigation */}
            <div className="md:col-span-4 flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition-colors whitespace-nowrap ${activeTab === 'profile' ? 'dark:bg-white/10 bg-black/5 border dark:border-white/20 border-black/10' : 'bg-transparent hover:bg-black/5 dark:hover:bg-white/5 border border-transparent dark:text-white/60 text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
              >
                <User size={18} /> Profile
              </button>
              <button 
                onClick={() => setActiveTab('appearance')}
                className={`w-full text-left px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition-colors whitespace-nowrap ${activeTab === 'appearance' ? 'dark:bg-white/10 bg-black/5 border dark:border-white/20 border-black/10' : 'bg-transparent hover:bg-black/5 dark:hover:bg-white/5 border border-transparent dark:text-white/60 text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
              >
                <Palette size={18} /> Appearance
              </button>
              <button 
                onClick={() => setActiveTab('data')}
                className={`w-full text-left px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition-colors whitespace-nowrap ${activeTab === 'data' ? 'dark:bg-white/10 bg-black/5 border dark:border-white/20 border-black/10' : 'bg-transparent hover:bg-black/5 dark:hover:bg-white/5 border border-transparent dark:text-white/60 text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
              >
                <Trash2 size={18} /> Data & Privacy
              </button>
            </div>

            {/* Settings Content */}
            <div className="md:col-span-8 space-y-8">
              {/* Profile Section */}
              {activeTab === 'profile' && (
                <section className="dark:bg-white/5 bg-white backdrop-blur-md p-6 sm:p-8 rounded-3xl border dark:border-white/10 border-gray-200 shadow-sm">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <User size={20} className="dark:text-white/50 text-gray-400" /> Profile Information
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium dark:text-white/70 text-gray-600 mb-2">Display Name</label>
                      <input 
                        type="text" 
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="w-full dark:bg-black/50 bg-gray-50 border dark:border-white/10 border-gray-200 rounded-xl px-4 py-3 dark:text-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 transition-all"
                      />
                    </div>
                    
                    <div className="pt-4 flex items-center gap-4">
                      <button 
                        onClick={handleSave}
                        className="dark:bg-white bg-black dark:text-black text-white px-6 py-2.5 rounded-xl font-semibold dark:hover:bg-white/90 hover:bg-black/90 transition-colors"
                      >
                        Save Changes
                      </button>
                      {saved && (
                        <span className="text-emerald-500 dark:text-emerald-400 text-sm font-medium flex items-center gap-1">
                          <CheckCircle2 size={16} /> Saved
                        </span>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {/* Appearance Section */}
              {activeTab === 'appearance' && (
                <section className="dark:bg-white/5 bg-white backdrop-blur-md p-6 sm:p-8 rounded-3xl border dark:border-white/10 border-gray-200 shadow-sm">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Palette size={20} className="dark:text-white/50 text-gray-400" /> Appearance
                  </h2>
                  
                  <div className="space-y-8">
                    {/* Theme Toggle */}
                    <div className="space-y-3">
                      <h3 className="font-medium">Theme</h3>
                      <div className="flex gap-4">
                        <button
                          onClick={() => setTheme('light')}
                          className={`flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all ${theme === 'light' ? 'border-black bg-black/5 dark:border-white dark:bg-white/10' : 'border-gray-200 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5'}`}
                        >
                          <Sun size={24} className={theme === 'light' ? 'text-orange-500' : 'text-gray-400'} />
                          <span className="font-medium">Light</span>
                        </button>
                        <button
                          onClick={() => setTheme('dark')}
                          className={`flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all ${theme === 'dark' ? 'border-black bg-black/5 dark:border-white dark:bg-white/10' : 'border-gray-200 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5'}`}
                        >
                          <Moon size={24} className={theme === 'dark' ? 'text-blue-400' : 'text-gray-400'} />
                          <span className="font-medium">Dark</span>
                        </button>
                      </div>
                    </div>

                    {/* Custom Cursor */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium flex items-center gap-2">
                          <MousePointer2 size={18} /> Custom Animal Cursor
                        </h3>
                        {cursorEmoji && (
                          <button 
                            onClick={() => setCursorEmoji('')}
                            className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-medium"
                          >
                            Reset to Default
                          </button>
                        )}
                      </div>
                      <p className="text-sm dark:text-white/50 text-gray-500">Select an animal face to use as your mouse cursor across the app.</p>
                      
                      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 max-h-64 overflow-y-auto p-2 bg-gray-50 dark:bg-black/30 rounded-2xl border border-gray-200 dark:border-white/5 custom-scrollbar">
                        {ANIMAL_EMOJIS.map((emoji, index) => (
                          <button
                            key={index}
                            onClick={() => setCursorEmoji(emoji)}
                            className={`text-2xl p-2 rounded-xl flex items-center justify-center transition-all hover:scale-110 ${cursorEmoji === emoji ? 'bg-blue-500/20 border border-blue-500/50 scale-110' : 'hover:bg-black/5 dark:hover:bg-white/10 border border-transparent'}`}
                            title={`Select ${emoji} cursor`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Data Section */}
              {activeTab === 'data' && (
                <section className="dark:bg-white/5 bg-white backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-red-500/20 shadow-sm">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-red-500 dark:text-red-400">
                    <AlertTriangle size={20} /> Danger Zone
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-red-50 dark:bg-red-500/5 rounded-2xl border border-red-200 dark:border-red-500/10">
                      <div>
                        <h3 className="font-medium text-red-700 dark:text-red-200">Clear Analysis History</h3>
                        <p className="text-sm text-red-600/80 dark:text-red-200/60">Permanently delete all your past analysis reports and images.</p>
                      </div>
                      <button 
                        onClick={handleClearHistory}
                        className="px-4 py-2 bg-red-100 dark:bg-red-500/20 hover:bg-red-200 dark:hover:bg-red-500/30 text-red-700 dark:text-red-400 rounded-lg text-sm font-medium border border-red-200 dark:border-red-500/20 transition-colors whitespace-nowrap"
                      >
                        Clear History
                      </button>
                    </div>
                    {cleared && (
                      <p className="text-emerald-500 dark:text-emerald-400 text-sm font-medium flex items-center gap-1">
                        <CheckCircle2 size={16} /> History cleared successfully
                      </p>
                    )}
                  </div>
                </section>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
