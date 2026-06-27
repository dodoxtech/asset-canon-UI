import { REPO, DOCS, S } from "../site"

export function Nav() {
  return (
    <header className="nav">
      <div className="nav-inner">
        <img
          className="nav-logo"
          src={`${S}/logo-assets-canon-240x72.webp`}
          alt="assets-canon"
          width={120} height={36}
        />
        <nav className="nav-links" aria-label="Primary">
          <a href={REPO} target="_blank" rel="noreferrer" className="nav-link">GitHub</a>
          <a href={DOCS}  target="_blank" rel="noreferrer" className="nav-link">Docs</a>
        </nav>
        <a href={REPO} target="_blank" rel="noreferrer" className="nav-cta">
          Install ↗
        </a>
      </div>
    </header>
  )
}
