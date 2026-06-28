import SEO from "@/common/seo";
import SEOConfig from "@/common/seo.config";
import Link from "next/link";

const deliverables = [
  {
    title: "Product Discovery and UX Strategy",
    desc: "Defining product goals, identifying user needs, and shaping a clear product direction.",
  },
  {
    title: "Wireframing and User Flows",
    desc: "Structuring information architecture and mapping user journeys for intuitive navigation.",
  },
  {
    title: "UI Design",
    desc: "Designing clean, scalable, and user-friendly interfaces aligned with product goals.",
  },
  {
    title: "Design Systems",
    desc: "Creating reusable components and visual systems for long-term product consistency.",
  },
  {
    title: "MVP Design",
    desc: "Designing lean, testable product versions that validate ideas quickly.",
  },
  {
    title: "Handoff-Ready Assets",
    desc: "Developer-ready design files with clear specifications and interaction states.",
  },
];

const processPoints = [
  "Define business goals and success metrics",
  "Understand user behavior and context",
  "Map journeys and prioritize features",
  "Design scalable interface systems",
  "Validate concepts before development",
];

export default function ProductDesign() {
  return (
    <>
      <SEO {...SEOConfig.productDesign} />

      <section className="relative overflow-hidden container">
        {/* Background radial glow */}
        {/* <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" /> */}

        {/* Header */}
        <div className="relative mb-8">
          <h2 className="text-3xl text-main font-bold tracking-tight">Product Design Services</h2>
          <div className="relative w-12 h-1 bg-gradient-to-r from-primary to-primary/20 rounded-full mt-3">
            <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-25" />
          </div>
        </div>

        {/* Hero Card */}
        <div className="relative overflow-hidden rounded-2xl border border-stroke/40 bg-gradient-to-br from-surface/30 via-surface/10 to-transparent p-6 md:p-8 mb-8">
          <h1 className="text-primary text-xl md:text-2xl font-bold leading-relaxed tracking-tight">
            Product Design for Startups and SaaS Platforms
          </h1>
          <p className="text-subtle/90 mt-4 leading-relaxed font-light">
            I help founders and product teams turn ideas into structured, usable, and scalable digital products. My product design approach spans from early concept validation to polished user interfaces and implementation-ready design systems.
          </p>
          <p className="text-subtle/80 mt-3 leading-relaxed font-light text-sm">
            By combining UX strategy, interface design, and frontend awareness, I focus on building products that solve real user problems while aligning with business objectives.
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

        {/* PROCESS */}
        <div className="mt-12 bg-surface/25 border border-stroke/50 rounded-2xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute -left-16 -top-16 w-48 h-48 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
          <h2 className="text-main text-xl font-bold tracking-tight mb-4">
            My Product Design Process
          </h2>
          <p className="text-subtle/90 font-light leading-relaxed mb-6">
            I collaborate closely with stakeholders to define product vision, map user journeys, and design experiences that deliver measurable value. Each stage is structured to reduce risk and ensure that every feature has a clear purpose.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {processPoints.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-subtle text-sm font-light">
                <span className="text-primary mt-1">&bull;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* BEST FIT */}
        <div className="mt-12 p-6 md:p-8 rounded-2xl border border-stroke/50 bg-surface/30">
          <h2 className="text-main font-bold tracking-tight mb-4">
            Best Fit For
          </h2>
          <p className="text-subtle/90 font-light leading-relaxed">
            Early-stage startups, SaaS platforms, founders validating new ideas, and teams looking to improve existing digital products.
          </p>
        </div>

        {/* COLLABORATION */}
        <div className="mt-12 mb-8">
          <h2 className="text-main text-xl font-bold tracking-tight mb-3">
            Product Design with Implementation in Mind
          </h2>
          <p className="text-subtle/90 font-light leading-relaxed">
            With hands-on frontend development experience in React and Next.js, I design products that are technically feasible and ready for efficient implementation, reducing design-to-development gaps.
          </p>
          <div className="mt-8 pt-6 border-t border-stroke/30 text-sm text-subtle/80">
            Related services:{" "}
            <Link href="/services/ui-design" className="text-primary hover:underline font-semibold ml-1">
              UI Design
            </Link>
            ,{" "}
            <Link href="/services/frontend-development" className="text-primary hover:underline font-semibold ml-1">
              Frontend Development
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
