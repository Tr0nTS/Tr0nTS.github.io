import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';

const links = ['about', 'skills', 'experience', 'projects', 'contact'];

export default function Header() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark');
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      setScrolled(scrollY > 12);
      const height = document.documentElement.scrollHeight - innerHeight;
      setProgress(height > 0 ? Math.min((scrollY / height) * 100, 100) : 0);
      const sections = [...document.querySelectorAll('main section[id]')];
      let current = sections[0]?.id || 'home';
      sections.forEach(section => { if (scrollY + 140 >= section.offsetTop) current = section.id; });
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 8) current = sections.at(-1)?.id || current;
      setActive(current);
    };
    update();
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    return () => { removeEventListener('scroll', update); removeEventListener('resize', update); };
  }, []);

  useEffect(() => {
    const media = matchMedia('(prefers-color-scheme: light)');
    const followSystem = event => { if (!localStorage.getItem('theme')) setTheme(event.matches ? 'light' : 'dark'); };
    media.addEventListener?.('change', followSystem);
    return () => media.removeEventListener?.('change', followSystem);
  }, []);

  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    try { localStorage.setItem('theme', next); } catch { /* Storage may be unavailable. */ }
  };

  return <header className={`header${scrolled ? ' is-scrolled' : ''}`} style={{ '--scroll-progress': `${progress}%` }}>
    <nav className="nav container">
      <a className="logo" href="#home" aria-label="Tran Minh Thanh - Home"><img src="/images/tmt.png" alt="Tran Minh Thanh logo" /></a>
      <div className="nav-links">{links.map(link => <a key={link} href={`#${link}`} className={active === link ? 'is-active' : ''}>{link[0].toUpperCase() + link.slice(1)}</a>)}</div>
      <div className="nav-actions">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
        <a className="nav-cta" href="#contact">Let's talk</a>
      </div>
    </nav>
  </header>;
}
