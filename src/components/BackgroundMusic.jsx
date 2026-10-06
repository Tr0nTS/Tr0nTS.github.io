import { useEffect, useRef, useState } from 'react';
export default function BackgroundMusic() {
  const audioRef = useRef(null), [showPrompt, setShowPrompt] = useState(false);
  const play = () => audioRef.current?.play().then(() => setShowPrompt(false)).catch(() => setShowPrompt(true));
  useEffect(() => {
    const audio = audioRef.current; audio.volume=.35; audio.pause(); audio.currentTime=0; play();
    const start = () => play(); addEventListener('pointerdown',start); addEventListener('keydown',start);
    const stop = () => { audio.pause(); audio.currentTime=0; }; addEventListener('beforeunload',stop);
    return () => { removeEventListener('pointerdown',start); removeEventListener('keydown',start); removeEventListener('beforeunload',stop); stop(); };
  }, []);
  return <><audio ref={audioRef} loop preload="auto"><source src="/sounds/JVKE%20-%20golden%20hour%20(official%20music%20video).mp3" type="audio/mpeg" /></audio><button className={`music-prompt${showPrompt ? ' is-visible' : ''}`} type="button" aria-label="Bật nhạc nền" onClick={play}><span aria-hidden="true">♪</span></button></>;
}
