"use client";

import CarouselCard from "@/components/CarouselCard";
import useViewTransition from "@/hooks/useViewTransition";
import { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";

/* ─────────────────────── Geometry Tuning (Reduced Radius) ─────
 *
 *  REDUCED RADIUS CIRCLE:
 *    PIVOT_RADIUS reduced to 570px (down from 730px).
 *    CARD_W = 240px, CARD_H = 135px (Exact 16:9 ratio).
 *    Uniform ~20px gap around all 14 cards on the 360° circle.
 *
 * ──────────────────────────────────────────────────────────── */
const CARD_W = 325;
const CARD_H = 202;
const CARD_COUNT = 14; // 7 projects × 2 for uniform 360° ring
const ANGLE_STEP = 360 / CARD_COUNT; // 25.714286° per card
const PIVOT_RADIUS = 640; // px: circle radius tuned to ensure ~22px gap
const ROTATION_SPEED = 38; // seconds for full 360° loop
const PIVOT_Y = 720; // px from viewport top to circle center

const InfiniteCarousel = ({ projects = [] }) => {
  const containerRef = useRef(null);
  const fanRef = useRef(null);
  const loopTw = useRef(null);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const navigateWithTransition = useViewTransition();

  // 14 cards (2 full sets of 7 projects) for a seamless 360° circle
  const extendedProjects = [...projects, ...projects].slice(0, CARD_COUNT);

  // Distance from pivot to card top
  const pivotToTop = PIVOT_RADIUS + CARD_H / 25;

  /* ── GSAP Continuous Infinite Rotation (Cards Only) ─────── */
  useEffect(() => {
    const fanEl = fanRef.current;
    if (!fanEl) return;

    loopTw.current = gsap.to(fanEl, {
      rotation: "+=360",
      duration: ROTATION_SPEED,
      ease: "none",
      repeat: -1,
    });

    return () => {
      loopTw.current?.kill();
    };
  }, [projects]);

  /* ── Hover Controls for Each Card ──────────────────────── */
  const handleHoverStart = useCallback((index) => {
    setHoveredIdx(index);
    loopTw.current?.pause();
  }, []);

  const handleHoverEnd = useCallback(() => {
    setHoveredIdx(null);
    loopTw.current?.resume();
  }, []);

  /* ── Manual Shift Controls ────────────────────────────── */
  const shiftCarousel = (direction) => {
    const delta = direction === "left" ? -ANGLE_STEP : ANGLE_STEP;
    if (fanRef.current) {
      gsap.to(fanRef.current, {
        rotation: gsap.getProperty(fanRef.current, "rotation") + delta,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background:
          "radial-gradient(circle at 50% 30%, var(--carousel-glow) 0%, var(--page-bg) 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: "absolute",
          top: "8%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "800px",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(56, 189, 248, 0.08) 0%, rgba(139, 92, 246, 0.04) 40%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* Top Header Branding */}
      <header
        style={{
          position: "absolute",
          top: "24px",
          left: "0",
          right: "0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 40px",
          zIndex: 100,
          pointerEvents: "none",
        }}
      >
        {/* <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#10b981",
              boxShadow: "0 0 10px #10b981",
            }}
          />
          <span
            style={{
              color: "#fff",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              fontFamily: "monospace",
            }}
          >
            Aditya Choudhary
          </span>
        </div> */}

        {/* <div
          style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: "11px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            fontFamily: "monospace",
          }}
        >
          Selected Works • 2026
        </div> */}
      </header>

      {/* Shared Rotating Circle Container */}
      <div
        ref={fanRef}
        style={{
          position: "absolute",
          left: "50%",
          top: `${PIVOT_Y}px`,
          width: 0,
          height: 0,
          transformOrigin: "0 0",
          perspective: "1200px",
          willChange: "transform",
          zIndex: 40,
        }}
      >
        {extendedProjects.map((project, i) => {
          const angle = i * ANGLE_STEP;
          const isHov = hoveredIdx === i;

          return (
            <div
              key={`${project.id}-${i}`}
              style={{
                position: "absolute",
                width: CARD_W,
                height: CARD_H,
                left: -CARD_W / 2,
                top: -pivotToTop,
                transformOrigin: `center ${pivotToTop}px`,
                transform: isHov
                  ? `rotate(${angle}deg)`
                  : `rotate(${angle}deg)`,
                zIndex: isHov ? 500 : 30,
                transition: "transform 0.4s cubic-bezier(0.2, 0.9, 0.3, 1), filter 0.3s ease",
                filter:
                  hoveredIdx !== null && !isHov
                    ? "brightness(0.65) saturate(0.8)"
                    : "brightness(1) saturate(1)",
              }}
            >
              <CarouselCard
                project={project}
                index={i}
                isHovered={isHov}
                onHoverStart={handleHoverStart}
                onHoverEnd={handleHoverEnd}
                onClick={(event) =>
                  navigateWithTransition(`/project/${project.slug}`, event.currentTarget, project.title, project.number)
                }
              />
            </div>
          );
        })}
      </div>

      {/* Enlarged Static Bottom Hemisphere (Does NOT rotate) */}
      <div
        style={{
          position: "absolute",
          bottom: "-260px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "580px",
          height: "580px",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 20,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        {/* Completely Static Dial Disc */}
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: "var(--hemisphere-bg)",
            border: "1px solid var(--hemisphere-border)",
            boxShadow: "0 -20px 50px rgba(0, 0, 0, 0.85), inset 0 2px 16px rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(12px)",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Dashed outer track ring */}
          <div
            style={{
              position: "absolute",
              inset: "16px",
              borderRadius: "50%",
              border: "1px dashed var(--hemisphere-border)",
            }}
          />

          {/* Inner concentric ring */}
          <div
            style={{
              position: "absolute",
              inset: "52px",
              borderRadius: "50%",
              border: "1px solid var(--hemisphere-border)",
            }}
          />

          {/* Curved Static SVG Text */}
          <svg
            viewBox="0 0 520 520"
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              overflow: "visible",
            }}
          >
            <path
              id="dialTextPathStatic"
              d="M 60,260 A 200,200 0 0,1 460,260"
              fill="none"
              stroke="none"
            />
            <text
              fill="var(--hemisphere-detail)"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="600"
              letterSpacing="3.2"
            >
              <textPath
                href="#dialTextPathStatic"
                startOffset="50%"
                textAnchor="middle"
              >
                • PORTFOLIO    •     ADITYA CHOUDHARY • 
              </textPath>
            </text>
          </svg>
        </div>

        {/* Center Top Pointer Triangle & PROJECTS Label */}
        <div
          style={{
            position: "absolute",
            top: "8px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 90,
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              borderBottom: "8px solid var(--nav-text)",
              marginBottom: "3px",
              filter: "drop-shadow(0 0 4px var(--hemisphere-detail))",
            }}
          />
          <span
            style={{
              fontSize: "10px",
              fontWeight: 800,
              letterSpacing: "2px",
              color: "var(--nav-text)",
              fontFamily: "monospace",
            }}
          >
            PROJECTS
          </span>
        </div>
      </div>

      {/* Face avatar sits between the dial lettering and the inspection hint */}
      <div
        style={{
          position: "absolute",
          bottom: "80px",
          left: "50%",
          width: "clamp(118px, 11vw, 142px)",
          aspectRatio: "1",
          transform: "translateX(-50%) translateZ(0)",
          borderRadius: "50%",
          overflow: "hidden",
          zIndex: 70,
          pointerEvents: "none",
          background: "#111217",
          border: "2px solid rgba(255, 255, 255, 0.72)",
          boxShadow:
            "0 14px 28px rgba(0, 0, 0, 0.75), 0 0 0 7px rgba(255, 255, 255, 0.05), inset 0 0 18px rgba(255, 255, 255, 0.2)",
          transformStyle: "preserve-3d",
        }}
      >
        <img
          src="/avatar-cartoon.png"
          alt="3D cartoon avatar wearing glasses"
          draggable={false}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 35%",
            transform: "scale(1.85)",
            transformOrigin: "center 35%",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.22), transparent 38%, rgba(0,0,0,0.28))",
          }}
        />
      </div>

      {/* Navigation Controls (Left & Right Arrow Buttons) */}
      <div
        style={{
          position: "absolute",
          bottom: "30px",
          left: "0",
          right: "0",
          display: "flex",
          justifyContent: "space-between",
          padding: "0 40px",
          zIndex: 100,
          pointerEvents: "auto",
        }}
      >
        <button
          onClick={() => shiftCarousel("left")}
          aria-label="Previous projects"
          style={{
            background: "var(--control-bg)",
            backdropFilter: "blur(10px)",
            border: "1px solid var(--control-border)",
            color: "var(--control-text)",
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "18px",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.borderColor = "var(--control-hover-border)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.borderColor = "var(--control-border)";
          }}
        >
          ←
        </button>

        <div
          style={{
            background: "var(--control-muted-bg)",
            backdropFilter: "blur(10px)",
            border: "1px solid var(--control-muted-border)",
            padding: "10px 15px",
            borderRadius: "20px",
            color: "var(--control-muted-text)",
            fontSize: "11px",
            fontFamily: "monospace",
            letterSpacing: "1px",
          }}
        >
          Hover card to inspect
        </div>

        <button
          onClick={() => shiftCarousel("right")}
          aria-label="Next projects"
          style={{
            background: "var(--control-bg)",
            backdropFilter: "blur(10px)",
            border: "1px solid var(--control-border)",
            color: "var(--control-text)",
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "18px",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.borderColor = "var(--control-hover-border)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.borderColor = "var(--control-border)";
          }}
        >
          →
        </button>
      </div>
    </div>
  );
};

export default InfiniteCarousel;
