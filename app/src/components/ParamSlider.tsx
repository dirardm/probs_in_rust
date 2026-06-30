import Formula from './Formula';

export default function ParamSlider({ label, symbol, value, min, max, step, onChange }: { label: string; symbol: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <div className="field">
      <div className="flex-row flex-between">
        <span className="t-small"><Formula latex={`${symbol}`} /> — {label}</span>
        <span className="t-mono-small">{Number.isInteger(step) && Number.isInteger(value) ? value : value.toFixed(2)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(parseFloat(e.target.value))} className="param-range" />
    </div>
  );
}
