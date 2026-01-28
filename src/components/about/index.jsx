import React from "react";
import { user_data } from "@/data/user-data";
import Services from "./services";

function About() {
  return (
    <section>
      <span className="text-3xl text-main font-semibold">About me</span>
      <div className="bg-primary w-10 h-[5px] rounded-full my-5"></div>
      <h1
        className="capitalize text-primary text-2xl md:text-3xl font-semibold flex flex-col"
        style={{ lineHeight: "1.5" }}
      >
        {user_data?.MainTitle}
      </h1>

      {user_data?.summary?.map((item) => (
        <p key={item.id} className="mt-4 text-subtle font-light">
          {item.description}
        </p>
      ))}

      <div className="mt-10">
        <h2 className="text-main text-2xl md:text-3xl capitalize font-semibold mb-4">
          What I Do
        </h2>
        <p className="mt-2 mb-6 text-subtle font-light">
          I design intuitive, research-driven UI/UX experiences that improve
          usability, engagement, and conversions. My UI/UX design process
          focuses on user flows, wireframes, design systems, and pixel-perfect
          interfaces for web and SaaS products.
        </p>

        <Services />
      </div>
    </section>
  );
}

export default About;
