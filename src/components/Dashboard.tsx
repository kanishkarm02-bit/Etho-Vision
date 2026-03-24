import { useState, useRef } from 'react';
import { ShieldAlert, Stethoscope, ClipboardCheck, Upload, Camera, Loader2, AlertCircle, Image as ImageIcon, Info, Download, History, Plus, ChevronRight, X, CheckCircle2, Home, BarChart3, Video } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { Mode, AnalysisResult, MODES } from '../types';
import { enhanceImage, downloadTextFile } from '../lib/imageUtils';
import CameraCapture from './CameraCapture';
import Header from './Header';
import { ViewState } from '../App';
import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    organismName: { type: Type.STRING, description: "The common and scientific name of the organism." },
    naturalEnvironment: { type: Type.STRING, description: "The natural habitat or environment where this organism is typically found." },
    organismDescription: { type: Type.STRING, description: "A descriptive overview of the organism's physical characteristics and typical behavior." },
    stateAnalysis: { type: Type.STRING, description: "What the animal is trying to say, do, or feel based on its current state." },
    speciesBehavior: { type: Type.STRING, description: "Typical behavior of the species." },
    speciesDiet: { type: Type.STRING, description: "Typical diet of the species." },
    conservationStatus: { type: Type.STRING, description: "Conservation status of the species." },
    environmentClimate: { type: Type.STRING, description: "Climate of the natural environment." },
    environmentGeography: { type: Type.STRING, description: "Geographical features of the natural environment." },
    environmentThreats: { type: Type.STRING, description: "Potential threats specific to that habitat." },
    summary: { type: Type.STRING, description: "A short 1-2 sentence summary of the findings." },
    fullReport: { type: Type.STRING, description: "The detailed analysis report in Markdown format. Include sections for Observations, Assessment, and Recommendations." },
    confidenceScore: { type: Type.NUMBER, description: "A confidence score from 0 to 100 representing the AI's certainty." },
    riskLevel: { type: Type.STRING, description: "Low, Medium, or High (if applicable, otherwise N/A)" }
  },
  required: ["organismName", "naturalEnvironment", "organismDescription", "stateAnalysis", "speciesBehavior", "speciesDiet", "conservationStatus", "environmentClimate", "environmentGeography", "environmentThreats", "summary", "fullReport", "confidenceScore"]
};

type MediaItem = { id: string, dataUrl: string, type: 'photo' | 'video', mimeType: string, status: 'pending' | 'analyzing' | 'done' | 'error' | 'blurry', resultId?: string, tips?: string[] };

