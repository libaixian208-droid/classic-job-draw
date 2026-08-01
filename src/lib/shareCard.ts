import { JOB_STYLES } from './jobs'
import type { Job, RevealedResult } from '../types'

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}

export async function renderResultCard(options: {
  roomCode: string
  results: RevealedResult[]
}): Promise<Blob> {
  const width = 1080
  const height = 640
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('無法建立分享圖')

  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#1a3a4a')
  gradient.addColorStop(0.55, '#3d6b4f')
  gradient.addColorStop(1, '#c45c26')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  ctx.strokeStyle = 'rgba(244, 228, 196, 0.55)'
  ctx.lineWidth = 4
  roundRect(ctx, 36, 36, width - 72, height - 72, 12)
  ctx.stroke()

  ctx.fillStyle = '#f8f0df'
  ctx.font = '700 54px "ZCOOL XiaoWei", "Noto Serif TC", serif'
  ctx.textAlign = 'center'
  ctx.fillText('經典服職業抽籤結果', width / 2, 120)

  ctx.fillStyle = '#ffe8c8'
  ctx.font = '500 28px "Noto Sans TC", sans-serif'
  ctx.fillText(`房間 ${options.roomCode}`, width / 2, 170)

  const startY = 230
  const rowH = 70
  options.results.forEach((r, i) => {
    const style = JOB_STYLES[r.job as Job]
    const y = startY + i * rowH
    ctx.fillStyle = 'rgba(255, 250, 240, 0.12)'
    roundRect(ctx, 120, y - 36, width - 240, 56, 8)
    ctx.fill()

    ctx.textAlign = 'left'
    ctx.fillStyle = '#f8f0df'
    ctx.font = '600 30px "Noto Sans TC", sans-serif'
    ctx.fillText(`${style.emoji}  ${r.name}`, 150, y)

    ctx.textAlign = 'right'
    ctx.fillStyle = style.accent
    ctx.font = '700 30px "Noto Sans TC", sans-serif'
    ctx.fillText(r.job, width - 150, y)
  })

  ctx.textAlign = 'center'
  ctx.fillStyle = 'rgba(255, 232, 200, 0.75)'
  ctx.font = '400 22px "Noto Sans TC", sans-serif'
  ctx.fillText('CtrlZ Works · draw.ctrlzworks.com', width / 2, height - 70)

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), 'image/png'),
  )
  if (!blob) throw new Error('分享圖產生失敗')
  return blob
}

export async function shareOrDownloadResultCard(options: {
  roomCode: string
  results: RevealedResult[]
}): Promise<'shared' | 'downloaded'> {
  const blob = await renderResultCard(options)
  const file = new File([blob], `classic-job-draw-${options.roomCode}.png`, {
    type: 'image/png',
  })

  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      files: [file],
      title: '經典服職業抽籤結果',
      text: `房間 ${options.roomCode} 抽籤結果`,
    })
    return 'shared'
  }

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = file.name
  a.click()
  URL.revokeObjectURL(url)
  return 'downloaded'
}
