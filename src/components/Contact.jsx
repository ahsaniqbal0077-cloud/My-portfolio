import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiSend, FiActivity, FiShield } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const formRef = useRef();
  
  const [loaded, setLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentFrameIdx, setCurrentFrameIdx] = useState(0);

  const frameCount = 160;
  const imagesRef = useRef([]);
  const seqRef = useRef({ frame: 0 });

  const currentFrame = (index) => `/image3/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`;

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

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render();
    };

    const render = () => {
      if (!canvas || !imagesRef.current.length) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let frameIdx = Math.round(seqRef.current.frame);
      if (frameIdx >= frameCount) frameIdx = frameCount - 1;

      const img = imagesRef.current[frameIdx];
      if (img && img.complete && img.naturalWidth !== 0) {
        const scale = Math.max(
          canvas.width / img.width,
          canvas.height / img.height
        );
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;
        
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      }
      setCurrentFrameIdx(frameIdx);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=4000",
        scrub: 1.2,
        pin: true,
        anticipatePin: 1
      }
    });

    tl.to(seqRef.current, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      onUpdate: render
    });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      ScrollTrigger.getAll().filter(t => t.trigger === containerRef.current).forEach(t => t.kill());
    };
  }, [loaded]);

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs
      .sendForm(
        "service_ezep6zg",
        "template_6fbergt",
        formRef.current,
        "0GSfZwE2fSCw9lqcZ"
      )
      .then(() => {
        toast.success("TRANSMISSION_COMPLETE 🚀");
        formRef.current.reset();
      })
      .catch(() => {
        toast.error("CONNECTION_FAILURE ❌");
      });
  };

  return (
    <div
      ref={containerRef}
      id="contactme"
      className="relative w-full h-screen bg-[#020202] overflow-hidden flex items-center justify-center font-mono select-none"
    >
      <AnimatePresence>
        {!loaded && (
          <motion.div 
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-[100] bg-[#020202]"
          >
            <div className="text-cyan-400 font-mono text-[10px] uppercase tracking-[0.5em] mb-4 animate-pulse">
              SYNCING_COMM_STREAM {loadingProgress}%
            </div>
            <div className="w-64 h-[2px] bg-cyan-950/30 overflow-hidden">
               <motion.div 
                 className="h-full bg-cyan-500" 
                 style={{ width: `${loadingProgress}%` }}
               />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.3)_100%)]" />

      <AnimatePresence>
        {loaded && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-20 pointer-events-none p-10"
          >
            <div className="absolute top-12 left-12">
              <motion.div 
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-cyan-400 font-mono text-[9px] uppercase tracking-[0.7em] font-bold"
              >
                Establish Connection: Ahsan
              </motion.div>
            </div>

            <div className="absolute top-24 left-12 flex items-center space-x-3">
               <FiActivity className="text-cyan-400 text-xs animate-pulse" />
               <span className="text-cyan-400/40 text-[9px] tracking-[0.4em] uppercase font-bold">Signal_Stable</span>
            </div>
            
            <div className="absolute bottom-12 right-12 text-right hidden lg:block">
               <span className="text-white/10 text-[9px] tracking-[0.6em] uppercase block mb-1">NODE: KHI-PK // PECHS</span>
               <span className="text-cyan-500/30 text-[9px] tracking-[0.4em] uppercase">&gt; ahsaniqbal0077@gmail.com</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {loaded && currentFrameIdx >= 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-50 w-full max-w-4xl px-6 pointer-events-auto"
          >
            <div className="text-center mb-8">
              <h2 className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter leading-none">
                COMM<span className="text-cyan-500 block sm:inline">.LINK</span>
              </h2>
              <div className="flex items-center justify-center space-x-2 text-cyan-500/60 font-mono text-[9px] tracking-[0.6em] uppercase">
                <FiShield />
                <span>Protocol: Ahsan_Direct</span>
              </div>
            </div>

            <form
              ref={formRef}
              onSubmit={sendEmail}
              className="bg-white/[0.03] backdrop-blur-md border border-white/10 p-10 md:p-14 rounded-none shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-10 group"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-cyan-500/50 block ml-1">IDENT_SIGNATURE</label>
                  <input
                    name="name"
                    type="text"
                    placeholder="ENTER_NAME"
                    required
                    className="w-full bg-white/5 border-b border-white/10 py-5 px-6 text-white text-[11px] outline-none focus:border-cyan-600 transition-all placeholder:text-cyan-950/20"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-cyan-500/50 block ml-1">COMM_PATH_ADDR</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="ENTER_EMAIL"
                    required
                    className="w-full bg-white/5 border-b border-white/10 py-5 px-6 text-white text-[11px] outline-none focus:border-cyan-600 transition-all placeholder:text-cyan-950/20"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-cyan-500/50 block ml-1">DATA_PAYLOAD</label>
                <textarea
                  name="message"
                  placeholder="INPUT_TRANSMISSION..."
                  required
                  className="w-full bg-white/5 border-b border-white/10 py-5 px-6 text-white text-[11px] outline-none focus:border-cyan-600 transition-all min-h-[140px] resize-none placeholder:text-cyan-950/20"
                />
              </div>

              <div className="flex justify-center md:justify-end">
                <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(6, 182, 212, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="group flex items-center space-x-6 bg-cyan-600 text-black font-black text-[11px] uppercase tracking-[0.6em] px-24 py-6 shadow-2xl transition-all"
              >
                <span>TRANSMIT</span>
                <FiSend className="text-lg transition-transform group-hover:translate-x-1" />
              </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer
        position="bottom-right"
        toastClassName="bg-black border border-cyan-500/30 text-white font-mono text-[9px] rounded-none backdrop-blur-xl"
        progressClassName="bg-cyan-600"
      />
    </div>
  );
};

export default Contact;