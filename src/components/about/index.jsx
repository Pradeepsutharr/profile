import React, { useEffect, useState } from "react";
import { user_data } from "@/data/user-data";
import Services from "./services";

// Toggle this boolean to enable (true) or disable (false) the 3D tilt & hover card expansion effects
const ENABLE_HOVER_EFFECT = true;

/* ── mount-stagger hook ── */
function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => {
    setM(true);
  }, []);
  return m;
}

/* ── Section label ── */
function SectionLabel({ eyebrow, title }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-2.5">
        {/* <span className="block w-4 h-px bg-primary" /> */}
        <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-primary">
          {eyebrow}
        </span>
      </div>
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-main leading-tight"
        style={{ fontFamily: "var(--font-sora) sans-serif" }}>
        {title}
      </h2>
    </div>
  );
}

export default function About() {
  const mounted = useMounted();
  const [tiltStyle, setTiltStyle] = useState({});

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;

    // Rotate maximum 15 degrees
    const rotateX = -((y - centerY) / centerY) * 15;
    const rotateY = ((x - centerX) / centerX) * 15;

    setTiltStyle({
      transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      transition: 'none' // snappy response during movement
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'rotateX(0deg) rotateY(0deg)',
      transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)' // smooth reset
    });
  };

  return (
    <>
      <section className="about-root">
        {/* Atmospheric Floating Background Glows */}
        {/* <div className="absolute -left-44 top-10 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none z-0" /> */}
        {/* <div className="absolute -right-44 top-1/3 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none z-0" /> */}

        {/* ── 01  Page Label / Hero Intro ───────────────────────────── */}
        <div className={`rev d1 ${mounted ? "in" : ""} md:mb-10 mb-4 z-10 relative -mt-3`}>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold capitalize text-main">
              About
            </span>
          </div>
        </div>

        {/* ── 02  Bento Hero Card ────────────────────────────── */}
        <div className={`rev d2 ${mounted ? "in" : ""} z-10 relative mb-6`}>
          <div className="hero-glow glass-panel relative overflow-hidden rounded-3xl hover:border-primary/20 transition-all duration-300">
            <div className="flex flex-col md:flex-row items-stretch">

              {/* ── Left Side: Identity Info ── */}
              <div className="flex-grow flex flex-col justify-between p-6 sm:p-8 md:p-10 min-w-0 md:max-w-[65%]">
                <div>
                  <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-muted mb-4 block">
                    The Designer &amp; Developer
                  </span>

                  <h1
                    className="text-2xl sm:text-3xl md:text-[2.2rem] font-bold text-main mt-2 capitalize"
                    style={{ fontFamily: "var(--font-sora), sans-serif", lineHeight: "1.2" }}
                  >
                    Crafting SaaS &amp; Web Interfaces as a <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Product Designer</span> &amp; Frontend Developer
                  </h1>

                  <p className="text-subtle/80 font-light text-sm md:text-base leading-relaxed mt-4">
                    Hi, I'm <span className="text-main font-semibold capitalize">{user_data?.name || "Pradeep"}</span>. I specialize in UX research, user interface design (UI/UX), scalable design systems, and building high-performance responsive web applications with React and Next.js.
                  </p>
                </div>

                {user_data?.profile && (
                  <div className="mt-8 flex flex-wrap gap-2">
                    {user_data.profile.map((item) => (
                      <span
                        key={item.id}
                        className="chip inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[10px] font-bold tracking-[0.05em] uppercase text-primary bg-primary/[0.08] border border-primary/20 rounded-full transition-all duration-300 cursor-default"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        {item.title}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Right Side: 3D "Design → Code" Isometric Parallax Stack ── */}
              <div className="relative flex items-center justify-center overflow-hidden lg:overflow-visible border-t md:border-t-0 border-stroke/50 bg-surface/10 p-4 md:p-6 md:w-[35%] flex-shrink-0">
                {/* Glowing background spotlight */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-52 h-52 rounded-full bg-primary/10 blur-[90px] animate-pulse" />
                </div>

                <div className={`perspective-visual-container ${ENABLE_HOVER_EFFECT ? "hover-enabled" : ""} relative z-10 w-full min-h-[310px] flex items-center justify-center`}>
                  <div
                    className="visual-stage-3d"
                    onMouseMove={ENABLE_HOVER_EFFECT ? handleMouseMove : undefined}
                    onMouseLeave={ENABLE_HOVER_EFFECT ? handleMouseLeave : undefined}
                    style={ENABLE_HOVER_EFFECT ? tiltStyle : {}}
                  >

                    {/* ── Layer 1: Component Layout Wireframe (Base/Bottom) ── */}
                    <div className="stack-layer layer-code bg-panel border border-stroke/40 p-3 flex flex-col justify-between font-sans text-[9px] select-none text-subtle/85 shadow-lg">
                      <div className="flex items-center justify-between border-b border-stroke/20 pb-1.5 mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ff5f56]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ffbd2e]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#27c93f]" />
                        </div>
                        <span className="text-[7.5px] text-muted/80 tracking-wide font-mono">Wireframe.layout</span>
                      </div>

                      {/* Bento grid layout widgets */}
                      <div className="flex-grow grid grid-cols-12 gap-2 mt-1">
                        {/* Widget 1: Profile Wireframe (5 cols) */}
                        <div className="col-span-5 bg-surface/30 border border-stroke/10 rounded p-1.5 flex flex-col justify-between h-[52px]">
                          <div className="flex items-center gap-1">
                            <div className="w-4 h-4 rounded-full bg-stroke/20 border border-primary/20 flex items-center justify-center relative">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping absolute" />
                              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <div className="w-10 h-1 bg-stroke/40 rounded-full" />
                              <div className="w-6 h-0.8 bg-stroke/25 rounded-full" />
                            </div>
                          </div>
                          <div className="w-full h-2.5 bg-primary/10 rounded border border-primary/15" />
                        </div>

                        {/* Widget 2: Animating Bar Chart Grid (7 cols) */}
                        <div className="col-span-7 bg-surface/30 border border-stroke/10 rounded p-1.5 flex flex-col justify-between h-[52px]">
                          <span className="text-[5.5px] text-muted uppercase font-bold tracking-wider mb-1">Metrics Box</span>
                          <div className="w-full flex justify-between items-end h-7 pt-1 overflow-hidden">
                            <svg className="w-full h-full" viewBox="0 0 80 25" preserveAspectRatio="none">
                              {/* Bar 1 */}
                              <rect x="5" y="2" width="6" height="20" rx="1" fill="rgba(var(--color-primary), 0.3)" stroke="rgb(var(--color-primary))" strokeWidth="0.5">
                                <animate attributeName="height" values="20;8;20" dur="2s" repeatCount="indefinite" />
                                <animate attributeName="y" values="2;14;2" dur="2s" repeatCount="indefinite" />
                              </rect>
                              {/* Bar 2 */}
                              <rect x="20" y="8" width="6" height="14" rx="1" fill="rgba(var(--color-primary), 0.3)" stroke="rgb(var(--color-primary))" strokeWidth="0.5">
                                <animate attributeName="height" values="14;22;14" dur="2.5s" repeatCount="indefinite" />
                                <animate attributeName="y" values="8;0;8" dur="2.5s" repeatCount="indefinite" />
                              </rect>
                              {/* Bar 3 */}
                              <rect x="35" y="12" width="6" height="10" rx="1" fill="rgba(var(--color-primary), 0.3)" stroke="rgb(var(--color-primary))" strokeWidth="0.5">
                                <animate attributeName="height" values="10;18;10" dur="1.8s" repeatCount="indefinite" />
                                <animate attributeName="y" values="12;4;12" dur="1.8s" repeatCount="indefinite" />
                              </rect>
                              {/* Bar 4 */}
                              <rect x="50" y="4" width="6" height="18" rx="1" fill="rgba(var(--color-primary), 0.3)" stroke="rgb(var(--color-primary))" strokeWidth="0.5">
                                <animate attributeName="height" values="18;10;18" dur="3s" repeatCount="indefinite" />
                                <animate attributeName="y" values="4;12;4" dur="3s" repeatCount="indefinite" />
                              </rect>
                              {/* Bar 5 */}
                              <rect x="65" y="10" width="6" height="12" rx="1" fill="rgba(var(--color-primary), 0.3)" stroke="rgb(var(--color-primary))" strokeWidth="0.5">
                                <animate attributeName="height" values="12;6;12" dur="2.2s" repeatCount="indefinite" />
                                <animate attributeName="y" values="10;16;10" dur="2.2s" repeatCount="indefinite" />
                              </rect>
                            </svg>
                          </div>
                        </div>

                        {/* Widget 3: Commits Activity Matrix (12 cols) */}
                        <div className="col-span-12 bg-surface/30 border border-stroke/10 rounded p-1.5 flex items-center justify-between h-[28px] overflow-hidden">
                          <span className="text-[5.5px] text-muted uppercase font-bold tracking-wider">UI Grid State</span>
                          <div className="flex gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-sm bg-primary/20 border border-primary/30 flex items-center justify-center">
                              <span className="w-1.2 h-1.2 rounded-full bg-primary animate-ping" />
                            </span>
                            <span className="w-2.5 h-2.5 rounded-sm bg-[#ff5f56]/20 border border-[#ff5f56]/30" />
                            <span className="w-2.5 h-2.5 rounded-sm bg-[#ffbd2e]/20 border border-[#ffbd2e]/30 animate-pulse" />
                            <span className="w-2.5 h-2.5 rounded-sm bg-stroke/10 border border-stroke/20" />
                            <span className="w-2.5 h-2.5 rounded-sm bg-[#27c93f]/20 border border-[#27c93f]/30" />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-stroke/10 text-[7px] text-muted/60">
                        <span>Wireframe Component System</span>
                        <span>Responsive Grid Layout</span>
                      </div>
                    </div>

                    {/* ── Layer 2: Figma / Wireframe Layer (Middle) ── */}
                    <div className="stack-layer layer-design blueprint-grid bg-background border border-stroke/20 p-3 flex flex-col justify-between select-none">
                      <div className="absolute top-2.5 left-2.5 text-[7px] font-mono tracking-widest text-primary/70 font-black">
                        PROTOTYPE WORKSPACE
                      </div>

                      {/* Wireframe design markers */}
                      <div className="relative flex-grow flex items-center justify-center">
                        {/* Artboard Frame A */}
                        <div className="absolute left-2 w-[42px] h-[58px] border border-stroke/40 rounded bg-panel/30 flex flex-col justify-between p-1">
                          <span className="text-[4.5px] font-mono text-muted">Frame_1</span>
                          <div className="space-y-1">
                            <div className="h-0.8 bg-stroke/40 rounded w-4/5" />
                            <div className="h-0.8 bg-stroke/30 rounded w-2/3" />
                          </div>
                          <div className="h-2 bg-primary/20 rounded-sm w-full" />
                        </div>

                        {/* Artboard Frame B */}
                        <div className="absolute right-2 w-[42px] h-[58px] border border-stroke/40 rounded bg-panel/30 flex flex-col justify-between p-1">
                          <span className="text-[4.5px] font-mono text-muted">Frame_2</span>
                          <div className="space-y-1">
                            <div className="h-0.8 bg-stroke/40 rounded w-full" />
                            <div className="h-0.8 bg-stroke/30 rounded w-3/4" />
                          </div>
                          <div className="h-2 bg-primary/45 rounded-sm w-full" />
                        </div>

                        {/* Interactive flow line with Virtual Cursor */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" fill="none">
                          {/* Target Bezier Path */}
                          <path
                            d="M 45 42 C 75 15, 95 65, 125 42"
                            stroke="rgb(var(--color-primary))"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                          >
                            <animate
                              attributeName="d"
                              dur="5s"
                              repeatCount="indefinite"
                              values="
                                M 45 42 C 75 15, 95 65, 125 42;
                                M 45 42 C 75 50, 95 10, 125 42;
                                M 45 42 C 75 15, 95 65, 125 42
                              "
                            />
                          </path>

                          {/* Control lines */}
                          <line x1="45" y1="42" x2="75" y2="15" stroke="rgba(var(--color-primary), 0.35)" strokeWidth="0.75" strokeDasharray="1.5 1.5">
                            <animate attributeName="y2" dur="5s" repeatCount="indefinite" values="15; 50; 15" />
                          </line>
                          <line x1="125" y1="42" x2="95" y2="65" stroke="rgba(var(--color-primary), 0.35)" strokeWidth="0.75" strokeDasharray="1.5 1.5">
                            <animate attributeName="y2" dur="5s" repeatCount="indefinite" values="65; 10; 65" />
                          </line>

                          {/* Handles */}
                          <circle cx="75" cy="15" r="2.2" fill="rgb(var(--color-background))" stroke="rgb(var(--color-primary))" strokeWidth="1">
                            <animate attributeName="cy" dur="5s" repeatCount="indefinite" values="15; 50; 15" />
                          </circle>
                          <circle cx="95" cy="65" r="2.2" fill="rgb(var(--color-background))" stroke="rgb(var(--color-primary))" strokeWidth="1">
                            <animate attributeName="cy" dur="5s" repeatCount="indefinite" values="65; 10; 65" />
                          </circle>

                          {/* Virtual dragging cursor */}
                          <g transform="translate(73, 13)">
                            <animateTransform
                              attributeName="transform"
                              type="translate"
                              dur="5s"
                              repeatCount="indefinite"
                              values="
                                73, 13;
                                73, 48;
                                73, 13
                              "
                            />
                            <path d="M0 0 L4 10 L6 7.5 L9 9.5 L10 8.5 L7 6.5 L9 4 Z" fill="white" stroke="rgb(var(--color-primary))" strokeWidth="0.8" />
                          </g>
                        </svg>

                        <span className="absolute top-[80%] left-1/2 -translate-x-1/2 text-[6px] font-mono text-primary bg-background border border-primary/20 rounded px-1.5 shadow-sm">
                          User Flow Connection
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[7px] text-muted/70 font-mono">
                        <span>Figma Workspace</span>
                        <span>Interactive Flow</span>
                      </div>
                    </div>

                    {/* ── Layer 3: Live UI Dashboard Preview (Top/Front) ── */}
                    <div className="stack-layer layer-ui bg-surface border border-stroke/30 p-3.5 flex flex-col justify-between select-none hover:border-primary/30 shadow-2xl">
                      {/* Card Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-primary to-primary/60 flex items-center justify-center text-[8px] font-bold text-black uppercase shadow-sm">
                              P
                            </div>
                            <span className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full bg-[#27c93f] border border-stroke/50" />
                          </div>
                          <div>
                            <div className="text-[8.5px] font-extrabold text-main leading-tight">Live UI</div>
                            <div className="text-[6.5px] text-subtle/80">Active System</div>
                          </div>
                        </div>
                        <span className="text-[6.5px] font-bold uppercase tracking-wider text-primary bg-primary/[0.08] border border-primary/20 rounded px-1.5 py-0.5">
                          v2.0
                        </span>
                      </div>

                      {/* Mini Product Dashboard Layout */}
                      <div className="flex-grow grid grid-cols-12 gap-2 mt-1">
                        {/* Left: Radial Progress Ring (Goal KPI) */}
                        <div className="col-span-5 bg-panel/50 border border-stroke/20 rounded-lg p-1.5 flex flex-col justify-between items-center text-center shadow-inner">
                          <span className="text-[5.5px] text-muted uppercase font-bold tracking-wider">Goal Progress</span>
                          <div className="relative w-9 h-9 flex items-center justify-center my-1">
                            {/* SVG Radial Ring */}
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                              <path
                                strokeWidth="3"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                className="text-stroke/20"
                              />
                              <path
                                strokeWidth="3"
                                strokeDasharray="84, 100"
                                strokeLinecap="round"
                                stroke="rgb(var(--color-primary))"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              >
                                <animate attributeName="stroke-dasharray" values="0, 100; 84, 100; 78, 100; 84, 100" dur="4s" repeatCount="indefinite" />
                              </path>
                            </svg>
                            <div className="absolute flex flex-col items-center justify-center">
                              <span className="text-[7.5px] font-extrabold text-main">84%</span>
                            </div>
                          </div>
                          <span className="text-[5.5px] text-primary font-bold">+12.4% MoM</span>
                        </div>

                        {/* Right: Curve Line Chart */}
                        <div className="col-span-7 bg-panel/50 border border-stroke/20 rounded-lg p-1.5 flex flex-col justify-between shadow-inner">
                          <div className="flex justify-between items-center mb-0.5">
                            <span className="text-[5.5px] text-muted uppercase font-bold tracking-wider">Conversion</span>
                            <span className="text-[7.5px] font-extrabold text-primary">+24.5%</span>
                          </div>

                          {/* Line Chart SVG */}
                          <div className="w-full h-8 relative">
                            <svg className="w-full h-full" viewBox="0 0 120 40" preserveAspectRatio="none">
                              <defs>
                                <linearGradient id="mini-chart-grad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="rgb(var(--color-primary))" stopOpacity="0.35" />
                                  <stop offset="100%" stopColor="rgb(var(--color-primary))" stopOpacity="0" />
                                </linearGradient>
                                <filter id="mini-glow" x="-20%" y="-20%" width="140%" height="140%">
                                  <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="rgb(var(--color-primary))" floodOpacity="0.3" />
                                </filter>
                              </defs>

                              {/* Grid lines */}
                              <line x1="0" y1="10" x2="120" y2="10" stroke="rgba(var(--color-stroke), 0.15)" strokeWidth="0.5" strokeDasharray="2 2" />
                              <line x1="0" y1="22" x2="120" y2="22" stroke="rgba(var(--color-stroke), 0.15)" strokeWidth="0.5" strokeDasharray="2 2" />
                              <line x1="0" y1="34" x2="120" y2="34" stroke="rgba(var(--color-stroke), 0.15)" strokeWidth="0.5" strokeDasharray="2 2" />

                              {/* Gradient Fill with Realtime Wave Morphing */}
                              <path
                                d="M0 25 C15 22, 25 8, 40 16 C55 24, 75 4, 95 10 C108 14, 115 6, 120 4 L120 40 L0 40 Z"
                                fill="url(#mini-chart-grad)"
                              >
                                <animate
                                  attributeName="d"
                                  dur="4s"
                                  repeatCount="indefinite"
                                  values="
                                    M0 25 C15 22, 25 8, 40 16 C55 24, 75 4, 95 10 C108 14, 115 6, 120 4 L120 40 L0 40 Z;
                                    M0 20 C15 28, 25 14, 40 22 C55 30, 75 8, 95 16 C108 20, 115 10, 120 8 L120 40 L0 40 Z;
                                    M0 25 C15 22, 25 8, 40 16 C55 24, 75 4, 95 10 C108 14, 115 6, 120 4 L120 40 L0 40 Z"
                                />
                              </path>

                              {/* Main Curve with Glow and Wave Morphing */}
                              <path
                                d="M0 25 C15 22, 25 8, 40 16 C55 24, 75 4, 95 10 C108 14, 115 6, 120 4"
                                fill="none"
                                stroke="rgb(var(--color-primary))"
                                strokeWidth="1.8"
                                filter="url(#mini-glow)"
                              >
                                <animate
                                  attributeName="d"
                                  dur="4s"
                                  repeatCount="indefinite"
                                  values="
                                    M0 25 C15 22, 25 8, 40 16 C55 24, 75 4, 95 10 C108 14, 115 6, 120 4;
                                    M0 20 C15 28, 25 14, 40 22 C55 30, 75 8, 95 16 C108 20, 115 10, 120 8;
                                    M0 25 C15 22, 25 8, 40 16 C55 24, 75 4, 95 10 C108 14, 115 6, 120 4"
                                />
                              </path>

                              {/* Interactive Nodes moving in sync */}
                              <circle cx="40" cy="16" r="1.5" fill="rgb(var(--color-surface))" stroke="rgb(var(--color-primary))" strokeWidth="1">
                                <animate attributeName="cy" dur="4s" repeatCount="indefinite" values="16; 22; 16" />
                              </circle>
                              <circle cx="95" cy="10" r="1.5" fill="rgb(var(--color-surface))" stroke="rgb(var(--color-primary))" strokeWidth="1">
                                <animate attributeName="cy" dur="4s" repeatCount="indefinite" values="10; 16; 10" />
                              </circle>
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Row 2: KPI grid */}
                      <div className="grid grid-cols-3 gap-2 mt-2 border-t border-stroke/20 pt-2">
                        <div className="bg-panel/40 border border-stroke/10 rounded py-1 text-center flex flex-col justify-center">
                          <span className="text-[5px] text-muted uppercase font-bold">LTV Growth</span>
                          <span className="text-[7.5px] font-extrabold text-main">$4,820</span>
                        </div>
                        <div className="bg-panel/40 border border-stroke/10 rounded py-1 text-center flex flex-col justify-center">
                          <span className="text-[5px] text-muted uppercase font-bold">CAC Ratio</span>
                          <span className="text-[7.5px] font-extrabold text-[#27c93f]">$110</span>
                        </div>
                        <div className="bg-panel/40 border border-stroke/10 rounded py-1 text-center flex flex-col justify-center">
                          <span className="text-[5px] text-muted uppercase font-bold">ROI Metric</span>
                          <span className="text-[7.5px] font-extrabold text-primary">480%</span>
                        </div>
                      </div>

                      {/* Toggle component */}
                      <div className="flex items-center justify-between border-t border-stroke/20 pt-2 mt-2">
                        <span className="text-[7px] text-subtle/80 font-mono">Live tracking</span>
                        <div className="w-5 h-3 rounded-full bg-primary/20 border border-primary/30 p-0.5 flex items-center cursor-pointer justify-end transition-all duration-300">
                          <div className="w-1.8 h-1.8 rounded-full bg-primary shadow-sm animate-pulse" />
                        </div>
                      </div>
                    </div>

                    {/* ── Orbiting 3D Badges ── */}
                    {/* Figma */}
                    <div className="badge-3d badge-figma-3d bg-panel/95 border border-stroke/40 shadow-xl" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="6" r="4" fill="rgba(var(--color-primary),0.9)" />
                        <path d="M8 10a4 4 0 100 8 4 4 0 000-8z" fill="#00F2FE" opacity="0.85" />
                        <path d="M12 10h2a4 4 0 010 8h-2v-8z" fill="#ff8a5c" opacity="0.85" />
                      </svg>
                    </div>

                    {/* React */}
                    <div className="badge-3d badge-react-3d bg-panel/95 border border-stroke/40 shadow-xl" aria-hidden="true">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgb(var(--color-primary))" strokeWidth="1.6">
                        <ellipse cx="12" cy="12" rx="10" ry="4.2" />
                        <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
                        <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
                        <circle cx="12" cy="12" r="1.8" fill="rgb(var(--color-primary))" stroke="none" />
                      </svg>
                    </div>

                    {/* Growth Badge */}
                    <div className="badge-3d badge-tailwind-3d bg-panel/95 border border-stroke/40 shadow-xl text-primary flex items-center justify-center" aria-hidden="true">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 2 22 9"></polygon>
                        <path d="M22 13v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6"></path>
                      </svg>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── 03  Stats Bento Grid ────────────────────────────── */}
        <div className={`rev d3 ${mounted ? "in" : ""} mb-6 z-10 relative`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            {/* Stat 1 */}
            <div className="p-5 rounded-2xl glass-card glass-card-hoverable flex flex-col justify-center">
              <span className="text-3xl font-extrabold text-main leading-none" style={{ fontFamily: "var(--font-sora), sans-serif" }}>5+</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted mt-1.5">Years Experience</span>
            </div>

            {/* Stat 2 */}
            <div className="p-5 rounded-2xl glass-card glass-card-hoverable flex flex-col justify-center">
              <span className="text-3xl font-extrabold text-main leading-none" style={{ fontFamily: "var(--font-sora), sans-serif" }}>40+</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted mt-1.5">Projects Shipped</span>
            </div>

            {/* Stat 3 */}
            <div className="p-5 rounded-2xl glass-card glass-card-hoverable flex flex-col justify-center">
              <span className="text-3xl font-extrabold text-main leading-none" style={{ fontFamily: "var(--font-sora), sans-serif" }}>98%</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted mt-1.5">Client Satisfaction</span>
            </div>

            {/* Availability CTA Card */}
            <div className="col-span-2 md:col-span-1 p-5 rounded-2xl border border-primary/25 bg-primary/[0.08] backdrop-blur-md flex items-center justify-between md:justify-center md:flex-col gap-2 shadow-lg">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary relative flex">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-primary">Available for Work</span>
              </div>
              <a
                href="/contact"
                className="bg-primary/10 border border-primary/25 text-primary hover:bg-primary hover:text-black py-1.5 px-3 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300"
              >
                Hire Me &rarr;
              </a>
            </div>

          </div>
        </div>

        {/* ── 04  Bio Bento Cards ───────────────────────── */}
        <div className={`rev d3 ${mounted ? "in" : ""} z-10 relative mb-12`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user_data?.summary?.map((item, i) => (
              <div
                key={item.id}
                className="relative p-6 rounded-2xl glass-card glass-card-hoverable flex flex-col"
              >
                <span className="absolute top-5 right-6 text-2xl font-black text-subtle/5 font-mono select-none">
                  0{i + 1}
                </span>
                <div className="flex gap-3 mb-3">
                  <div className="w-1.5 h-6 bg-primary/60 rounded-full" />
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary/80 mt-1">
                    {i === 0 ? "Product Thinking & UX Research" : "Design-to-Code Engineering"}
                  </span>
                </div>
                <p className="text-subtle/80 text-[14px] font-light leading-relaxed m-0">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Divider ─────────────────────────────────── */}
        <div className={`rev d4 ${mounted ? "in" : ""} flex items-center gap-3 my-12 z-10 relative`}>
          <div className="flex-1 h-px bg-stroke/40" />
          <span className="w-1 h-1 rounded-full bg-primary/20" />
          <span className="w-1 h-1 rounded-full bg-primary/20" />
          <span className="w-1 h-1 rounded-full bg-primary/20" />
          <div className="flex-1 h-px bg-stroke/40" />
        </div>

        {/* ── 05  What I Do (Capabilities Section) ────────────────────────────── */}
        <div className={`rev d4 ${mounted ? "in" : ""} z-10 relative mb-6`}>
          <SectionLabel eyebrow="Capabilities" title="What I Do" />

          <p className="text-subtle/75 text-[14.5px] md:text-[15.5px] font-light leading-relaxed">
            I offer research-driven **UI/UX design** and **frontend development services** that bridge the gap between creative visual logic and technical performance. By crafting responsive web applications, modular design tokens, and usability-tested interfaces, I help founders turn digital ideas into high-converting products.
          </p>
        </div>

        {/* ── 06  Services Section Dashboard ─────────────────────── */}
        <div className={`rev d5 ${mounted ? "in" : ""} z-10 relative`}>
          <div className="md:rounded-3xl overflow-hidden glass-card -mx-5 px-5 md:mx-0 md:px-0 !border-none">

            {/* Header Dashboard strip */}
            <div className="services-strip flex items-center gap-3 md:px-6 py-4">
              <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-muted">
                Services &amp; Specialization Area
              </span>
            </div>

            <div className="py-4 md:p-6">
              <Services />
            </div>
          </div>
        </div>

      </section>
    </>
  );
}