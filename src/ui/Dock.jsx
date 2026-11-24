import { PALETTES, THEME_ORDER } from '../palettes.js'

function ResetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 12a8.5 8.5 0 1 0 2.7-6.2L3 9" />
      <path d="M3 3.8V9h5.2" />
    </svg>
  )
}

function OrbitIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="12" cy="12" r="3.1" />
      <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(-25 12 12)" opacity="0.7" />
      <circle cx="19.4" cy="8" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function Dock({ themeKey, onTheme, autoRotate, onToggleRotate, onReset }) {
  return (
    <div className="dock" role="toolbar" aria-label="Scene controls">
      <button className="dock__btn" onClick={onReset} aria-label="Reset view" title="Reset view (R)">
        <ResetIcon />
      </button>

      <span className="dock__sep" />

      <div className="swatches" role="group" aria-label="Color theme">
        {THEME_ORDER.map((key) => (
          <button
            key={key}
            className={`swatch ${themeKey === key ? 'is-active' : ''}`}
            style={{ background: PALETTES[key].swatch }}
            onClick={() => onTheme(key)}
            aria-label={`${PALETTES[key].name} theme`}
            aria-pressed={themeKey === key}
            title={PALETTES[key].name}
          />
        ))}
      </div>

      <span className="dock__sep" />

      <button
        className={`dock__btn dock__btn--auto ${autoRotate ? 'is-on' : ''}`}
        onClick={onToggleRotate}
        aria-pressed={autoRotate}
        aria-label="Toggle auto orbit"
        title="Auto orbit"
      >
        <OrbitIcon />
      </button>
    </div>
  )
}
