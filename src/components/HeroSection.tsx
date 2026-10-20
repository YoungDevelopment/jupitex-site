"use client";

import React, { useEffect, useRef, useState } from "react";
import DashboardPreview from "./DashboardPreview";

function easeOutCubic(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return 1 - Math.pow(1 - clamped, 3);
}

function getBlurRevealStyle(
  elapsedMs: number,
  delayMs: number,
  durationMs: number,
  maxBlurPx: number
): React.CSSProperties {
  const p = easeOutCubic((elapsedMs - delayMs) / durationMs);
  const blur = (1 - p) * maxBlurPx;
  const y = (1 - p) * 6;
  return {
    opacity: p,
    filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "none",
    transform: y > 0.05 ? `translateY(${y.toFixed(2)}px)` : "none",
  };
}

// Fill 100% edge-to-edge on all laptop and desktop screens; only cap when crossing ultrawide (> 1920px)
const ULTRAWIDE_LIMIT = 1920;
const BASE_STAGE_WIDTH = 1428;
const BASE_STAGE_HEIGHT = 928;

// Exact 1428x928 stage coordinates for the complete 4:3 rocks (2400x1792)
// so only the exact reference portion is shown inside the viewport and the rest is cleanly hidden off-screen
const LEFT_ROCK_BOX = { left: -245, top: 1, width: 706, height: 527 }; // relative to bottom stage (y=400..928)
const RIGHT_ROCK_BOX = { left: 909, top: -4, width: 1060, height: 791 }; // relative to bottom stage (y=400..928)

