import React from "react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

function Services() {
  const [services, setServices] = useState([]);

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
    })();
  }, []);
  // console.log(services);

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
    </section>
  );
}

export default Services;
