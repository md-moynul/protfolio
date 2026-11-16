"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "./Animations";
import { experience } from "@/data/experience";
import { FiMapPin, FiCalendar, FiFileText, FiCheckCircle } from "react-icons/fi";

const isPlaceholder = (val) =>
  !val || (typeof val === "string" && (val.includes("<") || val.includes(">")));

const Experience = () => {
  return (
    <section className="py-12 md:py-16 px-5 md:px-8 max-w-7xl mx-auto" id="experience">
      <motion.div {...fadeInUp} className="flex flex-col gap-4 mb-12 md:mb-16">
        <h2 className="font-h2 text-h2 text-gray-900 dark:text-white">
          Work Experience
        </h2>
        <p className="text-gray-600 dark:text-zinc-400 max-w-2xl text-base">
          Professional internship contributions, backend event architecture, and frontend MVP development.
        </p>
      </motion.div>

      {/* Main glass-card */}
      <motion.div {...fadeInUp} className="glass-card p-6 md:p-10 rounded-2xl md:rounded-3xl flex flex-col gap-8">
        {/* Header Block: Role, Company, Period, Location, Mode & Certificate */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-gray-100 dark:border-white/5">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-label-caps text-[#2D8CFF] tracking-widest text-xs uppercase font-semibold">
                {experience.period}
              </span>
              {!isPlaceholder(experience.mode) && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#2D8CFF]/10 text-[#2D8CFF] border border-[#2D8CFF]/20">
                  {experience.mode}
                </span>
              )}
            </div>

            <h3 className="font-h2 text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {experience.role}
            </h3>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-zinc-300">
              <span className="font-semibold text-[#2D8CFF]">{experience.company}</span>
              {experience.location && (
                <span className="flex items-center gap-1 text-gray-500 dark:text-zinc-400">
                  <FiMapPin className="text-xs text-[#2D8CFF]" />
                  {experience.location}
                </span>
              )}
            </div>
          </div>

          {/* Certificate Action */}
          {experience.certificate?.pdf && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
              <a
                href={experience.certificate.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#2D8CFF]/40 bg-[#2D8CFF]/10 hover:bg-[#2D8CFF]/20 text-[#2D8CFF] dark:text-[#2D8CFF] text-xs font-semibold tracking-wide transition-all duration-200 shadow-xs hover:shadow-sm"
              >
                <FiFileText className="text-sm shrink-0" />
                <span>View Certificate</span>
              </a>
              {experience.certificate.reference && (
                <span className="text-xs font-mono text-gray-500 dark:text-zinc-400">
                  Ref:{" "}
                  <span className="text-gray-800 dark:text-zinc-200 font-semibold">
                    {experience.certificate.reference}
                  </span>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Summary */}
        <p className="text-base text-gray-700 dark:text-zinc-300 leading-relaxed text-left md:text-justify hyphens-auto">
          {experience.summary}
        </p>

        {/* Phases as a vertical timeline */}
        <div className="relative pl-6 sm:pl-8 timeline-line flex flex-col gap-8 mt-2">
          {experience.phases?.map((phase, pIdx) => {
            const validBullets =
              phase.bullets?.filter((b) => !isPlaceholder(b)) || [];
            const showDuration = !isPlaceholder(phase.duration);

            const hasColon = phase.title?.includes(":");
            const phasePrefix = hasColon ? phase.title.split(":")[0].trim() : "";
            const phaseMainTitle = hasColon
              ? phase.title.split(":").slice(1).join(":").trim()
              : phase.title;
            const isPhaseNamed =
              hasColon && phasePrefix.toLowerCase().startsWith("phase");

            return (
              <div key={pIdx} className="relative">
                {/* Timeline Dot */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  className="absolute -left-[calc(1.5rem+9px)] sm:-left-[calc(2rem+9px)] top-4 w-4 h-4 rounded-full bg-[#2D8CFF] shadow-[0_0_10px_#2D8CFF]"
                />

                <div className="bg-[#f8fafc] dark:bg-[#151622] border border-slate-200 dark:border-white/10 border-l-4 border-l-[#2D8CFF] p-5 sm:p-7 rounded-2xl shadow-[0_2px_12px_-2px_rgba(15,23,42,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex flex-col gap-4 hover:border-slate-300 dark:hover:border-white/20 hover:border-l-[#2D8CFF] dark:hover:border-l-[#2D8CFF] transition-all duration-300">
                  {/* Phase Title & Duration */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2.5">
                      {isPhaseNamed ? (
                        <>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#2D8CFF]/15 text-[#2D8CFF] border border-[#2D8CFF]/30 shrink-0">
                            {phasePrefix}
                          </span>
                          <h4 className="font-h2 text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                            {phaseMainTitle}
                          </h4>
                        </>
                      ) : (
                        <h4 className="font-h2 text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                          {phase.title}
                        </h4>
                      )}
                    </div>
                    {showDuration && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono text-gray-600 dark:text-zinc-300 bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full border border-gray-200 dark:border-white/10 self-start sm:self-auto shrink-0">
                        <FiCalendar className="text-xs text-[#2D8CFF]" />
                        {phase.duration}
                      </span>
                    )}
                  </div>

                  {/* Project Line */}
                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                    <span className="font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-zinc-400">
                      Project:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white bg-gray-100/90 dark:bg-white/5 px-2.5 py-1 rounded-md border border-gray-200/80 dark:border-white/10">
                      {phase.project}
                    </span>
                  </div>

                  {/* Bullets */}
                  {validBullets.length > 0 && (
                    <ul className="flex flex-col gap-2.5 mt-1">
                      {validBullets.map((bullet, bIdx) => (
                        <li
                          key={bIdx}
                          className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-zinc-300 leading-relaxed"
                        >
                          <FiCheckCircle className="text-xs text-[#2D8CFF] shrink-0 mt-1.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Stack Chips */}
                  {phase.stack && phase.stack.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-200/70 dark:border-white/10 mt-1">
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mr-1">
                        Stack:
                      </span>
                      {phase.stack.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 text-xs rounded-full bg-[#2D8CFF]/10 text-[#2D8CFF] border border-[#2D8CFF]/20 font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

export default Experience;

