import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { BookOpen } from "lucide-react";
import ResumeSkeleton from "./resume-skeleton";

function ResumePage() {
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [sRes, eRes, exRes] = await Promise.all([
        supabase.from("skills").select("*").order("order", { ascending: true }),
        supabase
          .from("education")
          .select("*")
          .order("order", { ascending: true }),
        supabase
          .from("experience")
          .select("*")
          .order("order", { ascending: true }),
      ]);

      if (sRes.error) console.error("skills error", sRes.error);
      if (eRes.error) console.error("education error", eRes.error);
      if (exRes.error) console.error("experience error", exRes.error);

      setSkills(sRes.data || []);
      setEducation(eRes.data || []);
      setExperience(exRes.data || []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <ResumeSkeleton />;

  return (
    <section className="relative overflow-hidden">
      {/* Background radial glow */}
      {/* <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" /> */}

      {/* Header */}
      <div className="relative mb-8">
        <h2 className="text-3xl text-main font-bold tracking-tight">Resume</h2>
        <div className="relative w-12 h-1 bg-gradient-to-r from-primary to-primary/20 rounded-full mt-3">
          <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-25" />
        </div>
      </div>

      {/* Experience */}
      <div className="mt-8">
        <div className="flex items-start gap-5">
          <div className="icon-box p-4 rounded-xl text-primary flex-shrink-0">
            <BookOpen size={20} />
          </div>
          <div className="flex-grow">
            <h2 className="text-main text-2xl font-bold tracking-tight mt-[8px] mb-6">
              Professional Experience
            </h2>

            {experience?.length > 0 &&
              experience.map((item) => (
                <div key={item.id} className="mt-6 first:mt-4">
                  <div className="timeline-item relative pl-2 group">
                    <h3 className="degree capitalize text-main group-hover:text-primary text-base font-semibold relative transition-colors duration-300">
                      {item.title.replace(",", " |")}
                    </h3>

                    <h4 className="text-primary/90 mt-1.5 capitalize font-medium text-sm">
                      {item.company}
                    </h4>

                    <span className="inline-block mt-2.5 px-2.5 py-1 text-xs font-light bg-elevated/80 text-subtle border border-stroke/40 rounded-md capitalize">
                      {item.start_date.replaceAll("-", "/")} &mdash; {item?.end_date === null ? "present" : item.end_date}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Education */}
      <div className="mt-12">
        <div className="flex items-start gap-5">
          <div className="icon-box p-4 rounded-xl text-primary flex-shrink-0">
            <BookOpen size={20} />
          </div>
          <div className="flex-grow">
            <h2 className="text-main text-2xl font-bold tracking-tight mt-[8px] mb-6">
              Education
            </h2>

            {education?.length > 0 &&
              education.map((item) => (
                <div key={item.id} className="mt-6 first:mt-4">
                  <div className="timeline-item relative pl-2 group">
                    <h3 className="degree capitalize text-main group-hover:text-primary text-base font-semibold relative transition-colors duration-300">
                      {item.degree}
                    </h3>

                    <h4 className="text-primary/90 mt-1.5 capitalize font-medium text-sm">
                      {item.institution}
                    </h4>

                    <span className="inline-block mt-2.5 px-2.5 py-1 text-xs font-light bg-elevated/80 text-subtle border border-stroke/40 rounded-md capitalize">
                      {item.start_date.replaceAll("-", "/")} &mdash; {item?.end_date === null ? "present" : item.end_date.replaceAll("-", "/")}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="mt-16">
        <div className="relative mb-6">
          <h2 className="text-2xl md:text-3xl text-main font-bold tracking-tight">Core Competencies</h2>
          <div className="w-12 h-1 bg-gradient-to-r from-primary to-primary/20 rounded-full mt-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface/30 border border-stroke/50 p-6 md:p-8 rounded-2xl">
          {skills?.length > 0 &&
            skills.map((item) => (
              <div key={item.id} className="space-y-2 group">
                <div className="flex justify-between items-center">
                  <h3 className="capitalize text-main font-semibold text-sm group-hover:text-primary transition-colors duration-300">
                    {item.name}
                  </h3>
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/25">
                    {item.score}%
                  </span>
                </div>
                <div className="w-full bg-stroke/60 h-2.5 rounded-full overflow-hidden border border-stroke/20">
                  <div
                    className="bg-gradient-to-r from-primary via-[#ffd700] to-primary/70 h-full rounded-full shadow-[0_0_10px_rgba(255,219,112,0.3)] transition-all duration-1000 ease-out"
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

export default ResumePage;
