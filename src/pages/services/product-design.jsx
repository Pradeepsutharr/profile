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

      <section className="max-w-4xl">
        {/* Header */}
        <span className="text-2xl md:text-3xl text-main font-semibold">
          Product Design Services
        </span>

        <div className="bg-primary w-12 h-[5px] rounded-full my-5" />

        <h1 className="text-primary text-xl md:text-3xl font-semibold leading-relaxed">
          Product Design for Startups and SaaS Platforms
        </h1>

        <p className="text-subtle mt-4 leading-relaxed">
          I help founders and product teams turn ideas into structured, usable,
          and scalable digital products. My product design approach spans from
          early concept validation to polished user interfaces and
          implementation-ready design systems.
        </p>

        <p className="text-subtle mt-3 leading-relaxed">
          By combining UX strategy, interface design, and frontend awareness, I
          focus on building products that solve real user problems while
          aligning with business objectives.
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

        {/* Process */}
        <div className="mt-10">
          <h2 className="text-main text-xl font-semibold mb-3">
            My Product Design Process
          </h2>

          <p className="text-subtle">
            I collaborate closely with stakeholders to define product vision,
            map user journeys, and design experiences that deliver measurable
            value. Each stage is structured to reduce risk and ensure that every
            feature has a clear purpose.
          </p>

          <ul className="mt-4 list-disc ml-5 space-y-2 text-subtle">
            {processPoints.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Best Fit */}
        <div className="mt-12 rounded-lg bg-soft">
          <h2 className="text-main font-semibold mb-2">Best Fit For</h2>

          <p className="text-subtle">
            Early-stage startups, SaaS platforms, founders validating new ideas,
            and teams looking to improve existing digital products.
          </p>
        </div>

        {/* Collaboration */}
        <div className="mt-10">
          <h2 className="text-main text-xl font-semibold mb-2">
            Product Design with Implementation in Mind
          </h2>

          <p className="text-subtle">
            With hands-on frontend development experience in React and Next.js,
            I design products that are technically feasible and ready for
            efficient implementation, reducing design-to-development gaps.
          </p>
        </div>

        {/* Related */}
        <div className="mt-8 text-sm text-main">
          Related services:{" "}
          <Link href="/services/ui-design" className="text-primary underline">
            UI Design
          </Link>
          ,{" "}
          <Link
            href="/services/frontend-development"
            className="text-primary underline"
          >
            Frontend Development
          </Link>
        </div>
      </section>
    </>
  );
}
