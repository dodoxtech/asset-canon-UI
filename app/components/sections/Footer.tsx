import { REPO, DOCS, S } from "../site"

export function Footer() {
  return (
    <footer className="foot">
      <div className="foot-inner">
        <img
          className="foot-logo"
          src={`${S}/logo-assets-canon-240x72.webp`}
          alt="assets-canon"
          width={100} height={30}
        />
        <p className="foot-text">asset-canon — turn a brief into shippable art.</p>
        <div className="foot-links">
          <a href={REPO} target="_blank" rel="noreferrer" className="foot-link">GitHub</a>
          <a href={DOCS} target="_blank" rel="noreferrer" className="foot-link">Docs</a>
        </div>
      </div>
    </footer>
  )
}
