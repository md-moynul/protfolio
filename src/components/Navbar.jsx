"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";
import { FiMenu, FiX } from "react-icons/fi";

const navLinks = [
  { name: "Home", href: "#hero", id: "hero" },
  { name: "About", href: "#about", id: "about" },
  { name: "Skills", href: "#skills", id: "skills" },
  { name: "Projects", href: "#projects", id: "projects" },
  { name: "Experience", href: "#experience", id: "experience" },
  { name: "Education", href: "#education", id: "education" },
  { name: "Contact", href: "#contact", id: "contact" },
];

const HIDE_AFTER = 120; // Hide navbar only after scrolling down past this threshold (px)
const TOP_ZONE = 20; // Scroll position to consider at the very top (px)
const DELTA = 6; // Ignore scroll jitter smaller than this delta (px)
const SUPPRESS_DURATION = 1000; // Time (ms) to keep navbar visible after clicking a nav link

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");
  const shouldReduceMotion = useReducedMotion();

  const lastY = useRef(0);
  const isOpenRef = useRef(false);
  const suppressHideUntil = useRef(0);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;

      // 1) Slide up / fade out on scroll down, reappear on scroll up
      if (y <= TOP_ZONE) {
        setHidden(false);
        lastY.current = y;
      } else {
        const delta = y - lastY.current;
        if (Math.abs(delta) > DELTA) {
          if (!isOpenRef.current) {
            const isSuppressed = Date.now() < suppressHideUntil.current;
            if (isSuppressed) {
              setHidden(false);
            } else {
              setHidden(delta > 0 && y > HIDE_AFTER);
            }
          }
          lastY.current = y;
        }
      }

      // 2) Active section tracking
      const scrollPosition = y + 200;
      for (let i = navLinks.length - 1; i >= 0; i--) {
        const section = document.getElementById(navLinks[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navLinks[i].name);
          break;
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (linkName) => {
    setActiveSection(linkName);
    suppressHideUntil.current = Date.now() + SUPPRESS_DURATION;
    setHidden(false);
    if (isOpenRef.current) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <div className="fixed top-3 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none">
        <motion.nav
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: hidden ? -120 : 0, opacity: hidden ? 0 : 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: "easeOut" }}
          className={`${
            hidden ? "pointer-events-none" : "pointer-events-auto"
          } flex items-center justify-between gap-3 md:gap-6 px-4 md:px-5 py-1.5 rounded-full w-full max-w-3xl border border-gray-300/60 dark:border-white/15 bg-transparent backdrop-blur-md shadow-sm transition-[border-color,box-shadow] duration-300`}
        >
          <a
            href="#hero"
            onClick={() => handleNavClick("Home")}
            className="flex items-center gap-2 group flex-shrink-0"
          >
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={140}
              height={32}
              className="h-5 md:h-6 w-auto object-contain transition-transform group-hover:scale-105 dark:brightness-200 dark:contrast-125 dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
            />
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-0.5 lg:gap-1 bg-gray-100/50 dark:bg-white/5 p-0.5 rounded-full border border-gray-200/60 dark:border-white/10">
            {navLinks.map((link) => {
              const isActive = activeSection === link.name;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => handleNavClick(link.name)}
                  className={`relative px-2.5 lg:px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide transition-colors duration-200 ${
                    isActive
                      ? "text-[#2D8CFF] dark:text-white"
                      : "text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activePill"
                      className="absolute inset-0 bg-white/90 dark:bg-white/10 rounded-full shadow-xs"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </a>
              );
            })}
          </div>

          {/* Actions (Theme Toggle & Mobile Menu) */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="scale-75 origin-center -mx-1 flex items-center">
              <ThemeToggle />
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-full bg-gray-100/60 dark:bg-white/10 text-gray-800 dark:text-white border border-gray-200/60 dark:border-white/10"
              aria-label="Toggle Menu"
            >
              {isOpen ? <FiX className="text-lg" /> : <FiMenu className="text-lg" />}
            </button>
          </div>
        </motion.nav>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-md z-[105] md:hidden"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-16 left-4 right-4 z-[110] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl rounded-3xl p-6 border border-gray-200 dark:border-white/10 shadow-2xl md:hidden max-w-md mx-auto"
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.name;
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={() => handleNavClick(link.name)}
                      className={`flex items-center justify-between px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all ${
                        isActive
                          ? "bg-[#2D8CFF]/10 text-[#2D8CFF] dark:bg-[#2D8CFF]/20"
                          : "text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-white/5"
                      }`}
                    >
                      <span>{link.name}</span>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-[#2D8CFF]" />
                      )}
                    </a>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
