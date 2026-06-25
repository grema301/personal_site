/**
 * include-partials.js
 *
 * GitHub Pages serves static files only — there's no PHP, no server-side
 * includes, no templating engine. So "shared header/footer without
 * copy-pasting markup into five HTML files" has to happen in the browser,
 * after the page loads. This file does that with fetch().
 *
 * The pattern, in short:
 *   1. Each page has two empty placeholder divs: #site-header, #site-footer
 *   2. On load, we fetch() the partial HTML files and drop their contents
 *      into those placeholders.
 *   3. Once the header is in the DOM, we mark the nav link that matches
 *      the current page as active.
 *
 * Trade-off worth knowing about: because this happens via JS after the
 * initial HTML loads, there's a brief instant where the header/footer
 * are blank (a "flash of missing content"). On a static site served from
 * GitHub Pages' CDN this is usually imperceptible, but it's the cost of
 * not having real includes. We'll revisit this if it's ever noticeable.
 */

async function includePartial(targetSelector, partialUrl) {
  const target = document.querySelector(targetSelector);
  if (!target) return;

  try {
    const response = await fetch(partialUrl);
    if (!response.ok) {
      throw new Error(`Failed to load ${partialUrl}: ${response.status}`);
    }
    target.innerHTML = await response.text();
  } catch (err) {
    // Fail loud in the console so we notice during development, but don't
    // throw — a missing header shouldn't take the rest of the page down.
    console.error(err);
  }
}

function markActiveNavLink() {
  const currentPage = document.body.dataset.page;
  if (!currentPage) return;

  document.querySelectorAll('[data-nav]').forEach((link) => {
    if (link.dataset.nav === currentPage) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

async function initLayout() {
  // Header and footer don't depend on each other, so fetch both at once
  // instead of waiting for one to finish before starting the other.
  await Promise.all([
    includePartial('#site-header', 'partials/header.html'),
    includePartial('#site-footer', 'partials/footer.html'),
  ]);

  // The nav links only exist in the DOM once the header partial has been
  // injected, so this has to run after the Promise.all above resolves.
  markActiveNavLink();
}

document.addEventListener('DOMContentLoaded', initLayout);
