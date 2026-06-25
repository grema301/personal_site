# Personal site — architecture skeleton

This is the first build pass: folder structure + the shared
header/nav/footer pattern, with placeholder content on every page.
No visual design yet — that's the next step.

## Running this locally

Opening index.html directly (double-clicking the file, file:// URL) will
NOT work — the header and footer will stay blank. Browsers block fetch()
requests made from a file:// page as a security measure, and the whole
shared-layout trick depends on fetch(). You need an actual local server.

Easiest option, from inside this folder:

    python3 -m http.server 8000

Then visit http://localhost:8000 in your browser.

(GitHub Pages itself is a real HTTP server, so none of this applies once
it's deployed there — this local-server step is purely a development
convenience.)

## Structure

    index.html, music.html, plugins.html, projects.html, about.html
    partials/        — header.html, footer.html (injected via JS)
    assets/css/       — base.css (placeholder styling only)
    assets/js/        — include-partials.js (the fetch/inject logic)
    assets/images/    — empty for now
    assets/audio/      — empty for now (likely just embeds, no real audio files)
