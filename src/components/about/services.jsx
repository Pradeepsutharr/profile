import React from "react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
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
    <section className="">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services?.map((service) => (
          <Link
            href={`/services/${service.slug}`}
            key={service.id}
            className="group relative block"
          >
            {/* Hover card border & scale wrapper */}
            <div className="h-full rounded-2xl border border-stroke bg-surface/30 p-6 transition-all duration-300 hover:border-primary/30 hover:bg-input/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:shadow-primary/5 hover:-translate-y-1 flex flex-col sm:flex-row gap-5 items-start">

              {/* Icon Container with atmospheric glow */}
              <div className="relative p-3 rounded-xl bg-elevated border border-stroke/80 group-hover:border-primary/20 group-hover:bg-elevated-soft transition-colors duration-300 flex-shrink-0">
                <div className="absolute inset-0 rounded-xl bg-primary/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10 w-10 h-10 flex items-center justify-center">
                  <Image
                    src={service.icon}
                    alt={service.title}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Title & description */}
              <div className="flex-grow">
                <h3 className="text-main group-hover:text-primary font-semibold text-lg transition-colors duration-300 flex items-center gap-2">
                  {service.title}
                  <span className="inline-block transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300 text-sm">
                    &rarr;
                  </span>
                </h3>
                <p className="text-subtle/80 mt-2 text-sm font-light leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Philosophy Callout Card */}
      <div className="relative mt-12 p-6 md:p-8 rounded-2xl border border-stroke/50 bg-gradient-to-r from-surface/40 via-input/50 to-surface/40 overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -left-16 -top-16 w-48 h-48 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute -right-16 -bottom-16 w-48 h-48 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <p className="relative z-10 text-subtle/90 text-[15px] md:text-base font-light leading-relaxed italic">
          &ldquo;I help brands and businesses create modern, responsive, and user-centered digital products through a strong combination of UI/UX design, front-end development, and product thinking. My goal is to build high-performance interfaces that bridge design and engineering to bring your vision to life with precision and creativity.&rdquo;
        </p>

        <div className="relative z-10 flex items-center gap-3 mt-5">
          {/* <div className="w-8 h-[1.5px] bg-primary/40" /> */}
          <span className="text-xs uppercase tracking-widest text-primary font-semibold">
            Product Philosophy
          </span>
        </div>
      </div>
    </section>
  );
}

export default Services;
