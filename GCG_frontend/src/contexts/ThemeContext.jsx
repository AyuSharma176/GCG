import { createContext, useContext, useState, useLayoutEffect, useCallback } from 'react';

// ─── Theme Definitions ───────────────────────────────────────────────────────
export const THEMES = [
  {
    id: 'ocean-deep',
    name: 'Ocean Deep',
    description: 'Midnight navy — the default',
    dark:   '15 40 84',
    mid:    '28 77 141',
    accent: '73 136 196',
    light:  '189 232 245',
    bodyGrad: 'linear-gradient(160deg, #0F2854 0%, #1C4D8D 55%, #0a1e3d 100%)',
    swatches: ['#0F2854','#1C4D8D','#4988C4','#BDE8F5'],
  },
  {
    id: 'twilight-iris',
    name: 'Twilight Iris',
    description: 'Slate blue meets lavender dusk',
    dark:   '34 44 68',
    mid:    '87 106 143',
    accent: '183 189 247',
    light:  '255 248 222',
    bodyGrad: 'linear-gradient(160deg, #222C44 0%, #576A8F 55%, #1a2238 100%)',
    swatches: ['#222C44','#576A8F','#B7BDF7','#FFF8DE'],
  },
  {
    id: 'terracotta-bloom',
    name: 'Terracotta Bloom',
    description: 'Crimson earth & coastal teal',
    dark:   '44 20 20',
    mid:    '191 70 70',
    accent: '126 172 181',
    light:  '255 244 234',
    bodyGrad: 'linear-gradient(160deg, #2C1414 0%, #5C2020 55%, #1a0a0a 100%)',
    swatches: ['#2C1414','#BF4646','#7EACB5','#FFF4EA'],
  },
  {
    id: 'arctic-slate',
    name: 'Arctic Slate',
    description: 'Ice-cold contrast with ember glow',
    dark:   '18 26 34',
    mid:    '37 52 63',
    accent: '191 201 209',
    light:  '234 239 239',
    bodyGrad: 'linear-gradient(160deg, #121A22 0%, #25343F 55%, #0a1018 100%)',
    swatches: ['#121A22','#25343F','#BFC9D1','#FF9B51'],
  },
  {
    id: 'neon-eclipse',
    name: 'Neon Eclipse',
    description: 'Deep void, electric violet & hot gold',
    dark:   '22 2 54',
    mid:    '69 6 147',
    accent: '140 0 255',
    light:  '255 196 0',
    bodyGrad: 'linear-gradient(160deg, #0d0120 0%, #450693 55%, #08010f 100%)',
    swatches: ['#160236','#450693','#8C00FF','#FFC400'],
  },
  {
    id: 'crimson-teal',
    name: 'Crimson Teal',
    description: 'Dark maroon & deep sea green',
    dark:   '30 12 12',
    mid:    '47 87 85',
    accent: '90 150 144',
    light:  '224 217 217',
    bodyGrad: 'linear-gradient(160deg, #1E0C0C 0%, #2F5755 55%, #0e0606 100%)',
    swatches: ['#1E0C0C','#2F5755','#5A9690','#E0D9D9'],
  },
  {
    id: 'sunset-dust',
    name: 'Sunset Dust',
    description: 'Warm cream, orange dusk & deep umber',
    dark:   '58 30 0',
    mid:    '86 47 0',
    accent: '255 150 68',
    light:  '255 253 241',
    bodyGrad: 'linear-gradient(160deg, #3A1E00 0%, #562F00 55%, #1e0e00 100%)',
    swatches: ['#3A1E00','#562F00','#FF9644','#FFFDF1'],
  },
  {
    id: 'minty-horizon',
    name: 'Minty Horizon',
    description: 'Fresh sage, mint lush & sky calm',
    dark:   '20 48 40',
    mid:    '36 78 60',
    accent: '171 231 178',
    light:  '236 244 232',
    bodyGrad: 'linear-gradient(160deg, #143028 0%, #244E3C 55%, #0c2018 100%)',
    swatches: ['#143028','#244E3C','#ABE7B2','#ECF4E8'],
  },
];

// ─── DOM theme applier ────────────────────────────────────────────────────────
export function applyTheme(theme) {
  const root = document.documentElement;
  root.style.setProperty('--gcg-dark',   theme.dark);
  root.style.setProperty('--gcg-mid',    theme.mid);
  root.style.setProperty('--gcg-accent', theme.accent);
  root.style.setProperty('--gcg-light',  theme.light);
  const toHex = (rgb) => rgb.split(' ').map(v => parseInt(v).toString(16).padStart(2,'0')).join('');
  root.style.setProperty('--gcg-dark-hex',   `#${toHex(theme.dark)}`);
  root.style.setProperty('--gcg-mid-hex',    `#${toHex(theme.mid)}`);
  root.style.setProperty('--gcg-accent-hex', `#${toHex(theme.accent)}`);
  root.style.setProperty('--gcg-light-hex',  `#${toHex(theme.light)}`);
  document.body.style.background = theme.bodyGrad;
}

// ─── Convenience helpers ─────────────────────────────────────────────────────
export const t = {
  dark:   (a = 1) => `rgb(var(--gcg-dark)   / ${a})`,
  mid:    (a = 1) => `rgb(var(--gcg-mid)    / ${a})`,
  accent: (a = 1) => `rgb(var(--gcg-accent) / ${a})`,
  light:  (a = 1) => `rgb(var(--gcg-light)  / ${a})`,
  gradBtn:     () => `linear-gradient(135deg, rgb(var(--gcg-mid)), rgb(var(--gcg-accent)))`,
  gradCard:    () => `linear-gradient(135deg, rgb(var(--gcg-mid) / 0.45), rgb(var(--gcg-dark) / 0.7))`,
  gradText:    () => `linear-gradient(90deg, rgb(var(--gcg-accent)), rgb(var(--gcg-light)))`,
  gradBody:    () => `linear-gradient(160deg, rgb(var(--gcg-dark)) 0%, rgb(var(--gcg-mid)) 50%, rgb(var(--gcg-dark) / 0.7) 100%)`,
  borderCard:  () => `1px solid rgb(var(--gcg-accent) / 0.3)`,
  borderHover: () => `1px solid rgb(var(--gcg-light)  / 0.4)`,
  shadowCard:  () => `0 4px 24px rgb(var(--gcg-dark) / 0.5), inset 0 1px 0 rgb(var(--gcg-light) / 0.08)`,
  shadowBtn:   () => `0 0 24px rgb(var(--gcg-accent) / 0.4)`,
  shadowHover: () => `0 0 40px rgb(var(--gcg-accent) / 0.18), 0 8px 32px rgb(var(--gcg-dark) / 0.6)`,
};

// ─── Context ─────────────────────────────────────────────────────────────────
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(() => {
    return localStorage.getItem('gcg-theme') || 'ocean-deep';
  });

  const theme = THEMES.find(th => th.id === themeId) || THEMES[0];

  useLayoutEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const switchTheme = useCallback((id) => {
    setThemeId(id);
    localStorage.setItem('gcg-theme', id);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, themes: THEMES, switchTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
