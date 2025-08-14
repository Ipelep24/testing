"use client";

import { useEffect } from "react";

export default function ViewportFixer() {
  useEffect(() => {
    const setHeight = () => {
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`
      );
    };
    setHeight();
    window.addEventListener("resize", setHeight);
    return () => window.removeEventListener("resize", setHeight);
  }, []);

  return null; // This component doesn't render anything
}
