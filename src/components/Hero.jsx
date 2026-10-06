import { useEffect, useRef, useState } from 'react';

const photos = ['/images/pic1.jpg', '/images/pic2.jpg', '/images/pic3.jpg', '/images/pic4.jpg'];

export default function Hero() {
  const [active, setActive] = useState(0);
  const avatarRef = useRef(null);
  useEffect(() => { const timer = setInterval(() => setActive(value => (value + 1) % photos.length), 7000); return () => clearInterval(timer); }, []);
  const tilt = event => {
    if (!matchMedia('(pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientY - box.top) / box.height - .5) * -3;
    const y = ((event.clientX - box.left) / box.width - .5) * 3;
    event.currentTarget.style.transform = `perspective(900px) rotateX(${x}deg) rotateY(${y}deg) translateY(-4px)`;
  };
  return <section id="home" className="hero container">
    <div className="hero-content">
      <p className="eyebrow hero-animate">FRONTEND DEVELOPER</p><h1 className="hero-animate">Tran Minh Thanh</h1>
      <p className="hero-text hero-animate">Frontend Developer with around 2 years of experience turning ideas into responsive, user-friendly web experiences with modern frontend technologies.</p>
      <div className="hero-actions hero-animate"><a className="button primary" href="#projects">View Projects</a><a className="button secondary" href="#contact">Contact Me</a></div>
      <div className="quick-info hero-animate"><span>📍 An Duong, Hai Phong</span><span>✉ thanhtranminh218@gmail.com</span></div>
    </div>
    <div ref={avatarRef} className="avatar hero-animate" role="img" aria-label="Ảnh chân dung Trần Minh Thành" onPointerMove={tilt} onPointerLeave={event => { event.currentTarget.style.transform = ''; }}>
      {photos.map((photo, index) => <img key={photo} className={`avatar-slide${active === index ? ' is-active' : ''}`} src={photo} alt="" />)}
    </div>
  </section>;
}
