"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "./Animations";
import { FiMail, FiMapPin, FiSend, FiLoader, FiAlertCircle } from "react-icons/fi";
import { email } from "@/data/profile";

const Contact = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "", // honeypot
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    // Client-side validation
    const trimmedName = formState.name.trim();
    const trimmedEmail = formState.email.trim();
    const trimmedSubject = formState.subject.trim();
    const trimmedMessage = formState.message.trim();

    if (trimmedName.length < 2) {
      setStatus({ type: "error", message: "Please provide your name (at least 2 characters)." });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setStatus({ type: "error", message: "Please enter a valid email address." });
      return;
    }

    if (trimmedSubject.length < 1) {
      setStatus({ type: "error", message: "Please provide a subject." });
      return;
    }

    if (trimmedMessage.length < 10) {
      setStatus({ type: "error", message: "Message must be at least 10 characters long." });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          subject: trimmedSubject,
          message: trimmedMessage,
          website: formState.website,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus({
          type: "success",
          message: "Thank you! Your message has been sent successfully. I'll get back to you soon.",
        });
        setFormState({ name: "", email: "", subject: "", message: "", website: "" });
      } else {
        setStatus({
          type: "error",
          message: result.message || "Failed to send message. Please try again.",
        });
      }
    } catch {
      setStatus({
        type: "error",
        message: "Network error occurred while sending. Please try again or email directly.",
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setStatus((prev) => (prev.type === "success" ? { type: "", message: "" } : prev));
      }, 7000);
    }
  };

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  return (
    <section className="bg-transparent py-12 md:py-16 transition-colors" id="contact">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <motion.div
          {...fadeInUp}
          className="bg-white dark:bg-surface-container p-6 md:p-16 rounded-3xl border border-gray-200 dark:border-white/5 flex flex-col lg:flex-row gap-10 lg:gap-20 relative overflow-hidden shadow-[0_4px_20px_-2px_rgba(15,23,42,0.06)] dark:shadow-2xl"
        >
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-container/10 blur-[120px] rounded-full"></div>
          <div className="w-full lg:w-1/2 flex flex-col gap-6 relative z-10">
            <span className="font-label-caps text-primary text-xs font-bold tracking-[0.2em]">Get In Touch</span>
            <h2 className="font-display text-4xl md:text-h1 text-gray-900 dark:text-white leading-tight">Let&apos;s build something <span className="text-gradient">great together</span>.</h2>
            <p className="text-gray-600 dark:text-zinc-400 text-base md:text-body-lg text-left md:text-justify hyphens-auto">Currently available for internships, junior roles, or freelance projects. Feel free to reach out anytime.</p>
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-surface-container-highest flex items-center justify-center text-primary">
                  <FiMail className="text-xl" />
                </div>
                <div>
                  <span className="block font-label-caps text-gray-600 dark:text-zinc-300 text-xs font-semibold">Email Me</span>
                  <a href={`mailto:${email}`} className="text-gray-900 dark:text-white font-bold hover:text-[#2D8CFF] transition-colors">{email}</a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-surface-container-highest flex items-center justify-center text-primary">
                  <FiMapPin className="text-xl" />
                </div>
                <div>
                  <span className="block font-label-caps text-gray-600 dark:text-zinc-300 text-xs font-semibold">Location</span>
                  <span className="text-gray-900 dark:text-white font-bold">Rangpur, Bangladesh</span>
                </div>
              </div>
            </div>
          </div>
          <form className="w-full lg:w-1/2 flex flex-col gap-4 relative z-10" onSubmit={handleSubmit}>
            {/* Visually hidden honeypot field for anti-spam */}
            <input
              type="text"
              name="website"
              value={formState.website}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="opacity-0 absolute -z-50 pointer-events-none h-0 w-0 overflow-hidden"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-label-caps text-xs font-semibold text-gray-600 dark:text-zinc-300 ml-2">Name</label>
                <input
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  className="bg-gray-50/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm rounded-xl px-5 py-3 md:px-6 md:py-4 text-sm md:text-base text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-sm"
                  placeholder="John Doe"
                  type="text"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-caps text-xs font-semibold text-gray-600 dark:text-zinc-300 ml-2">Email</label>
                <input
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                  className="bg-gray-50/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm rounded-xl px-5 py-3 md:px-6 md:py-4 text-sm md:text-base text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-sm"
                  placeholder="john@example.com"
                  type="email"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-caps text-xs font-semibold text-gray-600 dark:text-zinc-300 ml-2">Subject</label>
              <input
                name="subject"
                value={formState.subject}
                onChange={handleChange}
                required
                className="bg-gray-50/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm rounded-xl px-5 py-3 md:px-6 md:py-4 text-sm md:text-base text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-sm"
                placeholder="Project Inquiry"
                type="text"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-caps text-xs font-semibold text-gray-600 dark:text-zinc-300 ml-2">Message</label>
              <textarea
                name="message"
                value={formState.message}
                onChange={handleChange}
                required
                className="bg-gray-50/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm rounded-xl px-5 py-3 md:px-6 md:py-4 text-sm md:text-base text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-sm resize-none"
                placeholder="Tell me about your project..."
                rows="5"
              ></textarea>
            </div>
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              className="bg-[#2D8CFF] text-white font-bold uppercase tracking-widest py-5 rounded-xl mt-4 hover:bg-[#1a6fd8] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_10px_20px_rgba(45,140,255,0.25)] hover:shadow-[0_15px_30px_rgba(45,140,255,0.35)]"
              type="submit"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
              {isSubmitting ? (
                <FiLoader className="text-sm animate-spin" />
              ) : (
                <FiSend className="text-sm" />
              )}
            </motion.button>
            <div aria-live="polite">
              {status.message && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-center text-sm font-medium mt-3 p-3 rounded-xl flex items-center justify-center gap-2 ${
                    status.type === "success"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 flex-col"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {status.type === "error" && <FiAlertCircle className="text-base flex-shrink-0" />}
                    <span>{status.message}</span>
                  </div>
                  {status.type === "error" && (
                    <span className="text-xs text-gray-600 dark:text-zinc-400 mt-1">
                      Direct Email:{" "}
                      <a href={`mailto:${email}`} className="text-[#2D8CFF] font-semibold underline">
                        {email}
                      </a>
                    </span>
                  )}
                </motion.div>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
