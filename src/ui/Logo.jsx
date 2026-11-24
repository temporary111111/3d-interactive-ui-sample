export function Logo({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="7.2" stroke="currentColor" strokeWidth="1.1" opacity="0.9" />
      <ellipse
        cx="20"
        cy="20"
        rx="16.5"
        ry="6"
        stroke="currentColor"
        strokeWidth="0.9"
        opacity="0.5"
        transform="rotate(-28 20 20)"
      />
      <ellipse
        cx="20"
        cy="20"
        rx="16.5"
        ry="6"
        stroke="currentColor"
        strokeWidth="0.9"
        opacity="0.28"
        transform="rotate(38 20 20)"
      />
      <circle cx="33.6" cy="14.2" r="1.7" fill="var(--accent, #5eead4)" />
      <circle cx="20" cy="20" r="2" fill="currentColor" />
    </svg>
  )
}
