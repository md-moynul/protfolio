"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "./Animations";
import {
  FiMapPin,
  FiPhone,
  FiTerminal,
  FiArrowRight,
  FiCheckCircle,
  FiCode,
  FiGlobe,
} from "react-icons/fi";
import { FaGraduationCap, FaRocket } from "react-icons/fa";
import { currentYear, degree, institute } from "@/data/profile";

const About = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        timeZone: "Asia/Dhaka",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      setTime(now.toLocaleTimeString("en-US", options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="py-16 md:py-[120px] px-5 md:px-8 bg-transparent transition-colors"
      id="about"
    >
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <motion.div {...fadeInUp} className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="font-display text-2xl text-gray-500 dark:text-zinc-400 leading-tight max-w-3xl text-left md:text-justify hyphens-auto">
              Merging{" "}
              <span className="text-gradient">clean code</span> with{" "}
              <span className="text-gradient">thoughtful design</span>.
            </p>
          </div>

          {/* Sticky Local Time Zone Widget */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/70 dark:bg-zinc-900/70 border border-gray-200 dark:border-white/10 backdrop-blur-md shadow-sm self-start md:self-auto">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 dark:text-zinc-500">
                Local Time (BST / UTC+6)
              </span>
              <span className="text-sm font-mono font-bold text-gray-900 dark:text-white">
                {time || "16:17:01 PM"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Main Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >

          {/* ── Bio Card ── */}
          <motion.div
            variants={fadeInUp}
            className="lg:col-span-8 glass-card p-6 md:p-10 rounded-3xl flex flex-col justify-between gap-8"
          >
            <div className="flex flex-col gap-5">
              <p className="text-body-lg text-gray-700 dark:text-zinc-300 leading-relaxed text-left md:text-justify hyphens-auto">
                I&apos;m a Computer Science student at{" "}
                <span className="text-primary font-semibold">
                  {institute}
                </span>
                . I enjoy turning ideas into working web apps, and I&apos;m learning something new with every project I build.
              </p>
              <p className="text-body-lg text-gray-700 dark:text-zinc-300 leading-relaxed text-left md:text-justify hyphens-auto">
                Based in{" "}
                <span className="font-bold text-gray-900 dark:text-white">
                  Rangpur, Bangladesh
                </span>
                , I work with the React ecosystem to build practical,
                user-friendly digital solutions. Beyond coding, I am deeply passionate about{" "}
                <span className="font-bold text-emerald-500 dark:text-emerald-400">
                  Farming 🌱
                </span>
                — cultivating discipline, patience, and steady growth both in fields and software.
              </p>
            </div>

            {/* Inline Stats */}
            <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-100 dark:border-zinc-800">
              {[
                { value: currentYear.replace(/ Year/i, ""), label: "Year", icon: FaGraduationCap, tooltip: degree },
                { value: "Open", label: "Work", icon: FiCheckCircle, tooltip: "Available for internships and junior roles" },
                { value: "MERN", label: "Stack", icon: FiCode, tooltip: "MongoDB, Express.js, React, Node.js" },
                { value: "World", label: "Based", icon: FiGlobe, tooltip: "Remote ready and available for global opportunities" },
              ].map(({ value, label, icon: IconComponent, tooltip }) => (
                <motion.div
                  key={label}
                  initial="initial"
                  whileHover="hover"
                  variants={{
                    initial: { y: 0 },
                    hover: { y: -8 }
                  }}
                  className="flex flex-col items-center px-5 py-3 bg-primary/5 rounded-2xl border border-primary/10 min-w-[80px] relative cursor-help transition-colors duration-300 hover:bg-primary/10 hover:shadow-[0_10px_30px_-10px_rgba(45,140,255,0.3)] group/stat"
                >
                  {/* Custom Tooltip */}
                  {tooltip && (
                    <motion.div 
                      variants={{
                        initial: { opacity: 0, y: 15, x: "-50%", scale: 0.8, rotateX: -20 },
                        hover: { opacity: 1, y: 0, x: "-50%", scale: 1, rotateX: 0 }
                      }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 500, 
                        damping: 20,
                        mass: 0.8
                      }}
                      className="absolute bottom-full left-1/2 mb-4 px-4 py-2 bg-gray-900/90 dark:bg-zinc-800/90 backdrop-blur-md text-white text-xs font-semibold rounded-xl pointer-events-none whitespace-nowrap z-30 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      {tooltip}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-gray-900/90 dark:border-t-zinc-800/90" />
                    </motion.div>
                  )}
                  
                  <motion.div 
                    variants={{
                      initial: { rotate: 0, scale: 1 },
                      hover: { rotate: 12, scale: 1.2 }
                    }}
                    className="text-primary/70 text-xl mb-1 transition-colors duration-300 group-hover/stat:text-primary flex items-center justify-center"
                  >
                    <IconComponent className="text-xl" />
                  </motion.div>
                  <span className="text-xl font-black text-primary leading-none">
                    {value}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mt-1.5 font-bold">
                    {label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Location & Contact Card ── */}
          <motion.div
            variants={fadeInUp}
            className="lg:col-span-4 glass-card p-6 md:p-8 rounded-3xl flex flex-col items-center justify-center text-center gap-4 group"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
              <FiMapPin className="text-3xl" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-xl">
                Location & Contact
              </h3>
              <p className="text-gray-500 dark:text-zinc-500 text-sm mt-1">
                Rangpur, Bangladesh
              </p>
              <a
                href="tel:+8801746568176"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#2D8CFF] hover:underline mt-2 bg-[#2D8CFF]/10 px-3 py-1 rounded-full border border-[#2D8CFF]/20"
              >
                <FiPhone className="text-xs" />
                +880 1746-568176
              </a>
              <p className="text-[11px] font-mono text-gray-400 dark:text-zinc-600 mt-2 tracking-widest uppercase">
                UTC +6 · Remote Ready
              </p>
            </div>
            {/* Availability badge */}
            <span className="inline-flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Available for work
            </span>
          </motion.div>

          {/* ── Philosophy Card ── */}
          <motion.div
            variants={fadeInUp}
            className="lg:col-span-4 glass-card p-6 md:p-8 rounded-3xl flex flex-col gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <FiTerminal className="text-2xl" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-xl mb-2">
                My Philosophy
              </h3>
              <p className="text-base text-gray-700 dark:text-zinc-300 leading-relaxed text-left md:text-justify hyphens-auto">
                I prioritize clean, maintainable code and performance-first
                development. Simplicity, accessibility, and great user experience
                are at the heart of everything I build.
              </p>
            </div>
          </motion.div>

          {/* ── Current Focus Card ── */}
          <motion.div
            variants={fadeInUp}
            className="lg:col-span-8 glass-card p-6 md:p-8 rounded-3xl flex flex-col gap-5"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <FaRocket className="text-2xl" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-xl">
                Current Focus
              </h3>
            </div>

            <div className="flex flex-col gap-2">
              {[
                "Next.js App Router & Server Actions",
                "Advanced Framer Motion techniques",
                "Immersive & accessible web experiences",
              ].map((text) => (
                <div
                  key={text}
                  className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10 text-base font-medium text-gray-800 dark:text-zinc-200"
                >
                  <FiArrowRight className="text-primary text-xl flex-shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Tech Stack Glimpse Card ── */}
          <motion.div
            variants={fadeInUp}
            className="lg:col-span-12 glass-card p-6 md:p-8 rounded-3xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary font-label-caps mb-1">
                  Core Stack
                </p>
                <h3 className="font-bold text-gray-900 dark:text-white text-xl">
                  Tools I work with daily
                </h3>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                "MongoDB",
                "Express.js",
                "React",
                "Node.js",
                "Next.js",
                "Tailwind CSS",
                "Framer Motion",
                "REST APIs",
                "Git",
              ].map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-full border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-400 bg-gray-50 dark:bg-zinc-900 hover:border-primary/50 hover:text-primary transition-colors duration-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default About;