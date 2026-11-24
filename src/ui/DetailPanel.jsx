import { useEffect, useRef, useState } from 'react'

function Arrow({ direction = 'right' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={direction === 'left' ? 'flip' : ''}
    >
      <path d="M4 12h15" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export function DetailPanel({ project, count, onClose, onNavigate }) {
  const last = useRef(null)
  if (project) last.current = project
  const p = project || last.current

  const [sent, setSent] = useState(false)

  useEffect(() => {
    setSent(false)
  }, [project?.id])

  useEffect(() => {
    if (!sent) return
    const id = setTimeout(() => setSent(false), 2600)
    return () => clearTimeout(id)
  }, [sent])

  if (!p) return null

  const open = Boolean(project)

  return (
    <aside
      className={`panel ${open ? 'is-open' : ''}`}
      role="dialog"
      aria-label={`${p.title} project details`}
      aria-hidden={!open}
    >
      <div className="panel__scroll">
        <div className="panel__head">
          <span className="panel__kicker">
            <i />
            PROJECT {p.index} / {p.kind.toUpperCase()}
          </span>
          <button className="panel__close" onClick={onClose} aria-label="Close project">
            <CloseIcon />
            <span>ESC</span>
          </button>
        </div>

        <div key={p.id} className="panel__body">
          <h2 className="panel__title">{p.title}</h2>
          <p className="panel__subtitle">{p.subtitle}</p>

          <div className="panel__meta">
            <div>
              <span>YEAR</span>
              <b>{p.year}</b>
            </div>
            <div>
              <span>ROLE</span>
              <b>{p.role}</b>
            </div>
            <div>
              <span>CLIENT</span>
              <b>{p.client}</b>
            </div>
          </div>

          <p className="panel__desc">{p.description}</p>

          <div className="panel__tags">
            {p.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>

          <div className="panel__metrics">
            {p.metrics.map((metric) => (
              <div key={metric.label}>
                <b>{metric.value}</b>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>

          <button className={`panel__cta ${sent ? 'is-sent' : ''}`} onClick={() => setSent(true)}>
            <span>{sent ? 'REQUEST QUEUED' : 'OPEN CASE STUDY'}</span>
            <Arrow />
          </button>
        </div>

        <div className="panel__nav">
          <button onClick={() => onNavigate(-1)} aria-label="Previous project">
            <Arrow direction="left" />
            <span>PREV</span>
          </button>
          <span className="panel__count">
            {p.index} <i>/</i> {String(count).padStart(2, '0')}
          </span>
          <button onClick={() => onNavigate(1)} aria-label="Next project">
            <span>NEXT</span>
            <Arrow />
          </button>
        </div>
      </div>
    </aside>
  )
}
