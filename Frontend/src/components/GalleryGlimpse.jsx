import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Hyper-Optimized Cloudinary Link (eco quality, fixed width for performance)
const CLOUDINARY_URL = "https://res.cloudinary.com/dsryaajna/video/upload/f_auto,q_auto:eco,w_400/v1773413158/5803635-uhd_2160_3840_25fps_1_lgprev.mp4";

const CinematicVideo = ({ src, delay, speed = 0, className = "" }) => {
  const containerRef = useRef(null);
  
  // Cursor Physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-10, 10]);

  // Scroll Magnification Flow
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1.1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const glowShadow = useTransform(
    scrollYProgress,
    [0.3, 0.5, 0.7],
    ["0px 0px 0px rgba(184, 115, 51, 0)", "0px 20px 50px rgba(184, 115, 51, 0.3)", "0px 0px 0px rgba(184, 115, 51, 0)"]
  );

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={containerRef}
      style={{ 
        perspective: 1000,
        opacity,
        scale,
        boxShadow: glowShadow
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-32 md:w-44 aspect-[9/16] overflow-hidden rounded-sm group ${className}`}
    >
      <motion.div
        style={{ rotateX, rotateY }}
        className="w-full h-full relative"
      >
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-out pointer-events-none"
        >
          <source src={src} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-carbon/90 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-700" />
        <div className="absolute inset-0 border border-white/5 group-hover:border-copper/40 transition-colors duration-700" />
      </motion.div>
    </motion.div>
  );
};

const GalleryGlimpse = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);

  return (
    <section ref={sectionRef} className="relative py-32 bg-carbon overflow-hidden border-t border-white/5">
      {/* High-Impact Kinetic Watermark (V3 Signature) */}
      <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none z-0 overflow-hidden">
        <motion.h2 
          animate={{ x: [0, -200, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="font-heading text-[45vw] uppercase tracking-tighter leading-none whitespace-nowrap opacity-[0.08] select-none"
          style={{ 
            WebkitTextStroke: "1.5px rgba(184, 115, 51, 0.4)",
            color: "transparent"
          }}
        >
          GLIMPSE GLIMPSE
        </motion.h2>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="text-copper font-body tracking-ultra text-[10px] uppercase mb-4 block font-bold">The Kinetic Feed</span>
            <h2 className="font-heading text-6xl md:text-8xl text-white uppercase tracking-tighter leading-none mb-12">
              Witness The <br/><span className="text-copper">Legacy</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <button 
              onClick={() => navigate("/gallery")}
              className="px-12 py-5 bg-copper/5 backdrop-blur-xl border border-copper/30 text-copper font-heading text-xl uppercase tracking-widest relative overflow-hidden transition-all duration-500 hover:bg-copper hover:text-carbon"
            >
              <span className="relative z-10">Enter The Vault</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
            <div className="absolute -inset-4 bg-copper/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
          </motion.div>
        </div>

        {/* Unique Broken Grid Layout (V3) */}
        <div className="relative flex flex-wrap justify-center items-start gap-8 md:gap-16">
          {/* Card 1: Elevated Left */}
          <div className="mt-0 md:-mt-12">
            <CinematicVideo src={CLOUDINARY_URL} speed={20} delay={0.1} />
          </div>
          
          {/* Card 2: Deep Offset Center-Left */}
          <div className="mt-12 md:mt-40">
            <CinematicVideo src={CLOUDINARY_URL} speed={-30} delay={0.2} />
          </div>

          {/* Card 3: Extreme Drift Center */}
          <div className="mt-24 md:mt-64 hidden sm:block">
            <CinematicVideo src={CLOUDINARY_URL} speed={50} delay={0.3} className="scale-90" />
          </div>

          {/* Card 4: High Pinned Center-Right */}
          <div className="mt-8 md:-mt-24 lg:mt-12">
            <CinematicVideo src={CLOUDINARY_URL} speed={-50} delay={0.4} />
          </div>

          {/* Card 5: Low Drift Right */}
          <div className="mt-20 md:mt-52">
            <CinematicVideo src={CLOUDINARY_URL} speed={10} delay={0.5} />
          </div>
          
          {/* Card 6: Shadow Drift (Hidden on mobile) */}
          <div className="hidden lg:block absolute -right-20 top-1/4 opacity-40">
             <CinematicVideo src={CLOUDINARY_URL} speed={80} delay={0.6} className="w-32 blur-[2px]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default GalleryGlimpse;
