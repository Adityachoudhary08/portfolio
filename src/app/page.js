
import InfiniteCarousel from "@/components/InfiniteCarousel";
import HeroPortrait from "@/components/HeroPortrait";
import { projects } from "@/data/projects";

export default function Home() {
  return (
    <main className="home-page">
      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-topline">
          <span><i /> ENGINEER, DEVELOPER, BUILDER.</span>
          <span>BASED IN INDIA · THINKING BEYOND</span>
        </div>

        <div className="hero-side-note" aria-hidden="true">
          <span className="side-index">01 / PRESENCE</span>
          <span className="side-mark">+</span>
          <span>ENGINEERING<br />EDUCATION<br /></span>
        </div>

        <HeroPortrait />

        <div className="hero-copy">
          <h1 id="hero-title">Aditya <em>Choudhary</em></h1>
          <p className="hero-description">
            I build products, explore new ideas, and help them<br />grow.
          </p>
          <div className="hero-actions">
            <a className="button-pill" href="#work">Explore my work <span>↓</span></a>
            <a className="text-link" href="https://github.com/Adityachoudhary08" target="_blank" rel="noreferrer">Start a conversation <span>↗</span></a>
          </div>
        </div>

        <div className="hero-bottomline"><span>SCROLL TO EXPLORE</span></div>
      </section>

      <section className="work-section" id="work" aria-labelledby="work-title">
        <div className="work-heading">
          <div>
            <p className="section-eyebrow">02 / SELECTED WORK</p>
            <h2 id="work-title">Projects <em>& ideas</em></h2>
          </div>
          <p className="work-intro">A selection of things I’ve designed, built, and brought to life.</p>
        </div>
        <InfiniteCarousel projects={projects} />
      </section>
    </main>
  );
}
