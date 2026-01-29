// import ServiceLayout from "@/components/service-layout/ServiceLayout";
import Link from "next/link";

export default function UIDesign() {
  return (
    // <ServiceLayout
    //   title="UI Design"
    //   subtitle="UI Designer for Modern Web & SaaS Products"
    //   metaTitle="UI Designer for Web & SaaS Products"
    //   metaDesc="Professional UI Designer crafting modern, responsive interfaces for startups and SaaS products."
    // >

    // </ServiceLayout>

    <section>
      <span className="text-2xl md:text-3xl text-main font-semibold">
        UI Design
      </span>

      <div className="bg-primary w-10 h-[5px] rounded-full my-5" />

      <h1 className="text-primary text-xl md:text-3xl font-semibold leading-relaxed">
        UI Designer for Modern Web & SaaS Products
      </h1>

      <p className="text-subtle">
        I’m a professional UI Designer specializing in clean, conversion-focused
        interfaces for startups and digital products. I design responsive,
        accessible, and visually consistent user interfaces that improve
        engagement and usability.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="icon-box service-card rounded-xl p-5">
          <h2 className="text-main text-lg font-semibold mb-2">
            What I Deliver
          </h2>

          <ul className="list-disc ml-4 space-y-2 text-subtle">
            <li>Web application UI</li>
            <li>Landing pages</li>
            <li>Design systems</li>
            <li>High-fidelity mockups</li>
            <li>Responsive layouts</li>
          </ul>
        </div>

        <div className="icon-box service-card rounded-xl p-5">
          <h2 className="text-main text-lg font-semibold mb-2">
            Why My UI Works
          </h2>

          <p className="text-subtle">
            Every interface is designed with visual hierarchy, accessibility,
            and clarity to guide users naturally.
          </p>
        </div>
      </div>

      <p className="mt-8 text-sm text-main">
        Related services:{" "}
        <Link href="/services/ux-research" className="text-primary">
          UX Research
        </Link>
        ,{" "}
        <Link href="/services/product-design" className="text-primary">
          Product Design
        </Link>
      </p>
    </section>
  );
}
