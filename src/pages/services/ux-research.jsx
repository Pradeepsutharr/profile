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

      <section className="max-w-4xl">
        {/* Header */}
        <span className="text-2xl md:text-3xl text-main font-semibold">
          UX Research Services
        </span>

        <div className="bg-primary w-12 h-[5px] rounded-full my-5" />

        <h1 className="text-primary text-xl md:text-3xl font-semibold leading-relaxed">
          UX Research Services for User-Centered Digital Products
        </h1>

        <p className="text-subtle mt-4 leading-relaxed">
          Effective digital products begin with a deep understanding of users. I
          provide UX research services that uncover real user needs, behaviors,
          and pain points to guide product strategy and design decisions.
        </p>

        <p className="text-subtle mt-3 leading-relaxed">
          My research-driven approach helps reduce assumptions, validate ideas
          early, and ensure that design and development efforts are aligned with
          actual user expectations.
        </p>

        {/* Deliverables */}
        <div className="mt-10">
          <h2 className="text-main text-xl font-semibold mb-6">
            What I Deliver
          </h2>

          <div className="flex flex-wrap m-[-.75rem]">
            {deliverables.map((item, index) => (
              <div key={index} className="col-12 md:col-6">
                <div className="service-card icon-box rounded-lg p-6 h-full">
                  <div className="text-primary font-semibold mb-2">
                    0{index + 1} {item.title}
                  </div>
                  <p className="text-subtle">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Approach */}
        <div className="mt-10">
          <h2 className="text-main text-xl font-semibold mb-3">
            My UX Research Approach
          </h2>

          <p className="text-subtle">
            My UX research process begins by defining business objectives,
            identifying user groups, and selecting appropriate research methods.
            Insights gathered from research activities are translated into
            clear, actionable recommendations that inform design and product
            decisions.
          </p>

          <ul className="mt-4 list-disc ml-5 space-y-2 text-subtle">
            {focusPoints.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Why It Matters */}
        <div className="mt-12 rounded-lg bg-soft">
          <h2 className="text-main font-semibold mb-2">
            Why UX Research Matters
          </h2>

          <p className="text-subtle">
            UX research helps identify usability issues early, validate product
            direction, and improve overall user satisfaction. Understanding your
            audience before designing or building reduces risk, saves
            development time, and leads to more successful product outcomes.
          </p>

          <p className="text-subtle mt-3">
            <strong>Best for:</strong> New product initiatives, MVP validation,
            redesign projects, and ongoing usability optimization.
          </p>
        </div>

        {/* Collaboration */}
        <div className="mt-10">
          <h2 className="text-main text-xl font-semibold mb-2">
            Research-Driven Design Collaboration
          </h2>

          <p className="text-subtle">
            As both a Product Designer and Frontend Developer, I integrate
            research findings directly into design workflows, ensuring that
            insights translate into practical, implementable solutions.
          </p>
        </div>

        {/* Related */}
        <div className="mt-8 text-sm text-main">
          Related services:{" "}
          <Link
            href="/services/frontend-development"
            className="text-primary underline"
          >
            Frontend Development
          </Link>
          ,{" "}
          <Link
            href="/services/product-design"
            className="text-primary underline"
          >
            Product Design
          </Link>
        </div>
      </section>
    </>
  );
}
