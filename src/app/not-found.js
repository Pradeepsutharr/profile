import Link from "next/link";
export default function NotFound() { return <main className="simple-state"><span className="eyebrow">404</span><h1>That page is not here.</h1><p>It may have moved, or the link could be out of date.</p><Link href="/" className="primary-button">Back home</Link></main>; }
