import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Education from "@/components/Education";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import About from "@/components/About";
import InteractiveBackground from "@/components/InteractiveBackground";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getProjectsCollection } from "@/lib/mongodb";
import { promises as fs } from "fs";
import path from "path";

// ISR: revalidate every 60 seconds
export const revalidate = 60;

function normalizeImg(img) {
  if (!img || typeof img !== "string") return "/images/smart-health.webp";
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  if (img === "/dragon-news.png") return "/images/dragon-news.webp";
  if (img.endsWith(".png")) return img.replace(/\.png$/, ".webp");
  return img;
}

async function getInitialProjects() {
  try {
    const collection = await getProjectsCollection();
    const docs = await collection.find({}).sort({ id: 1 }).toArray();
    if (docs && docs.length > 0) {
      return docs.map((p) => ({
        ...p,
        _id: p._id?.toString(),
        id: p.id !== undefined ? p.id : p._id?.toString(),
        img: normalizeImg(p.img || p.image),
      }));
    }
  } catch (err) {
    console.warn(
      "MongoDB query in page.js failed, falling back to local projects.json:",
      err?.message
    );
  }

  try {
    const filePath = path.join(process.cwd(), "public", "data", "projects.json");
    const data = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(data);
    return Array.isArray(parsed)
      ? parsed.map((p) => ({ ...p, img: normalizeImg(p.img || p.image) }))
      : [];
  } catch (err) {
    console.error("Failed to load local projects.json in page.js:", err);
    return [];
  }
}

export default async function Home() {
  const initialProjects = await getInitialProjects();

  return (
    <main className="relative min-h-screen">
      <InteractiveBackground />
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects initialProjects={initialProjects} />
      <Education />
      <Contact />
      <Footer />
    </main>
  );
}
