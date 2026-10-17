"use client";

import { motion } from "framer-motion";

export function Reveal({ children, delay = 0, className = "" }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: .7, delay, ease: [0.16, 1, 0.3, 1] }}>{children}</motion.div>;
}

export function PageHero({ eyebrow, title, accent, description }) {
  return <Reveal className="mb-10">
    <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.25em] text-primary"><span className="h-px w-6 bg-primary" />{eyebrow}</span>
    <h1 className="font-display mt-3 text-3xl font-semibold tracking-[-.03em] md:text-4xl">{title} {accent && <span className="text-gradient">{accent}</span>}</h1>
    {description && <p className="mt-3 max-w-2xl text-muted-foreground">{description}</p>}
  </Reveal>;
}
