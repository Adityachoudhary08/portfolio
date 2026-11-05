"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

const Navbar = () => {
  const pathname = usePathname();

  if (pathname?.startsWith("/project/")) return null;

  return (
    <nav className="site-nav" aria-label="Main navigation">
      <Link className="nav-brand" href="/#top">Aditya Choudhary</Link>
      <div className="nav-links">
        <Link href="/#work">Work</Link>
        <Link href="/about">About</Link>
        <a href="https://github.com/Adityachoudhary08" target="_blank" rel="noreferrer">GitHub</a>
        <ThemeToggle className="site-theme-toggle" />
        <Link className="nav-cta" href="/#contact">Let’s talk <span>↗</span></Link>
      </div>
    </nav>
  );
};

export default Navbar;
