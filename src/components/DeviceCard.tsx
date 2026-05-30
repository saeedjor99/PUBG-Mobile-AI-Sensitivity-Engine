import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Smartphone, Cpu, HardDrive, Monitor, Zap, Thermometer, Gauge, Activity } from 'lucide-react';
import type { DeviceInfo } from '../store';
import { getTierColor } from '../utils';

interface Props {
  device: DeviceInfo;
}

export default function DeviceCard({ device }: Props) {
  const { t } = useTranslation();
  
  const stats = [
    { icon: Cpu, label: t('cpu'), value: device.cpu },
    { icon: Activity, label: t('gpu'), value: device.gpu },
    { icon: HardDrive, label: t('ram'), value: device.ram },
    { icon: Monitor, label: t('resolution'), value: device.resolution },
    { icon: Zap, label: t('refreshRate'), value: `${device.refreshRate}Hz` },
    { icon: Gauge, label: t('fps'), value: `${device.fps} FPS` },
    { icon: Smartphone, label: t('touchSampling'), value: `${device.touchSampling}Hz` },
    { icon: Thermometer, label: t('deviceHeat'), value: device.heatStatus },
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 neon-border"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-[var(--text-primary)]">{t('detectedDevice')}</h3>
          <p className="text-2xl font-bold gaming-font text-[var(--accent)] mt-1">{device.model}</p>
          <p className="text-sm text-[var(--text-secondary)]">{device.brand} · {device.os}</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">{t('powerScore')}</div>
          <div className="text-3xl font-bold gaming-font" style={{ color: getTierColor(device.tier) }}>
            {device.powerScore}
          </div>
          <div className="text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block" 
               style={{ backgroundColor: `${getTierColor(device.tier)}20`, color: getTierColor(device.tier) }}>
            {device.tier}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[var(--bg-primary)] rounded-xl p-3 border border-[var(--border-color)]"
          >
            <stat.icon className="w-4 h-4 text-[var(--accent)] mb-1" />
            <div className="text-[10px] text-[var(--text-secondary)] uppercase">{stat.label}</div>
            <div className="text-xs font-semibold text-[var(--text-primary)] truncate">{stat.value}</div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-4 flex items-center gap-4">
        <div className="flex-1">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[var(--text-secondary)]">{t('gyroscope')}</span>
            <span className={device.gyroscope ? 'text-green-500' : 'text-red-500'}>
              {device.gyroscope ? t('enabled') : t('disabled')}
            </span>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[var(--text-secondary)]">{t('inputLatency')}</span>
            <span className="text-[var(--accent)]">{device.inputLatency}ms</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
