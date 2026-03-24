import { useState } from 'react';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

export default function SignupPage({ onComplete }: { onComplete: (name: string) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete(name.trim());
    }
  };

  return (
    <div className="min-h-screen dark:bg-[#0a0a0a] bg-gray-50 dark:text-white text-gray-900 flex flex-col justify-center items-center p-4 font-sans selection:bg-black/20 dark:selection:bg-white/20 relative overflow-hidden transition-colors duration-300">
      {/* Abstract background elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md dark:bg-white/5 bg-white backdrop-blur-md rounded-[2rem] shadow-2xl border dark:border-white/10 border-gray-200 p-8 sm:p-10 relative z-10"
      >
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 rounded-2xl dark:bg-white/10 bg-gray-100 border dark:border-white/10 border-gray-200 flex items-center justify-center dark:text-white text-gray-900 shadow-md">
            <ShieldAlert size={24} />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-center dark:text-white text-gray-900 mb-2">Create your account</h2>
        <p className="text-center dark:text-white/50 text-gray-500 mb-8 text-sm">Join EthoVision AI to start analyzing.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium dark:text-white/70 text-gray-600 mb-1.5">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border dark:border-white/10 border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/30 focus:border-transparent transition-all dark:bg-white/5 bg-gray-50 dark:text-white text-gray-900 dark:placeholder:text-white/30 placeholder:text-gray-400"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-white/70 text-gray-600 mb-1.5">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border dark:border-white/10 border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/30 focus:border-transparent transition-all dark:bg-white/5 bg-gray-50 dark:text-white text-gray-900 dark:placeholder:text-white/30 placeholder:text-gray-400"
              placeholder="jane@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-white/70 text-gray-600 mb-1.5">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border dark:border-white/10 border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/30 focus:border-transparent transition-all dark:bg-white/5 bg-gray-50 dark:text-white text-gray-900 dark:placeholder:text-white/30 placeholder:text-gray-400"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit"
            className="w-full dark:bg-white bg-black dark:text-black text-white py-4 rounded-xl font-medium dark:hover:bg-white/90 hover:bg-black/90 transition-all flex items-center justify-center gap-2 mt-6 dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] shadow-[0_0_20px_rgba(0,0,0,0.1)] hover:shadow-[0_0_30px_rgba(0,0,0,0.15)] hover:-translate-y-0.5"
          >
            Create Account <ArrowRight size={18} />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
