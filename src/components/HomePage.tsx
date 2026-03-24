import { ArrowRight, LayoutDashboard, History, Camera, ShieldAlert, Stethoscope, ClipboardCheck } from 'lucide-react';
import { motion } from 'motion/react';
import Header from './Header';
import { ViewState } from '../App';

export default function HomePage({ userName, currentView, onViewChange }: { userName: string, currentView: ViewState, onViewChange: (view: ViewState) => void }) {
  return (
    <div className="min-h-screen dark:bg-[#0a0a0a] bg-gray-50 dark:text-white text-gray-900 font-sans selection:bg-black/20 dark:selection:bg-white/20 relative overflow-hidden flex flex-col transition-colors duration-300">
      {/* Abstract background elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <Header userName={userName} currentView={currentView} onViewChange={onViewChange} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <header className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-4xl sm:text-5xl font-light tracking-tight mb-3">Welcome, <span className="font-semibold">{userName}</span>.</h1>
            <p className="dark:text-white/60 text-gray-600 text-lg">Here is a quick guide to how EthoVision AI works.</p>
          </motion.div>
          <motion.button 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: 0.2, duration: 0.4 }}
            onClick={() => onViewChange('dashboard')}
            className="hidden sm:flex dark:bg-white bg-black dark:text-black text-white px-6 py-3.5 rounded-full font-medium items-center gap-2 dark:hover:bg-white/90 hover:bg-black/90 transition-all shadow-sm hover:-translate-y-0.5"
          >
            Go to Dashboard <ArrowRight size={18} />
          </motion.button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tutorial Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }} 
            className="dark:bg-white/5 bg-white backdrop-blur-md p-8 rounded-[2rem] shadow-sm border dark:border-white/10 border-gray-200 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
          >
            <div className="w-14 h-14 dark:bg-white/10 bg-gray-100 rounded-2xl flex items-center justify-center dark:text-white text-gray-900 mb-6">
              <LayoutDashboard size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-3">The Dashboard</h3>
            <p className="dark:text-white/60 text-gray-600 leading-relaxed text-sm">
              Your main workspace. Upload images, select your analysis mode, and let the AI process the visual data. You can upload multiple images at once for batch processing.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} 
            className="dark:bg-white/5 bg-white backdrop-blur-md p-8 rounded-[2rem] shadow-sm border dark:border-white/10 border-gray-200 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
          >
            <div className="w-14 h-14 dark:bg-white/10 bg-gray-100 rounded-2xl flex items-center justify-center dark:text-white text-gray-900 mb-6">
              <Camera size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Capture & Enhance</h3>
            <p className="dark:text-white/60 text-gray-600 leading-relaxed text-sm">
              Use your device's camera directly within the app. Every image is automatically enhanced (contrast, brightness, sharpness) before analysis to ensure the highest accuracy.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }} 
            className="dark:bg-white/5 bg-white backdrop-blur-md p-8 rounded-[2rem] shadow-sm border dark:border-white/10 border-gray-200 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
          >
            <div className="w-14 h-14 dark:bg-white/10 bg-gray-100 rounded-2xl flex items-center justify-center dark:text-white text-gray-900 mb-6">
              <History size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-3">History & Reports</h3>
            <p className="dark:text-white/60 text-gray-600 leading-relaxed text-sm">
              All your past analyses are saved in the sidebar. Click any past result to view the full report, confidence score, and download it as a Markdown file for your records.
            </p>
          </motion.div>
        </div>

        <motion.h2 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="text-2xl font-semibold mt-16 mb-6"
        >
          Analysis Modes
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }} 
            className="dark:bg-white/5 bg-white backdrop-blur-md p-6 rounded-3xl shadow-sm border dark:border-white/10 border-gray-200 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-xl"><ShieldAlert size={20} /></div>
              <h4 className="font-semibold dark:text-white text-gray-900">Wildlife Conflict</h4>
            </div>
            <p className="dark:text-white/60 text-gray-600 text-sm leading-relaxed">Detects predatory intent vs. passing through in wild animals to prevent human-wildlife conflicts.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }} 
            className="dark:bg-white/5 bg-white backdrop-blur-md p-6 rounded-3xl shadow-sm border dark:border-white/10 border-gray-200 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl"><Stethoscope size={20} /></div>
              <h4 className="font-semibold dark:text-white text-gray-900">Non-Verbal Vet</h4>
            </div>
            <p className="dark:text-white/60 text-gray-600 text-sm leading-relaxed">Identifies early signs of pain or neurological distress in service animals and livestock.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }} 
            className="dark:bg-white/5 bg-white backdrop-blur-md p-6 rounded-3xl shadow-sm border dark:border-white/10 border-gray-200 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl"><ClipboardCheck size={20} /></div>
              <h4 className="font-semibold dark:text-white text-gray-900">Welfare Auditor</h4>
            </div>
            <p className="dark:text-white/60 text-gray-600 text-sm leading-relaxed">Measures stress levels using the Grimace Scale to enforce welfare laws in shelters or farms.</p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          className="mt-12 sm:hidden flex justify-center"
        >
          <button 
            onClick={() => onViewChange('dashboard')}
            className="w-full dark:bg-white bg-black dark:text-black text-white px-6 py-4 rounded-2xl font-medium flex items-center justify-center gap-2 dark:hover:bg-white/90 hover:bg-black/90 transition-all shadow-sm"
          >
            Go to Dashboard <ArrowRight size={18} />
          </button>
        </motion.div>
      </main>
    </div>
  );
}
