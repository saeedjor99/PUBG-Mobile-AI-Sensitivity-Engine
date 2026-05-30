import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Hand, Crosshair, Target, Trophy, Zap, Flame, Crown } from 'lucide-react';
import { PLAY_STYLES, GAMEPLAY_STYLES } from '../data';
import { useStore } from '../store';

const gameplayIcons: Record<string, React.ElementType> = {
  Crosshair, Target, Trophy, Zap, Flame, Crown,
};

export default function PlayStyleSelector() {
  const { t } = useTranslation();
  const { playStyle, gameplayStyle, setPlayStyle, setGameplayStyle } = useStore();
  
  return (
    <div className="space-y-6">
      {/* Play Style */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
          {t('playStyle')}
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {PLAY_STYLES.map((fingers) => (
            <motion.button
              key={fingers}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPlayStyle(fingers)}
              className={`relative py-3 px-2 rounded-xl border transition-all cursor-pointer ${
                playStyle === fingers
                  ? 'border-[var(--accent)] bg-[var(--accent)]/10 shadow-lg shadow-[var(--accent)]/20'
                  : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--accent)]/50'
              }`}
            >
              <Hand className={`w-5 h-5 mx-auto mb-1 ${playStyle === fingers ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`} />
              <span className={`text-xs font-bold ${playStyle === fingers ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>
                {t('fingers', { count: fingers })}
              </span>
              {playStyle === fingers && (
                <motion.div
                  layoutId="playStyleIndicator"
                  className="absolute inset-0 border-2 border-[var(--accent)] rounded-xl pointer-events-none"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Gameplay Style */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
          {t('gameplayStyle')}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {GAMEPLAY_STYLES.map((style) => {
            const Icon = gameplayIcons[style.icon] || Target;
            const isActive = gameplayStyle === style.id;
            return (
              <motion.button
                key={style.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setGameplayStyle(style.id)}
                className={`relative flex items-center gap-3 py-3 px-4 rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                    : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--accent)]/50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`} />
                <span className={`text-sm font-medium ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>
                  {t(style.name)}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="gameplayIndicator"
                    className="absolute inset-0 border-2 border-[var(--accent)] rounded-xl pointer-events-none"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
