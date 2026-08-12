const viewport = document.querySelector(".timeline-viewport")
const stage = document.querySelector(".timeline-stage")
const wave = document.querySelector(".timeline-wave")
const entries = [...document.querySelectorAll(".timeline-entry")]

if (viewport && stage && wave && entries.length) {
  const context = wave.getContext("2d")
  let dragging = false
  let startX = 0
  let startScroll = 0
  let renderFrame = 0

  const waveY = (x, width, height) => {
    const progress = width ? x / width : 0
    return height * 0.5 + Math.sin(progress * Math.PI * 3.2 - 0.62) * 78
  }

  const drawCurve = (width, height) => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    wave.width = Math.round(width * ratio)
    wave.height = Math.round(height * ratio)
    wave.style.width = `${width}px`
    wave.style.height = `${height}px`
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    context.clearRect(0, 0, width, height)

    const points = []
    for (let x = 0; x <= width; x += 8) {
      points.push([x, waveY(x, width, height)])
    }

    const drawPath = () => {
      context.beginPath()
      points.forEach(([x, y], index) => {
        if (index === 0) context.moveTo(x, y)
        else context.lineTo(x, y)
      })
    }

    context.save()
    context.lineCap = "round"
    context.lineJoin = "round"
    context.strokeStyle = "rgba(27, 83, 68, 0.12)"
    context.lineWidth = 27
    context.shadowColor = "rgba(27, 83, 68, 0.14)"
    context.shadowBlur = 18
    context.shadowOffsetY = 8
    drawPath()
    context.stroke()
    context.restore()

    const gradient = context.createLinearGradient(0, 0, width, 0)
    gradient.addColorStop(0, "#c48b4a")
    gradient.addColorStop(0.25, "#879c90")
    gradient.addColorStop(0.58, "#4b948c")
    gradient.addColorStop(1, "#119b91")

    context.save()
    context.lineCap = "round"
    context.lineJoin = "round"
    context.strokeStyle = gradient
    context.lineWidth = 15
    context.shadowColor = "rgba(37, 80, 63, 0.18)"
    context.shadowBlur = 5
    context.shadowOffsetY = 5
    drawPath()
    context.stroke()
    context.restore()

    context.save()
    context.lineCap = "round"
    context.strokeStyle = "rgba(255, 255, 255, 0.58)"
    context.lineWidth = 2
    points.forEach(([x, y]) => {
      context.beginPath()
      context.moveTo(x, y - 2)
      context.lineTo(x + 5, y - 2)
      context.stroke()
    })
    context.restore()

    entries.forEach((entry) => {
      const x = entry.offsetLeft + entry.offsetWidth / 2
      const y = waveY(x, width, height)
      entry.style.setProperty("--curve-y", `${y}px`)

      context.save()
      context.strokeStyle = "rgba(255, 255, 255, 0.46)"
      context.lineWidth = 2
      context.beginPath()
      context.moveTo(x, y - 18)
      context.lineTo(x, y + 18)
      context.stroke()
      context.restore()
    })
  }

  const updateDepth = () => {
    const viewportRect = viewport.getBoundingClientRect()
    const center = viewportRect.left + viewportRect.width / 2

    entries.forEach((entry) => {
      const rect = entry.getBoundingClientRect()
      const offset = (rect.left + rect.width / 2 - center) / viewportRect.width
      const distance = Math.min(Math.abs(offset), 1)
      const focus = 1 - distance
      entry.style.setProperty("--depth", `${Math.round(focus * 52)}px`)
      entry.style.setProperty("--tilt", `${(offset * -4.2).toFixed(2)}deg`)
      entry.style.setProperty("--focus", focus.toFixed(2))
      entry.classList.toggle("is-focused", focus > 0.74)
    })
  }

  const render = () => {
    renderFrame = 0
    drawCurve(stage.clientWidth, stage.clientHeight)
    updateDepth()
  }

  const requestRender = () => {
    if (!renderFrame) renderFrame = requestAnimationFrame(render)
  }

  viewport.addEventListener("scroll", updateDepth, { passive: true })
  window.addEventListener("resize", requestRender)
  window.addEventListener("beforeprint", requestRender)

  viewport.addEventListener("pointerdown", (event) => {
    dragging = true
    startX = event.clientX
    startScroll = viewport.scrollLeft
    viewport.setPointerCapture(event.pointerId)
    viewport.classList.add("is-dragging")
  })

  viewport.addEventListener("pointermove", (event) => {
    if (!dragging) return
    event.preventDefault()
    viewport.scrollLeft = startScroll - (event.clientX - startX)
  })

  const stopDragging = () => {
    dragging = false
    viewport.classList.remove("is-dragging")
  }

  viewport.addEventListener("pointerup", stopDragging)
  viewport.addEventListener("pointercancel", stopDragging)
  viewport.addEventListener("pointerleave", stopDragging)

  viewport.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
    event.preventDefault()
    viewport.scrollBy({
      left: event.key === "ArrowRight" ? 260 : -260,
      behavior: "smooth",
    })
  })

  requestRender()
}
