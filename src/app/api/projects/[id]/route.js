import { getProjectsCollection } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";
import { isAdminSession } from "@/lib/admin";

function buildIdQuery(id) {
  if (ObjectId.isValid(id)) {
    return {
      $or: [
        { _id: new ObjectId(id) },
        { id: isNaN(Number(id)) ? id : Number(id) },
      ],
    };
  }
  return { id: isNaN(Number(id)) ? id : Number(id) };
}

async function verifyAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return isAdminSession(session);
}

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const collection = await getProjectsCollection();
    const project = await collection.findOne(buildIdQuery(id));

    if (!project) {
      return Response.json({ error: "Project not found" }, { status: 404 });
    }

    return Response.json({
      ...project,
      _id: project._id?.toString(),
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return Response.json(
        { error: "Forbidden: Only administrators can update projects." },
        { status: 403 }
      );
    }

    const body = await request.json();
    if (!body || typeof body !== "object") {
      return Response.json({ error: "Invalid request body" }, { status: 400 });
    }

    // Explicit allowed fields list (protects against mass assignment)
    const allowedStringFields = [
      "title",
      "desc",
      "longDesc",
      "starting_date",
      "finished_date",
      "link",
      "githubFrontend",
      "githubBackend",
      "github",
      "img",
    ];
    const allowedArrayFields = ["tags", "teacstack", "features"];

    const updateDoc = {};

    for (const field of allowedStringFields) {
      if (field in body) {
        if (typeof body[field] === "string") {
          updateDoc[field] = body[field].trim();
        } else if (body[field] === null || body[field] === undefined) {
          updateDoc[field] = "";
        } else {
          return Response.json(
            { error: `Invalid type for field '${field}': expected string` },
            { status: 400 }
          );
        }
      }
    }

    for (const field of allowedArrayFields) {
      if (field in body) {
        if (Array.isArray(body[field])) {
          updateDoc[field] = body[field]
            .map((item) => (typeof item === "string" ? item.trim() : String(item)))
            .filter((item) => item.length > 0);
        } else {
          return Response.json(
            { error: `Invalid type for field '${field}': expected array of strings` },
            { status: 400 }
          );
        }
      }
    }

    if (Object.keys(updateDoc).length === 0) {
      return Response.json(
        { error: "No valid fields provided for update" },
        { status: 400 }
      );
    }

    updateDoc.updatedAt = new Date();

    const collection = await getProjectsCollection();
    const result = await collection.updateOne(buildIdQuery(id), {
      $set: updateDoc,
    });

    if (result.matchedCount === 0) {
      return Response.json({ error: "Project not found" }, { status: 404 });
    }

    return Response.json({
      success: true,
      message: "Project updated successfully",
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return Response.json(
        { error: "Forbidden: Only administrators can delete projects." },
        { status: 403 }
      );
    }

    const collection = await getProjectsCollection();
    const result = await collection.deleteOne(buildIdQuery(id));

    if (result.deletedCount === 0) {
      return Response.json({ error: "Project not found" }, { status: 404 });
    }

    return Response.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
