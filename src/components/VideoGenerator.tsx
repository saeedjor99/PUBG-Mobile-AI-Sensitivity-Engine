import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Film, Monitor, Gauge, Clock, CheckCircle } from 'lucide-react';
import { useStore } from '../store';

export default function VideoGenerator() {
  const { t } = useTranslation();
  const { sensitivity, analytics } = useStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);
  
  if (!sensitivity || !analytics) return null;
  
  const generateVideo = () => {
    setIsGenerating(true);
    setProgress(0);
    setComplete(false);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setComplete(true);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 neon-border"
    >
      <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 gaming-font">
        {t('videoGenerator')}
      </h3>
      
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-[var(--bg-primary)] rounded-xl p-3 text-center border border-[var(--border-color)]">
          <Monitor className="w-5 h-5 text-[var(--accent)] mx-auto mb-1" />
          <div className="text-xs text-[var(--text-secondary)]">{t('videoResolution')}</div>
          <div className="text-sm font-bold text-[var(--text-primary)]">1080x1920</div>
        </div>
        <div className="bg-[var(--bg-primary)] rounded-xl p-3 text-center border border-[var(--border-color)]">
          <Gauge className="w-5 h-5 text-[var(--accent)] mx-auto mb-1" />
          <div className="text-xs text-[var(--text-secondary)]">{t('videoFps')}</div>
          <div className="text-sm font-bold text-[var(--text-primary)]">60 FPS</div>
        </div>
        <div className="bg-[var(--bg-primary)] rounded-xl p-3 text-center border border-[var(--border-color)]">
          <Clock className="w-5 h-5 text-[var(--accent)] mx-auto mb-1" />
          <div className="text-xs text-[var(--text-secondary)]">{t('videoDuration')}</div>
          <div className="text-sm font-bold text-[var(--text-primary)]">15-45s</div>
        </div>
      </div>
      
      {/* Video preview frame */}
      <div className="relative w-full max-w-xs mx-auto rounded-xl bg-gradient-to-b from-slate-900 to-black border-2 border-[var(--border-color)] overflow-hidden mb-6" style={{ aspectRatio: '9/16' }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          <div className="text-2xl font-bold gaming-font text-[var(--accent)] mb-2">ALYAZOURI</div>
          <div className="text-xs text-[var(--text-secondary)] uppercase tracking-widest mb-4">PUBG Mobile AI</div>
          
          <div className="w-full space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-[var(--text-secondary)]">Camera</span>
              <span className="text-white font-bold">{sensitivity.camera.redDot}%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[var(--text-secondary)]">ADS</span>
              <span className="text-white font-bold">{sensitivity.ads.redDot}%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[var(--text-secondary)]">Gyro</span>
              <span className="text-white font-bold">{sensitivity.gyroCamera.redDot}%</span>
            </div>
          </div>
          
          <div className="mt-4 text-3xl font-bold gaming-font" style={{ color: getScoreColor(analytics.overallScore) }}>
            {analytics.overallScore}
          </div>
          <div className="text-[10px] text-[var(--text-secondary)]">AI SCORE</div>
        </div>
        
        {/* Neon border effect */}
        <div className="absolute inset-0 border border-[var(--accent)]/20 rounded-xl" />
      </div>
      
      {/* Progress */}
      {isGenerating && (
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[var(--text-secondary)]">{t('generating')}</span>
            <span className="text-[var(--accent)]">{progress}%</span>
          </div>
          <div className="h-2 bg-[var(--bg-primary)] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[var(--accent)] to-orange-400 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      
      {complete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 justify-center mb-4 text-green-500"
        >
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">{t('complete')}</span>
        </motion.div>
      )}
      
      <button
        onClick={generateVideo}
        disabled={isGenerating}
        className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-[var(--accent)] to-orange-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-[var(--accent)]/30 transition-all disabled:opacity-50 cursor-pointer"
      >
        <Film className="w-5 h-5" />
        {isGenerating ? t('generating') : t('generateVideo')}
      </button>
      
      <div className="mt-4 text-center text-xs text-[var(--text-secondary)]">
        {t('readyFor')}: TikTok · Instagram Reels · YouTube Shorts
      </div>
    </motion.div>
  );
}

function getScoreColor(score: number): string {
  if (score >= 95) return '#ef4444';
  if (score >= 85) return '#f59e0b';
  if (score >= 70) return '#22c55e';
  return '#06b6d4';
}
