"use client";

import React, { useEffect, useState } from "react";

export default function DashboardPreview() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 1500;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(eased);
      if (t >= 1) {
        clearInterval(timer);
      }
    }, 16);

    return () => clearInterval(timer);
  }, []);

  // Exact target numbers from the user's screenshot
  const mainValue = 344711.74 + (345389.88 - 344711.74) * progress;
  const ethValue = Math.round(1389 + (28475 - 1389) * progress);
  const btcValue = Math.round(1140 + (35037 - 1140) * progress);
  const usdtValue = Math.round(501 + (24054 - 501) * progress);

  const formattedMain = mainValue.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // 47 light bars for Ethereum (32%)
  const ethBarCount = 47;
  // 36 darker bars for Bitcoin (30%) with the signature curved right taper from the screenshot
  const btcBarCount = 36;
  const totalBars = ethBarCount + btcBarCount;

  return (
    <div
      className="relative flex w-full h-full rounded-t-[16px] overflow-hidden select-none"
      style={{
        boxShadow:
          "0 -8px 44px rgba(0, 0, 0, 0.045), 0 0 0 1px rgba(0, 0, 0, 0.04)",
      }}
    >
      {/* Left Frosted Grey Sidebar (206px out of 878px = 23.46%) */}
      <aside
        className="relative w-[206px] shrink-0 h-full flex flex-col justify-between text-white overflow-hidden"
        style={{
          background:
            "radial-gradient(125% 95% at 12% 92%, rgba(22, 22, 18, 0.94) 0%, rgba(58, 58, 54, 0.88) 36%, rgba(132, 132, 130, 0.86) 72%, rgba(149, 149, 148, 0.88) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div>
          {/* Top Brand Row */}
          <div className="pt-[20px] px-[16px] flex items-center justify-between">
            <div className="flex items-center gap-[9px]">
              {/* Analitica White Circle Icon */}
              <div className="w-[27px] h-[27px] rounded-full bg-white flex items-center justify-center shadow-xs shrink-0">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="2.2"
                    y="2.2"
                    width="6.5"
                    height="6.5"
                    rx="1.6"
                    fill="#121212"
                  />
                  <circle cx="5.45" cy="5.45" r="1.2" fill="white" />
                  <rect
                    x="7.3"
                    y="7.3"
                    width="6.5"
                    height="6.5"
                    rx="1.6"
                    fill="#121212"
                  />
                  <circle cx="10.55" cy="10.55" r="1.2" fill="white" />
                </svg>
              </div>
              <div className="leading-tight">
                <div className="text-[10.5px] font-semibold text-white tracking-[-0.01em]">
                  Analitica
                </div>
                <div className="text-[8px] font-normal text-white/60 tracking-[-0.01em]">
                  Top Staking Assets
                </div>
              </div>
            </div>

            {/* Sidebar Collapse Icon */}
            <div className="w-[14px] h-[13px] rounded-[3px] bg-white/90 flex items-center justify-center">
              <svg
                width="9"
                height="9"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="1.5" y="1.5" width="1.3" height="7" rx="0.5" fill="#555" />
                <path
                  d="M6.5 3.2L4.5 5L6.5 6.8"
                  stroke="#555"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Search Input */}
          <div className="mt-[17px] mx-[16px] h-[26px] rounded-[6px] bg-white/15 px-[6px] flex items-center justify-between">
            <div className="flex items-center gap-[6px]">
              <div className="w-[15px] h-[15px] rounded-[3.5px] bg-white flex items-center justify-center">
                <svg
                  width="8.5"
                  height="8.5"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="5.2"
                    cy="5.2"
                    r="3.4"
                    stroke="#141414"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M7.8 7.8L10.2 10.2"
                    stroke="#141414"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="text-[7px] font-semibold tracking-[0.04em] text-white/85 uppercase">
                SEARCH!
              </span>
            </div>
            <span className="text-[7px] font-normal text-white/55 pr-[2px]">
              ctrl + F
            </span>
          </div>

          {/* Main Navigation */}
          <div className="mt-[16px] px-[16px] space-y-[9px]">
            {/* Dashboard */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[8px]">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="1.5" y="1.5" width="4.5" height="4.5" rx="1" fill="white" />
                  <rect
                    x="9.8"
                    y="1.2"
                    width="4.2"
                    height="4.2"
                    rx="0.9"
                    transform="rotate(25 9.8 1.2)"
                    fill="white"
                  />
                  <rect x="1.5" y="7.8" width="4.5" height="4.5" rx="1" fill="white" />
                  <rect x="7.8" y="7.8" width="4.5" height="4.5" rx="1" fill="white" />
                </svg>
                <span className="text-[10px] font-medium text-white tracking-[-0.01em]">
                  Dashboard
                </span>
              </div>
              <span className="w-[14px] h-[14px] rounded-[3.5px] bg-white/22 text-[8px] font-medium text-white flex items-center justify-center">
                2
              </span>
            </div>

            {/* Analytics Subsections */}
            <div className="flex items-center gap-[8px]">
              <svg
                width="12"
                height="12"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.3 2C3.7 2.3 1.8 4.5 1.8 7.2C1.8 10.1 4.1 12.4 7 12.4C9.7 12.4 11.9 10.5 12.2 7.9H6.3V2Z"
                  fill="white"
                />
                <path
                  d="M7.7 1.6V6.5H12.6C12.3 3.9 10.3 1.9 7.7 1.6Z"
                  fill="white"
                  fillOpacity="0.75"
                />
              </svg>
              <span className="text-[10px] font-normal text-white/85 tracking-[-0.01em]">
                Analytics Subsections
              </span>
            </div>

            {/* Sales List */}
            <div className="flex items-center gap-[8px]">
              <svg
                width="12"
                height="12"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.8 4.2V3.4C4.8 2.5 5.5 1.8 6.4 1.8H7.6C8.5 1.8 9.2 2.5 9.2 3.4V4.2"
                  stroke="white"
                  strokeWidth="1.2"
                />
                <rect x="2" y="4.2" width="10" height="7.8" rx="1.8" fill="white" />
                <circle cx="7" cy="7.8" r="1" fill="#888" />
              </svg>
              <span className="text-[10px] font-normal text-white/85 tracking-[-0.01em]">
                Sales List
              </span>
            </div>

            {/* Goals */}
            <div className="pt-[1px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[8px]">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="7" cy="7" r="5.4" fill="white" />
                    <path
                      d="M7.4 3.8L4.8 7.3H6.9L6.5 10.2L9.2 6.7H7.1L7.4 3.8Z"
                      fill="#777"
                    />
                  </svg>
                  <span className="text-[10px] font-medium text-white tracking-[-0.01em]">
                    Goals
                  </span>
                </div>
                <svg
                  width="9"
                  height="9"
                  viewBox="0 0 10 10"
                  fill="none"
                  className="text-white/80 mr-[1px]"
                >
                  <path
                    d="M2 6.5L5 3.5L8 6.5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Goals Sub-items */}
              <div className="mt-[9px] ml-[5.5px] pl-[13px] border-l border-white/25 space-y-[8px]">
                <div className="text-[8.5px] font-normal text-white/85 leading-none">
                  Monthly Targets
                </div>
                <div className="text-[8.5px] font-normal text-white/85 leading-none">
                  Quarterly Goals
                </div>

                {/* Yearly Projections */}
                <div>
                  <div className="flex items-center justify-between pr-[22px]">
                    <span className="text-[8.5px] font-medium text-white leading-none">
                      Yearly Projections
                    </span>
                    <svg
                      width="8"
                      height="8"
                      viewBox="0 0 10 10"
                      fill="none"
                      className="text-white/75"
                    >
                      <path
                        d="M2 6.5L5 3.5L8 6.5"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  {/* Nested Tree under Yearly Projections */}
                  <div className="mt-[7px] ml-[2px] pl-[10px] border-l border-white/25 space-y-[7px]">
                    <div className="relative flex items-center justify-between">
                      <span className="absolute -left-[10px] top-1/2 w-[7px] h-[1px] bg-white/25" />
                      <span className="text-[8px] font-normal text-white/60 leading-none">
                        Annual Revenue
                      </span>
                      <span className="w-[14px] h-[14px] rounded-[3.5px] bg-white/18 text-[7.5px] font-medium text-white/85 flex items-center justify-center">
                        4
                      </span>
                    </div>

                    <div className="relative flex items-center">
                      <span className="absolute -left-[10px] top-1/2 w-[7px] h-[1px] bg-white/25" />
                      <span className="text-[8px] font-normal text-white/60 leading-none">
                        Company Growth
                      </span>
                    </div>

                    <div className="relative flex items-center">
                      <span className="absolute -left-[10px] top-1/2 w-[7px] h-[1px] bg-white/25" />
                      <span className="text-[8px] font-normal text-white/60 leading-none">
                        Innovative Projects
                      </span>
                    </div>

                    <div className="relative flex items-center">
                      <span className="absolute -left-[10px] top-1/2 w-[7px] h-[1px] bg-white/25" />
                      <span className="text-[8px] font-normal text-white/60 leading-none">
                        Strategic Initiatives
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom My Reports Section */}
        <div className="px-[16px] pb-[18px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[8px]">
              <svg
                width="12"
                height="12"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="2"
                  y="3"
                  width="7.5"
                  height="9"
                  rx="1.4"
                  fill="white"
                  fillOpacity="0.85"
                />
                <rect x="4.5" y="1.8" width="7.5" height="9" rx="1.4" fill="white" />
                <path
                  d="M6.2 4.5H10.2M6.2 6.5H10.2M6.2 8.5H8.5"
                  stroke="#555"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-[10px] font-medium text-white tracking-[-0.01em]">
                My Reports
              </span>
            </div>
            <svg
              width="9"
              height="9"
              viewBox="0 0 10 10"
              fill="none"
              className="text-white/80 mr-[16px]"
            >
              <path
                d="M2 6.5L5 3.5L8 6.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="mt-[8px] pl-[20px] space-y-[7px]">
            <div className="text-[8.5px] font-normal text-white/75 leading-none">
              New Reports
            </div>
            <div className="text-[8.5px] font-normal text-white/45 leading-none">
              Personal Reports
            </div>
          </div>
        </div>
      </aside>

      {/* Right White Main Content Area (672px out of 878px = 76.54%) */}
      <div className="flex-1 bg-white h-full pt-[17px] px-[23px] flex flex-col justify-between relative">
        <div>
          {/* Row 1: User Profile & Top Controls */}
          <div className="flex items-center justify-between">
            {/* Profile */}
            <div className="flex items-center gap-[9px]">
              <img
                src="/avatar.png"
                alt="Ronald Richards"
                className="w-[30px] h-[30px] rounded-full object-cover shrink-0"
              />
              <div>
                <div className="flex items-center gap-[5px]">
                  <span className="text-[8px] font-normal text-[#8e9296]">
                    @Ronald923
                  </span>
                  <span className="px-[5px] py-[1px] rounded-full bg-[#9ca198] text-white text-[6px] font-semibold tracking-[0.04em] uppercase leading-none">
                    PRO
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-[#111111] tracking-[-0.015em] leading-[1.2] mt-[1px]">
                  Ronald Richards
                </div>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-[8px]">
              {/* Timeframe Toggle */}
              <div className="flex items-center gap-[6px] mr-[2px]">
                <div className="w-[24px] h-[13.5px] rounded-full bg-[#141414] p-[1.8px] flex items-center">
                  <div className="w-[10px] h-[10px] rounded-full bg-white flex items-center justify-center">
                    <div className="w-[2.5px] h-[2.5px] rounded-full bg-[#141414]" />
                  </div>
                </div>
                <span className="text-[8.5px] font-medium text-[#1b1b1b]">
                  Timeframe
                </span>
              </div>

              {/* Date Range Dropdown Pill */}
              <div className="h-[24px] px-[10px] rounded-full border border-[#ededed] bg-[#fcfcfc] flex items-center gap-[5px] text-[8.5px] font-medium text-[#1b1b1b]">
                <span>Oct 1 - Nov 30, 2026</span>
                <svg
                  width="6"
                  height="4"
                  viewBox="0 0 6 4"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M0.5 0.5L3 3.2L5.5 0.5H0.5Z" fill="#1b1b1b" />
                </svg>
              </div>

              {/* Notification Date Pill */}
              <div className="h-[24px] pl-[8px] pr-[5px] rounded-full border border-[#ededed] bg-[#f7f7f7] flex items-center gap-[6px]">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 2C4.8 2 3.5 3.5 3.5 5.6V8.2L2.3 9.6H11.7L10.5 8.2V5.6C10.5 3.5 9.2 2 7 2Z"
                    stroke="#222"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.6 11.2C5.9 11.7 6.4 12 7 12C7.6 12 8.1 11.7 8.4 11.2"
                    stroke="#222"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <circle cx="10.2" cy="3.2" r="1.4" fill="#222" />
                </svg>
                <span className="text-[8.5px] font-medium text-[#1b1b1b]">
                  Sat, 18 June
                </span>
                <span className="w-[15px] h-[15px] rounded-full bg-[#111111] text-white text-[7.5px] font-semibold flex items-center justify-center">
                  6
                </span>
              </div>
            </div>
          </div>

          {/* Row 2: Capital Under Control */}
          <div className="mt-[22px] pb-[14px] border-b border-[#f2f2f2]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[5px]">
                <svg
                  width="9"
                  height="11"
                  viewBox="0 0 10 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.6 0.5L1.2 6.5H5.0L4.4 11.5L8.8 5.5H5.0L5.6 0.5Z"
                    fill="#888b87"
                  />
                </svg>
                <span className="text-[9.5px] font-medium tracking-[0.025em] text-[#888b8e] uppercase">
                  CAPITAL UNDER CONTROL
                </span>
              </div>

              <div className="flex items-center gap-[7px] text-[8.5px] font-medium pr-[2px]">
                <span className="text-[#9fa2a5]">H</span>
                <span className="text-[#111111] font-semibold">D</span>
                <span className="text-[#9fa2a5]">W</span>
                <span className="text-[#9fa2a5]">M</span>
                <span className="text-[#e2e4e6] font-light">|</span>
                <span className="text-[#9fa2a5]">All</span>
              </div>
            </div>

            <div className="mt-[3px] flex items-baseline justify-between">
              <div className="flex items-baseline">
                <span className="text-[24px] font-normal text-[#111111] mr-[8px]">
                  $
                </span>
                <span className="text-[31.5px] font-medium tracking-[-0.03em] text-[#0c0c0c] leading-none tabular-nums">
                  {formattedMain}
                </span>

                {/* +8.9% Pill */}
                <span className="ml-[7px] h-[15.5px] px-[6px] rounded-full bg-[#92978e] text-white text-[7.5px] font-medium inline-flex items-center gap-[2.5px] self-center translate-y-[2px]">
                  <svg
                    width="7"
                    height="7"
                    viewBox="0 0 8 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 6L3.2 3.8L4.6 5.2L7 2.2M7 2.2H4.8M7 2.2V4.4"
                      stroke="white"
                      strokeWidth="1.1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  8.9%
                </span>

                {/* $ 248,348.09 Pill */}
                <span className="ml-[4px] h-[15.5px] px-[6px] rounded-full bg-[#a2a79e] text-white text-[7.5px] font-medium inline-flex items-center self-center translate-y-[2px]">
                  $ 248,348.09
                </span>
              </div>

              <div className="flex items-center gap-[4px] text-[9.5px] text-[#8d9093] font-normal">
                <span>vs previous period $345,398.34 · feb–mar 2026</span>
                <svg
                  width="9"
                  height="9"
                  viewBox="0 0 10 10"
                  fill="none"
                  className="text-[#555] translate-y-[0.5px]"
                >
                  <path
                    d="M2 3.5L5 6.5L8 3.5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Row 3: Crypto Assets Row */}
          <div className="mt-[14px] flex items-center justify-between">
            <div className="flex items-center gap-[20px]">
              {/* Ethereum */}
              <div className="flex items-center gap-[7px]">
                <div className="w-[22px] h-[22px] rounded-full bg-[#f4f5f6] flex items-center justify-center">
                  <svg
                    width="9"
                    height="13"
                    viewBox="0 0 10 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M5 0.5L0.8 8.2L5 10.6L9.2 8.2L5 0.5Z" fill="#141414" />
                    <path d="M5 11.8L0.8 9.4L5 15.5L9.2 9.4L5 11.8Z" fill="#141414" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-[4px]">
                    <span className="text-[13px] font-medium text-[#111111] tracking-[-0.02em] leading-none tabular-nums">
                      ${ethValue.toLocaleString("en-US")}
                    </span>
                    <span className="px-[4px] py-[1px] rounded-full bg-[#b0b5ad] text-white text-[5.5px] font-semibold leading-none">
                      +1.2%
                    </span>
                  </div>
                  <div className="text-[7.5px] text-[#9fa2a5] mt-[2px] leading-none">
                    Ethereum
                  </div>
                </div>
              </div>

              {/* Bitcoin */}
              <div className="flex items-center gap-[7px]">
                <div className="w-[22px] h-[22px] rounded-full bg-[#f4f5f6] flex items-center justify-center">
                  <div className="w-[12px] h-[12px] rounded-full bg-[#141414] text-white text-[7.5px] font-bold flex items-center justify-center leading-none">
                    ₿
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-[4px]">
                    <span className="text-[13px] font-medium text-[#111111] tracking-[-0.02em] leading-none tabular-nums">
                      ${btcValue.toLocaleString("en-US")}
                    </span>
                    <span className="px-[4px] py-[1px] rounded-full bg-[#b0b5ad] text-white text-[5.5px] font-semibold leading-none">
                      +2.4%
                    </span>
                  </div>
                  <div className="text-[7.5px] text-[#9fa2a5] mt-[2px] leading-none">
                    Bitcoin
                  </div>
                </div>
              </div>

              {/* Tether */}
              <div className="flex items-center gap-[7px]">
                <div className="w-[22px] h-[22px] rounded-full bg-[#f4f5f6] flex items-center justify-center">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.2 2.2H10.8L13 5.5L7 12.2L1 5.5L3.2 2.2Z"
                      fill="#141414"
                    />
                    <path
                      d="M4.5 4.6H9.5M7 4.6V9.2"
                      stroke="white"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-[4px]">
                    <span className="text-[13px] font-medium text-[#111111] tracking-[-0.02em] leading-none tabular-nums">
                      ${usdtValue.toLocaleString("en-US")}
                    </span>
                    <span className="px-[4px] py-[1px] rounded-full bg-[#b0b5ad] text-white text-[5.5px] font-semibold leading-none">
                      +0.8%
                    </span>
                  </div>
                  <div className="text-[7.5px] text-[#9fa2a5] mt-[2px] leading-none">
                    Tether
                  </div>
                </div>
              </div>
            </div>

            {/* Right 24h delta & 14d return */}
            <div className="flex items-center gap-[9px] text-[8.5px] font-medium text-[#1e1e1e] pr-[4px]">
              <span>24h delta +2.48%</span>
              <span className="text-[#e8e8e8]">|</span>
              <span>14d return +6.87%</span>
            </div>
          </div>

          {/* Row 4: Fine Vertical Bar Chart */}
          <div className="mt-[18px] relative">
            <div className="flex items-start">
              {/* Group 1: Ethereum (32%) */}
              <div className="relative flex flex-col">
                <div className="flex items-end h-[64px] gap-[2.6px] border-b border-[#f4f4f4]">
                  {/* Full-height left axis line */}
                  <div className="w-[1px] h-[64px] bg-[#dcdedc] shrink-0" />
                  {Array.from({ length: ethBarCount }).map((_, i) => {
                    const barThreshold = i / totalBars;
                    const barProgress = Math.max(
                      0,
                      Math.min(1, (progress - barThreshold * 0.7) / 0.3)
                    );
                    return (
                      <div
                        key={`eth-${i}`}
                        className="w-[1.25px] bg-[#e1e3e1] shrink-0 origin-bottom"
                        style={{
                          height: `${64 * barProgress}px`,
                        }}
                      />
                    );
                  })}
                </div>
                {/* Extended vertical line and label */}
                <div className="relative h-[38px] border-l border-[#dcdedc] pl-[9px] pt-[12px]">
                  <div className="text-[6.8px] font-medium text-[#333333] leading-[1.35]">
                    Ethereum
                  </div>
                  <div className="text-[6.8px] font-normal text-[#8e9194] leading-[1.35]">
                    32%
                  </div>
                </div>
              </div>

              {/* Group 2: Bitcoin (30%) */}
              <div className="relative flex flex-col ml-[2.6px]">
                <div className="flex items-end h-[64px] gap-[2.6px] border-b border-[#f4f4f4]">
                  {/* Full-height middle axis line */}
                  <div className="w-[1.25px] h-[64px] bg-[#888e84] shrink-0" />
                  {Array.from({ length: btcBarCount }).map((_, i) => {
                    // First 19 bars are full height (64px); bars 19..35 smoothly curve down as in the screenshot
                    let targetHeight = 64;
                    if (i >= 19) {
                      const t = (i - 19) / (btcBarCount - 19);
                      targetHeight = Math.max(
                        5,
                        64 * Math.pow(Math.cos(t * (Math.PI / 2)), 1.35)
                      );
                    }
                    const globalIdx = ethBarCount + i;
                    const barThreshold = globalIdx / totalBars;
                    const barProgress = Math.max(
                      0,
                      Math.min(1, (progress - barThreshold * 0.75) / 0.25)
                    );
                    return (
                      <div
                        key={`btc-${i}`}
                        className="w-[1.25px] bg-[#8d9389] shrink-0 origin-bottom"
                        style={{
                          height: `${targetHeight * barProgress}px`,
                        }}
                      />
                    );
                  })}
                </div>
                {/* Extended vertical line and label */}
                <div className="relative h-[38px] border-l-[1.25px] border-[#888e84] pl-[9px] pt-[12px]">
                  <div className="text-[6.8px] font-medium text-[#333333] leading-[1.35]">
                    Bitcoin
                  </div>
                  <div className="text-[6.8px] font-normal text-[#8e9194] leading-[1.35]">
                    30%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 5: Bottom Schedule / Activity Columns */}
        <div className="pt-[10px] pb-[14px] border-t border-[#f4f4f4] grid grid-cols-4 gap-[22px]">
          {/* Column 1 */}
          <div>
            <div className="text-[7.5px] font-normal text-[#b0b3b5] tracking-[-0.01em]">
              Monday, Dec 1 2025
            </div>
            <div className="mt-[10px] flex items-baseline justify-between">
              <div>
                <div className="text-[8.5px] font-medium text-[#1b1b1b] leading-none">
                  Position Entry
                </div>
                <div className="text-[6.8px] text-[#b5b8ba] mt-[3px] leading-none">
                  9 AM
                </div>
              </div>
              <div className="text-[8.5px] font-medium text-[#1b1b1b]">
                $28.00
              </div>
            </div>
            <div className="mt-[8px] flex items-baseline justify-between">
              <div>
                <div className="text-[8.5px] font-medium text-[#1b1b1b] leading-none">
                  Gass Fees
                </div>
                <div className="text-[6.8px] text-[#b5b8ba] mt-[3px] leading-none">
                  11 AM
                </div>
              </div>
              <div className="text-[8.5px] font-medium text-[#1b1b1b]">
                $45.00
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <div className="text-[7.5px] font-normal text-[#b0b3b5] tracking-[0.01em] uppercase">
              TUESDAY, DEC 1 2025
            </div>
            <div className="mt-[10px] flex items-baseline justify-between">
              <div>
                <div className="text-[8.5px] font-medium text-[#1b1b1b] leading-none">
                  Position Entry
                </div>
                <div className="text-[6.8px] text-[#b5b8ba] mt-[3px] leading-none">
                  9 AM
                </div>
              </div>
              <div className="text-[8.5px] font-medium text-[#1b1b1b]">
                $6.00
              </div>
            </div>
            <div className="mt-[8px] flex items-baseline justify-between">
              <div>
                <div className="text-[8.5px] font-medium text-[#1b1b1b] leading-none">
                  Gass Fees
                </div>
                <div className="text-[6.8px] text-[#b5b8ba] mt-[3px] leading-none">
                  11 AM
                </div>
              </div>
              <div className="text-[8.5px] font-medium text-[#1b1b1b]">
                $35.00
              </div>
            </div>
          </div>

          {/* Column 3 */}
          <div>
            <div className="text-[7.5px] font-normal text-[#b0b3b5] tracking-[-0.01em]">
              Wednesday, Dec 2 2025
            </div>
            <div className="mt-[10px] flex items-baseline justify-between">
              <div>
                <div className="text-[8.5px] font-medium text-[#1b1b1b] leading-none">
                  Position Entry
                </div>
                <div className="text-[6.8px] text-[#b5b8ba] mt-[3px] leading-none">
                  9 AM
                </div>
              </div>
              <div className="text-[8.5px] font-medium text-[#1b1b1b]">
                $56.00
              </div>
            </div>
            <div className="mt-[8px] flex items-baseline justify-between">
              <div>
                <div className="text-[8.5px] font-medium text-[#1b1b1b] leading-none">
                  Gass Fees
                </div>
                <div className="text-[6.8px] text-[#b5b8ba] mt-[3px] leading-none">
                  11 AM
                </div>
              </div>
              <div className="text-[8.5px] font-medium text-[#1b1b1b]">
                $67.00
              </div>
            </div>
          </div>

          {/* Column 4 (Partially behind the right rock) */}
          <div>
            <div className="text-[7.5px] font-normal text-[#b0b3b5] tracking-[0.01em] uppercase">
              FRIDAY, FEB 2026
            </div>
            <div className="mt-[10px] flex items-baseline justify-between">
              <div>
                <div className="text-[8.5px] font-medium text-[#1b1b1b] leading-none">
                  Position Entry
                </div>
                <div className="text-[6.8px] text-[#b5b8ba] mt-[3px] leading-none">
                  9 AM
                </div>
              </div>
              <div className="text-[8.5px] font-medium text-[#1b1b1b]">
                $42.00
              </div>
            </div>
            <div className="mt-[8px] flex items-baseline justify-between">
              <div>
                <div className="text-[8.5px] font-medium text-[#1b1b1b] leading-none">
                  Gass Fees
                </div>
                <div className="text-[6.8px] text-[#b5b8ba] mt-[3px] leading-none">
                  11 AM
                </div>
              </div>
              <div className="text-[8.5px] font-medium text-[#1b1b1b]">
                $19.00
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
