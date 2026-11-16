import { MongoClient } from "mongodb";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function syncShopnest() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || "portfolio";

  if (!uri) {
    console.warn("⚠️ MONGODB_URI is not set. Skipped remote MongoDB sync.");
    return;
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log(`Connected to MongoDB (${dbName})`);
    const db = client.db(dbName);
    const collection = db.collection("projects");

    const jsonPath = path.resolve(__dirname, "..", "public", "data", "projects.json");
    const raw = await fs.readFile(jsonPath, "utf-8");
    const projects = JSON.parse(raw);
    const shopnest = projects.find((p) => p.title.toLowerCase() === "shopnest");

    if (!shopnest) {
      console.error("ShopNest not found in projects.json");
      return;
    }

    const res = await collection.updateOne(
      { title: { $regex: /^shopnest$/i } },
      { $set: { ...shopnest, updatedAt: new Date() } },
      { upsert: true }
    );

    console.log("✅ ShopNest synced to MongoDB:", res.upsertedCount ? "Inserted" : "Updated");
  } catch (err) {
    console.warn("Could not sync to MongoDB directly:", err.message);
  } finally {
    await client.close();
  }
}

syncShopnest();

