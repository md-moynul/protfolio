import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  clientPromise = Promise.reject(
    new Error("Please add your MONGODB_URI to .env")
  );
} else {
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClient) {
      global._mongoClient = new MongoClient(uri, options);
    }
    client = global._mongoClient;
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export { client };
export default clientPromise;

export async function getDb(dbName = process.env.MONGODB_DB || "portfolio") {
  const connectedClient = await clientPromise;
  return connectedClient.db(dbName);
}

export async function getProjectsCollection() {
  const db = await getDb();
  return db.collection("projects");
}
