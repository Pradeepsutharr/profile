"use client";

import { motion } from "framer-motion";

export function Reveal({ children, delay = 0, className = "" }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}>{children}</motion.div>;
}

export function PageHero({ eyebrow, title, accent, description }) {
  return <Reveal className="page-hero">
    <span className="eyebrow">{eyebrow}</span>
    <h1>{title} {accent && <span className="text-gradient">{accent}</span>}</h1>
    {description && <p>{description}</p>}
  </Reveal>;
}
