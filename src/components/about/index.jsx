import React from "react";
import { user_data } from "@/data/user-data";
import Services from "./services";

function About() {
  return (
    <section>
      <span className="text-3xl text-main font-semibold">About me</span>
      <div className="bg-primary w-10 h-[5px] rounded-full my-5"></div>

      <h1 className="capitalize text-primary text-2xl font-semibold flex flex-col leading-relaxed">
        {user_data?.profile?.map((item) => (
          <span key={item.id}>{item.title}</span>
        ))}
      </h1>

      {user_data?.summary?.map((item) => (
        <p key={item.id} className="mt-4 text-subtle font-light">
          {item.description}
        </p>
      ))}

      <div className="mt-10">
        <h2 className="text-main text-2xl capitalize font-semibold mb-4">
          Core Services
        </h2>
        <Services />
      </div>
    </section>
  );
}

export default About;
