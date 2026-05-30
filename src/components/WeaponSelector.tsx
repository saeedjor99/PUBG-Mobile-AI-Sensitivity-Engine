import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Crosshair, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { WEAPONS } from '../data';
import { useStore } from '../store';

const allWeapons: { name: string; category: string; recoil: number; stability: number }[] = [];

Object.entries(WEAPONS).forEach(([category, weapons]) => {
  weapons.forEach((w) => {
    allWeapons.push({ name: w.name, category, recoil: w.recoil, stability: w.stability });
  });
});

export default function WeaponSelector() {
  const { t } = useTranslation();
  const { selectedWeapon, setSelectedWeapon } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = allWeapons.filter(
    (w) =>
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t(w.category).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const current = allWeapons.find((w) => w.name === selectedWeapon);

  const getCategoryColor = (cat: string) => {
    const map: Record<string, string> = {
      assaultRifles: '#f59e0b',
      smg: '#06b6d4',
      snipers: '#22c55e',
      dmr: '#d946ef',
      lmg: '#ef4444',
      shotguns: '#64748b',
    };
    return map[cat] || '#94a3b8';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 neon-border"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Crosshair className="w-5 h-5 text-[var(--accent)]" />
          <h3 className="text-lg font-bold text-[var(--text-primary)] gaming-font">
            {t('selectWeapon') || 'Select Weapon'}
          </h3>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors cursor-pointer"
        >
          <Crosshair className="w-4 h-4" />
          <span>{isOpen ? (t('cancel') || 'Cancel') : (t('changeWeapon') || 'Change Weapon')}</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Current Weapon */}
      {current && !isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-4 p-4 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)]"
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{ backgroundColor: `${getCategoryColor(current.category)}30`, color: getCategoryColor(current.category) }}
          >
            {current.name.slice(0, 2)}
          </div>
          <div className="flex-1">
            <div className="font-bold text-[var(--text-primary)]">{current.name}</div>
            <div className="text-xs text-[var(--text-secondary)]">
              {t(current.category)} · Recoil: {current.recoil} · Stability: {current.stability}
            </div>
          </div>
          <div
            className="text-xs font-medium px-2 py-1 rounded-full shrink-0"
            style={{ backgroundColor: `${getCategoryColor(current.category)}20`, color: getCategoryColor(current.category) }}
          >
            {t(current.category)}
          </div>
        </motion.div>
      )}

      {/* Weapon Selector Panel */}
      {isOpen && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchWeapon') || 'Search weapon...'}
            className="w-full px-4 py-3 mb-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-[var(--accent)] focus:outline-none transition-colors"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-72 overflow-y-auto scrollbar-thin pr-1">
            {filtered.map((weapon, i) => {
              const isSelected = selectedWeapon === weapon.name;
              const color = getCategoryColor(weapon.category);
              return (
                <motion.button
                  key={weapon.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.015, 0.3) }}
                  onClick={() => {
                    setSelectedWeapon(weapon.name);
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                      : 'border-[var(--border-color)] bg-[var(--bg-primary)] hover:border-[var(--accent)]/50'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                    style={{ backgroundColor: `${color}30`, color }}
                  >
                    {weapon.name.slice(0, 2)}
                  </div>
                  <span className={`text-xs font-semibold ${isSelected ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>
                    {weapon.name}
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary)]">
                    R{weapon.recoil} · S{weapon.stability}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-8 text-[var(--text-secondary)] text-sm">
              {t('noWeaponsFound') || 'No weapons found'}
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
