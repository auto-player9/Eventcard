import Link from "next/link";
import { Logo } from "./Lion";
import { CONTACT_EMAIL } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer>
      <div className="foot">
        <Link className="logo" href="/" aria-label="Estware home">
          <Logo id="foot" />
        </Link>
        <nav aria-label="Footer">
          <Link href="/services">Services</Link>
          <Link href="/#work">Our work</Link>
          <Link href="/#process">How we work</Link>
          <Link href="/#contact">Contact</Link>
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </nav>
        <p className="small">© {new Date().getFullYear()} Estware</p>
      </div>
    </footer>
  );
}
