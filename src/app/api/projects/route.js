import { getProjectsCollection } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { promises as fs } from "fs";
import path from "path";

async function getLocalProjects() {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "projects.json");
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Failed to read local projects.json fallback:", err);
    return [];
  }
}

export async function GET() {
  try {
    const collection = await getProjectsCollection();
    let projects = await collection.find({}).sort({ id: 1 }).toArray();

    // Auto-seed if the collection in MongoDB is currently empty
    if (!projects || projects.length === 0) {
      const localProjects = await getLocalProjects();
      if (localProjects.length > 0) {
        // Remove explicit string IDs if not desired, or insert as is
        const projectsToInsert = localProjects.map((p) => ({
          ...p,
          createdAt: new Date(),
        }));
        await collection.insertMany(projectsToInsert);
        projects = await collection.find({}).sort({ id: 1 }).toArray();
      }
    }

    // Format _id as string for standard JSON serialization
    const formatted = projects.map((p) => ({
      ...p,
      _id: p._id?.toString(),
      id: p.id !== undefined ? p.id : p._id?.toString(),
    }));

    return Response.json(formatted, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.warn("MongoDB connection failed or unavailable, falling back to local projects.json:", error?.message);
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
    // Check admin authorization
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const isAdmin =
      session?.user?.role === "admin" ||
      (adminEmail && session?.user?.email?.toLowerCase() === adminEmail);

    if (!isAdmin) {
      return Response.json(
        { error: "Forbidden: Only administrators can add projects." },
        { status: 403 }
      );
    }

    const body = await request.json();

    if (!body || !body.title) {
      return Response.json({ error: "Title is required" }, { status: 400 });
    }

    const collection = await getProjectsCollection();

    // Determine next id
    let nextId = body.id;
    if (nextId === undefined || nextId === null) {
      const highestProject = await collection
        .find({ id: { $exists: true } })
        .sort({ id: -1 })
        .limit(1)
        .toArray();
      nextId =
        highestProject.length > 0 && typeof highestProject[0].id === "number"
          ? highestProject[0].id + 1
          : Date.now();
    }

    const newProject = {
      id: nextId,
      title: body.title,
      tags: Array.isArray(body.tags) ? body.tags : [],
      teacstack: Array.isArray(body.teacstack) ? body.teacstack : [],
      desc: body.desc || "",
      longDesc: body.longDesc || "",
      starting_date: body.starting_date || "",
      finished_date: body.finished_date || "",
      link: body.link || "",
      githubFrontend: body.githubFrontend || "",
      githubBackend: body.githubBackend || "",
      github: body.github || "",
      features: Array.isArray(body.features) ? body.features : [],
      img: body.img || "/images/smart-health.png",
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

