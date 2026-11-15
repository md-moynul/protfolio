"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiGit,
  SiGithub,
  SiTailwindcss,
  SiDaisyui,
  SiHeroui,
  SiVercel,
  SiNetlify,
  SiGithubpages,
  SiFigma,
  SiPenpot,
  SiJsonwebtokens,
  SiBetterauth,
  SiTypescript,
} from "react-icons/si";
import {
  FiLayout,
  FiServer,
  FiDatabase,
  FiCode,
  FiLayers,
  FiTool,
  FiCloud,
} from "react-icons/fi";

const VscodeIcon = ({ className, style }) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
  >
    <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" />
  </svg>
);

const categories = [
  {
    title: "Frontend Technologies",
    description: "Component architecture, responsive frameworks, and fluid styling engines.",
    categoryIcon: FiLayout,
    dotColor: "#61DAFB",
    skills: [
      { Icon: SiReact, label: "React.js", subtitle: "Core Library", color: "#61DAFB" },
      { Icon: SiNextdotjs, label: "Next.js", subtitle: "App Router / SSR", color: "inherit", className: "text-gray-900 dark:text-white" },
      { Icon: SiHtml5, label: "HTML5", subtitle: "Semantic Markup", color: "#E34F26" },
      { Icon: SiCss, label: "CSS3", subtitle: "Responsive Design", color: "#1572B6" },
    ],
  },
  {
    title: "Backend & Authentication",
    description: "Server-side logic, REST APIs, and secure authentication flows.",
    categoryIcon: FiServer,
    dotColor: "#339933",
    skills: [
      { Icon: SiNodedotjs, label: "Node.js", subtitle: "Runtime Environment", color: "#339933" },
      { Icon: SiExpress, label: "Express.js", subtitle: "REST Framework", color: "inherit", className: "text-gray-900 dark:text-white" },
      { Icon: SiJsonwebtokens, label: "JWT", subtitle: "Token Authentication", color: "#535151" },
      { Icon: SiBetterauth, label: "Better Auth", subtitle: "Modern Auth Suite", color: "inherit", className: "text-gray-900 dark:text-white" },
    ],
  },
  {
    title: "Database",
    description: "Document-oriented storage, schema modeling, and data persistence.",
    categoryIcon: FiDatabase,
    dotColor: "#47A248",
    skills: [
      { Icon: SiMongodb, label: "MongoDB", subtitle: "NoSQL Database", color: "#47A248" },
    ],
  },
  {
    title: "Programming Languages",
    description: "Core scripting, asynchronous patterns, and typed systems.",
    categoryIcon: FiCode,
    dotColor: "#D4A017",
    skills: [
      { Icon: SiJavascript, label: "JavaScript (ES6+)", subtitle: "Core Language", color: "#D4A017" },
      { Icon: SiTypescript, label: "TypeScript", subtitle: "Static Typing", color: "#3178C6" },
    ],
  },
  {
    title: "UI & Styling",
    description: "Modern design systems, utility classes, and accessible component architectures.",
    categoryIcon: FiLayers,
    dotColor: "#06B6D4",
    skills: [
      { Icon: SiTailwindcss, label: "Tailwind CSS", subtitle: "Utility Framework", color: "#06B6D4" },
      { Icon: SiDaisyui, label: "DaisyUI", subtitle: "Tailwind Components", color: "#5A0EF8" },
      { Icon: SiHeroui, label: "HeroUI", subtitle: "Modern UI Library", color: "inherit", className: "text-gray-900 dark:text-white" },
    ],
  },
  {
    title: "Tools & Version Control",
    description: "Development workflow, version tracking, and design prototyping.",
    categoryIcon: FiTool,
    dotColor: "#F05032",
    skills: [
      { Icon: SiGit, label: "Git", subtitle: "Version Control", color: "#F05032" },
      { Icon: SiGithub, label: "GitHub", subtitle: "Collaboration", color: "inherit", className: "text-gray-900 dark:text-white" },
      { Icon: VscodeIcon, label: "VS Code", subtitle: "Primary Editor", color: "#007ACC" },
      { Icon: SiFigma, label: "Figma", subtitle: "UI/UX Prototyping", color: "#F24E1E" },
      { Icon: SiPenpot, label: "Penpot", subtitle: "Open-Source Design", color: "#3449FF" },
    ],
  },
  {
    title: "Deployment & Platforms",
    description: "Cloud infrastructure, automated CI/CD pipelines, and edge hosting.",
    categoryIcon: FiCloud,
    dotColor: "#00C7B7",
    skills: [
      { Icon: SiVercel, label: "Vercel", subtitle: "Cloud Platform", color: "inherit", className: "text-gray-900 dark:text-white" },
      { Icon: SiNetlify, label: "Netlify", subtitle: "CI/CD & Edge Hosting", color: "#00C7B7" },
      { Icon: SiGithubpages, label: "GitHub Pages", subtitle: "Static Hosting", color: "inherit", className: "text-gray-900 dark:text-white" },
    ],
  },
];

