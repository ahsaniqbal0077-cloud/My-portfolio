import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentFrameIdx, setCurrentFrameIdx] = useState(0);

  const frameCount = 192;
  const currentFrame = (index) => `/images/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`;
  
  const imagesRef = useRef([]);
  const seqRef = useRef({ frame: 0 });

  useEffect(() => {
    let loadedCount = 0;
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        img.onload = () => {
            loadedCount++;
            setLoadingProgress(Math.floor((loadedCount / frameCount) * 100));
            if (loadedCount === frameCount) setLoaded(true);
        };
        img.onerror = () => {
            loadedCount++;
            if (loadedCount === frameCount) setLoaded(true);
        };
        imagesRef.current.push(img);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;

    // --- SYSTEM BOOT OPENING EXPERIENCE ---
    const bootTl = gsap.timeline({ delay: 0.2 });

    bootTl.fromTo('.noise-overlay', { opacity: 0 }, { opacity: 0.15, duration: 1, ease: "none" }, 0);
    bootTl.fromTo('.center-glow', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1.5, ease: "power1.inOut" }, 0.2);
    bootTl.fromTo('nav', { y: -50, opacity: 0, filter: 'blur(10px)' }, { y: 0, opacity: 1, filter: 'blur(0)', duration: 1, ease: "power2.out" }, 0.3);
    
    bootTl.to(seqRef.current, { 
        frame: 10, 
        snap: "frame", 
        duration: 1, 
        ease: "power1.inOut", 
        onUpdate: () => setCurrentFrameIdx(Math.round(seqRef.current.frame)) 
    }, 0.4);

    bootTl.fromTo('.hud-element', { opacity: 0 }, { opacity: 1, duration: 0.1, stagger: 0.1, ease: "none" }, 0.8);

    // --- MAIN SCROLL CONTINUATION (192 Frames Razor-Sharp Sync) ---
    const tlScroll = gsap.timeline({
        scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=5000",
            scrub: 0.1, // Super fast responsive scrub
            pin: true,
            anticipatePin: 1
        }
    });

    tlScroll.to(seqRef.current, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        duration: 1,
        onUpdate: () => {
            let frameIdx = Math.round(seqRef.current.frame);
            if (frameIdx >= frameCount) frameIdx = frameCount - 1;
            setCurrentFrameIdx(frameIdx);
        }
    });

    tlScroll.fromTo('.portfolio-ui', 
        { opacity: 1, filter: "blur(0px)" },
        { opacity: 0, filter: "blur(5px)", duration: 0.1, ease: "none" }, 
        0.9
    );

    return () => {
        ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [loaded]);

  const titleText = "AHSAN IQBAL";

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-[#020202] overflow-hidden flex items-center justify-center font-sans tracking-wide">
        
        {/* Loading State */}
        {!loaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-[#020202]">
                <div className="text-gray-500 font-mono text-xs uppercase tracking-[0.3em] mb-4">&gt; INITIALIZING_CORE_SYSTEM</div>
                <div className="w-64 h-[1px] bg-white/10 overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-300 ease-out" style={{ width: `${loadingProgress}%` }}></div>
                </div>
            </div>
        )}

        {/* --- BACKGROUND EFFECTS --- */}
        <div className="portfolio-ui absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="portfolio-ui noise-overlay absolute inset-0 z-0 pointer-events-none mix-blend-overlay opacity-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
        <div className="portfolio-ui center-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none opacity-0 mix-blend-screen z-[1]"></div>

        {/* --- ULTRA-SHARP DIRECT IMAGE LAYER (No Canvas Blur) --- */}
        {loaded && (
            <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden bg-[#020202]">
                <img 
                    src={currentFrame(currentFrameIdx)} 
                    alt="Ahsan Iqbal Hero" 
                    className="w-full h-full object-cover select-none"
                    style={{ imageRendering: 'high-quality' }}
                    draggable="false"
                />
            </div>
        )}

        {/* --- HUD ELEMENTS --- */}
        <div className="portfolio-ui absolute top-28 left-8 md:top-32 md:left-12 z-[60] font-mono text-[10px] text-blue-400 tracking-widest flex flex-col space-y-1.5 pointer-events-none">
            <span className="hud-element opacity-0">&gt; SYSTEM ONLINE</span>
            <span className="hud-element opacity-0">&gt; INITIALIZING PORTFOLIO v2.0</span>
            <span className="hud-element opacity-0">&gt; NEURAL LINK ESTABLISHED</span>
        </div>
        <div className="portfolio-ui absolute bottom-12 right-8 md:bottom-12 md:right-12 z-[60] font-mono text-[10px] text-gray-600 tracking-widest text-right flex flex-col space-y-1.5 pointer-events-none">
            <span className="hud-element opacity-0">SECURE SYS_ID: REACT_SHARP_SEQ</span>
            <span className="hud-element opacity-0">COORD: 27.5330 N / 68.6010 E</span>
        </div>

        {/* --- SOCIAL LINKS --- */}
        <div className="portfolio-ui absolute bottom-12 left-8 md:left-12 z-[60] flex flex-col space-y-5">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="social-icon opacity-0 text-gray-500 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all">
                <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon opacity-0 text-gray-500 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all">
                <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
        </div>

        {/* --- PORTFOLIO TEXT OVERLAY --- */}
        <AnimatePresence>
            {loaded && (
                <div className="portfolio-ui absolute inset-0 z-[50] pointer-events-none flex flex-col md:flex-row justify-between items-center md:items-center px-8 md:px-[15%] lg:px-[18%] pt-32 pb-16 md:pt-0 pb-0">
                    
                    {/* LEFT SIDE: Name and Role */}
                    <div className="w-full md:w-[35%] flex flex-col items-center md:items-start text-center md:text-left">
                        {currentFrameIdx >= 20 && (
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="mb-4"
                            >
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-sans font-bold text-white tracking-[0.1em] uppercase leading-none" style={{ textShadow: "0 0 20px rgba(255,255,255,0.2)" }}>
                                    {titleText}
                                </h1>
                            </motion.div>
                        )}
                        
                        {currentFrameIdx >= 60 && (
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                                className="relative inline-block"
                            >
                                <h2 className="text-sm md:text-md lg:text-lg font-mono text-gray-300 tracking-[0.2em] uppercase pb-2">
                                    Software Engineer
                                </h2>
                                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/60"></div>
                            </motion.div>
                        )}
                    </div>

                    {/* RIGHT SIDE: Description and Button */}
                    <div className="w-full md:w-[35%] flex flex-col items-center md:items-start text-center md:text-left mt-16 md:mt-0 md:pl-8">
                        {currentFrameIdx >= 100 && (
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="mb-8"
                            >
                                <p className="text-gray-400 text-sm md:text-sm lg:text-base font-light tracking-wide leading-relaxed">
                                    Crafting scalable web applications, distributed systems in C++, and embedded solutions with precision engineering.
                                </p>
                            </motion.div>
                        )}

                        {currentFrameIdx >= 150 && (
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                                className="pointer-events-auto"
                            >
                                <div className="inline-flex items-center px-8 py-3 border border-gray-700 bg-black/50 hover:bg-black/80 hover:border-blue-500/50 transition-colors cursor-pointer rounded-sm backdrop-blur-md group">
                                    <span className="text-gray-300 font-mono tracking-widest uppercase text-xs group-hover:text-white transition-colors">Explore Work</span>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            )}
        </AnimatePresence>
    </div>
  );
}