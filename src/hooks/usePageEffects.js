import { useEffect } from 'react';
export function usePageEffects() {
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = [...document.querySelectorAll('.reveal')];
    if (reduced || !('IntersectionObserver' in window)) items.forEach(item => item.classList.add('is-visible'));
    const observer = !reduced && 'IntersectionObserver' in window ? new IntersectionObserver((entries, obs) => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); } }), { threshold:.16, rootMargin:'0px 0px -40px 0px' }) : null;
    items.forEach((item,index) => { item.style.transitionDelay=`${Math.min(index%6,5)*60}ms`; observer?.observe(item); });
    const cards = [...document.querySelectorAll('.skill-card,.project-card,.info-card')];
    const move = event => { const box=event.currentTarget.getBoundingClientRect(); event.currentTarget.style.setProperty('--pointer-x',`${event.clientX-box.left}px`); event.currentTarget.style.setProperty('--pointer-y',`${event.clientY-box.top}px`); };
    if (!reduced && matchMedia('(pointer: fine)').matches) cards.forEach(card => card.addEventListener('pointermove',move));
    return () => { observer?.disconnect(); cards.forEach(card => card.removeEventListener('pointermove',move)); };
  }, []);
}
