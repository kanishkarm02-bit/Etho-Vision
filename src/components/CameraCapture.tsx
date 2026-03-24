import { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, X, RefreshCw, Video, Square } from 'lucide-react';

export default function CameraCapture({ onCapture, onClose }: { onCapture: (data: { type: 'photo' | 'video', dataUrl: string, mimeType: string }) => void, onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'photo' | 'video'>('photo');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to access camera');
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        onCapture({ type: 'photo', dataUrl, mimeType: 'image/jpeg' });
      }
    }
  };

  const startRecording = () => {
    if (stream) {
      chunksRef.current = [];
      const options = { mimeType: 'video/webm;codecs=vp9,opus' };
      const recorder = new MediaRecorder(stream, MediaRecorder.isTypeSupported(options.mimeType) ? options : undefined);
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        const reader = new FileReader();
        reader.onloadend = () => {
          onCapture({ type: 'video', dataUrl: reader.result as string, mimeType: recorder.mimeType });
        };
        reader.readAsDataURL(blob);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
      <button onClick={onClose} className="absolute top-6 right-6 text-white hover:text-stone-300 bg-black/50 p-2 rounded-full">
        <X size={24} />
      </button>
      
      {error ? (
        <div className="text-white text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={startCamera} className="bg-white text-black px-4 py-2 rounded-lg flex items-center gap-2 mx-auto">
            <RefreshCw size={18} /> Retry
          </button>
        </div>
      ) : (
        <div className="w-full max-w-2xl flex flex-col items-center gap-6">
          <div className="flex gap-4 bg-white/10 p-1 rounded-full backdrop-blur-md">
            <button 
              onClick={() => setMode('photo')} 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${mode === 'photo' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
            >
              Photo
            </button>
            <button 
              onClick={() => setMode('video')} 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${mode === 'video' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
            >
              Video
            </button>
          </div>

          <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted
              className="w-full h-full object-cover"
            />
            {isRecording && (
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-md">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-white text-xs font-medium">Recording</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-center h-24">
            {mode === 'photo' ? (
              <button 
                onClick={capturePhoto}
                className="w-16 h-16 rounded-full bg-white border-4 border-white/30 flex items-center justify-center hover:scale-105 transition-transform"
              >
                <div className="w-12 h-12 rounded-full bg-white border border-stone-200 shadow-inner flex items-center justify-center">
                   <Camera size={24} className="text-stone-800" />
                </div>
              </button>
            ) : (
              <button 
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-16 h-16 rounded-full border-4 flex items-center justify-center hover:scale-105 transition-transform ${isRecording ? 'bg-transparent border-red-500' : 'bg-red-500 border-red-500/30'}`}
              >
                {isRecording ? (
                  <Square size={20} className="text-red-500 fill-red-500" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-red-500 border border-red-400 shadow-inner flex items-center justify-center">
                    <Video size={24} className="text-white" />
                  </div>
                )}
              </button>
            )}
          </div>
          <p className="text-white/50 text-sm">
            {mode === 'photo' ? 'Ensure the subject is well-lit and in focus' : 'Record a short clip (max 10 seconds recommended)'}
          </p>
        </div>
      )}
    </div>
  );
}
