import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Eye, Crosshair, RotateCcw, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../store';
import { SENSITIVITY_CATEGORIES } from '../data';

export default function SensitivityPanel() {
  const { t } = useTranslation();
  const { sensitivity } = useStore();
  const [activeCategory, setActiveCategory] = useState('camera');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!sensitivity) return null;

  const categories = [
    { id: 'camera', label: t('cameraSensitivity'), icon: Eye, data: sensitivity.camera, max: 300 },
    { id: 'ads', label: t('adsSensitivity'), icon: Crosshair, data: sensitivity.ads, max: 300 },
    { id: 'gyroCamera', label: t('gyroCamera'), icon: RotateCcw, data: sensitivity.gyroCamera, max: 400 },
    { id: 'gyroAds', label: t('gyroAds'), icon: Smartphone, data: sensitivity.gyroAds, max: 400 },
    { id: 'freeLook', label: t('freeLook'), icon: Eye, data: sensitivity.freeLook, max: 200 },
  ];

  const current = categories.find(c => c.id === activeCategory) || categories[0];
  const keys = SENSITIVITY_CATEGORIES[activeCategory as keyof typeof SENSITIVITY_CATEGORIES] || [];

  const copyValue = (key: string, value: number) => {
    navigator.clipboard.writeText(value.toString());
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 neon-border"
    >
      <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 gaming-font">
        {t('aiAnalysis')}
      </h3>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-thin pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer relative z-10 ${
              activeCategory === cat.id
                ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/30'
                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-[var(--accent)]/50'
            }`}
          >
            <cat.icon className="w-4 h-4" />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Values */}
      <AnimatePresence>
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="space-y-3"
        >
          {keys.map((key, i) => {
            const value = current.data[key];
            const percentage = Math.min(100, (value / current.max) * 100);
            return (
              <motion.div
                key={`${activeCategory}-${key}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 sm:gap-4"
              >
                <div className="w-28 sm:w-40 text-xs sm:text-sm text-[var(--text-secondary)] font-medium shrink-0">
                  {t(key)}
                </div>
                <div className="flex-1 relative">
                  <div className="h-2 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.6, delay: i * 0.04, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-orange-400"
                    />
                  </div>
                </div>
                <div className="w-14 text-right shrink-0">
                  <span className="text-sm font-bold text-[var(--text-primary)]">{value}%</span>
                </div>
                <button
                  onClick={() => copyValue(key, value)}
                  className="p-1.5 rounded-lg hover:bg-[var(--bg-primary)] transition-colors shrink-0"
                >
                  {copiedKey === key ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-[var(--text-secondary)]" />
                  )}
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
