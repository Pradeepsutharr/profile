import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { BookOpen } from "lucide-react";

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

  return (
    <section>
      <h1 className="text-3xl text-main font-semibold">Resume</h1>
      <div className="bg-primary w-10 h-[5px] rounded-full my-5"></div>

      {/* experience */}
      <div className="mt-6">
        <div className="flex items-start gap-5 ">
          <div className="icon-box p-4 rounded-xl text-primary">
            <BookOpen size={20} />
          </div>
          <div>
            <h2 className="text-main text-2xl font-semibold mt-[10px]">
              Professional Experience
            </h2>

            {experience?.length > 0 &&
              experience.map((item) => (
                <div key={item.id} className="mt-5">
                  <div className="timeline-item relative">
                    <h3 className="degree capitalize text-main text-base font-medium relative">
                      {item.title.replace(",", " |")}
                    </h3>

                    <h4 className="text-primary mt-1 capitalize">
                      {item.company}
                    </h4>
                    <span className="capitalize  text-subtle text-sm">
                      {item.start_date.replaceAll("-", "/")} -
                      {item?.end_date === null ? " present" : item.end_date}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="mt-12">
        <div className="flex items-start gap-5 ">
          <div className="icon-box p-4 rounded-xl text-primary">
            <BookOpen size={20} />
          </div>
          <div className="">
            <h2 className="text-main text-2xl font-semibold mt-[10px]">
              Education
            </h2>

            {education?.length > 0 &&
              education.map((item) => (
                <div key={item.id} className="mt-5">
                  <div className="timeline-item relative">
                    <h3 className="degree capitalize text-main text-base font-medium relative">
                      {item.degree}
                    </h3>

                    <h4 className="text-primary mt-1 capitalize">
                      {item.institution}
                    </h4>
                    <span className="capitalize text-subtle text-sm">
                      {item.start_date.replaceAll("-", "/")} -{" "}
                      {item?.end_date === null
                        ? " present"
                        : item.end_date.replaceAll("-", "/")}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="mt-16">
        <div className="flex items-center gap-5 ">
          <h2 className="text-main text-2xl font-semibold capitalize">
            Core Compentancies
          </h2>
        </div>
        <div className="flex flex-wrap justify-between mt-5 gredient-jet p-4 rounded-2xl border border-stroke">
          {skills?.length > 0 &&
            skills.map((item) => (
              <div key={item.id} className="col-12 lg:col-6">
                <div className=" ">
                  <h3 className="degree capitalize text-main text-base font-medium relative mb-2">
                    {item.name}{" "}
                    <span className="ml-3 text-subtle font-light">
                      {item.score}%
                    </span>
                  </h3>
                  <div className="w-full bg-[#383838] h-[9px] rounded-full">
                    <div
                      className="bg-primary h-[9px] rounded-full"
                      style={{ width: `${item.score}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

export default ResumePage;
