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

const BUCKET = "portfolio";

export default function SideBar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadActiveUser();
  }, []);

  async function loadActiveUser() {
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
  }

  if (loading) return <SideBarSkeleton />;
  if (!user) return <div className="text-red-400">No active user found.</div>;

  const socials = user.socials || {};

  return (
    <div className="lg:px-8  px-4 lg:py-10 py-4 flex flex-col items-center bg-[#1e1e1f] border border-stroke rounded-2xl lg:rounded-3xl relative lg:sticky lg:top-[60px] overflow-hidden h-[113px] lg:h-auto transition-all duration-700">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="absolute right-0 top-0 gredient-jet p-2 toggle-btn"
      >
        {open ? (
          <Ellipsis color="#ffdb70" size={18} />
        ) : (
          <X color="#ffdb70" size={18} />
        )}
      </button>

      <div className="flex lg:flex-col items-center gap-6 lg:gap-0 w-full transition-all duration-700">
        <div className="avatar-box max-w-[80px] lg:max-w-[150px] rounded-2xl lg:rounded-3xl p-4 transition-all duration-700">
          <Image
            src={user?.avatar_url || "my-avatar.png"}
            alt={user?.name}
            priority
            width={200}
            height={196}
          />
        </div>

        <div className="lg:text-center">
          <h1 className="uppercase text-main text-lg lg:text-2xl font-semibold lg:my-6 mb-2 ">
            {user.name}
          </h1>
          <span className="bg-[#2b2b2c] lg:py-2 py-1 px-4 rounded-md text-white text-xs lg:text-sm">
            {user?.profile_titles[0]}
          </span>
        </div>
      </div>

      <div className="bg-[#383838] w-full min-h-[1px] my-8"></div>

      <div className="w-full flex flex-col gap-y-8">
        <div className="flex items-center gap-4 ">
          <div className="w-1/4 icon-box bg-[#202022] text-primary max-w-[48px] max-h-[48px] min-w-[48px] min-h-[48px] flex items-center justify-center rounded-lg ">
            <Mail size={20} />
          </div>
          <div className="w-3/4">
            <span className="text-[#979798]">Email</span>
            <p className="text-main whitespace-nowrap overflow-hidden text-ellipsis">
              <Link href={`mailto:${user?.email}`} title="" className=" ">
                {user?.email}
              </Link>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-1/4 icon-box bg-[#202022] text-primary max-w-[48px] max-h-[48px] min-w-[48px] min-h-[48px] flex items-center justify-center rounded-lg ">
            <PhoneCall size={20} />
          </div>
          <div className="w-3/4">
            <span className="text-[#979798]">Phone</span>
            <p className="text-main whitespace-nowrap overflow-hidden text-ellipsis">
              <Link href={`tel:${user?.phone}`} title="" className=" ">
                +91 7023927315
              </Link>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-1/4 icon-box bg-[#202022] text-primary max-w-[48px] max-h-[48px] min-w-[48px] min-h-[48px] flex items-center justify-center rounded-lg ">
            <Map size={20} />
          </div>
          <div className="w-3/4">
            <span className="text-[#979798]">Location</span>
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
        <div className="flex flex-wrap items-center justify-between ">
          {socials?.github && (
            <Link
              href={user?.socials?.github || ""}
              target="_blank"
              className="icon-box max-w-[35px] max-h-[35px] min-w-[35px] min-h-[35px] flex items-center justify-center rounded-md text-subtle hover:text-primary"
            >
              <Github size={18} />
            </Link>
          )}

          {socials?.linkedin && (
            <Link
              href={user?.socials?.Linkedin || ""}
              target="_blank"
              className="icon-box max-w-[35px] max-h-[35px] min-w-[35px] min-h-[35px] flex items-center justify-center rounded-md text-subtle hover:text-primary"
            >
              <Linkedin size={18} />
            </Link>
          )}

          {socials?.instagram && (
            <Link
              href={user?.socials?.instagram || ""}
              target="_blank"
              className="icon-box max-w-[35px] max-h-[35px] min-w-[35px] min-h-[35px] flex items-center justify-center rounded-md text-subtle hover:text-primary"
            >
              <Instagram size={18} />
            </Link>
          )}

          {socials?.twitter && (
            <Link
              href={user?.socials?.twitter || ""}
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