/* ── Individual Tech Card ── */
const TechCard = ({ skill, accentColor }) => {
  const brandColor = skill.color !== "inherit" ? skill.color : accentColor;

  return (
    <motion.div
      whileHover={{
        y: -4,
        scale: 1.025,
        transition: { type: "spring", stiffness: 400, damping: 18 },
      }}
      whileTap={{ scale: 0.98 }}
      className="group relative flex items-center gap-3.5 p-3.5 md:p-4 rounded-xl bg-gray-50/70 dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/5 hover:border-[#2D8CFF]/40 dark:hover:border-[#2D8CFF]/40 hover:bg-white dark:hover:bg-white/[0.06] hover:shadow-[0_12px_24px_-8px_rgba(45,140,255,0.18)] transition-all duration-300 overflow-hidden cursor-default"
    >
      {/* Subtle brand ambient glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"
        style={{
          background: `radial-gradient(circle at 25% 50%, ${brandColor}14, transparent 70%)`,
        }}
      />

      {/* Dynamic border tint on hover */}
      <div
        className="absolute inset-0 rounded-xl border border-transparent group-hover:border-current opacity-0 group-hover:opacity-30 transition-all duration-300 pointer-events-none"
        style={{ color: brandColor }}
      />

      {/* Icon Container with interactive micro-bounce */}
      <motion.div
        whileHover={{ rotate: [0, -8, 8, 0], scale: 1.15 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-white dark:bg-zinc-900/80 border border-gray-200/60 dark:border-white/10 shadow-sm group-hover:border-[#2D8CFF]/30 transition-all duration-300 relative z-10"
      >
        <skill.Icon
          className={`text-xl flex-shrink-0 ${skill.className || ""}`}
          style={skill.color !== "inherit" ? { color: skill.color } : {}}
        />
      </motion.div>

      {/* Text info */}
      <div className="flex flex-col min-w-0 relative z-10">
        <span className="text-sm font-bold text-gray-900 dark:text-white truncate leading-tight group-hover:text-[#2D8CFF] dark:group-hover:text-[#2D8CFF] transition-colors duration-300">
          {skill.label}
        </span>
        {skill.subtitle && (
          <span className="text-[11px] font-medium text-gray-500 dark:text-zinc-400 truncate leading-tight mt-1 group-hover:text-gray-700 dark:group-hover:text-zinc-300 transition-colors duration-300">
            {skill.subtitle}
          </span>
        )}
      </div>
    </motion.div>
  );
};

/* ── Individual Category Node (Scroll-Linked Animation & Center Stage Focus) ── */
const CategoryNode = ({ category, index, total, smoothProgress, progressPoints }) => {
  const centerPoint = progressPoints[index];

  // Opacity: guaranteed visibility for all 7 nodes across scroll
  const opacity = useTransform(smoothProgress, (p) => {
    // First item is immediately visible when entering the section
    if (index === 0) {
      if (p <= centerPoint + 0.08) return 1.0;
      return 0.85;
    }

    const enterStart = Math.max(0, centerPoint - 0.12);
    const enterEnd = centerPoint;

    // Upcoming items have subtle visibility along timeline so there are never blank gaps
    if (p < enterStart) return 0.2;

    // Smooth fade into active focus as it enters center stage
    if (p <= enterEnd) {
      const t = (p - enterStart) / (enterEnd - enterStart);
      return 0.2 + 0.8 * t;
    }

    // Once passed center, it remains fully visible
    if (Math.abs(p - centerPoint) < 0.07) return 1.0;
    return 0.85;
  });

  // Scale: subtle focal snap at center
  const scale = useTransform(smoothProgress, (p) => {
    const dist = Math.abs(p - centerPoint);
    if (dist < 0.07) {
      const t = 1 - dist / 0.07;
      return 1 + 0.015 * t;
    }
    return 1;
  });

  // Horizontal connector line extension
  const connectorScaleX = useTransform(smoothProgress, (p) => {
    if (index === 0) return 1;
    const enterStart = Math.max(0, centerPoint - 0.12);
    const enterEnd = centerPoint;
    if (p < enterStart) return 0.25;
    if (p >= enterEnd) return 1;
    const t = (p - enterStart) / (enterEnd - enterStart);
    return 0.25 + 0.75 * t;
  });

  // Timeline node pulse & scale
  const nodeScale = useTransform(smoothProgress, (p) => {
    if (index === 0) return 1;
    const enterStart = Math.max(0, centerPoint - 0.12);
    const enterEnd = centerPoint;
    if (p < enterStart) return 0.65;
    if (p >= enterEnd) return 1;
    const t = (p - enterStart) / (enterEnd - enterStart);
    return 0.65 + 0.35 * t;
  });

  // GPU-Friendly Active Ambient Glow Opacity (avoids animating box-shadow directly)
  const activeGlowOpacity = useTransform(smoothProgress, (p) => {
    const dist = Math.abs(p - centerPoint);
    if (dist < 0.07) {
      return 1 - dist / 0.07;
    }
    return 0;
  });

  return (
    <motion.div
      data-category-item="true"
      style={{ opacity, scale }}
      className="relative will-change-transform"
    >
      {/* Horizontal connector line bridging the timeline node to the card */}
      <motion.div
        style={{
          scaleX: connectorScaleX,
          originX: 0,
          backgroundColor: category.dotColor,
          boxShadow: `0 0 8px ${category.dotColor}80`,
        }}
        className="absolute -left-6 sm:-left-8 top-[38px] md:top-[46px] w-6 sm:w-8 h-[1.5px] -translate-y-1/2 pointer-events-none z-10"
      />

      {/* Concentric glowing timeline node with ambient pulse */}
      <motion.div
        style={{ scale: nodeScale }}
        className="absolute -left-6 sm:-left-8 top-[38px] md:top-[46px] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-20"
      >
        <motion.div
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.35, 0, 0.35],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-5 h-5 rounded-full pointer-events-none"
          style={{
            backgroundColor: category.dotColor,
          }}
        />
        <div
          className="w-5 h-5 rounded-full border-2 flex items-center justify-center bg-white dark:bg-[#12131A] shadow-md relative z-10"
          style={{ borderColor: category.dotColor }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: category.dotColor,
              boxShadow: `0 0 10px ${category.dotColor}`,
            }}
          />
        </div>
      </motion.div>

      {/* Parent Category Container */}
      <div className="glass-card p-5 sm:p-6 md:p-8 rounded-2xl relative overflow-hidden transition-all duration-300">
        {/* GPU-Friendly Active Ambient Glow & Border Overlay */}
        <motion.div
          style={{
            opacity: activeGlowOpacity,
            boxShadow: `0 10px 30px -10px ${category.dotColor}40`,
            borderColor: `${category.dotColor}50`,
          }}
          className="absolute inset-0 rounded-2xl border pointer-events-none"
        />

        {/* Category Header */}
        <div className="mb-5 relative z-10">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
              style={{
                backgroundColor: `${category.dotColor}15`,
                color: category.dotColor,
                border: `1px solid ${category.dotColor}30`,
              }}
            >
              <category.categoryIcon className="text-sm" />
            </div>
            <h3
              className="font-label-caps text-xs md:text-sm font-bold uppercase tracking-wider"
              style={{ color: category.dotColor }}
            >
              {category.title}
            </h3>
          </div>
          {category.description && (
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1.5 ml-0 sm:ml-9">
              {category.description}
            </p>
          )}
        </div>

        {/* Horizontal Group of Technology Cards */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 relative z-10 ${
            category.skills.length >= 5
              ? "md:grid-cols-3 lg:grid-cols-5"
              : "md:grid-cols-2 lg:grid-cols-4"
          } gap-3 md:gap-4`}
        >
          {category.skills.map((skill, i) => (
            <TechCard key={i} skill={skill} accentColor={category.dotColor} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

/* ── Main Sticky Scroll Tech Stack Component ── */
const Skills = () => {
  const containerRef = useRef(null);
  const listRef = useRef(null);
  const viewportRef = useRef(null);

  // 7 evenly distributed checkpoints along the pinned scroll track
  const progressPoints = [0.06, 0.20, 0.35, 0.50, 0.65, 0.79, 0.93];

  // Estimated initial offsets to prevent any flicker before measurement
  const targetsRef = useRef([180, -50, -270, -480, -700, -960, -1220]);

  // Track the raw scroll progress of the 520vh section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Fast, responsive momentum smoothing with snappy spring physics
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 24,
    mass: 0.5,
    restDelta: 0.001,
  });

  // Measure exact pixel offsets of each category to achieve 100% accurate center alignment
  useEffect(() => {
    const updatePositions = () => {
      if (!viewportRef.current || !listRef.current) return;
      const viewportRect = viewportRef.current.getBoundingClientRect();
      const viewportCenter = viewportRect.height / 2;

      const items = listRef.current.querySelectorAll("[data-category-item]");
      if (items.length === categories.length) {
        const newTargets = Array.from(items).map((el) => {
          const elTop = el.offsetTop;
          const elHeight = el.offsetHeight;
          const itemCenterInList = elTop + elHeight / 2;
          return Math.round(viewportCenter - itemCenterInList);
        });
        targetsRef.current = newTargets;
      }
    };

    updatePositions();
    const timer1 = setTimeout(updatePositions, 100);
    const timer2 = setTimeout(updatePositions, 400);
    const timer3 = setTimeout(updatePositions, 1000);
    window.addEventListener("resize", updatePositions);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      window.removeEventListener("resize", updatePositions);
    };
  }, []);

  // Continuous linear translation mapping driven by smoothProgress (natural deceleration via spring)
  const listY = useTransform(smoothProgress, (progress) => {
    const targets = targetsRef.current;
    if (!targets || targets.length !== categories.length) return 0;

    const points = progressPoints;

    if (progress <= points[0]) return targets[0];
    if (progress >= points[points.length - 1]) return targets[targets.length - 1];

    for (let i = 0; i < points.length - 1; i++) {
      if (progress >= points[i] && progress <= points[i + 1]) {
        const t = (progress - points[i]) / (points[i + 1] - points[i]);
        return targets[i] + (targets[i + 1] - targets[i]) * t;
      }
    }
    return targets[0];
  });

  return (
    <section
      ref={containerRef}
      id="skills"
      className="relative bg-transparent"
      style={{ height: "320vh" }}
    >
      {/* Sticky Pinned Viewport Container (stays pinned at top: 0, height: 100vh) */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
        }}
        className="flex flex-col justify-between py-6 sm:py-8 md:py-10 overflow-hidden z-10"
      >
        {/* Subtle Top Scroll Progress Indicator */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gray-200/40 dark:bg-white/5 z-30">
          <motion.div
            style={{ scaleX: smoothProgress, originX: 0 }}
            className="h-full bg-[#2D8CFF]"
          />
        </div>

        {/* Section Header (Fixed at top of pinned screen) */}
        <div className="max-w-7xl mx-auto px-5 md:px-8 w-full flex-shrink-0 z-20">
          <div className="text-center mb-2 md:mb-4">
            <h2 className="font-h2 text-2xl md:text-h2 text-gray-900 dark:text-white mb-2 md:mb-3">
              The Tech Stack
            </h2>
            <p className="text-xs md:text-sm text-gray-600 dark:text-on-surface-variant max-w-xl mx-auto">
              A specialized selection of tools and languages I use to bring digital ideas to life.
            </p>
          </div>
        </div>

        {/* Center Stage Viewport (Smooth mask & center alignment) */}
        <div
          ref={viewportRef}
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)",
          }}
          className="flex-1 w-full max-w-5xl mx-auto pl-8 sm:pl-12 pr-4 sm:pr-6 relative overflow-hidden flex flex-col justify-start"
        >
          <motion.div
            ref={listRef}
            style={{ y: listY }}
            className="relative pl-6 sm:pl-8 timeline-line flex flex-col gap-6 md:gap-8 w-full will-change-transform pt-4 pb-48"
          >
            {categories.map((category, index) => (
              <CategoryNode
                key={category.title}
                category={category}
                index={index}
                total={categories.length}
                smoothProgress={smoothProgress}
                progressPoints={progressPoints}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
