import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Wifi, WifiOff, Zap, Server, Activity,
  MapPin, Signal, TrendingUp, TrendingDown, Minus,
  CheckCircle, AlertTriangle, Clock
} from 'lucide-react';

interface ServerData {
  id: string;
  name: string;
  nameAr: string;
  region: string;
  regionAr: string;
  host: string;
  ping: number;
  status: 'online' | 'offline' | 'checking';
  packetLoss: number;
  jitter: number;
  history: number[];
  color: string;
}

const SERVERS: Omit<ServerData, 'ping' | 'status' | 'packetLoss' | 'jitter' | 'history'>[] = [
  {
    id: 'jordan',
    name: 'Jordan Server',
    nameAr: 'سيرفر الأردن',
    region: 'Amman, JO',
    regionAr: 'عمان، الأردن',
    host: 'https://www.google.jo',
    color: '#22c55e',
  },
  {
    id: 'me',
    name: 'Middle East',
    nameAr: 'الشرق الأوسط',
    region: 'Dubai, AE',
    regionAr: 'دبي، الإمارات',
    host: 'https://www.google.ae',
    color: '#06b6d4',
  },
  {
    id: 'europe',
    name: 'Europe',
    nameAr: 'أوروبا',
    region: 'Frankfurt, DE',
    regionAr: 'فرانكفورت، ألمانيا',
    host: 'https://www.google.de',
    color: '#f59e0b',
  },
  {
    id: 'asia',
    name: 'Asia',
    nameAr: 'آسيا',
    region: 'Singapore, SG',
    regionAr: 'سنغافورة',
    host: 'https://www.google.sg',
    color: '#d946ef',
  },
];

function measurePing(host: string): Promise<{ ping: number; packetLoss: number }> {
  return new Promise((resolve) => {
    const start = performance.now();
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
      resolve({ ping: 999, packetLoss: 100 });
    }, 5000);

    fetch(host + '/favicon.ico', {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-store',
      signal: controller.signal,
    })
      .then(() => {
        clearTimeout(timeout);
        const ping = Math.round(performance.now() - start);
        resolve({ ping: Math.min(ping, 999), packetLoss: 0 });
      })
      .catch(() => {
        clearTimeout(timeout);
        resolve({ ping: 999, packetLoss: 100 });
      });
  });
}

function getPingColor(ping: number): string {
  if (ping <= 50) return '#22c55e';
  if (ping <= 100) return '#84cc16';
  if (ping <= 150) return '#f59e0b';
  if (ping <= 250) return '#f97316';
  return '#ef4444';
}

function getPingLabel(ping: number, isAr: boolean): string {
  if (ping <= 50) return isAr ? 'ممتاز' : 'Excellent';
  if (ping <= 100) return isAr ? 'جيد جداً' : 'Very Good';
  if (ping <= 150) return isAr ? 'جيد' : 'Good';
  if (ping <= 250) return isAr ? 'متوسط' : 'Fair';
  return isAr ? 'ضعيف' : 'Poor';
}

function getPingIcon(ping: number) {
  if (ping <= 100) return Signal;
  if (ping <= 200) return Wifi;
  if (ping < 999) return WifiOff;
  return AlertTriangle;
}

