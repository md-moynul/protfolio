"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "@/lib/auth-client";
import { FaGithub } from "react-icons/fa";
import {
  FiExternalLink,
  FiTrash2,
  FiEdit3,
  FiRefreshCw,
  FiLogOut,
  FiPlus,
  FiX,
  FiUploadCloud,
  FiCheck,
  FiLock,
  FiAlertCircle,
  FiShield,
} from "react-icons/fi";

const initialFormState = {
  title: "",
  desc: "",
  longDesc: "",
  tags: "",
  teacstack: "",
  starting_date: "",
  finished_date: "",
  link: "",
  githubFrontend: "",
  githubBackend: "",
  features: "",
  img: "",
};

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();

  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Form State
  const [formData, setFormData] = useState(initialFormState);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: "", text: "" });

  const userRole = session?.user?.role || "user";
  const adminEmail = (
    process.env.NEXT_PUBLIC_ADMIN_EMAIL || "mdmoynulislam.dev@gmail.com"
  ).trim().toLowerCase();
  const isAdmin =
    userRole === "admin" &&
    session?.user?.email?.toLowerCase() === adminEmail;

  // Fetch projects
  const loadProjects = async () => {
    setLoadingProjects(true);
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to load projects");
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    if (session?.user && isAdmin) {
      fetch("/api/projects")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load projects");
          return res.json();
        })
        .then((data) => {
          if (!ignore) {
            setProjects(data);
            setLoadingProjects(false);
          }
        })
        .catch((err) => {
          console.error(err);
          if (!ignore) setLoadingProjects(false);
        });
    }
    return () => {
      ignore = true;
    };
  }, [session, isAdmin]);

  // Open Edit Mode
  const handleEditClick = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || "",
      desc: project.desc || "",
      longDesc: project.longDesc || "",
      tags: Array.isArray(project.tags)
        ? project.tags.join(", ")
        : project.tags || "",
      teacstack: Array.isArray(project.teacstack)
        ? project.teacstack.join(", ")
        : project.teacstack || "",
      starting_date: project.starting_date || "",
      finished_date: project.finished_date || "",
      link: project.link || "",
      githubFrontend: project.githubFrontend || "",
      githubBackend: project.githubBackend || "",
      features: Array.isArray(project.features)
        ? project.features.join("\n")
        : project.features || "",
      img: project.img || "",
    });
    setFormMessage({ type: "", text: "" });
    setShowAddForm(true);
    window.scrollTo({ top: 100, behavior: "smooth" });
  };

  // Close Form
  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingProject(null);
    setFormData(initialFormState);
    setFormMessage({ type: "", text: "" });
  };

  // Handle direct file upload to ImgBB
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY?.trim();
    if (!apiKey) {
      setFormMessage({
        type: "error",
        text: "ImgBB API key is not configured in .env",
      });
      return;
    }

    setUploadingImage(true);
    setFormMessage({ type: "", text: "" });

    try {
      const uploadData = new FormData();
      uploadData.append("image", file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: uploadData,
      });

      const result = await res.json();
      if (result.success) {
        setFormData((prev) => ({ ...prev, img: result.data.url }));
        setFormMessage({
          type: "success",
          text: "Image uploaded successfully to ImgBB!",
        });
      } else {
        throw new Error(result.error?.message || "ImgBB upload failed");
      }
    } catch (err) {
      setFormMessage({
        type: "error",
        text: err?.message || "Failed to upload image",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  // Submit project (Add or Edit)
  const handleSubmitProject = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.desc) {
      setFormMessage({
        type: "error",
        text: "Title and description are required.",
      });
      return;
    }

    setSubmitting(true);
    setFormMessage({ type: "", text: "" });

    try {
      const payload = {
        title: formData.title,
        desc: formData.desc,
        longDesc: formData.longDesc || formData.desc,
        tags: formData.tags
          ? formData.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : ["Full-Stack"],
        teacstack: formData.teacstack
          ? formData.teacstack
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        starting_date: formData.starting_date,
        finished_date: formData.finished_date,
        link: formData.link,
        githubFrontend: formData.githubFrontend,
        githubBackend: formData.githubBackend,
        features: formData.features
          ? formData.features
              .split("\n")
              .map((f) => f.trim())
              .filter(Boolean)
          : [],
        img: formData.img || "/images/smart-health.png",
      };

      const isEditing = Boolean(editingProject);
      const url = isEditing
        ? `/api/projects/${editingProject.id ?? editingProject._id}`
        : "/api/projects";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to save project");
      }

      setFormMessage({
        type: "success",
        text: isEditing
          ? "Project updated successfully!"
          : "Project created successfully!",
      });

      handleCloseForm();
      loadProjects();
    } catch (err) {
      setFormMessage({
        type: "error",
        text: err?.message || "Failed to save project",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete project
  const handleDeleteProject = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete project");
      setProjects((prev) => prev.filter((p) => (p.id ?? p._id) !== id));
    } catch (err) {
      alert(err?.message || "Failed to delete project");
    }
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c0e14]">
        <div className="w-8 h-8 rounded-full border-2 border-[#2D8CFF] border-t-transparent animate-spin" />
      </div>
    );
  }

  // If user is not authenticated
  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-[#0c0e14]">
        <div className="glass-card rounded-3xl p-8 max-w-md w-full text-center border border-gray-200 dark:border-white/10 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-[#2D8CFF]/10 text-[#2D8CFF] flex items-center justify-center mx-auto mb-4">
            <FiLock className="text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Authentication Required
          </h2>
          <p className="text-sm text-gray-600 dark:text-zinc-400 mb-6">
            You must be logged in as an administrator to access the project management dashboard.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full py-3 px-4 rounded-xl bg-[#2D8CFF] hover:bg-[#1f73df] text-white text-sm font-bold transition-all shadow-md"
            >
              Go to Login
            </Link>
            <Link
              href="/"
              className="w-full py-2.5 px-4 rounded-xl text-gray-600 dark:text-zinc-400 text-xs font-semibold hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Back to Portfolio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If user is authenticated but not an admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-[#0c0e14]">
        <div className="glass-card rounded-3xl p-8 max-w-md w-full text-center border border-red-500/20 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
            <FiShield className="text-3xl" />
          </div>
          <div className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20 mb-3">
            Role: {userRole}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Restricted
          </h2>
          <p className="text-sm text-gray-600 dark:text-zinc-400 mb-6">
            Signed in as <strong>{session.user.email}</strong>. Only users with the <strong>admin</strong> role have permission to access this dashboard and add or modify projects.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={async () => {
                await signOut();
                router.push("/login");
              }}
              className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-all shadow-md"
            >
              Sign In with Another Account
            </button>
            <Link
              href="/"
              className="w-full py-2.5 px-4 rounded-xl text-gray-600 dark:text-zinc-400 text-xs font-semibold hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Back to Portfolio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/70 dark:bg-[#0c0e14] text-gray-900 dark:text-white transition-colors pb-24">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#12131a]/90 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-bold text-lg tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#2D8CFF] text-white flex items-center justify-center font-black text-sm shadow-md shadow-[#2D8CFF]/20">
                M
              </span>
              <span>Admin Dashboard</span>
            </Link>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Role: Admin
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 transition-colors"
            >
              <span>View Portfolio</span>
              <FiExternalLink className="text-xs" />
            </Link>

            {/* User Info */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200 dark:border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold leading-tight">{session.user.name || "Moynul"}</p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  {session.user.email}
                </p>
              </div>

              <button
                onClick={async () => {
                  await signOut();
                  router.push("/login");
                }}
                title="Sign Out"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 text-xs font-semibold transition-colors"
              >
                <FiLogOut className="text-xs" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Project Management
            </h1>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
              Add, edit, or remove projects displayed on your portfolio website.
            </p>
          </div>

          <button
            onClick={() => {
              if (showAddForm) {
                handleCloseForm();
              } else {
                setEditingProject(null);
                setFormData(initialFormState);
                setShowAddForm(true);
              }
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2D8CFF] hover:bg-[#1f73df] text-white text-sm font-bold shadow-lg shadow-[#2D8CFF]/20 transition-all hover:scale-[1.02]"
          >
            {showAddForm ? <FiX className="text-lg" /> : <FiPlus className="text-lg" />}
            <span>{showAddForm ? "Cancel" : "Add New Project"}</span>
          </button>
        </div>

        {/* Add / Edit Project Form */}
        {showAddForm && (
          <div className="mb-10 glass-card rounded-3xl p-6 sm:p-8 border border-gray-200/90 dark:border-white/10 shadow-2xl bg-white/90 dark:bg-[#12131a]/90">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200/60 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#2D8CFF]/10 text-[#2D8CFF] flex items-center justify-center">
                  {editingProject ? <FiEdit3 className="text-lg" /> : <FiPlus className="text-lg" />}
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    {editingProject ? `Edit: ${editingProject.title}` : "Add a New Project"}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">
                    {editingProject
                      ? "Update project details and click 'Save Changes'"
                      : "Fill in the technical details below to publish a new project"}
                  </p>
                </div>
              </div>

              {editingProject && (
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  Editing Mode
                </span>
              )}
            </div>

            {formMessage.text && (
              <div
                className={`mb-6 p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${
                  formMessage.type === "success"
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                    : "bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400"
                }`}
              >
                <FiAlertCircle className="text-base flex-shrink-0" />
                <span>{formMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmitProject} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Smart Health Pharmacy"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8CFF]/20 focus:border-[#2D8CFF]"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-2">
                    Category Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Full-Stack, Healthcare, AI, Next.js"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8CFF]/20 focus:border-[#2D8CFF]"
                  />
                </div>

                {/* Tech Stack */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-2">
                    Tech Stack (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Next.js 14, Node.js, Express.js, MongoDB"
                    value={formData.teacstack}
                    onChange={(e) =>
                      setFormData({ ...formData, teacstack: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8CFF]/20 focus:border-[#2D8CFF]"
                  />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-2">
                      Starting Date
                    </label>
                    <input
                      type="text"
                      placeholder="Jul 20, 2026"
                      value={formData.starting_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          starting_date: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8CFF]/20 focus:border-[#2D8CFF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-2">
                      Finished Date
                    </label>
                    <input
                      type="text"
                      placeholder="Present"
                      value={formData.finished_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          finished_date: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8CFF]/20 focus:border-[#2D8CFF]"
                    />
                  </div>
                </div>

                {/* Links */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-2">
                    Live Demo Link
                  </label>
                  <input
                    type="url"
                    placeholder="https://myproject.vercel.app"
                    value={formData.link}
                    onChange={(e) =>
                      setFormData({ ...formData, link: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8CFF]/20 focus:border-[#2D8CFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-2">
                    GitHub Frontend Repository
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/username/project-client"
                    value={formData.githubFrontend}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        githubFrontend: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8CFF]/20 focus:border-[#2D8CFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-2">
                    GitHub Backend Repository (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/username/project-server"
                    value={formData.githubBackend}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        githubBackend: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8CFF]/20 focus:border-[#2D8CFF]"
                  />
                </div>

                {/* Image Upload + URL */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-2">
                    Thumbnail Image (URL or Upload File)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://... or /images/..."
                      value={formData.img}
                      onChange={(e) =>
                        setFormData({ ...formData, img: e.target.value })
                      }
                      className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8CFF]/20 focus:border-[#2D8CFF]"
                    />
                    <label className="px-3.5 py-2.5 rounded-xl bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/15 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors flex-shrink-0">
                      <FiUploadCloud className="text-base" />
                      <span>{uploadingImage ? "Uploading..." : "Upload"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-2">
                  Short Description (Shown on Card) *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Brief summary of what the project does..."
                  value={formData.desc}
                  onChange={(e) =>
                    setFormData({ ...formData, desc: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8CFF]/20 focus:border-[#2D8CFF]"
                />
              </div>

              {/* Detailed Long Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-2">
                  Detailed Description (Shown in Details Modal)
                </label>
                <textarea
                  rows={3}
                  placeholder="In-depth explanation of problem solved, architecture, and user workflow..."
                  value={formData.longDesc}
                  onChange={(e) =>
                    setFormData({ ...formData, longDesc: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8CFF]/20 focus:border-[#2D8CFF]"
                />
              </div>

              {/* Key Features */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-2">
                  Key Features (One feature per line)
                </label>
                <textarea
                  rows={3}
                  placeholder={
                    "AI Prescription Analyzer\nOnline Prescription Management\n24/7 Pharmacist Chat"
                  }
                  value={formData.features}
                  onChange={(e) =>
                    setFormData({ ...formData, features: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8CFF]/20 focus:border-[#2D8CFF]"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200/60 dark:border-white/10">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[#2D8CFF] hover:bg-[#1f73df] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#2D8CFF]/20 transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <>
                      <FiCheck className="text-sm" />
                      <span>{editingProject ? "Update Project" : "Save Project"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Existing Projects List */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-white/10 shadow-xl bg-white/80 dark:bg-[#12131a]/80">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold">Existing Projects ({projects.length})</h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Live projects currently stored and presented in the database.
              </p>
            </div>
            <button
              onClick={loadProjects}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 flex items-center gap-2 transition-colors"
            >
              <FiRefreshCw className={`text-xs ${loadingProjects ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>

          {loadingProjects ? (
            <div className="py-16 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border-2 border-[#2D8CFF] border-t-transparent animate-spin" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16 text-gray-500 dark:text-zinc-400">
              <p>No projects found in the database.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-white/10 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                    <th className="pb-3 pr-4">Project</th>
                    <th className="pb-3 px-4">Tags</th>
                    <th className="pb-3 px-4">Date</th>
                    <th className="pb-3 px-4">Links</th>
                    <th className="pb-3 pl-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {projects.map((project) => {
                    const id = project.id ?? project._id;
                    return (
                      <tr
                        key={id}
                        className="hover:bg-gray-50/60 dark:hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-white/5 flex-shrink-0 relative border border-gray-200/50 dark:border-white/10">
                              <Image
                                src={project.img || "/images/smart-health.png"}
                                alt={project.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white leading-tight">
                                {project.title}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-zinc-400 line-clamp-1 max-w-xs mt-0.5">
                                {project.desc}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {project.tags?.slice(0, 3).map((tag, i) => (
                              <span
                                key={i}
                                className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2D8CFF]/10 text-[#2D8CFF]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-xs text-gray-500 dark:text-zinc-400 whitespace-nowrap">
                          {project.starting_date || "—"}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            {project.link ? (
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#2D8CFF]/10 text-[#2D8CFF] hover:bg-[#2D8CFF] hover:text-white transition-all shadow-sm"
                                title="Live Website"
                              >
                                <FiExternalLink className="text-xs" />
                                <span>Live</span>
                              </a>
                            ) : (
                              <span className="text-xs text-gray-400 dark:text-zinc-600">—</span>
                            )}

                            {(project.githubFrontend || project.github) && (
                              <a
                                href={project.githubFrontend || project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-all border border-gray-200 dark:border-white/10"
                                title="GitHub Repository"
                              >
                                <FaGithub className="text-xs" />
                                <span>Code</span>
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="py-4 pl-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            {/* Edit Button */}
                            <button
                              onClick={() => handleEditClick(project)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors"
                              title="Edit Project"
                            >
                              <FiEdit3 className="text-xs" />
                              <span>Edit</span>
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteProject(id, project.title)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors"
                              title="Delete Project"
                            >
                              <FiTrash2 className="text-xs" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
