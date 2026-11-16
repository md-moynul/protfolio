import { MongoClient } from "mongodb";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function sync() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || "portfolio";

  if (!uri) {
    console.error("MONGODB_URI is missing.");
    process.exit(1);
  }

  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });

  try {
    await client.connect();
    console.log(`Connected to MongoDB (${dbName})`);
    const db = client.db(dbName);
    const collection = db.collection("projects");

    const mongoProjects = await collection.find({}).sort({ id: 1 }).toArray();
    console.log(`\n=== CURRENT MONGODB PROJECTS (${mongoProjects.length}) ===`);
    mongoProjects.forEach((p, idx) => {
      console.log(`[${idx}] id: ${p.id}, title: "${p.title}" (_id: ${p._id})`);
    });

    // ShopNest definition
    const shopnestData = {
      title: "ShopNest",
      tags: ["Full-Stack", "Team Project", "E-commerce", "React"],
      teacstack: [
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Node.js",
        "Express.js",
        "MongoDB",
        "JWT",
        "Nodemailer",
      ],
      desc: "A collaborative full-stack e-commerce platform with dynamic cataloging, cart workflows, and secure JWT auth.",
      longDesc:
        "ShopNest is a modern full-stack e-commerce web platform developed as a collaborative team project. It provides an intuitive online shopping environment featuring dynamic product cataloging, category filtering, cart management, and streamlined checkout workflows. The backend is architected with Node.js, Express, and MongoDB, secured via JWT-based user authentication and authorization. Automated email notifications powered by Nodemailer handle user registration and purchase confirmations. MD Moynul contributed significantly to the frontend architecture and user interface on the 'moynul' branch, implementing responsive UI components and state management.",
      starting_date: "Aug 2026",
      finished_date: "Sep 2026",
      link: "https://shopnest-frontend-vo3a.onrender.com/",
      githubFrontend: "https://github.com/Farhadmu/shopnest-frontend/tree/moynul",
      githubBackend: "https://github.com/Farhadmu/shopnest-backend",
      features: [
        "Team Collaborative Development (Branch: moynul)",
        "Secure JWT User Authentication & Authorization",
        "Dynamic Product Catalog & Category Filtering",
        "Cart Management & Seamless Checkout Workflow",
        "Automated Email Notifications via Nodemailer",
        "Fully Responsive UI built with React & Tailwind CSS",
      ],
      img: "/images/shopnest.webp",
    };

    // Check if ShopNest is already in MongoDB
    const existingShopnest = await collection.findOne({
      title: { $regex: /^shopnest$/i },
    });

    let assignedId;
    if (existingShopnest) {
      assignedId = existingShopnest.id;
      await collection.updateOne(
        { _id: existingShopnest._id },
        { $set: { ...shopnestData, id: assignedId, updatedAt: new Date() } }
      );
      console.log(`\nUpdated existing ShopNest in MongoDB (id: ${assignedId})`);
    } else {
      // Find max ID
      const maxId = mongoProjects.reduce((max, p) => (typeof p.id === "number" && p.id > max ? p.id : max), -1);
      assignedId = maxId + 1;
      const insertResult = await collection.insertOne({
        ...shopnestData,
        id: assignedId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`\nInserted new ShopNest into MongoDB (id: ${assignedId}, _id: ${insertResult.insertedId})`);
    }

    // Fetch the updated list of all projects from MongoDB
    const allUpdatedProjects = await collection.find({}).sort({ id: 1 }).toArray();
    console.log(`\n=== UPDATED MONGODB PROJECTS (${allUpdatedProjects.length}) ===`);
    allUpdatedProjects.forEach((p, idx) => {
      console.log(`[${idx}] id: ${p.id}, title: "${p.title}"`);
    });

    // Write this EXACT cleaned list to public/data/projects.json so deleted projects are removed from JSON too!
    const jsonPath = path.resolve(__dirname, "..", "public", "data", "projects.json");
    const cleanJsonData = allUpdatedProjects.map((p) => {
      const { _id, createdAt, updatedAt, ...rest } = p;
      return rest;
    });
    await fs.writeFile(jsonPath, JSON.stringify(cleanJsonData, null, 2), "utf-8");
    console.log(`\n✅ Successfully synced ${cleanJsonData.length} projects to public/data/projects.json!`);

  } catch (err) {
    console.error("Sync error:", err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

sync();
