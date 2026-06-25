/**
 * hero-waveform.js
 *
 * Builds the hero's signature visual: a row of bars whose height follows
 * a rising envelope (quiet on the left, loud on the right), then reveals
 * them left-to-right on load — a reverse reverb tail, the actual thing
 * Preverb generates, rather than a generic "audio waveform" decoration.
 *
 * Why JS generates the bars instead of hand-writing 40 <div>s in HTML:
 * the height curve and stagger timing are just a formula. Generating them
 * keeps the markup clean and makes the bar count/curve easy to tune later
 * by changing numbers here rather than editing dozens of HTML elements.
 */

function buildHeroWaveform() {
  const container = document.querySelector('.hero-waveform');
  if (!container) return;

  const barCount = 48;
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  for (let i = 0; i < barCount; i++) {
    const bar = document.createElement('div');
    bar.className = 'bar';

    // Rising envelope: quiet at i=0, building toward a peak near the
    // right edge — an eased curve (i/barCount)^1.6 rather than a
    // straight line, so it swells rather than ramping linearly.
    const progress = i / (barCount - 1);
    const height = Math.pow(progress, 1.6) * 85 + 8; // 8%–93% range

    bar.style.setProperty('--bar-height', `${height}%`);

    // Stagger the reveal left-to-right. Skipped entirely if the user
    // has asked for reduced motion — bars just appear at full height.
    if (!prefersReducedMotion) {
      bar.style.setProperty('--bar-delay', `${i * 0.02}s`);
    }

    container.appendChild(bar);
  }

  if (prefersReducedMotion) {
    container.classList.add('is-revealed');
  } else {
    // Small delay before the reveal class triggers the CSS transition,
    // so the bars don't appear to "jump" the instant the page paints.
    requestAnimationFrame(() => {
      setTimeout(() => container.classList.add('is-revealed'), 100);
    });
  }
}

document.addEventListener('DOMContentLoaded', buildHeroWaveform);