export default function HeroSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [viewportMode, setViewportMode] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const [stageScale, setStageScale] = useState(1);
  const [bottomOffsetPx, setBottomOffsetPx] = useState(0);
  const [topScale, setTopScale] = useState(1);
  const [mobileDashScale, setMobileDashScale] = useState(0.64);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Flashlight coordinates in the 1428 x 928 reference coordinate system
  const targetPos = useRef({ x: 1315, y: 512 });
  const currentPos = useRef({ x: 1315, y: 512 });
  const [flashPos, setFlashPos] = useState({ x: 1315, y: 512 });
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    const updateLayout = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      if (vw < 768) {
        setViewportMode("mobile");
        setStageScale(1);
        setBottomOffsetPx(0);
        setTopScale(1);
        const mScale = Math.min(0.75, Math.max(0.58, (vw / 390) * 0.64));
        setMobileDashScale(mScale);
      } else if (vw < 1024) {
        setViewportMode("tablet");
        setStageScale(vw / BASE_STAGE_WIDTH);
        setBottomOffsetPx(0);
        setTopScale(1);
      } else {
        setViewportMode("desktop");
        const effectiveWidth = Math.min(vw, ULTRAWIDE_LIMIT);
        const sW = effectiveWidth / BASE_STAGE_WIDTH;
        setStageScale(sW);

        const idealHeight = BASE_STAGE_HEIGHT * sW;
        const heightDelta = vh - idealHeight;
        setBottomOffsetPx(heightDelta < 0 ? Math.max(-110, heightDelta * 0.48) : 0);
        setTopScale(Math.min(sW, Math.max(0.92, vh / 860)));
      }
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  // Unified 60fps loop for entrance reveal + flashlight lerp
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const now = Date.now() - startTime;
      setElapsedMs(now <= 2000 ? now : 2000);

      const dx = targetPos.current.x - currentPos.current.x;
      const dy = targetPos.current.y - currentPos.current.y;
      if (Math.abs(dx) > 0.08 || Math.abs(dy) > 0.08) {
        currentPos.current.x += dx * 0.16;
        currentPos.current.y += dy * 0.16;
        setFlashPos({
          x: currentPos.current.x,
          y: currentPos.current.y,
        });
      }
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();

    if (viewportMode === "desktop") {
      const s = rect.width / BASE_STAGE_WIDTH;
      const stageX = (clientX - rect.left) / s;
      const bottomStageTopPx = rect.height - 528 * s - bottomOffsetPx;
      const stageY = 400 + (clientY - rect.top - bottomStageTopPx) / s;
      targetPos.current = { x: stageX, y: stageY };
    } else {
      const normX = (clientX - rect.left) / Math.max(1, rect.width);
      const normY = (clientY - rect.top) / Math.max(1, rect.height);
      targetPos.current = {
        x: 920 + normX * 508,
        y: 400 + Math.max(0, (normY - 0.45) / 0.55) * 528,
      };
    }
  };

  const handlePointerLeave = () => {
    targetPos.current = { x: 1315, y: 512 };
  };

  const flashOpacity = easeOutCubic((elapsedMs - 300) / 800);

  // Local mask coordinates inside the complete 4:3 Left Rock & Right Rock boxes
  const leftMaskX = flashPos.x - LEFT_ROCK_BOX.left;
  const leftMaskY = flashPos.y - 400 - LEFT_ROCK_BOX.top;
  const rightMaskX = flashPos.x - RIGHT_ROCK_BOX.left;
  const rightMaskY = flashPos.y - 400 - RIGHT_ROCK_BOX.top;

  const leftMaskStyle: React.CSSProperties = {
    maskImage: `radial-gradient(circle 250px at ${leftMaskX}px ${leftMaskY}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 42%, rgba(0,0,0,0.4) 72%, rgba(0,0,0,0) 100%)`,
    WebkitMaskImage: `radial-gradient(circle 250px at ${leftMaskX}px ${leftMaskY}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 42%, rgba(0,0,0,0.4) 72%, rgba(0,0,0,0) 100%)`,
    opacity: flashOpacity,
  };

  const rightMaskStyle: React.CSSProperties = {
    maskImage: `radial-gradient(circle 260px at ${rightMaskX}px ${rightMaskY}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 42%, rgba(0,0,0,0.4) 72%, rgba(0,0,0,0) 100%)`,
    WebkitMaskImage: `radial-gradient(circle 260px at ${rightMaskX}px ${rightMaskY}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 42%, rgba(0,0,0,0.4) 72%, rgba(0,0,0,0) 100%)`,
    opacity: flashOpacity,
  };

  const blurStyle1 = getBlurRevealStyle(elapsedMs, 20, 500, 6);
  const blurStyle2 = getBlurRevealStyle(elapsedMs, 100, 650, 12);
  const blurStyle3 = getBlurRevealStyle(elapsedMs, 220, 700, 14);
  const blurStyle4 = getBlurRevealStyle(elapsedMs, 360, 700, 10);

  return (
    <section
      onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
      onTouchMove={(e) => {
        if (e.touches[0]) {
          handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      }}
      onMouseLeave={handlePointerLeave}
      className="relative w-full h-screen min-h-[680px] overflow-hidden select-none bg-white flex justify-center"
    >
      {/* Full-bleed side mist across the entire viewport */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(45% 52% at 6% 78%, rgba(222, 227, 231, 0.78) 0%, rgba(255, 255, 255, 0) 100%), radial-gradient(45% 52% at 94% 78%, rgba(222, 227, 231, 0.78) 0%, rgba(255, 255, 255, 0) 100%)",
        }}
      />

      {/* Stage container: 100% full width on all laptops & desktops up to 1920px; capped only on ultrawide (>1920px) */}
      <div
        ref={stageRef}
        className="relative w-full max-w-[1920px] h-full overflow-hidden flex flex-col justify-between"
      >
        {/* =====================================================================
            1. DESKTOP & LAPTOP VIEW (>= 1024px)
           ===================================================================== */}
        {viewportMode === "desktop" && (
          <>
            {/* Full-Width Desktop Navbar */}
            <header className="relative z-30 w-full h-[68px] px-[44px] flex items-center justify-between shrink-0">
              <a href="#" className="flex items-center shrink-0">
                <img
                  src="/JupitexLogos/nav_logo_light.png"
                  alt="Jupitex"
                  className="h-[26px] w-auto object-contain"
                />
              </a>

              <nav className="flex items-center gap-[29px] translate-x-[6px]">
                {["DASHBOARD", "ASSETS", "ANALYTICS", "MARKETS"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-[11px] font-medium tracking-[0.04em] text-[#121212] hover:text-black/65 transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </nav>

              <a
                href="#launch"
                className="h-[34px] pl-[7px] pr-[15px] rounded-full bg-[#0a0a0a] text-white flex items-center gap-[8px] text-[12px] font-medium tracking-[-0.01em] hover:bg-[#1e1e1e] transition-colors shadow-xs shrink-0"
              >
                <span className="w-[18px] h-[18px] rounded-full bg-white flex items-center justify-center shrink-0">
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M5 1L6.1 3.9L9 5L6.1 6.1L5 9L3.9 6.1L1 5L3.9 3.9L5 1Z"
                      fill="#0a0a0a"
                    />
                  </svg>
                </span>
                <span>Launch app</span>
              </a>
            </header>

            {/* Center Hero Heading & Subtitle */}
            <div
              className="relative z-30 flex-1 flex flex-col items-center justify-center text-center origin-top"
              style={{
                paddingBottom: `${Math.round(476 * stageScale + bottomOffsetPx)}px`,
                transform: `scale(${topScale})`,
              }}
            >
              <div
                style={blurStyle1}
                className="text-[11px] font-medium tracking-[0.045em] text-[#7c7f82] uppercase"
              >
                FINANCE REIMAGINED
              </div>

              <h1 className="mt-[8px] flex flex-col items-center">
                <span
                  style={blurStyle2}
                  className="block text-[66px] font-medium tracking-[-0.038em] leading-[1.05] text-[#c7cacd]"
                >
                  A New Standard
                </span>
                <span
                  style={blurStyle3}
                  className="block text-[66px] font-medium tracking-[-0.038em] leading-[1.08] text-[#090909]"
                >
                  in Wealth Management
                </span>
              </h1>

              <p
                style={blurStyle4}
                className="mt-[20px] max-w-[460px] text-[14.8px] font-normal leading-[1.46] tracking-[-0.01em] text-[#b4b8bc]"
              >
                Take full control of your assets with a unified platform for
                investing, tracking, and growing your portfolio in real time.
              </p>
            </div>

            {/* Unified 1428x528 Bottom Stage */}
            <div
              className="absolute left-1/2 z-20 origin-bottom"
              style={{
                bottom: `${bottomOffsetPx}px`,
                width: "1428px",
                height: "528px",
                transform: `translateX(-50%) scale(${stageScale})`,
              }}
            >
              {/* 1. Complete Left Rock Formation (clipped at x=278px so it never bleeds behind the translucent Analitica sidebar) */}
              <div className="pointer-events-none absolute left-0 bottom-0 w-[278px] h-[528px] overflow-hidden z-10">
                <div
                  className="absolute"
                  style={{
                    left: `${LEFT_ROCK_BOX.left}px`,
                    top: `${LEFT_ROCK_BOX.top}px`,
                    width: `${LEFT_ROCK_BOX.width}px`,
                    height: `${LEFT_ROCK_BOX.height}px`,
                  }}
                >
                  <img
                    src="/rock-left-bare.png"
                    alt=""
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                  <img
                    src="/rock-left-green.png"
                    alt=""
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-contain"
                    style={leftMaskStyle}
                  />
                </div>
              </div>

              {/* 2. Center Dashboard Preview (x: 275..1153) */}
              <div
                className="absolute bottom-0 z-20"
                style={{ left: "275px", width: "878px", height: "476px" }}
              >
                <DashboardPreview />
              </div>

              {/* 3. Complete Right Rock Formation (positioned so the left slope overlaps the dashboard 1:1) */}
              <div
                className="pointer-events-none absolute z-30"
                style={{
                  left: `${RIGHT_ROCK_BOX.left}px`,
                  top: `${RIGHT_ROCK_BOX.top}px`,
                  width: `${RIGHT_ROCK_BOX.width}px`,
                  height: `${RIGHT_ROCK_BOX.height}px`,
                }}
              >
                <img
                  src="/rock-right-bare.png"
                  alt=""
                  draggable={false}
                  className="absolute inset-0 w-full h-full object-contain"
                />
                <img
                  src="/rock-right-green.png"
                  alt=""
                  draggable={false}
                  className="absolute inset-0 w-full h-full object-contain"
                  style={rightMaskStyle}
                />
              </div>
            </div>

            {/* Pinned Full-Width Bottom Vignette & Scroll to explore */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[92px] z-40 flex items-end justify-center pb-[15px]"
              style={{
                background:
                  "linear-gradient(to top, rgba(10, 9, 7, 0.92) 0%, rgba(18, 17, 14, 0.52) 44%, rgba(24, 23, 20, 0) 100%)",
              }}
            >
              <div className="flex items-center gap-[6px] text-white/90 text-[11px] font-normal tracking-[-0.01em]">
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M6 0.8L7.25 4.75L11.2 6L7.25 7.25L6 11.2L4.75 7.25L0.8 6L4.75 4.75L6 0.8Z"
                    fill="white"
                  />
                </svg>
                <span>Scroll to explore</span>
              </div>
            </div>
          </>
        )}

        {/* =====================================================================
            2. TABLET VIEW (768px – 1023px)
               - Fulfilling responsive typography scaled to tablet screen
               - Real <DashboardPreview /> + Complete Right Rock
           ===================================================================== */}
        {viewportMode === "tablet" && (
          <div className="relative z-20 flex flex-col h-full">
            <header className="w-full h-[68px] px-7 flex items-center justify-between shrink-0">
              <a
                href="#"
                className="text-[24px] font-bold tracking-[-0.045em] text-[#0a0a0a] leading-none"
              >
                jupitex
              </a>

              <nav className="flex items-center gap-6">
                {["DASHBOARD", "ASSETS", "ANALYTICS", "MARKETS"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-[11px] font-medium tracking-[0.04em] text-[#121212] hover:text-black/65 transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </nav>

              <a
                href="#launch"
                className="h-[34px] pl-[7px] pr-[14px] rounded-full bg-[#0a0a0a] text-white flex items-center gap-2 text-[12px] font-medium shrink-0"
              >
                <span className="w-[18px] h-[18px] rounded-full bg-white flex items-center justify-center">
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M5 1L6.1 3.9L9 5L6.1 6.1L5 9L3.9 6.1L1 5L3.9 3.9L5 1Z"
                      fill="#0a0a0a"
                    />
                  </svg>
                </span>
                <span>Launch app</span>
              </a>
            </header>

            {/* Tablet Hero Copy — Responsive fluid sizing that fills the tablet stage */}
            <div className="flex-1 px-8 flex flex-col items-center justify-center text-center z-20">
              <div
                style={blurStyle1}
                className="text-[11.5px] font-medium tracking-[0.05em] text-[#7c7f82] uppercase"
              >
                FINANCE REIMAGINED
              </div>
              <h1 className="mt-3 flex flex-col items-center">
                <span
                  style={blurStyle2}
                  className="block text-[clamp(3.4rem,6.8vw,4.35rem)] font-medium tracking-[-0.038em] leading-[1.04] text-[#c7cacd] whitespace-nowrap"
                >
                  A New Standard
                </span>
                <span
                  style={blurStyle3}
                  className="block text-[clamp(3.4rem,6.8vw,4.35rem)] font-medium tracking-[-0.038em] leading-[1.07] text-[#090909] whitespace-nowrap"
                >
                  in Wealth Management
                </span>
              </h1>
              <p
                style={blurStyle4}
                className="mt-5 max-w-[470px] text-[15.5px] font-normal leading-[1.48] tracking-[-0.01em] text-[#aeb2b6]"
              >
                Take full control of your assets with a unified platform for
                investing, tracking, and growing your portfolio in real time.
              </p>
            </div>

            {/* Tablet Bottom Stage: Real Dashboard + Complete Right Rock */}
            <div className="relative w-full h-[430px] shrink-0 overflow-hidden">
              <div
                className="absolute bottom-0 left-7 z-20 origin-bottom-left"
                style={{
                  width: "878px",
                  height: "476px",
                  transform: "scale(0.82)",
                }}
              >
                <DashboardPreview />
              </div>

              <div
                className="pointer-events-none absolute -right-[420px] -bottom-[220px] z-30 origin-bottom-right"
                style={{
                  width: `${RIGHT_ROCK_BOX.width}px`,
                  height: `${RIGHT_ROCK_BOX.height}px`,
                  transform: "scale(0.78)",
                }}
              >
                <img
                  src="/rock-right-bare.png"
                  alt=""
                  draggable={false}
                  className="absolute inset-0 w-full h-full object-contain"
                />
                <img
                  src="/rock-right-green.png"
                  alt=""
                  draggable={false}
                  className="absolute inset-0 w-full h-full object-contain"
                  style={rightMaskStyle}
                />
              </div>

              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[80px] z-40 flex items-end justify-center pb-4"
                style={{
                  background:
                    "linear-gradient(to top, rgba(10, 9, 7, 0.92) 0%, rgba(18, 17, 14, 0.5) 45%, rgba(24, 23, 20, 0) 100%)",
                }}
              >
                <div className="flex items-center gap-1.5 text-white/90 text-[11px] font-normal">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M6 0.8L7.25 4.75L11.2 6L7.25 7.25L6 11.2L4.75 7.25L0.8 6L4.75 4.75L6 0.8Z"
                      fill="white"
                    />
                  </svg>
                  <span>Scroll to explore</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            3. MOBILE VIEW (< 768px)
               - Floating overlay menu (does NOT move hero text)
               - Bold, fulfilling fluid typography scaled to mobile viewport width
               - Real <DashboardPreview /> peeking from behind the Complete Right Rock
           ===================================================================== */}
        {viewportMode === "mobile" && (
          <div className="relative z-20 flex flex-col h-full">
            {/* Mobile Navbar */}
            <header className="relative w-full h-[64px] px-5 flex items-center justify-between shrink-0 z-50">
              <a href="#" className="flex items-center shrink-0">
                <img
                  src="/JupitexLogos/nav_logo_light.png"
                  alt="Jupitex"
                  className="h-[22px] w-auto object-contain"
                />
              </a>

              <div className="flex items-center gap-2.5 shrink-0">
                <a
                  href="#launch"
                  className="h-[34px] pl-[7px] pr-[13px] rounded-full bg-[#0a0a0a] text-white flex items-center gap-[7px] text-[11.5px] font-medium shadow-xs"
                >
                  <span className="w-[17px] h-[17px] rounded-full bg-white flex items-center justify-center">
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                      <path
                        d="M5 1L6.1 3.9L9 5L6.1 6.1L5 9L3.9 6.1L1 5L3.9 3.9L5 1Z"
                        fill="#0a0a0a"
                      />
                    </svg>
                  </span>
                  <span>Launch app</span>
                </a>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Toggle Menu"
                  className="w-[34px] h-[34px] rounded-full border border-black/10 bg-white/90 flex items-center justify-center text-[#121212] cursor-pointer"
                >
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    {mobileMenuOpen ? (
                      <path
                        d="M4 4L12 12M12 4L4 12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    ) : (
                      <path
                        d="M2.5 5.5H13.5M2.5 10.5H13.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    )}
                  </svg>
                </button>
              </div>

              {/* Absolute Dropdown Menu — Overlays cleanly without moving the Hero text */}
              {mobileMenuOpen && (
                <div className="absolute top-[64px] left-5 right-5 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-black/8 shadow-[0_16px_40px_rgba(0,0,0,0.12)] flex flex-col gap-3 z-50">
                  {["DASHBOARD", "ASSETS", "ANALYTICS", "MARKETS"].map((item) => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-[11px] font-semibold tracking-[0.04em] text-[#121212] py-1"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              )}
            </header>

            {/* Mobile Hero Typography — Larger, Fulfilling Fluid Scale */}
            <div className="flex-1 px-4 flex flex-col items-center justify-center text-center z-20">
              <div
                style={blurStyle1}
                className="text-[11px] font-medium tracking-[0.055em] text-[#7c7f82] uppercase"
              >
                FINANCE REIMAGINED
              </div>
              <h1 className="mt-2.5 flex flex-col items-center">
                <span
                  style={blurStyle2}
                  className="block text-[clamp(2.4rem,9.5vw,3.4rem)] font-medium tracking-[-0.038em] leading-[1.04] text-[#c7cacd]"
                >
                  A New Standard
                </span>
                <span
                  style={blurStyle3}
                  className="block text-[clamp(2.4rem,9.5vw,3.4rem)] font-medium tracking-[-0.038em] leading-[1.06] text-[#090909]"
                >
                  in Wealth Management
                </span>
              </h1>
              <p
                style={blurStyle4}
                className="mt-4 max-w-[345px] text-[14px] sm:text-[15px] font-normal leading-[1.5] tracking-[-0.01em] text-[#9fa4a8]"
              >
                Take full control of your assets with a unified platform for
                investing, tracking, and growing your portfolio in real time.
              </p>
            </div>

            {/* Mobile Bottom Stage: Real Dashboard Preview + Complete Right Rock Overlapping */}
            <div className="relative w-full h-[360px] sm:h-[400px] shrink-0 overflow-hidden">
              <div
                className="absolute bottom-0 left-3.5 sm:left-6 z-20 origin-bottom-left"
                style={{
                  width: "878px",
                  height: "476px",
                  transform: `scale(${mobileDashScale})`,
                }}
              >
                <DashboardPreview />
              </div>

              <div
                className="pointer-events-none absolute -right-[330px] -bottom-[175px] z-30 origin-bottom-right"
                style={{
                  width: `${RIGHT_ROCK_BOX.width}px`,
                  height: `${RIGHT_ROCK_BOX.height}px`,
                  transform: `scale(${Math.min(0.56, mobileDashScale * 0.82)})`,
                }}
              >
                <img
                  src="/rock-right-bare.png"
                  alt=""
                  draggable={false}
                  className="absolute inset-0 w-full h-full object-contain"
                />
                <img
                  src="/rock-right-green.png"
                  alt=""
                  draggable={false}
                  className="absolute inset-0 w-full h-full object-contain"
                  style={rightMaskStyle}
                />
              </div>

              {/* Bottom Dark Vignette & Scroll to explore */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[72px] z-40 flex items-end justify-center pb-3.5"
                style={{
                  background:
                    "linear-gradient(to top, rgba(10, 9, 7, 0.94) 0%, rgba(18, 17, 14, 0.58) 48%, rgba(24, 23, 20, 0) 100%)",
                }}
              >
                <div className="flex items-center gap-1.5 text-white/90 text-[10.5px] font-normal">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M6 0.8L7.25 4.75L11.2 6L7.25 7.25L6 11.2L4.75 7.25L0.8 6L4.75 4.75L6 0.8Z"
                      fill="white"
                    />
                  </svg>
                  <span>Scroll to explore</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
