const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/adityachoudhary4665/",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/aditya-choudhary-001ab332a/",
  },
];

export default function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div className="site-footer__topline">
        <span>03 / CONTACT</span>
        <span>LET&apos;S BUILD SOMETHING MEANINGFUL</span>
      </div>

      <div className="site-footer__content">
        <div className="site-footer__intro">
          <p className="site-footer__eyebrow">Have an idea?</p>
          <h2>Let&apos;s make it <em>real.</em></h2>
          <a
            className="site-footer__email"
            href="mailto:choudharyaditya139@gmail.com"
          >
            choudharyaditya139@gmail.com <span>-&gt;</span>
          </a>
        </div>

        <div className="site-footer__details">
          <div>
            <p className="site-footer__label">Find me online</p>
            <nav className="site-footer__links" aria-label="Social links">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label} <span>-&gt;</span>
                </a>
              ))}
            </nav>
          </div>

          <div>
            <p className="site-footer__label">Based in</p>
            <p className="site-footer__muted">India - Available worldwide</p>
          </div>
        </div>
      </div>

      <div className="site-footer__bottomline">
        <span>ADITYA CHOUDHARY (C) {new Date().getFullYear()}</span>
        <a href="#top">Back to top <span>^</span></a>
      </div>
    </footer>
  );
}
