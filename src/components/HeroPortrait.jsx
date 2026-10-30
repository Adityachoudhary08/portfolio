"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function HeroPortrait() {
  const frameRef = useRef(null);

  useGSAP(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const motion = gsap.matchMedia();
    motion.add("(prefers-reduced-motion: no-preference)", () => {
      const hero = frame.closest(".hero");
      const image = frame.querySelector(".hero-portrait");
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      timeline
        .fromTo(frame,
          { autoAlpha: 0, y: 18, clipPath: "inset(7% 15% 16% 15%)" },
          { autoAlpha: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 0.9 },
        )
        .fromTo(image,
          { scale: 1.08, filter: "grayscale(1) brightness(.46) contrast(1.7) blur(4px)" },
          { scale: 1, filter: "grayscale(1) brightness(1.08) contrast(1.16) blur(0px)", duration: 0.9, clearProps: "filter,transform" },
          "<",
        );

      if (hero) {
        timeline
          .fromTo(hero.querySelector(".hero-topline"),
            { autoAlpha: 0, y: -7 },
            { autoAlpha: 1, y: 0, duration: 0.42 },
            0.08,
          )
          .fromTo(hero.querySelector(".hero-side-note"),
            { autoAlpha: 0, x: -9 },
            { autoAlpha: 1, x: 0, duration: 0.46 },
            0.14,
          )
          .fromTo(hero.querySelector(".hero-copy"),
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, duration: 0.5 },
            0.08,
          );
      }

      if (hero) {
        gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: () => `+=${Math.round(hero.getBoundingClientRect().height * 0.75)}`,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        }).fromTo(
          frame,
          { yPercent: 0, scale: 1 },
          { yPercent: -8, scale: 0.96, ease: "none", duration: 1 },
        );
      }
    });

    return () => motion.revert();
  }, { scope: frameRef });

  return (
    <div className="portrait-wrap" ref={frameRef}>
      <img className="hero-portrait" src="/aditya-portrait-cutout.png" alt="Portrait of Aditya Choudhary" />
      <span className="portrait-caption">A HUMAN PERSPECTIVE ON TECHNOLOGY</span>
      <span className="portrait-grain" aria-hidden="true" />
    </div>
  );
}
