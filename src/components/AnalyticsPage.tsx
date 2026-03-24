import { BarChart3, ChevronLeft, PieChart, Activity, ShieldAlert, Stethoscope, ClipboardCheck, Home } from 'lucide-react';
import { AnalysisResult, MODES } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend } from 'recharts';
import Header from './Header';
import { ViewState } from '../App';

export default function AnalyticsPage({ userName, currentView, onViewChange, history }: { userName: string, currentView: ViewState, onViewChange: (view: ViewState) => void, history: AnalysisResult[] }) {
  // Calculate statistics
  const totalAnalyses = history.length;
  
  const modeCounts = history.reduce((acc, curr) => {
    acc[curr.mode] = (acc[curr.mode] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(modeCounts).map(([mode, count]) => ({
    name: MODES[mode as keyof typeof MODES].title,
    value: count,
    color: mode === 'wildlife' ? '#f97316' : mode === 'vet' ? '#3b82f6' : '#10b981' // orange, blue, emerald
  }));

  const avgConfidenceByMode = Object.keys(MODES).map(mode => {
    const modeHistory = history.filter(h => h.mode === mode);
    const avg = modeHistory.length > 0 
      ? modeHistory.reduce((sum, h) => sum + h.confidenceScore, 0) / modeHistory.length 
      : 0;
    return {
      name: MODES[mode as keyof typeof MODES].title,
      avgConfidence: Math.round(avg)
    };
  });

  const highRiskCount = history.filter(h => h.riskLevel?.toLowerCase() === 'high').length;

  return (
    <div className="min-h-screen dark:bg-[#0a0a0a] bg-gray-50 dark:text-white text-gray-900 font-sans selection:bg-black/20 dark:selection:bg-white/20 relative overflow-hidden transition-colors duration-300">
      {/* Abstract background elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      <Header userName={userName} currentView={currentView} onViewChange={onViewChange} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Analysis Overview</h2>
          <p className="dark:text-white/60 text-gray-600">Insights and statistics from your recent AI analyses.</p>
        </div>

        {totalAnalyses === 0 ? (
          <div className="dark:bg-white/5 bg-white border dark:border-white/10 border-gray-200 rounded-3xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 dark:bg-white/10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:text-white/50 text-gray-500">
              <Activity size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Data Available</h3>
            <p className="dark:text-white/50 text-gray-500 max-w-md mx-auto">
              You haven't performed any analyses yet. Head back to the dashboard and analyze some images to see your statistics here.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="dark:bg-white/5 bg-white border dark:border-white/10 border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="text-blue-500 dark:text-blue-400" size={20} />
                  <h3 className="text-sm font-medium dark:text-white/60 text-gray-500 uppercase tracking-wider">Total Analyses</h3>
                </div>
                <p className="text-4xl font-light">{totalAnalyses}</p>
              </div>
              <div className="dark:bg-white/5 bg-white border dark:border-white/10 border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldAlert className="text-red-500 dark:text-red-400" size={20} />
                  <h3 className="text-sm font-medium dark:text-white/60 text-gray-500 uppercase tracking-wider">High Risk Cases</h3>
                </div>
                <p className="text-4xl font-light">{highRiskCount}</p>
              </div>
              <div className="dark:bg-white/5 bg-white border dark:border-white/10 border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <PieChart className="text-emerald-500 dark:text-emerald-400" size={20} />
                  <h3 className="text-sm font-medium dark:text-white/60 text-gray-500 uppercase tracking-wider">Most Used Mode</h3>
                </div>
                <p className="text-2xl font-medium truncate">
                  {pieData.length > 0 ? pieData.sort((a, b) => b.value - a.value)[0].name : 'N/A'}
                </p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Mode Distribution */}
              <div className="dark:bg-white/5 bg-white border dark:border-white/10 border-gray-200 rounded-3xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <PieChart size={18} className="dark:text-white/50 text-gray-400" /> Mode Distribution
                </h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--tooltip-bg, #171717)', borderColor: 'var(--tooltip-border, #333)', borderRadius: '8px', color: 'var(--tooltip-color, #fff)' }}
                        itemStyle={{ color: 'var(--tooltip-color, #fff)' }}
                      />
                      <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: 'var(--legend-color, #fff)', opacity: 0.7 }} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Confidence Scores */}
              <div className="dark:bg-white/5 bg-white border dark:border-white/10 border-gray-200 rounded-3xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <BarChart3 size={18} className="dark:text-white/50 text-gray-400" /> Average Confidence by Mode
                </h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={avgConfidenceByMode} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-color, #333)" vertical={false} />
                      <XAxis dataKey="name" stroke="var(--axis-color, #666)" tick={{ fill: 'var(--tick-color, #888)' }} />
                      <YAxis stroke="var(--axis-color, #666)" tick={{ fill: 'var(--tick-color, #888)' }} domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--tooltip-bg, #171717)', borderColor: 'var(--tooltip-border, #333)', borderRadius: '8px', color: 'var(--tooltip-color, #fff)' }}
                        cursor={{ fill: 'var(--cursor-fill, #ffffff10)' }}
                      />
                      <Bar dataKey="avgConfidence" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Avg Confidence (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Recent Activity List */}
            <div className="dark:bg-white/5 bg-white border dark:border-white/10 border-gray-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {history.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl dark:bg-white/5 bg-gray-50 border dark:border-white/5 border-gray-100">
                    <img src={item.enhancedImage} alt="Thumbnail" className="w-16 h-16 rounded-xl object-cover dark:bg-white/10 bg-gray-200 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider dark:text-white/50 text-gray-500">{MODES[item.mode].title}</span>
                        <span className="text-xs dark:text-white/40 text-gray-400">{new Date(item.timestamp).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm font-medium dark:text-white text-gray-900 truncate">{item.organismName || 'Unknown Organism'}</p>
                      <p className="text-xs dark:text-white/60 text-gray-600 truncate mt-1">{item.summary}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className={`text-sm font-bold ${item.confidenceScore > 80 ? 'text-emerald-500 dark:text-emerald-400' : item.confidenceScore > 50 ? 'text-orange-500 dark:text-orange-400' : 'text-red-500 dark:text-red-400'}`}>
                        {item.confidenceScore}%
                      </div>
                      <div className="text-[10px] dark:text-white/40 text-gray-400 uppercase tracking-wider mt-1">Confidence</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
