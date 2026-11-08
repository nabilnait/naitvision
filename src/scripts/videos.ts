/** Plays muted loops only while they are on screen; 'hover' videos play on hover with a fine pointer. */
const fine = window.matchMedia('(hover: hover) and (pointer: fine)');

function safePlay(v: HTMLVideoElement) {
  if (v.preload === 'none') v.preload = 'auto';
  const p = v.play();
  if (p) p.catch(() => {});
}

export function initVideos(root: ParentNode = document) {
  const vids = Array.from(root.querySelectorAll<HTMLVideoElement>('video[data-play]:not([data-bound])'));
  if (!vids.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const v = e.target as HTMLVideoElement;
        const mode = v.dataset.play;
        if (mode === 'manual' || v.dataset.hold === '1') continue;
        if (mode === 'hover' && fine.matches) {
          if (!e.isIntersecting) v.pause();
          continue;
        }
        if (e.isIntersecting) safePlay(v);
        else v.pause();
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
