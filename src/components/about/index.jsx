import React, { useEffect, useState } from "react";
import { user_data } from "@/data/user-data";
import Services from "./services";

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
      <section className="about-root relative overflow-hidden">
        {/* Atmospheric Floating Background Glows */}
        {/* <div className="absolute -left-44 top-10 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none z-0" /> */}
        {/* <div className="absolute -right-44 top-1/3 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none z-0" /> */}

        {/* ── 01  Page Label / Hero Intro ───────────────────────────── */}
        <div className={`rev d1 ${mounted ? "in" : ""} mb-10 z-10 relative`}>
          <div className="flex items-center gap-2 mb-3">
            {/* <span className="block w-5 h-px bg-primary" /> */}
            <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-primary">
              Identity &amp; Portfolio
            </span>
          </div>
        </div>

        {/* ── 02  Bento Hero Card ────────────────────────────── */}
        <div className={`rev d2 ${mounted ? "in" : ""} z-10 relative mb-6`}>
          <div className="hero-glow relative overflow-hidden rounded-2xl border border-stroke bg-panel/30 backdrop-blur-md hover:border-primary/20 transition-all duration-300">
            <div className="flex flex-col md:flex-row items-stretch">

              {/* ── Left Side: Identity Info ── */}
              <div className="flex-grow flex flex-col justify-between p-6 sm:p-8 md:p-10 min-w-0 md:max-w-[65%]">
                <div>
                  <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-muted mb-4 block">
                    The Designer &amp; Developer
                  </span>

                  <h1
                    className="text-2xl sm:text-3xl md:text-[2.2rem] font-bold text-main leading-tight tracking-tight mt-2 capitalize"
                    style={{ fontFamily: "var(--font-sora), sans-serif", lineHeight: "1.15" }}
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

              {/* ── Right Side: 3D HTML Cursor-Tilting Workspace Mockup ── */}
              <div className="relative flex items-center justify-center overflow-hidden lg:overflow-visible border-t md:border-t-0 border-stroke/50 bg-surface/10 p-4 md:p-6 md:w-[32%] flex-shrink-0">
                {/* Glowing backdrop highlights */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-56 h-56 rounded-full bg-primary/10 blur-3xl animate-pulse" />
                </div>

                {/* 3D Perspective HTML Mockup widget */}
                <div className="perspective-visual-container relative z-10 w-full aspect-square max-w-[280px] md:max-w-full flex items-center justify-center p-4">
                  {/* Style tag inside container for dynamic parallax depths */}
                  <style>{`
                    .perspective-visual-container {
                      perspective: 1200px;
                    }
                    .visual-stage {
                      width: 100%;
                      height: 100%;
                      position: relative;
                      transform-style: preserve-3d;
                      cursor: pointer;
                    }
                    .visual-card {
                      position: absolute;
                      transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.4s, box-shadow 0.4s;
                      border: 1px solid rgba(255, 255, 255, 0.08);
                      border-radius: 12px;
                      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                      transform-style: preserve-3d;
                    }
                    
                    /* UI Canvas mockup background card at standard layer */
                    .card-ui-canvas {
                      width: 85%;
                      height: 70%;
                      left: 5%;
                      top: 15%;
                      background: #0d0d10;
                      transform: translateZ(10px);
                      z-index: 10;
                    }
                    .perspective-visual-container:hover .card-ui-canvas {
                      transform: translateZ(20px);
                      border-color: rgba(255, 255, 255, 0.15);
                    }

                    /* UX User Journey flowchart card floating above background on the top-left */
                    .card-ux-flow {
                      width: 58%;
                      height: 40%;
                      left: -10%;
                      top: 5%;
                      background: rgba(18, 18, 22, 0.65);
                      backdrop-filter: blur(12px);
                      transform: translateZ(50px);
                      z-index: 20;
                    }
                    .perspective-visual-container:hover .card-ux-flow {
                      transform: translateZ(70px) translateX(-5px) translateY(-5px);
                      border-color: rgba(var(--color-primary), 0.35);
                      box-shadow: -10px 15px 30px rgba(0, 0, 0, 0.65), 0 0 15px rgba(var(--color-primary), 0.1);
                    }

                    /* Figma Design tokens style guide card floating above background on the bottom-right */
                    .card-figma-style {
                      width: 58%;
                      height: 42%;
                      right: -10%;
                      bottom: 5%;
                      background: rgba(18, 18, 22, 0.65);
                      backdrop-filter: blur(12px);
                      transform: translateZ(80px);
                      z-index: 30;
                    }
                    .perspective-visual-container:hover .card-figma-style {
                      transform: translateZ(110px) translateX(8px) translateY(8px);
                      border-color: rgba(0, 242, 254, 0.35);
                      box-shadow: 10px 15px 30px rgba(0, 0, 0, 0.65), 0 0 15px rgba(0, 242, 254, 0.1);
                    }
                  `}</style>

                  <div
                    className="visual-stage"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={tiltStyle}
                  >

                    {/* 1. UI Canvas Mockup Background Card */}
                    <div className="visual-card card-ui-canvas p-4 flex flex-col justify-between overflow-hidden select-none">
                      <div>
                        {/* Header bar */}
                        <div className="flex items-center gap-1.5 mb-3 pb-2 border-b border-white/[0.04]">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                          <span className="text-[9px] font-mono text-subtle/30 ml-2">SaaS UI Canvas</span>
                        </div>
                        {/* Mockup Dashboard content */}
                        <div className="flex gap-2">
                          <div className="w-1/4 h-12 bg-white/[0.02] border border-white/[0.04] rounded p-1 flex flex-col justify-between">
                            <span className="w-4 h-1.5 bg-white/10 rounded" />
                            <span className="w-8 h-2 bg-white/20 rounded" />
                            <span className="w-6 h-1.5 bg-white/10 rounded" />
                          </div>
                          <div className="w-3/4 h-20 bg-white/[0.01] border border-white/[0.04] rounded p-2 flex flex-col justify-between">
                            <div className="flex justify-between items-center border-b border-white/[0.03] pb-1.5">
                              <span className="w-10 h-2 bg-primary/20 rounded" />
                              <span className="w-4 h-2 bg-white/10 rounded" />
                            </div>
                            <div className="flex gap-1 items-end h-8">
                              <div className="w-1.5 bg-primary/30 h-[40%] rounded-t" />
                              <div className="w-1.5 bg-primary/30 h-[70%] rounded-t" />
                              <div className="w-1.5 bg-primary/30 h-[50%] rounded-t" />
                              <div className="w-1.5 bg-primary/30 h-[90%] rounded-t" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[8px] font-mono text-subtle/30 pt-1.5 border-t border-white/[0.03]">
                        <span>Project Dashboard</span>
                        <span>v1.2.0</span>
                      </div>
                    </div>

                    {/* 2. UX Journey Flow Card */}
                    <div className="visual-card card-ux-flow p-3 flex flex-col justify-between select-none">
                      <div>
                        <span className="text-[8px] font-bold tracking-widest text-primary uppercase block mb-2">User Journey Map</span>
                        <div className="flex items-center justify-between gap-1 mt-2.5">
                          {/* Step-by-step flowchart */}
                          <div className="flex flex-col items-center">
                            <span className="w-4 h-4 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[7px] font-bold text-primary">A</span>
                            <span className="text-[6px] text-subtle/60 mt-1 font-mono">Select</span>
                          </div>
                          <span className="text-subtle/30 text-[9px] mb-2.5">&rarr;</span>
                          <div className="flex flex-col items-center">
                            <span className="w-4 h-4 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[7px] font-bold text-primary">B</span>
                            <span className="text-[6px] text-subtle/60 mt-1 font-mono">Checkout</span>
                          </div>
                          <span className="text-subtle/30 text-[9px] mb-2.5">&rarr;</span>
                          <div className="flex flex-col items-center">
                            <span className="w-4 h-4 rounded-full bg-[#00F2FE]/20 border border-[#00F2FE]/40 flex items-center justify-center text-[7px] font-bold text-[#00F2FE]">C</span>
                            <span className="text-[6px] text-subtle/60 mt-1 font-mono">Success</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[7px] text-subtle/50 font-mono mt-1 pt-1 border-t border-white/[0.03]">
                        <span>Conversion Rate</span>
                        <span className="text-primary font-bold">98.4%</span>
                      </div>
                    </div>

                    {/* 3. Figma Style Guide Card */}
                    <div className="visual-card card-figma-style p-3 flex flex-col justify-between overflow-hidden select-none">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <div className="w-2.5 h-2.5 rounded bg-[#00F2FE]/20 border border-[#00F2FE]/40 flex items-center justify-center">
                          <span className="w-1 h-1 rounded-full bg-[#00F2FE]" />
                        </div>
                        <span className="text-[8px] font-bold tracking-wider text-main uppercase">Style Palette</span>
                      </div>

                      <div className="flex-1 rounded border border-white/[0.04] bg-surface/20 p-2 flex flex-col justify-between">
                        {/* Style colors */}
                        <div className="flex justify-between items-center">
                          <span className="text-[7.5px] font-mono text-subtle/70">Colors</span>
                          <div className="flex gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#00F2FE]" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#48bb78]" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#cbd5e0]" />
                          </div>
                        </div>

                        {/* Spacing tokens visualizer */}
                        <div className="flex items-center justify-between mt-2.5">
                          <span className="text-[7.5px] font-mono text-subtle/70">Grid System</span>
                          <div className="flex gap-1.5 items-center w-2/3 h-1">
                            <div className="flex-1 h-px bg-[#00F2FE]/30" />
                            <span className="w-1 h-1 rounded-full bg-[#00F2FE]/60" />
                            <div className="flex-1 h-px bg-[#00F2FE]/30" />
                          </div>
                        </div>
                      </div>
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
            <div className="p-5 rounded-2xl border border-stroke bg-panel/30 backdrop-blur-md hover:border-primary/20 transition-all duration-300 flex flex-col justify-center">
              <span className="text-3xl font-extrabold text-main leading-none" style={{ fontFamily: "var(--font-sora), sans-serif" }}>5+</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted mt-1.5">Years Experience</span>
            </div>

            {/* Stat 2 */}
            <div className="p-5 rounded-2xl border border-stroke bg-panel/30 backdrop-blur-md hover:border-primary/20 transition-all duration-300 flex flex-col justify-center">
              <span className="text-3xl font-extrabold text-main leading-none" style={{ fontFamily: "var(--font-sora), sans-serif" }}>40+</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted mt-1.5">Projects Shipped</span>
            </div>

            {/* Stat 3 */}
            <div className="p-5 rounded-2xl border border-stroke bg-panel/30 backdrop-blur-md hover:border-primary/20 transition-all duration-300 flex flex-col justify-center">
              <span className="text-3xl font-extrabold text-main leading-none" style={{ fontFamily: "var(--font-sora), sans-serif" }}>98%</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted mt-1.5">Client Satisfaction</span>
            </div>

            {/* Availability CTA Card */}
            <div className="col-span-2 md:col-span-1 p-5 rounded-2xl border border-primary/20 bg-primary/[0.04] backdrop-blur-md flex items-center justify-between md:justify-center md:flex-col gap-2">
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
                className="relative p-6 rounded-2xl border border-stroke bg-panel/20 backdrop-blur-sm hover:border-primary/15 transition-all duration-300 flex flex-col"
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
          <div className="md:rounded-2xl md:border md:border-stroke overflow-hidden md:bg-panel/30 backdrop-blur-md">

            {/* Header Dashboard strip */}
            <div className="services-strip flex items-center gap-3 md:px-6 py-4 border-b border-stroke/60 bg-surface/5">
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
