"use client";

import { useEffect, useRef, useCallback } from "react";

/* ───────────────────────────────────────────────────────────
   Spider-crawl theme transition
   – A <canvas> overlay spawns dozens of tiny spiders that
     scuttle across the screen, "painting" the new theme
     colour behind them, then scurry off-screen.
   ─────────────────────────────────────────────────────────── */

const SPIDER_COUNT = 80;           // total spiders
const SPIDER_SIZE = 12;            // body radius in px
const LEG_LENGTH = 16;             // each leg segment
const TRAIL_RADIUS = 38;           // paint‐blob each spider leaves
const CRAWL_SPEED_MIN = 2.8;
const CRAWL_SPEED_MAX = 5.5;
const PHASE_CRAWL_IN = 1400;       // ms – spiders rush in
const PHASE_HOLD = 200;            // ms – brief pause, theme flips
const PHASE_CRAWL_OUT = 1200;      // ms – spiders leave

const DARK_BG = "#090909";
const LIGHT_BG = "#f2f2ef";

/* ── Helper: cubic‐ease‐in‐out ────────────────────────── */
function ease(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/* ── One spider ───────────────────────────────────────── */
function createSpider(canvasW, canvasH, targetTheme) {
  // pick random edge to start from
  const edge = Math.floor(Math.random() * 4); // 0=top 1=right 2=bottom 3=left
  let sx, sy;
  switch (edge) {
    case 0: sx = Math.random() * canvasW; sy = -30; break;
    case 1: sx = canvasW + 30;            sy = Math.random() * canvasH; break;
    case 2: sx = Math.random() * canvasW; sy = canvasH + 30; break;
    default: sx = -30;                    sy = Math.random() * canvasH; break;
  }
  // target position somewhere on screen
  const tx = Math.random() * canvasW;
  const ty = Math.random() * canvasH;

  const speed = CRAWL_SPEED_MIN + Math.random() * (CRAWL_SPEED_MAX - CRAWL_SPEED_MIN);
  const legPhase = Math.random() * Math.PI * 2;

  return {
    sx, sy,          // start
    tx, ty,          // target (on screen)
    ex: 0, ey: 0,    // exit (computed later)
    x: sx, y: sy,
    speed,
    legPhase,
    size: SPIDER_SIZE * (0.6 + Math.random() * 0.6),
    painted: false,
    targetTheme,
  };
}

function computeExit(sp, canvasW, canvasH) {
  // exit to the opposite-ish edge from where it started
  const edge = Math.floor(Math.random() * 4);
  switch (edge) {
    case 0: sp.ex = Math.random() * canvasW; sp.ey = -40; break;
    case 1: sp.ex = canvasW + 40;            sp.ey = Math.random() * canvasH; break;
    case 2: sp.ex = Math.random() * canvasW; sp.ey = canvasH + 40; break;
    default: sp.ex = -40;                    sp.ey = Math.random() * canvasH; break;
  }
}

/* ── Draw a single spider ─────────────────────────────── */
function drawSpider(ctx, sp, time) {
  const { x, y, size, legPhase } = sp;
  const legAnim = Math.sin(time * 0.012 + legPhase);

  ctx.save();
  ctx.translate(x, y);

  const color = sp.targetTheme === "light" ? "#15151a" : "#e8e4df";

  // legs (4 pairs)
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.3;
  ctx.lineCap = "round";
  for (let i = 0; i < 8; i++) {
    const side = i < 4 ? -1 : 1;
    const idx = i % 4;
    const baseAngle = (side * (25 + idx * 22)) * (Math.PI / 180);
    const wobble = legAnim * (0.12 + idx * 0.06) * side;
    const segLen = LEG_LENGTH * (size / SPIDER_SIZE);

    // first segment (from body)
    const mx = Math.cos(baseAngle + wobble) * segLen * 0.7;
    const my = Math.sin(baseAngle + wobble) * segLen * 0.7;
    // second segment ("knee" outward)
    const ex = mx + Math.cos(baseAngle + wobble + side * 0.8) * segLen * 0.9;
    const ey = my + Math.sin(baseAngle + wobble + side * 0.8) * segLen * 0.9;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(mx, my);
    ctx.lineTo(ex, ey);
    ctx.stroke();
  }

  // body (two circles: abdomen + head)
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.75, size * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(size * 0.5, 0, size * 0.38, 0, Math.PI * 2);
  ctx.fill();

  // tiny eyes
  const eyeColor = sp.targetTheme === "light" ? "#d69b70" : "#d69b70";
  ctx.fillStyle = eyeColor;
  ctx.beginPath();
  ctx.arc(size * 0.7, -size * 0.13, 1.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(size * 0.7, size * 0.13, 1.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/* ── Main component ───────────────────────────────────── */
export default function SpiderThemeTransition({ isTransitioning, targetTheme, onMidpoint, onComplete }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const paintCanvasRef = useRef(null); // off‐screen canvas for paint blobs

  const run = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    // create offscreen canvas for paint layer
    const paintCanvas = document.createElement("canvas");
    paintCanvas.width = W;
    paintCanvas.height = H;
    paintCanvasRef.current = paintCanvas;
    const pctx = paintCanvas.getContext("2d");

    // spawn spiders
    const spiders = [];
    for (let i = 0; i < SPIDER_COUNT; i++) {
      const sp = createSpider(W, H, targetTheme);
      computeExit(sp, W, H);
      // stagger spawn
      sp.delay = Math.random() * 300;
      spiders.push(sp);
    }

    const startTime = performance.now();
    let midpointFired = false;
    const totalDuration = PHASE_CRAWL_IN + PHASE_HOLD + PHASE_CRAWL_OUT;

    function frame(now) {
      const elapsed = now - startTime;

      ctx.clearRect(0, 0, W, H);

      // ── Phase logic ──
      let phase, t;
      if (elapsed < PHASE_CRAWL_IN) {
        phase = "crawl_in";
        t = Math.min(elapsed / PHASE_CRAWL_IN, 1);
      } else if (elapsed < PHASE_CRAWL_IN + PHASE_HOLD) {
        phase = "hold";
        t = 1;
      } else if (elapsed < totalDuration) {
        phase = "crawl_out";
        t = Math.min((elapsed - PHASE_CRAWL_IN - PHASE_HOLD) / PHASE_CRAWL_OUT, 1);
      } else {
        phase = "done";
        t = 1;
      }

      // fire midpoint callback (theme flip) right at hold start
      if (!midpointFired && elapsed >= PHASE_CRAWL_IN) {
        midpointFired = true;
        onMidpoint?.();
      }

      // ── Update & paint spiders ──
      for (const sp of spiders) {
        const spElapsed = Math.max(0, elapsed - sp.delay);

        if (phase === "crawl_in" || phase === "hold") {
          const progress = ease(Math.min(spElapsed / PHASE_CRAWL_IN, 1));
          sp.x = sp.sx + (sp.tx - sp.sx) * progress;
          sp.y = sp.sy + (sp.ty - sp.sy) * progress;

          // paint trail on offscreen canvas
          if (progress > 0.15) {
            const paintColor = targetTheme === "light" ? LIGHT_BG : DARK_BG;
            pctx.fillStyle = paintColor;
            pctx.globalAlpha = Math.min(progress * 1.2, 0.92);
            pctx.beginPath();
            pctx.arc(sp.x, sp.y, TRAIL_RADIUS * (0.6 + progress * 0.4), 0, Math.PI * 2);
            pctx.fill();
            pctx.globalAlpha = 1;
          }
        } else if (phase === "crawl_out") {
          const outProgress = ease(Math.min((spElapsed - PHASE_CRAWL_IN) / PHASE_CRAWL_OUT, 1));
          sp.x = sp.tx + (sp.ex - sp.tx) * outProgress;
          sp.y = sp.ty + (sp.ey - sp.ty) * outProgress;
        }
      }

      // ── Draw paint layer ──
      ctx.drawImage(paintCanvas, 0, 0);

      // ── Draw spiders on top ──
      for (const sp of spiders) {
        if (phase !== "done") {
          drawSpider(ctx, sp, elapsed);
        }
      }

      if (phase !== "done") {
        animRef.current = requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, W, H);
        onComplete?.();
      }
    }

    animRef.current = requestAnimationFrame(frame);
  }, [targetTheme, onMidpoint, onComplete]);

  useEffect(() => {
    if (isTransitioning) {
      run();
    }
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isTransitioning, run]);

  if (!isTransitioning) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        pointerEvents: "none",
        width: "100vw",
        height: "100vh",
      }}
    />
  );
}
