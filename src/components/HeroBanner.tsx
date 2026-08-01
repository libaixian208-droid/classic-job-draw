interface HeroBannerProps {
  subtitle?: string
}

export function HeroBanner({
  subtitle = '新楓之谷：經典版・十二職二轉。100 級・目前最高二轉。',
}: HeroBannerProps) {
  return (
    <header className="hero">
      <div className="hero__plaque">
        <span className="hero__leaf" aria-hidden="true" />
        <p className="hero__eyebrow">Classic Server · Job Fate</p>
        <h1 className="hero__title">經典服職業命運抽籤</h1>
        <p className="hero__subtitle">{subtitle}</p>
        <div className="hero__ornament" aria-hidden="true">
          <span />
          <span className="hero__diamond" />
          <span />
        </div>
      </div>
    </header>
  )
}
