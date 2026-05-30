import { useTranslation } from 'react-i18next';
import { TikTokIcon, InstagramIcon, Gamepad2 } from './CustomIcons';

export default function Navbar() {
  const { t } = useTranslation();
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="gaming-font text-sm font-bold tracking-wider text-[var(--accent)]">
              ALYAZOURI
            </h1>
            <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest">
              {t('appName')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <a
            href="https://tiktok.com/@saeedalyazouri0"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent)] transition-all group"
          >
            <TikTokIcon className="w-4 h-4 text-white group-hover:text-[var(--accent)] transition-colors" />
            <span className="text-xs font-medium hidden sm:inline">saeedalyazouri0</span>
          </a>
          <a
            href="https://instagram.com/saeedjor11"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-pink-500 transition-all group"
          >
            <InstagramIcon className="w-4 h-4 text-white group-hover:text-pink-500 transition-colors" />
            <span className="text-xs font-medium hidden sm:inline">saeedjor11</span>
          </a>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)]">
            <Gamepad2 className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-xs font-medium">5744469523</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
