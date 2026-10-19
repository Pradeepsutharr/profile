"use client";

import { Briefcase, GraduationCap } from "lucide-react";
import { Reveal } from "./motion";

function spanDates(item) {
  const start = item.start_date ? new Date(item.start_date).getFullYear() : "";
  const end = item.end_date ? new Date(item.end_date).getFullYear() : "Present";
  return start ? `${start} - ${end}` : end;
}

function Timeline({ icon: Icon, title, items, kind }) {
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <span className="liquid grid h-11 w-11 place-items-center rounded-xl text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <h2 className="font-display text-2xl font-semibold tracking-[-.025em]">
          {title}
        </h2>
      </div>
      <ol className="relative ml-5 border-l border-dashed">
        {items.map((item, index) => (
          <Reveal
            as="li"
            key={item.id}
            delay={index * 0.08}
            className="group relative mb-6 pl-8"
          >
            <span className="absolute -left-[7px] top-6 h-3.5 w-3.5 rounded-full border-2 border-primary bg-background transition group-hover:bg-primary group-hover:shadow-glow" />
            <div className="liquid rounded-2xl p-5 transition group-hover:border-primary/40">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                {spanDates(item)}
              </span>
              <h3 className="font-display mt-2 text-lg font-semibold tracking-[-.02em]">
                {kind === "education" ? item.degree : item.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {kind === "education" ? item.institution : item.company}
                {item.location ? ` · ${item.location}` : ""}
              </p>
              {item.summary && (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.summary}
                </p>
              )}
              {item.bullets?.length > 0 && (
                <ul className="mt-3 space-y-1 text-sm leading-relaxed text-muted-foreground">
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>• {bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}

function SkillBar({ skill }) {
  const score = Math.min(100, Math.max(0, Number(skill.score) || 0));
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="font-medium">{skill.name}</span>
        <span className="text-muted-foreground">{score}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className="bg-gradient-accent shadow-glow h-full rounded-full"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export function ResumeContent({ experience, education, skills }) {
  return (
    <>
      <Reveal className="mb-10">
        <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.25em] text-primary">
          {/* <span className="h-px w-6 bg-primary" /> */}
          Resume / CV
        </span>
        <h1 className="font-display mt-3 text-3xl font-semibold tracking-[-.03em] md:text-4xl">
          Product designer &{" "}
          <span className="text-gradient">frontend developer</span>
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Experience, education, and skills in UI/UX, product design, design
          systems, and React/Next.js - built for hiring managers who want proof,
          not fluff.
        </p>
      </Reveal>
      <div className="grid gap-10 xl:grid-cols-2">
        <Timeline
          icon={Briefcase}
          title="Experience"
          items={experience}
          kind="experience"
        />
        <Timeline
          icon={GraduationCap}
          title="Education"
          items={education}
          kind="education"
        />
      </div>
      <section className="mt-10">
        <Reveal className="mb-8">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.25em] text-primary">
            {/* <span className="h-px w-6 bg-primary" /> */}
            Skills
          </span>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-.03em] md:text-4xl">
            Design & engineering <span className="text-gradient">skills</span>
          </h2>
        </Reveal>
        <div className="liquid grid gap-5 rounded-2xl p-6 md:grid-cols-2">
          {skills.map((skill, index) => (
            <SkillBar key={skill.id} skill={skill} />
          ))}
        </div>
      </section>
    </>
  );
}
