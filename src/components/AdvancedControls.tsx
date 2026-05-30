import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Settings, Eye, Volume2, Crosshair, DoorOpen, Heart, Zap, Move, Smartphone, Target, AudioLines, Sparkles } from 'lucide-react';
import { useStore } from '../store';

const controlsList = [
  { key: 'peekFire', label: 'peekFire', icon: Eye },
  { key: 'peekScope', label: 'peekScope', icon: Target },
  { key: 'gyroReverse', label: 'gyroReverse', icon: Smartphone },
  { key: 'cameraRotation', label: 'cameraRotation', icon: Move },
  { key: 'scopeMode', label: 'scopeMode', icon: Crosshair },
  { key: 'shotgunMode', label: 'shotgunMode', icon: Zap },
  { key: 'autoDoors', label: 'autoDoors', icon: DoorOpen },
  { key: 'healingPrompt', label: 'healingPrompt', icon: Heart },
  { key: 'slideSettings', label: 'slideSettings', icon: Move },
  { key: 'sprintSensitivity', label: 'sprintSensitivity', icon: Zap },
  { key: 'fppDynamic', label: 'fppDynamic', icon: Eye },
  { key: 'transparentUI', label: 'transparentUI', icon: Sparkles },
  { key: 'audioMarkers', label: 'audioMarkers', icon: AudioLines },
  { key: 'hitEffects', label: 'hitEffects', icon: Volume2 },
  { key: 'crosshairSettings', label: 'crosshairSettings', icon: Crosshair },
];

export default function AdvancedControls() {
  const { t } = useTranslation();
  const { advancedControls, toggleAdvancedControl } = useStore();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 neon-border"
    >
      <div className="flex items-center gap-3 mb-4">
        <Settings className="w-5 h-5 text-[var(--accent)]" />
        <h3 className="text-lg font-bold text-[var(--text-primary)] gaming-font">{t('advancedControls')}</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {controlsList.map((control, i) => {
          const isEnabled = advancedControls[control.key];
          const Icon = control.icon;
          
          return (
            <motion.div
              key={control.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer relative z-10 ${
                isEnabled
                  ? 'border-[var(--accent)]/50 bg-[var(--accent)]/5'
                  : 'border-[var(--border-color)] bg-[var(--bg-primary)]'
              }`}
              onClick={() => toggleAdvancedControl(control.key)}
            >
              <Icon className={`w-4 h-4 ${isEnabled ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`} />
              <span className={`text-sm flex-1 ${isEnabled ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                {t(control.label)}
              </span>
              <div className="toggle-switch">
                <input type="checkbox" checked={isEnabled} readOnly />
                <span className="toggle-slider" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
