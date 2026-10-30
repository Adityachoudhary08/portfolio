"use client";

import { useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "@/libs/gsap";

const TRANSITION_ID = "project-card-transition";

const useViewTransition = () => {
  const router = useRouter();
  const isNavigating = useRef(false);

  return useCallback((href, sourceElement, projectTitle = "Selected project", projectNumber = "01") => {
    if (isNavigating.current || !href) return;
    isNavigating.current = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push(href);
      return;
    }

    const overlay = document.createElement("div");
    const bounds = sourceElement?.getBoundingClientRect();
    const card = sourceElement?.cloneNode(true);
    const title = document.createElement("div");
    const start = bounds || {
      left: window.innerWidth / 2 - 90,
      top: window.innerHeight / 2 - 58,
      width: 180,
      height: 116,
    };

    overlay.id = TRANSITION_ID;
    overlay.setAttribute("aria-hidden", "true");
    Object.assign(overlay.style, {
      position: "fixed",
      inset: "0",
      zIndex: "9999",
      overflow: "hidden",
      pointerEvents: "none",
      background: "linear-gradient(90deg, #f6f6f3 0%, #f6f6f3 43%, #101010 43%, #101010 100%)",
      opacity: "0",
      clipPath: "inset(0 0 0 0)",
      willChange: "opacity",
    });

    if (card) {
      Object.assign(card.style, {
        position: "fixed",
        top: `${start.top}px`,
        left: `${start.left}px`,
        width: `${start.width}px`,
        height: `${start.height}px`,
        zIndex: "2",
        margin: "0",
        transform: "none",
        transformOrigin: "center",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 30px 90px rgba(0,0,0,.4)",
        willChange: "top,left,width,height,border-radius",
      });
      const image = card.querySelector("img");
      if (image) {
        Object.assign(image.style, {
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "scale(1)",
        });
      }
      overlay.appendChild(card);
    }

    const eyebrow = document.createElement("div");
    eyebrow.textContent = `SELECTED WORK / ${String(projectNumber).padStart(2, "0")}`;
    Object.assign(eyebrow.style, {
      position: "absolute",
      top: "clamp(24px, 5vw, 70px)",
      left: "clamp(24px, 5vw, 70px)",
      zIndex: "3",
      color: "rgba(255,255,255,.78)",
      font: "600 9px/1.4 monospace",
      letterSpacing: ".2em",
      opacity: "0",
    });
    title.textContent = projectTitle;
    Object.assign(title.style, {
      position: "absolute",
      left: "clamp(24px, 5vw, 70px)",
      bottom: "clamp(35px, 6vw, 86px)",
      zIndex: "3",
      color: "#fff",
      font: "400 clamp(32px, 6vw, 86px)/.95 Georgia, serif",
      letterSpacing: "-.055em",
      opacity: "0",
      transform: "translateY(18px)",
    });
    const accentLine = document.createElement("div");
    Object.assign(accentLine.style, {
      position: "absolute",
      bottom: "clamp(22px, 4vw, 56px)",
      left: "clamp(24px, 5vw, 70px)",
      width: "clamp(90px, 18vw, 250px)",
      height: "1px",
      zIndex: "3",
      background: "#d69b70",
      transform: "scaleX(0)",
      transformOrigin: "left center",
    });
    overlay.appendChild(title);
    overlay.appendChild(eyebrow);
    overlay.appendChild(accentLine);
    document.body.appendChild(overlay);

    const revealNewPage = () => {
      router.push(href);
      window.setTimeout(() => {
        gsap.to(overlay, {
          clipPath: "inset(0 100% 0 0)",
          duration: 0.78,
          ease: "power4.inOut",
          onComplete: () => {
            overlay.remove();
            isNavigating.current = false;
          },
        });
      }, 360);
    };

    const timeline = gsap.timeline({ onComplete: revealNewPage });
    timeline.to(overlay, { opacity: 1, duration: 0.3, ease: "power1.out" }, 0);
    if (card) {
      timeline.to(card, {
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        borderRadius: 18,
        duration: 1.08,
        ease: "power4.inOut",
      }, 0.04);
      const image = card.querySelector("img");
      if (image) timeline.to(image, { scale: 1.08, duration: 1.08, ease: "power4.inOut" }, 0.04);
    } else {
      timeline.fromTo(title, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.35 }, 0.2);
      timeline.to({}, { duration: 0.73 });
    }
    timeline.to(eyebrow, { autoAlpha: 1, duration: 0.35, ease: "power2.out" }, 0.42);
    timeline.to(title, { autoAlpha: 1, y: 0, duration: 0.48, ease: "power3.out" }, 0.52);
    timeline.to(accentLine, { scaleX: 1, duration: 0.55, ease: "power3.out" }, 0.55);

    window.setTimeout(() => {
      if (document.getElementById(TRANSITION_ID)) {
        overlay.remove();
        isNavigating.current = false;
      }
    }, 3500);
  }, [router]);
};

export default useViewTransition;
