"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const storyMoments = [
  {
    number: "01",
    label: "CURIOSITY",
    text: <>I enjoy exploring <strong>new technologies</strong>, understanding how things work beneath the surface, and experimenting with ideas that challenge what I already know.</>,
  },
  {
    number: "02",
    label: "EXPERIMENTATION",
    text: <>My work revolves around building complete products — from designing <strong>backend architectures</strong> and integrating APIs to developing intelligent applications.</>,
  },
  {
    number: "03",
    label: "DIRECTION",
    text: <>I&apos;m interested in technology that solves <strong>meaningful problems</strong>, especially those that are overlooked or still waiting for a better solution.</>,
  },
];

const principles = [
  ["01", "STAY CURIOUS", "I don&apos;t believe in limiting myself to what I already know. I&apos;m always eager to explore new technologies, regardless of how simple or challenging they might be."],
  ["02", "UNDERSTAND DEEPLY", "I want to understand the problem beneath the surface, not just make something work on the surface."],
  ["03", "MAKE IT WORK", "My goal is to navigate the challenges, connect the right technologies, and turn an idea into something real."],
];

const toolkit = [
  {
    number: "01",
    title: "BACKEND ENGINEERING",
    description: "The systems, APIs and architecture that make a product dependable.",
    items: ["Node.js", "Express.js", "Python", "FastAPI", "MongoDB", "REST APIs", "Backend Architecture"],
  },
  {
    number: "02",
    title: "AI & INTELLIGENT SYSTEMS",
    description: "Exploring useful intelligence through retrieval, agents and custom integrations.",
    items: ["Retrieval-Augmented Generation (RAG)", "Vector Databases", "LangChain", "LangGraph", "LLM Integrations", "AI Agents", "Custom AI Backends"],
  },
  {
    number: "03",
    title: "PRODUCT ENGINEERING",
    description: "Turning a strong system into a complete, usable product.",
    items: ["React", "JavaScript", "Tailwind CSS", "GSAP", "Framer Motion", "API Integrations", "Authentication and Payment Integrations"],
  },
];

const exploring = ["AI Agents", "LLM Systems", "System Design", "Backend Architecture", "Product Engineering"];

export default function AboutExperience() {
  const pageRef = useRef(null);
  const portraitRef = useRef(null);

  useGSAP(() => {
    const motion = gsap.matchMedia();
    motion.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray(".about-reveal").forEach((element) => {
        gsap.fromTo(element, { autoAlpha: 0, y: 28 }, {
          autoAlpha: 1,
          y: 0,
          duration: .8,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 84%", once: true },
        });
      });

      gsap.fromTo(".about-hero__line", { clipPath: "inset(0 100% 0 0)" }, {
        clipPath: "inset(0 0% 0 0)",
        duration: 1,
        stagger: .12,
        ease: "power4.out",
      });

      gsap.fromTo(".about-hero__portrait", { clipPath: "inset(100% 0 0 0)", y: 30 }, {
        clipPath: "inset(0% 0 0 0)",
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: .15,
      });

      gsap.to(portraitRef.current, {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: ".about-hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    });

    return () => motion.revert();
  }, { scope: pageRef });

  return (
    <main className="about-editorial" ref={pageRef}>
      <section className="about-hero" aria-labelledby="about-title">
        <div className="about-hero__portrait-wrap">
          <img ref={portraitRef} className="about-hero__portrait" src="/aditya-portrait-cutout.png" alt="Portrait of Aditya Choudhary" />
          <span className="about-hero__portrait-note">A HUMAN PERSPECTIVE ON TECHNOLOGY</span>
        </div>
        <div className="about-hero__content">
          <p className="about-label">01 — INTRODUCTION</p>
          <h1 id="about-title">
            <span className="about-hero__line">Curious by Nature.</span>
            <span className="about-hero__line about-hero__line--serif">Engineer by Choice.</span>
          </h1>
          <p className="about-hero__intro">
            I&apos;m Aditya Choudhary — a Full-Stack Developer focused on backend
            engineering and AI-powered products.
          </p>
        </div>
        <span className="about-hero__index">SCROLL TO EXPLORE ↓</span>
      </section>

      <section className="about-story about-reveal" aria-labelledby="story-title">
        <div className="about-section-intro">
          <p className="about-label">02 — MY STORY</p>
          <h2 id="story-title">The curiosity behind the code</h2>
          <p>Exploring what&apos;s beneath the surface and building what comes next.</p>
        </div>
        <div className="about-story__moments">
          {storyMoments.map((moment) => (
            <article className="about-story__moment" key={moment.number}>
              <span className="about-story__number">{moment.number}</span>
              <div>
                <p className="about-label">{moment.label}</p>
                <p>{moment.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about-philosophy about-reveal" aria-labelledby="philosophy-title">
        <div className="about-section-intro">
          <p className="about-label">03 — MY PHILOSOPHY</p>
          <h2 id="philosophy-title">How I approach engineering</h2>
          <p>Three principles that keep me moving forward.</p>
        </div>
        <div className="about-principles">
          {principles.map(([number, title, text]) => <Principle key={number} number={number} title={title} text={text} />)}
        </div>
      </section>

      <section className="about-playground about-reveal" aria-labelledby="playground-title">
        <div className="about-section-intro">
          <p className="about-label">04 — MY TOOLKIT</p>
          <h2 id="playground-title">The engineering playground</h2>
          <p>Backend / AI / Product Engineering</p>
        </div>
        <div className="about-toolkit">
          {toolkit.map((group) => (
            <article className={`about-toolkit__group about-toolkit__group--${group.number}`} key={group.number}>
              <span className="about-toolkit__number">{group.number}</span>
              <div>
                <h3>{group.title}</h3>
                <p>{group.description}</p>
                <div className="about-toolkit__items">
                  {group.items.map((item) => <span key={item} title={`${item} — explored in projects and experiments`}>{item}</span>)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about-exploring-section about-reveal" aria-labelledby="exploring-title">
        <div className="about-beyond__exploring">
          <p id="exploring-title" className="about-label">05 — CURRENTLY EXPLORING</p>
          <span className="about-beyond__exploring-count">05 / 05</span>
          <div className="about-beyond__exploring-list">
            {exploring.map((item, index) => (
              <span key={item}><b>0{index + 1}</b>{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="about-closing about-reveal" aria-labelledby="closing-title">
        <p className="about-label">06 — CLOSING</p>
        <h2 id="closing-title">Explore. Understand.<br /><em>Build. Ship. Repeat.</em></h2>
        <p>
          I&apos;m currently pursuing my B.Tech, continuously learning and pushing my
          engineering capabilities further — with a long-term goal of taking an idea
          from its earliest sketch to a production-ready product.
        </p>
        <Link className="about-closing__link" href="/#contact">Let&apos;s build something <span>-&gt;</span></Link>
      </section>
    </main>
  );
}

function Principle({ number, title, text }) {
  const handleMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
  };

  return (
    <article className="about-principle" onMouseMove={handleMove}>
      <span className="about-principle__number">{number}</span>
      <h3>{title}</h3>
      <p>{text}</p>
      <span className="about-principle__line" aria-hidden="true" />
    </article>
  );
}
