"use client";

import { useState } from "react";
import Link from "next/link";

export default function ProjectDetail({ project }) {
  const heroImage = project.heroImage || project.coverImage;
  const slides = [
    { src: heroImage, type: "HERO" },
    ...(project.gallery || [])
      .filter((image) => image && image !== heroImage)
      .map((src) => ({ src, type: "GALLERY" })),
  ];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex] || slides[0];
  const showImage = (index) => setActiveIndex((index + slides.length) % slides.length);

  return (
    <main className="project-detail-page">
      <header className="project-detail-nav">
        <nav className="project-detail-menu" aria-label="Project navigation">
          <Link className="project-detail-menu__home" href="/">Home</Link>
          <Link href="/#work">Projects</Link>
          <Link href="/about">About</Link>
        </nav>
        <a className="project-detail-contact" href="https://github.com/Adityachoudhary08" target="_blank" rel="noreferrer">
          <span aria-hidden="true">↗</span> Contact
        </a>
      </header>

      <section className="project-detail-layout" aria-labelledby="project-title">
        <div className="project-detail-copy">
          <div className="project-detail-kicker">
            <span className="project-detail-kicker__dot" />
            {project.category} <span>·</span> {project.year}
          </div>
          <h1 id="project-title">{project.title}</h1>
          <p className="project-detail-subtitle">{project.subtitle}</p>

          <div className="project-detail-index" aria-label={`Project ${project.number}`}>
            <span />
            <b>{project.number}</b>
            <span />
          </div>

          <div className="project-detail-description">
            <span className="project-detail-description__mark" aria-hidden="true">✳</span>
            <p>{project.description}</p>
          </div>

          <div className="project-detail-meta">
            <span>MY ROLE</span>
            <strong>{project.role}</strong>
            <div className="project-detail-actions">
              <a href={project.github} target="_blank" rel="noreferrer">GitHub <span>↗</span></a>
              {project.liveDemo && <a className="project-detail-actions__live" href={project.liveDemo} target="_blank" rel="noreferrer">Live site <span>↗</span></a>}
            </div>
          </div>
        </div>

        <div className="project-detail-visual">
          <img key={activeSlide.src} className="project-detail-image" src={activeSlide.src} alt={`${project.title} ${activeSlide.type.toLowerCase()} image ${activeIndex + 1}`} />
          <div className="project-detail-image-shade" />
          <span className="project-detail-image-label">{activeSlide.type} IMAGE <b>{project.number}</b></span>
          <span className="project-detail-slide-count"><b>{String(activeIndex + 1).padStart(2, "0")}</b><i>/</i>{String(slides.length).padStart(2, "0")}</span>
          <div className="project-detail-image-tags" aria-label="Technologies used">
            {project.tags.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </div>
      </section>

      <div className="project-gallery" aria-label="Project image gallery">
        <div className="project-gallery__cards">
          {slides.map((slide, index) => (
            <button
              className={`project-gallery__card${index === activeIndex ? " is-active" : ""}`}
              type="button"
              key={slide.src}
              onClick={() => showImage(index)}
              aria-label={`Show project preview ${index + 1}`}
              aria-pressed={index === activeIndex}
            >
              <img src={slide.src} alt="" />
              <span>{String(index + 1).padStart(2, "0")} / {slide.type}</span>
            </button>
          ))}
        </div>
        <div className="project-gallery__controls">
          <span>{String(activeIndex + 1).padStart(2, "0")}<i> / </i>{String(slides.length).padStart(2, "0")}</span>
          <button type="button" onClick={() => showImage(activeIndex - 1)} aria-label="Previous image">←</button>
          <button type="button" onClick={() => showImage(activeIndex + 1)} aria-label="Next image">→</button>
        </div>
      </div>
    </main>
  );
}
