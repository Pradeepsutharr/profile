import ServiceLayout from "@/components/service-layout/ServiceLayout";
import Link from "next/link";

export default function UXResearch() {
  return (
    <ServiceLayout
      title="UX Research"
      subtitle="UX Research Services for User-Centered Products"
      metaTitle="UX Research Services"
      metaDesc="UX Researcher helping startups understand users through interviews and usability testing."
    >
      <p>
        I conduct UX research to uncover real user behavior and validate product
        decisions.
      </p>

      <div className="service-card rounded-xl p-5 mt-6">
        <h2 className="text-main text-lg font-semibold mb-3">
          Research Methods
        </h2>

        <ul className="list-disc ml-4 space-y-2">
          <li>User interviews</li>
          <li>Personas</li>
          <li>Journey mapping</li>
          <li>Usability testing</li>
          <li>Competitor analysis</li>
        </ul>
      </div>

      <p className="mt-8 text-sm">
        Related:{" "}
        <Link href="/services/ui-design" className="text-primary">
          UI Design
        </Link>
      </p>
    </ServiceLayout>
  );
}
