import { getProjectsCollection } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";

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
  const adminEmail = (
    process.env.ADMIN_EMAIL || "mdmoynulislam.dev@gmail.com"
  ).trim().toLowerCase();
  return (
    session?.user?.role === "admin" &&
    session?.user?.email?.toLowerCase() === adminEmail
  );
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
    const collection = await getProjectsCollection();

    const updateDoc = { ...body, updatedAt: new Date() };
    delete updateDoc._id; // _id is immutable in MongoDB

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
