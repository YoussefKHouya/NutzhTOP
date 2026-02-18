"use client";

import { useEffect, useState } from "react";

export function FloatingWidget() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show widget after scrolling down 400px
      setShow(window.scrollY > 400);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div 
      className={`fixed bottom-0 left-4 md:left-16 z-40 transition-all duration-500 ease-out ${
        show ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <img 
        alt="Party Cat" 
        loading="lazy" 
        width={200} 
        height={200} 
        className="w-[120px] md:w-[200px] drop-shadow-lg" 
        src="/mc/images/partycat.webp" 
      />
    </div>
  );
}
