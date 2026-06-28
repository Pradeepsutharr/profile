import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Mail,
  PhoneCall,
  Map,
  Linkedin,
  Github,
  Instagram,
  Globe,
  Twitter,
  Ellipsis,
  X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import SideBarSkeleton from "./sidebar-skeleton";
import MobileSidebarSkeleton from "@/layout/mobile-sidebar-skeleton";

const BUCKET = "portfolio";

export default function SideBar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [tiltStyle, setTiltStyle] = useState({});

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    
    // Rotate maximum 15 degrees
    const rotateX = -((y - centerY) / centerY) * 15;
    const rotateY = ((x - centerX) / centerX) * 15;

    setTiltStyle({
      transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      transition: 'none' // snappy
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'rotateX(0deg) rotateY(0deg)',
      transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
    });
  };

  const loadActiveUser = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("is_active", true)
      .single();

    if (error) {
      console.error("Failed to load active user:", error);
      setUser(null);
      setLoading(false);
      return;
    }

    let avatar_url = data.avatar_url;

    // If we only stored avatar_path, convert it to a public URL
    if (data.avatar_path) {
      const { data: publicData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(data.avatar_path);

      avatar_url = publicData?.publicUrl || avatar_url || null;
    }

    setUser({ ...data, avatar_url });
    setLoading(false);
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadActiveUser();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  // if (loading) return <SideBarSkeleton />;
  if (loading) {
    return (
      <>
        <div className="hidden lg:block">
          <SideBarSkeleton />
        </div>

        <div className="block lg:hidden">
          <MobileSidebarSkeleton />
        </div>
      </>
    )
  }
  if (!user) return <div className="text-red-400">No active user found.</div>;

  const socials = user.socials || {};

  return (
    <div
      className={`lg:px-6 px-4 lg:py-10 py-4 flex flex-col items-center bg-background border border-stroke rounded-2xl lg:rounded-3xl relative lg:sticky lg:top-[60px] overflow-hidden
        ${open ? "max-h-[900px]" : "max-h-[113px]"
        } lg:max-h-none transition-all duration-700 ease-in-out`}
      aria-expanded={open}
    >
      {/* Toggle: visible only on small screens */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="absolute block lg:hidden right-0 top-0 p-2 toggle-btn"
        aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
      >
        {/* Show Ellipsis when collapsed, X when open */}
        {open ? (
          <X className="text-primary" size={18} />
        ) : (
          <Ellipsis className="text-primary" size={18} />
        )}
      </button>

      <div className="flex lg:flex-col items-center gap-6 lg:gap-0 w-full transition-all duration-700">
        <div
          className="avatar-box max-w-[80px] lg:max-w-[150px] rounded-2xl lg:rounded-3xl p-4 transition-all duration-700 flex-shrink-0 cursor-pointer"
          style={{
            perspective: "1000px",
            transformStyle: "preserve-3d",
            ...tiltStyle,
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <Image
            src={user?.avatar_url || "/my-avatar.png"}
            alt={user?.name || "avatar"}
            priority
            width={200}
            height={196}
            style={{ transform: "translateZ(15px)", transformStyle: "preserve-3d" }}
          />
        </div>

        <div className="lg:text-center">
          <h1 className="capitalize text-main text-lg lg:text-2xl font-semibold lg:my-6 mb-2 ">
            {user.name}
          </h1>
          <span className="bg-elevated lg:py-2 py-1 px-4 rounded-md text-main text-xs lg:text-sm">
            {Array.isArray(user?.profile_titles)
              ? user?.profile_titles[0]
              : user?.profile_titles}
          </span>
        </div>
      </div>

      <div className="bg-stroke w-full min-h-[1px] my-8"></div>

      <div className="w-full flex flex-col gap-y-8 px-1">
        <div className="flex items-center gap-4 " data-nosnippet>
          <div className="w-1/4 icon-box bg-surface text-primary max-w-[48px] max-h-[48px] min-w-[48px] min-h-[48px] flex items-center justify-center rounded-lg ">
            <Mail size={20} />
          </div>
          <div className="w-3/4">
            <span className="text-muted">Email</span>
            <p className="text-main whitespace-nowrap overflow-hidden text-ellipsis">
              <Link href={`mailto:${user?.email}`} title="">
                {user?.email}
              </Link>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4" data-nosnippet>
          <div className="w-1/4 icon-box bg-surface text-primary max-w-[48px] max-h-[48px] min-w-[48px] min-h-[48px] flex items-center justify-center rounded-lg ">
            <PhoneCall size={20} />
          </div>
          <div className="w-3/4">
            <span className="text-muted">Phone</span>
            <p className="text-main whitespace-nowrap overflow-hidden text-ellipsis">
              <Link href={`tel:${user?.phone || ""}`} title="">
                {user?.phone || "+91 7023927315"}
              </Link>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 data-nosnippet">
          <div className="w-1/4 icon-box bg-surface text-primary max-w-[48px] max-h-[48px] min-w-[48px] min-h-[48px] flex items-center justify-center rounded-lg ">
            <Map size={20} />
          </div>
          <div className="w-3/4">
            <span className="text-muted">Location</span>
            <p
              title={[
                user?.location?.city,
                user?.location?.state,
                user?.location?.country,
              ]
                .filter(Boolean)
                .join(", ")}
              className="text-main whitespace-nowrap overflow-hidden text-ellipsis capitalize"
            >
              {[
                user?.location?.city,
                user?.location?.state,
                user?.location?.country,
              ]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
        </div>

        <div
          className="flex flex-wrap items-center justify-between gap-2"
          data-nosnippet
        >
          {socials?.github && (
            <Link
              href={socials.github}
              target="_blank"
              className="icon-box max-w-[35px] max-h-[35px] min-w-[35px] min-h-[35px] flex items-center justify-center rounded-md text-subtle hover:text-primary"
            >
              <Github size={18} />
            </Link>
          )}

          {socials?.linkedin && (
            <Link
              href={socials.linkedin}
              target="_blank"
              className="icon-box max-w-[35px] max-h-[35px] min-w-[35px] min-h-[35px] flex items-center justify-center rounded-md text-subtle hover:text-primary"
            >
              <Linkedin size={18} />
            </Link>
          )}

          {socials?.instagram && (
            <Link
              href={socials.instagram}
              target="_blank"
              className="icon-box max-w-[35px] max-h-[35px] min-w-[35px] min-h-[35px] flex items-center justify-center rounded-md text-subtle hover:text-primary"
            >
              <Instagram size={18} />
            </Link>
          )}

          {socials?.twitter && (
            <Link
              href={socials.twitter}
              target="_blank"
              className="icon-box max-w-[35px] max-h-[35px] min-w-[35px] min-h-[35px] flex items-center justify-center rounded-md text-subtle hover:text-primary"
            >
              <Twitter size={18} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
