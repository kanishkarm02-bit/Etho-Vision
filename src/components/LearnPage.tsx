import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, PlayCircle, Lock, Award, ExternalLink } from 'lucide-react';
import Header from './Header';
import { ViewState } from '../App';
import { learnModules } from '../data/learnModules';

export default function LearnPage({ 
  userName, 
  currentView, 
  onViewChange, 
  completedModules, 
  setCompletedModules 
}: { 
  userName: string, 
  currentView: ViewState, 
  onViewChange: (view: ViewState) => void,
  completedModules: string[],
  setCompletedModules: React.Dispatch<React.SetStateAction<string[]>>
}) {
  const [activeModuleId, setActiveModuleId] = useState<string>(learnModules[0].id);
  const [videoWatched, setVideoWatched] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const activeModule = learnModules.find(m => m.id === activeModuleId) || learnModules[0];
  const isCompleted = completedModules.includes(activeModule.id);

  const handleModuleChange = (id: string) => {
    setActiveModuleId(id);
    setVideoWatched(false);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setScore(0);
  };

  const handleVideoClick = () => {
    setVideoWatched(true);
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const submitQuiz = () => {
    let currentScore = 0;
    activeModule.questions.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswerIndex) {
        currentScore++;
      }
    });
    setScore(currentScore);
    setQuizSubmitted(true);

    if (currentScore >= 4 && !isCompleted) {
      setCompletedModules(prev => [...prev, activeModule.id]);
    }
  };

  return (
    <div className="min-h-screen dark:bg-[#0a0a0a] bg-gray-50 dark:text-white text-gray-900 font-sans selection:bg-black/20 dark:selection:bg-white/20 relative overflow-hidden flex flex-col transition-colors duration-300">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <Header userName={userName} currentView={currentView} onViewChange={onViewChange} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-80 flex-shrink-0 flex flex-col gap-4">
          <div className="dark:bg-white/5 bg-white backdrop-blur-md p-6 rounded-3xl border dark:border-white/10 border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Learning Modules</h2>
            <p className="dark:text-white/50 text-gray-500 text-sm mb-6">Complete videos and quizzes to master animal behavior analysis.</p>
            
            <div className="flex items-center gap-3 mb-6 p-4 dark:bg-white/5 bg-gray-50 rounded-2xl border dark:border-white/10 border-gray-100">
              <Award className="text-yellow-500" size={24} />
              <div>
                <div className="text-sm dark:text-white/50 text-gray-500">Progress</div>
                <div className="font-semibold">{completedModules.length} / {learnModules.length} Completed</div>
              </div>
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {learnModules.map((mod) => {
                const isActive = mod.id === activeModuleId;
                const isDone = completedModules.includes(mod.id);
                return (
                  <button
                    key={mod.id}
                    onClick={() => handleModuleChange(mod.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-start gap-3 ${
                      isActive 
                        ? 'dark:bg-white/10 bg-black/5 dark:border-white/20 border-black/10 shadow-sm ring-1 dark:ring-white/20 ring-black/10' 
                        : 'dark:bg-white/5 bg-transparent dark:border-white/5 border-transparent hover:border-gray-200 dark:hover:border-white/10 hover:bg-black/5 dark:hover:bg-white/10'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isDone ? (
                        <CheckCircle2 size={18} className="text-emerald-500 dark:text-emerald-400" />
                      ) : (
                        <PlayCircle size={18} className={isActive ? 'dark:text-white text-gray-900' : 'dark:text-white/30 text-gray-400'} />
                      )}
                    </div>
                    <div>
                      <div className={`font-medium text-sm ${isActive ? 'dark:text-white text-gray-900' : 'dark:text-white/70 text-gray-600'}`}>
                        {mod.title}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-6">
          <motion.div 
            key={activeModule.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="dark:bg-white/5 bg-white backdrop-blur-md p-6 sm:p-8 rounded-3xl border dark:border-white/10 border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl sm:text-3xl font-semibold">{activeModule.title}</h2>
              {isCompleted && <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded-full border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-1"><CheckCircle2 size={14} /> Completed</span>}
            </div>
            <p className="dark:text-white/70 text-gray-600 mb-8 leading-relaxed">{activeModule.description}</p>

            <div className="rounded-2xl overflow-hidden dark:bg-black/50 bg-gray-50 border dark:border-white/10 border-gray-200 aspect-video relative mb-8 flex flex-col items-center justify-center p-8 text-center">
              <PlayCircle size={48} className="dark:text-white/20 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium mb-2">Video Lesson</h3>
              <p className="dark:text-white/50 text-gray-500 mb-6 max-w-md">Click the link below to watch the video lesson in a new tab. Once you've opened it, you can proceed to the quiz.</p>
              <a 
                href={activeModule.videoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={handleVideoClick}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors shadow-sm"
              >
                <ExternalLink size={20} /> Watch Video Lesson
              </a>
            </div>

            <div className="border-t dark:border-white/10 border-gray-200 pt-8">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                Module Quiz
                {!videoWatched && !isCompleted && <Lock size={16} className="dark:text-white/40 text-gray-400" />}
              </h3>

              {!videoWatched && !isCompleted ? (
                <div className="p-6 dark:bg-white/5 bg-gray-50 rounded-2xl border dark:border-white/10 border-gray-200 text-center">
                  <p className="dark:text-white/60 text-gray-500">Please open the video lesson to unlock the quiz.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {activeModule.questions.map((q, qIndex) => (
                    <div key={q.id} className="space-y-4">
                      <p className="font-medium text-lg"><span className="dark:text-white/50 text-gray-400 mr-2">{qIndex + 1}.</span>{q.text}</p>
                      <div className="space-y-2">
                        {q.options.map((opt, oIndex) => {
                          const isSelected = quizAnswers[q.id] === oIndex;
                          const isCorrect = q.correctAnswerIndex === oIndex;
                          
                          let optionClass = "dark:bg-white/5 bg-white dark:border-white/10 border-gray-200 hover:bg-gray-50 dark:hover:bg-white/10";
                          if (isSelected) optionClass = "dark:bg-white/10 bg-blue-50 dark:border-white/30 border-blue-300 ring-1 dark:ring-white/30 ring-blue-300";
                          
                          if (quizSubmitted) {
                            if (isCorrect) optionClass = "bg-emerald-100 dark:bg-emerald-500/20 border-emerald-300 dark:border-emerald-500/50 text-emerald-800 dark:text-emerald-200";
                            else if (isSelected && !isCorrect) optionClass = "bg-red-100 dark:bg-red-500/20 border-red-300 dark:border-red-500/50 text-red-800 dark:text-red-200";
                            else optionClass = "dark:bg-white/5 bg-gray-50 dark:border-white/5 border-gray-100 opacity-50";
                          }

                          return (
                            <button
                              key={oIndex}
                              onClick={() => handleAnswerSelect(q.id, oIndex)}
                              disabled={quizSubmitted}
                              className={`w-full text-left p-4 rounded-xl border transition-all ${optionClass}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {!quizSubmitted ? (
                    <button 
                      onClick={submitQuiz}
                      disabled={Object.keys(quizAnswers).length < activeModule.questions.length}
                      className="w-full py-4 dark:bg-white bg-black dark:text-black text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed dark:hover:bg-white/90 hover:bg-black/90 transition-colors"
                    >
                      Submit Answers
                    </button>
                  ) : (
                    <div className={`p-6 rounded-2xl border ${score >= 4 ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20' : 'bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20'}`}>
                      <h4 className="text-xl font-semibold mb-2">
                        {score >= 4 ? 'Passed!' : 'Keep trying!'}
                      </h4>
                      <p className="dark:text-white/70 text-gray-700">
                        You scored {score} out of {activeModule.questions.length}.
                        {score >= 4 ? ' This module has been marked as completed.' : ' You need at least 4 correct answers to pass.'}
                      </p>
                      <button 
                        onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); setScore(0); }}
                        className="mt-4 px-6 py-2 dark:bg-white/10 bg-black/5 hover:bg-black/10 dark:hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
                      >
                        Retake Quiz
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
