import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title as ChartTitle, Tooltip, Filler } from 'chart.js';
import type { DistConfig } from '../wasm/distributions';
import { useWasmDist } from '../hooks/useWasmDist';
import ParamSlider from './ParamSlider';
import Formula from './Formula';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ChartTitle, Tooltip, Filler);

interface Props { config: DistConfig; index: number; onExpand: (c: DistConfig, p: Record<string, number>) => void; }

export default function DistributionCard({ config, index, onExpand }: Props) {
  const [collapsed, setCollapsed] = useState(true);
  const [params, setParams] = useState<Record<string, number>>(() => { const p: Record<string, number> = {}; config.params.forEach(x => { p[x.key] = x.default; }); return p; });
  const { result, loading } = useWasmDist(collapsed ? '' : config.id, params);

  const chartData = useMemo(() => {
    if (!result || result.x.length === 0) return null;
    return { labels: result.x.map((v: number) => config.isDiscrete ? v.toString() : v.toFixed(3)), datasets: [{ data: result.y, borderColor: config.color, backgroundColor: config.isDiscrete ? config.color + '99' : config.color + '33', borderWidth: 2, pointRadius: config.isDiscrete ? 4 : 0, pointHoverRadius: 7, pointBackgroundColor: config.color, fill: config.isDiscrete ? false : 'start', tension: config.isDiscrete ? 0 : 0.3 }] };
  }, [result, config]);
  const chartOptions = useMemo(() => ({
    responsive: true, maintainAspectRatio: false, animation: { duration: 300 }, interaction: { intersect: false, mode: 'index' as const },
    plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(15,15,25,0.9)', titleColor: '#e2e8f0', bodyColor: '#cbd5e1', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1, padding: 10 } },
    scales: { x: { display: true, grid: { display: false }, ticks: { color: '#94a3b8', maxTicksLimit: 8, font: { size: 10 } } }, y: { display: true, grid: { display: false }, ticks: { color: '#94a3b8', maxTicksLimit: 5, font: { size: 10 } }, beginAtZero: true } },
  }), [config]);

  return (
    <motion.div className={`card regulation-card ${config.regClass}`} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}>
      <div className="card-header-row">
        <span className="regulation-card__title m-0">{config.name}</span>
        <span className="badge badge--regulation">{config.isDiscrete ? 'Discrete' : 'Continuous'}</span>
        <div className="flex-row gap-1 ml-auto">
          <button className="btn btn-ghost btn-icon" onClick={e => { e.stopPropagation(); onExpand(config, params); }} title="Fullscreen">
            <span className="icon icon--sm"><svg viewBox="0 0 24 24"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg></span>
          </button>
          <button className="btn btn-ghost btn-icon" onClick={e => { e.stopPropagation(); setCollapsed(c => !c); }} title={collapsed ? 'Expand' : 'Collapse'}>
            <motion.span className="icon icon--sm" animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.25 }}>
              <svg viewBox="0 0 24 24"><path d="M7 9l5 5 5-5"/></svg>
            </motion.span>
          </button>
        </div>
      </div>
      <div className="mb-2"><Formula latex={config.formula} /></div>

      {!collapsed && (<>
        <div className="chart-wrap">
          {loading && <div className="chart-wrap__loading"><div className="spinner spinner--lg"/></div>}
          {chartData && !loading && <div className="chart-wrap__inner">{config.isDiscrete ? <Bar data={chartData} options={chartOptions}/> : <Line data={chartData} options={chartOptions}/>}</div>}
        </div>
        <div className="flex-col gap-1 mb-3">
          {config.params.map(p => <ParamSlider key={p.key} label={p.label} symbol={p.symbol} value={params[p.key] ?? p.default} min={p.min} max={p.max} step={p.step} onChange={v => setParams(prev => ({ ...prev, [p.key]: v }))}/>)}
        </div>
        <hr className="divider"/>
        <div className="flex-row flex-center gap-3 pt-2">
          <div className="flex-col flex-center"><span className="t-label">Mean</span><span className="t-mono-small stat-value">{result.stats.mean?.toFixed(2) ?? '—'}</span></div>
          <div className="flex-col flex-center"><span className="t-label">Variance</span><span className="t-mono-small stat-value">{result.stats.variance?.toFixed(2) ?? '—'}</span></div>
          <div className="flex-col flex-center"><span className="t-label">Skewness</span><span className="t-mono-small stat-value">{result.stats.skewness?.toFixed(2) ?? '—'}</span></div>
        </div>
      </>)}
      {result.error && !collapsed && <div className="alert alert--error mt-2"><span>{result.error}</span></div>}
    </motion.div>
  );
}
