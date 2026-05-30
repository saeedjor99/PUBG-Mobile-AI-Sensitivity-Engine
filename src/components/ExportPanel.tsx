import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { Copy, Check, Download, Share2, FileText, Image, QrCode } from 'lucide-react';
import { useStore } from '../store';
import { generateSensitivityCode, generateHUDCode } from '../utils';
import { QRCodeSVG } from 'qrcode.react';

export default function ExportPanel() {
  const { t } = useTranslation();
  const { sensitivity, hudLayout, analytics } = useStore();
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  
  if (!sensitivity || !analytics) return null;
  
  const sensCode = generateSensitivityCode(sensitivity);
  const hudCode = hudLayout ? generateHUDCode(hudLayout) : '';
  const fullCode = `${sensCode}\n${hudCode}`;
  
  const copyCode = () => {
    navigator.clipboard.writeText(fullCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const downloadPNG = async () => {
    const html2canvas = (await import('html2canvas')).default;
    if (panelRef.current) {
      const canvas = await html2canvas(panelRef.current, { backgroundColor: '#0a0a0f' });
      const link = document.createElement('a');
      link.download = 'pubg-sensitivity.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };
  
  const downloadPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('PUBG Mobile AI Sensitivity', 20, 30);
    doc.setFontSize(12);
    let y = 50;
    
    doc.text('Camera Sensitivity:', 20, y);
    y += 10;
    Object.entries(sensitivity.camera).forEach(([k, v]) => {
      doc.text(`${k}: ${v}%`, 30, y);
      y += 7;
    });
    
    y += 5;
    doc.text('ADS Sensitivity:', 20, y);
    y += 10;
    Object.entries(sensitivity.ads).forEach(([k, v]) => {
      doc.text(`${k}: ${v}%`, 30, y);
      y += 7;
    });
    
    y += 5;
    doc.text('Gyroscope Camera:', 20, y);
    y += 10;
    Object.entries(sensitivity.gyroCamera).forEach(([k, v]) => {
      doc.text(`${k}: ${v}%`, 30, y);
      y += 7;
    });
    
    y += 5;
    doc.text(`Overall Score: ${analytics.overallScore}/100`, 20, y);
    
    doc.save('pubg-sensitivity.pdf');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 neon-border"
    >
      <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 gaming-font">
        {t('export')}
      </h3>
      
      <div ref={panelRef} className="bg-[var(--bg-primary)] rounded-xl p-4 border border-[var(--border-color)] mb-4">
        <div className="text-xs text-[var(--text-secondary)] mb-2 uppercase tracking-wider">{t('exportCode')}</div>
        <div className="font-mono text-xs text-[var(--accent)] break-all bg-[var(--bg-card)] p-3 rounded-lg border border-[var(--border-color)]">
          {fullCode}
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={copyCode}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-primary)] hover:border-[var(--accent)] transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copied ? t('copied') : t('copy')}
          </button>
          <button
            onClick={() => setShowQR(!showQR)}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-primary)] hover:border-[var(--accent)] transition-colors cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            {t('qrCode')}
          </button>
        </div>
        
        {showQR && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 flex justify-center"
          >
            <div className="bg-white p-4 rounded-xl">
              <QRCodeSVG value={fullCode} size={160} />
            </div>
          </motion.div>
        )}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          onClick={downloadPDF}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] hover:border-red-500 transition-colors cursor-pointer"
        >
          <FileText className="w-4 h-4 text-red-400" />
          <span className="hidden sm:inline">{t('exportPDF')}</span>
        </button>
        <button
          onClick={downloadPNG}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] hover:border-blue-500 transition-colors cursor-pointer"
        >
          <Image className="w-4 h-4 text-blue-400" />
          <span className="hidden sm:inline">{t('exportPNG')}</span>
        </button>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: 'PUBG Sensitivity', text: fullCode });
            }
          }}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] hover:border-green-500 transition-colors cursor-pointer"
        >
          <Share2 className="w-4 h-4 text-green-400" />
          <span className="hidden sm:inline">{t('share')}</span>
        </button>
        <button
          onClick={copyCode}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] hover:border-[var(--accent)] transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4 text-[var(--accent)]" />
          <span className="hidden sm:inline">{t('save')}</span>
        </button>
      </div>
    </motion.div>
  );
}
