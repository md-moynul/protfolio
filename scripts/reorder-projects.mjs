import { MongoClient } from "mongodb";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function syncMongo() {
  const jsonPath = path.resolve(__dirname, "..", "public", "data", "projects.json");
  const rawData = await fs.readFile(jsonPath, "utf-8");
  const projects = JSON.parse(rawData);

  console.log(`Loaded ${projects.length} projects from projects.json`);
  projects.forEach((p) => {
    console.log(`[id: ${p.id}] ${p.title}`);
  });

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || "portfolio";

  if (!uri) {
    console.error("No MONGODB_URI found in process.env");
    process.exit(1);
  }

  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
  try {
    await client.connect();
    console.log(`Connected to MongoDB (${dbName})`);
    const db = client.db(dbName);
    const collection = db.collection("projects");

    for (const proj of projects) {
      const filter = {
        title: { $regex: new RegExp(`^${proj.title.trim()}$`, "i") },
      };
      const updateDoc = {
        $set: {
          id: proj.id,
          updatedAt: new Date(),
        },
      };
      const res = await collection.updateOne(filter, updateDoc);
      console.log(`MongoDB [id: ${proj.id}] "${proj.title}": matched ${res.matchedCount}, modified ${res.modifiedCount}`);
    }

    const verifyList = await collection.find({}).sort({ id: 1 }).toArray();
    console.log(`\n=== CURRENT MONGODB PROJECTS (${verifyList.length}) ===`);
    verifyList.forEach((p) => {
      console.log(`[id: ${p.id}] ${p.title}`);
    });

    console.log("\n✅ All projects successfully ordered and synced in MongoDB!");
  } catch (err) {
    console.error("MongoDB update error:", err.message);
  } finally {
    await client.close();
  }
}

syncMongo();