export default function PingMonitor() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [servers, setServers] = useState<ServerData[]>(
    SERVERS.map(s => ({ ...s, ping: 0, status: 'checking' as const, packetLoss: 0, jitter: 0, history: [] }))
  );
  const [isScanning, setIsScanning] = useState(false);
  const [bestServer, setBestServer] = useState<ServerData | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scanAll = useCallback(async () => {
    setIsScanning(true);
    const results = await Promise.all(
      SERVERS.map(async (server) => {
        const { ping, packetLoss } = await measurePing(server.host);
        const prevHistory = servers.find(s => s.id === server.id)?.history || [];
        const newHistory = [...prevHistory.slice(-19), ping];
        const jitter = newHistory.length > 1
          ? Math.round(
              newHistory.slice(1).reduce((sum, val, i) => sum + Math.abs(val - newHistory[i]), 0) / (newHistory.length - 1)
            )
          : 0;
        return {
          ...server,
          ping,
          status: ping >= 999 ? 'offline' : 'online',
          packetLoss,
          jitter,
          history: newHistory,
        } as ServerData;
      })
    );
    setServers(results);
    const online = results.filter(s => s.status === 'online');
    if (online.length > 0) {
      const best = online.reduce((min, s) => s.ping < min.ping ? s : min);
      setBestServer(best);
    }
    setLastUpdate(new Date().toLocaleTimeString(isAr ? 'ar-JO' : 'en-US'));
    setIsScanning(false);
  }, [isAr, servers]);

  useEffect(() => {
    scanAll();
    intervalRef.current = setInterval(scanAll, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const getTrend = (history: number[]) => {
    if (history.length < 3) return 'stable';
    const recent = history.slice(-3);
    const avgRecent = recent.reduce((a, b) => a + b, 0) / recent.length;
    const avgPrev = history.slice(0, -3).reduce((a, b) => a + b, 0) / Math.max(1, history.length - 3);
    if (avgRecent < avgPrev - 10) return 'down';
    if (avgRecent > avgPrev + 10) return 'up';
    return 'stable';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 neon-border"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] gaming-font">
              {isAr ? 'مراقب البينغ المباشر' : 'Live Ping Monitor'}
            </h3>
            <p className="text-[10px] text-[var(--text-secondary)]">
              {isAr ? 'قياس زمن الاستجابة للسيرفرات' : 'Server latency measurement'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdate && (
            <span className="text-[10px] text-[var(--text-secondary)] flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {lastUpdate}
            </span>
          )}
          <button
            onClick={scanAll}
            disabled={isScanning}
            className="flex items-center gap-2 px-3 py-1.5 bg-[var(--accent)] text-white rounded-lg text-xs font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Zap className={`w-3 h-3 ${isScanning ? 'animate-pulse' : ''}`} />
            {isScanning ? (isAr ? 'جاري الفحص...' : 'Scanning...') : (isAr ? 'فحص الآن' : 'Scan Now')}
          </button>
        </div>
      </div>

      {/* Best Server Banner */}
      <AnimatePresence>
        {bestServer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-5"
          >
            <div
              className="rounded-xl p-4 border-2 flex items-center gap-4"
              style={{ borderColor: bestServer.color, backgroundColor: `${bestServer.color}10` }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${bestServer.color}25` }}>
                <CheckCircle className="w-6 h-6" style={{ color: bestServer.color }} />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold uppercase tracking-wider" style={{ color: bestServer.color }}>
                  {isAr ? 'أفضل سيرفر موصى به' : 'Recommended Best Server'}
                </div>
                <div className="text-lg font-bold text-[var(--text-primary)]">
                  {isAr ? bestServer.nameAr : bestServer.name}
                </div>
                <div className="text-xs text-[var(--text-secondary)]">
                  {isAr ? bestServer.regionAr : bestServer.region} · {bestServer.ping}ms · {getPingLabel(bestServer.ping, isAr)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold gaming-font" style={{ color: bestServer.color }}>
                  {bestServer.ping}
                </div>
                <div className="text-[10px] text-[var(--text-secondary)]">ms</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Servers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {servers.map((server, i) => {
          const Icon = getPingIcon(server.ping);
          const pingColor = getPingColor(server.ping);
          const trend = getTrend(server.history);
          const TrendIcon = trend === 'down' ? TrendingDown : trend === 'up' ? TrendingUp : Minus;
          const trendColor = trend === 'down' ? '#22c55e' : trend === 'up' ? '#ef4444' : '#94a3b8';

          return (
            <motion.div
              key={server.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-xl p-4 border transition-all ${
                bestServer?.id === server.id
                  ? 'border-[var(--accent)] bg-[var(--accent)]/5'
                  : 'border-[var(--border-color)] bg-[var(--bg-primary)]'
              }`}
            >
              {bestServer?.id === server.id && (
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}

              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${server.color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: server.color }} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-[var(--text-primary)]">
                    {isAr ? server.nameAr : server.name}
                  </div>
                  <div className="text-[10px] text-[var(--text-secondary)]">
                    {isAr ? server.regionAr : server.region}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold gaming-font" style={{ color: pingColor }}>
                    {server.status === 'checking' ? '...' : server.ping >= 999 ? '×' : server.ping}
                  </div>
                  <div className="text-[10px] text-[var(--text-secondary)]">ms</div>
                </div>
              </div>

              {/* Ping History Bar */}
              <div className="flex items-end gap-0.5 h-8 mb-2">
                {server.history.map((val, idx) => {
                  const h = Math.min(100, Math.max(5, (val / 300) * 100));
                  return (
                    <div
                      key={idx}
                      className="flex-1 rounded-sm transition-all"
                      style={{
                        height: `${h}%`,
                        backgroundColor: getPingColor(val),
                        opacity: 0.3 + (idx / server.history.length) * 0.7,
                      }}
                    />
                  );
                })}
              </div>

              {/* Stats Row */}
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1" style={{ color: pingColor }}>
                    <MapPin className="w-3 h-3" />
                    {getPingLabel(server.ping, isAr)}
                  </span>
                  <span className="flex items-center gap-1 text-[var(--text-secondary)]">
                    <TrendIcon className="w-3 h-3" style={{ color: trendColor }} />
                    {server.jitter > 0 ? `±${server.jitter}ms` : '-'}
                  </span>
                </div>
                <span className={`flex items-center gap-1 ${server.packetLoss > 0 ? 'text-red-400' : 'text-green-400'}`}>
                  <Server className="w-3 h-3" />
                  {server.packetLoss > 0 ? `${server.packetLoss}% ${isAr ? 'فقدان' : 'loss'}` : isAr ? 'مستقر' : 'Stable'}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-[10px] text-[var(--text-secondary)]">
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          {isAr ? 'ممتاز <50ms' : 'Excellent <50ms'}
        </span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-lime-500" />
          {isAr ? 'جيد جداً <100ms' : 'Very Good <100ms'}
        </span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          {isAr ? 'جيد <150ms' : 'Good <150ms'}
        </span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-orange-500" />
          {isAr ? 'متوسط <250ms' : 'Fair <250ms'}
        </span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          {isAr ? 'ضعيف >250ms' : 'Poor >250ms'}
        </span>
      </div>
    </motion.div>
  );
}
