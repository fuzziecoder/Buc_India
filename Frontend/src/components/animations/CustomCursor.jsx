import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const trailRefs = useRef([]);
  const auraRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const aura = auraRef.current;
    const trails = trailRefs.current;

    if (!dot || !ring || !aura) return;

    // Set initial positions
    gsap.set([dot, ring, aura, ...trails], { xPercent: -50, yPercent: -50 });

    const moveCursor = (e) => {
      const { clientX, clientY } = e;

      // Main Dot
      gsap.to(dot, { x: clientX, y: clientY, duration: 0 });

      // Ring
      gsap.to(ring, {
        x: clientX,
        y: clientY,
        duration: 0.2,
        ease: "power2.out",
      });

      // Aura (Laggy Glow)
      gsap.to(aura, {
        x: clientX,
        y: clientY,
        duration: 1.2,
        ease: "power3.out",
      });

      // Trails (Multi-layered lag)
      trails.forEach((trail, i) => {
        gsap.to(trail, {
          x: clientX,
          y: clientY,
          duration: 0.3 + i * 0.15,
          ease: "power2.out",
        });
      });
    };

    const handleHover = (e) => {
      const target = e.target;
      const isInteractive = target.closest("button, a, .interactive-item");

      if (isInteractive) {
        gsap.to(ring, {
          scale: 1.5,
          rotate: 45,
          borderRadius: "1px",
          borderColor: "rgba(193, 154, 107, 1)",
          boxShadow: "0 0 20px rgba(193, 154, 107, 0.4)",
          duration: 0.4,
          ease: "back.out(1.7)",
        });
        gsap.to(dot, { scale: 1.2, rotate: 45, borderRadius: "1px", duration: 0.4 });
        gsap.to(aura, { scale: 2.5, opacity: 0.6, duration: 0.4 });
      } else {
        gsap.to(ring, {
          scale: 1,
          rotate: 0,
          borderRadius: "2px",
          borderColor: "rgba(193, 154, 107, 0.4)",
          boxShadow: "0 0 10px rgba(193, 154, 107, 0.2)",
          duration: 0.4,
        });
        gsap.to(dot, { scale: 1, rotate: 0, borderRadius: "1px", duration: 0.4 });
        gsap.to(aura, { scale: 1, opacity: 0.4, duration: 0.4 });
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleHover);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleHover);
    };
  }, []);

  return (
    <>
      {/* Background Aura - Cinematic Atmospheric Glow */}
      <div
        ref={auraRef}
        className="fixed top-0 left-0 w-64 h-64 bg-copper/30 blur-[100px] rounded-full pointer-events-none z-[9990]"
        style={{
          background:
            "radial-gradient(circle, rgba(193, 154, 107, 0.6) 0%, transparent 75%)",
        }}
      />
      {/* Luxuriant Kinetic Trail (12 Layers) */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          ref={(el) => (trailRefs.current[i] = el)}
          className="fixed top-0 left-0 border border-copper/20 rounded-[1px] pointer-events-none z-[9991]"
          style={{
            width: `${20 - i * 1.5}px`,
            height: `${20 - i * 1.5}px`,
            opacity: 0.5 - i * 0.04,
            filter: `blur(${0.2 + i * 0.2}px)`,
            boxShadow: `0 0 ${15 - i}px rgba(193, 154, 107, 0.15)`,
          }}
        />
      ))}
      {/* Smooth Precision Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-7 h-7 border border-copper/60 rounded-[2px] pointer-events-none z-[9998] shadow-[0_0_15px_rgba(193,154,107,0.3)]"
      />
      {/* Performance Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1 h-1 bg-copper rounded-[1px] pointer-events-none z-[9999] shadow-[0_0_12px_rgba(193,154,107,0.6)]"
      />
    </>
  );
};

export default CustomCursor;
