"use client";

import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  if (pathname?.startsWith("/project/")) return null;

  return (
    <nav className="site-nav" aria-label="Main navigation">
      <a className="nav-brand" href="#top">Aditya Choudhary</a>
      <div className="nav-links">
        <a href="#work">Work</a>
        <a href="/about">About</a>
        <a href="https://github.com/Adityachoudhary08" target="_blank" rel="noreferrer">GitHub</a>
        <a className="nav-cta" href="https://github.com/Adityachoudhary08" target="_blank" rel="noreferrer">Let’s talk <span>↗</span></a>
      </div>
    </nav>
  );
};

export default Navbar;
