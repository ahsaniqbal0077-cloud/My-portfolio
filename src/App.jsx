import React, { Suspense, lazy, useEffect } from 'react';
import Lenis from 'lenis';
import Hero from './components/Hero';
import Navbar from './components/Navbar';

// Lazy load non-critical sections for performance
const About = lazy(() => import('./components/About'));
const Services = lazy(() => import('./components/Services'));
const Portfolio = lazy(() => import('./components/Portfolio'));
const FrameScrollAnimation = lazy(() => import('./components/FrameScrollAnimation'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));

function App() {
  
  // --- LENIS ULTRA-SMOOTH SCROLL SETUP ---
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2, // Scroll ki speed aur smoothness (1.2 best hai)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Premium curve
      smoothWheel: true,
      touchMultiplier: 2, // Touchpad/Mobile par thora fast response
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);

    // Cleanup function taake memory leak na ho
    return () => {
      lenis.destroy();
    };
  }, []);
  // ---------------------------------------

  return (
    <>
      <Navbar />
      <Hero />
      
      <Suspense fallback={<div className="h-screen bg-black" />}>
        {/* Welcome to Portfolio Section */}
        <FrameScrollAnimation frameCount={240} />
        <About />
        <Portfolio />
        <Services />
        <Contact />
        <Footer />
      </Suspense>
    </>
  );
}

export default App;