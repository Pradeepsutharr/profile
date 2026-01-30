import SEO from "@/common/seo";
import SEOConfig from "@/common/seo.config";
import Link from "next/link";

const services = [
  {
    id: 1,
    title: "React.js development",
  },
  {
    id: 2,
    title: "Next.js applications",
  },
  {
    id: 3,
    title: "Responsive layouts",
  },
  {
    id: 4,
    title: "Component-based architecture",
  },
  {
    id: 5,
    title: "Performance optimization",
  },
  {
    id: 6,
    title: "SEO-friendly implementation",
  },
];

export default function FrontendDevelopment() {
  return (
    <>
      <SEO {...SEOConfig.frontendDevelopment} />
      <section>
        <span className="text-2xl md:text-3xl text-main font-semibold">
          Frontend Development
        </span>

        <div className="bg-primary w-10 h-[5px] rounded-full my-5" />

        <h1 className="text-primary text-xl md:text-3xl font-semibold leading-relaxed">
          Frontend Development Using React & Next.js
        </h1>

        <p className="text-subtle mt-2">
          I build fast, scalable, and SEO-friendly frontend applications using
          React and Next.js. My frontend development focuses on clean
          architecture, responsive layouts, and performance optimization.
        </p>
        <p className="text-subtle mt-2">
          I convert designs into production-ready interfaces that load quickly
          and work seamlessly across devices.
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
            My Frontend Development Approach
          </h2>

          <p className="text-subtle">
            I follow modern frontend best practices to ensure maintainable code,
            smooth user experiences, and strong Core Web Vitals. Every build is
            optimized for speed, accessibility, and long-term scalability.
          </p>
          <p className="text-subtle mt-2">
            <strong>Best for:</strong> web apps, SaaS platforms, MVPs, and
            marketing websites.
          </p>
        </div>

        <p className="mt-8 text-sm text-main">
          Related services:{" "}
          <Link href="/services/ui-design" className="text-primary">
            Ui-Design
          </Link>
          ,{" "}
          <Link href="/services/product-design" className="text-primary">
            Product Design
          </Link>
        </p>
      </section>
    </>
  );
}
