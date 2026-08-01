const LEAVES = Array.from({ length: 10 }, (_, i) => i)

/** Original CSS/SVG scenery — not official game art. */
export function AdventureBackdrop() {
  return (
    <div className="app-bg" aria-hidden="true">
      <div className="app-bg__sky" />
      <div className="app-bg__sun" />
      <div className="app-bg__cloud app-bg__cloud--a" />
      <div className="app-bg__cloud app-bg__cloud--b" />
      <div className="app-bg__cloud app-bg__cloud--c" />
      <div className="app-bg__hills" />
      <div className="app-bg__trees" />
      <div className="app-bg__pixels" />
      <div className="app-bg__leaves">
        {LEAVES.map((i) => (
          <span
            key={i}
            className={`maple-leaf maple-leaf--${i % 5}`}
            style={{
              left: `${4 + ((i * 9.7) % 90)}%`,
              animationDelay: `${(i % 8) * 0.7}s`,
              animationDuration: `${10 + (i % 5) * 1.4}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
