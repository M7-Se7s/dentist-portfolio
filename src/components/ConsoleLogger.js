"use client";

import React, { useEffect, useRef } from "react";

export default function ConsoleLogger() {
  const logContainerRef = useRef(null);

  useEffect(() => {
    const originalError = console.error;
    const originalLog = console.log;
    const originalWarn = console.warn;

    const handleLog = (type, ...args) => {
      if (!logContainerRef.current) return;
      
      const message = args.map(a => {
        try {
          return typeof a === 'object' ? JSON.stringify(a) : String(a);
        } catch(e) {
          return "[Circular]";
        }
      }).join(" ");
      
      const logEl = document.createElement("div");
      logEl.style.color = type === 'error' ? 'red' : type === 'warn' ? 'yellow' : 'white';
      logEl.style.marginTop = "5px";
      logEl.style.borderBottom = "1px solid #333";
      logEl.style.paddingBottom = "5px";
      logEl.textContent = `[${type.toUpperCase()}] ${message}`;
      
      logContainerRef.current.appendChild(logEl);
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    };

    console.error = (...args) => {
      handleLog("error", ...args);
      originalError.apply(console, args);
    };
    
    console.warn = (...args) => {
      handleLog("warn", ...args);
      originalWarn.apply(console, args);
    };

    console.log = (...args) => {
      handleLog("info", ...args);
      originalLog.apply(console, args);
    };

    window.addEventListener("error", (e) => {
      handleLog("error", e.message, e.filename, e.lineno);
    });

    window.addEventListener("unhandledrejection", (e) => {
      handleLog("error", "Unhandled Rejection:", e.reason);
    });

    const handleTap = (e) => {
      const target = e.target;
      const tag = target.tagName ? target.tagName.toLowerCase() : "unknown";
      const cls = target.className && typeof target.className === 'string' ? target.className : "";
      handleLog("warn", `[TAP DEBUG] Tapped element: <${tag} class="${cls}">`);
    };

    document.addEventListener("touchstart", handleTap, { capture: true });
    document.addEventListener("click", handleTap, { capture: true });

    return () => {
      console.error = originalError;
      console.log = originalLog;
      console.warn = originalWarn;
      document.removeEventListener("touchstart", handleTap, { capture: true });
      document.removeEventListener("click", handleTap, { capture: true });
    };
  }, []);

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      maxHeight: "30vh",
      overflowY: "auto",
      backgroundColor: "rgba(0,0,0,0.8)",
      color: "white",
      zIndex: 99999,
      padding: "10px",
      fontSize: "12px",
      fontFamily: "monospace",
      pointerEvents: "auto"
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <strong>Mobile Console (Direct DOM)</strong>
        <button onClick={() => console.log("REACT IS ALIVE!")} style={{ background: 'green', color: 'white', padding: '5px' }}>
          TEST REACT CLICK
        </button>
      </div>
      <div ref={logContainerRef} id="mobile-console-logs"></div>
    </div>
  );
}
