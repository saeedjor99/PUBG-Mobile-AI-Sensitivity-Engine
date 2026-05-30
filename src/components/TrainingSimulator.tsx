import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, RotateCcw, Target, Crosshair, Zap, Activity } from 'lucide-react';
import { useStore } from '../store';

interface TestResult {
  score: number;
  accuracy: number;
  time: number;
}

export default function TrainingSimulator() {
  const { t } = useTranslation();
  const { sensitivity } = useStore();
  const [activeTest, setActiveTest] = useState<string>('recoil');
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [dots, setDots] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [targets, setTargets] = useState<Array<{ x: number; y: number; id: number; hit: boolean }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const dotIdRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const tests = [
    { id: 'recoil', label: t('recoilSimulator'), icon: Activity },
    { id: 'spray', label: t('sprayTest'), icon: Target },
    { id: 'headshot', label: t('headshotTest'), icon: Crosshair },
    { id: 'tracking', label: t('trackingTest'), icon: Zap },
  ];
  
  const startRecoilTest = useCallback(() => {
    setIsRunning(true);
    setResult(null);
    setDots([]);
    dotIdRef.current = 0;
    
    const start = Date.now();
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      if (elapsed > 3000) {
        clearInterval(interval);
        setIsRunning(false);
        const stability = sensitivity ? (sensitivity.camera.redDot / 300) * 100 : 70;
        setResult({ score: Math.round(stability), accuracy: Math.round(85 + Math.random() * 10), time: 3 });
        return;
      }
      
      const id = dotIdRef.current++;
      const x = 50 + (Math.random() - 0.5) * 30;
      const y = 50 - (elapsed / 3000) * 40 + (Math.random() - 0.5) * 10;
      setDots(prev => [...prev.slice(-20), { x, y, id }]);
    }, 100);
    
    intervalRef.current = interval;
  }, [sensitivity]);
  
  const startTrackingTest = useCallback(() => {
    setIsRunning(true);
    setResult(null);
    setTargets([]);
    dotIdRef.current = 0;
    
    const spawnTarget = () => {
      const id = dotIdRef.current++;
      const x = 20 + Math.random() * 60;
      const y = 20 + Math.random() * 60;
      setTargets(prev => [...prev.slice(-4), { x, y, id, hit: false }]);
      
      setTimeout(() => {
        setTargets(prev => prev.filter(t => t.id !== id));
      }, 1500);
    };
    
    spawnTarget();
    const interval = setInterval(spawnTarget, 1200);
    intervalRef.current = interval;
    
    setTimeout(() => {
      clearInterval(interval);
      setIsRunning(false);
      const tracking = sensitivity ? (sensitivity.camera.tppNoScope / 300) * 100 : 70;
      setResult({ score: Math.round(tracking), accuracy: Math.round(70 + Math.random() * 20), time: 5 });
      setTargets([]);
    }, 5000);
  }, [sensitivity]);
  
  const startTest = () => {
    if (activeTest === 'recoil' || activeTest === 'spray') {
      startRecoilTest();
    } else {
      startTrackingTest();
    }
  };
  
  const handleTargetClick = (id: number) => {
    setTargets(prev => prev.map(t => t.id === id ? { ...t, hit: true } : t));
    setTimeout(() => {
      setTargets(prev => prev.filter(t => t.id !== id));
    }, 200);
  };
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 neon-border"
    >
      <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 gaming-font">
        {t('training')}
      </h3>
      
      {/* Test selector */}
      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-thin pb-2">
        {tests.map((test) => (
          <button
            key={test.id}
            onClick={() => { setActiveTest(test.id); setResult(null); setDots([]); setTargets([]); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTest === test.id
                ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/30'
                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-[var(--accent)]/50'
            }`}
          >
            <test.icon className="w-4 h-4" />
            {test.label}
          </button>
        ))}
      </div>
      
      {/* Simulation Area */}
      <div 
        ref={containerRef}
        className="relative w-full rounded-xl bg-gradient-to-br from-slate-900 to-black border border-[var(--border-color)] overflow-hidden"
        style={{ height: '280px' }}
      >
        {/* Grid */}
        <div className="absolute inset-0 opacity-5" 
             style={{ backgroundImage: 'linear-gradient(rgba(245,158,11,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.5) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        
        {/* Center crosshair */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-8 h-8 border border-[var(--accent)]/30 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-[var(--accent)] rounded-full" />
        </div>
        
        {/* Recoil dots */}
        <AnimatePresence>
          {dots.map((dot) => (
            <motion.div
              key={dot.id}
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 0, scale: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute w-2 h-2 bg-[var(--accent)] rounded-full"
              style={{ left: `${dot.x}%`, top: `${dot.y}%`, transform: 'translate(-50%, -50%)' }}
            />
          ))}
        </AnimatePresence>
        
        {/* Tracking targets */}
        <AnimatePresence>
          {targets.map((target) => (
            <motion.button
              key={target.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: target.hit ? 1.5 : 1, opacity: target.hit ? 0 : 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => handleTargetClick(target.id)}
              className="absolute w-10 h-10 rounded-full border-2 border-red-500 flex items-center justify-center"
              style={{ left: `${target.x}%`, top: `${target.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <div className="w-2 h-2 bg-red-500 rounded-full" />
            </motion.button>
          ))}
        </AnimatePresence>
        
        {/* Start overlay */}
        {!isRunning && !result && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <button
              onClick={startTest}
              className="flex items-center gap-3 px-8 py-4 bg-[var(--accent)] text-white rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-[var(--accent)]/30 cursor-pointer"
            >
              <Play className="w-6 h-6" />
              {t('startTest')}
            </button>
          </div>
        )}
        
        {/* Result overlay */}
        {result && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <div className="text-center">
              <div className="text-5xl font-bold gaming-font text-[var(--accent)] mb-2">{result.score}</div>
              <div className="text-sm text-[var(--text-secondary)] mb-4">
                {t('accuracy')}: {result.accuracy}% · {result.time}s
              </div>
              <button
                onClick={startTest}
                className="flex items-center gap-2 px-6 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-xl font-medium hover:border-[var(--accent)] transition-colors mx-auto cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                {t('startTest')}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
