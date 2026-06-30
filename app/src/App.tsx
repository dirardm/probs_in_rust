import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DISTRIBUTIONS, type DistConfig } from './wasm/distributions';
import { initWasm } from './hooks/useWasmDist';
import ThemeSwitcher from './components/ThemeSwitcher';
import DistributionCard from './components/DistributionCard';
import DistributionModal from './components/DistributionModal';
import HelpModal from './components/HelpModal';
import markSvg from './assets/mark.svg';
import logoCompact from './assets/logo_vertical_compact.svg';
import logoCompactDark from './assets/logo_vertical_compact_dark.svg';
import { useTheme } from './context/ThemeContext';

function RustIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1C9.5 1 7.3 1.5 5.6 2.4l.4.7c.4-.2.9-.4 1.5-.6.8-.2 1.6-.3 2.5-.3 1.1 0 2.1.2 3 .5.9.3 1.6.8 2.2 1.4l.6-.4c-.7-.7-1.5-1.2-2.5-1.6S13.2 1 12 1zm4.8 2.2l-.3.7c1.2.8 2.1 1.9 2.7 3.2l.8-.3c-.6-1.4-1.6-2.6-3.2-3.6zM7.2 3.2l-.4-.7C5.1 3.6 3.8 5.1 3 7l.7.3c.7-1.1 1.7-2 3.5-2.5v-.6zm-3.4 5l-.7-.3c-.5 1.3-.8 2.7-.8 4.1h.8c0-1.3.2-2.6.7-3.8zm16.4 0c.5 1.2.7 2.5.7 3.8H22c0-1.4-.2-2.8-.7-4.1l-.7.3zm-4.6 8.4l.5.6c1.2-.7 2.2-1.6 3-2.7l-.7-.4c-.7 1-1.6 1.8-2.8 2.5zm-6.8 0c-1.2-.7-2.1-1.5-2.8-2.5l-.7.4c.8 1.1 1.8 2 3 2.7l.5-.6zm4.6 1.5l-.4-.7c-.5.3-1 .5-1.6.7-.8.2-1.6.3-2.4.3-1.1 0-2.1-.2-3-.5-.9-.3-1.6-.7-2.2-1.3l-.6.5c.7.7 1.5 1.2 2.6 1.6 1 .3 2.1.5 3.2.5 1.1 0 2.1-.1 3-.4.8-.2 1.5-.5 2-.8l.4.7c-.6.4-1.4.7-2.4 1-.9.2-2 .3-3 .3-1.3 0-2.5-.2-3.6-.6-1.1-.4-2-1-2.7-1.7l-.5.6c.8.8 1.8 1.4 3 1.8L7.5 23l.3-.8c-1.1-.4-2-1-2.8-1.7l-.5.6c.9.8 2 1.4 3.2 1.8l.2.8h.8l.1-.8C9.9 23.9 11 24 12 24c1 0 2.1-.1 3.1-.3l.1.8h.8l.2-.8c1.2-.4 2.3-.9 3.2-1.8l-.5-.6c-.8.7-1.7 1.3-2.8 1.7l.3.8-1.2.4c-1.2.4-2.5.5-3.8.5-1.3 0-2.6-.2-3.7-.7zM5.6 20.7l-.4.6c1.4 1.1 3.3 1.9 5.4 2H12zm12.8 0c1.1-.7 2.1-1.5 2.9-2.6l-.5-.6c-.7.9-1.6 1.7-2.8 2.4l.4.8zM12 6c-1.8 0-3.3.6-4.5 1.8-1.2 1.2-1.8 2.7-1.8 4.5 0 1.8.6 3.3 1.8 4.5C8.7 17.9 10.2 18.5 12 18.5s3.3-.6 4.5-1.8c1.2-1.2 1.8-2.7 1.8-4.5 0-1.8-.6-3.3-1.8-4.5C15.3 6.6 13.8 6 12 6z"/>
    </svg>
  );
}
function WasmIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6.17l-2.45 9.66h-1.9l-1.5-6.24-1.5 6.24H6.95L4.5 8.17h1.8l1.3 6.2 1.55-6.2h1.7l1.55 6.2 1.3-6.2h1.8z"/>
    </svg>
  );
}

