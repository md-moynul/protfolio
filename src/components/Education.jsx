"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaAward } from "react-icons/fa";
import { FiMaximize2, FiExternalLink, FiX, FiFileText } from "react-icons/fi";
import { fadeInUp } from "./Animations";
import { currentYear, degree, institute, startYear } from "@/data/profile";
import { certificates } from "@/data/certificates";

function hasValidVerifyUrl(url) {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed || trimmed === "#" || trimmed.includes("<PUT") || trimmed.includes("<")) return false;
  return true;
}

const Education = () => {
  const [activeCert, setActiveCert] = useState(null);
  const closeBtnRef = useRef(null);
  const triggerRef = useRef(null);
  const modalRef = useRef(null);

  const openLightbox = (cert, event) => {
    triggerRef.current = event?.currentTarget || document.activeElement;
    setActiveCert(cert);
  };

  const closeLightbox = () => {
    setActiveCert(null);
    if (triggerRef.current && typeof triggerRef.current.focus === "function") {
      triggerRef.current.focus();
    }
  };

  // Keyboard navigation, focus trapping, and body scroll locking
  useEffect(() => {
    if (!activeCert) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus close button on mount
    const timer = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeLightbox();
        return;
      }

      if (e.key === "Tab") {
        if (!modalRef.current) return;
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [activeCert]);

  return (
    <section className="py-12 md:py-16 px-5 md:px-8 max-w-7xl mx-auto" id="education">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        {/* Left column - Academic visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative md:sticky md:top-28 self-start"
        >
          <div className="aspect-square glass-card rounded-2xl overflow-hidden group">
            <Image
              alt="Academic Foundation - Computer Science Study"
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
              src="/images/education.webp"
              width={800}
              height={800}
            />
          </div>
        </motion.div>

        {/* Right column - Timeline */}
        <motion.div {...fadeInUp} className="flex flex-col gap-8">
          <h2 className="font-h2 text-h2 text-gray-900 dark:text-white">
            Academic Foundation
          </h2>

          {/* Timeline */}
          <div className="relative pl-8 timeline-line flex flex-col gap-8">
            {/* Diploma Entry */}
            <div className="relative">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="absolute -left-[calc(2rem+9px)] top-1 w-4 h-4 rounded-full bg-[#2D8CFF] shadow-[0_0_10px_#2D8CFF]"
              />
              <div className="glass-card p-6 md:p-8 rounded-xl">
                <span className="font-label-caps text-[#2D8CFF] mb-2 block tracking-widest text-xs uppercase font-semibold">
                  {startYear} — Present
                </span>
                <h3 className="font-h2 text-xl text-gray-900 dark:text-white mb-1">
                  {degree}
                </h3>
                <p className="text-sm text-gray-500 dark:text-on-surface-variant mb-3">
                  {institute} · Bangladesh
                </p>
                <p className="text-gray-600 dark:text-on-surface-variant leading-relaxed text-left md:text-justify hyphens-auto">
                  Building a solid foundation in core computing principles —
                  covering data structures, algorithms, operating systems,
                  database management, and modern web technologies as part of
                  the four-year diploma programme.
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {[
                    "Data Structures",
                    "Algorithms",
                    "Web Development",
                    "Database",
                    "Networking",
                    "OOP",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs rounded-full bg-[#2D8CFF]/10 text-[#2D8CFF] border border-[#2D8CFF]/20 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Certifications Group */}
            {certificates.map((cert, index) => {
              const periodText =
                cert.period ||
                (cert.start && cert.end ? `${cert.start} — ${cert.end}` : cert.start || cert.end || "");
              const certIdText = cert.credentialId
                ? `Credential ID: ${cert.credentialId}`
                : cert.reference
                ? `Reference: ${cert.reference}`
                : "";
              const altText = `${cert.issuer} ${cert.title} certificate${cert.batch ? `, ${cert.batch}` : ""}`;

              return (
                <div key={cert.credentialId || cert.reference || index} className="relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    className="absolute -left-[calc(2rem+9px)] top-1 w-4 h-4 rounded-full bg-[#2D8CFF] shadow-[0_0_10px_#2D8CFF]"
                  />
                  <div className="glass-card p-6 md:p-8 rounded-xl flex flex-col gap-5">
                    {/* Top row: Date range & Award badge */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {periodText ? (
                          <span className="font-label-caps text-[#2D8CFF] tracking-widest text-xs uppercase font-semibold">
                            {periodText}
                          </span>
                        ) : null}
                        {cert.type && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#2D8CFF]/10 text-[#2D8CFF] border border-[#2D8CFF]/20">
                            {cert.type}
                          </span>
                        )}
                      </div>
                      {cert.award && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          <FaAward className="text-xs shrink-0" />
                          <span>{cert.award}</span>
                        </span>
                      )}
                    </div>

                    {/* Main content: Thumbnail + Metadata */}
                    <div className="flex flex-col sm:flex-row gap-5 items-start">
                      {/* Thumbnail */}
                      <button
                        type="button"
                        onClick={(e) => openLightbox(cert, e)}
                        aria-label={`View ${cert.title} certificate`}
                        className="relative group w-full sm:w-44 aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 dark:border-white/10 shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2D8CFF] bg-black/5 dark:bg-white/5 transition-transform duration-300 hover:scale-[1.02]"
                      >
                        <Image
                          src={cert.image}
                          alt={altText}
                          fill
                          sizes="(max-width: 640px) 100vw, 176px"
                          loading="lazy"
                          className="object-cover object-top transition-all duration-300 group-hover:brightness-95 dark:group-hover:brightness-110"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-1 text-white">
                          <FiMaximize2 className="text-xl drop-shadow" />
                          <span className="text-xs font-medium tracking-wide">Click to view</span>
                        </div>
                      </button>

                      {/* Title, Issuer, Batch, ID & Actions */}
                      <div className="flex-1 flex flex-col gap-2 min-w-0">
                        <div>
                          <h3 className="font-h2 text-xl text-gray-900 dark:text-white mb-1">
                            {cert.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-on-surface-variant font-medium">
                            {cert.issuer}
                            {cert.batch ? (
                              <>
                                {" "}· <span className="text-[#2D8CFF] font-semibold">{cert.batch}</span>
                              </>
                            ) : null}
                          </p>
                        </div>

                        {certIdText && (
                          <p className="text-xs text-gray-500 dark:text-on-surface-variant font-mono">
                            {certIdText}
                          </p>
                        )}

                        {/* Action buttons (View PDF & Verify Certificate) */}
                        <div className="flex flex-wrap items-center gap-2.5 pt-1">
                          {cert.pdf && (
                            <a
                              href={cert.pdf}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#2D8CFF]/40 bg-[#2D8CFF]/10 hover:bg-[#2D8CFF]/20 text-[#2D8CFF] dark:text-[#2D8CFF] text-xs font-semibold tracking-wide transition-all duration-200 shadow-xs hover:shadow-sm"
                            >
                              <FiFileText className="text-sm shrink-0" />
                              <span>View PDF</span>
                            </a>
                          )}

                          {hasValidVerifyUrl(cert.verifyUrl) && (
                            <a
                              href={cert.verifyUrl}
                              {...(cert.verifyUrl.startsWith("mailto:")
                                ? {}
                                : { target: "_blank", rel: "noopener noreferrer" })}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#2D8CFF] hover:bg-[#1a6fd8] text-white text-xs font-semibold tracking-wide transition-all duration-200 shadow-sm hover:shadow"
                            >
                              <span>{cert.verifyLabel || "Verify Certificate"}</span>
                              <FiExternalLink className="text-sm shrink-0" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Skill chips */}
                    {cert.skills && cert.skills.length > 0 && (
                      <div className="pt-2 border-t border-gray-100 dark:border-white/5">
                        <span className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-zinc-400 block mb-2">
                          Skills Acquired
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {cert.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-3 py-1 text-xs rounded-full bg-[#2D8CFF]/10 text-[#2D8CFF] border border-[#2D8CFF]/20 font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Status badge */}
            <div className="relative">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="absolute -left-[calc(2rem+9px)] top-1 w-4 h-4 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399] animate-pulse"
              />
              <div className="glass-card p-4 rounded-xl flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm text-gray-600 dark:text-on-surface-variant">
                  Currently in{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {currentYear}
                  </span>{" "}
                  — actively learning &amp; building projects
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Accessible Certificate Lightbox Modal */}
      <AnimatePresence>
        {activeCert && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cert-modal-title"
            ref={modalRef}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeLightbox}
              className="fixed inset-0 bg-black/80 dark:bg-black/90 backdrop-blur-sm cursor-pointer"
              aria-hidden="true"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative z-10 w-full max-w-4xl max-h-[92vh] bg-white dark:bg-[#0e0e16] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-white/10 shrink-0">
                <div className="pr-4">
                  <h3
                    id="cert-modal-title"
                    className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-snug"
                  >
                    {activeCert.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">
                    {activeCert.issuer}
                    {activeCert.batch ? ` · ${activeCert.batch}` : ""}{" "}
                    {activeCert.award && `· ${activeCert.award}`}
                  </p>
                </div>
                <button
                  type="button"
                  ref={closeBtnRef}
                  onClick={closeLightbox}
                  aria-label="Close certificate preview"
                  className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2D8CFF] cursor-pointer"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              {/* Certificate Image View */}
              <div className="p-4 sm:p-6 overflow-y-auto flex items-center justify-center bg-gray-50 dark:bg-[#07070a]">
                <div className="relative w-full max-w-3xl flex items-center justify-center">
                  <Image
                    src={activeCert.image}
                    alt={`${activeCert.issuer} ${activeCert.title}`}
                    width={activeCert.image?.includes("s-and-s") || activeCert.image?.includes("recommendation") ? 1200 : 1024}
                    height={activeCert.image?.includes("s-and-s") || activeCert.image?.includes("recommendation") ? 1698 : 791}
                    sizes="(max-width: 1024px) 95vw, 900px"
                    loading="lazy"
                    className="w-auto h-auto max-h-[70vh] max-w-full object-contain rounded-lg border border-gray-200 dark:border-white/10 shadow-md"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-t border-gray-200 dark:border-white/10 bg-white/50 dark:bg-[#0e0e16]/50 text-xs shrink-0">
                <span className="text-gray-600 dark:text-zinc-400 font-mono">
                  {activeCert.credentialId
                    ? `Credential ID: ${activeCert.credentialId}`
                    : activeCert.reference
                    ? `Reference: ${activeCert.reference}`
                    : ""}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {activeCert.pdf && (
                    <a
                      href={activeCert.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2D8CFF]/40 bg-[#2D8CFF]/10 hover:bg-[#2D8CFF]/20 text-[#2D8CFF] font-semibold transition-colors text-xs"
                    >
                      <FiFileText className="text-xs shrink-0" />
                      <span>View PDF</span>
                    </a>
                  )}
                  {hasValidVerifyUrl(activeCert.verifyUrl) && (
                    <a
                      href={activeCert.verifyUrl}
                      {...(activeCert.verifyUrl.startsWith("mailto:")
                        ? {}
                        : { target: "_blank", rel: "noopener noreferrer" })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2D8CFF] hover:bg-[#1a6fd8] text-white font-semibold transition-colors text-xs"
                    >
                      <span>{activeCert.verifyLabel || "Verify Certificate"}</span>
                      <FiExternalLink className="text-xs shrink-0" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={closeLightbox}
                    className="px-3.5 py-1.5 rounded-lg border border-gray-300 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-zinc-300 font-medium transition-colors cursor-pointer text-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Education;
