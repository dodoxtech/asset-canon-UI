import GameStage from "./game/GameStage"
import FallbackContent from "./game/ui/FallbackContent"

export default function Home() {
  return (
    <>
      {/* Semantic, server-rendered page: the source of truth for SEO/assistive
          tech and the target of the "Skip quest" / JS-off path. It sits in normal
          flow underneath the fixed game stage, which covers it during play. */}
      <FallbackContent />
      {/* With JS off the game never boots, so hide the dark stage and let the
          fallback (and page scroll) take over. */}
      <noscript>
        <style>{`.stage-container{display:none!important}body{overflow:auto!important}.reading-toggle{display:none!important}`}</style>
      </noscript>
      <GameStage />
    </>
  )
}
