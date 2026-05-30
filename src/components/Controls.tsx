import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useStore } from '../store';

export default function Controls() {
  const { language, setLanguage } = useStore();

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Language Switcher */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleLanguage}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent)]/50 transition-colors cursor-pointer"
      >
        <Globe className="w-4 h-4 text-[var(--accent)]" />
        <span className="text-sm font-medium text-[var(--text-primary)]">
          {language === 'en' ? 'EN' : 'AR'}
        </span>
      </motion.button>
    </div>
  );
}
