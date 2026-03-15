import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import GlareHover from "./animations/GlareHover";

const navigation = [
  { name: "HOME", path: "/", label: "WELCOME" },
  { name: "EVENTS", path: "/events", label: "EXPERIENCE" },
  { name: "GALLERY", path: "/gallery", label: "VISUALS" },
  { name: "MEMBERS", path: "/members", label: "BROTHERHOOD" },
  { name: "FORUM", path: "/forum", label: "COMMUNITY" },
  { name: "CLUBS", path: "/clubs", label: "NETWORK" },
  { name: "INTERNATIONAL", path: "/international", label: "GLOBAL" },
];

const ExhaustParticles = ({ x, y, angle, isHovered }) => {
  const particleCount = isHovered ? 30 : 6;
  return [...Array(particleCount)].map((_, i) => (
    <motion.circle
      key={i}
      cx={x}
      cy={y}
      r={isHovered ? 1.2 : 0.8}
      fill={isHovered ? (i % 2 === 0 ? "#FF8C00" : "#FFD700") : "#A1A1AA"}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, isHovered ? 2 : 1.2, 0.2],
        x: [0, Math.cos(angle) * (isHovered ? 60 : 25)],
        y: [0, Math.sin(angle) * (isHovered ? 60 : 25)],
      }}
      transition={{
        duration: isHovered ? 0.5 : 0.8,
        repeat: Infinity,
        delay: i * (isHovered ? 0.01 : 0.12),
        ease: "easeOut",
      }}
    />
  ));
};

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const linksRef = useRef([]);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // GSAP Staggered Animation for Links
      gsap.fromTo(
        linksRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power4.out",
          delay: 0.3,
        },
      );
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  const handleNavigate = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        className="fixed top-5 left-5 z-[1001] cursor-pointer group interactive-item"
      >
        <img
          src="/bucpng.png"
          alt="BUC India"
          className="h-20 w-auto brightness-0 invert opacity-100 group-hover:opacity-100 transition-opacity duration-500"
        />
      </div>

      {/* Premium Menu Trigger Wrapper */}
      <div className="fixed top-10 right-10 z-[1001] flex items-center gap-6">
        {/* Hover Side Label */}
        <AnimatePresence>
          {isHovered && (
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="font-heading text-sm tracking-[0.5em] text-copper uppercase select-none hidden md:block"
            >
              {isOpen ? "CLOSE" : "NAVIGATION"}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Premium Menu Trigger */}
        <button
          onClick={toggleMenu}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`p-2 flex flex-col items-center justify-center transition-all duration-500 group relative interactive-item ${
            isOpen ? "text-copper" : "text-white"
          }`}
          aria-label="Toggle Menu"
        >
          {/* L Corners */}
          <div className="absolute -inset-2">
            <span
              className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 transition-colors duration-500 ${isOpen ? "border-copper" : "border-copper/40 group-hover:border-copper"}`}
            ></span>
            <span
              className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 transition-colors duration-500 ${isOpen ? "border-copper" : "border-copper/40 group-hover:border-copper"}`}
            ></span>
            <span
              className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 transition-colors duration-500 ${isOpen ? "border-copper" : "border-copper/40 group-hover:border-copper"}`}
            ></span>
            <span
              className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 transition-colors duration-500 ${isOpen ? "border-copper" : "border-copper/40 group-hover:border-copper"}`}
            ></span>
          </div>

          {/* Animated Bike Component Icon (V-Twin Engine) */}
          <div className="relative w-16 h-16 flex items-center justify-center shadow-2xl rounded-full bg-carbon-light/20 backdrop-blur-sm border border-white/5 transition-transform duration-500 group-hover:scale-110">
            <motion.svg
              viewBox="0 0 100 100"
              className="w-12 h-12"
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.8, ease: "anticipate" }}
            >
              {/* Engine Block / Crankcase */}
              <circle
                cx="50"
                cy="70"
                r="12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <motion.circle
                cx="50"
                cy="70"
                r="4"
                fill="currentColor"
                animate={
                  isHovered
                    ? {
                        scale: [1, 1.8, 1],
                        opacity: [0.8, 1, 0.8],
                      }
                    : {}
                }
                transition={{ duration: 0.1, repeat: Infinity }}
              />

              {/* Exhaust Particles Injection */}
              <ExhaustParticles
                x={35}
                y={15}
                angle={Math.PI * 1.2}
                isHovered={isHovered}
              />
              <ExhaustParticles
                x={65}
                y={15}
                angle={Math.PI * 1.8}
                isHovered={isHovered}
              />

              {/* Left Cylinder */}
              <g transform="rotate(-30 50 70)">
                <rect
                  x="35"
                  y="20"
                  width="30"
                  height="40"
                  rx="1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all duration-300"
                />
                {/* Cooling Fins */}
                {[...Array(5)].map((_, i) => (
                  <line
                    key={`l-fin-${i}`}
                    x1="32"
                    y1={25 + i * 7}
                    x2="68"
                    y2={25 + i * 7}
                    stroke="currentColor"
                    strokeWidth="1"
                    opacity="0.5"
                  />
                ))}
                {/* Piston */}
                <motion.rect
                  x="38"
                  y="22"
                  width="24"
                  height="10"
                  rx="1"
                  fill="currentColor"
                  animate={{ y: [0, 20, 0] }}
                  transition={{
                    duration: isHovered ? 0.1 : 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </g>

              {/* Right Cylinder */}
              <g transform="rotate(30 50 70)">
                <rect
                  x="35"
                  y="20"
                  width="30"
                  height="40"
                  rx="1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all duration-300"
                />
                {/* Cooling Fins */}
                {[...Array(5)].map((_, i) => (
                  <line
                    key={`r-fin-${i}`}
                    x1="32"
                    y1={25 + i * 7}
                    x2="68"
                    y2={25 + i * 7}
                    stroke="currentColor"
                    strokeWidth="1"
                    opacity="0.5"
                  />
                ))}
                {/* Piston */}
                <motion.rect
                  x="38"
                  y="22"
                  width="24"
                  height="10"
                  rx="1"
                  fill="currentColor"
                  animate={{ y: [20, 0, 20] }}
                  transition={{
                    duration: isHovered ? 0.1 : 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </g>
            </motion.svg>
          </div>
        </button>
      </div>

      {/* Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.7, 0, 0.3, 1] }}
            className="fixed inset-0 bg-carbon z-[1000] flex items-center justify-center overflow-hidden"
          >
            {/* Background Ghost Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
              <span className="font-heading text-[25vw] text-white/[0.02] leading-none whitespace-nowrap">
                BUC INDIA
              </span>
              <div className="absolute bottom-[10%] right-[-2%] font-heading text-[6vw] text-white/[0.1]">
                RIDE
              </div>
            </div>

            {/* Accent Elements */}
            <div className="absolute left-[clamp(40px,6vw,80px)] top-0 bottom-0 w-[1px] bg-copper/10 hidden md:block" />
            <div className="absolute left-[clamp(40px,6vw,80px)] top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-copper/40 rotate-45 hidden md:block" />
            <div className="absolute top-0 left-0 w-32 h-32 border-t border-l border-copper/20" />
            <div className="absolute bottom-0 right-0 w-32 h-32 border-b border-r border-copper/20" />

            {/* Premium Animations Style */}
            <style>{`
              .nav-link-btn {
                position: relative;
                padding: 0.5rem 0;
                transition: color 0.4s ease;
              }
              .nav-link-btn::before {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                width: 0;
                height: 1px;
                background: #C19A6B;
                transition: width 0.6s cubic-bezier(0.7, 0, 0.3, 1);
              }
              .nav-link-btn:hover::before, .nav-link-btn.active::before {
                width: 100%;
              }
              .nav-link-btn.active {
                text-shadow: 0 0 20px rgba(193, 154, 107, 0.3);
              }
            `}</style>

            {/* Main Menu Grid */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-10 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
              {/* Navigation Links (Left Pane) */}
              <nav className="md:col-span-7 flex flex-col items-start gap-4">
                {navigation.map((item, index) => (
                  <div
                    key={item.name}
                    ref={(el) => (linksRef.current[index] = el)}
                    className="overflow-hidden"
                  >
                    <button
                      onClick={() => handleNavigate(item.path)}
                      className={`nav-link-btn group flex items-center gap-12 interactive-item ${
                        location.pathname === item.path ? "active" : ""
                      }`}
                    >
                      <span
                        className={`font-heading text-5xl md:text-7xl transition-all duration-500 ease-[cubic-bezier(0.7,0,0.3,1)] ${
                          location.pathname === item.path
                            ? "text-copper tracking-[0.2em]"
                            : "text-white/20 group-hover:text-white group-hover:tracking-[0.2em]"
                        }`}
                      >
                        {item.name}
                      </span>
                      {/* Hover reveal sub-text */}
                      <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 font-body text-[10px] tracking-[0.3em] text-copper uppercase">
                        {item.label}
                      </span>
                    </button>
                  </div>
                ))}
              </nav>

              {/* Right Pane: Auth & Social */}
              <div className="md:col-span-5 flex flex-col items-start md:items-end gap-12">
                {/* Auth Section */}
                <div className="flex flex-col items-start md:items-end gap-10 w-full mb-8">
                  <button
                    onClick={() => handleNavigate("/login")}
                    className="group relative flex items-center gap-4 font-body text-xs tracking-ultra text-white/40 hover:text-white transition-colors py-2"
                  >
                    LOGIN
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-copper group-hover:w-full transition-all duration-500"></span>
                  </button>

                  <div className="relative group">
                    <GlareHover>
                      <button
                        onClick={() => handleNavigate("/signup")}
                        className="px-10 py-4 bg-transparent border border-copper/30 text-copper font-heading text-xl tracking-widest relative overflow-hidden group/btn hover:border-copper transition-colors duration-500 interactive-item"
                      >
                        <span className="relative z-10 transition-colors duration-500 group-hover/btn:text-carbon">
                          JOIN BROTHERHOOD
                        </span>
                        <div className="absolute inset-0 bg-copper translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.3,1)] -z-0"></div>
                      </button>
                    </GlareHover>
                  </div>
                </div>

                {/* Social Section */}
                <div className="flex flex-col items-start md:items-end gap-6 w-full pt-12 border-t border-white/5">
                  <span className="font-body text-[10px] tracking-[0.5em] text-white/20 uppercase">
                    FOLLOW US
                  </span>
                  <div className="flex flex-col items-start md:items-end gap-3">
                    {[
                      { name: "INSTAGRAM", url: "#" },
                      { name: "FACEBOOK", url: "#" },
                      { name: "TWITTER", url: "#" },
                      { name: "YOUTUBE", url: "#" },
                    ].map((social) => (
                      <a
                        key={social.name}
                        href={social.url}
                        className="group relative font-heading text-lg text-white/30 hover:text-copper transition-all hover:tracking-widest py-1"
                      >
                        {social.name}
                        <span className="absolute bottom-0 right-0 w-0 h-[1px] bg-copper/40 group-hover:w-full transition-all duration-500"></span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Quote */}
            <div className="absolute bottom-10 left-0 w-full text-center px-6">
              <div className="flex flex-col gap-2">
                <div className="text-copper font-body tracking-[0.4em] text-[10px] uppercase opacity-60">
                  Ride Together • Stand Together • BUC India
                </div>
                <div className="text-white/10 font-heading text-xs tracking-widest uppercase">
                  Where Passion Meets the Pavement
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
