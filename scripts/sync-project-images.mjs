import { MongoClient } from "mongodb";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function normalize(img) {
  if (!img || typeof img !== "string") return "/images/smart-health.webp";
  const trimmed = img.trim();
  if (!trimmed) return "/images/smart-health.webp";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:")) {
    return trimmed;
  }
  let p = trimmed;
  if (!p.startsWith("/")) p = "/" + p;
  if (p === "/dragon-news.png" || p === "/dragon-news.webp") return "/images/dragon-news.webp";
  if (!p.startsWith("/images/")) p = `/images${p}`;
  p = p.replace(/\.(png|jpe?g)$/i, ".webp");
  return p;
}

async function syncImages() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || "portfolio";

  if (!uri) {
    console.error("❌ MONGODB_URI environment variable is missing.");
    console.error("Run with: node --env-file=.env scripts/sync-project-images.mjs");
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log(`Connected to MongoDB (db: ${dbName})`);

    const db = client.db(dbName);
    const collection = db.collection("projects");

    const docs = await collection.find({}).toArray();
    console.log(`Found ${docs.length} projects in collection "projects".`);

    if (docs.length === 0) {
      console.log("No projects in database to update.");
      process.exit(0);
    }

    let updatedCount = 0;
    for (const doc of docs) {
      const currentImg = doc.img || doc.image;
      const normalizedImg = normalize(currentImg);

      if (currentImg !== normalizedImg) {
        await collection.updateOne(
          { _id: doc._id },
          { $set: { img: normalizedImg } }
        );
        console.log(`Updated project "${doc.title}": ${currentImg} -> ${normalizedImg}`);
        updatedCount++;
      }
    }

    console.log(`✅ Successfully normalized ${updatedCount} project image URLs in MongoDB.`);
  } catch (error) {
    console.error("❌ Image sync failed:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

syncImages();

