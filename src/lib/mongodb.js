import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!uri) {
  clientPromise = Promise.reject(new Error("Please add your MONGODB_URI to .env"));
} else {
  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable to preserve the client across module reloads
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, avoid global variable
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export default clientPromise;

export async function getDb(dbName = process.env.MONGODB_DB || "portfolio") {
  const connectedClient = await clientPromise;
  return connectedClient.db(dbName);
}

export async function getProjectsCollection() {
  const db = await getDb();
  return db.collection("projects");
}