export default function Dashboard({ userName, currentView, onViewChange, history, setHistory }: { userName: string, currentView: ViewState, onViewChange: (view: ViewState) => void, history: AnalysisResult[], setHistory: React.Dispatch<React.SetStateAction<AnalysisResult[]>> }) {
  const [activeMode, setActiveMode] = useState<Mode>('wildlife');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedResult, setSelectedResult] = useState<AnalysisResult | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newItems = files.map(file => {
      return new Promise<MediaItem>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({ 
            id: Math.random().toString(36).substring(7), 
            dataUrl: reader.result as string, 
            type: file.type.startsWith('video') ? 'video' : 'photo',
            mimeType: file.type,
            status: 'pending' 
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newItems).then(items => {
      setMediaItems(prev => [...prev, ...items]);
      setSelectedResult(null);
    });
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCameraCapture = (data: { type: 'photo' | 'video', dataUrl: string, mimeType: string }) => {
    setMediaItems(prev => [...prev, { id: Math.random().toString(36).substring(7), dataUrl: data.dataUrl, type: data.type, mimeType: data.mimeType, status: 'pending' }]);
    setShowCamera(false);
    setSelectedResult(null);
  };

  const removeMedia = (id: string) => {
    setMediaItems(prev => prev.filter(item => item.id !== id));
  };

  const checkBlurry = async (base64Data: string, mimeType: string) => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType } },
            { text: "Is this image too blurry to clearly analyze an animal? Return JSON { isBlurry: boolean, tips: string[] }" }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isBlurry: { type: Type.BOOLEAN },
              tips: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["isBlurry", "tips"]
          }
        }
      });
      return JSON.parse(response.text || '{"isBlurry": false, "tips": []}');
    } catch (e) {
      return { isBlurry: false, tips: [] };
    }
  };

  const analyzeBatch = async () => {
    const pendingItems = mediaItems.filter(item => item.status === 'pending');
    if (pendingItems.length === 0) return;

    setIsProcessingBatch(true);

    for (const item of pendingItems) {
      setMediaItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'analyzing' } : i));
      
      try {
        let base64Data = item.dataUrl.split(',')[1];
        let mimeType = item.mimeType;
        let enhancedDataUrl = item.dataUrl;

        if (item.type === 'photo') {
          // Check for blurriness first
          const blurCheck = await checkBlurry(base64Data, mimeType);
          if (blurCheck.isBlurry) {
            setMediaItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'blurry', tips: blurCheck.tips } : i));
            continue;
          }
          // Enhance image
          enhancedDataUrl = await enhanceImage(item.dataUrl);
          base64Data = enhancedDataUrl.split(',')[1];
          mimeType = enhancedDataUrl.split(';')[0].split(':')[1];
        }

        const response = await ai.models.generateContent({
          model: 'gemini-3.1-pro-preview',
          contents: {
            parts: [
              { inlineData: { data: base64Data, mimeType } },
              { text: MODES[activeMode].prompt }
            ]
          },
          config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
          }
        });

        const resultJson = JSON.parse(response.text || '{}');
        
        const newResult: AnalysisResult = {
          id: Math.random().toString(36).substring(7),
          timestamp: Date.now(),
          mode: activeMode,
          originalImage: item.dataUrl,
          enhancedImage: enhancedDataUrl,
          organismName: resultJson.organismName || 'Unknown Organism',
          naturalEnvironment: resultJson.naturalEnvironment || 'Unknown Environment',
          organismDescription: resultJson.organismDescription || 'No description provided.',
          stateAnalysis: resultJson.stateAnalysis || 'No state analysis provided.',
          speciesBehavior: resultJson.speciesBehavior || 'N/A',
          speciesDiet: resultJson.speciesDiet || 'N/A',
          conservationStatus: resultJson.conservationStatus || 'N/A',
          environmentClimate: resultJson.environmentClimate || 'N/A',
          environmentGeography: resultJson.environmentGeography || 'N/A',
          environmentThreats: resultJson.environmentThreats || 'N/A',
          summary: resultJson.summary || 'Analysis complete.',
          fullReport: resultJson.fullReport || 'No detailed report available.',
          confidenceScore: resultJson.confidenceScore || 0,
          riskLevel: resultJson.riskLevel
        };

        setHistory(prev => [newResult, ...prev]);
        setMediaItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'done', resultId: newResult.id } : i));
        
        toast.success('Analysis Complete', {
          description: 'Check your analytics page to see your updated stats!',
          action: {
            label: 'View Analytics',
            onClick: () => onViewChange('analytics')
          }
        });

        if (pendingItems.length === 1) {
          setSelectedResult(newResult);
        }

      } catch (err) {
        console.error('Analysis error for item', item.id, err);
        setMediaItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'error' } : i));
      }
    }

    setIsProcessingBatch(false);
  };

  const handleDownloadReport = (result: AnalysisResult) => {
    const content = `# EthoVision AI Analysis Report
Date: ${new Date(result.timestamp).toLocaleString()}
Mode: ${MODES[result.mode].title}
Confidence Score: ${result.confidenceScore}%
${result.riskLevel ? `Risk Level: ${result.riskLevel}\n` : ''}

## Organism Details
- **Name:** ${result.organismName}
- **Behavior:** ${result.speciesBehavior}
- **Diet:** ${result.speciesDiet}
- **Conservation Status:** ${result.conservationStatus}

## Environment Details
- **Habitat:** ${result.naturalEnvironment}
- **Climate:** ${result.environmentClimate}
- **Geography:** ${result.environmentGeography}
- **Threats:** ${result.environmentThreats}

## Organism Description
${result.organismDescription}

## State Analysis
${result.stateAnalysis}

## Summary
${result.summary}

## Detailed Report
${result.fullReport}
`;
    downloadTextFile(content, `ethovision-report-${result.id}.md`);
  };

  const currentMode = MODES[activeMode];
  const Icon = currentMode.iconName === 'ShieldAlert' ? ShieldAlert : currentMode.iconName === 'Stethoscope' ? Stethoscope : ClipboardCheck;

  return (
    <div className="min-h-screen dark:bg-[#0a0a0a] bg-gray-50 dark:text-white text-gray-900 font-sans selection:bg-black/20 dark:selection:bg-white/20 relative overflow-hidden transition-colors duration-300">
      {/* Abstract background elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      {showCamera && <CameraCapture onCapture={handleCameraCapture} onClose={() => setShowCamera(false)} />}
      
      <Header userName={userName} currentView={currentView} onViewChange={onViewChange} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* Top Mode Selector */}
        <div className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-wider dark:text-white/50 text-gray-500 mb-4">EthoVision Analyzer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(Object.entries(MODES) as [Mode, typeof MODES[Mode]][]).map(([key, mode]) => {
              const isActive = activeMode === key;
              const ModeIcon = mode.iconName === 'ShieldAlert' ? ShieldAlert : mode.iconName === 'Stethoscope' ? Stethoscope : ClipboardCheck;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setActiveMode(key);
                    setSelectedResult(null);
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${
                    isActive 
                      ? 'dark:bg-white/10 bg-black/5 dark:border-white/20 border-black/10 shadow-sm ring-1 dark:ring-white/20 ring-black/10' 
                      : 'dark:bg-white/5 bg-white dark:border-white/5 border-gray-200 hover:border-gray-300 dark:hover:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 p-2 rounded-full ${isActive ? mode.color + ' text-white' : 'dark:bg-white/10 bg-gray-100 dark:text-white/50 text-gray-500'}`}>
                      <ModeIcon size={18} />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${isActive ? 'dark:text-white text-gray-900' : 'dark:text-white/70 text-gray-600'}`}>
                        {mode.title}
                      </h3>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar for History */}
          <div className="lg:col-span-4 space-y-6">
            <div className="dark:bg-white/5 bg-white rounded-2xl p-5 border dark:border-white/10 border-gray-200 shadow-sm">
              <div className="flex items-start gap-3">
                <Info className="dark:text-white/50 text-gray-400 shrink-0 mt-0.5" size={18} />
                <p className="text-sm dark:text-white/60 text-gray-600 leading-relaxed">
                  Upload clear images or videos of the animal. The AI will analyze facial expressions, body language, and posture based on the selected mode's specific criteria.
                </p>
              </div>
            </div>

            {/* History Section */}
            {history.length > 0 && (
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider dark:text-white/50 text-gray-500 mb-4 flex items-center gap-2">
                  <History size={16} /> Recent Analyses
                </h2>
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {history.map(item => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedResult(item)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                        selectedResult?.id === item.id ? 'dark:bg-white/10 bg-black/5 dark:border-white/20 border-black/10' : 'dark:bg-white/5 bg-white dark:border-white/5 border-gray-200 hover:bg-gray-50 dark:hover:bg-white/10'
                      }`}
                    >
                      {item.enhancedImage.startsWith('data:video') ? (
                        <div className="w-12 h-12 rounded-lg dark:bg-white/10 bg-gray-100 flex items-center justify-center shrink-0">
                          <Video size={20} className="dark:text-white/50 text-gray-400" />
                        </div>
                      ) : (
                        <img src={item.enhancedImage} alt="Thumbnail" className="w-12 h-12 rounded-lg object-cover dark:bg-white/10 bg-gray-100 shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium dark:text-white/50 text-gray-500 uppercase tracking-wider">{item.mode}</span>
                          <span className={`text-xs font-bold ${item.confidenceScore > 80 ? 'text-emerald-500 dark:text-emerald-400' : item.confidenceScore > 50 ? 'text-orange-500 dark:text-orange-400' : 'text-red-500 dark:text-red-400'}`}>
                            {item.confidenceScore}%
                          </span>
                        </div>
                        <p className="text-sm dark:text-white text-gray-900 truncate font-medium">{item.organismName || item.summary}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            
            {selectedResult ? (
              // Result View
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <button 
                  onClick={() => setSelectedResult(null)}
                  className="text-sm font-medium dark:text-white/50 text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 transition-colors"
                >
                  <ChevronRight className="rotate-180" size={16} /> Back to Upload
                </button>
                
                <div className="dark:bg-white/5 bg-white backdrop-blur-md rounded-3xl border dark:border-white/10 border-gray-200 shadow-sm overflow-hidden">
                  <div className={`px-6 py-5 border-b dark:border-white/10 border-gray-200 flex items-center justify-between ${MODES[selectedResult.mode].color} bg-opacity-20 dark:bg-opacity-20`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${MODES[selectedResult.mode].color} text-white`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <h2 className="font-semibold dark:text-white text-gray-900 text-lg">Analysis Report</h2>
                        <p className="text-xs dark:text-white/60 text-gray-600 font-medium">{new Date(selectedResult.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDownloadReport(selectedResult)}
                      className="flex items-center gap-2 px-4 py-2 dark:bg-white/10 bg-white rounded-lg text-sm font-medium border dark:border-white/10 border-gray-200 hover:bg-gray-50 dark:hover:bg-white/20 transition-colors dark:text-white text-gray-900 shadow-sm"
                    >
                      <Download size={16} /> Download
                    </button>
                  </div>
                  
                  <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 space-y-4">
                      <div className="rounded-2xl overflow-hidden border dark:border-white/10 border-gray-200 dark:bg-white/5 bg-gray-50">
                        {selectedResult.enhancedImage.startsWith('data:video') ? (
                          <video src={selectedResult.enhancedImage} controls className="w-full h-auto object-cover" />
                        ) : (
                          <img src={selectedResult.enhancedImage} alt="Analyzed Subject" className="w-full h-auto object-cover" />
                        )}
                      </div>
                      <div className="dark:bg-white/5 bg-gray-50 rounded-xl p-4 border dark:border-white/10 border-gray-200">
                        <div className="text-xs dark:text-white/50 text-gray-500 uppercase font-bold tracking-wider mb-1">AI Confidence</div>
                        <div className="flex items-end gap-2">
                          <span className="text-3xl font-light dark:text-white text-gray-900">{selectedResult.confidenceScore}%</span>
                        </div>
                        {selectedResult.riskLevel && (
                          <div className="mt-4 pt-4 border-t dark:border-white/10 border-gray-200">
                            <div className="text-xs dark:text-white/50 text-gray-500 uppercase font-bold tracking-wider mb-1">Risk Level</div>
                            <span className={`inline-flex px-2.5 py-1 rounded-md text-sm font-medium ${
                              selectedResult.riskLevel.toLowerCase() === 'high' ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400' :
                              selectedResult.riskLevel.toLowerCase() === 'medium' ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400' :
                              'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                            }`}>
                              {selectedResult.riskLevel}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="md:col-span-2 prose dark:prose-invert max-w-none">
                      <div className="dark:bg-white/5 bg-gray-50 p-5 rounded-xl border dark:border-white/10 border-gray-200 mb-6 space-y-4">
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider dark:text-white/50 text-gray-500 mt-0 mb-1">Organism</h3>
                          <p className="dark:text-white text-gray-900 font-medium m-0">{selectedResult.organismName}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider dark:text-white/50 text-gray-500 mt-0 mb-1">Behavior</h3>
                            <p className="dark:text-white/80 text-gray-700 text-sm m-0">{selectedResult.speciesBehavior}</p>
                          </div>
                          <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider dark:text-white/50 text-gray-500 mt-0 mb-1">Diet</h3>
                            <p className="dark:text-white/80 text-gray-700 text-sm m-0">{selectedResult.speciesDiet}</p>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider dark:text-white/50 text-gray-500 mt-0 mb-1">Conservation Status</h3>
                          <p className="dark:text-white/80 text-gray-700 text-sm m-0">{selectedResult.conservationStatus}</p>
                        </div>
                      </div>

                      <div className="dark:bg-white/5 bg-gray-50 p-5 rounded-xl border dark:border-white/10 border-gray-200 mb-6 space-y-4">
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider dark:text-white/50 text-gray-500 mt-0 mb-1">Natural Environment</h3>
                          <p className="dark:text-white/80 text-gray-700 text-sm m-0">{selectedResult.naturalEnvironment}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider dark:text-white/50 text-gray-500 mt-0 mb-1">Climate</h3>
                            <p className="dark:text-white/80 text-gray-700 text-sm m-0">{selectedResult.environmentClimate}</p>
                          </div>
                          <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider dark:text-white/50 text-gray-500 mt-0 mb-1">Geography</h3>
                            <p className="dark:text-white/80 text-gray-700 text-sm m-0">{selectedResult.environmentGeography}</p>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider dark:text-white/50 text-gray-500 mt-0 mb-1">Threats</h3>
                          <p className="dark:text-white/80 text-gray-700 text-sm m-0">{selectedResult.environmentThreats}</p>
                        </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-500/10 p-5 rounded-xl border border-blue-200 dark:border-blue-500/20 mb-6">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mt-0 mb-2">State Analysis</h3>
                        <p className="text-gray-800 dark:text-white/90 text-sm m-0 leading-relaxed">{selectedResult.stateAnalysis}</p>
                      </div>

                      <div className="dark:bg-white/5 bg-gray-50 p-5 rounded-xl border dark:border-white/10 border-gray-200 mb-6">
                        <h3 className="text-xs font-bold uppercase tracking-wider dark:text-white/50 text-gray-500 mt-0 mb-2">Summary</h3>
                        <p className="dark:text-white text-gray-900 font-medium m-0">{selectedResult.summary}</p>
                      </div>
                      
                      <div className="mt-8 pt-8 border-t dark:border-white/10 border-gray-200">
                        <ReactMarkdown>{selectedResult.fullReport}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Upload / Batch View
              <div className="dark:bg-white/5 bg-white backdrop-blur-md rounded-3xl border dark:border-white/10 border-gray-200 overflow-hidden shadow-sm">
                <div className="p-6 sm:p-8">
                  
                  {/* Split Upload Area */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Left: Camera/Video */}
                    <div 
                      onClick={() => setShowCamera(true)}
                      className="dark:bg-white/5 bg-gray-50 border dark:border-white/10 border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer group"
                    >
                      <div className="w-16 h-16 rounded-full dark:bg-white/10 bg-white shadow-sm flex items-center justify-center dark:text-white text-gray-600 mb-4 group-hover:scale-110 transition-transform">
                        <Camera size={24} />
                      </div>
                      <h3 className="text-lg font-medium dark:text-white text-gray-900 mb-2">Take Photo / Video</h3>
                      <p className="text-sm dark:text-white/50 text-gray-500">Use your device camera</p>
                    </div>

                    {/* Right: Manual Upload */}
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="dark:bg-white/5 bg-gray-50 border dark:border-white/10 border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer group"
                    >
                      <div className="w-16 h-16 rounded-full dark:bg-white/10 bg-white shadow-sm flex items-center justify-center dark:text-white text-gray-600 mb-4 group-hover:scale-110 transition-transform">
                        <Upload size={24} />
                      </div>
                      <h3 className="text-lg font-medium dark:text-white text-gray-900 mb-2">Upload Manually</h3>
                      <p className="text-sm dark:text-white/50 text-gray-500">Select images or videos</p>
                    </div>
                  </div>

                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    accept="image/*,video/*" 
                    multiple
                    className="hidden" 
                  />

                  {mediaItems.length > 0 && (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold flex items-center gap-2 dark:text-white text-gray-900">
                          <ImageIcon size={20} className="dark:text-white/50 text-gray-400" />
                          Selected Media
                        </h2>
                        <button 
                          onClick={() => setMediaItems([])}
                          className="text-sm dark:text-white/50 text-gray-500 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
                        >
                          Clear All
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                        {mediaItems.map((item) => (
                          <div key={item.id} className="relative aspect-square rounded-2xl overflow-hidden border dark:border-white/10 border-gray-200 group dark:bg-white/5 bg-gray-50">
                            {item.type === 'video' ? (
                              <video src={item.dataUrl} className="w-full h-full object-cover" />
                            ) : (
                              <img src={item.dataUrl} alt="Upload" className="w-full h-full object-cover" />
                            )}
                            
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                              <button 
                                onClick={() => removeMedia(item.id)}
                                className="bg-white/20 text-white p-2 rounded-full hover:bg-red-500 hover:scale-110 transition-all"
                              >
                                <X size={16} />
                              </button>
                            </div>

                            {item.status !== 'pending' && (
                              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-white p-4 text-center">
                                {item.status === 'analyzing' && <Loader2 className="animate-spin text-white mb-2" size={24} />}
                                {item.status === 'done' && <CheckCircle2 className="text-emerald-400 mb-2" size={24} />}
                                {item.status === 'error' && <AlertCircle className="text-red-400 mb-2" size={24} />}
                                {item.status === 'blurry' && <AlertCircle className="text-orange-400 mb-2" size={24} />}
                                <span className="text-xs font-medium capitalize mb-1">{item.status}</span>
                                {item.status === 'blurry' && item.tips && (
                                  <div className="text-[10px] text-white/70 mt-1 space-y-1">
                                    {item.tips.slice(0, 2).map((tip, i) => <p key={i}>• {tip}</p>)}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 flex justify-end">
                        <button
                          onClick={analyzeBatch}
                          disabled={mediaItems.filter(i => i.status === 'pending').length === 0 || isProcessingBatch}
                          className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${
                            mediaItems.filter(i => i.status === 'pending').length === 0
                              ? 'dark:bg-white/10 bg-gray-100 dark:text-white/30 text-gray-400 cursor-not-allowed' 
                              : isProcessingBatch
                                ? 'dark:bg-white/20 bg-gray-200 dark:text-white text-gray-600 cursor-wait'
                                : 'dark:bg-white bg-black dark:text-black text-white dark:hover:bg-white/90 hover:bg-black/90 shadow-sm'
                          }`}
                        >
                          {isProcessingBatch ? (
                            <>
                              <Loader2 size={18} className="animate-spin" />
                              Processing Batch...
                            </>
                          ) : (
                            <>
                              <Icon size={18} />
                              Analyze {mediaItems.filter(i => i.status === 'pending').length > 0 ? mediaItems.filter(i => i.status === 'pending').length : ''} Items
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
