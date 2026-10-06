import { useEffect, useRef, useState } from 'react';
import SectionHeading from './SectionHeading';
const directionCells = { 'up-left':0, up:1, 'up-right':2, left:3, center:4, right:5, 'down-left':6, down:7, 'down-right':8 };
const directions = ['right','down-right','down','down-left','left','up-left','up','up-right'];
const reactionCells = { blink:0, heart:1, sparkle:2, dizzy:7, delighted:8 };
const cellStyle = index => ({ backgroundPosition: `${(index % 3) * 50}% ${Math.floor(index / 3) * 50}%` });
export default function Contact() {
  const mascotRef = useRef(null), squashRef = useRef(null), activeSector = useRef(-1), boops = useRef({ count:0, last:0 });
  const [direction, setDirection] = useState(directionCells.center), [reaction, setReaction] = useState(null);
  const timers = useRef([]);
  useEffect(() => {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const aim = event => {
      const box = mascotRef.current?.getBoundingClientRect(); if (!box) return;
      const dx = event.clientX - (box.left + box.width / 2), dy = event.clientY - (box.top + box.height / 2);
      if (Math.hypot(dx,dy) < 70) { activeSector.current = -1; setDirection(directionCells.center); return; }
      const angle = Math.atan2(dy,dx), size = Math.PI * 2 / directions.length;
      if (activeSector.current !== -1 && Math.abs(Math.atan2(Math.sin(angle-activeSector.current*size),Math.cos(angle-activeSector.current*size))) < size/2+.12) return;
      activeSector.current = (Math.round(angle/size)+directions.length)%directions.length;
      setDirection(directionCells[directions[activeSector.current]]);
    };
    addEventListener('pointermove', aim, { passive:true });
    return () => removeEventListener('pointermove', aim);
  }, []);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const boop = () => {
    timers.current.forEach(clearTimeout); timers.current = [];
    const now = Date.now(), state = boops.current;
    state.count = now-state.last < 1600 ? state.count+1 : 1; state.last = now;
    if (state.count >= 4) { state.count=0; setReaction('dizzy'); timers.current.push(setTimeout(() => setReaction(null),1100)); }
    else { const payoff=['heart','sparkle','delighted'][state.count-1]; setReaction('blink'); timers.current.push(setTimeout(() => setReaction(payoff),120),setTimeout(() => setReaction(null),560)); }
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) squashRef.current?.animate([{transform:'scale(1,1)'},{transform:'scale(1.10,.86)',offset:.18},{transform:'scale(.95,1.08)',offset:.45},{transform:'scale(1.03,.97)',offset:.72},{transform:'scale(1,1)'}],{duration:420,easing:'linear'});
  };
  return <section id="contact" className="section container contact-section"><SectionHeading number="05" label="CONTACT" title="Let's connect" /><div className="contact-grid"><div className="reveal"><p className="lead">I'm open to opportunities where I can contribute, learn and grow as a developer.</p><div className="contact-list"><a href="mailto:thanhtranminh218@gmail.com">✉ thanhtranminh218@gmail.com</a><a href="tel:+84796473802">📞 0796473802</a><span>📍 An Duong, Hai Phong, Vietnam</span></div></div><div className="contact-mascot-wrap reveal"><button ref={mascotRef} className={`contact-mascot${reaction ? ' is-reacting' : ''}`} type="button" aria-label="Chạm vào mascot của Thành" onClick={boop}><span ref={squashRef} className="contact-mascot-squash" aria-hidden="true"><span className="contact-mascot-layer contact-mascot-directions" style={cellStyle(direction)} /><span className="contact-mascot-layer contact-mascot-reactions" style={cellStyle(reactionCells[reaction] ?? 0)} /></span></button></div></div></section>;
}
