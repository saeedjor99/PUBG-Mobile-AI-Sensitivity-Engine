import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Search, Smartphone, Tablet, Check, ChevronDown, Cpu, X } from 'lucide-react';
import { DEVICE_DATABASE } from '../data';
import { useStore } from '../store';
import type { DeviceInfo } from '../store';

export default function DeviceSelector() {
  const { t } = useTranslation();
  const { deviceInfo, setDeviceInfo } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');

  const brands = ['all', ...Array.from(new Set(DEVICE_DATABASE.map(d => d.brand)))];

  const filteredDevices = DEVICE_DATABASE.filter(d => {
    const matchesSearch = d.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         d.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = selectedBrand === 'all' || d.brand === selectedBrand;
    return matchesSearch && matchesBrand;
  });

  const handleSelectDevice = (device: typeof DEVICE_DATABASE[0]) => {
    const screenW = window.screen.width;
    const screenH = window.screen.height;
    const dpr = window.devicePixelRatio || 1;
    const resolution = `${screenW * dpr}x${screenH * dpr}`;
    const refreshRate = device.refreshRate;
    const fps = Math.min(refreshRate, device.fps);
    const gyroscope = 'DeviceOrientationEvent' in window;
    const heatStatus = 'Normal';
    const inputLatency = Math.round(1000 / device.touchSampling * 10) / 10;
    const os = device.brand === 'Apple' ? 'iOS 17' : 'Android 14';
    const screenRatio = screenW / screenH;

    const newDevice: DeviceInfo = {
      model: device.model,
      brand: device.brand,
      cpu: device.cpu,
      gpu: device.gpu,
      ram: device.ram,
      resolution,
      refreshRate,
      fps,
      touchSampling: device.touchSampling,
      gyroscope,
      heatStatus,
      inputLatency,
      os,
      tier: device.tier,
      powerScore: device.powerScore,
      screenRatio,
    };

    setDeviceInfo(newDevice);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 neon-border"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Cpu className="w-5 h-5 text-[var(--accent)]" />
          <h3 className="text-lg font-bold text-[var(--text-primary)] gaming-font">
            {t('deviceInfo')}
          </h3>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors cursor-pointer"
        >
          <Smartphone className="w-4 h-4" />
          <span>{isOpen ? (t('cancel') || 'Cancel') : (t('changeDevice') || 'Change Device')}</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Current Device */}
      {deviceInfo && !isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-4 p-4 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)]"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent)] to-orange-600 flex items-center justify-center shrink-0">
            {deviceInfo.model.includes('iPad') ? (
              <Tablet className="w-6 h-6 text-white" />
            ) : (
              <Smartphone className="w-6 h-6 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-[var(--text-primary)] truncate">{deviceInfo.model}</div>
            <div className="text-xs text-[var(--text-secondary)]">
              {deviceInfo.cpu} · {deviceInfo.ram} · {deviceInfo.refreshRate}Hz
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-lg font-bold gaming-font text-[var(--accent)]">{deviceInfo.powerScore}</div>
            <div className="text-[10px] text-[var(--text-secondary)]">{deviceInfo.tier}</div>
          </div>
        </motion.div>
      )}

      {/* Device Selector Panel */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search devices..."
              className="w-full pl-10 pr-10 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-[var(--accent)] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)]" />
              </button>
            )}
          </div>

          {/* Brand Filters */}
          <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-thin pb-2">
            {brands.map(brand => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedBrand === brand
                    ? 'bg-[var(--accent)] text-white'
                    : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-[var(--accent)]/50'
                }`}
              >
                {brand === 'all' ? 'All Brands' : brand}
              </button>
            ))}
          </div>

          {/* Device Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto scrollbar-thin pr-1">
            {filteredDevices.map((device, i) => {
              const isSelected = deviceInfo?.model === device.model;
              const isIPad = device.model.includes('iPad');

              return (
                <motion.button
                  key={device.model}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.3) }}
                  onClick={() => handleSelectDevice(device)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer relative z-10 ${
                    isSelected
                      ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                      : 'border-[var(--border-color)] bg-[var(--bg-primary)] hover:border-[var(--accent)]/50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-[var(--accent)]/20' : 'bg-[var(--bg-card)]'
                  }`}>
                    {isIPad ? (
                      <Tablet className={`w-5 h-5 ${isSelected ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`} />
                    ) : (
                      <Smartphone className={`w-5 h-5 ${isSelected ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-semibold truncate ${isSelected ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>
                      {device.model}
                    </div>
                    <div className="text-[10px] text-[var(--text-secondary)]">
                      {device.cpu} · {device.ram} · {device.refreshRate}Hz
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`text-sm font-bold gaming-font ${isSelected ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>
                      {device.powerScore}
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[var(--accent)] mx-auto mt-0.5" />}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {filteredDevices.length === 0 && (
            <div className="text-center py-8 text-[var(--text-secondary)] text-sm">
              No devices found
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
