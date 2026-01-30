import SEO from "@/common/seo";
import SEOConfig from "@/common/seo.config";
import Link from "next/link";

const services = [
  {
    id: 1,
    title: "User interviews",
  },
  {
    id: 2,
    title: "Persona creation",
  },
  {
    id: 3,
    title: "User journey mapping",
  },
  {
    id: 4,
    title: "Competitor analysis",
  },
  {
    id: 5,
    title: "Usability testing",
  },
  {
    id: 6,
    title: "Insight documentation",
  },
];

export default function UXReasearch() {
  return (
    <>
      <SEO {...SEOConfig.uxResearch} />
      <section>
        <span className="text-2xl md:text-3xl text-main font-semibold">
          UX Research
        </span>

        <div className="bg-primary w-10 h-[5px] rounded-full my-5" />

        <h1 className="text-primary text-xl md:text-3xl font-semibold leading-relaxed">
          UX Research Services for User-Centered Products
        </h1>

        <p className="text-subtle mt-2">
          Good design starts with understanding users.
        </p>
        <p className="text-subtle mt-2">
          I provide UX research services to uncover real user needs, behaviors,
          and pain points. This helps reduce guesswork and ensures design
          decisions are backed by data, not assumptions.
        </p>
        <p className="text-subtle mt-2">
          My research-driven approach helps teams build products users actually
          want.
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
            Why UX Research Matters{" "}
          </h2>

          <p className="text-subtle">
            UX research helps identify usability issues early, validate product
            ideas, and improve user satisfaction. By understanding your audience
            before designing or developing, you save time, reduce rework, and
            build stronger products.
          </p>
          <p className="text-subtle mt-2">
            <strong>Best for:</strong> new products, MVPs, redesigns, and
            usability improvements.
          </p>
        </div>

        <p className="mt-8 text-sm text-main">
          Related services:{" "}
          <Link href="/services/frontend-development" className="text-primary">
            Front-end Development
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
