import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ServiceIcon } from "./icons";
import { PageHero, Reveal } from "./motion";

export function ServicesContent({ services }) {
  return <><PageHero eyebrow="Capabilities" title="Useful work," accent="well made" description="Product discovery, interface design, systems, and frontend implementation for teams that value thoughtful craft." /><div className="services-page-grid">{services.map((service, index) => <Reveal key={service.id} delay={index * 0.06}><Link href={`/services/${service.slug}`} className="service-page-card liquid"><span className="service-icon"><ServiceIcon name={service.icon} /></span><small>0{index + 1}</small><h2>{service.title}</h2><p>{service.description}</p><div className="tag-list">{(service.tags || []).map((tag) => <i key={tag}>{tag}</i>)}</div><b>Explore capability <ArrowUpRight size={16} /></b></Link></Reveal>)}</div></>;
}

export function ServiceDetail({ service }) {
  return <article className="service-detail"><Link href="/services" className="back-link">← All capabilities</Link><Reveal><div className="service-detail-head liquid"><span className="service-icon"><ServiceIcon name={service.icon} size={28} /></span><div><span className="eyebrow">Capability</span><h1>{service.title}</h1><p>{service.description}</p></div></div></Reveal><Reveal><section className="service-deliverables"><h2>What you can expect</h2><div>{(service.tags || ["Clear product thinking", "Thoughtful execution", "Close collaboration"]).map((tag, index) => <p key={tag}><i>0{index + 1}</i>{tag}</p>)}</div></section></Reveal><Link href="/contact" className="primary-button">Start a conversation <ArrowRight size={17} /></Link></article>;
}
