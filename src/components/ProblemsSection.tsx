"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

interface WordToken {
  text: string;
  badge?: {
    id: string;
    statusColor: "amber" | "red" | "emerald" | "dark";
  };
}

interface ProblemStatement {
  index: string;
  eyebrow: string;
  caption: string;
  words: WordToken[];
}

const PROBLEMS_DATA: ProblemStatement[] = [
  {
    index: "01",
    eyebrow: "PROBLEMS · 01 / MANUAL WORKFLOWS",
    caption:
      "Hours lost every week stitching spreadsheets, exporting CSVs, and reconciling rows by hand.",
    words: [
      { text: "Is" },
      { text: "your" },
      { text: "team" },
      { text: "still" },
      { text: "working" },
      { text: "on" },
      { text: "the" },
      {
        text: "reports manually?",
        badge: { id: "b-manual", statusColor: "amber" },
      },
    ],
  },
  {
    index: "02",
    eyebrow: "PROBLEMS · 02 / OPERATIONAL FRICTION",
    caption:
      "Fragile pipelines and siloed databases turn routine operations into daily fire drills.",
    words: [
      {
        text: "Missed Deadlines,",
        badge: { id: "b-deadlines", statusColor: "red" },
      },
      {
        text: "Database Slowness,",
        badge: { id: "b-db", statusColor: "red" },
      },
      {
        text: "Human Errors",
        badge: { id: "b-errors", statusColor: "amber" },
      },
      { text: "—" },
      { text: "does" },
      { text: "this" },
      { text: "sound" },
      { text: "familiar?" },
    ],
  },
  {
    index: "03",
    eyebrow: "PROBLEMS · 03 / THE CLARITY GAP",
    caption:
      "Bridging the gap between knowing AI is the future and deploying a production-grade roadmap.",
    words: [
      { text: "You" },
      { text: "know" },
      {
        text: "AI and Automation",
        badge: { id: "b-ai", statusColor: "emerald" },
      },
      { text: "is" },
      { text: "the" },
      { text: "answer," },
      { text: "but" },
      { text: "do" },
      { text: "not" },
      { text: "know" },
      {
        text: "where to start.",
        badge: { id: "b-start", statusColor: "dark" },
      },
    ],
  },
];

function clamp(val: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, val));
}

function easeInOutCubic(t: number): number {
  const c = clamp(t, 0, 1);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
}

function easeOutCubic(t: number): number {
  const c = clamp(t, 0, 1);
  return 1 - Math.pow(1 - c, 3);
}

