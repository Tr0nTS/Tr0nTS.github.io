import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BackgroundMusic from './components/BackgroundMusic';
import { usePageEffects } from './hooks/usePageEffects';

export default function App() {
  usePageEffects();
  return <>
    <Header />
    <main><Hero /><About /><Skills /><Experience /><Projects /><Contact /></main>
    <Footer />
    <BackgroundMusic />
  </>;
}
