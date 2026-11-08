/** Plays muted loops only while they are on screen; 'hover' videos play on hover with a fine pointer. */
const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function safePlay(v: HTMLVideoElement) {
  if (v.preload === 'none') v.preload = 'auto';
  const p = v.play();
  if (p) p.catch(() => {});
}

const posterIO = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const v = e.target as HTMLVideoElement;
      if (v.dataset.poster && !v.poster) v.poster = v.dataset.poster;
      posterIO.unobserve(v);
    }
  },
  { rootMargin: '600px 0px' },
);

/** Background loops start only once the page has loaded and the browser is idle; the poster shows until then. */
const pageSettled: Promise<void> = new Promise((resolve) => {
  const idle = () => ('requestIdleCallback' in window ? requestIdleCallback(() => resolve(), { timeout: 3000 }) : setTimeout(resolve, 1500));
  if (document.readyState === 'complete') idle();
  else window.addEventListener('load', idle, { once: true });
});

export function initVideos(root: ParentNode = document) {
  root.querySelectorAll<HTMLVideoElement>('video[data-poster]:not([poster])').forEach((v) => posterIO.observe(v));
  const vids = Array.from(root.querySelectorAll<HTMLVideoElement>('video[data-play]:not([data-bound])'));
  if (!vids.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const v = e.target as HTMLVideoElement;
        const mode = v.dataset.play;
        if (mode === 'manual' || v.dataset.hold === '1') continue;
        if (reducedMotion && v.hasAttribute('data-ambient')) continue;
        if (mode === 'hover' && fine.matches) {
          if (!e.isIntersecting) v.pause();
          continue;
        }
        v.dataset.inview = e.isIntersecting ? '1' : '0';
        if (e.isIntersecting) {
          if (v.hasAttribute('data-ambient')) pageSettled.then(() => v.dataset.inview === '1' && safePlay(v));
          else safePlay(v);
        } else v.pause();
      }
    },
    { threshold: 0.25 },
  );
  for (const v of vids) {
    v.dataset.bound = '1';
    io.observe(v);
    if (v.dataset.play === 'hover') {
      const host = (v.closest('[data-hover-host]') as HTMLElement) ?? v.parentElement!;
      host.addEventListener('mouseenter', () => fine.matches && safePlay(v));
      host.addEventListener('mouseleave', () => fine.matches && v.pause());
    }
  }
}
