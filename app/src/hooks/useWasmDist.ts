import { useState, useEffect, useRef, useCallback } from 'react';
import wasmUrl from '../wasm-pkg/prob_dists_wasm_bg.wasm?url';
import { initSync, compute } from '../wasm-pkg/prob_dists_wasm';

export interface Stats { mean: number | null; variance: number | null; skewness: number | null; }
export interface ComputeResult { x: number[]; y: number[]; stats: Stats; is_discrete: boolean; error: string | null; }

let ready = false;
let pending: Promise<void> | null = null;

export async function initWasm(): Promise<void> {
  if (ready) return;
  if (pending) return pending;
  pending = fetch(wasmUrl).then(r => r.arrayBuffer()).then(b => { initSync({ module: b }); ready = true; }).catch(e => { pending = null; throw e; });
  return pending;
}

export function useWasmDist(distribution: string, params: Record<string, number>, numPoints = 200, debounce = 80) {
  const [result, setResult] = useState<ComputeResult>({ x: [], y: [], stats: { mean: null, variance: null, skewness: null }, is_discrete: false, error: null });
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const mounted = useRef<boolean>(true);
  const lp = useRef(params); lp.current = params;

  const run = useCallback(() => {
    if (!ready || !distribution) return;
    setLoading(true);
    const r = JSON.parse(compute(JSON.stringify({ distribution, params: lp.current, num_points: numPoints }))) as ComputeResult;
    if (mounted.current) { setResult(r); setLoading(false); }
  }, [distribution, numPoints]);

  useEffect(() => {
    mounted.current = true;
    if (!distribution) return;
    if (!ready) { initWasm().then(() => { if (mounted.current) run(); }); return () => { mounted.current = false; }; }
    clearTimeout(timer.current);
    timer.current = setTimeout(run, debounce);
    return () => { mounted.current = false; clearTimeout(timer.current); };
  }, [distribution, JSON.stringify(params), numPoints, debounce, run]);

  return { result, loading };
}
