import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "./contact-form";
import { Reveal } from "./motion";

export function ContactContent({ profile }) {
  const info = [[Mail, "Email", profile.email, `mailto:${profile.email}`], [Phone, "Phone", profile.phone, `tel:${String(profile.phone || "").replace(/\s/g, "")}`], [MapPin, "Location", profile.location, null]];
  return <><Reveal className="contact-hero"><span className="eyebrow">Get in touch</span><h1>Let&apos;s build something <span className="text-gradient">remarkable.</span></h1><p>Have a project or simply want to say hi? Share a brief and I&apos;ll get back with thoughtful next steps.</p></Reveal><div className="contact-layout"><Reveal><ContactForm profile={profile} /></Reveal><div className="contact-info">{info.map(([Icon, label, value, href], index) => value && <Reveal delay={index * 0.06} key={label}><div className="contact-info-card liquid"><span className="contact-icon"><Icon size={18} /></span><span><small>{label}</small>{href ? <a href={href}>{value}</a> : <b>{value}</b>}</span></div></Reveal>)}<Reveal delay={0.2}><div className="availability-card liquid"><i />{profile.availability || "Available for select product work"}</div></Reveal></div></div></>;
}
