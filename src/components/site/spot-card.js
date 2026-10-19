"use client";

import { useState } from "react";

export function SpotCard({ children }) {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  function updateSpot(event) {
    const box = event.currentTarget.getBoundingClientRect();
    setPosition({ x: event.clientX - box.left, y: event.clientY - box.top });
  }
  return (
    <div
      onMouseMove={updateSpot}
      className="glass-card group relative h-full overflow-hidden rounded-2xl p-6 transition hover:border-primary/50"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] opacity-80 transition-opacity"
        style={{
          background: `radial-gradient(320px circle at ${position.x}px ${position.y}px, color-mix(in srgb, var(--primary) 18%, transparent), transparent 62%)`,
        }}
      />
      <div className="relative z-1">{children}</div>
    </div>
  );
}