export default function App() {
  const { mode } = useTheme();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<DistConfig | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modal, setModal] = useState<{ config: DistConfig; params: Record<string, number> } | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => { initWasm().then(() => setReady(true)).catch(e => setError(e.message)); }, []);
  const handleSelect = useCallback((d: DistConfig) => { setSelected(d); setSidebarOpen(false); }, []);
  const handleExpand = useCallback((c: DistConfig, p: Record<string, number>) => setModal({ config: c, params: p }), []);

  if (!ready && !error) return (
    <div className="flex-center loading-screen">
      <div className="spinner spinner--lg spinner--centered"/>
    </div>
  );

  return (
    <div className="app-shell">
      <aside className={`sidebar${sidebarOpen ? ' sidebar--expanded' : ''}`}>
        <div className="sidebar__brand">
          <img src={markSvg} alt="ObligaI" className="sidebar-brand-mark" />
          <img src={mode === 'dark' ? logoCompactDark : logoCompact} alt="ObligaI" className="sidebar-brand-logo" />
        </div>
        <div className="sidebar__group">Continuous</div>
        <nav className="sidebar__nav">
          {DISTRIBUTIONS.filter(d => !d.isDiscrete).map(d => (
            <button key={d.id} className={`nav-item ${d.tClass}${selected?.id === d.id ? ' is-active' : ''}`} onClick={() => handleSelect(d)}>
              <span className="icon icon--sm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d={d.shape}/></svg></span>
              <span className="nav-item__label">{d.name}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar__group">Discrete</div>
        <nav className="sidebar__nav">
          {DISTRIBUTIONS.filter(d => d.isDiscrete).map(d => (
            <button key={d.id} className={`nav-item ${d.tClass}${selected?.id === d.id ? ' is-active' : ''}`} onClick={() => handleSelect(d)}>
              <span className="icon icon--sm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d={d.shape}/></svg></span>
              <span className="nav-item__label">{d.name}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar__footer">
          <div className="flex-col gap-2">
            <div className="flex-row gap-2 sidebar-footer-icons">
              <span className="icon icon--sm rust-icon"><RustIcon/></span>
              <span className="icon icon--sm rust-icon"><WasmIcon/></span>
            </div>
            <span className="t-caption sidebar-footer-text">Coded in <a href="https://www.rust-lang.org" target="_blank" rel="noopener">Rust</a> + <a href="https://webassembly.org" target="_blank" rel="noopener">WASM</a></span>
          </div>
        </div>
      </aside>

      <header className="topbar">
        <div className="topbar__left">
          <button className="btn btn-ghost btn-icon" onClick={() => setSidebarOpen(o => !o)} title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}>
            <span className="icon">{sidebarOpen
              ? <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
              : <svg viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            }</span>
          </button>
          <h1 className="t-h4 m-0">Probability Distributions</h1>
        </div>
        <div className="topbar__right">
          <button className="btn btn-ghost btn-icon" onClick={() => setHelpOpen(true)} title="Help">
            <span className="icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>
          </button>
          <ThemeSwitcher/>
        </div>
      </header>

      <main className="app-shell__content">
        {error && <div className="alert alert--error mb-4"><span>{error}</span></div>}
        {!selected && (
          <div className="empty-state">
            <div className="empty-state__icon"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor"><circle cx="24" cy="24" r="20"/><path d="M24 14v20M14 24h20"/></svg></div>
            <h2 className="empty-state__title">Select a Distribution</h2>
            <p className="empty-state__body">Choose a distribution from the sidebar to explore its probability density function, adjust parameters, and view key statistics — all computed in Rust via WebAssembly.</p>
          </div>
        )}
        {selected && (
          <motion.div className="content-card-wrap" key={selected.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <DistributionCard config={selected} index={0} onExpand={handleExpand}/>
          </motion.div>
        )}
        <AnimatePresence>{modal && <DistributionModal config={modal.config} params={modal.params} onClose={() => setModal(null)} onParamChange={(k, v) => setModal(prev => prev ? { ...prev, params: { ...prev.params, [k]: v } } : null)}/>}</AnimatePresence>
        <AnimatePresence>{helpOpen && <HelpModal onClose={() => setHelpOpen(false)}/>}</AnimatePresence>
      </main>
    </div>
  );
}
