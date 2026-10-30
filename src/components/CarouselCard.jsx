"use client";

import { useRef, useState } from "react";

const CarouselCard = ({
  project,
  index,
  isHovered,
  onHoverStart,
  onHoverEnd,
  onClick,
}) => {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handlePointerMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    setTilt({
      x: y * -10,
      y: x * 10,
    });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick?.(event);
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => onHoverStart?.(index)}
      onMouseLeave={() => onHoverEnd?.(index)}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      onFocus={() => onHoverStart?.(index)}
      onBlur={() => onHoverEnd?.(index)}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="link"
      aria-label={`View ${project.title} project`}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        cursor: "pointer",
        borderRadius: "20px",
        overflow: "hidden",
        background: "#0c0c0e",
        border: "none",
        boxShadow: isHovered
          ? "0 48px 90px -18px rgba(0, 0, 0, 0.98), 0 20px 42px -18px rgba(190, 190, 190, 0.6)"
          : "0 20px 45px -10px rgba(0, 0, 0, 0.85), 0 4px 15px rgba(0, 0, 0, 0.5)",
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.3 : 1})`,
        transformStyle: "preserve-3d",
        userSelect: "none",
        transition: "transform 0.18s ease-out, box-shadow 0.3s ease",
      }}
    >
      {/* Full Cover Image showing the complete project visual */}
      <img
        src={project.coverImage}
        alt={project.title}
        draggable={false}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          // objectFit: "cover",
          objectPosition: "center center",
          transform: "scale(1)",
          transition: "transform 0.45s cubic-bezier(0.2, 0.9, 0.3, 1)",
        }}
      />

      {/* Subtle depth vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isHovered
            ? "linear-gradient(125deg, rgba(230, 230, 230, 0.2), rgba(130, 130, 130, 0.04) 42%, rgba(0, 0, 0, 0.25))"
            : "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.15) 100%)",
          mixBlendMode: isHovered ? "screen" : "normal",
          pointerEvents: "none",
          transition: "background 0.3s ease, mix-blend-mode 0.3s ease",
        }}
      />

      {/* Hover Overlay: Show Title and Number ONLY on hover */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(0deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 50%, rgba(70,70,70,0.15) 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "14px 16px",
          boxSizing: "border-box",
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontSize: "10px",
            fontWeight: 700,
            fontFamily: "monospace",
            color: "#bdbdbd",
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "3px",
          }}
        >
          #{project.number || `0${index + 1}`}
        </span>
        <h3
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: "#ffffff",
            margin: 0,
            letterSpacing: "-0.3px",
            lineHeight: 1.2,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {project.title}
        </h3>
      </div>
    </div>
  );
};

export default CarouselCard;
