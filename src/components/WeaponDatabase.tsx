import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Crosshair, Gauge, Shield, Target, ChevronDown } from 'lucide-react';
import { WEAPONS } from '../data';

const weaponCategories = [
  { key: 'assaultRifles', label: 'assaultRifles', color: '#f59e0b' },
  { key: 'smg', label: 'smg', color: '#06b6d4' },
  { key: 'snipers', label: 'snipers', color: '#22c55e' },
  { key: 'dmr', label: 'dmr', color: '#d946ef' },
  { key: 'lmg', label: 'lmg', color: '#ef4444' },
  { key: 'shotguns', label: 'shotguns', color: '#64748b' },
] as const;

export default function WeaponDatabase() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<string>('assaultRifles');
  const [expandedWeapon, setExpandedWeapon] = useState<string | null>(null);
  
  const currentWeapons = WEAPONS[activeCategory as keyof typeof WEAPONS] || [];
  const categoryInfo = weaponCategories.find(c => c.key === activeCategory);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 neon-border"
    >
      <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 gaming-font">
        {t('weapons')}
      </h3>
      
      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-thin pb-2">
        {weaponCategories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => { setActiveCategory(cat.key); setExpandedWeapon(null); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat.key
                ? 'text-white shadow-lg'
                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-[var(--accent)]/50'
            }`}
            style={activeCategory === cat.key ? { backgroundColor: cat.color, boxShadow: `0 4px 20px ${cat.color}40` } : {}}
          >
            {t(cat.label)}
          </button>
        ))}
      </div>
      
      {/* Weapons List */}
      <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin pr-1">
        <AnimatePresence>
          {currentWeapons.map((weapon, i) => {
            const isExpanded = expandedWeapon === weapon.name;
            const recoilPercent = weapon.recoil;
            const stabilityPercent = weapon.stability;
            
            return (
              <motion.div
                key={weapon.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: i * 0.03 }}
                className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] overflow-hidden"
              >
                <button
                  onClick={() => setExpandedWeapon(isExpanded ? null : weapon.name)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-[var(--bg-card)] transition-colors cursor-pointer"
                >
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: `${categoryInfo?.color}20`, color: categoryInfo?.color }}
                  >
                    {weapon.name.slice(0, 2)}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-[var(--text-primary)]">{weapon.name}</div>
                    <div className="text-xs text-[var(--text-secondary)]">{t('damage')}: {weapon.damage} · {t('fireRate')}: {(1/weapon.fireRate).toFixed(0)} RPM</div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-[var(--text-secondary)] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center gap-2">
                            <Crosshair className="w-4 h-4 text-[var(--accent)]" />
                            <span className="text-xs text-[var(--text-secondary)]">{t('damage')}</span>
                            <span className="text-sm font-bold text-[var(--text-primary)] ml-auto">{weapon.damage}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Gauge className="w-4 h-4 text-[var(--accent)]" />
                            <span className="text-xs text-[var(--text-secondary)]">{t('fireRate')}</span>
                            <span className="text-sm font-bold text-[var(--text-primary)] ml-auto">{(1/weapon.fireRate).toFixed(0)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-red-400" />
                            <span className="text-xs text-[var(--text-secondary)]">{t('recoilPattern')}</span>
                            <span className="text-sm font-bold text-red-400 ml-auto">{weapon.recoil}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-green-400" />
                            <span className="text-xs text-[var(--text-secondary)]">{t('sprayStabilization')}</span>
                            <span className="text-sm font-bold text-green-400 ml-auto">{weapon.stability}</span>
                          </div>
                        </div>
                        
                        {/* Recoil bar */}
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-[var(--text-secondary)]">{t('recoilPattern')}</span>
                            <span className="text-red-400">{recoilPercent}%</span>
                          </div>
                          <div className="h-1.5 bg-[var(--bg-card)] rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full" style={{ width: `${recoilPercent}%` }} />
                          </div>
                        </div>
                        
                        {/* Stability bar */}
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-[var(--text-secondary)]">{t('sprayStabilization')}</span>
                            <span className="text-green-400">{stabilityPercent}%</span>
                          </div>
                          <div className="h-1.5 bg-[var(--bg-card)] rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" style={{ width: `${stabilityPercent}%` }} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
