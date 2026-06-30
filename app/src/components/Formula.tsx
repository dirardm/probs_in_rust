import { useEffect, useRef } from 'react';
import katex from 'katex';

export default function Formula({ latex, displayMode = false }: { latex: string; displayMode?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => { if (ref.current) katex.render(latex, ref.current, { displayMode, throwOnError: false, trust: true }); }, [latex, displayMode]);
  return <span ref={ref} className="formula" />;
}
