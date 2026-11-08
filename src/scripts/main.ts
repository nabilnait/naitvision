/** Site-wide behaviour: reveals, count-ups, parallax, in-view videos, anchor scrolling. */
import { gsap, ScrollTrigger, reduced, scrollToTarget } from './motion';
import { initVideos } from './videos';

function initReveals() {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (reduced) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add('is-in'), io.unobserve(e.target))),
      { rootMargin: '0px 0px -10% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return;
  }
  for (const el of els) {
    const delay = Number(el.dataset.delay || 0);
    const st = { trigger: el, start: 'top 88%', once: true };
    if (el.dataset.reveal === 'lines') {
      gsap.fromTo(el.querySelectorAll('.line > span'), { y: 0, yPercent: 105 }, { y: 0, yPercent: 0, duration: 1, stagger: 0.08, delay, scrollTrigger: st });
    } else {
      gsap.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, delay, scrollTrigger: st });
    }
  }
}

function initCounts() {
  for (const el of document.querySelectorAll<HTMLElement>('[data-count]')) {
    const end = Number(el.dataset.count);
    const from = Number(el.dataset.countFrom ?? 0);
    const suffix = el.dataset.suffix ?? '';
    if (reduced || !Number.isFinite(end)) continue;
    const obj = { v: from };
    el.textContent = Math.round(from) + suffix;
    gsap.to(obj, {
      v: end,
      duration: 1.4,
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => (el.textContent = Math.round(obj.v) + suffix),
    });
  }
}

function initParallax() {
  if (reduced) return;
  for (const el of document.querySelectorAll<HTMLElement>('[data-parallax]')) {
    const amt = Number(el.dataset.parallax || 8);
    gsap.fromTo(el, { yPercent: -amt }, { yPercent: amt, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  }
}

function initAnchors() {
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="#"]');
    if (!a) return;
    const url = new URL(a.href);
    if (url.pathname !== location.pathname || !url.hash) return;
    const target = document.querySelector<HTMLElement>(decodeURIComponent(url.hash));
    if (!target) return;
    e.preventDefault();
    history.pushState(null, '', url.hash);
    scrollToTarget(target);
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
}

initReveals();
initCounts();
initParallax();
initAnchors();
initVideos();
window.addEventListener('load', () => ScrollTrigger.refresh());
