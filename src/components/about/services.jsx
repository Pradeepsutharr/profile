import React from "react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import ServicesSkeleton from "./service-skeleton";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("order", { ascending: true });

      if (error) {
        console.error("Error loading services:", error);
        return;
      }
      setServices(data || []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <ServicesSkeleton />;

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between m-[-.75rem]">
        {services?.map((service) => (
          <div key={service.id} className="col-12 md:col-6 ">
            <div className="icon-box service-card flex flex-wrap items-center justify-between rounded-xl px-5 py-4 min-h-[164px]">
              <div className="col-12 md:col-3 lg:col-2 ">
                <Image
                  src={service.icon}
                  alt={service.title}
                  width={50}
                  height={50}
                />
              </div>
              <div className="col-12 md:col-9 lg:col-10">
                <h3 className="text-main font-semibold text-xl">
                  {service.title}
                </h3>
                <p className="text-subtle mt-2 text-[15px]">
                  {service.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-subtle text-[15px] mt-10 leading-relaxed">
        I help brands and businesses create modern, responsive, and
        user-centered digital products through a strong combination of UI/UX
        design, front-end development, and product thinking. My expertise
        includes React, Next.js, Tailwind, design systems, accessibility, and
        high-performance interface development. If you're looking for a Product
        Designer or Front-End Developer who can design and develop seamless
        digital experiences, I can help bring your vision to life with precision
        and creativity.
      </p>
    </section>
  );
}

export default Services;
