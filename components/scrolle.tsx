"use client";

import React, { useState, useEffect } from "react";

const Button = () => {
  const [showButton, setShowButton] = useState(false);
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    // تحديد اتجاه اللغة من <html dir="...">
    if (typeof window !== "undefined") {
      setIsRTL(document.documentElement.dir === "rtl");
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 1) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {showButton && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 z-20 w-11 h-11 rounded-lg border border-gray-600 bg-white text-black dark:bg-black dark:text-white dark:border-white/50 opacity-80 text-lg cursor-pointer animate-bounce transition-colors ${
            isRTL ? "left-8" : "right-8"
          }`}
        >
          ↑
        </button>
      )}
    </>
  );
};

export default Button;
