import SEO from "@/common/seo";
import SEOConfig from "@/common/seo.config";
import Link from "next/link";

const services = [
  {
    id: 1,
    title: "Product discovery and UX strategy",
  },
  {
    id: 2,
    title: "Wireframing and user flows",
  },
  {
    id: 3,
    title: "UI design",
  },
  {
    id: 4,
    title: "Design systems",
  },
  {
    id: 5,
    title: "MVP design",
  },
  {
    id: 6,
    title: "Handoff-ready assets for development",
  },
];

export default function ProductDesign() {
  return (
    <>
      <SEO {...SEOConfig.productDesign} />

      <section>
        <span className="text-2xl md:text-3xl text-main font-semibold">
          Product Design
        </span>

        <div className="bg-primary w-10 h-[5px] rounded-full my-5" />

        <h1 className="text-primary text-xl md:text-3xl font-semibold leading-relaxed">
          Product Design for Startups and SaaS
        </h1>

        <p className="text-subtle mt-2">
          I help founders turn ideas into complete digital products. My product
          design process covers everything from early concept validation to
          polished UI and implementation-ready designs.
        </p>
        <p className="text-subtle mt-2">
          I focus on building products that solve real problems, combining UX
          strategy, interface design, and frontend thinking to deliver scalable
          solutions.
        </p>

        <div className="mt-8">
          <h2 className="text-main text-xl font-semibold mb-6">
            What I Deliver
          </h2>

          <div className="flex items-start justify-center flex-wrap m-[-.75rem]">
            {services?.map((item, index) => (
              <div key={item.id} className="col-12 md:col-6">
                <div className="flex items-center gap-3 icon-box service-card rounded-lg p-6">
                  <div className="count text-primary text-xl font-medium">
                    0{index + 1}
                  </div>
                  <p className="text-subtle">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-main text-xl font-semibold mb-2">
            My Product Design Process
          </h2>

          <p className="text-subtle">
            I work closely with stakeholders to define product goals, map user
            journeys, and design experiences that align with business
            objectives. Whether you’re building an MVP or improving an existing
            product, I ensure every feature has purpose.
          </p>
          <p className="text-subtle mt-2">
            <strong>Best for:</strong> startups, SaaS platforms, and early-stage
            products.
          </p>
        </div>

        <p className="mt-8 text-sm text-main">
          Related services:{" "}
          <Link href="/services/ui-design" className="text-primary">
            Ui-Design
          </Link>
          ,{" "}
          <Link href="/services/frontend-development" className="text-primary">
            Front-end Development
          </Link>
        </p>
      </section>
    </>
  );
}
