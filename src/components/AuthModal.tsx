import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Chrome, TikTokIcon } from './CustomIcons';
import { useStore } from '../store';

export default function AuthModal() {
  const { t } = useTranslation();
  const { showAuthModal, setShowAuthModal, setLoggedIn, setUser } = useStore();
  
  const handleLogin = (provider: string) => {
    setLoggedIn(true);
    setUser({ name: provider === 'google' ? 'Gamer Pro' : 'TikTok User', provider });
    setShowAuthModal(false);
  };
  
  return (
    <AnimatePresence>
      {showAuthModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setShowAuthModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card rounded-2xl p-8 max-w-md w-full border border-[var(--border-color)]"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[var(--text-primary)] gaming-font">{t('login')}</h3>
              <button
                onClick={() => setShowAuthModal(false)}
                className="p-2 rounded-lg hover:bg-[var(--bg-primary)] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-[var(--text-secondary)]" />
              </button>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => handleLogin('google')}
                className="w-full flex items-center gap-4 p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl hover:border-blue-500 transition-colors group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Chrome className="w-5 h-5 text-blue-500" />
                </div>
                <span className="font-medium text-[var(--text-primary)] group-hover:text-blue-400 transition-colors">
                  {t('googleLogin')}
                </span>
              </button>
              
              <button
                onClick={() => handleLogin('tiktok')}
                className="w-full flex items-center gap-4 p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl hover:border-pink-500 transition-colors group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center">
                  <TikTokIcon className="w-5 h-5 text-pink-500" />
                </div>
                <span className="font-medium text-[var(--text-primary)] group-hover:text-pink-400 transition-colors">
                  {t('tiktokLogin')}
                </span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
