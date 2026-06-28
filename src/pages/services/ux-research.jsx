import SEO from "@/common/seo";
import SEOConfig from "@/common/seo.config";
import Link from "next/link";

const deliverables = [
  {
    title: "User Interviews",
    desc: "Structured interviews to uncover user motivations, behaviors, and unmet needs.",
  },
  {
    title: "Persona Creation",
    desc: "Data-backed user personas representing target audience segments and goals.",
  },
  {
    title: "User Journey Mapping",
    desc: "Visualizing user flows, touchpoints, and friction areas across the experience.",
  },
  {
    title: "Competitor Analysis",
    desc: "Evaluating competing products to identify opportunities and differentiation.",
  },
  {
    title: "Usability Testing",
    desc: "Testing real user interactions to identify usability issues early.",
  },
  {
    title: "Insight Documentation",
    desc: "Clear research reports translating findings into actionable design decisions.",
  },
];

const focusPoints = [
  "Identify real user needs and behaviors",
  "Validate product ideas before development",
  "Reduce usability risks and rework",
  "Improve engagement and user satisfaction",
  "Enable data-driven design decisions",
];

export default function UXReasearch() {
  return (
    <>
      <SEO {...SEOConfig.uxResearch} />

      <section className="relative overflow-hidden container">
        {/* Background radial glow */}
        {/* <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" /> */}

        {/* Header */}
        <div className="relative mb-8">
          <h2 className="text-3xl text-main font-bold tracking-tight">UX Research Services</h2>
          <div className="relative w-12 h-1 bg-gradient-to-r from-primary to-primary/20 rounded-full mt-3">
            <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-25" />
          </div>
        </div>

        {/* Hero Card */}
        <div className="relative overflow-hidden rounded-2xl border border-stroke/40 bg-gradient-to-br from-surface/30 via-surface/10 to-transparent p-6 md:p-8 mb-8">
          <h1 className="text-primary text-xl md:text-2xl font-bold leading-relaxed tracking-tight">
            UX Research Services for User-Centered Digital Products
          </h1>
          <p className="text-subtle/90 mt-4 leading-relaxed font-light">
            Effective digital products begin with a deep understanding of users. I provide UX research services that uncover real user needs, behaviors, and pain points to guide product strategy and design decisions.
          </p>
          <p className="text-subtle/80 mt-3 leading-relaxed font-light text-sm">
            My research-driven approach helps reduce assumptions, validate ideas early, and ensure that design and development efforts are aligned with actual user expectations.
          </p>
        </div>

        {/* WHAT I DELIVER */}
        <div className="mt-10">
          <h2 className="text-main text-xl font-bold tracking-tight mb-6">
            What I Deliver
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {deliverables.map((item, index) => (
              <div
                key={index}
                className="group h-full rounded-2xl border border-stroke bg-surface/30 p-6 transition-all duration-300 hover:border-primary/30 hover:bg-input/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:shadow-primary/5 hover:-translate-y-1 flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 rounded px-2.5 py-1">
                    0{index + 1}
                  </span>
                  <h3 className="text-main group-hover:text-primary font-semibold text-base transition-colors duration-300">
                    {item.title}
                  </h3>
                </div>
                <p className="text-subtle/80 text-sm font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* APPROACH */}
        <div className="mt-12 bg-surface/25 border border-stroke/50 rounded-2xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute -left-16 -top-16 w-48 h-48 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
          <h2 className="text-main text-xl font-bold tracking-tight mb-4">
            My UX Research Approach
          </h2>
          <p className="text-subtle/90 font-light leading-relaxed mb-6">
            My UX research process begins by defining business objectives, identifying user groups, and selecting appropriate research methods. Insights gathered from research activities are translated into clear, actionable recommendations that inform design and product decisions.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {focusPoints.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-subtle text-sm font-light">
                <span className="text-primary mt-1">&bull;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* WHY IT MATTERS */}
        <div className="mt-12 p-6 md:p-8 rounded-2xl border border-stroke/50 bg-surface/30">
          <h2 className="text-main font-bold tracking-tight mb-4">
            Why UX Research Matters
          </h2>
          <p className="text-subtle/90 font-light leading-relaxed mb-4">
            UX research helps identify usability issues early, validate product direction, and improve overall user satisfaction. Understanding your audience before designing or building reduces risk, saves development time, and leads to more successful product outcomes.
          </p>
          <p className="text-subtle/90 text-sm font-light">
            <strong className="text-primary font-semibold">Best for:</strong> New product initiatives, MVP validation, redesign projects, and ongoing usability optimization.
          </p>
        </div>

        {/* COLLABORATION */}
        <div className="mt-12 mb-8">
          <h2 className="text-main text-xl font-bold tracking-tight mb-3">
            Research-Driven Design Collaboration
          </h2>
          <p className="text-subtle/90 font-light leading-relaxed">
            As both a Product Designer and Frontend Developer, I integrate research findings directly into design workflows, ensuring that insights translate into practical, implementable solutions.
          </p>
          <div className="mt-8 pt-6 border-t border-stroke/30 text-sm text-subtle/80">
            Related services:{" "}
            <Link href="/services/frontend-development" className="text-primary hover:underline font-semibold ml-1">
              Frontend Development
            </Link>
            ,{" "}
            <Link href="/services/product-design" className="text-primary hover:underline font-semibold ml-1">
              Product Design
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
