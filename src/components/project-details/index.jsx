import { useRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";
import SEO from "@/common/seo";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Layers,
} from "lucide-react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ProjectDetailsSkeleton from "./skeleton";

function ProjectDetailsComponent({ projectData }) {
  const router = useRouter();
  const [projectDetails, setProjectDetails] = useState(projectData || {});

  const swiperRef = useRef(null);
  const paginationRef = useRef(null);

  const [paginationEl, setPaginationEl] = useState(null);

  useEffect(() => {
    if (swiperRef.current && paginationEl) {
      swiperRef.current.params.pagination.el = paginationEl;
      swiperRef.current.pagination.init();
      swiperRef.current.pagination.update();
    }
  }, [paginationEl]);

  return (
    <>
      <>
        <SEO
          ogTitle={projectDetails?.title ?? projectData?.title ?? ""}
          ogUrl={
            projectDetails?.slug
              ? `https://pradeep-suthar.vercel.app/portfolio/${projectDetails.slug}/`
              : projectData?.slug
                ? `https://pradeep-suthar.vercel.app/portfolio/${projectDetails.slug}/`
                : "https://pradeep-suthar.vercel.app/portfolio"
          }
          ogImage={projectDetails?.bg_image ?? projectData?.bg_image ?? ""}
          pageTitle={projectDetails?.title ?? projectData?.title ?? ""}
          pageDescription={
            projectDetails?.meta_description ??
            projectData?.meta_description ??
            "View selected frontend development and product design projects built with React, Next.js, and modern UI/UX principles focused on usability and performance."
          }
          keywords={`${projectDetails?.keywords ??
            projectData?.keywords ??
            "Frontend Portfolio, UI UX Portfolio, React Projects, Next.js Portfolio, Product Design Work, Interface Design Portfolio"
            }`}
        />
        <section className="relative overflow-hidden">
          {/* Background radial glow */}
          {/* <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" /> */}

          {/* Header */}
          <div className="relative mb-8">
            <div className="text-3xl text-main font-bold tracking-tight">Portfolio</div>
            <div className="relative w-12 h-1 bg-gradient-to-r from-primary to-primary/20 rounded-full mt-3">
              <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-25" />
            </div>
          </div>

          <p
            onClick={() => router.back()}
            className="group cursor-pointer text-subtle flex gap-2 items-center hover:text-primary w-fit font-medium text-sm transition-colors duration-300 mb-6"
          >
            <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform duration-300" />
            Back to portfolio
          </p>

          {/* Hero Image Block */}
          <div className="relative overflow-hidden rounded-2xl border border-stroke/50 bg-surface/20 aspect-[16/9] w-full max-h-[50vh] shadow-xl">
            <Image
              src={projectDetails.bg_image}
              alt={projectDetails.title}
              fill
              priority
              quality={90}
              className="object-cover"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
              <h1
                className="text-white text-2xl md:text-4xl font-bold tracking-tight max-w-3xl capitalize"
                style={{ lineHeight: "1.25" }}
              >
                {projectDetails.title}
              </h1>
            </div>
          </div>

          {/* Info Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8">
            {/* Category */}
            <div className="flex items-center gap-4 bg-surface/30 border border-stroke/50 p-4 rounded-xl group hover:border-primary/20 transition-all duration-300">
              <div className="icon-box max-w-[48px] max-h-[48px] min-w-[48px] min-h-[48px] text-primary flex items-center justify-center rounded-lg">
                <Layers size={20} />
              </div>
              <div className="content">
                <span className="text-xs uppercase tracking-wider text-subtle/70 block mb-0.5">Category</span>
                <p className="text-main font-semibold text-[15px] capitalize">
                  {projectDetails.category}
                </p>
              </div>
            </div>

            {/* Service */}
            <div className="flex items-center gap-4 bg-surface/30 border border-stroke/50 p-4 rounded-xl group hover:border-primary/20 transition-all duration-300">
              <div className="icon-box max-w-[48px] max-h-[48px] min-w-[48px] min-h-[48px] text-primary flex items-center justify-center rounded-lg">
                <BriefcaseBusiness size={20} />
              </div>
              <div className="content">
                <span className="text-xs uppercase tracking-wider text-subtle/70 block mb-0.5">Service</span>
                <p className="text-main font-semibold text-[15px] capitalize">
                  {projectDetails.service}
                </p>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-4 bg-surface/30 border border-stroke/50 p-4 rounded-xl group hover:border-primary/20 transition-all duration-300">
              <div className="icon-box max-w-[48px] max-h-[48px] min-w-[48px] min-h-[48px] text-primary flex items-center justify-center rounded-lg">
                <CalendarDays size={20} />
              </div>
              <div className="content">
                <span className="text-xs uppercase tracking-wider text-subtle/70 block mb-0.5">Date</span>
                <p className="text-main font-semibold text-[15px]">
                  {projectDetails.updated_at
                    ? new Date(projectDetails.updated_at).toLocaleDateString(
                      "en-IN",
                      {
                        timeZone: "Asia/Kolkata",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      },
                    )
                    : "-"}
                </p>
              </div>
            </div>
          </div>

          <p
            className="text-subtle/90 font-light text-base leading-relaxed my-6 bg-surface/10 border border-stroke/30 rounded-2xl p-6 md:p-8"
            dangerouslySetInnerHTML={{
              __html: projectDetails.description?.replace(/\\n/g, "<br />"),
            }}
          ></p>

          {/* Tech Stack */}
          <div className="my-10">
            <div className="relative mb-6">
              <h2 className="text-2xl text-main font-bold tracking-tight">Tech Stack</h2>
              <div className="w-12 h-1 bg-gradient-to-r from-primary to-primary/20 rounded-full mt-3" />
            </div>

            <div className="flex flex-wrap gap-2.5 mt-4">
              {Array.isArray(projectDetails?.tech_stack) &&
                projectDetails?.tech_stack.map((item, index) => (
                  <span
                    key={index}
                    className="px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 rounded-full transition-all duration-300 hover:bg-primary/20 hover:scale-105 cursor-default"
                  >
                    {item}
                  </span>
                ))}
            </div>
          </div>

          {/* Snapshots */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <div className="relative">
                <h2 className="text-2xl text-main font-bold tracking-tight">Snapshots</h2>
                <div className="w-12 h-1 bg-gradient-to-r from-primary to-primary/20 rounded-full mt-3" />
              </div>

              <div className="flex gap-3">
                <button
                  name="prev-btn"
                  aria-label="Previous Snapshot"
                  className="custom-prev icon-box p-2.5 rounded-lg border border-stroke/50 text-primary hover:border-primary/30 hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  name="next-btn"
                  aria-label="Next Snapshot"
                  className="custom-next icon-box p-2.5 rounded-lg border border-stroke/50 text-primary hover:border-primary/30 hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {projectDetails?.project_images?.length > 0 && (
              <Swiper
                slidesPerView="auto"
                spaceBetween={24}
                centeredSlides
                loop
                grabCursor={true}
                onBeforeInit={(swiper) => {
                  swiper.params.pagination.el = paginationRef.current;
                }}
                navigation={{
                  prevEl: ".custom-prev",
                  nextEl: ".custom-next",
                }}
                pagination={{
                  el: paginationEl,
                  clickable: true,
                }}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                modules={[Pagination, Navigation, Autoplay]}
                className="project-slider"
              >
                {projectDetails.project_images.map((img, index) => (
                  <SwiperSlide
                    key={index}
                    className="project-slide swiper-slide-project"
                  >
                    <div className="relative w-full h-full rounded-xl border border-stroke/40 overflow-hidden bg-elevated shadow-lg group">
                      <Image
                        src={img}
                        alt={`${projectDetails.title} preview ${index + 1}`}
                        fill
                        quality={95}
                        priority={index === 0}
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}

            <div className="flex justify-between items-start mt-6">
              <div
                ref={(node) => setPaginationEl(node)}
                className="col-12 md:col-6 flex gap-3 items-center justify-center md:justify-start custom-pagination cursor-pointer md:max-w-[50%] p-0"
              ></div>
            </div>
          </div>
        </section>
      </>
    </>
  );
}

export default ProjectDetailsComponent;
