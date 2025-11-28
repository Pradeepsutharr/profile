import { Mail, PhoneCall, Map, Linkedin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React from "react";

function SideBar() {
  return (
    <div className="px-8 py-10 flex flex-col items-center bg-[#1e1e1f] border border-stroke rounded-3xl lg:sticky top-0">
      <div className="avatar-box max-w-[150px] rounded-3xl">
        <Image
          src="/my-avatar.png"
          alt="Pradeep"
          priority
          width={200}
          height={196}
        />
      </div>

      <h1 className="uppercase text-main text-2xl font-semibold my-6">
        {/* Pradeep kumar */}
      </h1>
      <span className="bg-[#2b2b2c] py-2 px-4 rounded-md text-white text-sm">
        Product Designer
      </span>

      <div className="bg-[#383838] w-full min-h-[1px] my-8"></div>

      <div className="w-full flex flex-col gap-y-8">
        <div className="flex items-center gap-4 ">
          <div className="w-1/4 icon-box bg-[#202022] text-primary max-w-[48px] max-h-[48px] min-w-[48px] min-h-[48px] flex items-center justify-center rounded-lg ">
            <Mail size={20} />
          </div>
          <div className="w-3/4">
            <span className="text-[#979798]">Email</span>
            <p className="text-main whitespace-nowrap overflow-hidden text-ellipsis">
              <Link
                href="mailto:pradeepsutharr7@gmail.com"
                title=""
                className=" "
              >
                pradeepsutharr7@gmail.com
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
              <Link href="tel:+917023927315" title="" className=" ">
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
              title=""
              className="text-main whitespace-nowrap overflow-hidden text-ellipsis"
            >
              Ahmedabad, Gujarat
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between ">
          <Link
            href="#"
            className="icon-box max-w-[35px] max-h-[35px] min-w-[35px] min-h-[35px] flex items-center justify-center rounded-md text-subtle hover:text-primary"
          >
            <Linkedin size={18} />
          </Link>
          <Link
            href="#"
            className="icon-box max-w-[35px] max-h-[35px] min-w-[35px] min-h-[35px] flex items-center justify-center rounded-md text-subtle hover:text-primary"
          >
            <Linkedin size={18} />
          </Link>
          <Link
            href="#"
            className="icon-box max-w-[35px] max-h-[35px] min-w-[35px] min-h-[35px] flex items-center justify-center rounded-md text-subtle hover:text-primary"
          >
            <Linkedin size={18} />
          </Link>
          <Link
            href="#"
            className="icon-box max-w-[35px] max-h-[35px] min-w-[35px] min-h-[35px] flex items-center justify-center rounded-md text-subtle hover:text-primary"
          >
            <Linkedin size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
