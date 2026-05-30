import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { TrendingUp, Star, MessageCircle, Trophy, Heart, Clock } from 'lucide-react';
import { TRENDING_CONFIGS } from '../data';
import { useStore } from '../store';
import { getScoreColor } from '../utils';

export default function TrendingCommunity() {
  const { t } = useTranslation();
  const { favorites, toggleFavorite, savedProfiles, history } = useStore();
  
  const trendingItems = [
    { id: 'bestHeadshot', label: t('bestHeadshot'), score: 97, trend: '+2.4%' },
    { id: 'bestCloseRange', label: t('bestCloseRange'), score: 96, trend: '+1.8%' },
    { id: 'bestIpad', label: t('bestIpad'), score: 98, trend: '+3.1%' },
    { id: 'bestHighFps', label: t('bestHighFps'), score: 95, trend: '+2.0%' },
    { id: 'bestTournament', label: t('bestTournament'), score: 99, trend: '+4.2%' },
  ];
  
  return (
    <div className="space-y-6">
      {/* Trending */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6 neon-border"
      >
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-5 h-5 text-[var(--accent)]" />
          <h3 className="text-lg font-bold text-[var(--text-primary)] gaming-font">{t('trending')}</h3>
        </div>
        
        <div className="space-y-3">
          {trendingItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 p-3 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)]"
            >
              <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-[var(--accent)]" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-[var(--text-primary)]">{item.label}</div>
                <div className="text-xs text-[var(--text-secondary)]">{t('aiAnalysis')}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold gaming-font" style={{ color: getScoreColor(item.score) }}>
                  {item.score}
                </div>
                <div className="text-xs text-green-500">{item.trend}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Community Configs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6 neon-border"
      >
        <div className="flex items-center gap-3 mb-4">
          <MessageCircle className="w-5 h-5 text-[var(--accent)]" />
          <h3 className="text-lg font-bold text-[var(--text-primary)] gaming-font">{t('community')}</h3>
        </div>
        
        <div className="space-y-3">
          {TRENDING_CONFIGS.map((config, i) => {
            const isFav = favorites.some(f => f.id === config.id);
            return (
              <motion.div
                key={config.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-3 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)]"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                     style={{ backgroundColor: `${getScoreColor(config.score)}20`, color: getScoreColor(config.score) }}>
                  {config.score}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[var(--text-primary)] truncate">{config.name}</div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    {config.device} · {t('fingers', { count: config.fingers })}
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite(config)}
                  className="p-2 rounded-lg hover:bg-[var(--bg-card)] transition-colors cursor-pointer"
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'text-red-500 fill-red-500' : 'text-[var(--text-secondary)]'}`} />
                </button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
      
      {/* Saved & History */}
      {(savedProfiles.length > 0 || history.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 neon-border"
        >
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-5 h-5 text-[var(--accent)]" />
            <h3 className="text-lg font-bold text-[var(--text-primary)] gaming-font">{t('savedProfiles')}</h3>
          </div>
          
          {savedProfiles.length === 0 && history.length === 0 && (
            <div className="text-center py-8 text-[var(--text-secondary)] text-sm">
              {t('savedProfiles')} - Empty
            </div>
          )}
          
          {history.slice(0, 5).map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 p-3 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] mb-2"
            >
              <Clock className="w-4 h-4 text-[var(--text-secondary)]" />
              <div className="text-sm text-[var(--text-primary)]">{item.name || 'Config #' + (i + 1)}</div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
