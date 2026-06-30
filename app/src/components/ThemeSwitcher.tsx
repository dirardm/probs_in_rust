import { useTheme } from '../context/ThemeContext';

export default function ThemeSwitcher() {
  const { mode, toggleMode } = useTheme();
  return (
    <button className="btn btn-ghost btn-icon" onClick={toggleMode} title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
      <span className="icon">
        {mode === 'dark'
          ? <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2m-10-10h2m16 0h2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"/></svg>
          : <svg viewBox="0 0 24 24"><path d="M20 12.79A9 9 0 1111.21 3a7 7 0 007 9.79z"/></svg>
        }
      </span>
    </button>
  );
}
