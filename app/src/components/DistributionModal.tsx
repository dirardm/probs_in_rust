import { useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title as ChartTitle, Tooltip, Filler } from 'chart.js';
import type { DistConfig } from '../wasm/distributions';
import { useWasmDist } from '../hooks/useWasmDist';
import ParamSlider from './ParamSlider';
import Formula from './Formula';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ChartTitle, Tooltip, Filler);

interface Props { config: DistConfig; params: Record<string, number>; onClose: () => void; onParamChange: (k: string, v: number) => void; }

export default function DistributionModal({ config, params, onClose, onParamChange }: Props) {
  const { result, loading } = useWasmDist(config.id, params, 200);
  useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = ''; }; }, []);
  useEffect(() => { const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); }; window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h); }, [onClose]);

  const chartData = useMemo(() => {
    if (!result || result.x.length === 0) return null;
    return { labels: result.x.map((v: number) => config.isDiscrete ? v.toString() : v.toFixed(3)), datasets: [{ data: result.y, borderColor: config.color, backgroundColor: config.isDiscrete ? config.color + 'cc' : config.color + '44', borderWidth: 3, pointRadius: config.isDiscrete ? 6 : 0, pointHoverRadius: 9, pointBackgroundColor: config.color, fill: config.isDiscrete ? false : 'start', tension: config.isDiscrete ? 0 : 0.3 }] };
  }, [result, config]);
  const chartOptions = useMemo(() => ({
    responsive: true, maintainAspectRatio: false, animation: { duration: 400 }, interaction: { intersect: false, mode: 'index' as const },
    plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(15,15,25,0.95)', titleColor: '#e2e8f0', bodyColor: '#cbd5e1', borderColor: 'rgba(255,255,255,0.15)', borderWidth: 1, padding: 12 } },
    scales: { x: { grid: { display: false }, ticks: { color: '#94a3b8', maxTicksLimit: 12, font: { size: 11 } } }, y: { grid: { display: false }, ticks: { color: '#94a3b8', maxTicksLimit: 6, font: { size: 11 } }, beginAtZero: true } },
  }), [config]);

  return (
    <motion.div className="modal-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className={`modal modal--wide ${config.regClass}`} initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} transition={{ duration: 0.3, ease: [0.25,0.46,0.45,0.94] }} onClick={e => e.stopPropagation()}>
        <div className="flex-row gap-3 mb-2">
          <h2 className="modal__title m-0">{config.name} Distribution</h2>
          <span className="badge badge--regulation">{config.isDiscrete ? 'Discrete' : 'Continuous'}</span>
        </div>
        <div className="mb-2"><Formula latex={config.formula} displayMode/></div>
        <div className="modal__body">{config.description}</div>
        <div className="modal-chart">
          {loading && <div className="chart-wrap__loading"><div className="spinner spinner--lg"/></div>}
          {chartData && !loading && <div className="chart-wrap__inner">{config.isDiscrete ? <Bar data={chartData} options={chartOptions}/> : <Line data={chartData} options={chartOptions}/>}</div>}
        </div>
        <div className="form-row">
          {config.params.map(p => <ParamSlider key={p.key} label={p.label} symbol={p.symbol} value={params[p.key] ?? p.default} min={p.min} max={p.max} step={p.step} onChange={v => onParamChange(p.key, v)}/>)}
        </div>
        <hr className="divider mt-4 mb-4"/>
        <div className="flex-row flex-center gap-3">
          <div className="flex-col flex-center"><span className="t-label">Mean</span><span className="t-mono-small t-accent">{result.stats.mean?.toFixed(2) ?? '—'}</span></div>
          <div className="flex-col flex-center"><span className="t-label">Variance</span><span className="t-mono-small t-accent">{result.stats.variance?.toFixed(2) ?? '—'}</span></div>
          <div className="flex-col flex-center"><span className="t-label">Skewness</span><span className="t-mono-small t-accent">{result.stats.skewness?.toFixed(2) ?? '—'}</span></div>
        </div>
        <button className="btn btn-ghost btn-icon modal__close" onClick={onClose} aria-label="Close">
          <span className="icon"><svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg></span>
        </button>
      </motion.div>
    </motion.div>
  );
}
