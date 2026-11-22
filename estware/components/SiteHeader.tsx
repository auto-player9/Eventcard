"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Lion";
import { MenuIcon } from "./Icons";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="nav">
      <div className="nav-in">
        <Link className="logo" href="/" aria-label="Estware home">
          <Logo id="nav" />
        </Link>
        <button
          className="menu-btn"
          type="button"
          aria-expanded={open}
          aria-controls="site-links"
          aria-label="Menu"
          onClick={() => setOpen((o) => !o)}
        >
          <MenuIcon />
        </button>
        <ul className={open ? "links open" : "links"} id="site-links" onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) close();
        }}>
          <li>
            <Link href="/services" aria-current={pathname === "/services" ? "page" : undefined}>
              Services
            </Link>
          </li>
          <li><Link href="/#work">Our work</Link></li>
          <li><Link href="/#process">How we work</Link></li>
          <li><Link href="/#contact">Contact</Link></li>
        </ul>
        <Link className="btn btn-primary cta" href="/#contact">
          Start a project
        </Link>
      </div>
    </header>
  );
}
