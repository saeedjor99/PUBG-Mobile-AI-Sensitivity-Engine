import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Shield, Crosshair, Gauge, RotateCcw, SprayCan, Zap, Layout, Award } from 'lucide-react';
import { useStore } from '../store';
import { getScoreColor } from '../utils';

const statIcons: Record<string, React.ElementType> = {
  stability: Shield,
  headshotAccuracy: Crosshair,
  dragSpeed: Gauge,
  gyroRating: RotateCcw,
  sprayRating: SprayCan,
  closeRangeRating: Zap,
  hudRating: Layout,
  overallScore: Award,
};

export default function AnalyticsDashboard() {
  const { t } = useTranslation();
  const { analytics } = useStore();
  
  if (!analytics) return null;
  
  const stats = [
    { key: 'stability', label: t('stability'), value: analytics.stability },
    { key: 'headshotAccuracy', label: t('headshotAccuracy'), value: analytics.headshotAccuracy },
    { key: 'dragSpeed', label: t('dragSpeed'), value: analytics.dragSpeed },
    { key: 'gyroRating', label: t('gyroRating'), value: analytics.gyroRating },
    { key: 'sprayRating', label: t('sprayRating'), value: analytics.sprayRating },
    { key: 'closeRangeRating', label: t('closeRangeRating'), value: analytics.closeRangeRating },
    { key: 'hudRating', label: t('hudRating'), value: analytics.hudRating },
    { key: 'overallScore', label: t('overallScore'), value: analytics.overallScore },
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 neon-border"
    >
      <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6 gaming-font">
        {t('analytics')}
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = statIcons[stat.key] || Shield;
          const color = getScoreColor(stat.value);
          const isOverall = stat.key === 'overallScore';
          
          return (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              className={`relative rounded-xl p-4 border ${
                isOverall 
                  ? 'border-[var(--accent)] bg-[var(--accent)]/5 col-span-2 sm:col-span-4' 
                  : 'border-[var(--border-color)] bg-[var(--bg-primary)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div className="flex-1">
                  <div className={`text-xs text-[var(--text-secondary)] uppercase tracking-wider ${isOverall ? 'text-sm' : ''}`}>
                    {stat.label}
                  </div>
                  <div className="flex items-center gap-2">
                    <span 
                      className={`font-bold gaming-font ${isOverall ? 'text-3xl' : 'text-xl'}`}
                      style={{ color }}
                    >
                      {stat.value}
                    </span>
                    <span className="text-xs text-[var(--text-secondary)]">/100</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 h-1.5 bg-[var(--bg-card)] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.value}%` }}
                  transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: color }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
