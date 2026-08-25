"use client";

import React, { useState } from "react";

export default function AutoScrollMarquee({ items, direction = "left", speed = 28 }) {
  const [isPaused, setIsPaused] = useState(false);

  // Duration scales with content width (more items = longer duration so speed is consistent)
  const duration = Math.max(items.length * 2.5, 18);
  const animationName = direction === "left" ? "marquee-scroll-left" : "marquee-scroll-right";

  // Each copy gets paddingRight equal to the gap so the loop seam is invisible
  const copyStyle = {
    display: "flex",
    gap: "0.75rem",
    paddingRight: "0.75rem",
    flexShrink: 0,
  };

  return (
    <div
      style={{
        overflow: "hidden",
        width: "100%",
        maskImage:
          "linear-gradient(to right, transparent, black 40px, black calc(100% - 40px), transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 40px, black calc(100% - 40px), transparent)",
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/*
        Two identical copies sit next to each other in a flex row.
        Each copy has paddingRight equal to the gap so the spacing at the
        wrap-around point (copy2-end → copy1-start) is identical to the
        spacing between any two adjacent items.
        translateX(-50%) moves exactly one copy-width, making the loop seamless.
      */}
      <div
        style={{
          display: "flex",
          willChange: "transform",
          animation: `${animationName} ${duration}s linear infinite`,
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        <div style={copyStyle}>
          {items.map((item, idx) => (
            <span key={`a${idx}`} className="competency-tag">
              {item}
            </span>
          ))}
        </div>
        <div style={copyStyle} aria-hidden="true">
          {items.map((item, idx) => (
            <span key={`b${idx}`} className="competency-tag">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
