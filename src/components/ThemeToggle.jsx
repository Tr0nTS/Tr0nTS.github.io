import { useMemo } from 'react';

const starPositions = [
  [9, 23, 0.2], [18, 64, 1.4], [27, 38, 0.7], [36, 16, 2.1],
  [45, 72, 1.1], [54, 31, 2.5], [63, 57, 0.4], [72, 20, 1.8],
  [81, 45, 2.8], [88, 72, 0.9], [32, 80, 1.6], [58, 86, 0.1],
  [76, 82, 2.3], [14, 84, 1.9],
];

function Stars() {
  const stars = useMemo(() => starPositions, []);
  return <span className="day-night-stars" aria-hidden="true">
    {stars.map(([left, top, delay], index) => (
      <i key={index} style={{ left: `${left}%`, top: `${top}%`, animationDelay: `${delay}s` }} />
    ))}
  </span>;
}

function Bird({ className }) {
  return <svg className={`day-night-bird ${className}`} viewBox="0 0 14 8" aria-hidden="true">
    <path d="M0 6 Q7 -2 14 6 Q7 3 0 6Z" />
  </svg>;
}

export default function ThemeToggle({ theme, onToggle }) {
  const night = theme === 'dark';

  return <button
    className={`day-night-toggle${night ? ' is-night' : ''}`}
    type="button"
    role="switch"
    aria-label={`Switch to ${night ? 'light' : 'dark'} mode`}
    aria-checked={night}
    onClick={onToggle}
  >
    <span className="day-night-track" aria-hidden="true">
      <Stars />
      <span className="day-night-shooting-stars"><i /><i /><i /></span>
      <span className="day-night-moon">🌙</span>
      <span className="day-night-sun" />
      <span className="day-night-birds"><Bird className="bird-one" /><Bird className="bird-two" /><Bird className="bird-three" /></span>
      <span className="day-night-clouds">
        <span className="day-night-cloud-track">
          {[0, 1, 2, 3].map(index => <img key={index} src="/images/toggle-cloud.png" alt="" draggable="false" />)}
        </span>
      </span>
    </span>
    <span className="day-night-knob" aria-hidden="true" />
  </button>;
}
