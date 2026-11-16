"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp, staggerContainer } from "./Animations";
import { FaGithub } from "react-icons/fa";
import {
  FiX,
  FiCalendar,
  FiStar,
  FiExternalLink,
  FiInfo,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { normalizeProjectImg } from "@/lib/project-image";

const PROJECTS_PER_PAGE = 3;

function getProjectImg(project) {
  return normalizeProjectImg(project?.img || project?.image);
}

/* ─── Modal ─────────────────────────────────────────────────────────────── */
const ProjectModal = ({ project, onClose }) => {
  const [hasError, setHasError] = useState(false);
  const imgSrc = hasError ? "/images/smart-health.webp" : getProjectImg(project);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Prevent body scroll while modal open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <AnimatePresence>
      {/* Dynamic Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/60 dark:bg-black/80 backdrop-blur-md"
      >
        {/* Dynamic Modal Card */}
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-[#12131A] border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="sticky top-3 right-3 self-end z-50 -mb-10 mr-3 w-10 h-10 rounded-full flex items-center justify-center bg-black/50 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 transition-all duration-200 shadow-lg hover:scale-105"
          >
            <FiX className="text-xl" />
          </button>

          {/* Project Header Image */}
          <div className="relative h-56 md:h-72 w-full overflow-hidden flex-shrink-0 bg-gray-900">
            <Image
              src={imgSrc}
              alt={project.title}
              width={1000}
              height={500}
              onError={() => setHasError(true)}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#12131A] via-transparent to-black/30" />
          </div>

          {/* Content Body */}
          <div data-lenis-prevent="true" className="p-6 md:p-8 flex-1 overflow-y-auto flex flex-col gap-6 -mt-8 relative z-10">
            {/* Header info */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {(project.starting_date || project.finished_date) && (
                  <span className="text-xs font-semibold text-gray-600 dark:text-zinc-300 flex items-center gap-1.5 bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full border border-gray-200 dark:border-white/10">
                    <FiCalendar className="text-xs text-[#2D8CFF]" />
                    {project.starting_date} — {project.finished_date || "Present"}
                  </span>
                )}
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs font-bold tracking-wider rounded-full uppercase bg-[#2D8CFF]/10 text-[#2D8CFF] border border-[#2D8CFF]/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h3 className="font-bold text-2xl md:text-3xl text-gray-900 dark:text-white tracking-tight">
                {project.title}
              </h3>
            </div>

            {/* Long description */}
            <div className="text-gray-600 dark:text-zinc-300 text-sm md:text-base leading-relaxed space-y-2">
              <p>{project.longDesc}</p>
            </div>

            {/* Key Features Grid */}
            {project.features?.length > 0 && (
              <div className="bg-gray-50 dark:bg-white/[0.03] p-5 rounded-2xl border border-gray-100 dark:border-white/5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-400 mb-3 flex items-center gap-2">
                  <FiStar className="text-sm text-[#2D8CFF]" />
                  Key Features & Highlights
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-zinc-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2D8CFF] mt-2 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100 dark:border-white/10 mt-auto">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full font-bold text-xs flex items-center gap-2 text-white bg-[#2D8CFF] hover:bg-[#1f73df] transition-all duration-300 shadow-[0_8px_20px_rgba(45,140,255,0.3)] hover:shadow-[0_12px_25px_rgba(45,140,255,0.4)] hover:-translate-y-0.5"
              >
                Live Preview <FiExternalLink className="text-sm" />
              </a>

              {project.githubFrontend && project.githubBackend ? (
                <>
                  <a
                    href={project.githubFrontend}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 rounded-full font-bold text-xs flex items-center gap-2 text-gray-700 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <FaGithub /> Frontend Code
                  </a>
                  <a
                    href={project.githubBackend}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 rounded-full font-bold text-xs flex items-center gap-2 text-gray-700 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <FaGithub /> Backend Code
                  </a>
                </>
              ) : project.githubFrontend ? (
                <a
                  href={project.githubFrontend}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-full font-bold text-xs flex items-center gap-2 text-gray-700 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <FaGithub /> Source Code
                </a>
              ) : project.github ? (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-full font-bold text-xs flex items-center gap-2 text-gray-700 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <FaGithub /> Source Code
                </a>
              ) : null}

              {/* Explicit Close Button for Mobile UX */}
              <button
                onClick={onClose}
                className="px-5 py-3 rounded-full font-bold text-xs flex items-center gap-1.5 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 transition-all duration-300 ml-auto"
              >
                <FiX className="text-sm" /> Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─── Project Card ───────────────────────────────────────────────────────── */
const ProjectCard = ({ project, onViewDetails }) => {
  const [hasError, setHasError] = useState(false);
  const imgSrc = hasError ? "/images/smart-health.webp" : getProjectImg(project);

  return (
    <motion.div
      {...fadeInUp}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25 }}
      className="glass-card rounded-2xl overflow-hidden group flex flex-col"
    >
      {/* Image */}
      <div className="h-56 overflow-hidden relative">
        <Image
          alt={project.title}
          src={imgSrc}
          width={800}
          height={400}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover group-hover:scale-105 group-hover:brightness-110 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-30 group-hover:opacity-0 transition-opacity duration-500" />
      </div>

    {/* Body */}
    <div className="p-6 flex flex-col flex-grow">
      {/* Date badge */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {(project.starting_date || project.finished_date) && (
          <span className="text-xs font-semibold text-gray-600 dark:text-zinc-300 flex items-center gap-1.5 bg-gray-100 dark:bg-white/5 px-2.5 py-1 rounded-full border border-gray-200 dark:border-white/10">
            <FiCalendar className="text-xs text-[#2D8CFF]" />
            {project.starting_date} – {project.finished_date || "Present"}
          </span>
        )}
      </div>

      {/* Tags Badges */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#2D8CFF]/10 text-[#2D8CFF] border border-[#2D8CFF]/20 hover:bg-[#2D8CFF]/20 transition-all duration-200"
          >
            {tag}
          </span>
        ))}
      </div>

      <h3 className="font-h2 text-xl text-gray-900 dark:text-white mb-2">{project.title}</h3>
      <p className="text-gray-600 dark:text-on-surface-variant mb-5 text-sm leading-relaxed line-clamp-3">
        {project.desc}
      </p>

      {/* Buttons */}
      <div className="flex flex-wrap items-center gap-3 mt-auto">
        {/* View Details */}
        <button
          onClick={() => onViewDetails(project)}
          className="px-4 py-2 rounded-full font-bold text-xs flex items-center gap-1.5 bg-[#2D8CFF]/10 border border-[#2D8CFF]/30 text-[#2D8CFF] hover:bg-[#2D8CFF] hover:text-white hover:border-[#2D8CFF] transition-all"
        >
          <FiInfo className="text-sm" />
          View Details
        </button>

        {/* Live Demo */}
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 border border-gray-300 dark:border-[#262626] rounded-full text-gray-600 dark:text-zinc-300 font-bold text-xs flex items-center gap-1.5 hover:border-[#2D8CFF] hover:text-[#2D8CFF] hover:bg-[#2D8CFF]/10 transition-all"
        >
          Live Demo
          <FiExternalLink className="text-sm" />
        </a>

        {/* GitHub(s) */}
        {project.githubFrontend && project.githubBackend ? (
          <>
            <a
              href={project.githubFrontend}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 border border-gray-300 dark:border-white/10 rounded-full text-gray-600 dark:text-zinc-300 font-bold text-xs flex items-center gap-1.5 hover:border-gray-900 dark:hover:border-white hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
            >
              <FaGithub /> Frontend
            </a>
            <a
              href={project.githubBackend}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 border border-gray-300 dark:border-white/10 rounded-full text-gray-600 dark:text-zinc-300 font-bold text-xs flex items-center gap-1.5 hover:border-gray-900 dark:hover:border-white hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
            >
              <FaGithub /> Backend
            </a>
          </>
        ) : project.githubFrontend ? (
          <a
            href={project.githubFrontend}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 border border-gray-300 dark:border-white/10 rounded-full text-gray-600 dark:text-zinc-300 font-bold text-xs flex items-center gap-1.5 hover:border-gray-900 dark:hover:border-white hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
          >
            <FaGithub /> Frontend
          </a>
        ) : project.github ? (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 border border-gray-300 dark:border-white/10 rounded-full text-gray-600 dark:text-zinc-300 font-bold text-xs flex items-center gap-1.5 hover:border-gray-900 dark:hover:border-white hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
          >
            <FaGithub /> GitHub
          </a>
        ) : null}
      </div>
    </div>
  </motion.div>
  );
};

/* ─── Pagination ─────────────────────────────────────────────────────────── */
const Pagination = ({ current, total, onChange }) => {
  if (total <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      {/* Prev */}
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-300 dark:border-white/10 text-gray-500 dark:text-zinc-400 hover:border-[#2D8CFF] hover:text-[#2D8CFF] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <FiChevronLeft className="text-lg" />
      </button>

      {/* Page numbers */}
      {Array.from({ length: total }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onChange(page)}
          className={`w-9 h-9 rounded-full font-bold text-sm transition-all ${page === current
              ? "bg-[#2D8CFF] text-white border border-[#2D8CFF] shadow-[0_0_12px_rgba(45,140,255,0.4)]"
              : "border border-gray-300 dark:border-white/10 text-gray-500 dark:text-zinc-400 hover:border-[#2D8CFF] hover:text-[#2D8CFF]"
            }`}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-300 dark:border-white/10 text-gray-500 dark:text-zinc-400 hover:border-[#2D8CFF] hover:text-[#2D8CFF] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <FiChevronRight className="text-lg" />
      </button>
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────────────── */
const Projects = ({ initialProjects = [] }) => {
  const [projects] = useState(initialProjects);
  const [page, setPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);

  const totalPages = Math.ceil(projects.length / PROJECTS_PER_PAGE);
  const visibleProjects = projects.slice(
    (page - 1) * PROJECTS_PER_PAGE,
    page * PROJECTS_PER_PAGE
  );

  const handlePageChange = (newPage) => {
    setPage(newPage);
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <section className="py-12 md:py-16 px-5 md:px-8 max-w-7xl mx-auto" id="projects">
        {/* Header */}
        <motion.div
          {...fadeInUp}
          className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 gap-8"
        >
          <div className="max-w-2xl">
            <h2 className="font-h2 text-h2 text-gray-900 dark:text-white mb-4">Recent Projects</h2>
            <p className="text-gray-600 dark:text-zinc-400">
              A collection of full-stack web applications built with clean code and thoughtful design.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-gray-600 dark:text-zinc-400 text-xs font-bold tracking-widest">
            <span>
              {projects.length > 0 ? (page - 1) * PROJECTS_PER_PAGE + 1 : 0}–{Math.min(page * PROJECTS_PER_PAGE, projects.length)}
            </span>
            <span className="opacity-40">/</span>
            <span>{projects.length} PROJECTS</span>
          </div>
        </motion.div>

        {/* Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-16 text-gray-500 dark:text-zinc-400">
            <p>No projects available right now.</p>
          </div>
        ) : (
          <motion.div
            key={page}
            variants={staggerContainer}
            initial="initial"
            animate="whileInView"
            viewport={{ once: false }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {visibleProjects.map((project) => (
              <ProjectCard
                key={project.id ?? project._id}
                project={project}
                onViewDetails={setSelectedProject}
              />
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        <Pagination current={page} total={totalPages} onChange={handlePageChange} />
      </section>

      {/* Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
};

export default Projects;