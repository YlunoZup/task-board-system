'use client'

import confetti from 'canvas-confetti'

export function triggerConfetti() {
  // Fire confetti from the left
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { x: 0.1, y: 0.6 },
    colors: ['#6366f1', '#8b5cf6', '#ec4899', '#22c55e', '#eab308'],
  })

  // Fire confetti from the right
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { x: 0.9, y: 0.6 },
    colors: ['#6366f1', '#8b5cf6', '#ec4899', '#22c55e', '#eab308'],
  })
}

export function triggerTaskCompleteConfetti() {
  // Subtle confetti burst for task completion
  const count = 50
  const defaults = {
    origin: { y: 0.7 },
    colors: ['#22c55e', '#16a34a', '#15803d', '#4ade80', '#86efac'],
  }

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    })
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  })

  fire(0.2, {
    spread: 60,
  })

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  })

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  })

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  })
}

export function triggerBoardCompleteConfetti() {
  // Big celebration for completing all tasks on a board
  const duration = 3 * 1000
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  const interval: NodeJS.Timeout = setInterval(function () {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    const particleCount = 50 * (timeLeft / duration)

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#6366f1', '#8b5cf6', '#ec4899', '#22c55e', '#eab308', '#3b82f6'],
    })
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#6366f1', '#8b5cf6', '#ec4899', '#22c55e', '#eab308', '#3b82f6'],
    })
  }, 250)
}
