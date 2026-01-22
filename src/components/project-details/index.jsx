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
  const slug = router.query.slug;
  const [loading, setLoading] = useState(true);
  const [projectDetails, setProjectDetails] = useState(projectData || {});

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

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
      {loading ? (
        <ProjectDetailsSkeleton />
      ) : (
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
            keywords={`${
              projectDetails?.keywords ??
              projectData?.keywords ??
              "Frontend Portfolio, UI UX Portfolio, React Projects, Next.js Portfolio, Product Design Work, Interface Design Portfolio"
            }`}
          />
          <section className="">
            <p className="text-3xl text-main font-semibold capitalize">
              Portfolio{" "}
            </p>
            <div className="bg-primary w-10 h-[5px] rounded-full my-5"></div>

            <p
              onClick={() => router.back()}
              className="cursor-pointer text-subtle flex gap-2 items-center hover:text-primary"
            >
              <ArrowLeft size={16} /> Back to portfolio
            </p>

            <div className="relative mx-[-1.5rem] max-h-[60vh] overflow-hidden mt-4">
              <Image
                src={projectDetails.bg_image}
                alt={projectDetails.title}
                width={640}
                height={427}
                priority
                quality={90}
                className="!w-full"
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

              <div className="absolute bottom-6 left-6 md:bottom-6 md:left-10">
                <h1
                  className="text-white text-2xl md:text-4xl font-semibold max-w-3xl capitalize"
                  style={{ lineHeight: "1.3" }}
                >
                  {projectDetails.title}
                </h1>
              </div>
            </div>
            <div className="flex flex-wrap items-start gap-y-7 my-8">
              <div className="w-full md:w-2/4 lg:w-1/3  flex items-start gap-3 ">
                <div className="icon-box max-w-[48px] max-h-[48px] min-w-[48px] min-h-[48px] text-primary grid place-items-center rounded-lg">
                  <Layers />
                </div>

                <div className="content">
                  <h2 className="text-subtle">Category</h2>
                  <p className="text-main capitalize">
                    {projectDetails.category}
                  </p>
                </div>
              </div>

              <div className="w-full md:w-2/4 lg:w-1/3  flex items-start gap-3">
                <div className="icon-box max-w-[48px] max-h-[48px] min-w-[48px] min-h-[48px] text-primary grid place-items-center rounded-lg">
                  <BriefcaseBusiness />
                </div>

                <div className="content">
                  <h2 className="text-subtle">Service</h2>
                  <p className="text-main capitalize">
                    {projectDetails.service}
                  </p>
                </div>
              </div>

              <div className="w-full md:w-2/4 lg:w-1/3  flex items-start gap-3">
                <div className="icon-box max-w-[48px] max-h-[48px] min-w-[48px] min-h-[48px] text-primary grid place-items-center rounded-lg">
                  <CalendarDays />
                </div>

                <div className="content">
                  <h2 className="text-subtle">Date</h2>
                  <p className="text-main">
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
              className="text-subtle"
              dangerouslySetInnerHTML={{
                __html: projectDetails.description?.replace(/\\n/g, "<br />"),
              }}
            ></p>

            <div className="my-10">
              <h2 className="text-2xl text-main font-semibold capitalize">
                tech stack
              </h2>

              <div className="flex items-center gap-3 mt-4">
                {Array.isArray(projectDetails?.tech_stack) &&
                  projectDetails?.tech_stack.map((item, index) => (
                    <span
                      key={index}
                      className="text-main icon-box inline-block py-3 px-5 rounded-lg hover:bg-primary/30 cursor-pointer capitalize"
                    >
                      {item}
                    </span>
                  ))}
              </div>
            </div>

            <div className="">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl text-main font-semibold capitalize my-7">
                  Snapshots
                </h2>
                <div className="flex gap-4">
                  <div>
                    <button
                      name="prev-btn"
                      className="custom-prev ms-auto icon-box p-2 rounded-lg hover:bg-primary/50 text-primary duration-300"
                    >
                      <ChevronLeft />
                    </button>
                  </div>
                  <div>
                    <button
                      name="next-btn"
                      className="custom-next icon-box p-2 rounded-lg hover:bg-primary/50 text-primary duration-300"
                    >
                      <ChevronRight />
                    </button>
                  </div>
                </div>
              </div>

              {projectDetails?.project_images?.length > 0 && (
                <Swiper
                  slidesPerView={2}
                  spaceBetween={24}
                  loop
                  grabCursor={true}
                  onBeforeInit={(swiper) => {
                    swiper.params.pagination.el = paginationRef.current;
                  }}
                  navigation={{
                    prevEl: ".custom-prev",
                    nextEl: ".custom-next",
                  }}
                  breakpoints={{
                    320: {
                      slidesPerView: 1,
                    },
                    640: {
                      slidesPerView: 1,
                    },
                    768: {
                      slidesPerView: 2,
                    },
                    1024: {
                      slidesPerView: 2,
                    },
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
                    <SwiperSlide key={index} className="project-slide">
                      <Image
                        src={img}
                        alt={`${projectDetails.title} preview ${index + 1}`}
                        width={1179}
                        height={786}
                        quality={95}
                        priority={index === 0}
                        className="rounded-md"
                      />
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
      )}
    </>
  );
}

export default ProjectDetailsComponent;
