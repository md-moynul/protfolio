export const experience = {
  role: "Software Development Intern",
  company: "S&S Digital",
  location: "Hisar, Haryana, India",
  mode: "<Remote | On-site>",
  period: "July 2026",
  summary:
    "Completed a software development internship with an Excellent performance evaluation. Worked on two projects: the real-time chat backend of a travel companion app, then frontend development on a freelance marketplace MVP.",
  phases: [
    {
      title: "Phase 1: Backend developer (real-time chat)",
      project:
        "Travel companion app: group trips with real-time chat (paired frontend and backend interns)",
      duration: "<duration of phase 1, e.g. first week>",
      bullets: [
        "Set up a Socket.io server with JWT-authenticated connections and trip-based rooms (join and leave events)",
        "Built real-time chat events: send_message (saved to MongoDB and broadcast to the room), live location sharing, typing indicators and read receipts",
        "Implemented a message history REST endpoint with cursor-based pagination (before/limit) and fixed a hasMore pagination bug",
        "Tested with 3+ concurrent clients, documented all Socket.io events in the README, and submitted a pull request",
      ],
      stack: ["Node.js", "Fastify", "Socket.io", "MongoDB", "PostgreSQL", "Redis", "JWT"],
    },
    {
      title: "Phase 2: Frontend developer on a freelance marketplace MVP",
      project: "Freelance marketplace MVP (5-person team: 3 frontend, 2 backend)",
      duration: "Sprint 1, first two weeks of the project",
      bullets: [
        "Built the client project module: project posting form, projects list with status filter and pagination, and a project detail page with a status timeline",
        "Created reusable components (file upload, budget slider, status badge, empty state, skeleton loaders) and a typed Axios API service layer",
        "Used feature branches, pull requests and Conventional Commits, and integrated with a backend API built by teammates",
      ],
      stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "shadcn/ui", "Axios"],
    },
  ],
  certificate: {
    pdf: "/certificates/s-and-s-digital-internship.pdf",
    image: "/images/certificate-s-and-s-digital.webp",
    reference: "SS/INT/2026/001",
  },
};

export default experience;

