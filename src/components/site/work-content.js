"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHero, Reveal } from "./motion";

export function WorkContent({ projects }) {
  const categories = ["All", ...new Set(projects.map((project) => project.category).filter(Boolean))];
  const [selected, setSelected] = useState("All");
  const visible = useMemo(() => selected === "All" ? projects : projects.filter((project) => project.category === selected), [projects, selected]);
  const [featured, ...rest] = visible;
  return <><PageHero eyebrow="Portfolio" title="Selected" accent="work" description="Products, platforms, and websites designed with care—from first sketch to shipped pixels." />
    <div className="filter-row">{categories.map((category) => <button type="button" className={category === selected ? "selected" : ""} onClick={() => setSelected(category)} key={category}>{category === selected && <motion.i layoutId="filter-pill" />}{category}</button>)}</div>
    {featured && <Reveal><Link href={`/work/${featured.slug}`} className="featured-case liquid"><div className="project-image"><Image src={featured.image_url || "/images/hero-illustration.png"} alt="" width={1000} height={660} priority /></div><div className="featured-case-copy"><small>Featured · {featured.category} · {featured.year}</small><h2>{featured.title}</h2><p>{featured.excerpt}</p><div className="metric-row">{(featured.metrics || []).slice(0, 3).map((metric) => <span key={metric.label}><b>{metric.value}</b><small>{metric.label}</small></span>)}</div><b className="case-link">View case study <ArrowUpRight size={18} /></b></div></Link></Reveal>}
    <motion.div layout className="work-grid">{rest.map((project, index) => <motion.div layout key={project.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}><Link href={`/work/${project.slug}`} className="work-card liquid"><div className="project-image"><Image src={project.image_url || "/images/hero-illustration.png"} alt="" width={700} height={460} /></div><div><small>{project.category} · {project.year}</small><h3>{project.title}</h3></div><span><ArrowUpRight size={17} /></span></Link></motion.div>)}</motion.div>
  </>;
}

export function WorkDetail({ project, nextProject }) {
  return <article className="case-study"><Link href="/work" className="back-link">← All projects</Link><Reveal><header><span className="eyebrow">{project.category} · {project.year}</span><h1>{project.title}</h1><p>{project.excerpt}</p></header></Reveal><Reveal><div className="case-image liquid"><Image src={project.image_url || "/images/hero-illustration.png"} alt={project.title} width={1300} height={780} priority /></div></Reveal><div className="fact-grid">{[["Client", project.client], ["Role", project.role], ["Category", project.category], ["Year", project.year]].map(([label, value]) => <div className="liquid" key={label}><small>{label}</small><b>{value || "—"}</b></div>)}</div><section className="case-narrative">{[["The challenge", project.challenge], ["The approach", project.approach], ["The outcome", project.outcome]].map(([title, text], index) => text && <Reveal className="narrative-row" delay={index * 0.05} key={title}><span>0{index + 1} — {title}</span><p>{text}</p></Reveal>)}</section>{project.metrics?.length > 0 && <div className="metrics-grid">{project.metrics.map((metric) => <div className="liquid" key={metric.label}><b>{metric.value}</b><small>{metric.label}</small></div>)}</div>}<div className="tag-list case-tags">{(project.tech_stack || project.tags || []).map((item) => <i key={item}>{item}</i>)}</div>{project.project_url && <a className="secondary-button" href={project.project_url} target="_blank" rel="noreferrer">View original <ArrowUpRight size={16} /></a>}{nextProject && <Link href={`/work/${nextProject.slug}`} className="next-card liquid"><Image src={nextProject.image_url || "/images/hero-illustration.png"} alt="" width={160} height={100} /><span><small>Next project</small><b>{nextProject.title}</b></span><ArrowUpRight size={20} /></Link>}</article>;
}
