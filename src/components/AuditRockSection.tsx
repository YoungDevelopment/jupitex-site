"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

const LOGO_ORANGE = "#FF731E";

export default function AuditRockSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Left-to-right staggered card reveal: starts AFTER the rock has smoothly slid up into place
  const getCardAnimationStyle = (index: number): React.CSSProperties => {
    const delayMs = 600 + index * 160; // Card 1: 600ms, Card 2: 760ms, Card 3: 920ms, Card 4: 1080ms, Card 5: 1240ms
    return {
      opacity: isVisible ? 1 : 0,
      filter: isVisible ? "blur(0px)" : "blur(8px)",
      transform: isVisible ? "translateY(0px)" : "translateY(20px)",
      transitionProperty: "opacity, filter, transform, box-shadow, border-color",
      transitionDuration: "700ms",
      transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
      transitionDelay: isVisible ? `${delayMs}ms` : "0ms",
    };
  };

  return (
    <section
      ref={sectionRef}
      id="audit-rock"
      aria-label="Free AI Automation Audit — Rock Arch View"
      className="relative w-full h-screen min-h-[740px] max-h-screen overflow-hidden bg-[#f1f2f3] select-none flex flex-col items-center justify-start px-4 sm:px-8 lg:px-10 xl:px-14 pt-16 sm:pt-20 xl:pt-24"
    >
      {/* Subtle Ambient Mist */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(60% 55% at 50% 0%, rgba(255, 255, 255, 0.7) 0%, rgba(241, 242, 243, 0) 100%), radial-gradient(42% 48% at 92% 78%, rgba(255, 115, 30, 0.04) 0%, rgba(255, 255, 255, 0) 100%)",
        }}
      />

      {/* =====================================================================
          MAIN CONTENT CONTAINER (Larger, more readable, more spacious)
         ===================================================================== */}
      <div className="relative z-20 w-full max-w-[1420px] mx-auto flex flex-col items-center">
        {/* 1. EDITORIAL HEADER */}
        <div
          className="flex flex-col items-center text-center transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            filter: isVisible ? "none" : "blur(10px)",
            transform: isVisible ? "translateY(0px)" : "translateY(14px)",
          }}
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/95 border border-black/[0.06] text-[11px] sm:text-[11.5px] font-semibold tracking-[0.06em] text-[#0a0a0a] uppercase shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: LOGO_ORANGE }}
            />
            <span>FREE AI AUTOMATION AUDIT</span>
          </div>

          <h2 className="mt-3.5 sm:mt-4 flex flex-wrap items-center justify-center gap-x-3.5 gap-y-2 text-[clamp(1.85rem,3.5vw,2.95rem)] font-medium tracking-[-0.038em] leading-[1.12]">
            <span className="text-[#8e9296]">That is why we built</span>
            <span className="inline-flex items-center px-4 py-1.5 rounded-[16px] bg-white border border-black/[0.06] shadow-[0_4px_14px_rgba(0,0,0,0.04)]">
              <Image
                src="/JupitexLogos/nav_logo_light.png"
                alt="Jupitex"
                width={125}
                height={35}
                className="h-[22px] sm:h-[27px] lg:h-[30px] w-auto object-contain"
                priority
              />
            </span>
          </h2>

          <p className="mt-3 max-w-[650px] text-[14.5px] sm:text-[16px] font-normal leading-[1.55] tracking-[-0.01em] text-[#55585c] px-2">
            We&apos;ll look at how your business runs and show you{" "}
            <span className="text-[#090909] font-medium">
              exactly what&apos;s worth automating
            </span>{" "}
            — and how much time and money each change saves.
          </p>

          {/* Lead-in line: "How our AI audit looks like" */}
          <p className="mt-4 sm:mt-5 text-[13.5px] sm:text-[14.5px] font-semibold tracking-[-0.015em] text-[#090909]">
            How our AI audit looks like
          </p>
        </div>

        {/* =====================================================================
            2. UNIFIED STAGE: LARGER, HIGH-READABILITY CARDS & EMBRACED ROCK
           ===================================================================== */}
        <div className="relative w-full mt-8 sm:mt-10 xl:mt-11">
          {/* THE ROCK: Slides in from the bottom with comfortable breathing room below Card 3 */}
          <div
            className="hidden lg:block pointer-events-none absolute left-1/2 -translate-x-1/2 top-[315px] xl:top-[325px] z-10 w-[550px] xl:w-[610px] transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible
                ? "translate3d(0, 0px, 0)"
                : "translate3d(0, 160px, 0)",
              transitionDelay: "100ms",
            }}
          >
            <Image
              src="/Audit-bare.png"
              alt="Jupitex Foundation Rock"
              width={1024}
              height={1033}
              className="w-full h-auto object-contain select-none"
              priority
            />
          </div>

          {/* 5 EQUAL-SIZE CARDS: Bigger font, high readability, spacious internal padding */}
          <div className="relative z-20 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-4.5 xl:gap-5.5 items-start">
            {/* -----------------------------------------------------------------
                CARD 01 (Far Left - Beside Rock Base)
               ----------------------------------------------------------------- */}
            <div
              onMouseEnter={() => setHoveredCard(1)}
              onMouseLeave={() => setHoveredCard(null)}
              style={getCardAnimationStyle(0)}
              className="lg:mt-[270px] xl:mt-[285px] w-full min-h-[238px] xl:min-h-[248px] rounded-[20px] bg-white border border-black/[0.05] hover:border-[#FF731E]/40 p-5 xl:p-6 flex flex-col justify-between gap-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_38px_rgba(0,0,0,0.08)]"
            >
              <div>
                <div className="flex items-center gap-3">
                  <span
                    className="w-7 h-7 rounded-full text-[12px] font-bold flex items-center justify-center transition-colors duration-300 shrink-0"
                    style={{
                      backgroundColor:
                        hoveredCard === 1 ? LOGO_ORANGE : "rgba(10,10,10,0.07)",
                      color: hoveredCard === 1 ? "#ffffff" : "#0a0a0a",
                    }}
                  >
                    1
                  </span>
                  <h3 className="text-[15.5px] xl:text-[16.5px] font-semibold tracking-[-0.02em] text-[#090909] leading-snug">
                    Scope with Owners
                  </h3>
                </div>

                <p className="mt-2 text-[12.5px] xl:text-[13.5px] leading-[1.55] text-[#55595e]">
                  Align with leadership on core goals, bottlenecks, and target outcomes.
                </p>
              </div>

              {/* Graphic Area */}
              <div className="pt-3 border-t border-black/[0.05] flex flex-col justify-center gap-2">
                <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-[#f8f9fa] border border-black/[0.04]">
                  <span
                    className="w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9.5px] font-bold text-white shrink-0"
                    style={{ backgroundColor: LOGO_ORANGE }}
                  >
                    ✓
                  </span>
                  <span className="text-[12px] xl:text-[12.5px] font-medium text-[#121212]">
                    Eliminate manual reporting
                  </span>
                </div>

                <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-[#f8f9fa] border border-black/[0.04]">
                  <span
                    className="w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9.5px] font-bold shrink-0 transition-colors duration-300"
                    style={{
                      backgroundColor:
                        hoveredCard === 1 ? LOGO_ORANGE : "rgba(10,10,10,0.1)",
                      color: hoveredCard === 1 ? "#ffffff" : "#0a0a0a",
                    }}
                  >
                    ✓
                  </span>
                  <span className="text-[12px] xl:text-[12.5px] font-medium text-[#121212]">
                    Save 15+ hrs every week
                  </span>
                </div>
              </div>
            </div>

            {/* -----------------------------------------------------------------
                CARD 02 (Mid Left - Upper Left Slope of Rock)
               ----------------------------------------------------------------- */}
            <div
              onMouseEnter={() => setHoveredCard(2)}
              onMouseLeave={() => setHoveredCard(null)}
              style={getCardAnimationStyle(1)}
              className="lg:mt-[135px] xl:mt-[142px] w-full min-h-[238px] xl:min-h-[248px] rounded-[20px] bg-white border border-black/[0.05] hover:border-[#FF731E]/40 p-5 xl:p-6 flex flex-col justify-between gap-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_38px_rgba(0,0,0,0.08)]"
            >
              <div>
                <div className="flex items-center gap-3">
                  <span
                    className="w-7 h-7 rounded-full text-[12px] font-bold flex items-center justify-center transition-colors duration-300 shrink-0"
                    style={{
                      backgroundColor:
                        hoveredCard === 2 ? LOGO_ORANGE : "rgba(10,10,10,0.07)",
                      color: hoveredCard === 2 ? "#ffffff" : "#0a0a0a",
                    }}
                  >
                    2
                  </span>
                  <h3 className="text-[15.5px] xl:text-[16.5px] font-semibold tracking-[-0.02em] text-[#090909] leading-snug">
                    Map Flowcharts
                  </h3>
                </div>

                <p className="mt-2 text-[12.5px] xl:text-[13.5px] leading-[1.55] text-[#55595e]">
                  Work with your team to turn daily operations into clear visual flowcharts.
                </p>
              </div>

              {/* Graphic Area */}
              <div className="pt-3 border-t border-black/[0.05] flex flex-col justify-center">
                <div
                  className="rounded-xl bg-[#f8f9fa] border border-black/[0.04] px-3 py-2.5 flex items-center justify-between gap-2"
                  style={{
                    backgroundImage:
                      "radial-gradient(rgba(10,10,10,0.06) 1px, transparent 1px)",
                    backgroundSize: "10px 10px",
                  }}
                >
                  <div className="px-3 py-1.5 rounded-md bg-white border border-black/[0.07] text-[11.5px] xl:text-[12px] font-medium text-[#121212] shrink-0">
                    Input
                  </div>

                  <div className="flex-1 h-[1.5px] bg-black/15 relative flex items-center justify-center">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: LOGO_ORANGE }}
                    />
                  </div>

                  <div
                    className="px-3 py-1.5 rounded-md text-[11.5px] xl:text-[12px] font-semibold text-white shrink-0"
                    style={{ backgroundColor: LOGO_ORANGE }}
                  >
                    AI Flow
                  </div>

                  <div className="flex-1 h-[1.5px] bg-black/15 relative flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-black/30" />
                  </div>

                  <div className="px-3 py-1.5 rounded-md bg-[#0a0a0a] text-[11.5px] xl:text-[12px] font-medium text-white shrink-0">
                    Done
                  </div>
                </div>
              </div>
            </div>

            {/* -----------------------------------------------------------------
                CARD 03 (Center Peak - Directly Above Rock Peak)
               ----------------------------------------------------------------- */}
            <div
              onMouseEnter={() => setHoveredCard(3)}
              onMouseLeave={() => setHoveredCard(null)}
              style={getCardAnimationStyle(2)}
              className="lg:mt-0 w-full min-h-[238px] xl:min-h-[248px] rounded-[20px] bg-white border border-black/[0.05] hover:border-[#FF731E]/40 p-5 xl:p-6 flex flex-col justify-between gap-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_38px_rgba(0,0,0,0.08)]"
            >
              <div>
                <div className="flex items-center gap-3">
                  <span
                    className="w-7 h-7 rounded-full text-[12px] font-bold flex items-center justify-center transition-colors duration-300 shrink-0"
                    style={{
                      backgroundColor:
                        hoveredCard === 3 ? LOGO_ORANGE : "rgba(10,10,10,0.07)",
                      color: hoveredCard === 3 ? "#ffffff" : "#0a0a0a",
                    }}
                  >
                    3
                  </span>
                  <h3 className="text-[15.5px] xl:text-[16.5px] font-semibold tracking-[-0.02em] text-[#090909] leading-snug">
                    Evaluate Cost &amp; ROI
                  </h3>
                </div>

                <p className="mt-2 text-[12.5px] xl:text-[13.5px] leading-[1.55] text-[#55595e]">
                  See what is worth automating, how long it takes, and the exact ROI.
                </p>
              </div>

              {/* Graphic Area */}
              <div className="pt-3 border-t border-black/[0.05] flex flex-col justify-center gap-2.5">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11.5px] xl:text-[12px] text-[#7c7f82]">
                    <span>Manual Process</span>
                    <span>14 hrs / wk</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-black/[0.08]" />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[12px] xl:text-[12.5px] font-semibold">
                    <span className="text-[#090909]">Automated</span>
                    <span style={{ color: LOGO_ORANGE }}>10m · 4.8x ROI</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-black/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: hoveredCard === 3 ? "24%" : "18%",
                        backgroundColor: LOGO_ORANGE,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* -----------------------------------------------------------------
                CARD 04 (Mid Right - Upper Right Slope of Rock)
               ----------------------------------------------------------------- */}
            <div
              onMouseEnter={() => setHoveredCard(4)}
              onMouseLeave={() => setHoveredCard(null)}
              style={getCardAnimationStyle(3)}
              className="lg:mt-[135px] xl:mt-[142px] w-full min-h-[238px] xl:min-h-[248px] rounded-[20px] bg-white border border-black/[0.05] hover:border-[#FF731E]/40 p-5 xl:p-6 flex flex-col justify-between gap-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_38px_rgba(0,0,0,0.08)]"
            >
              <div>
                <div className="flex items-center gap-3">
                  <span
                    className="w-7 h-7 rounded-full text-[12px] font-bold flex items-center justify-center transition-colors duration-300 shrink-0"
                    style={{
                      backgroundColor:
                        hoveredCard === 4 ? LOGO_ORANGE : "rgba(10,10,10,0.07)",
                      color: hoveredCard === 4 ? "#ffffff" : "#0a0a0a",
                    }}
                  >
                    4
                  </span>
                  <h3 className="text-[15.5px] xl:text-[16.5px] font-semibold tracking-[-0.02em] text-[#090909] leading-snug">
                    Review with Team
                  </h3>
                </div>

                <p className="mt-2 text-[12.5px] xl:text-[13.5px] leading-[1.55] text-[#55595e]">
                  Walk through the findings with your team and refine workflows together.
                </p>
              </div>

              {/* Graphic Area */}
              <div className="pt-3 border-t border-black/[0.05] flex flex-col justify-center gap-2">
                <div className="flex items-center justify-between gap-2.5 px-3 py-1.5 rounded-lg bg-[#f8f9fa] border border-black/[0.04]">
                  <span className="text-[11.5px] xl:text-[12px] font-medium text-[#55585c]">
                    &ldquo;Add manager approval&rdquo;
                  </span>
                  <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded bg-white border border-black/[0.06] text-[#121212] shrink-0">
                    Team
                  </span>
                </div>

                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#f8f9fa] border border-black/[0.04]">
                  <span
                    className="w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9.5px] font-bold text-white shrink-0"
                    style={{ backgroundColor: LOGO_ORANGE }}
                  >
                    ✓
                  </span>
                  <span className="text-[11.5px] xl:text-[12px] font-medium text-[#121212]">
                    Adjusted in blueprint
                  </span>
                </div>
              </div>
            </div>

            {/* -----------------------------------------------------------------
                CARD 05 (Far Right - Beside Rock Base)
               ----------------------------------------------------------------- */}
            <div
              onMouseEnter={() => setHoveredCard(5)}
              onMouseLeave={() => setHoveredCard(null)}
              style={getCardAnimationStyle(4)}
              className="sm:col-span-2 lg:col-span-1 lg:mt-[270px] xl:mt-[285px] w-full min-h-[238px] xl:min-h-[248px] rounded-[20px] bg-white border border-black/[0.05] hover:border-[#FF731E]/40 p-5 xl:p-6 flex flex-col justify-between gap-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_38px_rgba(0,0,0,0.08)]"
            >
              <div>
                <div className="flex items-center gap-3">
                  <span
                    className="w-7 h-7 rounded-full text-[12px] font-bold flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: LOGO_ORANGE }}
                  >
                    5
                  </span>
                  <h3 className="text-[15.5px] xl:text-[16.5px] font-semibold tracking-[-0.02em] text-[#090909] leading-snug">
                    Final Presentation
                  </h3>
                </div>

                <p className="mt-2 text-[12.5px] xl:text-[13.5px] leading-[1.55] text-[#55595e]">
                  Present everything that can be automated, exact build cost, and ROI.
                </p>
              </div>

              {/* Graphic Area */}
              <div className="pt-3 border-t border-black/[0.05] flex items-center">
                <div className="w-full grid grid-cols-3 gap-1.5 text-center">
                  <div className="rounded-lg bg-[#f8f9fa] border border-black/[0.04] py-2 px-1">
                    <div className="text-[10px] text-[#7c7f82]">Scope</div>
                    <div className="text-[11.5px] xl:text-[12px] font-semibold text-[#090909] mt-0.5">
                      6 Flows
                    </div>
                  </div>

                  <div className="rounded-lg bg-[#f8f9fa] border border-black/[0.04] py-2 px-1">
                    <div className="text-[10px] text-[#7c7f82]">Cost</div>
                    <div className="text-[11.5px] xl:text-[12px] font-semibold text-[#090909] mt-0.5">
                      Fixed
                    </div>
                  </div>

                  <div
                    className="rounded-lg border py-2 px-1"
                    style={{
                      backgroundColor: "rgba(255, 115, 30, 0.06)",
                      borderColor: "rgba(255, 115, 30, 0.24)",
                    }}
                  >
                    <div className="text-[10px] text-[#5c6064]">ROI</div>
                    <div
                      className="text-[11.5px] xl:text-[12px] font-semibold mt-0.5"
                      style={{ color: LOGO_ORANGE }}
                    >
                      +$64k/yr
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
