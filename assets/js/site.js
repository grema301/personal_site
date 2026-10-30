document.documentElement.classList.add('js');
document.getElementById('yr').textContent = new Date().getFullYear();
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Hero: a reverse-reverb swell, the thing Preverb makes. Quiet on the left, loud on the right.
const swell = document.querySelector('.swell');
for (let i = 0, n = 56; i < n; i++) {
  const bar = document.createElement('i');
  bar.style.setProperty('--h', (Math.pow(i / (n - 1), 1.7) * 88 + 6) + '%');
  if (!reduced) bar.style.transitionDelay = i * 14 + 'ms';
  swell.appendChild(bar);
}
requestAnimationFrame(() => setTimeout(() => swell.classList.add('on'), 80));

// Fade sections in as they scroll into view.
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach((el) => (reduced ? el.classList.add('in') : io.observe(el)));

// Download cards: ask GitHub for each repo's latest release and list its files.
// If the lookup fails (no release yet, rate limit, offline) the static
// "Download latest" and "Source" links in the HTML still work.
const mb = (bytes) => (bytes / 1048576).toFixed(1) + ' MB';

document.querySelectorAll('[data-repo]').forEach(async (card) => {
  const repo = card.dataset.repo;
  const box = card.querySelector('.dl');
  const meta = card.querySelector('.dl-meta');
  const list = card.querySelector('.dl-assets');
  const key = 'release:' + repo;

  try {
    let release = JSON.parse(sessionStorage.getItem(key) || 'null');
    if (!release) {
      const res = await fetch('https://api.github.com/repos/' + repo + '/releases/latest');
      if (!res.ok) throw new Error(String(res.status));
      release = await res.json();
      sessionStorage.setItem(key, JSON.stringify(release));
    }
    if (!release.assets || !release.assets.length) throw new Error('no assets');

    const date = new Date(release.published_at).toLocaleDateString('en-NZ', { year: 'numeric', month: 'short', day: 'numeric' });
    meta.textContent = release.tag_name + ' · released ' + date;

    release.assets.forEach((asset) => {
      const a = document.createElement('a');
      a.className = 'btn';
      a.href = asset.browser_download_url;
      a.append(document.createTextNode(asset.name + ' '));
      const size = document.createElement('span');
      size.textContent = mb(asset.size);
      a.append(size);
      list.append(a);
    });
    box.classList.add('loaded');   // hides the generic "Download latest" button
  } catch (err) {
    meta.textContent = 'See the releases page for installers';
  }
});
