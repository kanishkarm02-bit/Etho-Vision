import { ShieldAlert, Home, BarChart3, BookOpen, Settings } from 'lucide-react';
import { ViewState } from '../App';

export default function Header({ userName, currentView, onViewChange }: { userName: string, currentView: ViewState, onViewChange: (view: ViewState) => void }) {
  return (
    <header className="dark:bg-white/5 bg-white/80 backdrop-blur-md border-b dark:border-white/10 border-gray-200 sticky top-0 z-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onViewChange('dashboard')}>
            <div className="w-8 h-8 rounded-lg dark:bg-white/10 bg-gray-100 flex items-center justify-center dark:text-white text-gray-900 border dark:border-white/10 border-gray-200">
              <ShieldAlert size={18} />
            </div>
            <h1 className="text-xl font-semibold tracking-tight hidden sm:block dark:text-white text-gray-900">EthoVision AI</h1>
          </div>
          <div className="h-6 w-px dark:bg-white/10 bg-gray-200 hidden md:block"></div>
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => onViewChange('home')} className={`flex items-center gap-2 text-sm font-medium transition-colors ${currentView === 'home' ? 'dark:text-white text-gray-900' : 'dark:text-white/50 text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>
              <Home size={16} /> Tutorial
            </button>
            <button onClick={() => onViewChange('dashboard')} className={`flex items-center gap-2 text-sm font-medium transition-colors ${currentView === 'dashboard' ? 'dark:text-white text-gray-900' : 'dark:text-white/50 text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>
              <ShieldAlert size={16} /> Analyzer
            </button>
            <button onClick={() => onViewChange('analytics')} className={`flex items-center gap-2 text-sm font-medium transition-colors ${currentView === 'analytics' ? 'dark:text-white text-gray-900' : 'dark:text-white/50 text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>
              <BarChart3 size={16} /> Analytics
            </button>
            <button onClick={() => onViewChange('learn')} className={`flex items-center gap-2 text-sm font-medium transition-colors ${currentView === 'learn' ? 'dark:text-white text-gray-900' : 'dark:text-white/50 text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>
              <BookOpen size={16} /> Learn
            </button>
            <button onClick={() => onViewChange('settings')} className={`flex items-center gap-2 text-sm font-medium transition-colors ${currentView === 'settings' ? 'dark:text-white text-gray-900' : 'dark:text-white/50 text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>
              <Settings size={16} /> Settings
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm font-medium dark:text-white/70 text-gray-600 hidden sm:block">
            {userName || 'User'}
          </div>
          <div className="w-8 h-8 rounded-full dark:bg-white/10 bg-gray-100 border dark:border-white/10 border-gray-200 flex items-center justify-center dark:text-white text-gray-900 font-bold text-xs uppercase">
            {(userName || 'U').charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}