export default function ProblemsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Active slide index within ProblemsSection: 0, 1, or 2
  const [activeStep, setActiveStep] = useState(0);
  const activeStepRef = useRef(0);

  // Continuous progress [0..2] where Slide 0 = 0.0, Slide 1 = 1.0, Slide 2 = 2.0
  const targetStepFloatRef = useRef(0);
  const currentStepFloatRef = useRef(0);
  const [displayStepFloat, setDisplayStepFloat] = useState(0);

  // Scroll velocity / transition energy [0..1] for scroll micro-interactions on the small text
  const scrollImpulseRef = useRef(0);
  const [scrollImpulse, setScrollImpulse] = useState(0);

  // Section entrance/exit fade factor [0..1]
  const targetEntryFadeRef = useRef(1);
  const currentEntryFadeRef = useRef(1);
  const [entryFade, setEntryFade] = useState(1);

  // Interactive pulse when user clicks a highlighted pill
  const [pulsingId, setPulsingId] = useState<string | null>(null);

  // Gesture state for 1-swipe-per-slide navigation
  const lockUntilRef = useRef(0);
  const gestureConsumedRef = useRef(false);
  const lastWheelTimeRef = useRef(0);
  const minDeltaSinceTriggerRef = useRef(9999);
  const scrollAnimRafRef = useRef<number | null>(null);
  const touchStartYRef = useRef(0);
  const touchConsumedRef = useRef(false);

  // Custom smooth window scroll animator (immune to e.preventDefault() cancellation)
  const animateWindowScrollTo = useCallback(
    (targetY: number, durationMs = 620) => {
      if (scrollAnimRafRef.current !== null) {
        cancelAnimationFrame(scrollAnimRafRef.current);
      }
      const startY = window.scrollY;
      const diff = targetY - startY;
      if (Math.abs(diff) < 2) {
        window.scrollTo(0, targetY);
        return;
      }
      const startTime = performance.now();

      const stepScroll = (now: number) => {
        const elapsed = now - startTime;
        const t = clamp(elapsed / durationMs, 0, 1);
        const eased = easeInOutCubic(t);
        window.scrollTo(0, Math.round(startY + diff * eased));
        if (t < 1) {
          scrollAnimRafRef.current = requestAnimationFrame(stepScroll);
        } else {
          scrollAnimRafRef.current = null;
        }
      };

      scrollAnimRafRef.current = requestAnimationFrame(stepScroll);
    },
    []
  );

  // Transition directly to a slide (0, 1, or 2)
  const goToStep = useCallback(
    (nextStep: number) => {
      const clamped = clamp(nextStep, 0, 2);
      activeStepRef.current = clamped;
      setActiveStep(clamped);
      targetStepFloatRef.current = clamped;
      targetEntryFadeRef.current = 1;
      scrollImpulseRef.current = 1;

      if (sectionRef.current) {
        const sectionTop = sectionRef.current.offsetTop;
        if (Math.abs(window.scrollY - sectionTop) > 8) {
          animateWindowScrollTo(sectionTop, 560);
        }
      }
    },
    [animateWindowScrollTo]
  );

  // Unified 1-Swipe-Per-Slide Wheel Controller:
  // Hero <-> Slide 1 <-> Slide 2 <-> Slide 3
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!sectionRef.current) return;

      const now = performance.now();
      const absDelta = Math.abs(e.deltaY);
      const timeSinceLastWheel = now - lastWheelTimeRef.current;
      lastWheelTimeRef.current = now;

      // Detect whether a previous swipe gesture has finished or if the user started a fresh swipe
      if (timeSinceLastWheel > 90) {
        gestureConsumedRef.current = false;
        minDeltaSinceTriggerRef.current = 9999;
      } else if (gestureConsumedRef.current) {
        if (absDelta < minDeltaSinceTriggerRef.current) {
          minDeltaSinceTriggerRef.current = absDelta;
        } else if (
          now > lockUntilRef.current &&
          absDelta > minDeltaSinceTriggerRef.current + 24 &&
          absDelta > minDeltaSinceTriggerRef.current * 1.65
        ) {
          gestureConsumedRef.current = false;
        }
      }

      const sectionTop = sectionRef.current.offsetTop;
      const auditTop = sectionTop + sectionRef.current.offsetHeight;
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      const isInHero = scrollY < sectionTop - vh * 0.35;
      const isInProblems =
        scrollY >= sectionTop - vh * 0.35 && scrollY < auditTop - vh * 0.35;
      const isAtTopOfAudit =
        scrollY >= auditTop - vh * 0.35 && scrollY <= auditTop + 80;

      if (!isInHero && !isInProblems && !(isAtTopOfAudit && e.deltaY < 0)) {
        return;
      }

      // Always prevent native scroll jumps between Hero, Problems, and Audit top so 1 swipe = 1 screen
      e.preventDefault();

      if (absDelta < 10) return;

      // Feed subtle micro-impulse even on small scroll attempts
      scrollImpulseRef.current = Math.max(
        scrollImpulseRef.current,
        clamp(absDelta / 60, 0.25, 1)
      );

      if (now < lockUntilRef.current || gestureConsumedRef.current) {
        return;
      }

      const consumeGesture = (lockMs = 640) => {
        gestureConsumedRef.current = true;
        minDeltaSinceTriggerRef.current = absDelta;
        lockUntilRef.current = now + lockMs;
        scrollImpulseRef.current = 1;
      };

      if (isInHero) {
        if (e.deltaY > 0) {
          // 1 swipe down from Hero -> go directly to Slide 1 (step 0) with text fade-in
          consumeGesture(680);
          activeStepRef.current = 0;
          setActiveStep(0);
          targetStepFloatRef.current = 0;
          currentStepFloatRef.current = 0;
          setDisplayStepFloat(0);
          currentEntryFadeRef.current = 0;
          setEntryFade(0);
          targetEntryFadeRef.current = 1;
          animateWindowScrollTo(sectionTop, 620);
        }
        return;
      }

      if (isAtTopOfAudit && e.deltaY < 0) {
        // 1 swipe up from top of AuditSection -> return to Slide 3 (step 2) of ProblemsSection
        consumeGesture(680);
        activeStepRef.current = 2;
        setActiveStep(2);
        targetStepFloatRef.current = 2;
        targetEntryFadeRef.current = 1;
        animateWindowScrollTo(sectionTop, 620);
        return;
      }

      // User is in Problems section
      if (e.deltaY > 0) {
        if (activeStepRef.current < 2) {
          consumeGesture(620);
          goToStep(activeStepRef.current + 1);
        } else {
          // 1 swipe down from Slide 3 -> glide down to AuditSection
          consumeGesture(680);
          animateWindowScrollTo(auditTop, 640);
        }
      } else {
        if (activeStepRef.current > 0) {
          consumeGesture(620);
          goToStep(activeStepRef.current - 1);
        } else {
          // 1 swipe up from Slide 1 -> go directly back to Hero section with text fade-out
          consumeGesture(680);
          targetEntryFadeRef.current = 0;
          animateWindowScrollTo(0, 620);
        }
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [animateWindowScrollTo, goToStep]);

  // Unified 1-Swipe-Per-Slide Mobile Touch Controller
  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches[0]) {
        touchStartYRef.current = e.touches[0].clientY;
        touchConsumedRef.current = false;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!sectionRef.current || !e.touches[0]) return;
      const sectionTop = sectionRef.current.offsetTop;
      const auditTop = sectionTop + sectionRef.current.offsetHeight;
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      const currentY = e.touches[0].clientY;
      const deltaY = touchStartYRef.current - currentY;

      const isInHero = scrollY < sectionTop - vh * 0.35;
      const isInProblems =
        scrollY >= sectionTop - vh * 0.35 && scrollY < auditTop - vh * 0.35;
      const isAtTopOfAudit =
        scrollY >= auditTop - vh * 0.35 && scrollY <= auditTop + 80;

      if (!isInHero && !isInProblems && !(isAtTopOfAudit && deltaY < 0)) {
        return;
      }

      if (Math.abs(deltaY) < 28) return;

      e.preventDefault();

      const now = performance.now();
      if (touchConsumedRef.current || now < lockUntilRef.current) {
        return;
      }

      touchConsumedRef.current = true;
      lockUntilRef.current = now + 640;
      scrollImpulseRef.current = 1;

      if (isInHero) {
        if (deltaY > 0) {
          activeStepRef.current = 0;
          setActiveStep(0);
          targetStepFloatRef.current = 0;
          currentStepFloatRef.current = 0;
          setDisplayStepFloat(0);
          currentEntryFadeRef.current = 0;
          setEntryFade(0);
          targetEntryFadeRef.current = 1;
          animateWindowScrollTo(sectionTop, 600);
        }
        return;
      }

      if (isAtTopOfAudit && deltaY < 0) {
        activeStepRef.current = 2;
        setActiveStep(2);
        targetStepFloatRef.current = 2;
        targetEntryFadeRef.current = 1;
        animateWindowScrollTo(sectionTop, 600);
        return;
      }

      if (deltaY > 0) {
        if (activeStepRef.current < 2) {
          goToStep(activeStepRef.current + 1);
        } else {
          animateWindowScrollTo(auditTop, 620);
        }
      } else {
        if (activeStepRef.current > 0) {
          goToStep(activeStepRef.current - 1);
        } else {
          targetEntryFadeRef.current = 0;
          animateWindowScrollTo(0, 600);
        }
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [animateWindowScrollTo, goToStep]);

  // Keyboard Up/Down arrow support
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!sectionRef.current) return;
      if (
        e.key !== "ArrowDown" &&
        e.key !== "ArrowUp" &&
        e.key !== "PageDown" &&
        e.key !== "PageUp"
      ) {
        return;
      }
      const now = performance.now();
      if (now < lockUntilRef.current) {
        e.preventDefault();
        return;
      }

      const sectionTop = sectionRef.current.offsetTop;
      const auditTop = sectionTop + sectionRef.current.offsetHeight;
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const isInHero = scrollY < sectionTop - vh * 0.35;
      const isInProblems =
        scrollY >= sectionTop - vh * 0.35 && scrollY < auditTop - vh * 0.35;
      const isAtTopOfAudit =
        scrollY >= auditTop - vh * 0.35 && scrollY <= auditTop + 80;
      const isDirectionDown = e.key === "ArrowDown" || e.key === "PageDown";

      if (
        !isInHero &&
        !isInProblems &&
        !(isAtTopOfAudit && !isDirectionDown)
      ) {
        return;
      }

      e.preventDefault();
      lockUntilRef.current = now + 600;
      scrollImpulseRef.current = 1;

      if (isInHero) {
        if (isDirectionDown) {
          activeStepRef.current = 0;
          setActiveStep(0);
          targetStepFloatRef.current = 0;
          currentEntryFadeRef.current = 0;
          setEntryFade(0);
          targetEntryFadeRef.current = 1;
          animateWindowScrollTo(sectionTop, 600);
        }
        return;
      }

      if (isAtTopOfAudit && !isDirectionDown) {
        activeStepRef.current = 2;
        setActiveStep(2);
        targetStepFloatRef.current = 2;
        targetEntryFadeRef.current = 1;
        animateWindowScrollTo(sectionTop, 600);
        return;
      }

      if (isDirectionDown) {
        if (activeStepRef.current < 2) {
          goToStep(activeStepRef.current + 1);
        } else {
          animateWindowScrollTo(auditTop, 620);
        }
      } else {
        if (activeStepRef.current > 0) {
          goToStep(activeStepRef.current - 1);
        } else {
          targetEntryFadeRef.current = 0;
          animateWindowScrollTo(0, 600);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [animateWindowScrollTo, goToStep]);

  // 60fps animation loop for smooth text fade-in/fade-out morphing & scroll impulse decay
  useEffect(() => {
    let rafId: number;

    const tick = () => {
      const ds = targetStepFloatRef.current - currentStepFloatRef.current;
      const df = targetEntryFadeRef.current - currentEntryFadeRef.current;

      if (Math.abs(ds) > 0.0008) {
        currentStepFloatRef.current += ds * 0.11;
        setDisplayStepFloat(currentStepFloatRef.current);
      } else if (currentStepFloatRef.current !== targetStepFloatRef.current) {
        currentStepFloatRef.current = targetStepFloatRef.current;
        setDisplayStepFloat(currentStepFloatRef.current);
      }

      if (Math.abs(df) > 0.001) {
        currentEntryFadeRef.current += df * 0.1;
        setEntryFade(currentEntryFadeRef.current);
      } else if (currentEntryFadeRef.current !== targetEntryFadeRef.current) {
        currentEntryFadeRef.current = targetEntryFadeRef.current;
        setEntryFade(currentEntryFadeRef.current);
      }

      if (scrollImpulseRef.current > 0.005) {
        scrollImpulseRef.current *= 0.9;
        setScrollImpulse(scrollImpulseRef.current);
      } else if (scrollImpulseRef.current !== 0) {
        scrollImpulseRef.current = 0;
        setScrollImpulse(0);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const triggerPulse = (id: string) => {
    setPulsingId(id);
    setTimeout(() => {
      setPulsingId((prev) => (prev === id ? null : prev));
    }, 650);
  };

  // Progress ring circumference for the bottom small scroll indicator
  const ringRadius = 10;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringProgress = clamp((displayStepFloat + 1) / 3, 0, 1);
  const ringDashOffset = ringCircumference * (1 - ringProgress);

  return (
    <section
      ref={sectionRef}
      id="problems"
      aria-label="Problems"
      className="relative w-full h-screen min-h-[600px] bg-white select-none overflow-hidden"
    >
      {/* Full-Viewport Centered Stage */}
      <div
        ref={stageRef}
        className="relative w-full h-full flex flex-col items-center justify-between px-6 sm:px-12 lg:px-20 py-8 sm:py-11"
      >
        {/* 1. First-Draft Subtle Ambient Radial Gradient Background */}
        <div
          className="pointer-events-none absolute inset-0 z-0 transition-all duration-700"
          style={{
            background:
              activeStep === 0
                ? "radial-gradient(48% 50% at 10% 25%, rgba(226, 231, 235, 0.65) 0%, rgba(255, 255, 255, 0) 100%), radial-gradient(48% 50% at 90% 75%, rgba(222, 227, 231, 0.65) 0%, rgba(255, 255, 255, 0) 100%)"
                : activeStep === 1
                ? "radial-gradient(50% 52% at 88% 22%, rgba(235, 226, 224, 0.55) 0%, rgba(255, 255, 255, 0) 100%), radial-gradient(48% 50% at 12% 78%, rgba(222, 227, 231, 0.65) 0%, rgba(255, 255, 255, 0) 100%)"
                : "radial-gradient(52% 54% at 50% 50%, rgba(216, 232, 224, 0.5) 0%, rgba(255, 255, 255, 0) 100%), radial-gradient(45% 50% at 92% 80%, rgba(222, 227, 231, 0.6) 0%, rgba(255, 255, 255, 0) 100%)",
          }}
        />

        {/* 2. Three Vertical Progress Dots on the Right Side */}
        <div className="flex flex-col items-center gap-2.5 absolute right-4 sm:right-8 lg:right-14 top-1/2 -translate-y-1/2 z-30">
          {PROBLEMS_DATA.map((s, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={`right-rail-${s.index}`}
                type="button"
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => goToStep(idx)}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "w-2 h-7 bg-[#0a0a0a]"
                    : "w-2 h-2 bg-black/15 hover:bg-black/35"
                }`}
              />
            );
          })}
        </div>

        {/* Top Spacer */}
        <div className="relative z-20 w-full h-[20px]" />

        {/* 3. CENTER: MORPHING TYPOGRAPHY WITH FADE-IN & FADE-OUT */}
        <div
          className="relative z-20 flex-1 w-full max-w-[1100px] flex flex-col items-center justify-center my-auto"
          style={{
            opacity: easeOutCubic(entryFade),
            filter:
              (1 - easeOutCubic(entryFade)) * 10 > 0.2
                ? `blur(${((1 - easeOutCubic(entryFade)) * 10).toFixed(1)}px)`
                : "none",
            transform: `translate3d(0, ${(
              (1 - easeOutCubic(entryFade)) *
              24
            ).toFixed(1)}px, 0)`,
          }}
        >
          <div className="relative w-full max-w-[960px] min-h-[260px] sm:min-h-[300px] flex items-center justify-center">
            {PROBLEMS_DATA.map((slide, sIdx) => {
              const dist = displayStepFloat - sIdx;
              const absDist = Math.abs(dist);

              if (absDist >= 0.92) return null;

              // Explicit fade-in and fade-out progress
              const rawFade = clamp(1 - absDist / 0.62, 0, 1);
              const slideOpacity = easeInOutCubic(rawFade);
              const slideBlur = (1 - slideOpacity) * 11;
              const slideY = -dist * 38;
              const slideScale = 1 - (1 - slideOpacity) * 0.045;

              const isSlideActive = sIdx === activeStep;
              const captionWords = slide.caption.split(" ");

              return (
                <div
                  key={slide.index}
                  aria-hidden={!isSlideActive}
                  className={`w-full flex flex-col items-center justify-center text-center px-4 sm:px-6 ${
                    isSlideActive
                      ? "relative z-20 pointer-events-auto"
                      : "absolute inset-0 z-10 pointer-events-none"
                  }`}
                  style={{
                    opacity: slideOpacity,
                    filter:
                      slideBlur > 0.15
                        ? `blur(${slideBlur.toFixed(2)}px)`
                        : "none",
                    transform: `translate3d(0, ${slideY.toFixed(
                      2
                    )}px, 0) scale(${slideScale.toFixed(3)})`,
                  }}
                >
                  {/* Small Eyebrow Tag with Scroll Micro-Interaction (star spin + dynamic tracking expansion) */}
                  <div
                    style={{
                      letterSpacing: `${(
                        0.06 +
                        (1 - slideOpacity) * 0.04 +
                        scrollImpulse * 0.015
                      ).toFixed(3)}em`,
                      transform: `translate3d(0, ${(
                        -dist * 10 -
                        scrollImpulse * 2
                      ).toFixed(1)}px, 0) scale(${(
                        1 +
                        scrollImpulse * 0.025
                      ).toFixed(3)})`,
                    }}
                    className="mb-4 sm:mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/[0.03] border border-black/[0.05] text-[10.5px] sm:text-[11.5px] font-semibold text-[#0a0a0a] uppercase transition-colors duration-300"
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      style={{
                        transform: `rotate(${(
                          displayStepFloat * 135 +
                          scrollImpulse * 45
                        ).toFixed(1)}deg) scale(${(
                          1 +
                          scrollImpulse * 0.2
                        ).toFixed(2)})`,
                      }}
                    >
                      <path
                        d="M5 0.8L6.1 3.9L9.2 5L6.1 6.1L5 9.2L3.9 6.1L0.8 5L3.9 3.9L5 0.8Z"
                        fill="#0a0a0a"
                      />
                    </svg>
                    <span>{slide.eyebrow}</span>
                  </div>

                  {/* Main Centered Morphing Sentence — Word-by-Word Staggered Fade-In & Fade-Out */}
                  <h2 className="flex flex-wrap items-center justify-center gap-x-[0.28em] gap-y-2.5 sm:gap-y-3.5 text-[clamp(1.95rem,6.4vw,4.25rem)] font-medium tracking-[-0.038em] leading-[1.12] sm:leading-[1.09] max-w-[940px]">
                    {slide.words.map((word, wIdx) => {
                      const totalWords = slide.words.length;
                      const wordNorm = wIdx / Math.max(1, totalWords - 1);

                      const staggerOffset =
                        dist >= 0
                          ? wordNorm * 0.14
                          : (1 - wordNorm) * 0.14;

                      const wordRawFade = clamp(
                        1 - (absDist + staggerOffset) / 0.68,
                        0,
                        1
                      );
                      const wordOpacity = easeInOutCubic(wordRawFade);
                      const wordBlur = (1 - wordOpacity) * 12;
                      const wordY = -dist * 24 * (1 - wordOpacity * 0.6);
                      const wordScale = 0.94 + wordOpacity * 0.06;

                      if (word.badge) {
                        const { id, statusColor } = word.badge;
                        const isBadgePulsing = pulsingId === id;

                        const pillStyle =
                          statusColor === "amber"
                            ? "bg-amber-500/[0.1] border-amber-500/30 text-[#090909] hover:bg-amber-500/[0.16]"
                            : statusColor === "red"
                            ? "bg-rose-500/[0.09] border-rose-500/30 text-[#090909] hover:bg-rose-500/[0.15]"
                            : statusColor === "emerald"
                            ? "bg-emerald-500/[0.1] border-emerald-500/35 text-[#090909] hover:bg-emerald-500/[0.16]"
                            : "bg-[#0a0a0a] border-[#0a0a0a] text-white hover:bg-[#1e1e1e]";

                        const indicatorDot =
                          statusColor === "amber"
                            ? "bg-amber-500"
                            : statusColor === "red"
                            ? "bg-rose-500"
                            : statusColor === "emerald"
                            ? "bg-emerald-500"
                            : "bg-white";

                        return (
                          <span
                            key={`${slide.index}-w-${wIdx}`}
                            onClick={() => triggerPulse(id)}
                            style={{
                              opacity: wordOpacity,
                              filter:
                                wordBlur > 0.15
                                  ? `blur(${wordBlur.toFixed(2)}px)`
                                  : "none",
                              transform: `translate3d(0, ${wordY.toFixed(
                                2
                              )}px, 0) scale(${
                                isBadgePulsing ? 1.05 : wordScale.toFixed(3)
                              })`,
                            }}
                            className={`inline-flex items-center gap-2 px-3 sm:px-4 py-0.5 sm:py-1 rounded-2xl border cursor-pointer transition-colors duration-200 ${pillStyle}`}
                          >
                            <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5 shrink-0">
                              <span
                                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${indicatorDot}`}
                              />
                              <span
                                className={`relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 ${indicatorDot}`}
                              />
                            </span>
                            <span>{word.text}</span>
                          </span>
                        );
                      }

                      return (
                        <span
                          key={`${slide.index}-w-${wIdx}`}
                          style={{
                            opacity: wordOpacity,
                            filter:
                              wordBlur > 0.15
                                ? `blur(${wordBlur.toFixed(2)}px)`
                                : "none",
                            transform: `translate3d(0, ${wordY.toFixed(
                              2
                            )}px, 0) scale(${wordScale.toFixed(3)})`,
                          }}
                          className="inline-block text-[#090909]"
                        >
                          {word.text}
                        </span>
                      );
                    })}
                  </h2>

                  {/* Supporting Small Subtitle — Staggered Word-by-Word Scroll Wave Micro-Interaction */}
                  <p className="mt-5 sm:mt-7 max-w-[540px] flex flex-wrap items-center justify-center gap-x-[0.28em] gap-y-1 text-[14px] sm:text-[15.5px] font-normal leading-[1.54] tracking-[-0.01em]">
                    {captionWords.map((cWord, cIdx) => {
                      const cNorm =
                        cIdx / Math.max(1, captionWords.length - 1);
                      const cStagger =
                        dist >= 0 ? cNorm * 0.18 : (1 - cNorm) * 0.18;
                      const cRaw = clamp(
                        1 - (absDist + cStagger) / 0.62,
                        0,
                        1
                      );
                      const cOpacity = easeOutCubic(cRaw);
                      const cBlur = (1 - cOpacity) * 6;
                      // Subtle wave ripple across the small caption words on scroll impulse
                      const waveOffset =
                        Math.sin(cNorm * Math.PI * 2 + displayStepFloat * 5) *
                        scrollImpulse *
                        3.5;
                      const cY = -dist * 14 * (1 - cOpacity * 0.5) + waveOffset;

                      return (
                        <span
                          key={`${slide.index}-cap-${cIdx}`}
                          style={{
                            opacity: cOpacity,
                            filter:
                              cBlur > 0.15
                                ? `blur(${cBlur.toFixed(2)}px)`
                                : "none",
                            transform: `translate3d(0, ${cY.toFixed(
                              2
                            )}px, 0)`,
                          }}
                          className="inline-block text-[#3d4044] hover:text-[#090909] transition-colors duration-200"
                        >
                          {cWord}
                        </span>
                      );
                    })}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. BOTTOM: SMALL LIGHT "KEEP SCROLLING" WITH SCROLL MICRO-INTERACTION */}
        <button
          type="button"
          onClick={() => {
            if (activeStep < 2) {
              goToStep(activeStep + 1);
            } else if (sectionRef.current) {
              const auditTop =
                sectionRef.current.offsetTop + sectionRef.current.offsetHeight;
              animateWindowScrollTo(auditTop, 620);
            }
          }}
          className="group relative z-20 flex items-center justify-center gap-2.5 px-3.5 py-1.5 rounded-full text-[11.5px] font-light tracking-[-0.01em] text-[#7c7f82] hover:text-[#0a0a0a] transition-colors duration-300 cursor-pointer"
          style={{
            opacity: easeOutCubic(entryFade),
            transform: `translate3d(0, ${(scrollImpulse * 5).toFixed(
              2
            )}px, 0) scale(${(1 - scrollImpulse * 0.04).toFixed(3)})`,
          }}
        >
          {/* Animated label that subtly shifts & unblurs on each step */}
          <span
            key={`prompt-label-${activeStep}`}
            className="inline-block transition-all duration-300 group-hover:translate-x-[-1px]"
            style={{
              letterSpacing: `${(0.01 + scrollImpulse * 0.03).toFixed(3)}em`,
            }}
          >
            {activeStep < 2 ? "Keep scrolling" : "Ready to automate"}
          </span>

          {/* Circular Progress Ring + Bouncing Arrow Micro-Interaction */}
          <span className="relative w-6 h-6 rounded-full bg-black/[0.04] group-hover:bg-black/[0.08] flex items-center justify-center transition-colors duration-300">
            <svg
              className="absolute inset-0 w-full h-full -rotate-90"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r={ringRadius}
                stroke="rgba(10, 10, 10, 0.08)"
                strokeWidth="1.4"
              />
              <circle
                cx="12"
                cy="12"
                r={ringRadius}
                stroke="#0a0a0a"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeDasharray={ringCircumference}
                strokeDashoffset={ringDashOffset}
              />
            </svg>
            <svg
              width="10"
              height="10"
              viewBox="0 0 12 12"
              fill="none"
              className="relative z-10 transition-transform duration-300 group-hover:translate-y-[1.5px]"
              style={{
                transform:
                  activeStep === 2
                    ? `rotate(-45deg) scale(${(1 + scrollImpulse * 0.15).toFixed(2)})`
                    : `translateY(${(1 + scrollImpulse * 2.5).toFixed(1)}px)`,
              }}
            >
              <path
                d="M6 2V10M6 10L2.5 6.5M6 10L9.5 6.5"
                stroke="#0a0a0a"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
      </div>
    </section>
  );
}
