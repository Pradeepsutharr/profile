import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero, Reveal } from "./motion";

function spanDates(item) { const start = item.start_date ? new Date(item.start_date).getFullYear() : ""; const end = item.end_date ? new Date(item.end_date).getFullYear() : "Present"; return start ? `${start} — ${end}` : end; }

export function ResumeContent({ experience, education, skills }) {
  return <><PageHero eyebrow="Resume" title="Experience &" accent="expertise" description="A product-minded practice spanning research, interface design, design systems, and frontend engineering." />
    <section className="resume-section"><Reveal><h2>Experience</h2></Reveal><div className="timeline">{experience.map((item, index) => <Reveal key={item.id} delay={index * 0.06}><article className="timeline-item liquid"><div><small>{spanDates(item)}</small><h3>{item.title}</h3><p>{item.company}{item.location ? ` · ${item.location}` : ""}</p></div><div><p>{item.summary}</p>{item.bullets?.length > 0 && <ul>{item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}</div></article></Reveal>)}</div></section>
    <section className="resume-section"><Reveal><h2>Education</h2></Reveal><div className="timeline">{education.map((item, index) => <Reveal key={item.id} delay={index * 0.06}><article className="timeline-item liquid"><div><small>{spanDates(item)}</small><h3>{item.degree}</h3><p>{item.institution}{item.location ? ` · ${item.location}` : ""}</p></div><p>{item.summary}</p></article></Reveal>)}</div></section>
    <section className="resume-section"><Reveal><h2>Skills & tools</h2></Reveal><div className="skill-grid">{skills.map((skill, index) => <Reveal key={skill.id} delay={index * 0.05}><div className="skill-item liquid"><span><b>{skill.name}</b><small>{skill.category}</small></span><strong>{skill.score}%</strong><div><i style={{ width: `${skill.score}%` }} /></div></div></Reveal>)}</div></section>
    <Link href="/contact" className="resume-cta">Like what you see? Let&apos;s build together. <ArrowUpRight /></Link>
  </>;
}
