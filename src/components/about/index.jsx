import React, { useEffect, useState } from "react";
import { user_data } from "@/data/user-data";
import Services from "./services";

/* ── mount-stagger hook ── */
function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => { const t = requestAnimationFrame(() => setM(true)); return () => cancelAnimationFrame(t); }, []);
  return m;
}

/* ── Section label ── */
function SectionLabel({ eyebrow, title }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-3">
        <span className="block w-5 h-px bg-primary" />
        <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-primary">
          {eyebrow}
        </span>
      </div>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-main leading-[1.15]"
        style={{ fontFamily: "'Sora', sans-serif" }}>
        {title}
      </h2>
    </div>
  );
}

/* ── Stat item ── */
function Stat({ value, label }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[2rem] font-bold tracking-tight text-main leading-none"
        style={{ fontFamily: "'Sora', sans-serif" }}>
        {value}
      </span>
      <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-subtle/60">
        {label}
      </span>
    </div>
  );
}

export default function About() {
  const mounted = useMounted();

  return (
    <>

      <section className={`about-root relative`}>

        {/* ── 01  Page label ───────────────────────────── */}
        <div className={`rev d1 ${mounted ? "in" : ""} mb-12`}>
          <SectionLabel eyebrow="Portfolio" title="About me" />
        </div>

        {/* ── 02  Hero card ────────────────────────────── */}
        <div className={`rev d2 ${mounted ? "in" : ""}`}>
          <div className="hero-glow relative overflow-hidden rounded-2xl border border-stroke bg-[#242426] mb-4">
            <div className="flex flex-col md:flex-row items-stretch">

              {/* ── Left: text ── */}
              <div className="flex-1 px-8 py-9 md:px-10 md:py-10 flex flex-col justify-between min-w-0">
                {/* corner dots — top left on mobile, hidden on md (moved to card top-right) */}
                <div>
                  <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-subtle/30 mb-5 block">
                    01 — Identity
                  </span>

                  <h1
                    className="text-xl md:text-2xl lg:text-[1.75rem] font-bold text-main leading-snug tracking-tight"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                  >
                    {user_data?.MainTitle}
                  </h1>
                </div>

                {user_data?.profile && (
                  <div className="mt-7 flex flex-wrap gap-2">
                    {user_data.profile.map((item) => (
                      <span
                        key={item.id}
                        className="chip inline-flex items-center gap-1.5 px-3.5 py-[5px] text-[11px] font-semibold tracking-[0.05em] uppercase text-primary bg-primary/[0.08] border border-primary/20 rounded-full transition-all duration-300 cursor-default"
                      >
                        <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                        {item.title}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Right: visual ── */}
              <div className="hero-visual-panel relative flex items-center justify-center overflow-hidden"
                style={{ minWidth: "220px", width: "100%", maxWidth: "100%" }}>

                {/* centre glow */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div style={{
                    width: "220px", height: "220px",
                    background: "radial-gradient(circle, rgba(255,219,112,0.10) 0%, transparent 65%)",
                    borderRadius: "50%",
                  }} />
                </div>

                {/* main SVG illustration */}
                <svg
                  viewBox="0 0 220 220"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="relative z-10 hero-svg"
                  // style={{ width: "200px", height: "200px", padding: "28px 20px" }}
                  aria-label="Designer at work illustration"
                >
                  {/* ── Orbit rings ── */}
                  <circle cx="110" cy="110" r="80" stroke="rgba(255,219,112,0.08)" strokeWidth="1" strokeDasharray="4 6" />
                  <circle cx="110" cy="110" r="56" stroke="rgba(255,219,112,0.13)" strokeWidth="1" strokeDasharray="2 5" />

                  {/* ── Center hexagon (monitor/screen) ── */}
                  <rect x="76" y="84" width="68" height="46" rx="6" fill="#2a2a2e" stroke="rgba(255,219,112,0.35)" strokeWidth="1.2" />
                  {/* screen content lines */}
                  <rect x="84" y="93" width="36" height="2.5" rx="1.2" fill="rgba(255,219,112,0.55)" />
                  <rect x="84" y="100" width="24" height="2" rx="1" fill="rgba(255,255,255,0.15)" />
                  <rect x="84" y="106" width="30" height="2" rx="1" fill="rgba(255,255,255,0.10)" />
                  {/* cursor blink */}
                  <rect x="84" y="113" width="2.5" height="8" rx="1" fill="rgba(255,219,112,0.7)">
                    <animate attributeName="opacity" values="1;0;1" dur="1.1s" repeatCount="indefinite" />
                  </rect>
                  {/* monitor stand */}
                  <rect x="106" y="130" width="8" height="8" rx="1" fill="#2a2a2e" stroke="rgba(255,219,112,0.2)" strokeWidth="1" />
                  <rect x="100" y="137" width="20" height="2.5" rx="1" fill="rgba(255,219,112,0.25)" />

                  {/* ── Orbit node: Figma-style ── */}
                  {/* ── Orbiting Elements Group ── */}
                  <g>
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 110 110"
                      to="360 110 110"
                      dur="24s"
                      repeatCount="indefinite"
                    />

                    {/* ── Figma (Top) ── */}
                    <g>
                      <circle
                        cx="110"
                        cy="30"
                        r="11"
                        fill="#2a2a2e"
                        stroke="rgba(255,219,112,0.4)"
                        strokeWidth="1.2"
                      />

                      <rect x="106" y="25.5" width="5" height="5" rx="1" fill="rgba(255,219,112,0.7)" />
                      <rect x="106" y="31" width="5" height="5" rx="1" fill="rgba(255,219,112,0.45)" />
                      <rect x="111.2" y="25.5" width="5" height="5" rx="1" fill="rgba(255,219,112,0.55)" />
                      <circle cx="113.5" cy="33.5" r="2.5" fill="rgba(255,219,112,0.5)" />
                    </g>

                    {/* ── Code (120°) ── */}
                    <g transform="rotate(120 110 110)">
                      <circle
                        cx="110"
                        cy="30"
                        r="11"
                        fill="#2a2a2e"
                        stroke="rgba(255,219,112,0.4)"
                        strokeWidth="1.2"
                      />

                      <text
                        x="110"
                        y="34"
                        textAnchor="middle"
                        fontSize="9"
                        fill="rgba(255,219,112,0.85)"
                        fontFamily="monospace"
                      >
                        {"</>"}
                      </text>
                    </g>

                    {/* ── Sparkle (240°) ── */}
                    <g transform="rotate(240 110 110)">
                      <circle
                        cx="110"
                        cy="30"
                        r="9"
                        fill="#2a2a2e"
                        stroke="rgba(255,219,112,0.3)"
                        strokeWidth="1.2"
                      />

                      <path
                        d="
                           M110 23
                           L111.5 28.5
                           L117 30
                           L111.5 31.5
                           L110 37
                           L108.5 31.5
                           L103 30
                           L108.5 28.5
                           Z
                         "
                        fill="rgba(255,219,112,0.65)"
                      />
                    </g>
                  </g>
                  {/* ── Connecting spokes (static) ── */}
                  <line x1="110" y1="84" x2="110" y2="41" stroke="rgba(255,219,112,0.08)" strokeWidth="0.8" strokeDasharray="3 4" />
                  <line x1="144" y1="110" x2="179" y2="110" stroke="rgba(255,219,112,0.08)" strokeWidth="0.8" strokeDasharray="3 4" />
                  <line x1="82" y1="126" x2="45" y2="147" stroke="rgba(255,219,112,0.08)" strokeWidth="0.8" strokeDasharray="3 4" />

                  {/* ── Floating pill: UX ── */}
                  <rect x="50" y="65" width="38" height="15" rx="7.5" fill="rgba(255,219,112,0.10)" stroke="rgba(255,219,112,0.25)" strokeWidth="0.8" />
                  <text x="69" y="75.5" textAnchor="middle" fontSize="7.5" fill="rgba(255,219,112,0.75)" fontFamily="'DM Sans', sans-serif" fontWeight="600" letterSpacing="0.06em">UI/UX</text>

                  {/* ── Floating pill: SaaS ── */}
                  <rect x="130" y="135" width="38" height="15" rx="7.5" fill="rgba(255,219,112,0.10)" stroke="rgba(255,219,112,0.25)" strokeWidth="0.8" />
                  <text x="149" y="145" textAnchor="middle" fontSize="7.5" fill="rgba(255,219,112,0.75)" fontFamily="'DM Sans', sans-serif" fontWeight="600" letterSpacing="0.06em">SaaS</text>

                  {/* ── Floating dot cluster ── */}
                  <circle cx="160" cy="165" r="2.5" fill="rgba(255,219,112,0.3)" />
                  <circle cx="168" cy="160" r="1.5" fill="rgba(255,219,112,0.2)" />
                  <circle cx="164" cy="173" r="1" fill="rgba(255,219,112,0.15)" />
                </svg>

                {/* corner dots top-right */}
                {/* <div className="absolute top-5 right-5 flex gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                  <span className="w-1.5 h-1.5 rounded-full bg-stroke" />
                  <span className="w-1.5 h-1.5 rounded-full bg-stroke" />
                </div> */}
              </div>

            </div>
          </div>
        </div>

        {/* ── 03  Stats bar ────────────────────────────── */}
        <div className={`rev d3 ${mounted ? "in" : ""}`}>
          <div className="flex flex-wrap items-center gap-6 px-7 py-5 rounded-2xl border border-stroke bg-[#242426] mb-4">
            <Stat value="5+" label="Years experience" />
            <div className="w-px self-stretch bg-stroke mx-1" />
            <Stat value="40+" label="Projects shipped" />
            <div className="w-px self-stretch bg-stroke mx-1" />
            <Stat value="98%" label="Client satisfaction" />

            <div className="ml-auto">
              <a
                href="#contact"
                className="cta-btn inline-flex items-center gap-2 px-4 py-2.5 text-[12px] font-semibold tracking-[0.04em] text-primary bg-primary/[0.08] border border-primary/20 rounded-full transition-all duration-300 no-underline"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Available for work
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                  <path d="M2.5 6.5h8M7 3.5l3.5 3-3.5 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* ── 04  Bio paragraphs ───────────────────────── */}
        <div className={`rev d3 ${mounted ? "in" : ""} flex flex-col gap-3 mb-4`}>
          {user_data?.summary?.map((item, i) => (
            <div
              key={item.id}
              className="bio-bar relative pl-6 pr-6 py-6 rounded-2xl border border-stroke bg-[#242426]"
            >
              <span className="absolute top-5 right-6 text-[10px] font-mono text-subtle/20 select-none">
                0{i + 1}
              </span>
              <p className="text-subtle/80 text-[14.5px] md:text-[15px] font-light leading-[1.85] m-0">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* ── Divider ─────────────────────────────────── */}
        <div className={`rev d4 ${mounted ? "in" : ""} flex items-center gap-3 my-14`}>
          <div className="flex-1 h-px bg-stroke" />
          <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
          <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
          <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
          <div className="flex-1 h-px bg-stroke" />
        </div>

        {/* ── 05  What I Do ────────────────────────────── */}
        <div className={`rev d4 ${mounted ? "in" : ""}`}>
          <SectionLabel eyebrow="Capabilities" title="What I Do" />

          <p className="text-subtle/75 text-[14.5px] md:text-[15px] font-light leading-[1.85] mb-8 max-w-2xl">
            I design intuitive, research-driven UI/UX experiences that improve usability,
            engagement, and conversions. My process focuses on user flows, wireframes,
            design systems, and pixel-perfect interfaces for web and SaaS products.
          </p>
        </div>

        {/* ── 06  Services wrapper ─────────────────────── */}
        <div className={`rev d5 ${mounted ? "in" : ""}`}>
          <div className="rounded-2xl border border-stroke overflow-hidden bg-[#242426]">

            {/* header strip */}
            <div className="services-strip flex items-center gap-3 px-7 py-4 border-b border-stroke">
              <span className="w-2 h-2 rounded-full bg-primary/70 flex-shrink-0" />
              <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-subtle/40">
                Services &amp; Expertise
              </span>
              {/* <div className="ml-auto flex gap-1.5">
                <span className="w-1 h-1 rounded-full bg-stroke" />
                <span className="w-1 h-1 rounded-full bg-stroke" />
                <span className="w-1 h-1 rounded-full bg-stroke" />
              </div> */}
            </div>

            <div className="p-7">
              <Services />
            </div>
          </div>
        </div>

      </section>
    </>
  );
}