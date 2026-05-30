import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Crosshair, Target, Move, ArrowUp, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { useStore } from '../store';

export default function HUDPreview() {
  const { t } = useTranslation();
  const { hudLayout, playStyle } = useStore();
  
  if (!hudLayout) return null;
  
  const { fireButton, scopeButton, movement, jump, crouch, prone, transparency } = hudLayout;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 neon-border"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[var(--text-primary)] gaming-font">
          {t('hudPreview')}
        </h3>
        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
          <Eye className="w-4 h-4" />
          <span>{t('fingers', { count: playStyle })}</span>
        </div>
      </div>
      
      {/* Landscape HUD Preview */}
      <div className="relative w-full overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-black border-2 border-[var(--border-color)]">
        <div className="hud-preview-container">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            {/* Game Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
              {/* Grid overlay */}
              <div className="absolute inset-0 opacity-10" 
                   style={{ backgroundImage: 'linear-gradient(rgba(245,158,11,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
              
              {/* Crosshair center */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="crosshair">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-[var(--accent)] rounded-full" />
                </div>
              </div>
              
              {/* Mini map area */}
              <div className="absolute top-4 right-4 w-20 h-20 rounded-full border-2 border-[var(--accent)]/30 bg-black/40 backdrop-blur-sm">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-[var(--accent)] rounded-full" />
                <div className="absolute top-1/2 left-1/2 w-8 h-[1px] bg-[var(--accent)]/30 origin-left -translate-y-1/2" style={{ transform: 'translateY(-50%) rotate(-45deg)' }} />
              </div>
              
              {/* Ammo count */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
                <div className="text-2xl font-bold text-white gaming-font">30/180</div>
                <div className="text-[10px] text-[var(--accent)] uppercase tracking-wider">Auto</div>
              </div>
              
              {/* Health bar */}
              <div className="absolute bottom-4 left-4 w-32">
                <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-gradient-to-r from-green-500 to-green-400 rounded-full" />
                </div>
                <div className="h-1 mt-0.5 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-[60%] bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" />
                </div>
              </div>
              
              {/* Movement joystick */}
              <motion.div
                className="absolute rounded-full border-2 flex items-center justify-center"
                style={{
                  left: `${movement.x}%`,
                  top: `${movement.y}%`,
                  width: `${movement.size}px`,
                  height: `${movement.size}px`,
                  borderColor: `rgba(255,255,255,${transparency / 100 * 0.5})`,
                  backgroundColor: `rgba(255,255,255,${transparency / 100 * 0.1})`,
                }}
                whileHover={{ scale: 1.1 }}
              >
                <Move className="w-5 h-5 text-white/60" />
              </motion.div>
              
              {/* Fire button */}
              <motion.div
                className="absolute rounded-full border-2 flex items-center justify-center"
                style={{
                  left: `${fireButton.x}%`,
                  top: `${fireButton.y}%`,
                  width: `${fireButton.size}px`,
                  height: `${fireButton.size}px`,
                  borderColor: `rgba(239,68,68,${transparency / 100 * 0.7})`,
                  backgroundColor: `rgba(239,68,68,${transparency / 100 * 0.2})`,
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Target className="w-6 h-6 text-red-400" />
              </motion.div>
              
              {/* Scope button */}
              <motion.div
                className="absolute rounded-full border-2 flex items-center justify-center"
                style={{
                  left: `${scopeButton.x}%`,
                  top: `${scopeButton.y}%`,
                  width: `${scopeButton.size}px`,
                  height: `${scopeButton.size}px`,
                  borderColor: `rgba(245,158,11,${transparency / 100 * 0.7})`,
                  backgroundColor: `rgba(245,158,11,${transparency / 100 * 0.2})`,
                }}
                whileHover={{ scale: 1.1 }}
              >
                <Crosshair className="w-4 h-4 text-[var(--accent)]" />
              </motion.div>
              
              {/* Jump button */}
              <motion.div
                className="absolute rounded-full border-2 flex items-center justify-center"
                style={{
                  left: `${jump.x}%`,
                  top: `${jump.y}%`,
                  width: `${jump.size}px`,
                  height: `${jump.size}px`,
                  borderColor: `rgba(255,255,255,${transparency / 100 * 0.4})`,
                  backgroundColor: `rgba(255,255,255,${transparency / 100 * 0.08})`,
                }}
                whileHover={{ scale: 1.1 }}
              >
                <ArrowUp className="w-4 h-4 text-white/60" />
              </motion.div>
              
              {/* Crouch button */}
              <motion.div
                className="absolute rounded-full border-2 flex items-center justify-center"
                style={{
                  left: `${crouch.x}%`,
                  top: `${crouch.y}%`,
                  width: `${crouch.size}px`,
                  height: `${crouch.size}px`,
                  borderColor: `rgba(255,255,255,${transparency / 100 * 0.4})`,
                  backgroundColor: `rgba(255,255,255,${transparency / 100 * 0.08})`,
                }}
                whileHover={{ scale: 1.1 }}
              >
                <ChevronDown className="w-4 h-4 text-white/60" />
              </motion.div>
              
              {/* Prone button */}
              <motion.div
                className="absolute rounded-full border-2 flex items-center justify-center"
                style={{
                  left: `${prone.x}%`,
                  top: `${prone.y}%`,
                  width: `${prone.size}px`,
                  height: `${prone.size}px`,
                  borderColor: `rgba(255,255,255,${transparency / 100 * 0.4})`,
                  backgroundColor: `rgba(255,255,255,${transparency / 100 * 0.08})`,
                }}
                whileHover={{ scale: 1.1 }}
              >
                <ChevronUp className="w-4 h-4 text-white/60" />
              </motion.div>
              
              {/* Peek buttons for 4+ fingers */}
              {playStyle >= 4 && (
                <>
                  <motion.div
                    className="absolute rounded-lg border border-white/20 flex items-center justify-center text-[10px] text-white/50"
                    style={{ right: '35%', top: '70%', width: '32px', height: '24px' }}
                  >
                    L
                  </motion.div>
                  <motion.div
                    className="absolute rounded-lg border border-white/20 flex items-center justify-center text-[10px] text-white/50"
                    style={{ right: '28%', top: '70%', width: '32px', height: '24px' }}
                  >
                    R
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* HUD Stats */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="bg-[var(--bg-primary)] rounded-lg p-3 text-center border border-[var(--border-color)]">
          <div className="text-xs text-[var(--text-secondary)]">{t('fireButton')}</div>
          <div className="text-sm font-bold text-[var(--text-primary)]">{fireButton.size}px</div>
        </div>
        <div className="bg-[var(--bg-primary)] rounded-lg p-3 text-center border border-[var(--border-color)]">
          <div className="text-xs text-[var(--text-secondary)]">{t('transparentUI')}</div>
          <div className="text-sm font-bold text-[var(--text-primary)]">{transparency}%</div>
        </div>
        <div className="bg-[var(--bg-primary)] rounded-lg p-3 text-center border border-[var(--border-color)]">
          <div className="text-xs text-[var(--text-secondary)]">{t('movement')}</div>
          <div className="text-sm font-bold text-[var(--text-primary)]">{movement.size}px</div>
        </div>
      </div>
    </motion.div>
  );
}
