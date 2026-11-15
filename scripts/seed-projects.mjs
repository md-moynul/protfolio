import { MongoClient } from "mongodb";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seed() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || "portfolio";

  if (!uri) {
    console.error("❌ MONGODB_URI environment variable is missing.");
    console.error("Run with: node --env-file=.env scripts/seed-projects.mjs");
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log(`Connected to MongoDB (db: ${dbName})`);

    const db = client.db(dbName);
    const collection = db.collection("projects");

    const existingCount = await collection.countDocuments();
    if (existingCount > 0) {
      console.log(
        `ℹ️ Collection "projects" already contains ${existingCount} documents. Skipping seed to prevent overwrite.`
      );
      process.exit(0);
    }

    const jsonPath = path.resolve(__dirname, "..", "public", "data", "projects.json");
    const rawData = await fs.readFile(jsonPath, "utf-8");
    const projects = JSON.parse(rawData);

    if (!Array.isArray(projects) || projects.length === 0) {
      console.error("❌ projects.json is empty or not an array.");
      process.exit(1);
    }

    const projectsToInsert = projects.map((p) => ({
      ...p,
      createdAt: new Date(),
    }));

    const result = await collection.insertMany(projectsToInsert);
    console.log(
      `✅ Successfully seeded ${result.insertedCount} projects into MongoDB "projects" collection!`
    );
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seed();

