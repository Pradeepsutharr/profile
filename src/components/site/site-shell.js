"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, BookOpen, BriefcaseBusiness, FileText, Github, Instagram, Linkedin, Mail, MapPin, Moon, Phone, Sun, UserRound } from "lucide-react";
import { useEffect, useState } from "react";

const nav = [
  { href: "/", label: "About", icon: UserRound }, { href: "/resume", label: "Resume", icon: FileText }, { href: "/work", label: "Portfolio", icon: BriefcaseBusiness }, { href: "/blog", label: "Blogs", icon: BookOpen }, { href: "/contact", label: "Contact", icon: Mail },
];

function colorVariables(colors = {}) { return Object.fromEntries(Object.entries(colors).map(([name, value]) => [`--${name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`, value])); }

function ThemeToggle({ dark, onToggle }) {
  return <button type="button" onClick={onToggle} className="lv-theme-toggle" aria-label="Toggle theme"><AnimatePresence mode="wait" initial={false}><motion.span key={dark ? "dark" : "light"} initial={{ y: 20, opacity: 0, rotate: -90 }} animate={{ y: 0, opacity: 1, rotate: 0 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.3 }}>{dark ? <Sun size={16} /> : <Moon size={16} />}</motion.span></AnimatePresence></button>;
}

function SocialLink({ type, href }) { const Icon = type === "github" ? Github : type === "linkedin" ? Linkedin : Instagram; return <a href={href} target="_blank" rel="noreferrer" aria-label={type}><Icon size={16} /></a>; }

function ProfileCard({ profile }) {
  const info = [[Mail, "Email", profile.email, `mailto:${profile.email}`], [Phone, "Phone", profile.phone, `tel:${String(profile.phone || "").replace(/\s/g, "")}`], [MapPin, "Location", profile.location, null]];
  const socials = [["github", profile.socials?.github], ["linkedin", profile.socials?.linkedin], ["instagram", profile.socials?.instagram]].filter(([, href]) => href && href !== "#");
  return <aside className="lv-profile-card"><div className="lv-profile-glow" /><div className="lv-profile-intro"><div className="lv-avatar-ring"><div><Image src={profile.avatar_url || "/images/logo.png"} alt={`${profile.name} profile`} width={256} height={256} priority /></div></div><div className="lv-profile-name"><h2>{profile.name}</h2><span><i />Product Designer</span></div></div><div className="lv-profile-rule" /><ul>{info.map(([Icon, label, value, href]) => value && <li key={label}>{href ? <a href={href}><span><Icon size={16} /></span><div><small>{label}</small><b>{value}</b></div></a> : <div><span><Icon size={16} /></span><div><small>{label}</small><b>{value}</b></div></div>}</li>)}</ul>{socials.length > 0 && <div className="lv-socials">{socials.map(([type, href]) => <SocialLink type={type} href={href} key={type} />)}</div>}<Link href="/contact" className="lv-hire">Hire me <ArrowUpRight size={16} /></Link></aside>;
}

function HeaderNav({ currentPath }) { return <nav className="lv-header-nav" aria-label="Main navigation">{nav.map((item) => { const active = item.href === "/" ? currentPath === "/" : currentPath.startsWith(item.href); return <Link href={item.href} className={active ? "active" : ""} key={item.href}>{active && <motion.i layoutId="lv-nav-active" />}<item.icon size={14} /><span>{item.label}</span></Link>; })}</nav>; }

function MobileNav({ currentPath }) { return <nav className="lv-mobile-nav" aria-label="Mobile navigation">{nav.map((item) => { const active = item.href === "/" ? currentPath === "/" : currentPath.startsWith(item.href); return <Link href={item.href} className={active ? "active" : ""} key={item.href}><item.icon size={18} /><small>{item.label}</small></Link>; })}</nav>; }

export function SiteShell({ profile, settings, children }) {
  const pathname = usePathname(); const [theme, setTheme] = useState("dark");
  const current = nav.find((item) => item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)) || nav[0];
  useEffect(() => { const preferred = window.localStorage.getItem("portfolio-theme") || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"); const timer = window.setTimeout(() => setTheme(preferred), 0); return () => window.clearTimeout(timer); }, []);
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  function toggleTheme() { setTheme((currentTheme) => { const next = currentTheme === "dark" ? "light" : "dark"; window.localStorage.setItem("portfolio-theme", next); return next; }); }
  return <div className="lovable-shell" style={colorVariables(settings?.colors)}><div className="lv-aurora" /><div className="lv-dots" /><div className="lv-orb lv-orb-one" /><div className="lv-orb lv-orb-two" /><div className="lv-orb lv-orb-three" /><div className="lv-grid"><ProfileCard profile={profile} /><div className="lv-main-panel"><header className="lv-header"><div className="lv-heading"><span /><AnimatePresence mode="wait"><motion.h1 key={current.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>{current.label}</motion.h1></AnimatePresence></div><div className="lv-header-actions"><HeaderNav currentPath={pathname} /><ThemeToggle dark={theme === "dark"} onToggle={toggleTheme} /></div></header><div className="lv-content">{children}</div></div></div><MobileNav currentPath={pathname} /></div>;
}
