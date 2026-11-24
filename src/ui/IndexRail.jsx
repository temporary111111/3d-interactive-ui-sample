export function IndexRail({ projects, selected, onSelect }) {
  return (
    <nav className={`rail ${selected ? 'is-hidden' : ''}`} aria-label="Project index">
      {projects.map((project) => (
        <button
          key={project.id}
          className={`rail__item ${selected === project.id ? 'is-active' : ''}`}
          onClick={() => onSelect(project.id)}
          aria-label={`Focus ${project.title}`}
        >
          <span className="rail__label">{project.title}</span>
          <span className="rail__line" />
          <span className="rail__num">{project.index}</span>
        </button>
      ))}
    </nav>
  )
}
