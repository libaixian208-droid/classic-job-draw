interface CelebrationProps {
  active: boolean
}

/** Lightweight CSS confetti / sparkles — no external assets. */
export function Celebration({ active }: CelebrationProps) {
  if (!active) return null

  const pieces = Array.from({ length: 18 }, (_, i) => i)

  return (
    <div className="celebration" aria-hidden="true">
      {pieces.map((i) => (
        <span
          key={i}
          className={`celebration__piece celebration__piece--${i % 6}`}
          style={{
            left: `${6 + (i * 5.2) % 88}%`,
            animationDelay: `${(i % 7) * 0.08}s`,
          }}
        />
      ))}
    </div>
  )
}
