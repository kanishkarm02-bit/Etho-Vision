import { ShieldAlert, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function LandingPage({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen dark:bg-[#0a0a0a] bg-gray-50 dark:text-white text-gray-900 font-sans selection:bg-black/20 dark:selection:bg-white/20 flex flex-col overflow-hidden relative transition-colors duration-300">
      {/* Abstract background elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-orange-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />

      <header className="max-w-7xl mx-auto px-6 lg:px-12 h-24 flex items-center w-full relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl dark:bg-white/10 bg-gray-100 backdrop-blur-md border dark:border-white/10 border-gray-200 flex items-center justify-center dark:text-white text-gray-900">
            <ShieldAlert size={20} />
          </div>
          <h1 className="text-xl font-medium tracking-wide">EthoVision AI</h1>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 lg:px-12 py-12 text-center max-w-5xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full dark:bg-white/5 bg-white border dark:border-white/10 border-gray-200 dark:text-white/80 text-gray-600 text-sm font-medium mb-8 backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Next-Gen Animal State Analysis
          </div>
          
          <h2 className="text-5xl sm:text-7xl lg:text-8xl font-light tracking-tight dark:text-white text-gray-900 mb-8 leading-[1.1]">
            Understand them <br />
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r dark:from-white dark:to-white/50 from-gray-900 to-gray-500">
              before they speak.
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl dark:text-white/60 text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            Advanced AI to detect aggression, pain, or stress in animals. Designed for wildlife conservation, veterinary care, and welfare auditing.
          </p>
          
          <button 
            onClick={onStart}
            className="group relative inline-flex items-center justify-center gap-3 dark:bg-white bg-black dark:text-black text-white px-8 py-4 rounded-full font-medium text-lg hover:scale-105 transition-all duration-300 dark:shadow-[0_0_40px_rgba(255,255,255,0.2)] shadow-[0_0_40px_rgba(0,0,0,0.1)]"
          >
            Get Started
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </main>
    </div>
  );
}
