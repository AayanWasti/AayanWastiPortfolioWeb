import { useEffect, useRef } from 'react'

type Star = { x: number; y: number; depth: number; phase: number; twinkleSpeed: number }
type Sprites = { dark: HTMLCanvasElement; light: HTMLCanvasElement; side: number }
type Meteor = { x: number; y: number; age: number }
export default function Universe({ theme }: { theme: 'light' | 'dark' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const themeRef = useRef(theme)
  const refreshTheme = useRef<() => void>(() => {})
  useEffect(() => { themeRef.current = theme; refreshTheme.current() }, [theme])
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    let light = themeRef.current === 'light' ? 1 : 0
    const blend = (dark: number[], bright: number[]) => dark.map((value, i) => Math.round(value + (bright[i] - value) * light)).join(',')
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let width = 0, height = 0, elapsed = 0, previous = 0, frame = 0
    let stars: Star[] = []
    let sprites: Sprites | null = null
    let spriteKey = ''
    const galaxySize = () => Math.min(150, width * .24)
    let meteor: Meteor | null = null
    let nextMeteor = 1800
    let seed = 713
    const random = () => { seed = seed * 16807 % 2147483647; return seed / 2147483647 }
    // Build both palettes from the same stellar distribution, once per size.
    // Only the cached layers rotate/crossfade during animation.
    function buildSprite(dark: boolean, ratio: number, R: number) {
      const side = Math.ceil(R * 2.5), c = document.createElement('canvas')
      c.width = c.height = Math.ceil(side * ratio)
      const g = c.getContext('2d')!
      g.scale(ratio, ratio); g.translate(side / 2, side / 2)
      g.textAlign = 'center'; g.textBaseline = 'middle'
      let spriteSeed = 1949
      const random = () => { spriteSeed = spriteSeed * 16807 % 2147483647; return spriteSeed / 2147483647 }
      const gaussian = () => Math.sqrt(-2 * Math.log(Math.max(random(), .000001))) * Math.cos(random() * Math.PI * 2)
      const small = width < 600
      const inner = dark ? [255, 233, 203] : [126, 99, 65]
      const outer = dark ? [173, 191, 232] : [62, 68, 110]
      const mixRgb = (r: number) => {
        const t = Math.min(1, Math.max(0, (r - .06) / .6))
        return inner.map((v, i) => Math.round(v + (outer[i] - v) * t)).join(',')
      }
      const digit = (x: number, y: number, size: number, rgb: string, alpha: number) => {
        g.font = `${size.toFixed(1)}px monospace`
        g.fillStyle = `rgba(${rgb},${alpha * (dark ? 1 : .8)})`
        g.fillText(random() > .5 ? '1' : '0', x, y)
      }
      // A faint unresolved stellar disk; individually visible stars remain 1s and 0s.
      const disk = g.createRadialGradient(0, 0, R * .05, 0, 0, R * 1.12)
      disk.addColorStop(0, `rgba(${mixRgb(0)},${dark ? .12 : .045})`)
      disk.addColorStop(.35, `rgba(${mixRgb(.4)},${dark ? .045 : .022})`)
      disk.addColorStop(1, `rgba(${mixRgb(1)},0)`)
      g.fillStyle = disk; g.fillRect(-side / 2, -side / 2, side, side)
      g.globalCompositeOperation = dark ? 'lighter' : 'source-over'
      // Two loosely wound arms, with uneven clusters and faint branching spurs.
      for (let i = 0; i < (small ? 1600 : 3200); i++) {
        const r = .13 + Math.pow(random(), .95) * .87
        const arm = i % 2
        const branch = i % 7 === 0 ? .28 + .2 * r : 0
        const angle = arm * Math.PI + 2.55 * Math.log(r / .13) + branch + gaussian() * (.07 + .11 * r)
        const scatter = gaussian() * R * (.008 + .013 * r)
        const x = Math.cos(angle) * r * R + scatter
        const y = Math.sin(angle) * r * R + gaussian() * R * .012
        const cluster = Math.pow((Math.sin(r * 38 + arm * 1.8) + 1) / 2, 3)
        const fade = Math.pow(1 - r, .6)
        digit(x, y, 2.4 + random() * 2.1, mixRgb(r), (.15 + random() * .3 + cluster * .15) * fade)
      }
      // Diffuse outskirts soften the outline rather than tracing a perfect pinwheel.
      for (let i = 0; i < (small ? 200 : 450); i++) {
        const r = Math.sqrt(random()) * 1.08, angle = random() * Math.PI * 2
        digit(Math.cos(angle) * r * R, Math.sin(angle) * r * R, 2.3 + random() * 1.7, mixRgb(r), .035 + random() * .1)
      }
      // Narrow gaps on the inner edges of the arms suggest obscuring dust lanes.
      g.globalCompositeOperation = 'destination-out'
      g.strokeStyle = 'rgba(0,0,0,.3)'; g.lineWidth = R * .024
      for (let arm = 0; arm < 2; arm++) {
        g.beginPath()
        for (let step = 0; step <= 90; step++) {
          const r = .2 + step / 90 * .68
          const angle = arm * Math.PI + 2.55 * Math.log(r / .13) + .14
          const x = Math.cos(angle) * r * R, y = Math.sin(angle) * r * R
          if (step === 0) g.moveTo(x, y); else g.lineTo(x, y)
        }
        g.stroke()
      }
      g.globalCompositeOperation = dark ? 'lighter' : 'source-over'
      const core = g.createRadialGradient(0, 0, 0, 0, 0, R * .25)
      core.addColorStop(0, `rgba(${mixRgb(0)},${dark ? .28 : .11})`)
      core.addColorStop(.3, `rgba(${mixRgb(0)},${dark ? .12 : .05})`)
      core.addColorStop(1, `rgba(${mixRgb(0)},0)`)
      g.fillStyle = core; g.fillRect(-R * .3, -R * .3, R * .6, R * .6)
      // A compact stellar bulge with a short, gently elongated central bar.
      for (let i = 0; i < (small ? 200 : 380); i++) {
        const x = gaussian() * R * .075, y = gaussian() * R * .035
        digit(x, y, 2.8 + random() * 2.1, mixRgb(0), .18 + random() * .32)
      }
      return { c, side }
    }
    function resize() {
      width = window.innerWidth; height = window.innerHeight
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas!.width = width * ratio; canvas!.height = height * ratio
      ctx!.setTransform(ratio, 0, 0, ratio, 0, 0)
      seed = 713
      stars = Array.from({ length: Math.min(width < 600 ? 220 : 1000, Math.floor(width * height / (width < 600 ? 2400 : 1700))) }, () => ({ x: random(), y: random(), depth: .06 + Math.pow(random(), 2) * .94, phase: random() * 6.28, twinkleSpeed: .0003 + random() * .00065 }))
      const R = galaxySize(), key = `${R}|${ratio}|${width < 600}`
      if (key !== spriteKey) { const dk = buildSprite(true, ratio, R), lt = buildSprite(false, ratio, R); sprites = { dark: dk.c, light: lt.c, side: dk.side }; spriteKey = key }
      draw()
    }
    function draw() {
      const ink = blend([196,190,235], [8,6,22])
      const meteorInk = blend([255,214,176], [0,0,0])
      const starShadow = `rgba(${blend([190,176,255], [70,56,200])},${.8 - .25 * light})`
      ctx!.clearRect(0, 0, width, height)
      ctx!.textAlign = 'center'
      // Tiny binary stars keep the universe present in the open margins.
      for (const star of stars) {
        const x = (star.x * width + elapsed * .0018 * star.depth) % width
        const y = star.y * height + Math.sin(elapsed * .00012 + star.phase) * 4
        const readingColumn = Math.abs(x - width / 2) < Math.min(390, width * .48)
        const twinkle = Math.pow((1 + Math.sin(star.phase + elapsed * star.twinkleSpeed)) / 2, 8)
        const opacity = (.075 + .42 * twinkle) * (.5 + .5 * star.depth) * (readingColumn ? (width < 600 ? .32 : .12) : 1) * (1 + .5 * light)
        ctx!.shadowColor = starShadow
        ctx!.shadowBlur = twinkle > .5 && star.depth > .5 ? twinkle * (7 + 4 * light) : 0
        ctx!.fillStyle = `rgba(${ink},${opacity})`
        ctx!.font = `${3.8 + star.depth * 5.2}px monospace`
        ctx!.fillText(star.phase > 3 ? '1' : '0', x, y)
      }
      ctx!.shadowBlur = 0
      // A realistic barred spiral, tilted and slowly turning, painted from the prebuilt sprites.
      const galaxyRadius = galaxySize()
      const centerX = width - galaxyRadius - (width > 1180 ? 28 : 16)
      const centerY = height - galaxyRadius * .66 - 26
      if (sprites) {
        const side = sprites.side
        ctx!.save()
        ctx!.translate(centerX, centerY)
        ctx!.rotate(-.3)
        ctx!.scale(1, .62)
        ctx!.rotate(elapsed * .00001)
        const fade = width > 1180 ? 1 : .62
        if (light < .999) { ctx!.globalAlpha = (1 - light) * .85 * fade; ctx!.drawImage(sprites.dark, -side / 2, -side / 2, side, side) }
        if (light > .001) { ctx!.globalAlpha = light * fade; ctx!.drawImage(sprites.light, -side / 2, -side / 2, side, side) }
        ctx!.restore()
        ctx!.globalAlpha = 1
      }
      if (meteor) {
        const t = meteor.age / 1850
        for (let i = 0; i < 24; i++) {
          ctx!.font = '10px monospace'
          ctx!.fillStyle = `rgba(${meteorInk},${Math.sin(t * Math.PI) * (1 - i / 24) * .7})`
          ctx!.fillText(i % 3 ? '0' : '1', meteor.x + t * 520 - i * 9, meteor.y + t * 245 - i * 4.24)
        }
      }
    }
    const enabled = () => !motion.matches && !document.hidden
    function tick(now: number) {
      if (!enabled()) { frame = 0; return }
      frame = requestAnimationFrame(tick)
      if (now - previous < 33) return
      const delta = Math.min(now - previous, 65)
      const target = themeRef.current === 'light' ? 1 : 0
      light += (target - light) * (1 - Math.exp(-delta / 75))
      if (Math.abs(target - light) < .001) light = target
      elapsed += delta; previous = now
      if (elapsed > nextMeteor && !meteor) {
        meteor = { x: width * (random() > .5 ? .03 : .63), y: height * (.05 + random() * .25), age: 0 }
        nextMeteor = elapsed + 6500 + random() * 3500
      }
      if (meteor) { meteor.age += 33; if (meteor.age > 1850) meteor = null }
      draw()
    }
    refreshTheme.current = () => {
      if (motion.matches || document.hidden) { light = themeRef.current === 'light' ? 1 : 0; draw() }
      else resume()
    }
    function resume() {
      if (motion.matches) light = themeRef.current === 'light' ? 1 : 0
      if (enabled() && !frame) { previous = performance.now(); frame = requestAnimationFrame(tick) }
      if (!enabled() && frame) { cancelAnimationFrame(frame); frame = 0; meteor = null; draw() }
    }
    resize(); resume()
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', resume)
    motion.addEventListener('change', resume)
    return () => { refreshTheme.current = () => {}; cancelAnimationFrame(frame); window.removeEventListener('resize', resize); document.removeEventListener('visibilitychange', resume); motion.removeEventListener('change', resume) }
  }, [])
  return <canvas ref={canvasRef} className="universe" aria-hidden="true" />
}
