import { getProjectsCollection } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { promises as fs } from "fs";
import path from "path";
import { isAdminSession } from "@/lib/admin";
import { normalizeProjectImg } from "@/lib/project-image";

async function getLocalProjects() {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "projects.json");
    const data = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(data);
    return Array.isArray(parsed)
      ? parsed.map((p) => ({ ...p, img: normalizeProjectImg(p.img || p.image) }))
      : [];
  } catch (err) {
    console.error("Failed to read local projects.json fallback:", err);
    return [];
  }
}

export async function GET() {
  try {
    const collection = await getProjectsCollection();
    const projects = await collection.find({}).sort({ id: 1 }).toArray();

    // If MongoDB collection is empty, fall back to projects.json without writing to DB
    if (!projects || projects.length === 0) {
      const localProjects = await getLocalProjects();
      return Response.json(localProjects, {
        status: 200,
        headers: {
          "X-Data-Source": "fallback-local",
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      });
    }

    // Format _id as string for standard JSON serialization
    const formatted = projects.map((p) => ({
      ...p,
      _id: p._id?.toString(),
      id: p.id !== undefined ? p.id : p._id?.toString(),
      img: normalizeProjectImg(p.img || p.image),
    }));

    return Response.json(formatted, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.warn(
      "MongoDB connection failed or unavailable, falling back to local projects.json:",
      error?.message
    );
    const fallbackProjects = await getLocalProjects();
    return Response.json(fallbackProjects, {
      status: 200,
      headers: {
        "X-Data-Source": "fallback-local",
      },
    });
  }
}

export async function POST(request) {
  try {
    // Check admin authorization via shared helper
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!isAdminSession(session)) {
      return Response.json(
        { error: "Forbidden: Only administrators can add projects." },
        { status: 403 }
      );
    }

    const body = await request.json();

    if (!body || typeof body !== "object") {
      return Response.json({ error: "Invalid request body" }, { status: 400 });
    }

    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title) {
      return Response.json({ error: "Title is required" }, { status: 400 });
    }

    const collection = await getProjectsCollection();

    // Determine next integer id
    let nextId = body.id;
    if (nextId === undefined || nextId === null || isNaN(Number(nextId))) {
      const highestProject = await collection
        .find({ id: { $exists: true } })
        .sort({ id: -1 })
        .limit(1)
        .toArray();
      nextId =
        highestProject.length > 0 && typeof highestProject[0].id === "number"
          ? highestProject[0].id + 1
          : Date.now();
    } else {
      nextId = Number(nextId);
    }

    const sanitizeString = (val) => (typeof val === "string" ? val.trim() : "");
    const sanitizeArray = (val) =>
      Array.isArray(val)
        ? val
            .map((item) => (typeof item === "string" ? item.trim() : String(item)))
            .filter((item) => item.length > 0)
        : [];

    const newProject = {
      id: nextId,
      title,
      tags: sanitizeArray(body.tags),
      teacstack: sanitizeArray(body.teacstack),
      desc: sanitizeString(body.desc),
      longDesc: sanitizeString(body.longDesc),
      starting_date: sanitizeString(body.starting_date),
      finished_date: sanitizeString(body.finished_date),
      link: sanitizeString(body.link),
      githubFrontend: sanitizeString(body.githubFrontend),
      githubBackend: sanitizeString(body.githubBackend),
      github: sanitizeString(body.github),
      features: sanitizeArray(body.features),
      img: sanitizeString(body.img) || "/images/smart-health.webp",
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newProject);

    return Response.json(
      {
        success: true,
        project: {
          ...newProject,
          _id: result.insertedId.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create project:", error);
    return Response.json(
      { error: error?.message || "Failed to create project" },
      { status: 500 }
    );
  }
}
